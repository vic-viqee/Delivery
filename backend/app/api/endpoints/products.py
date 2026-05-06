from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User, Product, Category, Seller
from app.schemas.schemas import ProductResponse, CategoryResponse, ProductCreate

router = APIRouter()

@router.post("", response_model=ProductResponse)
def create_product(
    product_data: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role.value != "SELLER":
        raise HTTPException(status_code=403, detail="Only sellers can create products")
    
    seller = db.query(Seller).filter(Seller.phone == current_user.phone).first()
    if not seller:
        raise HTTPException(status_code=404, detail="Seller profile not found")

    product = Product(
        seller_id=seller.id,
        category_id=product_data.category_id,
        name=product_data.name,
        description=product_data.description,
        price=product_data.price,
        original_price=product_data.original_price,
        image_url=product_data.image_url,
        stock=product_data.stock,
        unit=product_data.unit,
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return product

@router.get("/seller/me", response_model=List[ProductResponse])
def get_seller_products(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role.value != "SELLER":
        raise HTTPException(status_code=403, detail="Access denied")
    
    seller = db.query(Seller).filter(Seller.phone == current_user.phone).first()
    if not seller:
        return []

    products = db.query(Product).filter(Product.seller_id == seller.id).all()
    return products

@router.get("/categories", response_model=List[CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(Category).filter(Category.is_active == True).all()
    return categories


@router.get("", response_model=List[ProductResponse])
def get_products(
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(Product).filter(Product.is_active == True, Product.stock > 0)

    if category:
        query = query.filter(Product.category.has(slug=category))

    if search:
        search_term = f"%{search}%"
        query = query.filter(Product.name.ilike(search_term))

    products = query.offset(skip).limit(limit).all()

    result = []
    for product in products:
        result.append(
            ProductResponse(
                id=product.id,
                name=product.name,
                description=product.description,
                price=product.price,
                original_price=product.original_price,
                image_url=product.image_url,
                category=product.category.name if product.category else None,
                stock=product.stock,
                unit=product.unit,
                seller_id=product.seller_id,
                seller_name=product.seller.name if product.seller else None,
            )
        )

    return result


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: str, db: Session = Depends(get_db)):
    product = (
        db.query(Product)
        .filter(Product.id == product_id, Product.is_active == True)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Product not found"
        )

    return ProductResponse(
        id=product.id,
        name=product.name,
        description=product.description,
        price=product.price,
        original_price=product.original_price,
        image_url=product.image_url,
        category=product.category.name if product.category else None,
        stock=product.stock,
        unit=product.unit,
        seller_id=product.seller_id,
        seller_name=product.seller.name if product.seller else None,
    )
