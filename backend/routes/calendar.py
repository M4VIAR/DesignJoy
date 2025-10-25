from fastapi import APIRouter, HTTPException, Query, Request
from fastapi.responses import RedirectResponse, JSONResponse
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import sys
from pathlib import Path

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

from google_calendar import (
    get_authorization_url,
    exchange_code_for_tokens,
    create_calendar_event,
    list_calendar_events
)

router = APIRouter(prefix="/calendar", tags=["calendar"])

class EventCreate(BaseModel):
    email: str
    title: str
    description: Optional[str] = ""
    start: str  # ISO format datetime
    end: str    # ISO format datetime
    attendees: Optional[List[dict]] = []

class AuthRequest(BaseModel):
    email: str
    name: str

@router.post("/auth/start")
async def start_auth(auth_request: AuthRequest, request: Request):
    """Start Google OAuth flow"""
    try:
        db = request.state.db
        authorization_url, state = get_authorization_url()
        
        # Store the state and user info temporarily
        await db.auth_states.insert_one({
            "state": state,
            "email": auth_request.email,
            "name": auth_request.name,
            "created_at": datetime.utcnow()
        })
        
        return {"authorization_url": authorization_url, "state": state}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/auth/callback")
async def auth_callback(code: str = Query(...), state: str = Query(...), request: Request = None):
    """Handle Google OAuth callback"""
    try:
        db = request.state.db
        # Exchange code for tokens
        tokens, user_info = await exchange_code_for_tokens(code)
        
        # Get the original request info
        auth_state = await db.auth_states.find_one({"state": state})
        
        if not auth_state:
            raise HTTPException(status_code=400, detail="Invalid state")
        
        # Store tokens in database
        await db.users.update_one(
            {"email": auth_state["email"]},
            {
                "$set": {
                    "email": auth_state["email"],
                    "name": auth_state["name"],
                    "google_email": user_info.get('email'),
                    "google_tokens": tokens,
                    "authenticated_at": datetime.utcnow()
                }
            },
            upsert=True
        )
        
        # Clean up auth state
        await db.auth_states.delete_one({"state": state})
        
        return {
            "success": True,
            "email": auth_state["email"],
            "google_email": user_info.get('email')
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/events")
async def create_event(event: EventCreate, request: Request):
    """Create a calendar event"""
    try:
        db = request.state.db
        created_event = await create_calendar_event(db, event.email, event.dict())
        return {
            "success": True,
            "event": created_event,
            "message": "Event created successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/events")
async def get_events(email: str = Query(...), request: Request = None):
    """Get upcoming calendar events"""
    try:
        db = request.state.db
        events = await list_calendar_events(db, email)
        return {"success": True, "events": events}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/auth/status")
async def check_auth_status(email: str = Query(...), request: Request = None):
    """Check if user is authenticated with Google Calendar"""
    try:
        db = request.state.db
        user = await db.users.find_one({"email": email})
        is_authenticated = user and 'google_tokens' in user
        
        return {
            "authenticated": is_authenticated,
            "google_email": user.get('google_email') if is_authenticated else None
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))