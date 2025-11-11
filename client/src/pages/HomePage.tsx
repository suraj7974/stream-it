import { Link } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
  return (
    <div className="home-page">
      {/* Animated background grid */}
      <div className="bg-grid"></div>
      
      {/* Glowing orbs */}
      <div className="glow-orb-cyan"></div>
      <div className="glow-orb-orange"></div>

      <div className="content-container">
        {/* Hero Section */}
        <div className="hero">
          <h1>
            <span className="stream-text">Stream</span>
            <span className="it-text">IT</span>
          </h1>
          <p>Audio & Video Calling Platform</p>
        </div>

        {/* Feature Cards */}
        <div className="features">
          {/* Audio Call Card */}
          <div className="feature-card">
            <div className="card-content">
              <div className="feature-icon">🎤</div>
              <h2>Audio Calls</h2>
              <p>Crystal clear audio calls with multiple participants</p>
              <Link to="/audio-call">
                <button>Start Audio Call</button>
              </Link>
            </div>
          </div>

          {/* Video Call Card */}
          <div className="feature-card">
            <div className="card-content">
              <div className="feature-icon">📹</div>
              <h2>Video Calls</h2>
              <p>HD video calls with screen sharing support</p>
              <Link to="/video-call">
                <button>Start Video Call</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
