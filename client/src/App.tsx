import { Routes, Route, Link } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AudioCallPage from './pages/AudioCallPage'
import VideoCallPage from './pages/VideoCallPage'
import './App.css'

function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-brand">StreamIT</Link>
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/audio-call">Audio Call</Link>
            <Link to="/video-call">Video Call</Link>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/audio-call" element={<AudioCallPage />} />
          <Route path="/video-call" element={<VideoCallPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
