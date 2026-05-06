# Delivery Backend API

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.endpoints import auth, products, orders, addresses, riders

app = FastAPI(
    title="Delivery API",
    description="Grocery delivery API for Embu",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(products.router, prefix="/api/products", tags=["products"])
app.include_router(orders.router, prefix="/api/orders", tags=["orders"])
app.include_router(addresses.router, prefix="/api/addresses", tags=["addresses"])
app.include_router(riders.router, prefix="/api/riders", tags=["riders"])


@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "Delivery API"}


@app.get("/")
async def root():
    return {"message": "Delivery API is running"}
