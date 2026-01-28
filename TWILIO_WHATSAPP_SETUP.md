# Twilio WhatsApp Integration Setup Guide

## Overview
This guide will help you set up Twilio WhatsApp integration to receive contact form inquiries on WhatsApp number **+917992745514**.

---

## Step 1: Create Twilio Account

1. Go to [https://www.twilio.com/](https://www.twilio.com/)
2. Sign up for a free account (you'll get trial credits)
3. Verify your email and phone number

---

## Step 2: Get Your Twilio Credentials

After logging into Twilio Console:

1. Go to [https://console.twilio.com/](https://console.twilio.com/)
2. Find your **Account SID** and **Auth Token** on the dashboard
3. Copy these credentials - you'll need them later

**Example:**
- Account SID: `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- Auth Token: `your_auth_token_here`

---

## Step 3: Set Up WhatsApp Sandbox (For Testing)

Twilio provides a WhatsApp Sandbox for testing:

### Option A: WhatsApp Sandbox (Quick Setup - Recommended for Testing)

1. Go to [https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn](https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn)
2. You'll see a **Sandbox Number** (e.g., `+1 415 523 8886`)
3. **Join the Sandbox:**
   - Send a WhatsApp message to the sandbox number (shown in console)
   - Send the join code (e.g., "join <word>-<word>")
   - You'll receive a confirmation message

4. **Important:** Make sure you join the sandbox with **+917992745514** (the number that will receive notifications)

5. The sandbox number will be in format: `whatsapp:+14155238886`

### Option B: Production WhatsApp Number (For Live Deployment)

For production use, you need a WhatsApp Business Account:

1. Go to [https://console.twilio.com/us1/develop/sms/whatsapp/senders](https://console.twilio.com/us1/develop/sms/whatsapp/senders)
2. Click "Request Access" to WhatsApp Business API
3. Complete the business verification process
4. Get your WhatsApp-enabled phone number approved

**Note:** This process can take several days for approval.

---

## Step 4: Configure Environment Variables

Edit `/app/backend/.env` file and add your Twilio credentials:

```bash
# Twilio WhatsApp Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
TWILIO_WHATSAPP_TO=whatsapp:+917992745514
```

**Replace:**
- `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` with your actual Account SID
- `your_auth_token_here` with your actual Auth Token
- `whatsapp:+14155238886` with your Twilio WhatsApp number (keep the `whatsapp:` prefix)
- The TO number is already set to +917992745514 (your WhatsApp number)

---

## Step 5: Restart Backend Server

After updating the .env file:

```bash
sudo supervisorctl restart backend
```

Or if you're running manually:
```bash
cd /app/backend
python server.py
```

---

## Step 6: Test the Integration

### Test via API:
```bash
curl -X POST http://localhost:8001/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "organization": "Test Org",
    "message": "Testing WhatsApp integration"
  }'
```

### Test via Frontend:
1. Go to http://localhost:3000
2. Scroll to the Contact section
3. Fill out the form and submit
4. Check WhatsApp on +917992745514 for the notification

---

## Message Format

When someone submits the contact form, you'll receive a WhatsApp message like this:

```
🌐 New AtmosAether Inquiry

👤 Name: John Doe
📧 Email: john@example.com
🏢 Organization: Tech Corp

💬 Message:
I'm interested in learning more about the AtmosAether technology
for our city's air quality improvement project.

⏰ Submitted: 2025-01-26 10:30:45 UTC
```

---

## Troubleshooting

### Issue: "WhatsApp notification not sent"

**Check:**
1. Verify Twilio credentials are correct in `.env`
2. Ensure you've joined the WhatsApp Sandbox with +917992745514
3. Check backend logs: `tail -f /var/log/supervisor/backend.out.log`
4. Verify Twilio account has credits

### Issue: "Twilio authentication failed"

**Solution:**
- Double-check your Account SID and Auth Token
- Make sure there are no extra spaces in .env file
- Regenerate Auth Token from Twilio Console if needed

### Issue: "Message not received on WhatsApp"

**Check:**
1. Ensure +917992745514 has joined the Twilio sandbox
2. Send the join code again from that number
3. Check Twilio console logs for message status
4. Verify the number format includes country code: `whatsapp:+917992745514`

### Issue: "Twilio client not initialized"

**Solution:**
- Make sure TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN are set in .env
- Restart backend: `sudo supervisorctl restart backend`
- Check for typos in environment variable names

---

## Checking Logs

### Backend Logs:
```bash
# Real-time logs
tail -f /var/log/supervisor/backend.out.log

# Recent errors
tail -n 50 /var/log/supervisor/backend.err.log
```

### Successful WhatsApp Send:
Look for: `✅ WhatsApp notification sent successfully. Message SID: SMxxxx`

### Configuration Warning:
Look for: `⚠️ Warning: Twilio credentials not configured`

---

## Cost Information

### Twilio Pricing (as of 2025):
- **Trial Account:** Free credits to test
- **WhatsApp Sandbox:** Free for testing
- **Production WhatsApp Messages:**
  - User-initiated messages: ~$0.005/message
  - Business-initiated messages: ~$0.042/message

**Note:** Contact form submissions are business-initiated messages.

---

## Important Notes

1. **Sandbox Limitations:**
   - 24-hour session timeout (need to rejoin)
   - Limited to approved numbers
   - Not suitable for production

2. **Production Deployment:**
   - Apply for WhatsApp Business API approval
   - Complete business verification
   - Get your own WhatsApp number

3. **Phone Number Format:**
   - Always use E.164 format: `+[country_code][number]`
   - Include `whatsapp:` prefix for Twilio
   - Example: `whatsapp:+917992745514`

4. **Security:**
   - Never commit .env file to git
   - Keep Auth Token secret
   - Rotate credentials regularly

---

## Testing Checklist

- [ ] Twilio account created
- [ ] Account SID and Auth Token obtained
- [ ] WhatsApp Sandbox joined with +917992745514
- [ ] Environment variables configured in .env
- [ ] Backend server restarted
- [ ] Test message sent via curl
- [ ] Test message sent via frontend form
- [ ] WhatsApp notification received on +917992745514
- [ ] Message format looks correct
- [ ] Database entry created with whatsapp_sent flag

---

## Support Resources

- **Twilio Documentation:** [https://www.twilio.com/docs/whatsapp](https://www.twilio.com/docs/whatsapp)
- **WhatsApp Sandbox:** [https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn](https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn)
- **Twilio Console:** [https://console.twilio.com/](https://console.twilio.com/)
- **Twilio Support:** [https://support.twilio.com/](https://support.twilio.com/)

---

## Quick Start Commands

```bash
# 1. Edit environment variables
nano /app/backend/.env

# 2. Restart backend
sudo supervisorctl restart backend

# 3. Check logs
tail -f /var/log/supervisor/backend.out.log

# 4. Test API
curl -X POST http://localhost:8001/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","message":"Test WhatsApp"}'

# 5. Check MongoDB entries
mongosh aether_web --eval "db.contacts.find().pretty()"
```

---

**Need Help?** Check the logs first, then refer to the Troubleshooting section above.

**Status:** WhatsApp integration is ready to use once you add your Twilio credentials!
