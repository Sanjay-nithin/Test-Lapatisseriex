# Order Email Logging Documentation

## Overview
Comprehensive logging has been added to track email sending for order placement and payment verification. This helps debug which API URL is being used (Vercel vs Render) and whether emails are successfully sent.

## What Was Added

### 1. Frontend Logging (Payment.jsx)

#### When Creating Order (COD & Online)
```javascript
═════════════════════════════════════════════════════════════
📧 [ORDER EMAIL] Creating order - Will trigger confirmation emails
🌐 API URL Used: https://test-lapatisseriex.vercel.app/api
👤 User Email: customer@example.com
💰 Order Amount: 500
💳 Payment Method: cod
═════════════════════════════════════════════════════════════
```

**Success Output:**
```javascript
✅ [ORDER EMAIL] Order created successfully!
📧 Order Number: ORD-123456
✉️ Confirmation email should be sent to: customer@example.com
✉️ Admin notification should be sent to active admins
═════════════════════════════════════════════════════════════
```

#### When Verifying Payment (Online Only)
```javascript
═════════════════════════════════════════════════════════════
📧 [PAYMENT EMAIL] Verifying payment - Will trigger success emails
🌐 API URL Used: https://test-lapatisseriex.vercel.app/api
👤 User Email: customer@example.com
💳 Payment ID: pay_xxxxxxxxxxxxx
📦 Order ID: order_xxxxxxxxxxxxx
═════════════════════════════════════════════════════════════
```

**Success Output:**
```javascript
✅ [PAYMENT EMAIL] Payment verified successfully!
📧 Order Number: ORD-123456
✉️ Payment success email should be sent to: customer@example.com
✉️ Admin order notification should be sent to active admins
═════════════════════════════════════════════════════════════
```

---

### 2. Backend Logging (paymentController.js)

#### COD Order Creation
```javascript
═══════════════════════════════════════════════════════════════
🎯 [PAYMENT CONTROLLER] COD Order Created - Triggering Emails
📦 Order Number: ORD-123456
═══════════════════════════════════════════════════════════════
📧 [PAYMENT CONTROLLER] Calling sendOrderConfirmationEmail()
✉️  Target: customer@example.com
✅ [PAYMENT CONTROLLER] Customer email sent: <message-id>

📧 [PAYMENT CONTROLLER] Calling sendOrderPlacedAdminNotification()
👥 Targets: admin1@example.com, admin2@example.com
✅ [PAYMENT CONTROLLER] Admin email sent: <message-id>

═══════════════════════════════════════════════════════════════
✅ [PAYMENT CONTROLLER] All COD order emails completed
═══════════════════════════════════════════════════════════════
```

#### Online Payment Verification
```javascript
═══════════════════════════════════════════════════════════════
🎯 [PAYMENT CONTROLLER] Online Payment Verified - Triggering Emails
📦 Order Number: ORD-123456
═══════════════════════════════════════════════════════════════
📧 [PAYMENT CONTROLLER] Calling sendOrderConfirmationEmail()
✉️  Target: customer@example.com
✅ [PAYMENT CONTROLLER] Customer email sent: <message-id>

📧 [PAYMENT CONTROLLER] Calling sendOrderPlacedAdminNotification()
👥 Targets: admin1@example.com, admin2@example.com
✅ [PAYMENT CONTROLLER] Admin email sent: <message-id>

═══════════════════════════════════════════════════════════════
✅ [PAYMENT CONTROLLER] All online payment emails completed
═══════════════════════════════════════════════════════════════
```

---

### 3. Email Service Logging (orderEmailService.js)

#### Customer Order Confirmation Email
```javascript
═══════════════════════════════════════════════════════════════
📧 [BACKEND] SENDING ORDER CONFIRMATION EMAIL
🌐 Backend Service: Vercel/Render (check deployment)
📮 SMTP Service: Gmail
✉️  Recipient: customer@example.com
📦 Order Number: ORD-123456
💰 Order Amount: 500
═══════════════════════════════════════════════════════════════
✅ Invoice PDF generated successfully
📤 Sending email via SMTP...
✅ [SUCCESS] Order confirmation email sent!
📧 Message ID: <abc123@gmail.com>
✉️  Delivered to: customer@example.com
═══════════════════════════════════════════════════════════════
```

#### Admin Order Notification Email
```javascript
═══════════════════════════════════════════════════════════════
📧 [BACKEND] SENDING ADMIN ORDER NOTIFICATION
🌐 Backend Service: Vercel/Render (check deployment)
📮 SMTP Service: Gmail
👥 Recipients: admin1@example.com, admin2@example.com
📦 Order Number: ORD-123456
💰 Order Amount: 500
═══════════════════════════════════════════════════════════════
✅ Invoice PDF generated for admin notification
📤 Sending admin notification email via SMTP...
✅ [SUCCESS] Admin order notification sent!
📧 Message ID: <xyz789@gmail.com>
👥 Delivered to: admin1@example.com, admin2@example.com
═══════════════════════════════════════════════════════════════
```

---

## How to Use These Logs

### Step 1: Check Frontend Console (Browser DevTools)
1. Open browser DevTools (F12)
2. Go to Console tab
3. Place an order (COD or online payment)
4. Look for logs starting with:
   - `📧 [ORDER EMAIL]` - When creating order
   - `📧 [PAYMENT EMAIL]` - When verifying payment
5. **Verify** the `🌐 API URL Used:` shows **Vercel URL** not Render URL

**Expected:**
```
🌐 API URL Used: https://test-lapatisseriex.vercel.app/api ✅
```

