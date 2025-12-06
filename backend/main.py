from fastapi import FastAPI
from app.infrastructure.database import engine, Base
from app.api.v1.domains.users.command import register, login
from app.api.v1.domains.users.query import get_user
from app.api.v1.domains.inventory.command import product_commands
from app.api.v1.domains.inventory.query import product_queries
from app.api.v1.domains.orders.command import order_commands
from app.api.v1.domains.orders.query import order_queries

# Create tables
# Base.metadata.create_all(bind=engine)

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Ela Inventory Automation", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    Base.metadata.create_all(bind=engine)

# Include routers
app.include_router(register.router, prefix="/api/v1/users", tags=["Users"])
app.include_router(login.router, prefix="/api/v1/users", tags=["Users"])
app.include_router(get_user.router, prefix="/api/v1/users", tags=["Users"])

app.include_router(product_commands.router, prefix="/api/v1/inventory", tags=["Inventory"])
app.include_router(product_queries.router, prefix="/api/v1/inventory", tags=["Inventory"])

app.include_router(order_commands.router, prefix="/api/v1/orders", tags=["Orders"])
app.include_router(order_queries.router, prefix="/api/v1/orders", tags=["Orders"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Ela Inventory Automation API"}
