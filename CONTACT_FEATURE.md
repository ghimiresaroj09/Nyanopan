# Contact Us Feature

## Overview
A fully functional contact form page that allows customers to reach out with inquiries, support requests, or feedback.

## Files Created

### 1. Contact Page (`src/app/contact/page.tsx`)
- Main contact page with hero section
- Contact information display (email, phone, hours)
- Quick links to related pages
- Integrated contact form

### 2. Contact Form Component (`src/components/contact/contact-form.tsx`)
- Responsive form with validation
- Fields: name, email, phone, subject, message
- Real-time form state management
- Success/error message display
- Loading states during submission
- Accessible form labels and error messages

### 3. API Route (`src/app/api/contact/route.ts`)
- POST endpoint for form submissions
- Input validation (required fields, email format)
- Error handling
- Ready for email integration

## Form Schema

```typescript
{
  "name": "string",           // Required
  "email": "user@example.com", // Required, validated
  "phone": "string",           // Optional
  "subject": "string",         // Required (dropdown)
  "message": "string"          // Required
}
```

## Subject Options
- Product Inquiry
- Order Status
- Shipping
- Returns & Exchanges
- Wholesale
- Partnership Opportunity
- Other

## Features

✅ **Responsive Design** - Works on mobile, tablet, and desktop
✅ **Form Validation** - Client-side and server-side validation
✅ **Loading States** - Visual feedback during submission
✅ **Success/Error Messages** - Clear feedback to users
✅ **Accessible** - Proper ARIA labels and semantic HTML
✅ **Brand Styling** - Matches Nyanopan design system

## Navigation

The contact page is accessible via:
- Footer link: "Information" > "Contact Us"
- Direct URL: `/contact`

## Next Steps (Production)

To make the contact form fully functional in production:

### 1. Email Service Integration

**Option A: Resend (Recommended)**
```bash
npm install resend
```

Add to `.env`:
```
RESEND_API_KEY=your_api_key_here
```

Update `src/app/api/contact/route.ts`:
```typescript
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

// Inside the POST handler
const { data, error } = await resend.emails.send({
  from: 'contact@nyanopan.com',
  to: 'hello@nyanopan.com',
  subject: `Contact Form: ${body.subject}`,
  html: `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${body.name}</p>
    <p><strong>Email:</strong> ${body.email}</p>
    <p><strong>Phone:</strong> ${body.phone || 'Not provided'}</p>
    <p><strong>Subject:</strong> ${body.subject}</p>
    <p><strong>Message:</strong></p>
    <p>${body.message}</p>
  `,
});
```

**Option B: SendGrid**
```bash
npm install @sendgrid/mail
```

**Option C: AWS SES**
```bash
npm install @aws-sdk/client-ses
```

### 2. Database Storage (Optional)

Store submissions in a database for record-keeping:
- Use Prisma with PostgreSQL/MySQL
- Use MongoDB with Mongoose
- Use Supabase

### 3. Spam Protection

Add reCAPTCHA or hCaptcha:
```bash
npm install react-google-recaptcha
```

### 4. Rate Limiting

Implement rate limiting to prevent abuse:
```bash
npm install @upstash/ratelimit @upstash/redis
```

### 5. Auto-responder

Send confirmation email to the user when they submit the form.

## Testing

Visit `/contact` to test the form:
1. Fill in all required fields
2. Submit the form
3. Check browser console for submission data
4. Verify success message displays

## Styling

The form uses the Nyanopan brand colors:
- Background: `#fbf9f5`
- Primary text: `#28221c`
- Accent: `#a4642d`
- Borders: `#d8ccb6`
- Input backgrounds: `#fbf9f5`

## API Response Format

**Success (200):**
```json
{
  "success": true,
  "message": "Contact form submitted successfully"
}
```

**Validation Error (400):**
```json
{
  "error": "Missing required fields"
}
```

**Server Error (500):**
```json
{
  "error": "Internal server error"
}
```
