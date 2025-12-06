# Ela Inventory Automation Backend

Backend service for the Ela Inventory and Order management system, built with FastAPI and following Domain-Driven Design (DDD) principles.

## 🚀 Technologies

- **Language**: Python 3.9+
- **Framework**: FastAPI
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy
- **Authentication**: JWT (JSON Web Tokens)
- **Containerization**: Docker & Docker Compose
- **Testing**: Pytest

## 🛠️ Getting Started

### Prerequisites

- Docker and Docker Compose installed on your machine.

### Running the Application

1.  **Start the services**:
    ```bash
    docker-compose up --build
    ```

2.  **Access the Application**:
    - **API Root**: [http://localhost:8000](http://localhost:8000)
    - **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
    - **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

### Database Access

The PostgreSQL database is exposed on port **5433** on the host machine to avoid conflicts with default PostgreSQL installations.

- **Host**: `localhost`
- **Port**: `5433`
- **User**: `postgres`
- **Password**: `postgres`
- **Database**: `ela_inventory`

## 📚 API Documentation

### 1. Users Domain

#### Register User
- **Endpoint**: `POST /api/v1/users/register`
- **Description**: Register a new user account.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "name": "John Doe",
    "password": "securepassword123"
  }
  ```

#### Login
- **Endpoint**: `POST /api/v1/users/login`
- **Description**: Authenticate user and retrieve access token.
- **Request Body** (Form Data):
  - `username`: user@example.com
  - `password`: securepassword123
- **Response**:
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer"
  }
  ```

#### Get Current User
- **Endpoint**: `GET /api/v1/users/me`
- **Headers**: `Authorization: Bearer <access_token>`
- **Description**: Get details of the currently logged-in user.

---

### 2. Inventory Domain (Products)

#### Create Product
- **Endpoint**: `POST /api/v1/inventory/products`
- **Headers**: `Authorization: Bearer <access_token>`
- **Description**: Add a new product to the inventory.
- **Request Body**:
  ```json
  {
    "code_name": "PROD-001",
    "name": "Wireless Mouse",
    "description": "Ergonomic wireless mouse with 2.4GHz connection",
    "price": 29.99,
    "quantity": 100
  }
  ```

#### Update Product
- **Endpoint**: `PUT /api/v1/inventory/products/{id}`
- **Headers**: `Authorization: Bearer <access_token>`
- **Description**: Update an existing product. Fields are optional.
- **Request Body**:
  ```json
  {
    "price": 24.99,
    "quantity": 150
  }
  ```

#### Get All Products
- **Endpoint**: `GET /api/v1/inventory/products`
- **Query Params**: `skip=0`, `limit=100`
- **Description**: Retrieve a list of all products.

#### Get Product by ID
- **Endpoint**: `GET /api/v1/inventory/products/{id}`
- **Description**: Retrieve details of a specific product.

#### Delete Product
- **Endpoint**: `DELETE /api/v1/inventory/products/{id}`
- **Headers**: `Authorization: Bearer <access_token>`
- **Description**: Remove a product from the inventory.

---

### 3. Orders Domain

#### Create Order
- **Endpoint**: `POST /api/v1/orders/orders`
- **Headers**: `Authorization: Bearer <access_token>`
- **Description**: Create a new order. The system will automatically calculate the price based on product codes and reduce inventory.
- **Request Body**:
  ```json
  {
    "customer_name": "Alice Smith",
    "code_names": ["PROD-001", "PROD-002"],
    "name": "Office Supplies",
    "address": "123 Main St, Springfield",
    "phone_number": "+1234567890",
    "delivery_charge": 15.0,
    "discount_amount": 5.0,
    "status": "Pending"
  }
  ```

#### Update Order
- **Endpoint**: `PUT /api/v1/orders/orders/{id}`
- **Headers**: `Authorization: Bearer <access_token>`
- **Description**: Update an existing order (e.g., change status).
- **Request Body**:
  ```json
  {
    "status": "Dispatched"
  }
  ```

#### Get All Orders
- **Endpoint**: `GET /api/v1/orders/orders`
- **Query Params**: `skip=0`, `limit=100`
- **Description**: Retrieve a list of all orders.

#### Get Order by ID
- **Endpoint**: `GET /api/v1/orders/orders/{id}`
- **Description**: Retrieve details of a specific order.

#### Delete Order
- **Endpoint**: `DELETE /api/v1/orders/orders/{id}`
- **Headers**: `Authorization: Bearer <access_token>`
- **Description**: Delete an order record.

## 🧪 Testing

The project uses `pytest` for testing. Tests cover both unit (repositories) and integration (APIs) levels.

### Running Tests

To run the tests, you can execute them inside the running Docker container or locally if you have the environment set up.

**Option 1: Inside Docker (Recommended)**
1.  Identify the container ID or name (usually `backend-backend-1`).
2.  Run the tests:
    ```bash
    docker exec -it backend-backend-1 python3 -m pytest
    ```

**Option 2: Local Environment**
1.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
2.  Run tests:
    ```bash
    python3 -m pytest
    ```

### Test Structure
- `tests/unit`: Tests for repositories and internal logic.
- `tests/integration`: End-to-end API tests using `TestClient`.
- `tests/conftest.py`: Test configuration and fixtures (uses in-memory SQLite for isolation).

## 📂 Project Structure

The project follows a Domain-Driven Design (DDD) structure:

```
app/
├── api/
│   └── v1/
│       └── domains/
│           ├── inventory/  # Inventory Domain (Products)
│           │   ├── command/ # Write operations
│           │   ├── query/   # Read operations
│           │   └── schemas.py
│           ├── orders/     # Orders Domain
│           │   ├── command/
│           │   ├── query/
│           │   └── schemas.py
│           └── users/      # Users Domain (Auth)
├── application/            # Application Logic (Auth, etc.)
├── infrastructure/         # Database, Models, Repositories
└── main.py                 # Application Entry Point
```