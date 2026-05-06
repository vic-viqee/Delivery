from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User, Order, OrderItem, OrderStatus, Product, Address, Seller
from app.schemas.schemas import OrderCreate, OrderResponse, OrderItemResponse

router = APIRouter()

DELIVERY_FEE = 50.0

@router.get("/seller/me", response_model=List[OrderResponse])
def get_seller_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role.value != "SELLER":
        raise HTTPException(status_code=403, detail="Access denied")
    
    seller = db.query(Seller).filter(Seller.phone == current_user.phone).first()
    if not seller:
        return []

    orders = (
        db.query(Order)
        .filter(Order.seller_id == seller.id)
        .order_by(Order.created_at.desc())
        .all()
    )

    return [_order_to_response(order) for order in orders]

@router.get("", response_model=List[OrderResponse])
def get_orders(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    orders = (
        db.query(Order)
        .filter(Order.user_id == current_user.id)
        .order_by(Order.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    return [_order_to_response(order) for order in orders]


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    order = (
        db.query(Order)
        .filter(Order.id == order_id, Order.user_id == current_user.id)
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Order not found"
        )

    return _order_to_response(order)


@router.post("", response_model=OrderResponse)
def create_order(
    order_data: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    address = (
        db.query(Address)
        .filter(Address.id == order_data.address_id, Address.user_id == current_user.id)
        .first()
    )

    if not address:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid address"
        )

    if not order_data.items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order must have at least one item",
        )

    first_product = (
        db.query(Product).filter(Product.id == order_data.items[0].product_id).first()
    )

    if not first_product:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid product"
        )

    subtotal = 0.0
    order_items = []

    for item in order_data.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Product {item.product_id} not found",
            )
        if product.stock < item.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient stock for {product.name}",
            )

        item_total = product.price * item.quantity
        subtotal += item_total
        order_items.append(
            {
                "product": product,
                "quantity": item.quantity,
                "price": product.price,
                "total": item_total,
            }
        )

        product.stock -= item.quantity

    total = subtotal + DELIVERY_FEE

    estimated_delivery = datetime.utcnow()
    estimated_delivery = estimated_delivery.replace(
        hour=18, minute=0, second=0, microsecond=0
    )

    order = Order(
        user_id=current_user.id,
        seller_id=first_product.seller_id,
        address_id=address.id,
        status=OrderStatus.PENDING,
        subtotal=subtotal,
        delivery_fee=DELIVERY_FEE,
        total=total,
        payment_method=order_data.payment_method,
        notes=order_data.notes,
        estimated_delivery=estimated_delivery,
    )
    db.add(order)
    db.flush()

    for item_data in order_items:
        order_item = OrderItem(
            order_id=order.id,
            product_id=item_data["product"].id,
            price=item_data["price"],
            quantity=item_data["quantity"],
            total=item_data["total"],
        )
        db.add(order_item)

    db.commit()
    db.refresh(order)

    return _order_to_response(order)


@router.patch("/{order_id}/status", response_model=OrderResponse)
def update_order_status(
    order_id: str,
    status_data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    order = db.query(Order).filter(Order.id == order_id).first()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Order not found"
        )

    try:
        new_status = OrderStatus(status_data.get("status"))
        order.status = new_status
        db.commit()
        db.refresh(order)
        return _order_to_response(order)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid status"
        )


def _order_to_response(order: Order) -> OrderResponse:
    items = []
    for item in order.items:
        items.append(
            OrderItemResponse(
                id=item.id,
                product_id=item.product_id,
                product_name=item.product.name if item.product else "Unknown",
                price=item.price,
                quantity=item.quantity,
                total=item.total,
            )
        )

    return OrderResponse(
        id=order.id,
        user_id=order.user_id,
        seller_id=order.seller_id,
        seller_name=order.seller.name if order.seller else "Unknown",
        items=items,
        address={
            "id": order.address.id,
            "user_id": order.address.user_id,
            "name": order.address.name,
            "latitude": order.address.latitude,
            "longitude": order.address.longitude,
            "photo_url": order.address.photo_url,
            "landmark": order.address.landmark,
            "instructions": order.address.instructions,
            "neighborhood": order.address.neighborhood,
            "is_default": order.address.is_default,
            "created_at": order.address.created_at,
        },
        status=order.status.value,
        subtotal=order.subtotal,
        delivery_fee=order.delivery_fee,
        total=order.total,
        rider_id=order.rider_id,
        rider_name=order.rider.name if order.rider else None,
        created_at=order.created_at,
        estimated_delivery=order.estimated_delivery,
    )