**NOT Expected:**
```
🌐 API URL Used: https://test-lapatisseriex.onrender.com/api ❌
```

---

### Step 2: Check Backend Logs (Terminal/Server Logs)

#### If Backend on Vercel:
1. Go to Vercel Dashboard
2. Select your project → Functions
3. View real-time logs
4. Look for:
   - `🎯 [PAYMENT CONTROLLER]` - Controller triggered
   - `📧 [BACKEND]` - Email service called
   - `✅ [SUCCESS]` - Email sent successfully

#### If Backend on Render:
1. Go to Render Dashboard
2. Select your service → Logs
3. View real-time logs
4. Look for same patterns above

---

### Step 3: Verify Email Routing

**Complete Flow Should Look Like:**

```
FRONTEND (Browser Console):
═════════════════════════════════════════════════════════════
📧 [ORDER EMAIL] Creating order - Will trigger confirmation emails
🌐 API URL Used: https://test-lapatisseriex.vercel.app/api
👤 User Email: test@example.com
💰 Order Amount: 500
💳 Payment Method: cod
═════════════════════════════════════════════════════════════
✅ [ORDER EMAIL] Order created successfully!

↓↓↓ API CALL TO VERCEL ↓↓↓

BACKEND (Server Logs):
═══════════════════════════════════════════════════════════════
🎯 [PAYMENT CONTROLLER] COD Order Created - Triggering Emails
📦 Order Number: ORD-123456
═══════════════════════════════════════════════════════════════
📧 [PAYMENT CONTROLLER] Calling sendOrderConfirmationEmail()
✉️  Target: test@example.com

↓↓↓ CALLS EMAIL SERVICE ↓↓↓

═══════════════════════════════════════════════════════════════
📧 [BACKEND] SENDING ORDER CONFIRMATION EMAIL
🌐 Backend Service: Vercel/Render (check deployment)
📮 SMTP Service: Gmail
✉️  Recipient: test@example.com
📦 Order Number: ORD-123456
═══════════════════════════════════════════════════════════════
📤 Sending email via SMTP...
✅ [SUCCESS] Order confirmation email sent!
📧 Message ID: <message-id@gmail.com>
═══════════════════════════════════════════════════════════════
```

---

## Troubleshooting

### Problem: Frontend shows Render URL instead of Vercel URL

**Solution:**
1. Check `.env` file has `VITE_VERCEL_API_URL` (not `VERCEL_API_URL`)
2. Restart your dev server (Vite only reads .env on startup)
3. Clear browser cache and reload

### Problem: Backend logs not showing

**Solution:**
1. Check which backend instance is responding (Vercel or Render)
2. Verify you're looking at the correct deployment logs
3. Add `console.log('Backend is alive on:', process.env.NODE_ENV)` to verify

### Problem: No email received

**Check these logs in sequence:**

1. ✅ Frontend shows `[ORDER EMAIL]` with correct Vercel URL
2. ✅ Backend shows `[PAYMENT CONTROLLER] Calling sendOrderConfirmationEmail()`
3. ✅ Backend shows `[BACKEND] SENDING ORDER CONFIRMATION EMAIL`
4. ✅ Backend shows `[SUCCESS] Order confirmation email sent!`
5. ❌ Email still not received → Check spam folder or Gmail SMTP credentials

---

## Files Modified

### Frontend
- `LapatisseriexFrontned/src/components/Payment/Payment.jsx`
  - Added logging in `createOrder()` function
  - Added logging in payment verification handler

### Backend
- `backend/controllers/paymentController.js`
  - Added logging in COD order creation flow
  - Added logging in online payment verification flow

- `backend/utils/orderEmailService.js`
  - Added logging in `sendOrderConfirmationEmail()` function
  - Added logging in `sendOrderPlacedAdminNotification()` function

---

## Quick Reference - Log Markers

| Emoji | Meaning | Location |
|-------|---------|----------|
| 📧 | Email operation | All layers |
| 🌐 | API URL/Backend service | Frontend & Backend |
| 📮 | SMTP service | Email service |
| ✉️ | Email recipient | All layers |
| 📦 | Order number | All layers |
| 💰 | Order amount | Frontend & Email service |
| 💳 | Payment method/ID | Frontend |
| 👤 | User email | Frontend |
| 👥 | Admin recipients | Backend |
| 🎯 | Controller triggered | Backend controller |
| ✅ | Success | All layers |
| ❌ | Error/Failure | All layers |
| ⚠️ | Warning | Backend |
| 📤 | Sending action | Email service |

---

## Testing Checklist

- [ ] Place COD order
- [ ] Check frontend console for `[ORDER EMAIL]` logs
- [ ] Verify API URL shows Vercel URL
- [ ] Check backend logs for `[PAYMENT CONTROLLER]` logs
- [ ] Check backend logs for `[BACKEND]` email service logs
- [ ] Verify `[SUCCESS]` message appears
- [ ] Check customer email inbox
- [ ] Check admin email inbox
- [ ] Repeat for online payment (Razorpay)
- [ ] Check frontend console for `[PAYMENT EMAIL]` logs
- [ ] Verify payment verification uses Vercel URL
- [ ] Confirm emails received for online payment

---

## Notes

- All email-related API calls should route to **Vercel** (VITE_VERCEL_API_URL)
- All non-email API calls should route to **Render** (VITE_API_URL)
- Emails are sent asynchronously so order response is immediate
- Email failures don't block order creation
- Both customer and admin emails sent in parallel
- Logs use separators (`═══`) for easy visual scanning
