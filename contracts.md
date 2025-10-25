# API Contracts - Designs with Joy

## Google Calendar Integration

### Overview
The application integrates with Google Calendar to allow users to book 15-minute discovery calls directly to their Google Calendar.

### Authentication Flow

**1. Start OAuth Flow**
- **Endpoint**: `POST /api/calendar/auth/start`
- **Request Body**:
```json
{
  "email": "user@example.com",
  "name": "User Name"
}
```
- **Response**:
```json
{
  "authorization_url": "https://accounts.google.com/o/oauth2/auth?...",
  "state": "random_state_string"
}
```

**2. OAuth Callback**
- **Endpoint**: `GET /api/calendar/auth/callback?code=xxx&state=xxx`
- **Response**:
```json
{
  "success": true,
  "email": "user@example.com",
  "google_email": "user@gmail.com"
}
```

**3. Check Auth Status**
- **Endpoint**: `GET /api/calendar/auth/status?email=user@example.com`
- **Response**:
```json
{
  "authenticated": true,
  "google_email": "user@gmail.com"
}
```

### Calendar Events

**1. Create Event**
- **Endpoint**: `POST /api/calendar/events`
- **Request Body**:
```json
{
  "email": "user@example.com",
  "title": "Discovery Call - Interior Design Consultation",
  "description": "Meeting details...",
  "start": "2024-01-15T10:00:00Z",
  "end": "2024-01-15T10:15:00Z",
  "attendees": [
    {"email": "user@example.com"},
    {"email": "hello@designswithjoy.com"}
  ]
}
```
- **Response**:
```json
{
  "success": true,
  "event": {
    "id": "event_id",
    "htmlLink": "https://calendar.google.com/...",
    ...
  },
  "message": "Event created successfully"
}
```

**2. List Events**
- **Endpoint**: `GET /api/calendar/events?email=user@example.com`
- **Response**:
```json
{
  "success": true,
  "events": [...]
}
```

## Frontend Components

### CalendarBooking Component
Multi-step booking form with the following steps:
1. **Contact Information**: Name, Email, Phone
2. **Date & Time Selection**: Calendar date picker + time slots
3. **Google Auth**: OAuth flow integration
4. **Confirmation**: Review and confirm booking
5. **Success**: Booking confirmation

### Database Models

**Users Collection**
```javascript
{
  email: String,
  name: String,
  google_email: String,
  google_tokens: {
    access_token: String,
    refresh_token: String,
    token_uri: String,
    expires_in: Number
  },
  authenticated_at: DateTime
}
```

**Auth States Collection** (Temporary)
```javascript
{
  state: String,
  email: String,
  name: String,
  created_at: DateTime
}
```

## Environment Variables

### Backend (.env)
```
GOOGLE_CLIENT_ID=319800106750-7mjit4bn80cetqg6s1io1petfqp3vhtq.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback
```

## Implementation Status

✅ **Completed**
- Google OAuth2 authentication flow
- Calendar event creation
- Multi-step booking form UI
- Auth callback handling
- Token refresh mechanism
- MongoDB data persistence

⚠️ **Using Mock Data** (Frontend Only)
- None - All functionality is fully integrated with backend

## Testing Notes

To test the integration:
1. Click "Discovery Call - 15 minutes" button
2. Fill in contact information
3. Select date and time
4. Authorize Google Calendar (popup window)
5. Confirm booking details
6. Event will be created in Google Calendar

The OAuth callback requires the redirect URI to be properly configured in Google Cloud Console.
