import { Routes, Route, Link } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import HomePage from './pages/HomePage'
import AudioCallPage from './pages/AudioCallPage'
import VideoCallPage from './pages/VideoCallPage'
import './App.css'

function App() {
  return (
    <div className="app">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-brand">
            <span className="stream">Stream</span>
            <span className="it">IT</span>
          </Link>
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
