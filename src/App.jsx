import { Routes, Route } from 'react-router-dom'
import Navbar from './components/navbar.jsx'
import Home from './pages/Home.jsx'
import EventsList from './pages/EventsList.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import EventDetail from './pages/EventDetail.jsx'
import Profile from './pages/Profile.jsx'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/events" element={<EventsList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<EventsList />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  )
}
