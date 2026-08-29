import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import { MeetingProvider } from "./context/MeetingContext";

import HomePage from "./pages/HomePage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import PastMeetings from "./pages/PastMeetings";
import Employees from "./pages/Employees";

function App() {
  return (
    <MeetingProvider>
      <div>
        <Navbar />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/meetings/past" element={<PastMeetings />} />
          <Route path="/employees" element={<Employees />} />
        </Routes>
      </div>
    </MeetingProvider>
  );
}

export default App;
