from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.infrastructure.database import get_db
from app.api.v1.domains.inventory.schemas import ProductCreate, ProductUpdate, ProductResponse
from app.infrastructure.repositories.product_repository import create_product, update_product, delete_product, get_product
from app.api.v1.domains.users.query.get_user import get_current_user
from app.api.v1.domains.users.schemas import UserResponse

router = APIRouter()

@router.post("/products", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_new_product(product: ProductCreate, db: Session = Depends(get_db), current_user: UserResponse = Depends(get_current_user)):
    return create_product(db=db, product=product)

@router.put("/products/{product_id}", response_model=ProductResponse)
def update_existing_product(product_id: int, product: ProductUpdate, db: Session = Depends(get_db), current_user: UserResponse = Depends(get_current_user)):
    db_product = get_product(db, product_id)
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    return update_product(db=db, product_id=product_id, product=product)

@router.delete("/products/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_product(product_id: int, db: Session = Depends(get_db), current_user: UserResponse = Depends(get_current_user)):
    db_product = get_product(db, product_id)
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    delete_product(db=db, product_id=product_id)
    return None
