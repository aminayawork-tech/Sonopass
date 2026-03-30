'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Users, Plus, LogIn, Trophy, Target, Zap, Copy, Check,
  UserPlus, ArrowRight, Crown, Star
} from 'lucide-react';
import { useModality } from '@/contexts/ModalityContext';
import TabNavigation from '@/components/TabNavigation';

interface StudySession {
  id: string;
  name: string;
  createdBy: string;
  players: Player[];
  status: 'waiting' | 'active' | 'completed';
  maxPlayers: number;
  questionCount: number;
  category?: string;
}

interface Player {
  id: string;
  name: string;
  score: number;
  correct: number;
  total: number;
}

export default function StudyBuddyPage() {
  const { currentModality } = useModality();
  const [view, setView] = useState<'lobby' | 'create' | 'join' | 'session'>('lobby');
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [userName, setUserName] = useState('');
  const [sessionName, setSessionName] = useState('');
  const [sessionCode, setSessionCode] = useState('');
  const [currentSession, setCurrentSession] = useState<StudySession | null>(null);

  useEffect(() => {
    // Load user name from localStorage
    const saved = localStorage.getItem('studyBuddyName');
    if (saved) {
      setUserName(saved);
    }

    // Load sessions from localStorage
    loadSessions();
  }, []);

  const loadSessions = () => {
    try {
      const savedSessions = localStorage.getItem('studySessions');
      if (savedSessions) {
        const parsedSessions = JSON.parse(savedSessions);
        // Filter out old sessions (older than 24 hours)
        const now = Date.now();
        const validSessions = parsedSessions.filter((session: StudySession) => {
          const sessionTime = parseInt(session.id.replace('sess-', ''));
          return now - sessionTime < 24 * 60 * 60 * 1000; // 24 hours
        });
        setSessions(validSessions);
        // Save filtered sessions back
        localStorage.setItem('studySessions', JSON.stringify(validSessions));
      } else {
        setSessions([]);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
      setSessions([]);
    }
  };

  const saveSessions = (updatedSessions: StudySession[]) => {
    try {
      localStorage.setItem('studySessions', JSON.stringify(updatedSessions));
      setSessions(updatedSessions);
    } catch (error) {
      console.error('Error saving sessions:', error);
    }
  };

  const createSession = () => {
    if (!sessionName || !userName) return;

    const newSession: StudySession = {
      id: `sess-${Date.now()}`,
      name: sessionName,
      createdBy: userName,
      players: [
        { id: `player-${Date.now()}`, name: userName, score: 0, correct: 0, total: 0 }
      ],
      status: 'waiting',
      maxPlayers: 4,
      questionCount: 20,
    };

    localStorage.setItem('studyBuddyName', userName);
    const updatedSessions = [...sessions, newSession];
    saveSessions(updatedSessions);
    setCurrentSession(newSession);
    setView('session');
    setSessionName(''); // Clear session name for next time
  };

  const joinSession = (session: StudySession) => {
    if (!userName) {
      alert('Please enter your name first');
      return;
    }

    // Check if user is already in the session
    const alreadyJoined = session.players.some(p => p.name === userName);
    if (alreadyJoined) {
      setCurrentSession(session);
      setView('session');
      return;
    }

    const newPlayer: Player = {
      id: `player-${Date.now()}`,
      name: userName,
      score: 0,
      correct: 0,
      total: 0,
    };

    const updatedSession = {
      ...session,
      players: [...session.players, newPlayer],
    };

    // Update the session in the sessions list
    const updatedSessions = sessions.map(s =>
      s.id === session.id ? updatedSession : s
    );

    localStorage.setItem('studyBuddyName', userName);
    saveSessions(updatedSessions);
    setCurrentSession(updatedSession);
    setView('session');
  };

  const [copiedSessionId, setCopiedSessionId] = useState<string | null>(null);

  const copySessionCode = (sessionId: string) => {
    navigator.clipboard.writeText(sessionId);
    setCopiedSessionId(sessionId);
    setTimeout(() => setCopiedSessionId(null), 2000);
  };

  // Lobby View
  if (view === 'lobby') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-20">
        <TabNavigation />
        {/* Header */}
        <header className="px-4 sm:px-6 py-6 sm:py-8 bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-purple-100 flex items-center justify-center">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">Study Buddy</h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  Study with friends and compete on practice questions
                </p>
              </div>
            </div>

            {/* User Name Input */}
            <div className="mt-6 max-w-md">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Name
              </label>
              <Input
                type="text"
                placeholder="Enter your name..."
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="bg-white border-gray-200"
              />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <Card
              className="p-6 sm:p-8 bg-gradient-to-br from-emerald-500 to-emerald-600 border-0 text-white cursor-pointer hover:shadow-xl transition-all"
              onClick={() => setView('create')}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/20 flex items-center justify-center">
                  <Plus className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-1">Create Session</h3>
                  <p className="text-sm sm:text-base text-emerald-50">
                    Start a new study group
                  </p>
                </div>
              </div>
            </Card>

            <Card
              className="p-6 sm:p-8 bg-gradient-to-br from-blue-500 to-blue-600 border-0 text-white cursor-pointer hover:shadow-xl transition-all"
              onClick={() => setView('join')}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/20 flex items-center justify-center">
                  <LogIn className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-1">Join Session</h3>
                  <p className="text-sm sm:text-base text-blue-50">
                    Join with a session code
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Active Sessions */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Active Sessions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sessions.filter(s => s.status === 'waiting').map((session) => (
                <Card
                  key={session.id}
                  className="p-6 hover:shadow-lg transition-all border-2 border-gray-100"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{session.name}</h3>
                      <p className="text-sm text-gray-600">Created by {session.createdBy}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-purple-600">
                        {session.players.length}/{session.maxPlayers} players
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    {session.players.slice(0, 3).map((player, i) => (
                      <div
                        key={player.id}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white text-xs font-bold"
                      >
                        {player.name[0]}
                      </div>
                    ))}
                    {session.players.length > 3 && (
                      <div className="text-sm text-gray-500">
                        +{session.players.length - 3} more
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <Target className="w-4 h-4" />
                    <span>{session.questionCount} questions</span>
                    {session.category && (
                      <>
                        <span className="text-gray-300">•</span>
                        <span>{session.category}</span>
                      </>
                    )}
                  </div>

                  <Button
                    onClick={() => joinSession(session)}
                    disabled={session.players.length >= session.maxPlayers || !userName}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    {session.players.length >= session.maxPlayers ? 'Full' : 'Join Session'}
                    <UserPlus className="w-4 h-4 ml-2" />
                  </Button>
                </Card>
              ))}

              {sessions.filter(s => s.status === 'waiting').length === 0 && (
                <div className="col-span-2 text-center py-12 text-gray-500">
                  <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg">No active sessions. Create one to get started!</p>
                </div>
              )}
            </div>
          </div>

          {/* How It Works */}
          <Card className="mt-8 p-6 sm:p-8 bg-white border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">How Study Buddy Works</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-purple-600">1</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Create or Join</h4>
                <p className="text-sm text-gray-600">
                  Start a new session or join an existing one with friends
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-blue-600">2</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Answer Questions</h4>
                <p className="text-sm text-gray-600">
                  Each player answers the same questions and earns points
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-emerald-600">3</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Compete & Learn</h4>
                <p className="text-sm text-gray-600">
                  See who scores highest and learn together
                </p>
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-gray-700">
              <p className="font-semibold text-gray-900 mb-2">📱 Important Note:</p>
              <p>Study sessions are currently stored locally on your device. To study together, all participants should use the same device or join from the active sessions list above. Sessions created on other devices will not appear in your session list.</p>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  // Create Session View
  if (view === 'create') {
    return (
      <div className="min-h-screen bg-[#F5F7FA] pb-20">
        <TabNavigation />
        <div className="flex items-center justify-center p-4 min-h-[calc(100vh-60px)]">
        <Card className="w-full max-w-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Study Session</h2>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Name
              </label>
              <Input
                type="text"
                placeholder="Enter your name..."
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="bg-white border-gray-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Session Name
              </label>
              <Input
                type="text"
                placeholder="e.g., Evening Study Group"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                className="bg-white border-gray-200"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setView('lobby')}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={createSession}
              disabled={!userName || !sessionName}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            >
              Create Session
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
        </div>
      </div>
    );
  }

  // Join Session View
  if (view === 'join') {
    return (
      <div className="min-h-screen bg-[#F5F7FA] pb-20">
        <TabNavigation />
        <div className="flex items-center justify-center p-4 min-h-[calc(100vh-60px)]">
        <Card className="w-full max-w-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Join Study Session</h2>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Name
              </label>
              <Input
                type="text"
                placeholder="Enter your name..."
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="bg-white border-gray-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Session Code
              </label>
              <Input
                type="text"
                placeholder="Enter session code..."
                value={sessionCode}
                onChange={(e) => setSessionCode(e.target.value)}
                className="bg-white border-gray-200"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setView('lobby')}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                // Find session by code
                const session = sessions.find(s => s.id === sessionCode);
                if (session) {
                  joinSession(session);
                } else {
                  alert('Session not found. Please make sure:\n\n1. The session code is correct\n2. The session was created on this device\n3. The session is less than 24 hours old\n\nNote: Study sessions are currently stored locally on your device. Sessions created on other devices will not appear here.');
                }
              }}
              disabled={!userName || !sessionCode}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Join Session
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
        </div>
      </div>
    );
  }

  // Session View (Waiting Room / Active Game)
  if (view === 'session' && currentSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 pb-20">
        <TabNavigation />
        <header className="px-4 sm:px-6 py-6 bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{currentSession.name}</h1>
                <p className="text-sm text-gray-600 mt-1">Waiting for players...</p>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  value={currentSession.id}
                  readOnly
                  className="w-40 text-xs bg-gray-50 font-mono"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copySessionCode(currentSession.id)}
                  className={copiedSessionId === currentSession.id ? 'bg-green-50 border-green-500' : ''}
                >
                  {copiedSessionId === currentSession.id ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
          {/* Players */}
          <Card className="p-6 sm:p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Players ({currentSession.players.length}/{currentSession.maxPlayers})
            </h2>
            <div className="space-y-3">
              {currentSession.players.map((player, index) => (
                <div
                  key={player.id}
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg"
                >
                  {index === 0 && (
                    <Crown className="w-5 h-5 text-yellow-500" />
                  )}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold">
                    {player.name[0]}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{player.name}</div>
                    {index === 0 && (
                      <div className="text-xs text-gray-500">Host</div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-purple-600">Ready</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Start Button (only for host) */}
          <Button
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-6 text-lg"
            disabled={currentSession.players.length < 2}
            onClick={() => {
              if (currentSession.players.length >= 2) {
                // Update session status to active
                const updatedSession = { ...currentSession, status: 'active' as const };
                const updatedSessions = sessions.map(s =>
                  s.id === currentSession.id ? updatedSession : s
                );
                saveSessions(updatedSessions);
                // Navigate to quick-10 exam
                window.location.href = '/exam/quick-10';
              }
            }}
          >
            {currentSession.players.length < 2 ? 'Waiting for more players...' : 'Start Quiz'}
            <Zap className="w-5 h-5 ml-2" />
          </Button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Share the session code with your friends to invite them
          </p>
        </main>
      </div>
    );
  }

  return null;
}
