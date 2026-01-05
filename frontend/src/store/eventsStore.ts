import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Event {
  id: string;
  title: string;
  description: string;
  startDateTime: string;
  budget: {
    total: number;
  };
  status: string;
  expectedAttendees?: number;
  actualAttendees?: number;
  tags?: string[];
}

interface GeoData {
  id: string;
  name: string;
  displayName: string;
  region: string;
  events: Event[];
}

interface EventsStore {
  geos: GeoData[];
  getGeoById: (geoId: string) => GeoData | undefined;
  getEventsByGeo: (geoId: string) => Event[];
  getEventById: (geoId: string, eventId: string) => Event | undefined;
  addEvent: (geoId: string, event: Event) => void;
  updateEvent: (geoId: string, eventId: string, updates: Partial<Event>) => void;
  deleteEvent: (geoId: string, eventId: string) => void;
}

const initialGeos: GeoData[] = [
  {
    id: "us-new-york",
    name: "New York",
    displayName: "New York, USA",
    region: "North America",
    events: [
      {
        id: "1",
        title: "Q4 Town Hall",
        description: "Company-wide quarterly update and Q&A session with Roy about how to go A to A",
        startDateTime: "2025-12-15T14:00:00Z",
        budget: { total: 5000 },
        status: "published",
        expectedAttendees: 150,
        tags: ["quarterly", "all-hands", "leadership"],
      },
      {
        id: "2",
        title: "Holiday Party",
        description: "Annual holiday celebration with dinner and entertainment hosted by Rohan",
        startDateTime: "2025-12-20T18:00:00Z",
        budget: { total: 15000 },
        status: "published",
        expectedAttendees: 200,
        tags: ["social", "annual", "celebration"],
      },
      {
        id: "3",
        title: "Tech Workshop: AI & ML",
        description: "Hands-on workshop exploring AI and machine learning applications presented by Tim Corp",
        startDateTime: "2026-01-10T10:00:00Z",
        budget: { total: 3000 },
        status: "published",
        expectedAttendees: 50,
        tags: ["workshop", "technical", "learning"],
      },
      {
        id: "7",
        title: "Wellness Wednesday: Yoga Session",
        description: "Weekly yoga and meditation class for employee wellness",
        startDateTime: "2025-12-17T17:30:00Z",
        budget: { total: 500 },
        status: "published",
        expectedAttendees: 30,
        tags: ["wellness", "recurring", "health"],
      },
      {
        id: "9",
        title: "Engineering Happy Hour",
        description: "Casual networking event for engineering team",
        startDateTime: "2025-12-19T18:00:00Z",
        budget: { total: 2000 },
        status: "published",
        expectedAttendees: 60,
        tags: ["social", "networking", "engineering"],
      },
      {
        id: "11",
        title: "Diversity & Inclusion Workshop",
        description: "Interactive workshop focused on building an inclusive workplace culture",
        startDateTime: "2026-01-22T10:00:00Z",
        budget: { total: 4500 },
        status: "published",
        expectedAttendees: 100,
        tags: ["workshop", "training", "culture"],
      },
      {
        id: "14",
        title: "New Hire Orientation",
        description: "Onboarding session for new employees joining in December",
        startDateTime: "2025-12-16T09:00:00Z",
        budget: { total: 1200 },
        status: "published",
        expectedAttendees: 25,
        tags: ["onboarding", "training", "hr"],
      },
      {
        id: "16",
        title: "Team Bowling Night",
        description: "Fun team building activity at local bowling alley",
        startDateTime: "2025-11-05T19:00:00Z",
        budget: { total: 3500 },
        status: "completed",
        expectedAttendees: 45,
        actualAttendees: 42,
        tags: ["social", "team-building", "fun"],
      },
      {
        id: "19",
        title: "Annual Company Picnic",
        description: "Family-friendly outdoor event with games, food, and entertainment",
        startDateTime: "2025-08-10T11:00:00Z",
        budget: { total: 22000 },
        status: "completed",
        expectedAttendees: 350,
        actualAttendees: 380,
        tags: ["annual", "family", "outdoor"],
      },
      {
        id: "21",
        title: "Holiday Cookie Exchange",
        description: "Festive cookie exchange and decorating contest",
        startDateTime: "2025-12-19T15:00:00Z",
        budget: { total: 600 },
        status: "published",
        expectedAttendees: 35,
        tags: ["holiday", "social", "fun"],
      },
      {
        id: "23",
        title: "Thanksgiving Potluck",
        description: "Company potluck celebration with traditional Thanksgiving dishes",
        startDateTime: "2025-11-26T12:00:00Z",
        budget: { total: 2500 },
        status: "completed",
        expectedAttendees: 85,
        actualAttendees: 92,
        tags: ["holiday", "social", "celebration"],
      },
      {
        id: "24",
        title: "Product Design Sprint",
        description: "Week-long intensive design thinking workshop for product team",
        startDateTime: "2026-01-20T09:00:00Z",
        budget: { total: 8500 },
        status: "published",
        expectedAttendees: 40,
        tags: ["workshop", "product", "design"],
      },
      {
        id: "25",
        title: "Coffee Chat: Career Paths",
        description: "Informal discussion about career development over coffee",
        startDateTime: "2025-12-18T10:00:00Z",
        budget: { total: 300 },
        status: "published",
        expectedAttendees: 20,
        tags: ["networking", "career", "informal"],
      },
      {
        id: "26",
        title: "Customer Success Summit",
        description: "Strategic planning session for customer success team",
        startDateTime: "2026-02-15T09:00:00Z",
        budget: { total: 12000 },
        status: "published",
        expectedAttendees: 75,
        tags: ["summit", "strategy", "customer-success"],
      },
      {
        id: "27",
        title: "Friday Trivia Night",
        description: "Weekly trivia competition with prizes and snacks",
        startDateTime: "2025-12-20T17:00:00Z",
        budget: { total: 800 },
        status: "published",
        expectedAttendees: 50,
        tags: ["social", "recurring", "fun"],
      },
      {
        id: "28",
        title: "Code Review Workshop",
        description: "Best practices for effective code reviews",
        startDateTime: "2026-01-08T14:00:00Z",
        budget: { total: 1500 },
        status: "published",
        expectedAttendees: 35,
        tags: ["workshop", "technical", "engineering"],
      },
      {
        id: "29",
        title: "Marketing Strategy Offsite",
        description: "Two-day offsite for Q1 marketing planning",
        startDateTime: "2026-01-27T08:00:00Z",
        budget: { total: 18000 },
        status: "published",
        expectedAttendees: 30,
        tags: ["offsite", "strategy", "marketing"],
      },
      {
        id: "30",
        title: "Women in Tech Luncheon",
        description: "Networking lunch for women in technology",
        startDateTime: "2025-12-17T12:00:00Z",
        budget: { total: 2500 },
        status: "published",
        expectedAttendees: 45,
        tags: ["networking", "diversity", "community"],
      },
      {
        id: "31",
        title: "Startup Pitch Competition",
        description: "Internal innovation showcase with employee ideas",
        startDateTime: "2026-03-05T13:00:00Z",
        budget: { total: 6000 },
        status: "draft",
        expectedAttendees: 100,
        tags: ["innovation", "competition", "showcase"],
      },
      {
        id: "32",
        title: "Spring Cleaning: Codebase Edition",
        description: "Hackday focused on technical debt and refactoring",
        startDateTime: "2026-03-20T09:00:00Z",
        budget: { total: 4000 },
        status: "draft",
        expectedAttendees: 60,
        tags: ["hackathon", "technical", "engineering"],
      },
      {
        id: "33",
        title: "Mental Health Awareness Workshop",
        description: "Session on workplace mental health and wellness resources",
        startDateTime: "2026-01-29T15:00:00Z",
        budget: { total: 3500 },
        status: "published",
        expectedAttendees: 80,
        tags: ["wellness", "workshop", "health"],
      },
      {
        id: "34",
        title: "Game Night Extravaganza",
        description: "Board games, video games, and pizza party",
        startDateTime: "2025-12-27T18:00:00Z",
        budget: { total: 1800 },
        status: "published",
        expectedAttendees: 55,
        tags: ["social", "fun", "games"],
      },
      {
        id: "35",
        title: "Q1 Financial Review",
        description: "Finance team presentation on company performance",
        startDateTime: "2026-04-10T10:00:00Z",
        budget: { total: 2000 },
        status: "draft",
        expectedAttendees: 150,
        tags: ["quarterly", "finance", "all-hands"],
      },
    ],
  },
  {
    id: "us-san-francisco",
    name: "San Francisco",
    displayName: "San Francisco, USA",
    region: "North America",
    events: [
      {
        id: "6",
        title: "Product Launch Gala",
        description: "Grand celebration for our new product line with media coverage and VIP guests",
        startDateTime: "2025-12-18T19:00:00Z",
        budget: { total: 45000 },
        status: "published",
        expectedAttendees: 300,
        tags: ["product", "celebration", "vip"],
      },
      {
        id: "10",
        title: "Q3 All Hands Meeting",
        description: "Company-wide update on Q3 performance and future roadmap",
        startDateTime: "2025-09-20T13:00:00Z",
        budget: { total: 6000 },
        status: "completed",
        expectedAttendees: 180,
        actualAttendees: 175,
        tags: ["quarterly", "all-hands", "leadership"],
      },
      {
        id: "12",
        title: "Spring Hackathon",
        description: "48-hour hackathon with prizes for innovative solutions",
        startDateTime: "2026-03-14T09:00:00Z",
        budget: { total: 18000 },
        status: "published",
        expectedAttendees: 80,
        tags: ["hackathon", "technical", "competition"],
      },
      {
        id: "15",
        title: "Data Science Conference",
        description: "Multi-day conference featuring industry leaders in data science and analytics",
        startDateTime: "2026-02-10T08:00:00Z",
        budget: { total: 55000 },
        status: "published",
        expectedAttendees: 500,
        tags: ["conference", "data-science", "learning"],
      },
      {
        id: "18",
        title: "Lunch & Learn: Cybersecurity",
        description: "Educational session on cybersecurity best practices with lunch provided",
        startDateTime: "2025-12-17T12:00:00Z",
        budget: { total: 800 },
        status: "published",
        expectedAttendees: 40,
        tags: ["lunch-learn", "security", "training"],
      },
      {
        id: "20",
        title: "Q1 Product Demo Day",
        description: "Showcase of Q1 product developments and innovations",
        startDateTime: "2026-03-25T14:00:00Z",
        budget: { total: 7500 },
        status: "draft",
        expectedAttendees: 90,
        tags: ["quarterly", "product", "showcase"],
      },
    ],
  },
  {
    id: "uk-london",
    name: "London",
    displayName: "London, UK",
    region: "EMEA",
    events: [
      {
        id: "8",
        title: "Sales Kickoff 2026",
        description: "Annual sales team kickoff with training, team building, and goal setting",
        startDateTime: "2026-01-15T09:00:00Z",
        budget: { total: 35000 },
        status: "published",
        expectedAttendees: 250,
        tags: ["annual", "sales", "training"],
      },
      {
        id: "13",
        title: "Client Appreciation Dinner",
        description: "Exclusive dinner event for top-tier clients",
        startDateTime: "2025-12-22T19:30:00Z",
        budget: { total: 28000 },
        status: "published",
        expectedAttendees: 50,
        tags: ["client", "vip", "dinner"],
      },
      {
        id: "17",
        title: "Leadership Training Retreat",
        description: "Three-day leadership development program for managers",
        startDateTime: "2026-01-28T08:00:00Z",
        budget: { total: 42000 },
        status: "published",
        expectedAttendees: 35,
        tags: ["leadership", "training", "retreat"],
      },
      {
        id: "22",
        title: "Career Development Fair",
        description: "Internal career fair with workshops on professional development",
        startDateTime: "2026-02-05T10:00:00Z",
        budget: { total: 9500 },
        status: "published",
        expectedAttendees: 150,
        tags: ["career", "workshop", "development"],
      },
    ],
  },
  {
    id: "global",
    name: "Global",
    displayName: "Global Events",
    region: "Global",
    events: [
      {
        id: "4",
        title: "Summer Kickoff BBQ",
        description: "Team building event with food, games, and networking",
        startDateTime: "2025-06-15T12:00:00Z",
        budget: { total: 8000 },
        status: "completed",
        expectedAttendees: 120,
        actualAttendees: 105,
        tags: ["social", "team-building", "outdoor"],
      },
      {
        id: "5",
        title: "Q2 Strategy Summit",
        description: "Leadership summit to align on H2 priorities and goals",
        startDateTime: "2025-04-20T09:00:00Z",
        budget: { total: 12000 },
        status: "completed",
        expectedAttendees: 75,
        actualAttendees: 82,
        tags: ["quarterly", "strategy", "leadership"],
      },
    ],
  },
];

