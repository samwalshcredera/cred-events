import { useNavigate } from "react-router-dom";
import { Globe, Calendar, MapPin } from "lucide-react";

interface GeoSummary {
  id: string;
  name: string;
  displayName: string;
  region: string;
  upcomingEventsCount: number;
}

// Mock data for now
const mockGeos: GeoSummary[] = [
  {
    id: "us-new-york",
    name: "New York",
    displayName: "New York, USA",
    region: "North America",
    upcomingEventsCount: 12,
  },
  {
    id: "us-san-francisco",
    name: "San Francisco",
    displayName: "San Francisco, USA",
    region: "North America",
    upcomingEventsCount: 8,
  },
  {
    id: "uk-london",
    name: "London",
    displayName: "London, UK",
    region: "EMEA",
    upcomingEventsCount: 15,
  },
  {
    id: "global",
    name: "Global",
    displayName: "Global Events",
    region: "Global",
    upcomingEventsCount: 5,
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  const handleGeoSelect = (geoId: string) => {
    navigate(`/geo/${geoId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <Globe className="mx-auto h-16 w-16 text-primary-600 mb-4" />
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Company Events Platform
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover, plan, and manage events across all our global locations
          </p>
        </div>

        {/* Geo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {mockGeos.map((geo) => (
            <div
              key={geo.id}
              className="bg-white rounded-lg shadow hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer transform hover:scale-105 transition-transform"
              onClick={() => handleGeoSelect(geo.id)}
            >
              <div className="bg-gradient-to-r from-primary-500 to-primary-700 h-24 flex items-center justify-center">
                <MapPin className="h-10 w-10 text-white" />
              </div>

              <div className="p-4">
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  {geo.name}
                </h2>
                <p className="text-sm text-gray-600 mb-3">{geo.region}</p>

                <div className="flex items-center text-primary-600 text-sm">
                  <Calendar className="h-4 w-4 mr-1.5" />
                  <span className="font-semibold">
                    {geo.upcomingEventsCount} events
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
