'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Users, MessageCircle, ThumbsUp, Heart, Zap, Brain, Send,
  TrendingUp, MessageSquare, Lightbulb, ChevronDown, ChevronUp,
  Award, Target, X
} from 'lucide-react';

interface Participant {
  id: string;
  name: string;
  lastActive: number;
  status: string;
  currentQuestion?: number;
  correctAnswers?: number;
  totalAnswered?: number;
}

interface Message {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: number;
  type: 'chat' | 'hint' | 'encouragement';
}

interface Reaction {
  id: string;
  userId: string;
  userName: string;
  emoji: string;
  timestamp: number;
}

interface StudyBuddyPanelProps {
  sessionId: string;
  userName: string;
  participants: Participant[];
  currentQuestion?: number;
  totalQuestions?: number;
  isMinimized?: boolean;
}

export default function StudyBuddyPanel({
  sessionId,
  userName,
  participants: initialParticipants,
  currentQuestion = 0,
  totalQuestions = 0,
  isMinimized: initialMinimized = false
}: StudyBuddyPanelProps) {
  const [participants, setParticipants] = useState<Participant[]>(initialParticipants);
  const [messages, setMessages] = useState<Message[]>([]);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(initialMinimized);
  const [activeTab, setActiveTab] = useState<'participants' | 'chat'>('participants');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load data from localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        // Load messages
        const savedMessages = localStorage.getItem(`study-messages-${sessionId}`);
        if (savedMessages) {
          const parsed = JSON.parse(savedMessages);
          // Only show messages from last 30 minutes
          const recentMessages = parsed.filter((m: Message) =>
            Date.now() - m.timestamp < 30 * 60 * 1000
          );
          setMessages(recentMessages);
        }

        // Load reactions
        const savedReactions = localStorage.getItem(`study-reactions-${sessionId}`);
        if (savedReactions) {
          const parsed = JSON.parse(savedReactions);
          // Only show reactions from last 5 minutes
          const recentReactions = parsed.filter((r: Reaction) =>
            Date.now() - r.timestamp < 5 * 60 * 1000
          );
          setReactions(recentReactions);
        }

        // Update participant progress
        const sessions = localStorage.getItem('studySessions');
        if (sessions) {
          const parsedSessions = JSON.parse(sessions);
          const session = parsedSessions.find((s: any) => s.id === sessionId);
          if (session) {
            setParticipants(session.players || []);
          }
        }
      } catch (err) {
        console.error('Error loading study buddy data:', err);
      }
    };

    loadData();
    const interval = setInterval(loadData, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, [sessionId]);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Update current user's progress
  useEffect(() => {
    try {
      const sessions = localStorage.getItem('studySessions');
      if (sessions) {
        const parsedSessions = JSON.parse(sessions);
        const sessionIndex = parsedSessions.findIndex((s: any) => s.id === sessionId);
        if (sessionIndex !== -1) {
          const session = parsedSessions[sessionIndex];
          const playerIndex = session.players.findIndex((p: Participant) => p.name === userName);
          if (playerIndex !== -1) {
            session.players[playerIndex].currentQuestion = currentQuestion;
            session.players[playerIndex].lastActive = Date.now();
            parsedSessions[sessionIndex] = session;
            localStorage.setItem('studySessions', JSON.stringify(parsedSessions));
          }
        }
      }
    } catch (err) {
      console.error('Error updating progress:', err);
    }
  }, [currentQuestion, sessionId, userName]);

  const sendMessage = (type: 'chat' | 'hint' | 'encouragement' = 'chat') => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      userId: `user-${userName}`,
      userName,
      message: newMessage,
      timestamp: Date.now(),
      type
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    localStorage.setItem(`study-messages-${sessionId}`, JSON.stringify(updatedMessages));
    setNewMessage('');
  };

  const sendReaction = (emoji: string) => {
    const reaction: Reaction = {
      id: `react-${Date.now()}`,
      userId: `user-${userName}`,
      userName,
      emoji,
      timestamp: Date.now()
    };

    const updatedReactions = [...reactions, reaction];
    setReactions(updatedReactions);
    localStorage.setItem(`study-reactions-${sessionId}`, JSON.stringify(updatedReactions));

    // Auto-remove reaction after 3 seconds
    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== reaction.id));
    }, 3000);
  };

  const sendEncouragement = () => {
    const encouragements = [
      "You've got this! 💪",
      "Keep up the great work! 🌟",
      "Almost there! 🎯",
      "Great progress everyone! 🚀",
      "Stay focused! 🧠"
    ];
    const random = encouragements[Math.floor(Math.random() * encouragements.length)];
    setNewMessage(random);
    setTimeout(() => sendMessage('encouragement'), 100);
  };

  const getProgressColor = (correct: number, total: number) => {
    if (total === 0) return 'bg-gray-200';
    const percentage = (correct / total) * 100;
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-blue-500';
    if (percentage >= 40) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 left-4 z-40">
        <Button
          onClick={() => setIsMinimized(false)}
          className="bg-purple-600 hover:bg-purple-700 shadow-lg"
        >
          <Users className="w-4 h-4 mr-2" />
          Study Together ({participants.length})
          <ChevronUp className="w-4 h-4 ml-2" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-40 w-80">
      <Card className="bg-white/95 backdrop-blur-sm border-2 border-purple-300 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span className="font-bold">Study Together</span>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                {participants.length}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(true)}
                className="h-7 w-7 p-0 hover:bg-white/20 text-white"
              >
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-2">
            <button
              onClick={() => setActiveTab('participants')}
              className={`flex-1 py-1.5 px-3 rounded text-xs font-semibold transition-all ${
                activeTab === 'participants'
                  ? 'bg-white text-purple-600'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Users className="w-3 h-3 inline mr-1" />
              Progress
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-1.5 px-3 rounded text-xs font-semibold transition-all ${
                activeTab === 'chat'
                  ? 'bg-white text-purple-600'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <MessageCircle className="w-3 h-3 inline mr-1" />
              Chat
              {messages.length > 0 && (
                <span className="ml-1 bg-white text-purple-600 px-1.5 py-0.5 rounded-full text-xs">
                  {messages.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="h-80">
          {activeTab === 'participants' && (
            <div className="p-3 space-y-2 h-full overflow-y-auto">
              {participants.map((participant) => {
                const progress = participant.totalAnswered || 0;
                const correct = participant.correctAnswers || 0;
                const percentage = progress > 0 ? Math.round((correct / progress) * 100) : 0;

                return (
                  <div
                    key={participant.id}
                    className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-3"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                          {participant.name[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-sm">
                            {participant.name}
                            {participant.name === userName && (
                              <span className="text-xs text-purple-600 ml-1">(You)</span>
                            )}
                          </div>
                          <div className="text-xs text-gray-600">
                            Q {participant.currentQuestion || 0}/{totalQuestions}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-gray-900">{percentage}%</div>
                        <div className="text-xs text-gray-500">
                          {correct}/{progress}
                        </div>
                      </div>
                    </div>
                    {progress > 0 && (
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all ${getProgressColor(correct, progress)}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="flex flex-col h-full">
              {/* Messages */}
              <div className="flex-1 p-3 space-y-2 overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 text-sm py-8">
                    <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No messages yet.</p>
                    <p className="text-xs mt-1">Start chatting with your study buddies!</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-2 rounded-lg ${
                        msg.type === 'encouragement'
                          ? 'bg-green-50 border border-green-200'
                          : msg.type === 'hint'
                          ? 'bg-yellow-50 border border-yellow-200'
                          : msg.userName === userName
                          ? 'bg-purple-100 border border-purple-200 ml-6'
                          : 'bg-gray-100 border border-gray-200 mr-6'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {msg.type === 'hint' && <Lightbulb className="w-3 h-3 text-yellow-600 mt-0.5" />}
                        {msg.type === 'encouragement' && <Heart className="w-3 h-3 text-green-600 mt-0.5" />}
                        <div className="flex-1">
                          <div className="text-xs font-semibold text-gray-900">
                            {msg.userName}
                            {msg.userName === userName && (
                              <span className="text-purple-600 ml-1">(You)</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-700">{msg.message}</div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Reactions */}
              <div className="border-t border-gray-200 p-2 bg-gray-50">
                <div className="flex gap-1 justify-center mb-2">
                  {['👍', '❤️', '💪', '🎯', '🔥', '⚡'].map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => sendReaction(emoji)}
                      className="text-xl hover:scale-125 transition-transform"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Input */}
              <div className="border-t border-gray-200 p-2">
                <div className="flex gap-1 mb-2">
                  <Input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage('chat');
                      }
                    }}
                    className="text-sm h-8"
                  />
                  <Button
                    size="sm"
                    onClick={() => sendMessage('chat')}
                    disabled={!newMessage.trim()}
                    className="h-8 px-2 bg-purple-600 hover:bg-purple-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={sendEncouragement}
                    className="flex-1 h-7 text-xs"
                  >
                    <Heart className="w-3 h-3 mr-1" />
                    Encourage
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Floating Reactions */}
        {reactions.length > 0 && (
          <div className="absolute top-0 right-0 left-0 pointer-events-none">
            {reactions.slice(-5).map((reaction, index) => (
              <div
                key={reaction.id}
                className="absolute animate-float-up text-3xl"
                style={{
                  left: `${20 + index * 15}%`,
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {reaction.emoji}
              </div>
            ))}
          </div>
        )}
      </Card>

      <style jsx>{`
        @keyframes float-up {
          0% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-100px);
          }
        }
        .animate-float-up {
          animation: float-up 3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
