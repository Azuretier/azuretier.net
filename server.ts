// RHYTHMIA NEXUS - Multiplayer Server
// WebSocket server for host-player communication

import WebSocket, { WebSocketServer } from 'ws';
import http from 'http';
import crypto from 'crypto';

const PORT = process.env.PORT || 3001;

// Types
interface Player {
    socket: WebSocket;
    id: string;
    name: string;
    score: number;
    isReady: boolean;
}

interface GameState {
    isStarted: boolean;
    currentLevel: number | null;
    score: number;
}

interface RoomInfo {
    roomCode: string;
    playerCount: number;
    maxPlayers: number;
    isStarted: boolean;
    players: PlayerInfo[];
}

interface PlayerInfo {
    id: string;
    name: string;
    score: number;
    isReady: boolean;
}

interface ClientMessage {
    type: 'CREATE_ROOM' | 'JOIN_ROOM' | 'START_GAME' | 'PLAYER_READY' | 'GAME_ACTION' | 'UPDATE_SCORE' | 'CHAT_MESSAGE' | 'LEAVE_ROOM';
    roomCode?: string;
    playerName?: string;
    level?: number;
    isReady?: boolean;
    action?: string;
    payload?: any;
    score?: number;
    message?: string;
}

interface ServerMessage {
    type: string;
    [key: string]: any;
}

// Create HTTP server
const server = http.createServer();
const wss = new WebSocketServer({ server });

// Game rooms storage
const rooms = new Map<string, GameRoom>();

class GameRoom {
    roomCode: string;
    host: {
        socket: WebSocket;
        id: string;
    };
    players: Map<string, Player>;
    gameState: GameState;
    maxPlayers: number;
    createdAt: number;

    constructor(roomCode: string, hostSocket: WebSocket) {
        this.roomCode = roomCode;
        this.host = {
            socket: hostSocket,
            id: generateId()
        };
        this.players = new Map<string, Player>();
        this.gameState = {
            isStarted: false,
            currentLevel: null,
            score: 0
        };
        this.maxPlayers = 8;
        this.createdAt = Date.now();
    }

    addPlayer(socket: WebSocket, playerName?: string): { success: boolean; playerId?: string; error?: string } {
        if (this.players.size >= this.maxPlayers) {
            return { success: false, error: 'Room is full' };
        }

        const playerId = generateId();
        this.players.set(playerId, {
            socket,
            id: playerId,
            name: playerName || `Player ${this.players.size + 1}`,
            score: 0,
            isReady: false
        });

        return { success: true, playerId };
    }

    removePlayer(playerId: string): boolean {
        this.players.delete(playerId);
        if (this.players.size === 0 && !this.host.socket) {
            return true; // Room should be deleted
        }
        return false;
    }

    broadcast(message: ServerMessage, excludeSocket: WebSocket | null = null): void {
        const data = JSON.stringify(message);
        
        // Send to host
        if (this.host.socket && this.host.socket !== excludeSocket && this.host.socket.readyState === WebSocket.OPEN) {
            this.host.socket.send(data);
        }

        // Send to all players
        this.players.forEach(player => {
            if (player.socket !== excludeSocket && player.socket.readyState === WebSocket.OPEN) {
                player.socket.send(data);
            }
        });
    }

    getPlayersList(): PlayerInfo[] {
        return Array.from(this.players.values()).map(p => ({
            id: p.id,
            name: p.name,
            score: p.score,
            isReady: p.isReady
        }));
    }

    getRoomInfo(): RoomInfo {
        return {
            roomCode: this.roomCode,
            playerCount: this.players.size,
            maxPlayers: this.maxPlayers,
            isStarted: this.gameState.isStarted,
            players: this.getPlayersList()
        };
    }
}

function generateRoomCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude confusing characters
    let code: string;
    do {
        code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
    } while (rooms.has(code));
    return code;
}

function generateId(): string {
    return crypto.randomBytes(16).toString('hex');
}

