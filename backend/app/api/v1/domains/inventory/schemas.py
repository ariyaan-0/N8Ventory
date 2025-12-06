from pydantic import BaseModel
from typing import Optional

class ProductBase(BaseModel):
    code_name: str
    name: Optional[str] = None
    description: Optional[str] = None
    price: float
    quantity: int

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    code_name: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    quantity: Optional[int] = None

class ProductResponse(ProductBase):
    id: int

    class Config:
        orm_mode = True
