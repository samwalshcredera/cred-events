import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import GeoDashboard from "./pages/GeoDashboard";
import EventDetail from "./pages/EventDetail";
import CreateEvent from "./pages/CreateEvent";
import EditEvent from "./pages/EditEvent";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/geo/:geoId" element={<GeoDashboard />} />
        <Route path="/geo/:geoId/events/:eventId" element={<EventDetail />} />
        <Route path="/geo/:geoId/events/create" element={<CreateEvent />} />
        <Route
          path="/geo/:geoId/events/:eventId/edit"
          element={<EditEvent />}
        />
      </Routes>
    </Router>
  );
}

export default App;
