from sqlalchemy import Column, Integer, String, Float, Text
from app.infrastructure.database import Base
import enum

class OrderStatus(str, enum.Enum):
    PENDING = "Pending"
    DISPATCHED = "Dispatched"
    DELIVERED = "Delivered"

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String)
    code_names = Column(Text) # Storing JSON string of list of code names
    name = Column(String, nullable=True) # Optional, maybe comma separated or just one
    address = Column(String)
    phone_number = Column(String)
    price = Column(Float, default=0.0)
    delivery_charge = Column(Float, default=0.0)
    discount_amount = Column(Float, default=0.0)
    total_bill = Column(Float, default=0.0)
    status = Column(String, default=OrderStatus.PENDING)
