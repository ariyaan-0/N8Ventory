from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.infrastructure.database import get_db
from app.api.v1.domains.orders.schemas import OrderResponse
from app.infrastructure.repositories.order_repository import get_orders, get_order
from app.api.v1.domains.users.query.get_user import get_current_user
from app.api.v1.domains.users.schemas import UserResponse

router = APIRouter()

@router.get("/orders", response_model=List[OrderResponse])
def read_orders(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: UserResponse = Depends(get_current_user)):
    return get_orders(db, skip=skip, limit=limit)

@router.get("/orders/{order_id}", response_model=OrderResponse)
def read_order(order_id: int, db: Session = Depends(get_db), current_user: UserResponse = Depends(get_current_user)):
    db_order = get_order(db, order_id=order_id)
    if db_order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return db_order
