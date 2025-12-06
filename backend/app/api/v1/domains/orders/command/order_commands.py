from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.infrastructure.database import get_db
from app.api.v1.domains.orders.schemas import OrderCreate, OrderUpdate, OrderResponse
from app.infrastructure.repositories.order_repository import create_order, update_order, delete_order, get_order
from app.api.v1.domains.users.query.get_user import get_current_user
from app.api.v1.domains.users.schemas import UserResponse

router = APIRouter()

@router.post("/orders", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_new_order(order: OrderCreate, db: Session = Depends(get_db), current_user: UserResponse = Depends(get_current_user)):
    return create_order(db=db, order=order)

@router.put("/orders/{order_id}", response_model=OrderResponse)
def update_existing_order(order_id: int, order: OrderUpdate, db: Session = Depends(get_db), current_user: UserResponse = Depends(get_current_user)):
    db_order = get_order(db, order_id)
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    return update_order(db=db, order_id=order_id, order=order)

@router.delete("/orders/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_order(order_id: int, db: Session = Depends(get_db), current_user: UserResponse = Depends(get_current_user)):
    db_order = get_order(db, order_id)
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    delete_order(db=db, order_id=order_id)
    return None
