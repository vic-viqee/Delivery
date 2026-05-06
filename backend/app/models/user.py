from app.core.database import Base
from sqlalchemy import (
    Column,
    String,
    DateTime,
    Enum,
    Boolean,
    Float,
    Integer,
    Text,
    ForeignKey,
)
from sqlalchemy.orm import relationship
from datetime import datetime
import enum


class UserRole(str, enum.Enum):
    CUSTOMER = "CUSTOMER"
    SELLER = "SELLER"
    RIDER = "RIDER"
    ADMIN = "ADMIN"


class OrderStatus(str, enum.Enum):
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    PREPARING = "PREPARING"
    READY = "READY"
    PICKED_UP = "PICKED_UP"
    IN_TRANSIT = "IN_TRANSIT"
    DELIVERED = "DELIVERED"
    CANCELLED = "CANCELLED"


class User(Base):
    __tablename__ = "users"

    id = Column(
        String(36), primary_key=True, default=lambda: str(datetime.utcnow().timestamp())
    )
    phone = Column(String(15), unique=True, nullable=False, index=True)
    name = Column(String(255))
    password_hash = Column(String(255))
    role = Column(Enum(UserRole), default=UserRole.CUSTOMER)
    avatar_url = Column(String(500))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    addresses = relationship("Address", back_populates="user")
    orders = relationship("Order", back_populates="user", foreign_keys="Order.user_id")
    rider_profile = relationship("Rider", back_populates="user", uselist=False)


class AddressType(str, enum.Enum):
    HOUSE = "house"
    APARTMENT = "apartment"
    COMPOUND = "compound"
    PICKUP_POINT = "pickup_point"


class Address(Base):
    __tablename__ = "addresses"

    id = Column(
        String(36), primary_key=True, default=lambda: str(datetime.utcnow().timestamp())
    )
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    name = Column(String(100), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    photo_url = Column(String(500))
    landmark = Column(String(255), nullable=False)
    instructions = Column(Text)
    neighborhood = Column(String(255))
    is_default = Column(Boolean, default=False)

    # NEW - Edge cases for Kenyan addressing
    address_type = Column(Enum(AddressType), default=AddressType.HOUSE)
    apartment_name = Column(String(255))
    gate_colour = Column(String(50))
    floor_level = Column(String(50))
    turn_instructions = Column(Text)  # JSON string for turn-by-turn
    leave_at_neighbour = Column(Boolean, default=False)
    neighbour_name = Column(String(255))
    call_before_delivery = Column(Boolean, default=False)
    special_notes = Column(Text)
    
    # HYPER-LOCAL IMPROVEMENTS
    nearest_stage = Column(String(255))
    plus_code = Column(String(50))
    voice_note_url = Column(String(500))
    
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="addresses")


class Seller(Base):
    __tablename__ = "sellers"

    id = Column(
        String(36), primary_key=True, default=lambda: str(datetime.utcnow().timestamp())
    )
    name = Column(String(255), nullable=False)
    description = Column(Text)
    image_url = Column(String(500))
    phone = Column(String(15))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    products = relationship("Product", back_populates="seller")
    orders = relationship("Order", back_populates="seller")


class Category(Base):
    __tablename__ = "categories"

    id = Column(
        String(36), primary_key=True, default=lambda: str(datetime.utcnow().timestamp())
    )
    name = Column(String(100), nullable=False)
    slug = Column(String(100), unique=True, nullable=False)
    icon = Column(String(50))
    image_url = Column(String(500))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    products = relationship("Product", back_populates="category")


class Product(Base):
    __tablename__ = "products"

    id = Column(
        String(36), primary_key=True, default=lambda: str(datetime.utcnow().timestamp())
    )
    seller_id = Column(String(36), ForeignKey("sellers.id"), nullable=False)
    category_id = Column(String(36), ForeignKey("categories.id"))
    name = Column(String(255), nullable=False)
    description = Column(Text)
    price = Column(Float, nullable=False)
    original_price = Column(Float)
    image_url = Column(String(500))
    stock = Column(Integer, default=0)
    unit = Column(String(50), default="each")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    seller = relationship("Seller", back_populates="products")
    category = relationship("Category", back_populates="products")
    order_items = relationship("OrderItem", back_populates="product")


class Order(Base):
    __tablename__ = "orders"

    id = Column(
        String(36), primary_key=True, default=lambda: str(datetime.utcnow().timestamp())
    )
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    seller_id = Column(String(36), ForeignKey("sellers.id"), nullable=False)
    address_id = Column(String(36), ForeignKey("addresses.id"), nullable=False)
    rider_id = Column(String(36), ForeignKey("riders.id"))
    status = Column(Enum(OrderStatus), default=OrderStatus.PENDING)
    subtotal = Column(Float, nullable=False)
    delivery_fee = Column(Float, default=0)
    total = Column(Float, nullable=False)
    payment_method = Column(String(50), default="mpesa")
    payment_status = Column(String(50), default="pending")
    notes = Column(Text)
    estimated_delivery = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="orders", foreign_keys=[user_id])
    seller = relationship("Seller", back_populates="orders")
    address = relationship("Address")
    rider = relationship("Rider", back_populates="orders")
    items = relationship("OrderItem", back_populates="order")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(
        String(36), primary_key=True, default=lambda: str(datetime.utcnow().timestamp())
    )
    order_id = Column(String(36), ForeignKey("orders.id"), nullable=False)
    product_id = Column(String(36), ForeignKey("products.id"), nullable=False)
    price = Column(Float, nullable=False)
    quantity = Column(Integer, nullable=False)
    total = Column(Float, nullable=False)

    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")


class Rider(Base):
    __tablename__ = "riders"

    id = Column(
        String(36), primary_key=True, default=lambda: str(datetime.utcnow().timestamp())
    )
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, unique=True)
    name = Column(String(255), nullable=False)
    phone = Column(String(15), nullable=False)
    current_latitude = Column(Float)
    current_longitude = Column(Float)
    is_online = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="rider_profile")
    orders = relationship("Order", back_populates="rider")
