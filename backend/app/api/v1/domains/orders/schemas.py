from pydantic import BaseModel
from typing import Optional, List
from enum import Enum

class OrderStatus(str, Enum):
    PENDING = "Pending"
    DISPATCHED = "Dispatched"
    DELIVERED = "Delivered"

class OrderBase(BaseModel):
    customer_name: str
    code_names: List[str]
    name: Optional[str] = None
    address: str
    phone_number: str
    delivery_charge: float
    discount_amount: float = 0.0
    status: OrderStatus = OrderStatus.PENDING

class OrderCreate(OrderBase):
    pass

class OrderUpdate(BaseModel):
    customer_name: Optional[str] = None
    code_names: Optional[List[str]] = None
    name: Optional[str] = None
    address: Optional[str] = None
    phone_number: Optional[str] = None
    delivery_charge: Optional[float] = None
    discount_amount: Optional[float] = None
    status: Optional[OrderStatus] = None

class OrderResponse(OrderBase):
    id: int
    price: float
    total_bill: float

    class Config:
        orm_mode = True
