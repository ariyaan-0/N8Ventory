from app.infrastructure.repositories.user_repository import create_user, get_user_by_email
from app.infrastructure.repositories.product_repository import create_product, get_product
from app.infrastructure.repositories.order_repository import create_order, get_order
from app.api.v1.domains.users.schemas import UserCreate
from app.api.v1.domains.inventory.schemas import ProductCreate
from app.api.v1.domains.orders.schemas import OrderCreate

def test_create_user(db):
    user_in = UserCreate(email="test@example.com", name="Test User", password="password")
    user = create_user(db, user_in)
    assert user.email == "test@example.com"
    assert hasattr(user, "id")

def test_get_user(db):
    user = get_user_by_email(db, "test@example.com")
    assert user is not None
    assert user.email == "test@example.com"

def test_create_product(db):
    product_in = ProductCreate(code_name="P001", name="Test Product", price=10.0, quantity=5)
    product = create_product(db, product_in)
    assert product.code_name == "P001"
    assert product.price == 10.0

def test_create_order(db):
    # Ensure product exists
    product_in = ProductCreate(code_name="P002", name="Order Product", price=20.0, quantity=10)
    create_product(db, product_in)

    order_in = OrderCreate(
        customer_name="Customer", 
        code_names=["P002"], 
        address="123 St", 
        phone_number="1234567890",
        delivery_charge=5.0,
        discount_amount=2.0
    )
    order = create_order(db, order_in)
    
    assert order.customer_name == "Customer"
    assert order.price == 20.0
    assert order.total_bill == 20.0 + 5.0 - 2.0
    
    # Check inventory reduction
    product = get_product(db, 2) # Assuming id 2
    assert product.quantity == 9
