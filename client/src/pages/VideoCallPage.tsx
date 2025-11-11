import { useState } from 'react'
import { 
  LiveKitRoom, 
  VideoConference,
  RoomAudioRenderer 
} from '@livekit/components-react'
import '@livekit/components-styles'
import { getCallToken } from '../lib/api'
import './CallPage.css'

function VideoCallPage() {
  const [roomName, setRoomName] = useState('')
  const [participantName, setParticipantName] = useState('')
  const [token, setToken] = useState('')
  const [connected, setConnected] = useState(false)

  const handleJoinRoom = async () => {
    if (!roomName || !participantName) {
      alert('Please enter room name and your name')
      return
    }

    try {
      const response = await getCallToken(roomName, participantName)
      setToken(response.token)
      setConnected(true)
    } catch (error) {
      console.error('Failed to join room:', error)
      alert('Failed to join room. Make sure the server is running.')
    }
  }

  const handleLeaveRoom = () => {
    setToken('')
    setConnected(false)
  }

  if (connected && token) {
    return (
      <div className="call-page video-call">
        <div className="call-header">
          <h2>📹 Video Call: {roomName}</h2>
          <button onClick={handleLeaveRoom} className="leave-button">
            Leave Room
          </button>
        </div>

        <LiveKitRoom
          token={token}
          serverUrl={import.meta.env.VITE_LIVEKIT_URL}
          connect={true}
          audio={true}
          video={true}
          className="livekit-room"
        >
          <VideoConference />
          <RoomAudioRenderer />
        </LiveKitRoom>
      </div>
    )
  }

  return (
    <div className="join-page">
      <div className="join-card">
        <h1>📹 Join Video Call</h1>
        <div className="form">
          <input
            type="text"
            placeholder="Room Name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Your Name"
            value={participantName}
            onChange={(e) => setParticipantName(e.target.value)}
          />
          <button onClick={handleJoinRoom}>Join Room</button>
        </div>
      </div>
    </div>
  )
}

export default VideoCallPage
