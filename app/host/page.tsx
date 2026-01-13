'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useWebSocket } from '../hooks/useWebSocket';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Chat } from '../components/Chat';

interface Player {
  id: string;
  name: string;
  isReady: boolean;
  score: number;
}

interface ChatMessage {
  sender: string;
  message: string;
  timestamp: number;
}

export default function HostPage() {
  const { status, connect, disconnect, send, on, off } = useWebSocket();
  const [roomCode, setRoomCode] = useState<string>('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [gameStatus, setGameStatus] = useState<'waiting' | 'playing'>('waiting');

  useEffect(() => {
    connect();

    // Set up message handlers
    on('ROOM_CREATED', (data) => {
      setRoomCode(data.roomCode);
      addSystemMessage(`Room created! Share code: ${data.roomCode}`);
    });

    on('PLAYER_JOINED', (data) => {
      setPlayers(data.players || []);
      addSystemMessage(`${data.player.name} joined the room`);
    });

    on('PLAYER_LEFT', (data) => {
      setPlayers(data.players || []);
      const player = players.find(p => p.id === data.playerId);
      if (player) {
        addSystemMessage(`${player.name} left the room`);
      }
    });

    on('PLAYER_READY_CHANGED', (data) => {
      setPlayers(data.players || []);
    });

    on('SCORE_UPDATED', (data) => {
      setPlayers(data.players || []);
    });

    on('CHAT_MESSAGE', (data) => {
      setChatMessages(prev => [...prev, {
        sender: data.playerName,
        message: data.message,
        timestamp: Date.now(),
      }]);
    });

    on('ERROR', (data) => {
      addSystemMessage(`Error: ${data.error}`);
    });

    return () => {
      off('ROOM_CREATED');
      off('PLAYER_JOINED');
      off('PLAYER_LEFT');
      off('PLAYER_READY_CHANGED');
      off('SCORE_UPDATED');
      off('CHAT_MESSAGE');
      off('ERROR');
      disconnect();
    };
  }, []);

  const addSystemMessage = (message: string) => {
    setChatMessages(prev => [...prev, {
      sender: 'System',
      message,
      timestamp: Date.now(),
    }]);
  };

  const handleCreateRoom = () => {
    send({ type: 'CREATE_ROOM' });
  };

  const handleStartGame = () => {
    send({ type: 'START_GAME', level: 1 });
    setGameStatus('playing');
    addSystemMessage('Game started!');
  };

  const handleResetGame = () => {
    setGameStatus('waiting');
    addSystemMessage('Game reset');
  };

  const handleCloseRoom = () => {
    if (confirm('Are you sure you want to close the room?')) {
      disconnect();
      window.location.href = '/';
    }
  };

  const handleSendChat = (message: string) => {
    send({ type: 'CHAT_MESSAGE', message });
  };

  const allPlayersReady = players.length > 0 && players.every(p => p.isReady);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900 p-8">
      {/* Animated grid background */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(78,205,196,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(78,205,196,0.03)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20" />

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

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="px-4 py-2 bg-zinc-900/80 backdrop-blur-sm border border-zinc-700 rounded-lg text-white hover:bg-zinc-800 transition-colors"
          >
            ← Back
          </Link>
          <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
            HOST DASHBOARD
          </h1>
          <div className="w-24" />
        </div>

        {/* Room Status Bar */}
        {!roomCode ? (
          <Card className="text-center py-12" gradient="cyan">
            <h2 className="text-2xl font-bold text-white mb-4">Ready to host?</h2>
            <Button onClick={handleCreateRoom} disabled={status !== 'connected'} size="lg">
              Create Room
            </Button>
          </Card>
        ) : (
          <>
            <Card className="mb-8" gradient="cyan">
              <div className="flex flex-wrap justify-between items-center gap-4">
                <div className="text-center">
                  <div className="text-sm text-zinc-400 mb-1">Room Code</div>
                  <div className="text-4xl font-black text-yellow-400 tracking-[0.3em] font-mono">
                    {roomCode}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-zinc-400 mb-1">Players</div>
                  <div className="text-3xl font-bold text-cyan-400">
                    {players.length}/8
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Players List */}
              <div className="lg:col-span-2">
                <Card>
                  <h2 className="text-2xl font-bold text-cyan-400 mb-4">Players</h2>
                  {players.length === 0 ? (
                    <div className="text-center py-12 text-zinc-500">
                      <div className="text-6xl mb-4">👥</div>
                      <p className="text-lg">Waiting for players to join...</p>
                      <p className="text-sm mt-2">Share the room code above!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {players.map((player) => (
                        <div
                          key={player.id}
                          className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                            player.isReady
                              ? 'bg-yellow-500/10 border-yellow-500'
                              : 'bg-cyan-500/10 border-cyan-500/30'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-xl font-bold">
                              {player.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="font-semibold text-white text-lg">
                              {player.name}
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className={`flex items-center gap-2 ${
                              player.isReady ? 'text-yellow-400' : 'text-zinc-500'
                            }`}>
                              <div className={`w-3 h-3 rounded-full ${
                                player.isReady ? 'bg-yellow-400 animate-pulse' : 'bg-zinc-600'
                              }`} />
                              <span className="font-semibold">
                                {player.isReady ? 'Ready' : 'Not Ready'}
                              </span>
                            </div>
                            <div className="text-yellow-400 font-bold text-lg">
                              {player.score}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>

              {/* Controls & Chat */}
              <div className="space-y-6">
                <Card>
                  <h3 className="text-xl font-bold text-purple-400 mb-4">Controls</h3>
                  <div className="space-y-3">
                    <Button
                      onClick={handleStartGame}
                      disabled={!allPlayersReady || gameStatus === 'playing'}
                      className="w-full"
                      size="lg"
                    >
                      Start Game
                    </Button>
                    <Button
                      onClick={handleResetGame}
                      disabled={gameStatus !== 'playing'}
                      variant="secondary"
                      className="w-full"
                    >
                      Reset Game
                    </Button>
                    <Button
                      onClick={handleCloseRoom}
                      variant="ghost"
                      className="w-full"
                    >
                      Close Room
                    </Button>
                  </div>
                </Card>

                <Chat messages={chatMessages} onSendMessage={handleSendChat} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
