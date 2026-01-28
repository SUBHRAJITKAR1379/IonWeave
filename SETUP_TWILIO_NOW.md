# 🚀 Step-by-Step Twilio WhatsApp Setup Guide

Follow these exact steps to get WhatsApp notifications working on +917992745514

---

## STEP 1: Create Twilio Account (5 minutes)

### 1.1 Sign Up
1. Open: **https://www.twilio.com/try-twilio**
2. Fill in:
   - First Name
   - Last Name
   - Email
   - Password
3. Click "Start your free trial"

### 1.2 Verify Your Phone
1. Enter your phone number (use +917992745514)
2. Choose SMS or Call verification
3. Enter the code you receive
4. Click "Verify"

### 1.3 Complete Profile
1. Skip the "Tell us about your project" (click Skip)
2. Or select "Notifications & Alerts" > "Send WhatsApp messages"

---

## STEP 2: Get Your Credentials (2 minutes)

### 2.1 Go to Dashboard
After signing up, you'll land on: **https://console.twilio.com/**

### 2.2 Find Your Credentials
On the main dashboard, you'll see:

```
┌─────────────────────────────────────┐
│ Account Info                        │
├─────────────────────────────────────┤
│ Account SID: ACxxxxxxxxxxxxx        │  ← COPY THIS
│ Auth Token:  [show] [hide]          │  ← CLICK "show" and COPY
└─────────────────────────────────────┘
```

**COPY THESE TWO VALUES - YOU'LL NEED THEM!**

Example:
- Account SID: `AC1234567890abcdef1234567890abcd`
- Auth Token: `abcdef1234567890abcdef1234567890`

---

## STEP 3: Set Up WhatsApp Sandbox (3 minutes)

### 3.1 Go to WhatsApp Sandbox
1. Click on left menu: **Messaging** > **Try it out** > **Send a WhatsApp message**
2. Or go directly to: **https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn**

### 3.2 Join the Sandbox
You'll see a page like this:

```
┌─────────────────────────────────────────────┐
│ WhatsApp Sandbox                            │
├─────────────────────────────────────────────┤
│ To connect, send this message:              │
│                                             │
│ join happy-dog                              │  ← YOUR JOIN CODE
│                                             │
│ to WhatsApp number:                         │
│ +1 415 523 8886                             │  ← TWILIO NUMBER
└─────────────────────────────────────────────┘
```

**Your join code will be different - it might be like "join happy-dog" or "join blue-cat"**

### 3.3 Send Join Message
1. On your phone **+917992745514**, open WhatsApp
2. Create new chat with the Twilio number (e.g., +1 415 523 8886)
3. Send the exact join code (e.g., "join happy-dog")
4. You'll receive a confirmation message: "Joined demo-sandbox! Reply stop to leave."

**✅ THIS STEP IS CRITICAL - Don't skip it!**

---

## STEP 4: Update Server Configuration (2 minutes)

### 4.1 Connect to Server
```bash
ssh into your server or open terminal
```

### 4.2 Edit .env File
```bash
nano /app/backend/.env
```

### 4.3 Replace Credentials
**BEFORE:**
```
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
TWILIO_WHATSAPP_TO=whatsapp:+917992745514
```

**AFTER (with YOUR real values):**
```
TWILIO_ACCOUNT_SID=AC1234567890abcdef1234567890abcd
TWILIO_AUTH_TOKEN=abcdef1234567890abcdef1234567890
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
TWILIO_WHATSAPP_TO=whatsapp:+917992745514
```

**Replace:**
- `AC1234567890abcdef1234567890abcd` with YOUR Account SID
- `abcdef1234567890abcdef1234567890` with YOUR Auth Token
- Keep the `whatsapp:` prefix for both numbers
- The Twilio sandbox number might be different - check your console

### 4.4 Save File
- Press `Ctrl + X`
- Press `Y`
- Press `Enter`

---

## STEP 5: Restart Backend (30 seconds)

```bash
sudo supervisorctl restart backend
```

Wait 5 seconds, then check if it's running:
```bash
sudo supervisorctl status backend
```

Should show: `backend    RUNNING`

---

## STEP 6: Test WhatsApp Integration (1 minute)

### 6.1 Test via Command Line
```bash
curl -X POST http://localhost:8001/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "organization": "Test Org",
    "message": "Testing WhatsApp integration for AtmosAether!"
  }'
```

