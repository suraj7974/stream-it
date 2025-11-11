import { Router, Request, Response } from "express";
import { AccessToken } from "livekit-server-sdk";
import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const router: Router = Router();
const prisma = new PrismaClient();

// Create a new room with unique ID
router.post("/create-room", async (req: Request, res: Response) => {
  try {
    const { displayName, roomType, expiryHours } = req.body;

    if (!displayName || !roomType) {
      return res.status(400).json({
        error: "displayName and roomType are required",
      });
    }

    if (!["audio", "video"].includes(roomType)) {
      return res.status(400).json({
        error: "roomType must be 'audio' or 'video'",
      });
    }

    const roomId = randomUUID();
    
    // Calculate expiry time (default 24 hours)
    const expiresAt = expiryHours 
      ? new Date(Date.now() + expiryHours * 60 * 60 * 1000)
      : new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours default

    const room = await prisma.callRoom.create({
      data: {
        roomId,
        displayName,
        roomType,
        expiresAt,
        isActive: true,
      },
    });

    const baseUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const roomUrl = `${baseUrl}/${roomType}-call?room=${roomId}`;

    res.json({
      success: true,
      room: {
        id: room.id,
        roomId: room.roomId,
        displayName: room.displayName,
        roomType: room.roomType,
        expiresAt: room.expiresAt,
        roomUrl,
      },
    });
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({
      error: "Failed to create room",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Validate and get room details
router.get("/room/:roomId", async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;

    const room = await prisma.callRoom.findUnique({
      where: { roomId },
    });

    if (!room) {
      return res.status(404).json({
        error: "Room not found",
      });
    }

    // Check if room expired
    if (room.expiresAt && new Date() > room.expiresAt) {
      return res.status(410).json({
        error: "Room has expired",
        expiredAt: room.expiresAt,
      });
    }

    if (!room.isActive) {
      return res.status(403).json({
        error: "Room is no longer active",
      });
    }

    res.json({
      success: true,
      room: {
        roomId: room.roomId,
        displayName: room.displayName,
        roomType: room.roomType,
        expiresAt: room.expiresAt,
      },
    });
  } catch (error) {
    console.error("Error fetching room:", error);
    res.status(500).json({
      error: "Failed to fetch room details",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Generate LiveKit token for joining a room
router.post("/token", async (req: Request, res: Response) => {
  try {
    const { roomId, participantName, expectedRoomType } = req.body;

    if (!roomId || !participantName) {
      return res.status(400).json({
        error: "roomId and participantName are required",
      });
    }

    // Validate room exists and is active
    const room = await prisma.callRoom.findUnique({
      where: { roomId },
    });

    if (!room) {
      return res.status(404).json({
        error: "Room not found",
      });
    }

    if (room.expiresAt && new Date() > room.expiresAt) {
      return res.status(410).json({
        error: "Room has expired",
      });
    }

    if (!room.isActive) {
      return res.status(403).json({
        error: "Room is no longer active",
      });
    }

    // Validate room type matches expected type
    if (expectedRoomType && room.roomType !== expectedRoomType) {
      return res.status(400).json({
        error: `This is a ${room.roomType} room. Please use the ${room.roomType} call page to join.`,
        actualRoomType: room.roomType,
        expectedRoomType,
      });
    }

    const livekitHost = process.env.LIVEKIT_URL || "ws://localhost:7880";
    const apiKey = process.env.LIVEKIT_API_KEY || "devkey";
    const apiSecret = process.env.LIVEKIT_API_SECRET || "secret";

    // Create access token using the unique roomId
    const token = new AccessToken(apiKey, apiSecret, {
      identity: participantName,
    });

    // Grant permissions
    token.addGrant({
      room: roomId, // Use unique roomId instead of display name
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
    });

    const jwt = await token.toJwt();

    res.json({
      token: jwt,
      url: livekitHost,
      roomId: room.roomId,
      displayName: room.displayName,
      participantName,
    });
  } catch (error) {
    console.error("Error generating token:", error);
    res.status(500).json({
      error: "Failed to generate token",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// End a room (mark as inactive)
router.post("/end-room/:roomId", async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;

    const room = await prisma.callRoom.update({
      where: { roomId },
      data: { isActive: false },
    });

    res.json({
      success: true,
      message: "Room ended successfully",
      roomId: room.roomId,
    });
  } catch (error) {
    console.error("Error ending room:", error);
    res.status(500).json({
      error: "Failed to end room",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get active rooms (placeholder - requires LiveKit webhook or Redis)
router.get("/rooms", async (_req: Request, res: Response) => {
  res.json({
    rooms: [],
    message: "Room listing requires LiveKit webhook integration",
  });
});

export default router;
