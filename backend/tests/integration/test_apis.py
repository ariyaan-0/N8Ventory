def test_register_user(client):
    response = client.post(
        "/api/v1/users/register",
        json={"email": "newuser@example.com", "name": "New User", "password": "password"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "newuser@example.com"
    assert "id" in data

def test_login_user(client):
    response = client.post(
        "/api/v1/users/login",
        data={"username": "newuser@example.com", "password": "password"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    return data["access_token"]

def test_create_product_api(client):
    token = test_login_user(client)
    headers = {"Authorization": f"Bearer {token}"}
    response = client.post(
        "/api/v1/inventory/products",
        json={"code_name": "P002", "name": "API Product", "price": 20.0, "quantity": 10},
        headers=headers
    )
    assert response.status_code == 201
    data = response.json()
    assert data["code_name"] == "P002"

def test_get_products_api(client):
    token = test_login_user(client)
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/api/v1/inventory/products", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0

def test_create_order_api(client):
    token = test_login_user(client)
    headers = {"Authorization": f"Bearer {token}"}
    response = client.post(
        "/api/v1/orders/orders",
        json={
            "customer_name": "API Customer", 
            "code_names": ["P002"], 
            "address": "456 St", 
            "phone_number": "0987654321",
            "delivery_charge": 10.0
        },
        headers=headers
    )
    assert response.status_code == 201
    data = response.json()
    assert data["customer_name"] == "API Customer"
    assert data["total_bill"] == 20.0 + 10.0
