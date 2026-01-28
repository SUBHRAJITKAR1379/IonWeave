#!/bin/bash

echo "=========================================="
echo "  WhatsApp Integration Diagnostic"
echo "=========================================="
echo ""

echo "1️⃣  Checking Twilio Credentials..."
echo "-----------------------------------"
if grep -q "your_account_sid_here" /app/backend/.env; then
    echo "❌ PROBLEM FOUND: Credentials are still placeholders!"
    echo ""
    echo "   Current values in .env:"
    cat /app/backend/.env | grep TWILIO
    echo ""
    echo "   ⚠️  YOU NEED TO:"
    echo "   1. Go to https://console.twilio.com/"
    echo "   2. Copy your Account SID and Auth Token"
    echo "   3. Run: nano /app/backend/.env"
    echo "   4. Replace 'your_account_sid_here' with your real Account SID"
    echo "   5. Replace 'your_auth_token_here' with your real Auth Token"
    echo "   6. Save file (Ctrl+X, Y, Enter)"
    echo "   7. Run: sudo supervisorctl restart backend"
    echo ""
else
    echo "✅ Credentials are configured (not default placeholders)"
    echo ""
    echo "   Account SID: $(grep TWILIO_ACCOUNT_SID /app/backend/.env | cut -d'=' -f2)"
    echo "   Auth Token: $(grep TWILIO_AUTH_TOKEN /app/backend/.env | cut -d'=' -f2 | head -c 10)..."
    echo "   From Number: $(grep TWILIO_WHATSAPP_FROM /app/backend/.env | cut -d'=' -f2)"
    echo "   To Number: $(grep TWILIO_WHATSAPP_TO /app/backend/.env | cut -d'=' -f2)"
    echo ""
fi

echo ""
echo "2️⃣  Checking Backend Service..."
echo "-----------------------------------"
backend_status=$(sudo supervisorctl status backend | awk '{print $2}')
if [ "$backend_status" == "RUNNING" ]; then
    echo "✅ Backend is RUNNING"
else
    echo "❌ Backend is NOT running: $backend_status"
    echo "   Fix: sudo supervisorctl restart backend"
fi

echo ""
echo "3️⃣  Checking Recent Logs..."
echo "-----------------------------------"
if tail -n 20 /var/log/supervisor/backend.out.log | grep -q "✅ Twilio WhatsApp client initialized successfully"; then
    echo "✅ Twilio client initialized"
else
    echo "❌ Twilio client NOT initialized"
fi

if tail -n 50 /var/log/supervisor/backend.out.log | grep -q "❌ Twilio error"; then
    echo "❌ WhatsApp sending FAILED - Recent errors:"
    tail -n 50 /var/log/supervisor/backend.out.log | grep "❌ Twilio error" | tail -3
    echo ""
fi

if tail -n 50 /var/log/supervisor/backend.out.log | grep -q "✅ WhatsApp notification sent successfully"; then
    echo "✅ WhatsApp messages ARE being sent successfully!"
    echo "   Last successful sends:"
    tail -n 50 /var/log/supervisor/backend.out.log | grep "✅ WhatsApp notification sent" | tail -2
else
    echo "⚠️  No successful WhatsApp sends found in recent logs"
fi

echo ""
echo "4️⃣  Testing API Connection..."
echo "-----------------------------------"
response=$(curl -s -X POST http://localhost:8001/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Diagnostic Test","email":"test@test.com","message":"Diagnostic check"}' 2>&1)

if echo "$response" | grep -q '"whatsapp_notification": "sent"'; then
    echo "✅ API TEST PASSED - WhatsApp notification SENT!"
    echo "   Check WhatsApp on +917992745514"
elif echo "$response" | grep -q '"whatsapp_notification": "not_configured"'; then
    echo "❌ API TEST FAILED - WhatsApp not configured"
    echo "   Response: $response"
else
    echo "⚠️  API response: $response"
fi

echo ""
echo "=========================================="
echo "  SUMMARY & NEXT STEPS"
echo "=========================================="
echo ""

if grep -q "your_account_sid_here" /app/backend/.env; then
    echo "🔴 MAIN ISSUE: Twilio credentials are not configured"
    echo ""
    echo "📋 QUICK FIX:"
    echo "   1. Get credentials: https://console.twilio.com/"
    echo "   2. Edit file: nano /app/backend/.env"
    echo "   3. Update TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN"
    echo "   4. Save and exit"
    echo "   5. Restart: sudo supervisorctl restart backend"
    echo "   6. Run this diagnostic again"
    echo ""
    echo "📖 Detailed Guide: /app/SETUP_TWILIO_NOW.md"
else
    if tail -n 50 /var/log/supervisor/backend.out.log | grep -q "❌ Twilio error.*Authentication Error"; then
        echo "🟡 ISSUE: Credentials configured but authentication failing"
        echo ""
        echo "📋 POSSIBLE CAUSES:"
        echo "   1. Wrong Account SID or Auth Token"
        echo "   2. Extra spaces in .env file"
        echo "   3. Credentials need to be regenerated"
        echo ""
        echo "📋 FIX:"
        echo "   1. Go to https://console.twilio.com/"
        echo "   2. Verify your Account SID"
        echo "   3. Regenerate Auth Token if needed"
        echo "   4. Update /app/backend/.env"
        echo "   5. sudo supervisorctl restart backend"
    elif tail -n 50 /var/log/supervisor/backend.out.log | grep -q "✅ WhatsApp notification sent successfully"; then
        echo "🟢 ALL GOOD! WhatsApp integration is working!"
        echo ""
        echo "✅ Messages are being sent to: +917992745514"
        echo "✅ Test the contact form: http://localhost:3000"
    else
        echo "🟡 STATUS: Credentials configured but no test sends yet"
        echo ""
        echo "📋 NEXT STEPS:"
        echo "   1. Make sure you joined WhatsApp sandbox from +917992745514"
        echo "   2. Test the contact form"
        echo "   3. Check WhatsApp for notification"
    fi
fi

echo ""
echo "=========================================="
echo "For detailed setup: cat /app/SETUP_TWILIO_NOW.md"
echo "=========================================="
