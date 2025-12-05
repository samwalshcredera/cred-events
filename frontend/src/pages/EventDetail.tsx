import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Clock,
} from "lucide-react";

export default function EventDetail() {
  const { geoId, eventId } = useParams();
  const navigate = useNavigate();

  // Mock event data
  const event = {
    id: eventId,
    title: "Q4 Town Hall",
    description:
      "Company-wide quarterly update and Q&A session with leadership. Join us for important updates about our progress, future plans, and an opportunity to ask questions.",
    startDateTime: "2025-12-15T14:00:00Z",
    endDateTime: "2025-12-15T16:00:00Z",
    location: {
      type: "hybrid",
      venue: "Main Conference Hall",
      address: "123 Business St, New York, NY 10001",
      city: "New York",
      meetingLink: "https://teams.microsoft.com/...",
    },
    eventType: "town-hall",
    department: "All Departments",
    budget: {
      total: 5000,
      currency: "USD",
      breakdown: [
        { category: "Catering", amount: 2500 },
        { category: "AV Equipment", amount: 1500 },
        { category: "Materials", amount: 1000 },
      ],
    },
    organizer: {
      name: "Jane Smith",
      email: "jane.smith@company.com",
    },
    expectedAttendees: 150,
    status: "published",
    tags: ["quarterly", "all-hands", "leadership"],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/geo/${geoId}`)}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Event Details
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Main Event Card */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-primary-500 to-primary-700 p-8 text-white">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2">{event.title}</h2>
                  <p className="text-blue-100 text-lg">
                    {event.eventType.replace("-", " ").toUpperCase()}
                  </p>
                </div>
                <span className="px-4 py-2 rounded-full text-sm font-semibold bg-white text-primary-700">
                  {event.status}
                </span>
              </div>
            </div>

            <div className="p-8">
              {/* Description */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {event.description}
                </p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Date & Time */}
                <div className="flex gap-3">
                  <Calendar className="h-6 w-6 text-primary-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Date & Time</p>
                    <p className="text-gray-600">
                      {new Date(event.startDateTime).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                    <p className="text-gray-600">
                      {new Date(event.startDateTime).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "numeric",
                          minute: "2-digit",
                        }
                      )}{" "}
                      -{" "}
                      {new Date(event.endDateTime).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex gap-3">
                  <MapPin className="h-6 w-6 text-primary-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Location</p>
                    <p className="text-gray-600">{event.location.venue}</p>
                    <p className="text-gray-600">{event.location.address}</p>
                    {event.location.type === "hybrid" && (
                      <p className="text-primary-600 text-sm mt-1">
                        Also available virtually
                      </p>
                    )}
                  </div>
                </div>

                {/* Budget */}
                <div className="flex gap-3">
                  <DollarSign className="h-6 w-6 text-primary-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Budget</p>
                    <p className="text-gray-600">
                      ${event.budget.total.toLocaleString()}{" "}
                      {event.budget.currency}
                    </p>
                  </div>
                </div>

                {/* Attendees */}
                <div className="flex gap-3">
                  <Users className="h-6 w-6 text-primary-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">
                      Expected Attendees
                    </p>
                    <p className="text-gray-600">
                      {event.expectedAttendees} people
                    </p>
                  </div>
                </div>
              </div>

              {/* Budget Breakdown */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Budget Breakdown
                </h3>
                <div className="space-y-3">
                  {event.budget.breakdown.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="text-gray-700 font-medium">
                        {item.category}
                      </span>
                      <span className="text-gray-900 font-semibold">
                        ${item.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Organizer */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Organizer
                </h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold text-lg">
                    {event.organizer.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {event.organizer.name}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {event.organizer.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
              Register for Event
            </button>
            <button className="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-lg border border-gray-300 transition-colors">
              Add to Calendar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