export const useEventsStore = create<EventsStore>()(
  persist(
    (set, get) => ({
      geos: initialGeos,
      
      getGeoById: (geoId: string) => {
        return get().geos.find((g) => g.id === geoId);
      },
      
      getEventsByGeo: (geoId: string) => {
        const geo = get().geos.find((g) => g.id === geoId);
        return geo?.events || [];
      },
      
      getEventById: (geoId: string, eventId: string) => {
        const geo = get().geos.find((g) => g.id === geoId);
        return geo?.events.find((event) => event.id === eventId);
      },
      
      addEvent: (geoId: string, event: Event) =>
        set((state) => ({
          geos: state.geos.map((geo) =>
            geo.id === geoId
              ? { ...geo, events: [...geo.events, event] }
              : geo
          ),
        })),
      
      updateEvent: (geoId: string, eventId: string, updates: Partial<Event>) =>
        set((state) => ({
          geos: state.geos.map((geo) =>
            geo.id === geoId
              ? {
                  ...geo,
                  events: geo.events.map((event) =>
                    event.id === eventId ? { ...event, ...updates } : event
                  ),
                }
              : geo
          ),
        })),
      
      deleteEvent: (geoId: string, eventId: string) =>
        set((state) => ({
          geos: state.geos.map((geo) =>
            geo.id === geoId
              ? {
                  ...geo,
                  events: geo.events.filter((event) => event.id !== eventId),
                }
              : geo
          ),
        })),
    }),
    {
      name: 'events-storage',
    }
  )
);
