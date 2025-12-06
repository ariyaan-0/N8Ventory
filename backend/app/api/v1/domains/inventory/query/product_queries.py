from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.infrastructure.database import get_db
from app.api.v1.domains.inventory.schemas import ProductResponse
from app.infrastructure.repositories.product_repository import get_products, get_product
from app.api.v1.domains.users.query.get_user import get_current_user
from app.api.v1.domains.users.schemas import UserResponse

router = APIRouter()

@router.get("/products", response_model=List[ProductResponse])
def read_products(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: UserResponse = Depends(get_current_user)):
    return get_products(db, skip=skip, limit=limit)

@router.get("/products/{product_id}", response_model=ProductResponse)
def read_product(product_id: int, db: Session = Depends(get_db), current_user: UserResponse = Depends(get_current_user)):
    db_product = get_product(db, product_id=product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product
