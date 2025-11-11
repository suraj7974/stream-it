import { Link } from 'react-router-dom'
import './HomePage.css'

function HomePage() {
  return (
    <div className="home-page">
      <div className="hero">
        <h1>Welcome to StreamIT</h1>
        <p>Audio & Video Calling Platform</p>
      </div>

      <div className="features">
        <div className="feature-card">
          <div className="feature-icon">🎤</div>
          <h2>Audio Calls</h2>
          <p>Crystal clear audio calls with multiple participants</p>
          <Link to="/audio-call">
            <button>Start Audio Call</button>
          </Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📹</div>
          <h2>Video Calls</h2>
          <p>HD video calls with screen sharing support</p>
          <Link to="/video-call">
            <button>Start Video Call</button>
          </Link>
        </div>
      </div>

      <div className="info-section">
        <h3>Features</h3>
        <ul>
          <li>✅ High-quality audio calls</li>
          <li>✅ HD video conferencing</li>
          <li>✅ Screen sharing capability</li>
          <li>✅ Multi-participant support</li>
          <li>✅ 100% local deployment</li>
        </ul>
      </div>
    </div>
  )
}

export default HomePage
