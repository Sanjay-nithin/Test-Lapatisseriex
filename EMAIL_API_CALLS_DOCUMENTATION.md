# Email-Related API Calls in Frontend

## Complete List of Files Making Email API Calls

Based on the codebase analysis, here are all the files that trigger email-related API calls from the frontend:

---

## 1. Authentication & User Management Emails

### File: `src/redux/authSlice.js`

#### Email APIs Called:

1. **Signup Welcome Email**
   - **Endpoint**: `POST /auth/signup/send-otp`
   - **Line**: 222
   - **Trigger**: When user signs up with email
   - **Email Type**: Welcome email with OTP verification
   - **Function**: `sendSignupOTP`
   ```javascript
   axios.post(`${API_URL}/auth/signup/send-otp`, { email })
   ```

2. **Signup Verification Email**
   - **Endpoint**: `POST /auth/signup/verify-otp`
   - **Line**: 254
   - **Trigger**: When user verifies signup OTP
   - **Email Type**: Account confirmation email
   - **Function**: `verifySignupOTP`
   ```javascript
   axios.post(`${API_URL}/auth/signup/verify-otp`, { email, otp, password, name, locationId })
   ```

3. **Forgot Password Email**
   - **Endpoint**: `POST /auth/forgot-password`
   - **Line**: 570
   - **Trigger**: When user requests password reset
   - **Email Type**: Password reset OTP email
   - **Function**: `sendPasswordResetOTP`
   ```javascript
   axios.post(`${API_URL}/auth/forgot-password`, { email })
   ```

4. **Password Reset Verification**
   - **Endpoint**: `POST /auth/verify-reset-otp`
   - **Line**: 590
   - **Trigger**: When user enters reset OTP
   - **Email Type**: OTP verification (may send confirmation)
   - **Function**: `verifyPasswordResetOTP`
   ```javascript
   axios.post(`${API_URL}/auth/verify-reset-otp`, { email, otp })
   ```

5. **Password Reset Confirmation Email**
   - **Endpoint**: `POST /auth/reset-password`
   - **Line**: 610
   - **Trigger**: When password is successfully reset
   - **Email Type**: Password changed confirmation email
   - **Function**: `resetPassword`
   ```javascript
   axios.post(`${API_URL}/auth/reset-password`, { email, newPassword })
   ```

---

### File: `src/services/apiService.js`

#### Email APIs Called:

6. **Email OTP Verification (Profile Update)**
   - **Endpoint**: `POST /email/send-otp`
   - **Line**: 337
   - **Trigger**: When user updates email in profile
   - **Email Type**: Email verification OTP
   - **Service**: `emailService.sendOtp`
   ```javascript
   api.post('/email/send-otp', { email })
   ```

7. **Email OTP Verification Confirmation**
   - **Endpoint**: `POST /email/verify-otp`
   - **Line**: 341
   - **Trigger**: When user verifies email OTP
   - **Email Type**: Email verification confirmation
   - **Service**: `emailService.verifyOtp`
   ```javascript
   api.post('/email/verify-otp', { email, otp })
   ```

---

## 2. Newsletter Subscription Emails

### File: `src/components/Newsletter/Newsletter.jsx`

8. **Newsletter Subscription (Homepage)**
   - **Endpoint**: `POST /newsletter/subscribe`
   - **Line**: 31
   - **Trigger**: When user subscribes via homepage newsletter section
   - **Email Type**: Newsletter subscription confirmation
   - **Source**: 'homepage'
   ```javascript
   axios.post(`${VITE_API_URL}/newsletter/subscribe`, { email, source: 'homepage' })
   ```

---

### File: `src/components/Footer/Footer.jsx`

9. **Newsletter Subscription (Footer)**
   - **Endpoint**: `POST /newsletter/subscribe`
   - **Line**: 44
   - **Trigger**: When user subscribes via footer
   - **Email Type**: Newsletter subscription confirmation
   - **Source**: 'footer'
   ```javascript
   axios.post(`${VITE_API_URL}/newsletter/subscribe`, { email, source: 'footer' })
   ```

---

## 3. Admin Newsletter Management Emails

### File: `src/components/Admin/AdminNewsletter.jsx`

10. **Custom Newsletter Email (Admin)**
    - **Endpoint**: `POST /newsletter/admin/send`
    - **Line**: 191
    - **Trigger**: When admin sends custom newsletter
    - **Email Type**: Custom newsletter to all subscribers
    - **Requires**: Admin authentication
    ```javascript
    axios.post(`${API_URL}/newsletter/admin/send`, { subject, title, body, ctaText, ctaLink })
    ```

**Other Admin Newsletter Endpoints (Non-Email)**:
- `GET /newsletter/admin/subscribers` - Fetch subscribers list (line 69)
- `GET /newsletter/admin/stats` - Get newsletter stats (line 93)
- `POST /newsletter/admin/add` - Add subscriber manually (line 112)
- `PUT /newsletter/admin/:id` - Update subscriber (line 138)
- `DELETE /newsletter/admin/:id` - Delete subscriber (line 165)

---

## 4. Contact Form Emails