### 6.2 Check Response
You should see:
```json
{
  "success": true,
  "message": "Thank you for your interest! We'll get back to you soon.",
  "whatsapp_notification": "sent"
}
```

**Look for:** `"whatsapp_notification": "sent"` ✅

### 6.3 Check WhatsApp
**Open WhatsApp on +917992745514** - You should receive:

```
🌐 New AtmosAether Inquiry

👤 Name: Test User
📧 Email: test@example.com
🏢 Organization: Test Org

💬 Message:
Testing WhatsApp integration for AtmosAether!

⏰ Submitted: 2025-01-26 12:30:45 UTC
```

### 6.4 Test via Website
1. Go to: http://localhost:3000
2. Scroll to Contact section
3. Fill the form
4. Click Submit
5. Check WhatsApp - message should arrive!

---

## STEP 7: Verify Logs (30 seconds)

Check backend logs for success:
```bash
tail -f /var/log/supervisor/backend.out.log
```

**Look for:**
- ✅ `Twilio WhatsApp client initialized successfully`
- ✅ `WhatsApp notification sent successfully. Message SID: SMxxxxx`

**If you see:**
- ❌ `Authentication Error` → Check your credentials
- ❌ `not_configured` → Credentials not loaded, restart backend
- ⚠️ `Twilio credentials not configured` → .env file not updated

---

## 🔥 Common Issues & Fixes

### Issue 1: "Authentication Error"
**Problem:** Wrong credentials
**Fix:** 
1. Go back to https://console.twilio.com/
2. Copy Account SID and Auth Token again
3. Update /app/backend/.env
4. Restart: `sudo supervisorctl restart backend`

### Issue 2: "whatsapp_notification": "not_configured"
**Problem:** .env file not loaded
**Fix:**
```bash
sudo supervisorctl restart backend
```

### Issue 3: WhatsApp not received
**Problem:** Not joined sandbox
**Fix:**
1. From +917992745514, send join code to Twilio number again
2. Wait for confirmation
3. Test again

### Issue 4: "Invalid 'To' Phone Number"
**Problem:** Number format wrong
**Fix:** Make sure it's `whatsapp:+917992745514` (with `whatsapp:` prefix)

---

## 📋 Quick Checklist

Before marking as complete, verify:

- [ ] Twilio account created
- [ ] Account SID copied
- [ ] Auth Token copied
- [ ] WhatsApp sandbox joined from +917992745514
- [ ] Confirmation message received on WhatsApp
- [ ] /app/backend/.env file updated with real credentials
- [ ] Backend restarted
- [ ] Test message sent via curl
- [ ] Response shows "whatsapp_notification": "sent"
- [ ] WhatsApp message received on +917992745514
- [ ] Website contact form tested
- [ ] WhatsApp message received from website form

---

## 🎯 After Setup

Once working, every contact form submission will:
1. Save to database ✅
2. Send WhatsApp to +917992745514 ✅
3. Show success message to user ✅

**No more manual checking needed!**

---

## 💰 Cost

- **Sandbox (Testing):** FREE forever
- **Trial Credits:** Free credits included (~$15-20)
- **After Trial:** ~$0.005 per WhatsApp message
- **Note:** Sandbox is free even after trial expires

---

## 🆘 Still Not Working?

Run this diagnostic:
```bash
echo "=== Diagnostic Check ==="
echo "1. Credentials Check:"
cat /app/backend/.env | grep TWILIO
echo ""
echo "2. Backend Status:"
sudo supervisorctl status backend
echo ""
echo "3. Recent Logs:"
tail -n 20 /var/log/supervisor/backend.out.log | grep -E "(Twilio|WhatsApp)"
echo ""
echo "4. Test API:"
curl -X POST http://localhost:8001/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Diagnostic Test","email":"test@test.com","message":"Testing"}'
```

Share the output if still facing issues.

---

## 📞 Need More Help?

1. **Check logs:** `tail -f /var/log/supervisor/backend.out.log`
2. **Twilio Console:** https://console.twilio.com/
3. **Twilio Docs:** https://www.twilio.com/docs/whatsapp
4. **Support:** https://support.twilio.com/

---

**⏱️ Total Time: ~12 minutes**
**💵 Total Cost: $0 (FREE)**
**🎉 Result: Automatic WhatsApp notifications for all inquiries!**
