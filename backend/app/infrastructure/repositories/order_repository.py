from sqlalchemy.orm import Session
from app.infrastructure.models.order import Order
from app.api.v1.domains.orders.schemas import OrderCreate, OrderUpdate
from app.infrastructure.repositories.product_repository import get_product_by_code_name
from fastapi import HTTPException
import json

def get_order(db: Session, order_id: int):
    order = db.query(Order).filter(Order.id == order_id).first()
    if order:
        # Convert stored JSON string back to list for the application
        order.code_names = json.loads(order.code_names)
    return order

def get_orders(db: Session, skip: int = 0, limit: int = 100):
    orders = db.query(Order).offset(skip).limit(limit).all()
    for order in orders:
        order.code_names = json.loads(order.code_names)
    return orders

def create_order(db: Session, order: OrderCreate):
    total_price = 0.0
    
    # Verify products and calculate price
    for code_name in order.code_names:
        product = get_product_by_code_name(db, code_name)
        if not product:
            raise HTTPException(status_code=404, detail=f"Product with code {code_name} not found")
        if product.quantity < 1:
            raise HTTPException(status_code=400, detail=f"Product {product.name} is out of stock")
        
        # Reduce inventory
        product.quantity -= 1
        total_price += product.price

    # Calculate total bill
    total_bill = total_price + order.delivery_charge - order.discount_amount

    # Create Order object
    db_order = Order(
        customer_name=order.customer_name,
        code_names=json.dumps(order.code_names), # Store as JSON string
        name=order.name,
        address=order.address,
        phone_number=order.phone_number,
        price=total_price,
        delivery_charge=order.delivery_charge,
        discount_amount=order.discount_amount,
        total_bill=total_bill,
        status=order.status
    )
    
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    
    # Convert back to list for response
    db_order.code_names = json.loads(db_order.code_names)
    
    return db_order

def update_order(db: Session, order_id: int, order: OrderUpdate):
    db_order = db.query(Order).filter(Order.id == order_id).first()
    if db_order:
        update_data = order.dict(exclude_unset=True)
        for key, value in update_data.items():
            if key == 'code_names' and value is not None:
                setattr(db_order, key, json.dumps(value))
            else:
                setattr(db_order, key, value)
        db.commit()
        db.refresh(db_order)
        db_order.code_names = json.loads(db_order.code_names)
    return db_order

def delete_order(db: Session, order_id: int):
    db_order = db.query(Order).filter(Order.id == order_id).first()
    if db_order:
        db.delete(db_order)
        db.commit()
    return db_order