// WebSocket connection handler
wss.on('connection', (ws: WebSocket) => {
    console.log('New client connected');
    let clientRole: 'host' | 'player' | null = null;
    let roomCode: string | null = null;
    let playerId: string | null = null;

    ws.on('message', (message: WebSocket.RawData) => {
        try {
            const data: ClientMessage = JSON.parse(message.toString());
            console.log('Received:', data.type, data);

            switch (data.type) {
                case 'CREATE_ROOM':
                    handleCreateRoom(ws, data);
                    break;

                case 'JOIN_ROOM':
                    handleJoinRoom(ws, data);
                    break;

                case 'START_GAME':
                    handleStartGame(ws, data);
                    break;

                case 'PLAYER_READY':
                    handlePlayerReady(ws, data);
                    break;

                case 'GAME_ACTION':
                    handleGameAction(ws, data);
                    break;

                case 'UPDATE_SCORE':
                    handleUpdateScore(ws, data);
                    break;

                case 'CHAT_MESSAGE':
                    handleChatMessage(ws, data);
                    break;

                case 'LEAVE_ROOM':
                    handleLeaveRoom(ws, data);
                    break;

                default:
                    ws.send(JSON.stringify({ type: 'ERROR', error: 'Unknown message type' }));
            }
        } catch (error) {
            console.error('Error processing message:', error);
            ws.send(JSON.stringify({ type: 'ERROR', error: 'Invalid message format' }));
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        if (roomCode && rooms.has(roomCode)) {
            const room = rooms.get(roomCode)!;
            
            if (clientRole === 'host') {
                // Host disconnected - notify players and close room
                room.broadcast({ 
                    type: 'HOST_DISCONNECTED',
                    message: 'Host has disconnected. Room will close.'
                });
                rooms.delete(roomCode);
                console.log(`Room ${roomCode} deleted - host disconnected`);
            } else if (clientRole === 'player' && playerId) {
                // Player disconnected
                const shouldDelete = room.removePlayer(playerId);
                room.broadcast({
                    type: 'PLAYER_LEFT',
                    playerId,
                    players: room.getPlayersList()
                });
                
                if (shouldDelete) {
                    rooms.delete(roomCode);
                    console.log(`Room ${roomCode} deleted - empty`);
                }
            }
        }
    });

    // Handler functions
    function handleCreateRoom(ws: WebSocket, _data: ClientMessage): void {
        const newRoomCode = generateRoomCode();
        const room = new GameRoom(newRoomCode, ws);
        rooms.set(newRoomCode, room);
        
        clientRole = 'host';
        roomCode = newRoomCode;

        ws.send(JSON.stringify({
            type: 'ROOM_CREATED',
            roomCode: newRoomCode,
            roomInfo: room.getRoomInfo()
        }));

        console.log(`Room created: ${newRoomCode}`);
    }

    function handleJoinRoom(ws: WebSocket, data: ClientMessage): void {
        const { roomCode: targetRoom, playerName } = data;

        if (!targetRoom || !rooms.has(targetRoom)) {
            ws.send(JSON.stringify({
                type: 'ERROR',
                error: 'Room not found'
            }));
            return;
        }

        const room = rooms.get(targetRoom)!;

        if (room.gameState.isStarted) {
            ws.send(JSON.stringify({
                type: 'ERROR',
                error: 'Game already started'
            }));
            return;
        }

        const result = room.addPlayer(ws, playerName);
        
        if (result.success && result.playerId) {
            clientRole = 'player';
            roomCode = targetRoom;
            playerId = result.playerId;

            ws.send(JSON.stringify({
                type: 'ROOM_JOINED',
                roomCode: targetRoom,
                playerId: result.playerId,
                roomInfo: room.getRoomInfo()
            }));

            room.broadcast({
                type: 'PLAYER_JOINED',
                player: {
                    id: result.playerId,
                    name: playerName || `Player ${room.players.size}`
                },
                players: room.getPlayersList()
            }, ws);

            console.log(`Player ${result.playerId} joined room ${targetRoom}`);
        } else {
            ws.send(JSON.stringify({
                type: 'ERROR',
                error: result.error || 'Failed to join room'
            }));
        }
    }

    function handleStartGame(ws: WebSocket, data: ClientMessage): void {
        if (clientRole !== 'host' || !roomCode || !rooms.has(roomCode)) {
            ws.send(JSON.stringify({ type: 'ERROR', error: 'Not authorized' }));
            return;
        }

        const room = rooms.get(roomCode)!;
        room.gameState.isStarted = true;
        room.gameState.currentLevel = data.level || 1;

        room.broadcast({
            type: 'GAME_STARTED',
            level: room.gameState.currentLevel,
            timestamp: Date.now()
        });

        console.log(`Game started in room ${roomCode}`);
    }

    function handlePlayerReady(_ws: WebSocket, data: ClientMessage): void {
        if (clientRole !== 'player' || !roomCode || !rooms.has(roomCode) || !playerId) {
            return;
        }

        const room = rooms.get(roomCode)!;
        const player = room.players.get(playerId);
        
        if (player && typeof data.isReady === 'boolean') {
            player.isReady = data.isReady;
            
            room.broadcast({
                type: 'PLAYER_READY_CHANGED',
                playerId,
                isReady: data.isReady,
                players: room.getPlayersList()
            });
        }
    }

    function handleGameAction(ws: WebSocket, data: ClientMessage): void {
        if (!roomCode || !rooms.has(roomCode)) {
            return;
        }

        const room = rooms.get(roomCode)!;
        
        // Broadcast game action to all clients
        room.broadcast({
            type: 'GAME_ACTION',
            playerId: clientRole === 'player' ? playerId : 'host',
            action: data.action,
            payload: data.payload,
            timestamp: Date.now()
        }, ws);
    }

    function handleUpdateScore(_ws: WebSocket, data: ClientMessage): void {
        if (!roomCode || !rooms.has(roomCode) || typeof data.score !== 'number') {
            return;
        }

        const room = rooms.get(roomCode)!;
        
        if (clientRole === 'player' && playerId) {
            const player = room.players.get(playerId);
            if (player) {
                player.score = data.score;
            }
        } else if (clientRole === 'host') {
            room.gameState.score = data.score;
        }

        room.broadcast({
            type: 'SCORE_UPDATED',
            playerId: clientRole === 'player' ? playerId : 'host',
            score: data.score,
            players: room.getPlayersList()
        });
    }

    function handleChatMessage(_ws: WebSocket, data: ClientMessage): void {
        if (!roomCode || !rooms.has(roomCode) || !data.message) {
            return;
        }

        const room = rooms.get(roomCode)!;
        const playerName = clientRole === 'player' && playerId 
            ? room.players.get(playerId)?.name 
            : 'Host';

        room.broadcast({
            type: 'CHAT_MESSAGE',
            playerId: clientRole === 'player' ? playerId : 'host',
            playerName,
            message: data.message,
            timestamp: Date.now()
        });
    }

    function handleLeaveRoom(ws: WebSocket, _data: ClientMessage): void {
        if (!roomCode || !rooms.has(roomCode)) {
            return;
        }

        const room = rooms.get(roomCode)!;
        
        if (clientRole === 'player' && playerId) {
            const shouldDelete = room.removePlayer(playerId);
            room.broadcast({
                type: 'PLAYER_LEFT',
                playerId,
                players: room.getPlayersList()
            });
            
            if (shouldDelete) {
                rooms.delete(roomCode);
            }
        }

        ws.send(JSON.stringify({ type: 'LEFT_ROOM' }));
    }
});

// Cleanup old rooms
setInterval(() => {
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    rooms.forEach((room, code) => {
        if (now - room.createdAt > maxAge) {
            room.broadcast({
                type: 'ROOM_CLOSED',
                reason: 'Room expired'
            });
            rooms.delete(code);
            console.log(`Room ${code} expired and deleted`);
        }
    });
}, 60 * 60 * 1000); // Check every hour

// Start server
server.listen(PORT, () => {
    console.log(`🎮 RHYTHMIA NEXUS Server running on port ${PORT}`);
    console.log(`📡 WebSocket ready for connections`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, closing server...');
    wss.clients.forEach(client => {
        client.close();
    });
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
