from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    phone: str = Field(..., min_length=10, max_length=15)
    name: Optional[str] = None


class UserCreate(UserBase):
    password: str = Field(..., min_length=4)


class UserLogin(BaseModel):
    phone: str
    password: str


class UserResponse(UserBase):
    id: str
    role: str
    avatar_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class TurnInstructionInput(BaseModel):
    turn_number: int = Field(..., ge=1, le=3)
    direction: str
    at_landmark: str


class AddressBase(BaseModel):
    name: str
    latitude: float
    longitude: float
    landmark: str
    photo_url: Optional[str] = None
    instructions: Optional[str] = None
    neighborhood: Optional[str] = None
    is_default: bool = False

    # NEW - Edge cases for Kenyan addressing
    address_type: Optional[str] = "house"
    apartment_name: Optional[str] = None
    gate_colour: Optional[str] = None
    floor_level: Optional[str] = None
    turn_instructions: Optional[list[TurnInstructionInput]] = None
    leave_at_neighbour: Optional[bool] = False
    neighbour_name: Optional[str] = None
    call_before_delivery: Optional[bool] = False
    special_notes: Optional[str] = None

    # HYPER-LOCAL IMPROVEMENTS
    nearest_stage: Optional[str] = None
    plus_code: Optional[str] = None
    voice_note_url: Optional[str] = None


class AddressCreate(AddressBase):
    pass


class AddressResponse(AddressBase):
    id: str
    user_id: str
    created_at: datetime

    class Config:
        from_attributes = True


class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float = Field(..., gt=0)
    original_price: Optional[float] = None
    image_url: Optional[str] = None
    category: Optional[str] = None
    stock: int = 0
    unit: str = "each"


class ProductCreate(ProductBase):
    seller_id: str
    category_id: Optional[str] = None


class ProductResponse(ProductBase):
    id: str
    seller_id: str
    seller_name: Optional[str] = None
    rating: Optional[float] = None
    review_count: Optional[int] = None

    class Config:
        from_attributes = True


class CategoryResponse(BaseModel):
    id: str
    name: str
    slug: str
    icon: Optional[str] = None
    image_url: Optional[str] = None

    class Config:
        from_attributes = True


class CartItemCreate(BaseModel):
    product_id: str
    quantity: int = Field(..., gt=0)


class OrderItemResponse(BaseModel):
    id: str
    product_id: str
    product_name: str
    price: float
    quantity: int
    total: float


class OrderBase(BaseModel):
    address_id: str
    notes: Optional[str] = None


class OrderCreate(OrderBase):
    items: list[CartItemCreate]
    payment_method: str = "mpesa"


class OrderResponse(BaseModel):
    id: str
    user_id: str
    seller_id: str
    seller_name: str
    items: list[OrderItemResponse]
    address: AddressResponse
    status: str
    subtotal: float
    delivery_fee: float
    total: float
    rider_id: Optional[str] = None
    rider_name: Optional[str] = None
    created_at: datetime
    estimated_delivery: Optional[datetime] = None

    class Config:
        from_attributes = True


class OrderStatusUpdate(BaseModel):
    status: str


class RiderBase(BaseModel):
    name: str
    phone: str


class RiderCreate(RiderBase):
    user_id: str


class RiderResponse(RiderBase):
    id: str
    user_id: str
    current_latitude: Optional[float] = None
    current_longitude: Optional[float] = None
    is_online: bool

    class Config:
        from_attributes = True


class LocationUpdate(BaseModel):
    latitude: float
    longitude: float
