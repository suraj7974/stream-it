import { Router, Request, Response } from 'express';
import { AccessToken } from 'livekit-server-sdk';

const router: Router = Router();

// Generate LiveKit token for joining a room
router.post('/token', async (req: Request, res: Response) => {
  try {
    const { roomName, participantName } = req.body;

    if (!roomName || !participantName) {
      return res.status(400).json({ 
        error: 'roomName and participantName are required' 
      });
    }

    const livekitHost = process.env.LIVEKIT_URL || 'ws://localhost:7880';
    const apiKey = process.env.LIVEKIT_API_KEY || 'devkey';
    const apiSecret = process.env.LIVEKIT_API_SECRET || 'secret';

    // Create access token
    const token = new AccessToken(apiKey, apiSecret, {
      identity: participantName,
    });

    // Grant permissions
    token.addGrant({
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
    });

    const jwt = await token.toJwt();

    res.json({
      token: jwt,
      url: livekitHost,
      roomName,
      participantName,
    });
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).json({ 
      error: 'Failed to generate token',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get active rooms (placeholder - requires LiveKit webhook or Redis)
router.get('/rooms', async (_req: Request, res: Response) => {
  res.json({
    rooms: [],
    message: 'Room listing requires LiveKit webhook integration'
  });
});

export default router;
