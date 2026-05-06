from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User, Address
from app.schemas.schemas import AddressCreate, AddressResponse

router = APIRouter()


@router.get("", response_model=List[AddressResponse])
def get_addresses(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    addresses = db.query(Address).filter(Address.user_id == current_user.id).all()
    return addresses


@router.post("", response_model=AddressResponse)
def create_address(
    address_data: AddressCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if address_data.is_default:
        db.query(Address).filter(
            Address.user_id == current_user.id, Address.is_default == True
        ).update({"is_default": False})

    address = Address(
        user_id=current_user.id,
        **address_data.model_dump()
    )
    db.add(address)
    db.commit()
    db.refresh(address)
    return address


@router.get("/{address_id}", response_model=AddressResponse)
def get_address(
    address_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    address = (
        db.query(Address)
        .filter(Address.id == address_id, Address.user_id == current_user.id)
        .first()
    )

    if not address:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Address not found"
        )

    return address


@router.patch("/{address_id}", response_model=AddressResponse)
def update_address(
    address_id: str,
    address_data: AddressCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    address = (
        db.query(Address)
        .filter(Address.id == address_id, Address.user_id == current_user.id)
        .first()
    )

    if not address:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Address not found"
        )

    if address_data.is_default and not address.is_default:
        db.query(Address).filter(
            Address.user_id == current_user.id, Address.is_default == True
        ).update({"is_default": False})

    for key, value in address_data.model_dump().items():
        setattr(address, key, value)

    db.commit()
    db.refresh(address)
    return address


@router.delete("/{address_id}")
def delete_address(
    address_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    address = (
        db.query(Address)
        .filter(Address.id == address_id, Address.user_id == current_user.id)
        .first()
    )

    if not address:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Address not found"
        )

    db.delete(address)
    db.commit()
    return {"message": "Address deleted successfully"}
