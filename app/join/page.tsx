'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useWebSocket } from '../hooks/useWebSocket';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Chat } from '../components/Chat';

interface ChatMessage {
  sender: string;
  message: string;
  timestamp: number;
}

export default function JoinPage() {
  const { status, connect, disconnect, send, on, off } = useWebSocket();
  
  // Join screen state
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');
  
  // Game screen state
  const [isJoined, setIsJoined] = useState(false);
  const [playerId, setPlayerId] = useState('');
  const [playerCount, setPlayerCount] = useState(0);
  const [myScore, setMyScore] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [gameStatus, setGameStatus] = useState<'waiting' | 'playing'>('waiting');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [showGameStarting, setShowGameStarting] = useState(false);

  useEffect(() => {
    // Set up message handlers
    on('ROOM_JOINED', (data) => {
      setPlayerId(data.playerId);
      setIsJoined(true);
      setPlayerCount(data.roomInfo?.playerCount || 1);
      addSystemMessage(`Joined room ${roomCode}`);
    });

    on('PLAYER_JOINED', (data) => {
      setPlayerCount(data.players?.length || 0);
    });

    on('PLAYER_LEFT', (data) => {
      setPlayerCount(data.players?.length || 0);
    });

    on('PLAYER_READY_CHANGED', (data) => {
      setPlayerCount(data.players?.length || 0);
    });

    on('GAME_STARTED', (data) => {
      setGameStatus('playing');
      setShowGameStarting(true);
      addSystemMessage('Game started!');
      setTimeout(() => setShowGameStarting(false), 3000);
    });

    on('SCORE_UPDATED', (data) => {
      if (data.playerId === playerId) {
        setMyScore(data.score);
      }
    });

    on('CHAT_MESSAGE', (data) => {
      setChatMessages(prev => [...prev, {
        sender: data.playerName,
        message: data.message,
        timestamp: Date.now(),
      }]);
    });

    on('HOST_DISCONNECTED', (data) => {
      setError('Host disconnected. Returning to join screen...');
      setTimeout(() => {
        handleLeave();
      }, 3000);
    });

    on('ERROR', (data) => {
      setError(data.error);
    });

    return () => {
      off('ROOM_JOINED');
      off('PLAYER_JOINED');
      off('PLAYER_LEFT');
      off('PLAYER_READY_CHANGED');
      off('GAME_STARTED');
      off('SCORE_UPDATED');
      off('CHAT_MESSAGE');
      off('HOST_DISCONNECTED');
      off('ERROR');
    };
  }, [playerId, roomCode]);

  const addSystemMessage = (message: string) => {
    setChatMessages(prev => [...prev, {
      sender: 'System',
      message,
      timestamp: Date.now(),
    }]);
  };

  const handleJoin = () => {
    const trimmedName = playerName.trim();
    const trimmedCode = roomCode.trim().toUpperCase();

    if (!trimmedName) {
      setError('Please enter your name');
      return;
    }

    if (trimmedCode.length !== 6) {
      setError('Room code must be 6 characters');
      return;
    }

    setError('');
    connect();

    // Wait for connection then join
    const checkConnection = setInterval(() => {
      if (status === 'connected') {
        clearInterval(checkConnection);
        send({
          type: 'JOIN_ROOM',
          roomCode: trimmedCode,
          playerName: trimmedName,
        });
      }
    }, 100);

    // Timeout after 5 seconds
    setTimeout(() => {
      clearInterval(checkConnection);
      if (!isJoined) {
        setError('Failed to connect. Please try again.');
      }
    }, 5000);
  };

  const handleToggleReady = () => {
    const newReadyState = !isReady;
    setIsReady(newReadyState);
    send({ type: 'PLAYER_READY', isReady: newReadyState });
  };

  const handleSendChat = (message: string) => {
    send({ type: 'CHAT_MESSAGE', message });
  };

  const handleLeave = () => {
    send({ type: 'LEAVE_ROOM' });
    disconnect();
    setIsJoined(false);
    setPlayerId('');
    setPlayerCount(0);
    setMyScore(0);
    setIsReady(false);
    setGameStatus('waiting');
    setChatMessages([]);
  };

  // Join Screen
  if (!isJoined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900 flex items-center justify-center p-8">
        {/* Animated grid background */}
        <div className="fixed inset-0 bg-[linear-gradient(rgba(255,107,157,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,107,157,0.03)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20" />

        {/* Connection Status */}
        <div className="fixed top-4 right-4 z-50">
          <div className={`px-4 py-2 rounded-full flex items-center gap-2 ${
            status === 'connected' 
              ? 'bg-cyan-500/20 border border-cyan-500 text-cyan-400' 
              : 'bg-red-500/20 border border-red-500 text-red-400'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              status === 'connected' ? 'bg-cyan-400' : 'bg-red-400'
            }`} />
            <span className="font-semibold capitalize">{status}</span>
          </div>
        </div>

        <div className="relative z-10 w-full max-w-md">
          <Link
            href="/"
            className="inline-block mb-6 px-4 py-2 bg-zinc-900/80 backdrop-blur-sm border border-zinc-700 rounded-lg text-white hover:bg-zinc-800 transition-colors"
          >
            ← Back
          </Link>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-black bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-2">
              JOIN GAME
            </h1>
            <p className="text-zinc-400">Enter your details to join a room</p>
          </div>

          <Card gradient="pink">
            <div className="space-y-4">
              <Input
                label="Your Name"
                placeholder="Enter your name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                maxLength={20}
              />

              <Input
                label="Room Code"
                placeholder="000000"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                maxLength={6}
                className="text-center tracking-[0.3em] font-mono text-2xl"
              />

              {error && (
                <div className="p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <Button
                onClick={handleJoin}
                disabled={status === 'connecting'}
                className="w-full"
                size="lg"
              >
                {status === 'connecting' ? 'Connecting...' : 'Join Room'}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Game Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900 p-8">
      {/* Animated grid background */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,107,157,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,107,157,0.03)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20" />

      {/* Connection Status */}
      <div className="fixed top-4 right-4 z-50">
        <div className={`px-4 py-2 rounded-full flex items-center gap-2 ${
          status === 'connected' 
            ? 'bg-cyan-500/20 border border-cyan-500 text-cyan-400' 
            : 'bg-red-500/20 border border-red-500 text-red-400'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            status === 'connected' ? 'bg-cyan-400' : 'bg-red-400'
          }`} />
          <span className="font-semibold capitalize">{status}</span>
        </div>
      </div>

      {/* Game Starting Overlay */}
      {showGameStarting && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          <div className="text-center animate-pulse">
            <h2 className="text-6xl font-black bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-4">
              GAME STARTING!
            </h2>
            <p className="text-2xl text-cyan-400">Get ready to play...</p>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            PLAYER LOBBY
          </h1>
        </div>

        {/* Status Bar */}
        <Card className="mb-8" gradient="pink">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="text-center">
              <div className="text-sm text-zinc-400 mb-1">Room</div>
              <div className="text-3xl font-black text-yellow-400 tracking-[0.3em] font-mono">
                {roomCode}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-zinc-400 mb-1">Players</div>
              <div className="text-3xl font-bold text-pink-400">
                {playerCount}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-zinc-400 mb-1">Status</div>
              <div className="text-3xl font-bold text-purple-400 capitalize">
                {gameStatus}
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Player Info */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-pink-500/20 to-purple-500/20">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-4xl font-black">
                  {playerName.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">{playerName}</h2>
                <div className="text-2xl font-bold text-yellow-400">
                  Score: {myScore}
                </div>
              </div>
            </Card>

            <Card>
              <Button
                onClick={handleToggleReady}
                className={`w-full ${isReady ? 'animate-pulse' : ''}`}
                size="lg"
              >
                {isReady ? '✓ Ready!' : "I'm Ready!"}
              </Button>
            </Card>

            <Card>
              <div className="text-center">
                <div className="text-6xl font-black text-cyan-400 mb-2">
                  {playerCount}
                </div>
                <div className="text-zinc-400">Players in Room</div>
              </div>
            </Card>

            <Button
              onClick={() => {
                if (confirm('Are you sure you want to leave?')) {
                  handleLeave();
                }
              }}
              variant="ghost"
              className="w-full"
            >
              Leave Room
            </Button>
          </div>

          {/* Chat */}
          <Chat messages={chatMessages} onSendMessage={handleSendChat} />
        </div>
      </div>
    </div>
  );
}
