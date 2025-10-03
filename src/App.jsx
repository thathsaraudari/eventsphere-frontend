import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import EventsList from './pages/EventsList.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import EventDetail from './pages/EventDetail.jsx'
import Profile from './pages/Profile.jsx'
import MyEvents from './pages/MyEvents.jsx'
import CreateEvent from './pages/CreateEvent.jsx'
import EditEvent from './pages/EditEvent.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import RequireAuth from './components/RequireAuth.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">
        <Routes>
          <Route path="/events" element={<EventsList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<EventsList />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
          <Route path="/myevents" element={<RequireAuth><MyEvents /></RequireAuth>} />
          <Route path="/events/new" element={<RequireAuth><CreateEvent /></RequireAuth>} />
          <Route path="/events/:id/edit" element={<RequireAuth><EditEvent /></RequireAuth>} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
