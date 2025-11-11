import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { LiveKitRoom, RoomAudioRenderer, useParticipants } from '@livekit/components-react'
import '@livekit/components-styles'
import { createRoom, getRoomDetails, getCallToken } from '../lib/api'
import './CallPage.css'

function AudioCallPage() {
  const [mode, setMode] = useState<'select' | 'create' | 'join'>('select')
  const [displayName, setDisplayName] = useState('')
  const [participantName, setParticipantName] = useState('')
  const [token, setToken] = useState('')
  const [connected, setConnected] = useState(false)
  const [roomUrl, setRoomUrl] = useState('')
  const [roomId, setRoomId] = useState('')
  const [manualRoomId, setManualRoomId] = useState('')
  const [currentRoomName, setCurrentRoomName] = useState('')
  const [loading, setLoading] = useState(false)

  // Check if joining via URL parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const roomIdParam = params.get('room')
    
    if (roomIdParam) {
      setRoomId(roomIdParam)
      setMode('join')
      validateRoom(roomIdParam)
    }
  }, [])

  const validateRoom = async (roomId: string): Promise<boolean> => {
    try {
      const response = await getRoomDetails(roomId)
      setCurrentRoomName(response.room.displayName)
      return true
    } catch (error: any) {
      if (error.response?.status === 410) {
        toast.error('This room has expired.')
      } else if (error.response?.status === 404) {
        toast.error('Room not found.')
      } else {
        toast.error('Failed to validate room.')
      }
      return false
    }
  }

  const handleCreateRoom = async () => {
    if (!displayName) {
      toast.error('Please enter a room name')
      return
    }

    setLoading(true)
    try {
      const response = await createRoom(displayName, 'audio', 24) // 24 hour expiry
      setRoomUrl(response.room.roomUrl || '')
      setRoomId(response.room.roomId)
      setCurrentRoomName(response.room.displayName)
      toast.success('Room created! Share the link with participants.')
    } catch (error) {
      console.error('Failed to create room:', error)
      toast.error('Failed to create room. Make sure the server is running.')
    } finally {
      setLoading(false)
    }
  }

  const handleJoinRoom = async () => {
    if (!participantName) {
      toast.error('Please enter your name')
      return
    }

    // Use manual room ID if no room ID from URL
    const targetRoomId = roomId || manualRoomId
    if (!targetRoomId) {
      toast.error('Please enter a room ID or link')
      return
    }

    // If using manual room ID, validate it first
    if (!roomId && manualRoomId) {
      const isValid = await validateRoom(manualRoomId)
      if (!isValid) return
    }

    setLoading(true)
    try {
      const response = await getCallToken(targetRoomId, participantName)
      setToken(response.token)
      setCurrentRoomName(response.displayName)
      setConnected(true)
      toast.success(`Joined ${response.displayName}`)
    } catch (error: any) {
      console.error('Failed to join room:', error)
      if (error.response?.status === 410) {
        toast.error('This room has expired.')
      } else if (error.response?.status === 404) {
        toast.error('Room not found.')
      } else {
        toast.error('Failed to join room. Make sure the server is running.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLeaveRoom = () => {
    setToken('')
    setConnected(false)
    setMode('select')
    setRoomUrl('')
    setRoomId('')
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomUrl)
    toast.success('Room link copied to clipboard!')
  }

  if (connected && token) {
    return (
      <div className="call-page">
        <div className="call-header">
          <h2>🎤 Audio Call: {currentRoomName}</h2>
          <button onClick={handleLeaveRoom} className="leave-button">
            Leave Room
          </button>
        </div>

        <LiveKitRoom
          token={token}
          serverUrl={import.meta.env.VITE_LIVEKIT_URL || 'ws://localhost:7880'}
          connect={true}
          audio={true}
          video={false}
          className="livekit-room"
        >
          <ParticipantList />
          <RoomAudioRenderer />
        </LiveKitRoom>
      </div>
    )
  }

  // Mode selection
  if (mode === 'select') {
    return (
      <div className="join-page">
        <div className="join-card">
          <h1>🎤 Audio Call</h1>
          <div className="mode-selection">
            <button onClick={() => setMode('create')} className="mode-button">
              ➕ Create New Room
            </button>
            <button onClick={() => setMode('join')} className="mode-button">
              🔗 Join Existing Room
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Create room mode
  if (mode === 'create') {
    return (
      <div className="join-page">
        <div className="join-card">
          <h1>🎤 Create Audio Room</h1>
          
          {!roomUrl ? (
            <div className="form">
              <input
                type="text"
                placeholder="Room Name (e.g., Daily Standup)"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
              <button onClick={handleCreateRoom} disabled={loading}>
                {loading ? 'Creating...' : 'Create Room'}
              </button>
              <button onClick={() => setMode('select')} className="secondary-button">
                Back
              </button>
            </div>
          ) : (
            <div className="room-created">
              <p className="success-message">✅ Room created successfully!</p>
              <div className="room-link-container">
                <input 
                  type="text" 
                  value={roomUrl} 
                  readOnly 
                  className="room-link-input"
                />
                <button onClick={copyToClipboard} className="copy-button">
                  📋 Copy Link
                </button>
              </div>
              <p className="info-text">Share this link with participants to join</p>
              
              <div className="form" style={{marginTop: '20px'}}>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                />
                <button onClick={handleJoinRoom} disabled={loading}>
                  {loading ? 'Joining...' : 'Join Room as Host'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Join room mode
  return (
    <div className="join-page">
      <div className="join-card">
        <h1>🎤 Join Audio Call</h1>
        {currentRoomName && <p className="room-name-display">Room: {currentRoomName}</p>}
        <div className="form">
          {!roomId && (
            <input
              type="text"
              placeholder="Room ID or Link"
              value={manualRoomId}
              onChange={(e) => {
                const value = e.target.value
                // Extract room ID from URL if they paste a full link
                const urlMatch = value.match(/[?&]room=([a-f0-9-]+)/i)
                setManualRoomId(urlMatch ? urlMatch[1] : value)
              }}
            />
          )}
          <input
            type="text"
            placeholder="Your Name"
            value={participantName}
            onChange={(e) => setParticipantName(e.target.value)}
          />
          <button onClick={handleJoinRoom} disabled={loading || (!roomId && !manualRoomId)}>
            {loading ? 'Joining...' : 'Join Room'}
          </button>
          {!roomId && (
            <button onClick={() => setMode('select')} className="secondary-button">
              Back
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function ParticipantList() {
  const participants = useParticipants()

  return (
    <div className="participants">
      <h3>Participants ({participants.length})</h3>
      <div className="participant-grid">
        {participants.map((participant) => (
          <div key={participant.identity} className="participant-card">
            <div className="participant-avatar">
              {participant.identity.charAt(0).toUpperCase()}
            </div>
            <p>{participant.identity}</p>
            <div className="audio-indicator">
              {participant.isMicrophoneEnabled ? '🎤' : '🔇'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AudioCallPage