### File: `src/pages/Contact.jsx`

11. **Contact Form Submission**
    - **Endpoint**: `POST /contact`
    - **Line**: 54
    - **Trigger**: When user submits contact form
    - **Email Type**: Contact form notification to admin + confirmation to user
    ```javascript
    fetch(`${VITE_API_URL}/contact`, {
      method: 'POST',
      body: JSON.stringify({ name, email, phone, subject, message })
    })
    ```

---

## 5. Order & Payment Emails

### File: `src/components/Payment/Payment.jsx`

12. **Order Creation Email**
    - **Endpoint**: `POST /payments/create-order`
    - **Line**: 504
    - **Trigger**: When user creates an order (Razorpay or COD)
    - **Email Type**: Order placed confirmation email
    ```javascript
    api.post('/payments/create-order', orderData)
    ```

13. **Payment Verification Email**
    - **Endpoint**: `POST /payments/verify`
    - **Line**: 559
    - **Trigger**: After successful Razorpay payment
    - **Email Type**: Payment success + order confirmation email
    ```javascript
    fetch(`${VITE_API_URL}/payments/verify`, {
      method: 'POST',
      body: JSON.stringify({ razorpay_order_id, razorpay_payment_id, razorpay_signature })
    })
    ```

---

## 6. Backend-Triggered Emails (Indirect from Frontend Actions)

These emails are triggered by backend events after frontend API calls:

### Order Status Update Emails
- **Triggered by**: Backend order status changes
- **Email Types**:
  - Order confirmed
  - Order preparing
  - Order ready for pickup/delivery
  - Order out for delivery
  - Order delivered
  - Order cancelled

### Product Newsletter Emails
- **File**: `backend/controllers/productController.js`
- **Triggered by**: Admin creating new products or discounts
- **Email Types**:
  - New product announcement newsletter
  - Discount announcement newsletter

---

## Summary Table

| # | Endpoint | Frontend File | Email Type | Trigger |
|---|----------|---------------|------------|---------|
| 1 | `POST /auth/signup/send-otp` | authSlice.js | Welcome/Signup OTP | User signup |
| 2 | `POST /auth/signup/verify-otp` | authSlice.js | Signup confirmation | OTP verification |
| 3 | `POST /auth/forgot-password` | authSlice.js | Password reset OTP | Forgot password |
| 4 | `POST /auth/verify-reset-otp` | authSlice.js | Reset OTP verification | Enter reset OTP |
| 5 | `POST /auth/reset-password` | authSlice.js | Password changed | Reset password |
| 6 | `POST /email/send-otp` | apiService.js | Email verification OTP | Profile email update |
| 7 | `POST /email/verify-otp` | apiService.js | Email verified | Verify email OTP |
| 8 | `POST /newsletter/subscribe` | Newsletter.jsx | Newsletter subscription | Subscribe (homepage) |
| 9 | `POST /newsletter/subscribe` | Footer.jsx | Newsletter subscription | Subscribe (footer) |
| 10 | `POST /newsletter/admin/send` | AdminNewsletter.jsx | Custom newsletter | Admin sends newsletter |
| 11 | `POST /contact` | Contact.jsx | Contact form | User submits contact |
| 12 | `POST /payments/create-order` | Payment.jsx | Order confirmation | Order placed |
| 13 | `POST /payments/verify` | Payment.jsx | Payment success | Payment verified |

---

## All Email-Related Backend Services

Located in `backend/utils/`:

1. **welcomeEmailService.js** - Sends welcome emails on signup
2. **passwordResetService.js** - Handles password reset emails
3. **orderEmailService.js** - Sends order-related emails
4. **newsletterEmailService.js** - Handles newsletter subscriptions and custom newsletters
5. **contactEmailService.js** - Sends contact form emails

---

## Email Endpoints That Should Route to Vercel

Based on the analysis, these endpoints should be routed to Vercel API:

```javascript
const EMAIL_API_ENDPOINTS = [
  '/auth/signup/send-otp',        // Welcome email
  '/auth/signup/verify-otp',      // Signup confirmation
  '/auth/forgot-password',        // Password reset OTP
  '/auth/verify-reset-otp',       // Reset OTP verification
  '/auth/reset-password',         // Password changed confirmation
  '/email/send-otp',              // Email verification OTP
  '/email/verify-otp',            // Email verified confirmation
  '/newsletter/subscribe',        // Newsletter subscription
  '/newsletter/admin/send',       // Custom newsletter (admin)
  '/contact',                     // Contact form emails
  '/payments/create-order',       // Order confirmation email
  '/payments/verify',             // Payment success email
];
```

---

## Notes

1. **Order Status Update Emails**: These are triggered by backend events (WebSocket or admin actions), not direct frontend API calls.

2. **Admin Notification Emails**: When orders are placed, backend automatically sends emails to admin users.

3. **Product Newsletter Emails**: Triggered by admin creating products with newsletter flags, not direct frontend calls.

4. **All email endpoints require proper email service configuration** on the backend (SMTP credentials).

5. **OTP Emails** have a 10-minute expiry time.

6. **Contact Form** sends emails to both admin and user (confirmation).
