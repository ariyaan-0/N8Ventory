# N8Ventory - Ela Inventory Automation

**N8Ventory** is a robust Inventory and Order Management System designed specifically for [**Ela**](https://www.facebook.com/bloomwithEla), an F-Commerce business. It streamlines the process of tracking products, managing stock levels, and processing customer orders through a modern, user-friendly dashboard.

## 🚀 Project Vision

### Current Implementation
The current system provides a complete solution for internal management:
-   **Inventory Management**: Real-time tracking of product stock, pricing, and details.
-   **Order Management**: Efficient order creation, status tracking (Pending, Dispatched, Delivered), and automated bill calculation.
-   **Dashboard**: A secure, authenticated web interface for administrators to manage operations.

### Future Roadmap: N8N Automation 🤖
The next phase of development focuses on automating customer interactions using **N8N**:
-   **Social Media Integration**: Connect with WhatsApp and Messenger.
-   **Automated Queries**: Customers can ask about product availability directly in chat. N8N will query the N8Ventory API and respond instantly.
-   **Order Automation**: Customers can place orders via chat. N8N will automatically create the order in the system, update inventory, and notify admins.

---

## 🛠 Technology Stack

### Backend
-   **Framework**: [FastAPI](https://fastapi.tiangolo.com/) - High-performance, easy-to-learn, fast to code, ready for production.
-   **Database**: [PostgreSQL](https://www.postgresql.org/) - The world's most advanced open source relational database.
-   **ORM**: [SQLAlchemy](https://www.sqlalchemy.org/) - The Python SQL Toolkit and Object Relational Mapper.
-   **Validation**: [Pydantic](https://docs.pydantic.dev/) - Data validation using Python type hints.
-   **Testing**: [Pytest](https://docs.pytest.org/) - Mature full-featured Python testing tool.
-   **Authentication**: JWT (JSON Web Tokens) with `python-jose` and `passlib`.

### Frontend
-   **Library**: [React](https://react.dev/) - The library for web and native user interfaces.
-   **Build Tool**: [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling.
-   **Styling**: [TailwindCSS](https://tailwindcss.com/) - Rapidly build modern websites without ever leaving your HTML.
-   **HTTP Client**: [Axios](https://axios-http.com/) - Promise based HTTP client for the browser and node.js.

### Infrastructure
-   **Containerization**: [Docker](https://www.docker.com/) & Docker Compose.

---

## 📐 Design & Architecture

### Domain-Driven Design (DDD)
The backend is structured around business domains to ensure scalability and maintainability:
-   **`app/api/v1/domains/`**: Contains logic for specific business areas (Users, Inventory, Orders).
-   **CQRS (Command Query Responsibility Segregation)**: Operations are split into **Commands** (Write: Create, Update, Delete) and **Queries** (Read: Get).
-   **Repository Pattern**: Data access logic is abstracted in `app/infrastructure/repositories`, keeping business logic clean.

### Testing Strategy
-   **Unit Tests**: Isolated tests for repositories and services using an in-memory SQLite database (`StaticPool`) to ensure speed and reliability.
-   **Integration Tests**: End-to-end API tests using `TestClient` to verify the interaction between components.

---

## ⚙️ Setup & Installation

### Prerequisites
-   [Docker](https://www.docker.com/get-started) and Docker Compose installed.
-   **OR** Python 3.9+ and Node.js 18+ for local development.

### Option 1: Run with Docker (Recommended) 🐳

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd Ela-Inventory-automation
    ```

2.  **Environment Setup**:
    -   Navigate to the `backend` directory.
    -   Create a `.env` file based on `.env.sample`.
    ```bash
    cd backend
    cp .env.sample .env
    ```
    -   *Note: Docker Compose will handle the database connection string automatically.*

3.  **Build and Run**:
    ```bash
    docker-compose up --build
    ```
    -   Backend API: `http://localhost:8000`
    -   API Docs (Swagger): `http://localhost:8000/docs`
    -   Database: Port `5433` (mapped to host)

4.  **Run Frontend**:
    -   Open a new terminal.
    -   Navigate to `dashboard`.
    ```bash
    cd dashboard
    npm install
    npm run dev
    ```
    -   Access the dashboard at `http://localhost:3000`.

### Option 2: Run Locally 💻

#### Backend
1.  Navigate to `backend`.
2.  Create a virtual environment and activate it:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Configure `.env`:
    -   Set `DATABASE_URL` to your local PostgreSQL instance.
5.  Run the server:
    ```bash
    uvicorn main:app --reload
    ```

#### Frontend
1.  Navigate to `dashboard`.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```

---

## 🧪 Running Tests

To run the backend test suite:

1.  Navigate to `backend`.
2.  Run pytest:
    ```bash
    pytest
    ```
    *This will execute all unit and integration tests using an in-memory database.*

---

## 📝 API Documentation

The backend provides auto-generated interactive documentation:
-   **Swagger UI**: `http://localhost:8000/docs`
-   **ReDoc**: `http://localhost:8000/redoc`

Use these interfaces to explore endpoints, test requests, and view schemas.
