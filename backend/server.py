from fastapi import FastAPI, HTTPException, Request, Response, Cookie
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from pymongo import MongoClient
import os
from datetime import datetime, timezone, timedelta
from dotenv import load_dotenv
from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException
import uuid
import requests
from typing import Optional, List
from emergentintegrations import chat_completion

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

# Emergent LLM Key
EMERGENT_LLM_KEY = os.getenv("EMERGENT_LLM_KEY", "sk-emergent-aDc57FdFeBeD84c7c5")

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

# Helper function to get user from session
async def get_current_user(request: Request, session_token: Optional[str] = Cookie(None)):
    # Try cookie first, then Authorization header
    token = session_token
    if not token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
    
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    # Find session in database
    session_doc = db.user_sessions.find_one({"session_token": token}, {"_id": 0})
    if not session_doc:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    # Check expiry
    expires_at = session_doc["expires_at"]
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Session expired")
    
    # Get user data
    user_doc = db.users.find_one({"user_id": session_doc["user_id"]}, {"_id": 0})
    if not user_doc:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user_doc

# Pydantic Models
class ContactForm(BaseModel):
    name: str
    email: EmailStr
    organization: str = ""
    message: str

class SessionExchange(BaseModel):
    session_id: str

class ChatMessage(BaseModel):
    message: str
    model: str = "gpt-4o"

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "AtmosAether API"}

