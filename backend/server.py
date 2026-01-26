from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from pymongo import MongoClient
import os
from datetime import datetime

app = FastAPI(title="AtmosAether API")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB Connection
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/aether_web")
client = MongoClient(MONGO_URL)
db = client.get_database()

# Pydantic Models
class ContactForm(BaseModel):
    name: str
    email: EmailStr
    organization: str = ""
    message: str

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "AtmosAether API"}

@app.post("/api/contact")
async def submit_contact(contact: ContactForm):
    try:
        contact_data = contact.dict()
        contact_data["submitted_at"] = datetime.utcnow()
        result = db.contacts.insert_one(contact_data)
        return {
            "success": True,
            "message": "Thank you for your interest! We'll get back to you soon."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)