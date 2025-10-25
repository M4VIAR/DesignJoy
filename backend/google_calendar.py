from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from google.auth.transport.requests import Request as GoogleRequest
import requests
import os
from datetime import datetime, timezone

CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID')
CLIENT_SECRET = os.environ.get('GOOGLE_CLIENT_SECRET')
REDIRECT_URI = os.environ.get('GOOGLE_REDIRECT_URI')

SCOPES = ['https://www.googleapis.com/auth/calendar']

CLIENT_CONFIG = {
    "web": {
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "redirect_uris": [REDIRECT_URI]
    }
}

def get_authorization_url():
    """Generate OAuth authorization URL"""
    flow = Flow.from_client_config(
        CLIENT_CONFIG,
        scopes=SCOPES,
        redirect_uri=REDIRECT_URI
    )
    
    authorization_url, state = flow.authorization_url(
        access_type='offline',
        prompt='consent',
        include_granted_scopes='true'
    )
    
    return authorization_url, state

async def exchange_code_for_tokens(code: str):
    """Exchange authorization code for access tokens"""
    token_response = requests.post(
        'https://oauth2.googleapis.com/token',
        data={
            'code': code,
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET,
            'redirect_uri': REDIRECT_URI,
            'grant_type': 'authorization_code'
        }
    )
    
    if token_response.status_code != 200:
        raise Exception(f"Token exchange failed: {token_response.text}")
    
    tokens = token_response.json()
    
    # Get user email
    user_info = requests.get(
        'https://www.googleapis.com/oauth2/v2/userinfo',
        headers={'Authorization': f'Bearer {tokens["access_token"]}'}
    ).json()
    
    return tokens, user_info

async def get_credentials(db, email: str):
    """Get and refresh credentials for a user"""
    user = await db.users.find_one({"email": email})
    if not user or 'google_tokens' not in user:
        return None
    
    tokens = user['google_tokens']
    
    creds = Credentials(
        token=tokens.get('access_token'),
        refresh_token=tokens.get('refresh_token'),
        token_uri='https://oauth2.googleapis.com/token',
        client_id=CLIENT_ID,
        client_secret=CLIENT_SECRET
    )
    
    # Refresh if expired
    if creds.expired and creds.refresh_token:
        creds.refresh(GoogleRequest())
        # Update tokens in database
        await db.users.update_one(
            {"email": email},
            {"$set": {"google_tokens.access_token": creds.token}}
        )
    
    return creds

async def create_calendar_event(db, email: str, event_data: dict):
    """Create a calendar event for the user"""
    creds = await get_credentials(db, email)
    if not creds:
        raise Exception("User not authenticated with Google Calendar")
    
    service = build('calendar', 'v3', credentials=creds)
    
    event = {
        'summary': event_data['title'],
        'description': event_data.get('description', ''),
        'start': {
            'dateTime': event_data['start'],
            'timeZone': 'UTC',
        },
        'end': {
            'dateTime': event_data['end'],
            'timeZone': 'UTC',
        },
        'attendees': event_data.get('attendees', []),
        'reminders': {
            'useDefault': False,
            'overrides': [
                {'method': 'email', 'minutes': 24 * 60},
                {'method': 'popup', 'minutes': 30},
            ],
        },
    }
    
    created_event = service.events().insert(calendarId='primary', body=event).execute()
    return created_event

async def list_calendar_events(db, email: str, max_results: int = 10):
    """List upcoming calendar events for the user"""
    creds = await get_credentials(db, email)
    if not creds:
        raise Exception("User not authenticated with Google Calendar")
    
    service = build('calendar', 'v3', credentials=creds)
    
    now = datetime.now(timezone.utc).isoformat()
    events_result = service.events().list(
        calendarId='primary',
        timeMin=now,
        maxResults=max_results,
        singleEvents=True,
        orderBy='startTime'
    ).execute()
    
    return events_result.get('items', [])