from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from pymongo import MongoClient
import os
from datetime import datetime
from dotenv import load_dotenv
from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException

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

# Twilio WhatsApp Configuration
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_WHATSAPP_FROM = os.getenv("TWILIO_WHATSAPP_FROM", "whatsapp:+14155238886")
TWILIO_WHATSAPP_TO = os.getenv("TWILIO_WHATSAPP_TO", "whatsapp:+917992745514")

# Initialize Twilio client (only if credentials are provided)
twilio_client = None
if TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN:
    try:
        twilio_client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        print("✅ Twilio WhatsApp client initialized successfully")
    except Exception as e:
        print(f"⚠️ Warning: Failed to initialize Twilio client: {str(e)}")
else:
    print("⚠️ Warning: Twilio credentials not configured. WhatsApp notifications disabled.")

def send_whatsapp_notification(contact_data: dict) -> bool:
    """
    Send WhatsApp notification about new contact form submission
    Returns True if successful, False otherwise
    """
    if not twilio_client:
        print("⚠️ Twilio client not initialized. Skipping WhatsApp notification.")
        return False
    
    try:
        # Format the message
        message_body = f"""
🌐 *New AtmosAether Inquiry*

👤 *Name:* {contact_data['name']}
📧 *Email:* {contact_data['email']}
🏢 *Organization:* {contact_data.get('organization', 'Not provided')}

💬 *Message:*
{contact_data['message']}

⏰ *Submitted:* {contact_data['submitted_at'].strftime('%Y-%m-%d %H:%M:%S UTC')}
        """.strip()
        
        # Send WhatsApp message
        message = twilio_client.messages.create(
            from_=TWILIO_WHATSAPP_FROM,
            body=message_body,
            to=TWILIO_WHATSAPP_TO
        )
        
        print(f"✅ WhatsApp notification sent successfully. Message SID: {message.sid}")
        return True
        
    except TwilioRestException as e:
        print(f"❌ Twilio error sending WhatsApp: {str(e)}")
        return False
    except Exception as e:
        print(f"❌ Error sending WhatsApp notification: {str(e)}")
        return False

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