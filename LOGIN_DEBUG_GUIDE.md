# Google Login Troubleshooting Guide

## 🔍 Debug Steps:

### Step 1: Open Browser Console
Before clicking login, open browser console (F12) → Console tab

### Step 2: Click Login
Click "Continue with Google" button

### Step 3: Check Console Logs
After authentication, check console for these messages:
```
AuthCallback - Full URL: ...
AuthCallback - Hash: ...
AuthCallback - Search: ...
Session ID from hash: ...
Exchanging session_id: ...
Session exchange response: ...
Login successful, navigating to chat
```

### Step 4: Check Backend Logs
```bash
tail -f /var/log/supervisor/backend.out.log
```

Look for these emoji indicators:
- 🔐 Received session exchange request
- 📡 Emergent Auth response status
- ✅ User data received
- ♻️ Updating existing user OR ➕ Creating new user
- 🎫 Creating session
- ✅ Session exchange successful

---

## Common Issues & Fixes:

### Issue 1: "No session_id found in URL"
**Cause:** Redirect URL mismatch
**Fix:** 
1. Check that redirect URL in Login.js matches: `{origin}/auth/callback`
2. Verify the URL in browser after Google auth
3. Should contain `#session_id=...` or `?session_id=...`

### Issue 2: "Invalid session ID" (401 error)
**Cause:** Session expired or invalid
**Fix:**
1. Try logging in again
2. Clear browser cookies
3. Check backend logs for Emergent Auth response

### Issue 3: "Authentication failed" alert
**Cause:** Session exchange with backend failed
**Fix:**
1. Check backend is running: `sudo supervisorctl status backend`
2. Check backend logs: `tail -f /var/log/supervisor/backend.out.log`
3. Verify BACKEND_URL in frontend .env matches your URL
4. Check CORS settings allow your origin

### Issue 4: Stuck on "Authenticating..." screen
**Cause:** API request hanging or failing silently
**Fix:**
1. Open browser DevTools → Network tab
2. Look for `/api/auth/session` request
3. Check if request completed and response
4. Verify backend is responding: `curl http://localhost:8001/api/health`

### Issue 5: Session cookie not set
**Cause:** CORS or secure cookie issues
**Fix:**
1. Check browser cookies (DevTools → Application → Cookies)
2. Look for `session_token` cookie
3. Verify `samesite=none` and `secure=true` in backend
4. Check CORS allows credentials: `allow_credentials=True`

---

## Manual Test:

### Test 1: Check Backend Health
```bash
curl http://localhost:8001/api/health
# Should return: {"status":"healthy","service":"AtmosAether API"}
```

### Test 2: Check Frontend is Serving
```bash
curl -I http://localhost:3000
# Should return: HTTP/1.1 200 OK
```

### Test 3: Check Services
```bash
sudo supervisorctl status
# All should show RUNNING
```

---

## Step-by-Step Login Process:

1. **Visit** http://localhost:3000
2. **Click** floating chat button (💬) OR navigate to /login
3. **See** login page with Google button
4. **Click** "Continue with Google"
5. **Redirect** to Google OAuth (auth.emergentagent.com)
6. **Authenticate** with your Google account
7. **Redirect** back to your app at `/auth/callback#session_id=...`
8. **Auto-process** session exchange
9. **Redirect** to `/chat` page
10. **Start chatting!**

---

## Real-Time Debugging:

Open 3 terminal windows:

**Terminal 1: Backend logs**
```bash
tail -f /var/log/supervisor/backend.out.log
```

**Terminal 2: Frontend logs**
```bash
tail -f /var/log/supervisor/frontend.out.log
```

**Terminal 3: MongoDB query**
```bash
# After login attempt, check if session was created
mongosh aether_web --eval "db.user_sessions.find().pretty()"
mongosh aether_web --eval "db.users.find().pretty()"
```

---

## Quick Fixes:

### Fix 1: Restart Everything
```bash
sudo supervisorctl restart all
```

### Fix 2: Clear Browser Data
- Press Ctrl+Shift+Delete
- Clear cookies and cache
- Try logging in again

### Fix 3: Check Environment Variables
```bash
cat /app/frontend/.env
# Should show: REACT_APP_BACKEND_URL=...

cat /app/backend/.env
# Should show: MONGO_URL=...
```

---

## Expected Flow (No Errors):

```
User clicks login
  ↓
Redirects to Google OAuth
  ↓
User authenticates
  ↓
Returns with session_id in URL
  ↓
Frontend extracts session_id
  ↓
POST /api/auth/session with session_id
  ↓
Backend exchanges with Emergent Auth
  ↓
Backend creates/updates user in DB
  ↓
Backend creates session in DB
  ↓
Backend sets httpOnly cookie
  ↓
Backend returns user data
  ↓
Frontend navigates to /chat
  ↓
SUCCESS! ✅
```

---

## Still Not Working?

1. **Check browser console** - Look for error messages
2. **Check backend logs** - Look for 🔐 and ❌ emoji
3. **Check network tab** - See actual API requests/responses
4. **Verify URLs** - Make sure all URLs are correct
5. **Test APIs directly** - Use curl to test endpoints

### Share These For Help:
- Browser console logs (screenshot)
- Backend log output (last 50 lines)
- Network tab showing /api/auth/session request
- Current URL after Google redirect

---

**The authentication is now fully instrumented with detailed logging to help identify any issues!**
