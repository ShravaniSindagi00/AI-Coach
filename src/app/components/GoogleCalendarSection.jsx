import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';

const GoogleCalendarSection = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newEvent, setNewEvent] = useState({ summary: '', start: '', end: '' });
  const [creating, setCreating] = useState(false);

  // Fetch access token
  useEffect(() => {
    const fetchToken = async () => {
      const session = await supabase.auth.getSession();
      setAccessToken(session.data.session?.provider_token || null);
    };
    fetchToken();
  }, []);

  // Fetch events
  useEffect(() => {
    if (!accessToken) return;
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const now = new Date().toISOString();
        const res = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${now}&maxResults=5&orderBy=startTime&singleEvents=true`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        if (!res.ok) throw new Error('Failed to fetch events');
        const data = await res.json();
        setEvents(data.items || []);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };
    fetchEvents();
  }, [accessToken, creating]);

  // Handle new event creation
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!accessToken) return;
    setCreating(true);
    setError(null);
    try {
      const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          summary: newEvent.summary,
          start: { dateTime: new Date(newEvent.start).toISOString() },
          end: { dateTime: new Date(newEvent.end).toISOString() },
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error?.message || 'Failed to create event');
      }
      setNewEvent({ summary: '', start: '', end: '' });
    } catch (err) {
      setError(err.message);
    }
    setCreating(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload(); // Force reload to clear all state
  };

  return (
    <div className="w-full max-w-2xl bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-6 mt-6">
      <h3 className="text-lg font-bold mb-4 text-blue-700 dark:text-blue-300">Google Calendar Events</h3>
      {loading ? (
        <div>Loading events...</div>
      ) : error ? (
        <div className="text-red-600 mb-2">{error}</div>
      ) : (
        <ul className="mb-4">
          {events.length === 0 && <li className="text-neutral-500">No upcoming events.</li>}
          {events.map((event) => (
            <li key={event.id} className="mb-2">
              <span className="font-semibold">{event.summary}</span>
              <br />
              <span className="text-xs text-neutral-500">
                {event.start?.dateTime ? new Date(event.start.dateTime).toLocaleString() : ''}
              </span>
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={handleCreateEvent} className="space-y-2">
        <div>
          <input
            type="text"
            placeholder="Event title"
            value={newEvent.summary}
            onChange={e => setNewEvent(ev => ({ ...ev, summary: e.target.value }))}
            className="w-full px-2 py-1 rounded border"
            required
          />
        </div>
        <div>
          <input
            type="datetime-local"
            value={newEvent.start}
            onChange={e => setNewEvent(ev => ({ ...ev, start: e.target.value }))}
            className="w-full px-2 py-1 rounded border"
            required
          />
        </div>
        <div>
          <input
            type="datetime-local"
            value={newEvent.end}
            onChange={e => setNewEvent(ev => ({ ...ev, end: e.target.value }))}
            className="w-full px-2 py-1 rounded border"
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
          disabled={creating}
        >
          {creating ? 'Creating...' : 'Create Event'}
        </button>
      </form>
    </div>
  );
};

export default GoogleCalendarSection; 