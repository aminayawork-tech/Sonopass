'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, BookOpen, Lightbulb, CheckCircle2, Brain, ArrowRight, Users, UserPlus } from 'lucide-react';
import ExamInterface from '@/components/ExamInterface';
import { shuffleQuestions } from '@/lib/shuffle';
import { useModality } from '@/contexts/ModalityContext';
import TabNavigation from '@/components/TabNavigation';
import StudyBuddyPanel from '@/components/StudyBuddyPanel';

export default function StudyPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryMap, setCategoryMap] = useState<Map<string, any[]>>(new Map());
  const [categories, setCategories] = useState<[string, any[]][]>([]);
  const [studyBuddyMode, setStudyBuddyMode] = useState(false);
  const [userName, setUserName] = useState('');
  const [currentSession, setCurrentSession] = useState<any>(null);
  const { currentModality, loadQuestions } = useModality();

  // Load user name and check for active session
  useEffect(() => {
    const saved = localStorage.getItem('studyBuddyName');
    if (saved) {
      setUserName(saved);
    }

    // Check if user is in an active study session
    const sessions = localStorage.getItem('studySessions');
    if (sessions) {
      const parsedSessions = JSON.parse(sessions);
      const activeSession = parsedSessions.find((s: any) =>
        s.status === 'active' && s.players.some((p: any) => p.name === saved)
      );
      if (activeSession) {
        setCurrentSession(activeSession);
      }
    }
  }, []);

  // Load questions and build category map
  useEffect(() => {
    const loadData = async () => {
      if (!currentModality) return;

      try {
        const questionsData = await loadQuestions();
        const allQuestions = [
          ...questionsData.exam1,
          ...questionsData.exam2,
          ...questionsData.exam3,
          ...questionsData.exam4
        ];
        const map = new Map<string, any[]>();

        allQuestions.forEach(q => {
          if (!map.has(q.category)) {
            map.set(q.category, []);
          }
          map.get(q.category)!.push(q);
        });

        setCategoryMap(map);
        setCategories(Array.from(map.entries()).sort((a, b) => b[1].length - a[1].length));
      } catch (error) {
        console.error('Failed to load questions:', error);
      }
    };

    loadData();
  }, [currentModality, loadQuestions]);

  // Category colors
  const categoryColors = [
    'from-purple-400 to-purple-600',
    'from-blue-400 to-blue-600',
    'from-green-400 to-green-600',
    'from-yellow-400 to-orange-500',
    'from-pink-400 to-rose-600',
    'from-indigo-400 to-indigo-600',
    'from-teal-400 to-cyan-600',
    'from-red-400 to-red-600',
    'from-emerald-400 to-emerald-600',
    'from-amber-400 to-orange-600',
    'from-violet-400 to-violet-600',
  ];

  // If category is selected, show exam interface with shuffled questions
  if (selectedCategory) {
    const rawQuestions = categoryMap.get(selectedCategory) || [];
    return (
      <StudyCategoryExam
        key={selectedCategory}
        questions={rawQuestions}
        title={selectedCategory}
        onBack={() => setSelectedCategory(null)}
        studyBuddyMode={studyBuddyMode}
        userName={userName}
        currentSession={currentSession}
        setCurrentSession={setCurrentSession}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      <TabNavigation />
      {/* Header */}
      <header className="px-4 sm:px-6 py-3 sm:py-6 bg-white/80 backdrop-blur-sm border-b-4 border-purple-400 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              Study by Section
            </h1>
            <Link href="/">
              <Button variant="outline" size="sm" className="font-bold border-2 text-xs sm:text-sm px-2.5 sm:px-4">
                <ArrowLeft className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            </Link>
          </div>

          {/* Study Buddy Toggle */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-3 sm:p-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base">Study with Friends</h3>
                  <p className="text-xs text-gray-600">Enable to see who is studying with you</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {studyBuddyMode && (
                  <Input
                    type="text"
                    placeholder="Your name..."
                    value={userName}
                    onChange={(e) => {
                      setUserName(e.target.value);
                      localStorage.setItem('studyBuddyName', e.target.value);
                    }}
                    className="w-32 sm:w-40 h-9 text-sm"
                  />
                )}
                <Button
                  onClick={() => setStudyBuddyMode(!studyBuddyMode)}
                  className={`${studyBuddyMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-600 hover:bg-gray-700'} text-white text-sm`}
                  size="sm"
                >
                  {studyBuddyMode ? 'Enabled' : 'Enable'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        <div className="text-center mb-6 sm:mb-12">
          <h2 className="text-2xl sm:text-5xl font-black text-gray-800 mb-2 sm:mb-4">
            Choose Your Topic
          </h2>
          <p className="text-base sm:text-2xl font-semibold text-gray-600">
            Master one section at a time
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {categories.map(([category, questions], index) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className="group"
            >
              <Card className={`p-4 sm:p-8 hover:scale-105 transition-all bg-gradient-to-br ${categoryColors[index % categoryColors.length]} border-0 shadow-xl h-full`}>
                <div className="flex flex-col items-center text-center text-white">
                  <BookOpen className="w-8 h-8 sm:w-16 sm:h-16 mb-2 sm:mb-4 group-hover:rotate-12 transition-transform" />
                  <h3 className="text-xs sm:text-2xl font-black mb-1 sm:mb-3 leading-tight">{category}</h3>
                  <div className="text-2xl sm:text-5xl font-black mb-0.5 sm:mb-2">{questions.length}</div>
                  <p className="text-xs sm:text-lg font-semibold opacity-90">Questions</p>
                </div>
              </Card>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}

/** Study mode with content first, then questions */
function StudyCategoryExam({
  questions,
  title,
  onBack,
  studyBuddyMode,
  userName,
  currentSession,
  setCurrentSession
}: {
  questions: any[];
  title: string;
  onBack: () => void;
  studyBuddyMode: boolean;
  userName: string;
  currentSession: any;
  setCurrentSession: (session: any) => void;
}) {
  const [showContent, setShowContent] = useState(true);
  const [shuffled, setShuffled] = useState<any[]>([]);
  const [studyContent, setStudyContent] = useState<any>(null);
  const [activeParticipants, setActiveParticipants] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { currentModality, loadStudyCategories } = useModality();

  useEffect(() => {
    setShuffled(shuffleQuestions(questions));

    // Load study guide content from modality-specific path
    const loadContent = async () => {
      if (!currentModality) return;

      try {
        const data = await loadStudyCategories();
        // Direct mapping: category title matches key in JSON
        const category = data.categories[title];
        if (category) {
          setStudyContent(category);
        }
      } catch (err) {
        console.error('Failed to load study content:', err);
      }
    };

    loadContent();

    // Handle study buddy session
    if (studyBuddyMode && userName) {
      const sessions = localStorage.getItem('studySessions');
      let parsedSessions = sessions ? JSON.parse(sessions) : [];

      // Find or create a session for this category
      let session = parsedSessions.find((s: any) =>
        s.category === title && s.status === 'active'
      );

      if (!session) {
        // Create new study session for this category
        session = {
          id: `study-${title}-${Date.now()}`,
          name: `${title} Study Session`,
          createdBy: userName,
          category: title,
          players: [{
            id: `player-${Date.now()}`,
            name: userName,
            lastActive: Date.now(),
            status: 'studying'
          }],
          status: 'active',
          maxPlayers: 10,
          questionCount: questions.length,
        };
        parsedSessions.push(session);
      } else {
        // Join existing session or update player status
        const existingPlayer = session.players.find((p: any) => p.name === userName);
        if (existingPlayer) {
          existingPlayer.lastActive = Date.now();
          existingPlayer.status = 'studying';
        } else {
          session.players.push({
            id: `player-${Date.now()}`,
            name: userName,
            lastActive: Date.now(),
            status: 'studying'
          });
        }
      }

      localStorage.setItem('studySessions', JSON.stringify(parsedSessions));
      setCurrentSession(session);
      setActiveParticipants(session.players);

      // Update participant activity periodically
      const interval = setInterval(() => {
        const currentSessions = localStorage.getItem('studySessions');
        if (currentSessions) {
          const sessions = JSON.parse(currentSessions);
          const activeSession = sessions.find((s: any) => s.id === session.id);
          if (activeSession) {
            // Filter out participants who have been inactive for more than 5 minutes
            const now = Date.now();
            const activeUsers = activeSession.players.filter(
              (p: any) => now - p.lastActive < 5 * 60 * 1000
            );
            setActiveParticipants(activeUsers);

            // Update own activity
            const me = activeUsers.find((p: any) => p.name === userName);
            if (me) {
              me.lastActive = Date.now();
              activeSession.players = activeUsers;
              localStorage.setItem('studySessions', JSON.stringify(sessions));
            }
          }
        }
      }, 10000); // Update every 10 seconds

      return () => clearInterval(interval);
    }
  }, [questions, title, currentModality, loadStudyCategories, studyBuddyMode, userName]);

  if (shuffled.length === 0 || !currentModality) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
        <div className="text-3xl font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  // Show questions after content
  if (!showContent) {
    return (
      <div className="min-h-screen bg-[#F5F7FA]">
        <ExamInterface
          questions={shuffled}
          title={title}
          mode="practice"
          modality={currentModality.id}
        />
        {/* Interactive Study Buddy Panel */}
        {studyBuddyMode && currentSession && userName && (
          <StudyBuddyPanel
            sessionId={currentSession.id}
            userName={userName}
            participants={activeParticipants}
            currentQuestion={currentQuestionIndex}
            totalQuestions={shuffled.length}
          />
        )}
      </div>
    );
  }

  // Show study content first
  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Interactive Study Buddy Panel */}
      {studyBuddyMode && currentSession && userName && (
        <StudyBuddyPanel
          sessionId={currentSession.id}
          userName={userName}
          participants={activeParticipants}
          currentQuestion={0}
          totalQuestions={shuffled.length}
          isMinimized={true}
        />
      )}
      {/* Header */}
      <header className="px-4 sm:px-6 py-4 sm:py-6 bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900"
                onClick={onBack}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Back</span>
              </Button>
              <div>
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-600" />
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h1>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Learn the concepts, then practice</p>
              </div>
            </div>
            <Button
              onClick={() => setShowContent(false)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <span className="hidden sm:inline">Start Practice</span>
              <span className="sm:hidden">Practice</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Study Buddy Indicator */}
          {studyBuddyMode && activeParticipants.length > 0 && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-semibold text-gray-900">
                    {activeParticipants.length} {activeParticipants.length === 1 ? 'person' : 'people'} studying with you
                  </span>
                </div>
                <span className="text-xs text-purple-600">
                  💬 Chat available in practice mode
                </span>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Study Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {studyContent ? (
          <div className="space-y-6">
            {/* Category Overview */}
            <Card className="p-6 sm:p-8 bg-white border border-gray-100 shadow-sm">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{studyContent.title}</h2>
                  {studyContent.quickSummary && (
                    <p className="text-base text-gray-700 leading-relaxed mb-4">{studyContent.quickSummary}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{questions.length} practice questions</span>
                  </div>
                </div>
              </div>

              {/* Key Points */}
              {studyContent.keyPoints && studyContent.keyPoints.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-3">Key Points to Remember</h3>
                      <ul className="space-y-2">
                        {studyContent.keyPoints.map((point: string, i: number) => (
                          <li key={i} className="text-sm text-blue-800 flex items-start gap-2">
                            <span className="text-blue-600 mt-1">✓</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Clinical Pearls */}
            {studyContent.clinicalPearls && studyContent.clinicalPearls.length > 0 && (
              <Card className="p-6 sm:p-8 bg-amber-50 border-2 border-amber-200 shadow-sm">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-amber-900 mb-3">Clinical Pearls & Exam Tips</h3>
                    <ul className="space-y-2.5">
                      {studyContent.clinicalPearls.map((pearl: string, i: number) => (
                        <li key={i} className="text-sm text-amber-800 flex items-start gap-2">
                          <span className="text-amber-600 mt-1 font-bold">•</span>
                          <span className="leading-relaxed">{pearl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            )}

            {/* Content Sections */}
            {Object.entries(studyContent)
              .filter(([key]) => !['title', 'icon', 'color', 'quickSummary', 'keyPoints', 'clinicalPearls', 'keyTerms'].includes(key))
              .map(([sectionKey, sectionData]: [string, any], idx: number) => {
                if (!sectionData || !sectionData.title) return null;

                return (
                  <Card key={sectionKey} className="p-6 sm:p-8 bg-white border border-gray-100 shadow-sm">
                    {/* Section Header */}
                    <div className="mb-6">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-sm font-bold text-blue-600">{idx + 1}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{sectionData.title}</h3>
                        </div>
                      </div>
                    </div>

                    {/* Section Content */}
                    <div className="text-gray-700 leading-relaxed whitespace-pre-line prose prose-sm max-w-none">
                      {sectionData.content}
                    </div>
                  </Card>
                );
              })}

            {/* Key Terms */}
            {studyContent.keyTerms && studyContent.keyTerms.length > 0 && (
              <Card className="p-6 sm:p-8 bg-white border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Key Terms to Remember</h3>
                <div className="flex flex-wrap gap-2">
                  {studyContent.keyTerms.map((term: string, i: number) => (
                    <span
                      key={i}
                      className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-100"
                    >
                      {term}
                    </span>
                  ))}
                </div>
              </Card>
            )}

            {/* Call to Action */}
            <Card className="p-6 sm:p-8 bg-gradient-to-r from-blue-500 to-blue-600 border-0 text-white shadow-lg">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Ready to Practice?</h3>
                <p className="text-blue-100 mb-6">Test your knowledge with {questions.length} practice questions</p>
                <Button
                  onClick={() => setShowContent(false)}
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50"
                >
                  Start Practice Questions
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </Card>
          </div>
        ) : (
          // Fallback if no study content available
          <Card className="p-6 sm:p-8 bg-white border border-gray-100 shadow-sm">
            <div className="text-center">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-600 mb-6">{questions.length} practice questions available</p>
              <Button
                onClick={() => setShowContent(false)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Start Practice Questions
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
