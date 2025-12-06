from sqlalchemy import Column, Integer, String, Float
from app.infrastructure.database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    code_name = Column(String, index=True)
    name = Column(String, nullable=True)
    description = Column(String, nullable=True)
    price = Column(Float)
    quantity = Column(Integer)
