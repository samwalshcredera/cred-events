import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo, useRef, useEffect } from "react";
import {
  Plus,
  Search,
  Calendar,
  DollarSign,
  Users,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Edit,
  Filter,
  X,
} from "lucide-react";
import { useEventsStore } from "../store/eventsStore";

const mockStats = {
  totalEvents: 45,
  upcomingEvents: 12,
  totalBudget: 125000,
  totalAttendees: 850,
};

export default function GeoDashboard() {
  const { geoId } = useParams<{ geoId: string }>();
  const navigate = useNavigate();
  const getEventsByGeo = useEventsStore((state) => state.getEventsByGeo);
  const events = geoId ? getEventsByGeo(geoId) : [];
  
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    timeframe: "all",
    minBudget: "",
    maxBudget: "",
  });
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const geoName = geoId
    ?.split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // Sort events by date
  const sortedEvents = useMemo(() => {
    return [...events].sort(
      (a, b) =>
        new Date(a.startDateTime).getTime() -
        new Date(b.startDateTime).getTime()
    );
  }, [events]);

  // Filter events based on search query and filters
  const filteredEvents = useMemo(() => {
    let result = sortedEvents;

    // Text search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((event) => {
        return (
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.status.toLowerCase().includes(query)
        );
      });
    }

    // Status filter
    if (filters.status !== "all") {
      result = result.filter((event) => event.status === filters.status);
    }

    // Timeframe filter
    const now = new Date();
    if (filters.timeframe === "upcoming") {
      result = result.filter((event) => new Date(event.startDateTime) >= now);
    } else if (filters.timeframe === "past") {
      result = result.filter((event) => new Date(event.startDateTime) < now);
    } else if (filters.timeframe === "this-week") {
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      result = result.filter((event) => {
        const eventDate = new Date(event.startDateTime);
        return eventDate >= now && eventDate <= weekFromNow;
      });
    } else if (filters.timeframe === "this-month") {
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      result = result.filter((event) => {
        const eventDate = new Date(event.startDateTime);
        return eventDate >= now && eventDate < nextMonth;
      });
    }

    // Budget filters
    if (filters.minBudget) {
      const minBudget = parseFloat(filters.minBudget);
      result = result.filter((event) => event.budget.total >= minBudget);
    }
    if (filters.maxBudget) {
      const maxBudget = parseFloat(filters.maxBudget);
      result = result.filter((event) => event.budget.total <= maxBudget);
    }

    return result;
  }, [searchQuery, sortedEvents, filters]);

  const clearFilters = () => {
    setFilters({
      status: "all",
      timeframe: "all",
      minBudget: "",
      maxBudget: "",
    });
    setSearchQuery("");
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.status !== "all") count++;
    if (filters.timeframe !== "all") count++;
    if (filters.minBudget) count++;
    if (filters.maxBudget) count++;
    if (searchQuery.trim()) count++;
    return count;
  }, [filters, searchQuery]);

  // Scroll to upcoming events on mount
  useEffect(() => {
    if (scrollContainerRef.current && filteredEvents.length > 0) {
      const now = new Date();
      const upcomingIndex = filteredEvents.findIndex(
        (event) => new Date(event.startDateTime) >= now
      );

      if (upcomingIndex !== -1) {
        const cardWidth = 400; // Approximate card width + gap
        const scrollPosition = upcomingIndex * cardWidth - 100; // Offset a bit
        scrollContainerRef.current.scrollTo({
          left: scrollPosition,
          behavior: "smooth",
        });
      }
    }
  }, [filteredEvents]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleCreateEvent = () => {
    navigate(`/geo/${geoId}/events/create`);
  };

  const handleEventClick = (eventId: string) => {
    navigate(`/geo/${geoId}/events/${eventId}`);
  };

  const handleEditEvent = (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card click
    navigate(`/geo/${geoId}/events/${eventId}/edit`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/")}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Events</p>
                <p className="text-3xl font-bold text-gray-900">
                  {mockStats.totalEvents}
                </p>
              </div>
              <Calendar className="h-12 w-12 text-primary-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Upcoming</p>
                <p className="text-3xl font-bold text-gray-900">
                  {mockStats.upcomingEvents}
                </p>
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
        </div>

        {/* Search Bar and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                showFilters
                  ? "bg-primary-600 text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Filter className="h-5 w-5" />
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-primary-700 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Filter Events
                </h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                >
                  <X className="h-4 w-4" />
                  Clear all
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) =>
                      setFilters({ ...filters, status: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="published">Published</option>
                    <option value="completed">Completed</option>
                    <option value="draft">Draft</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Timeframe Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timeframe
                  </label>
                  <select
                    value={filters.timeframe}
                    onChange={(e) =>
                      setFilters({ ...filters, timeframe: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="all">All Time</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="past">Past Events</option>
                    <option value="this-week">This Week</option>
                    <option value="this-month">This Month</option>
                  </select>
                </div>

                {/* Min Budget Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Budget ($)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={filters.minBudget}
                    onChange={(e) =>
                      setFilters({ ...filters, minBudget: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Max Budget Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Budget ($)
                  </label>
                  <input
                    type="number"
                    placeholder="No limit"
                    value={filters.maxBudget}
                    onChange={(e) =>
                      setFilters({ ...filters, maxBudget: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Events Timeline */}
        <div className="relative">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Event Timeline
                {(searchQuery || activeFilterCount > 0) && (
                  <span className="text-sm font-normal text-gray-600 ml-2">
                    ({filteredEvents.length} result
                    {filteredEvents.length !== 1 ? "s" : ""})
                  </span>
                )}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => scroll("left")}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-700" />
                </button>
                <button
                  onClick={() => scroll("right")}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="h-5 w-5 text-gray-700" />
                </button>
              </div>
            </div>

            {filteredEvents.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p className="text-lg">No events found</p>
                {(searchQuery || activeFilterCount > 0) && (
                  <p className="text-sm mt-2">
                    Try adjusting your search or filters
                  </p>
                )}
              </div>
            ) : (
              <div
                ref={scrollContainerRef}
                className="flex gap-6 overflow-x-auto pb-4 scroll-smooth"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "#CBD5E0 #F7FAFC",
                }}
              >
                {filteredEvents.map((event) => {
                  const eventDate = new Date(event.startDateTime);
                  const now = new Date();
                  const isPastEvent = eventDate < now;
                  const isToday =
                    eventDate.toDateString() === now.toDateString();
                  const daysUntil = Math.ceil(
                    (eventDate.getTime() - now.getTime()) /
                      (1000 * 60 * 60 * 24)
                  );

                  return (
                    <div
                      key={event.id}
                      onClick={() => handleEventClick(event.id)}
                      className={`flex-shrink-0 w-96 bg-white rounded-lg border-2 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                        isPastEvent
                          ? "border-gray-200 opacity-60 hover:opacity-80"
                          : isToday
                          ? "border-primary-500 shadow-md"
                          : "border-gray-300 hover:border-primary-400"
                      }`}
                    >
                      {/* Date Header */}
                      <div
                        className={`px-6 py-4 border-b ${
                          isPastEvent
                            ? "bg-gray-50 border-gray-200"
                            : isToday
                            ? "bg-primary-50 border-primary-200"
                            : "bg-blue-50 border-blue-200"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p
                              className={`text-sm font-semibold ${
                                isPastEvent
                                  ? "text-gray-600"
                                  : isToday
                                  ? "text-primary-700"
                                  : "text-blue-700"
                              }`}
                            >
                              {eventDate.toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>
                            <p
                              className={`text-xs mt-1 ${
                                isPastEvent
                                  ? "text-gray-500"
                                  : isToday
                                  ? "text-primary-600"
                                  : "text-blue-600"
                              }`}
                            >
                              {isPastEvent
                                ? "Past Event"
                                : isToday
                                ? "Today"
                                : daysUntil === 1
                                ? "Tomorrow"
                                : `In ${daysUntil} days`}
                            </p>
                          </div>
                          <Calendar
                            className={`h-8 w-8 ${
                              isPastEvent
                                ? "text-gray-400"
                                : isToday
                                ? "text-primary-600"
                                : "text-blue-600"
                            }`}
                          />
                        </div>
                      </div>

                      {/* Event Content */}
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-2">
                          <h3
                            className={`text-xl font-bold flex-1 ${
                              isPastEvent ? "text-gray-700" : "text-gray-900"
                            }`}
                          >
                            {event.title}
                          </h3>
                          <button
                            onClick={(e) => handleEditEvent(event.id, e)}
                            className={`ml-2 p-2 rounded-lg transition-colors ${
                              isPastEvent
                                ? "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                                : "text-primary-600 hover:text-primary-700 hover:bg-primary-50"
                            }`}
                            aria-label="Edit event"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                        </div>
                        <p
                          className={`text-sm mb-4 line-clamp-2 ${
                            isPastEvent ? "text-gray-500" : "text-gray-600"
                          }`}
                        >
                          {event.description}
                        </p>

                        <div className="space-y-2">
                          <div
                            className={`flex items-center text-sm ${
                              isPastEvent ? "text-gray-500" : "text-gray-700"
                            }`}
                          >
                            <span className="mr-2">📍</span>
                            <span>{geoName}</span>
                          </div>
                          <div
                            className={`flex items-center text-sm ${
                              isPastEvent ? "text-gray-500" : "text-gray-700"
                            }`}
                          >
                            <span className="mr-2">💰</span>
                            <span>
                              ${event.budget.total.toLocaleString()} budget
                            </span>
                          </div>
                          {isPastEvent ? (
                            event.actualAttendees !== undefined && (
                              <div
                                className={`flex items-center text-sm ${
                                  isPastEvent ? "text-gray-500" : "text-gray-700"
                                }`}
                              >
                                <Users className="mr-2 h-4 w-4" />
                                <span>
                                  {event.actualAttendees} attended
                                  {event.expectedAttendees && (
                                    <span className="text-xs ml-1">
                                      (expected {event.expectedAttendees})
                                    </span>
                                  )}
                                </span>
                              </div>
                            )
                          ) : (
                            event.expectedAttendees !== undefined && (
                              <div
                                className={`flex items-center text-sm ${
                                  isPastEvent ? "text-gray-500" : "text-gray-700"
                                }`}
                              >
                                <Users className="mr-2 h-4 w-4" />
                                <span>
                                  ~{event.expectedAttendees} expected attendees
                                </span>
                              </div>
                            )
                          )}
                        </div>

                        {/* Tags */}
                        {event.tags && event.tags.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex flex-wrap gap-2">
                              {event.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                    isPastEvent
                                      ? "bg-gray-100 text-gray-600"
                                      : "bg-primary-100 text-primary-800"
                                  }`}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
