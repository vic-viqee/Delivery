from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User, Rider, Order, OrderStatus
from app.schemas.schemas import RiderResponse, RiderCreate, LocationUpdate

router = APIRouter()


@router.get("", response_model=List[RiderResponse])
def get_riders(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    riders = (
        db.query(Rider).filter(Rider.is_online == True).offset(skip).limit(limit).all()
    )
    return riders


@router.get("/me", response_model=RiderResponse)
def get_my_rider_profile(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    rider = db.query(Rider).filter(Rider.user_id == current_user.id).first()

    if not rider:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Rider profile not found"
        )

    return rider


@router.post("", response_model=RiderResponse)
def create_rider_profile(
    rider_data: RiderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing = db.query(Rider).filter(Rider.user_id == current_user.id).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Rider profile already exists",
        )

    rider = Rider(user_id=current_user.id, name=rider_data.name, phone=rider_data.phone)
    db.add(rider)
    db.commit()
    db.refresh(rider)
    return rider


@router.patch("/me/status", response_model=RiderResponse)
def toggle_online_status(
    status_data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    rider = db.query(Rider).filter(Rider.user_id == current_user.id).first()

    if not rider:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Rider profile not found"
        )

    rider.is_online = status_data.get("is_online", not rider.is_online)
    db.commit()
    db.refresh(rider)
    return rider


@router.patch("/me/location", response_model=RiderResponse)
def update_location(
    location_data: LocationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    rider = db.query(Rider).filter(Rider.user_id == current_user.id).first()

    if not rider:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Rider profile not found"
        )

    rider.current_latitude = location_data.latitude
    rider.current_longitude = location_data.longitude
    db.commit()
    db.refresh(rider)
    return rider


@router.get("/orders/available", response_model=List[dict])
def get_available_orders(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    orders = (
        db.query(Order)
        .filter(Order.status == OrderStatus.READY, Order.rider_id.is_(None))
        .order_by(Order.created_at.asc())
        .all()
    )

    return [
        {
            "id": order.id,
            "seller_name": order.seller.name if order.seller else "Unknown",
            "address": {
                "name": order.address.name,
                "landmark": order.address.landmark,
                "neighborhood": order.address.neighborhood,
                "latitude": order.address.latitude,
                "longitude": order.address.longitude,
                "plus_code": order.address.plus_code,
                "nearest_stage": order.address.nearest_stage,
                "voice_note_url": order.address.voice_note_url,
            },
            "total": order.total,
            "created_at": order.created_at.isoformat(),
            "items": [item.product.name for item in order.items]
        }
        for order in orders
    ]


@router.post("/orders/{order_id}/accept", response_model=dict)
def accept_order(
    order_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    rider = db.query(Rider).filter(Rider.user_id == current_user.id).first()

    if not rider:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Rider profile not found"
        )

    order = db.query(Order).filter(Order.id == order_id).first()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Order not found"
        )

    if order.rider_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order already assigned to another rider",
        )

    order.rider_id = rider.id
    order.status = OrderStatus.PICKED_UP
    db.commit()

    return {"message": "Order accepted", "order_id": order.id, "rider_id": rider.id}


@router.get("/orders/my", response_model=List[dict])
def get_my_orders(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    rider = db.query(Rider).filter(Rider.user_id == current_user.id).first()

    if not rider:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Rider profile not found"
        )

    orders = (
        db.query(Order)
        .filter(Order.rider_id == rider.id)
        .order_by(Order.created_at.desc())
        .all()
    )

    return [
        {
            "id": order.id,
            "seller_name": order.seller.name if order.seller else "Unknown",
            "status": order.status.value,
            "total": order.total,
            "created_at": order.created_at.isoformat(),
            "address": {
                "name": order.address.name,
                "landmark": order.address.landmark,
                "latitude": order.address.latitude,
                "longitude": order.address.longitude,
            },
        }
        for order in orders
    ]


@router.patch("/orders/{order_id}/status", response_model=dict)
def update_order_status(
    order_id: str,
    status_data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    rider = db.query(Rider).filter(Rider.user_id == current_user.id).first()

    if not rider:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Rider profile not found"
        )

    order = (
        db.query(Order).filter(Order.id == order_id, Order.rider_id == rider.id).first()
    )

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found or not assigned to you",
        )

    new_status = status_data.get("status")
    if new_status:
        try:
            order.status = OrderStatus(new_status)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid status"
            )

    db.commit()

    return {
        "message": "Status updated",
        "order_id": order.id,
        "status": order.status.value,
    }
