# Backend Integration - Contact Form

## Overview
The contact form is now integrated with your backend API at `https://nyanopan.onrender.com/api/v1/contact-us/`

## API Endpoint

**URL:** `https://nyanopan.onrender.com/api/v1/contact-us/`  
**Method:** `POST`  
**Content-Type:** `application/json`

## Request Payload

```json
{
  "name": "string",
  "email": "user@example.com",
  "phone": "string",
  "subject": "string",
  "message": "string"
}
```

## How It Works

### 1. Frontend Form (`/contact`)
- User fills out the contact form
- Client-side validation ensures required fields are filled
- Form data is sent to `/api/contact` (Next.js API route)

### 2. Next.js API Route (`/app/api/contact/route.ts`)
- Validates the form data
- Forwards the request to your backend API
- Handles responses and errors
- Returns formatted response to the frontend

### 3. Backend API (`https://nyanopan.onrender.com`)
- Receives the contact form data
- Processes the submission (saves to DB, sends emails, etc.)
- Returns success/error response

## Request Flow

```
User Form Submission
       ↓
Frontend (/contact)
       ↓
Next.js API (/api/contact)
       ↓ [POST Request]
Backend API (https://nyanopan.onrender.com/api/v1/contact-us/)
       ↓ [Response]
Next.js API
       ↓
Frontend (Success/Error Message)
```

## Error Handling

The integration includes comprehensive error handling:

### Client-Side Validation
- **Required fields:** name, email, subject, message
- **Email format validation**
- **Real-time field validation**

### Server-Side Validation
- Missing required fields → `400 Bad Request`
- Invalid email format → `400 Bad Request`
- Backend API errors → Appropriate status code with error message

### Network Errors
- Connection timeout → `503 Service Unavailable`
- Network issues → User-friendly error message

## Response Handling

### Success Response (200)
```json
{
  "success": true,
  "message": "Contact form submitted successfully",
  "data": { /* backend response data */ }
}
```

### Error Response (4xx/5xx)
```json
{
  "error": "Error message",
  "details": { /* additional error details */ }
}
```

## Frontend User Experience

### Success State
- ✅ Green success message displayed
- ✅ Form fields cleared
- ✅ User sees: "Thank you for reaching out! We'll get back to you within 24 hours."

### Error State
- ❌ Red error message displayed
- ❌ Form data preserved (user doesn't lose their input)
- ❌ Helpful error message with fallback email address

### Loading State
- ⏳ Submit button shows spinner
- ⏳ Button disabled during submission
- ⏳ "Sending..." text displayed

## Testing the Integration

### 1. Local Testing
Visit `http://localhost:3000/contact` and:
1. Fill out all required fields
2. Click "Send Message"
3. Check browser Network tab to see the API call
4. Verify success/error message displays

### 2. Production Testing
After deployment:
1. Navigate to your live site `/contact`
2. Submit a test form
3. Verify the backend receives the data
4. Check that emails/notifications are sent (if configured on backend)

## Environment Variables (Optional)

If you want to make the backend URL configurable:

### Create `.env.local`
```bash
NEXT_PUBLIC_BACKEND_URL=https://nyanopan.onrender.com
```

### Update `route.ts`
```typescript
const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_URL 
  ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/contact-us/`
  : "https://nyanopan.onrender.com/api/v1/contact-us/";
```

## Monitoring & Debugging

### Check Backend Logs
Monitor your Render.com dashboard for:
- Incoming POST requests to `/api/v1/contact-us/`
- Any errors in processing
- Response times

### Check Frontend Logs
Browser console will show:
- API request details
- Response data
- Any client-side errors

### Test Backend Directly
You can test the backend API directly using curl:

```bash
curl -X POST https://nyanopan.onrender.com/api/v1/contact-us/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+1234567890",
    "subject": "Test Subject",
    "message": "This is a test message"
  }'
```

## CORS Configuration

Make sure your backend allows requests from your frontend domain:

### Development
```
Origin: http://localhost:3000
```

### Production
```
Origin: https://your-domain.com
```

If you encounter CORS errors, update your backend to allow these origins.

## Security Considerations

✅ **Input Validation:** Both client and server validate inputs  
✅ **Email Validation:** Regex pattern validates email format  
✅ **Error Messages:** Don't expose sensitive backend details  
✅ **Rate Limiting:** Consider adding rate limiting on backend  
✅ **HTTPS:** All communication over secure HTTPS  

## Future Enhancements

1. **Rate Limiting:** Add rate limiting to prevent spam
2. **CAPTCHA:** Add reCAPTCHA for bot protection
3. **Auto-responder:** Send confirmation email to users
4. **Analytics:** Track form submission success rates
5. **File Uploads:** Allow users to attach files/images

## Troubleshooting

### Form Submission Fails
1. Check browser console for errors
2. Verify backend API is running (visit https://nyanopan.onrender.com)
3. Check network tab for API request/response
4. Verify CORS is configured correctly on backend

### Backend Not Receiving Data
1. Check payload structure matches backend expectations
2. Verify Content-Type header is set correctly
3. Check backend logs for incoming requests
4. Test backend API directly with curl/Postman

### Success Message Not Showing
1. Check if `response.ok` is true
2. Verify response data structure
3. Check console for any JavaScript errors
4. Ensure state updates are working correctly

## Support

For backend API issues:
- Check Render.com dashboard logs
- Review backend API documentation
- Test endpoints with Postman or curl

For frontend issues:
- Check browser console
- Review Next.js server logs
- Test with different browsers
