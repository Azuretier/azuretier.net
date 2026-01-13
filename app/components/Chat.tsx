'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card } from './ui/Card';

interface ChatMessage {
  sender: string;
  message: string;
  timestamp: number;
}

interface ChatProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  maxLength?: number;
}

export function Chat({ messages, onSendMessage, maxLength = 200 }: ChatProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (trimmed) {
      onSendMessage(trimmed);
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="flex flex-col h-[400px]">
      <h3 className="text-xl font-bold text-cyan-400 mb-4">Chat</h3>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-2 px-2">
        {messages.length === 0 ? (
          <div className="text-center text-zinc-500 py-8">
            No messages yet
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className="p-2 rounded-lg bg-zinc-900/50 border border-zinc-800"
            >
              <span className="font-semibold text-cyan-400">{msg.sender}:</span>
              <span className="ml-2 text-white">{msg.message}</span>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          maxLength={maxLength}
          className="flex-1"
        />
        <Button onClick={handleSend} size="md" className="px-6">
          Send
        </Button>
      </div>
    </Card>
  );
}
