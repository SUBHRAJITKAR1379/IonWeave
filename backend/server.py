from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from pymongo import MongoClient
import os
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

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
MONGO_URL = os.getenv("MONGO_URL")
if not MONGO_URL:
    raise ValueError("MONGO_URL environment variable is required")
client = MongoClient(MONGO_URL)
# Extract database name from MONGO_URL or default to aether_web
db_name = MONGO_URL.split('/')[-1] if '/' in MONGO_URL else 'aether_web'
db = client[db_name]

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