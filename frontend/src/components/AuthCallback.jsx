import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('processing');

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');

      if (!code || !state) {
        setStatus('error');
        return;
      }

      try {
        const response = await axios.get(
          `${API}/calendar/auth/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`
        );

        if (response.data.success) {
          setStatus('success');
          // Close window after 2 seconds
          setTimeout(() => {
            window.close();
          }, 2000);
        } else {
          setStatus('error');
        }
      } catch (error) {
        console.error('Callback error:', error);
        setStatus('error');
      }
    };

    handleCallback();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F1E8]">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg">
        {status === 'processing' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#D4A574] mx-auto mb-4"></div>
            <h2 className="text-2xl font-medium text-[#4A4238] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              Connecting...
            </h2>
            <p className="text-[#8B7E74]">Please wait while we connect your Google Calendar</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-medium text-[#4A4238] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              Connected Successfully!
            </h2>
            <p className="text-[#8B7E74]">This window will close automatically...</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-medium text-[#4A4238] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              Connection Failed
            </h2>
            <p className="text-[#8B7E74] mb-4">Something went wrong. Please try again.</p>
            <button
              onClick={() => window.close()}
              className="px-6 py-2 bg-[#D4A574] hover:bg-[#C9A069] text-white rounded-lg"
            >
              Close Window
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