@app.post("/api/contact")
async def submit_contact(contact: ContactForm):
    try:
        # Prepare contact data
        contact_data = contact.dict()
        contact_data["submitted_at"] = datetime.utcnow()
        contact_data["whatsapp_sent"] = False
        
        # Store in database
        result = db.contacts.insert_one(contact_data)
        
        # Send WhatsApp notification
        whatsapp_sent = send_whatsapp_notification(contact_data)
        
        # Update database with WhatsApp status
        if whatsapp_sent:
            db.contacts.update_one(
                {"_id": result.inserted_id},
                {"$set": {"whatsapp_sent": True}}
            )
        
        return {
            "success": True,
            "message": "Thank you for your interest! We'll get back to you soon.",
            "whatsapp_notification": "sent" if whatsapp_sent else "not_configured"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Authentication Endpoints
@app.post("/api/auth/session")
async def exchange_session(session_data: SessionExchange, response: Response):
    try:
        # Exchange session_id for user data from Emergent Auth
        auth_response = requests.get(
            "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
            headers={"X-Session-ID": session_data.session_id}
        )
        
        if auth_response.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid session ID")
        
        user_data = auth_response.json()
        
        # Create or update user in database
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        existing_user = db.users.find_one({"email": user_data["email"]}, {"_id": 0})
        
        if existing_user:
            user_id = existing_user["user_id"]
            db.users.update_one(
                {"user_id": user_id},
                {"$set": {
                    "name": user_data["name"],
                    "picture": user_data["picture"],
                    "updated_at": datetime.now(timezone.utc)
                }}
            )
        else:
            db.users.insert_one({
                "user_id": user_id,
                "email": user_data["email"],
                "name": user_data["name"],
                "picture": user_data["picture"],
                "created_at": datetime.now(timezone.utc)
            })
        
        # Create session
        session_token = user_data["session_token"]
        db.user_sessions.insert_one({
            "user_id": user_id,
            "session_token": session_token,
            "expires_at": datetime.now(timezone.utc) + timedelta(days=7),
            "created_at": datetime.now(timezone.utc)
        })
        
        # Set httpOnly cookie
        # REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
        response.set_cookie(
            key="session_token",
            value=session_token,
            httponly=True,
            secure=True,
            samesite="none",
            path="/",
            max_age=7*24*60*60
        )
        
        return {
            "success": True,
            "user": {
                "user_id": user_id,
                "email": user_data["email"],
                "name": user_data["name"],
                "picture": user_data["picture"]
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/auth/me")
async def get_me(request: Request, session_token: Optional[str] = Cookie(None)):
    user = await get_current_user(request, session_token)
    return user

@app.post("/api/auth/logout")
async def logout(request: Request, response: Response, session_token: Optional[str] = Cookie(None)):
    user = await get_current_user(request, session_token)
    
    # Delete session from database
    token = session_token
    if not token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
    
    if token:
        db.user_sessions.delete_one({"session_token": token})
    
    # Clear cookie
    response.delete_cookie(key="session_token", path="/")
    
    return {"success": True, "message": "Logged out successfully"}

# Chat Endpoints
@app.post("/api/chat")
async def chat_with_agent(chat_msg: ChatMessage, request: Request, session_token: Optional[str] = Cookie(None)):
    try:
        # Get current user
        user = await get_current_user(request, session_token)
        
        # System context about AtmosAether
        system_context = """
You are an AI assistant for AtmosAether, an innovative atmospheric purification technology company. 

AtmosAether Technology:
- Ionized Atmospheric Harvester using advanced ionization
- 99.7% particle capture rate for PM2.5 and smaller
- 85% more energy efficient than traditional systems
- 10,000+ cubic meters per hour filtration capacity per unit
- Covers 50km² per unit
- 20-year system lifespan
- Operates in -40°C to 50°C

Google Technologies Used:
- Google Cloud Platform (GCP) for infrastructure
- TensorFlow Lite for edge AI optimization and real-time predictions
- Google Earth Engine for geospatial analysis and deployment planning
- Google Cloud IoT for device management
- Firebase for real-time data

Key Features:
1. Advanced multi-stage ionization
2. Atmospheric harvesting with natural convection
3. Nano-engineered molecular filtration
4. Real-time AI-powered monitoring
5. Smart deployment using satellite imagery

Be helpful, informative, and enthusiastic about atmospheric purification technology.
"""
        
        # Get chat history for this user (last 10 messages)
        chat_history = list(db.chat_history.find(
            {"user_id": user["user_id"]},
            {"_id": 0}
        ).sort("timestamp", -1).limit(10))
        chat_history.reverse()
        
        # Build messages array
        messages = [{"role": "system", "content": system_context}]
        
        # Add chat history
        for msg in chat_history:
            messages.append({"role": "user", "content": msg["user_message"]})
            messages.append({"role": "assistant", "content": msg["assistant_message"]})
        
        # Add current message
        messages.append({"role": "user", "content": chat_msg.message})
        
        # Call AI model using emergentintegrations
        response = chat_completion(
            api_key=EMERGENT_LLM_KEY,
            model=chat_msg.model,
            messages=messages,
            temperature=0.7,
            max_tokens=1000
        )
        
        assistant_reply = response["choices"][0]["message"]["content"]
        
        # Save to chat history
        db.chat_history.insert_one({
            "user_id": user["user_id"],
            "user_message": chat_msg.message,
            "assistant_message": assistant_reply,
            "model": chat_msg.model,
            "timestamp": datetime.now(timezone.utc)
        })
        
        return {
            "success": True,
            "message": assistant_reply,
            "model": chat_msg.model
        }
    except Exception as e:
        print(f"Chat error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/chat/history")
async def get_chat_history(request: Request, session_token: Optional[str] = Cookie(None)):
    try:
        user = await get_current_user(request, session_token)
        
        # Get last 50 messages
        history = list(db.chat_history.find(
            {"user_id": user["user_id"]},
            {"_id": 0}
        ).sort("timestamp", -1).limit(50))
        history.reverse()
        
        return {"success": True, "history": history}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/chat/history")
async def clear_chat_history(request: Request, session_token: Optional[str] = Cookie(None)):
    try:
        user = await get_current_user(request, session_token)
        db.chat_history.delete_many({"user_id": user["user_id"]})
        return {"success": True, "message": "Chat history cleared"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/suggested-questions")
async def get_suggested_questions():
    suggestions = [
        "How does the ionization process work?",
        "What makes AtmosAether more energy efficient?",
        "How is Google Earth Engine used for deployment?",
        "What is the coverage area of each unit?",
        "How does TensorFlow Lite optimize performance?",
        "What pollutants can AtmosAether filter?",
        "What is the expected lifespan of the system?",
        "How does real-time monitoring work?"
    ]
    return {"success": True, "suggestions": suggestions}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)