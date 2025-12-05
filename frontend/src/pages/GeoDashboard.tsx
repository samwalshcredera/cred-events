import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Search, Calendar, DollarSign, Users, ArrowLeft } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  startDateTime: string;
  location: {
    city: string;
  };
  budget: {
    total: number;
  };
  status: string;
}

// Mock data
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Q4 Town Hall',
    description: 'Company-wide quarterly update and Q&A session',
    startDateTime: '2025-12-15T14:00:00Z',
    location: { city: 'New York' },
    budget: { total: 5000 },
    status: 'published',
  },
  {
    id: '2',
    title: 'Holiday Party',
    description: 'Annual holiday celebration with dinner and entertainment',
    startDateTime: '2025-12-20T18:00:00Z',
    location: { city: 'New York' },
    budget: { total: 15000 },
    status: 'published',
  },
  {
    id: '3',
    title: 'Tech Workshop: AI & ML',
    description: 'Hands-on workshop exploring AI and machine learning applications',
    startDateTime: '2026-01-10T10:00:00Z',
    location: { city: 'New York' },
    budget: { total: 3000 },
    status: 'published',
  },
];

const mockStats = {
  totalEvents: 45,
  upcomingEvents: 12,
  totalBudget: 125000,
  totalAttendees: 850,
};

export default function GeoDashboard() {
  const { geoId } = useParams<{ geoId: string }>();
  const navigate = useNavigate();

  const geoName = geoId?.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  const handleCreateEvent = () => {
    navigate(`/geo/${geoId}/events/create`);
  };

  const handleEventClick = (eventId: string) => {
    navigate(`/geo/${geoId}/events/${eventId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {geoName} Events
                </h1>
                <p className="text-gray-600 mt-1">Event Dashboard</p>
              </div>
            </div>
            <button
              onClick={handleCreateEvent}
              className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Create Event
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Events</p>
                <p className="text-3xl font-bold text-gray-900">{mockStats.totalEvents}</p>
              </div>
              <Calendar className="h-12 w-12 text-primary-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Upcoming</p>
                <p className="text-3xl font-bold text-gray-900">{mockStats.upcomingEvents}</p>
              </div>
              <Calendar className="h-12 w-12 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Budget</p>
                <p className="text-3xl font-bold text-gray-900">
                  ${mockStats.totalBudget.toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-12 w-12 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Attendees</p>
                <p className="text-3xl font-bold text-gray-900">{mockStats.totalAttendees}</p>
              </div>
              <Users className="h-12 w-12 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Events List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Upcoming Events</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {mockEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => handleEventClick(event.id)}
                className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 mb-2">{event.description}</p>
                    <div className="flex gap-4 text-sm text-gray-500">
                      <span>📅 {new Date(event.startDateTime).toLocaleDateString()}</span>
                      <span>📍 {event.location.city}</span>
                      <span>💰 ${event.budget.total.toLocaleString()}</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                    {event.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
