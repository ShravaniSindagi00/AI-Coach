import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';

const GoogleCalendarSection = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newEvent, setNewEvent] = useState({ summary: '', start: '', end: '' });
  const [creating, setCreating] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

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
    if (!accessToken || !showCalendar) return;
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const now = new Date().toISOString();
        const res = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${now}&maxResults=10&orderBy=startTime&singleEvents=true&conferenceDataVersion=1`,
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
  }, [accessToken, creating, showCalendar]);

  // Helper: Get Google Meet link from event
  const getMeetLink = (event) => {
    if (event.conferenceData && event.conferenceData.entryPoints) {
      const videoEntry = event.conferenceData.entryPoints.find(e => e.entryPointType === 'video');
      if (videoEntry) return videoEntry.uri;
    }
    if (event.hangoutLink) return event.hangoutLink;
    return null;
  };

  // Filter for events with a Google Meet link
  const meetEvents = events.filter(event => getMeetLink(event));

  // Handle new event creation
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!accessToken) return;
    setCreating(true);
    setError(null);
    try {
      const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          summary: newEvent.summary,
          start: { dateTime: new Date(newEvent.start).toISOString() },
          end: { dateTime: new Date(newEvent.end).toISOString() },
          conferenceData: {
            createRequest: {
              requestId: `${Date.now()}-meet`,
              conferenceSolutionKey: { type: 'hangoutsMeet' }
            }
          }
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
    <div className="w-full max-w-2xl bg-white/80 dark:bg-neutral-900/80 rounded-3xl shadow-2xl p-10 mt-8 border-2 border-[var(--accent)] backdrop-blur-md animate-fade-in">
      <button
        className="mb-6 px-6 py-3 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-xl font-semibold shadow flex items-center gap-2 transition-all"
        onClick={() => setShowCalendar(v => !v)}
      >
        {showCalendar ? 'Hide Calendar' : 'Show Calendar'}
      </button>
      {showCalendar && <>
        <h3 className="text-2xl font-bold mb-6 text-blue-700 dark:text-blue-300 flex items-center gap-2">
          Google Meet Events
        </h3>
        {loading ? (
          <div>Loading events...</div>
        ) : error ? (
          <div className="text-red-600 mb-2">{error}</div>
        ) : (
          <ul className="mb-6">
            {meetEvents.length === 0 && <li className="text-neutral-500">No upcoming Google Meet events.</li>}
            {meetEvents.map((event) => {
              const meetLink = getMeetLink(event);
              return (
                <li key={event.id} className="mb-4 p-3 rounded-xl bg-blue-50/60 dark:bg-neutral-800/60 shadow flex flex-col">
                  <span className="font-semibold text-lg text-blue-900 dark:text-blue-200">
                    {event.summary}
                  </span>
                  <span className="text-xs text-neutral-500 mt-1">
                    {event.start?.dateTime ? new Date(event.start.dateTime).toLocaleString() : ''}
                  </span>
                  {meetLink && (
                    <a
                      href={meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold text-sm w-max shadow transition-all"
                    >
                      Join Meeting
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        )}
        <form onSubmit={handleCreateEvent} className="space-y-4 bg-blue-100/60 dark:bg-neutral-900/60 p-6 rounded-xl shadow-inner">
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-blue-900 dark:text-blue-200">
              Event title
            </label>
            <input
              type="text"
              placeholder="Event title"
              value={newEvent.summary}
              onChange={e => setNewEvent(ev => ({ ...ev, summary: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-blue-300 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)] bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-blue-900 dark:text-blue-200">
              Start time
            </label>
            <input
              type="datetime-local"
              value={newEvent.start}
              onChange={e => setNewEvent(ev => ({ ...ev, start: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-blue-300 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)] bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-blue-900 dark:text-blue-200">
              End time
            </label>
            <input
              type="datetime-local"
              value={newEvent.end}
              onChange={e => setNewEvent(ev => ({ ...ev, end: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-blue-300 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)] bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
              required
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold shadow transition-all"
            disabled={creating}
          >
            {creating ? 'Creating...' : 'Create Event'}
          </button>
        </form>
      </>}
    </div>
  );
};

export default GoogleCalendarSection; 