# SonoPass Unified Design System
**One platform. One goal. Pass your registry.**

---

## Design Philosophy

SonoPass is a **unified, professional medical training platform** for sonography students preparing for ARDMS/RVT registry exams. The interface should feel like ONE cohesive application — not separate features stitched together. Every screen shares consistent visual language, navigation patterns, and purposeful design decisions that build trust and confidence.

**Core Principles:**
- **Unity**: Seamless experience across all sections
- **Clarity**: Clean, uncluttered, medical-grade professionalism
- **Focus**: Remove distractions, guide students toward success
- **Motivation**: Progress visualization and encouraging feedback
- **Trust**: Medical accuracy meets modern design standards

---

## Color Palette

### Primary Colors (Professional Medical Theme)
```css
--sono-teal-deep: #006666;      /* Primary brand - deep teal */
--sono-teal-medium: #008B8B;    /* Medium teal for accents */
--sono-blue-soft: #00B4D8;      /* Soft blue for interactive elements */
--sono-blue-light: #90E0EF;     /* Light blue for hover states */
```

### Success & Progress
```css
--sono-green-ultrasound: #00FFAA; /* Ultrasound-inspired green for success */
--sono-green-soft: #4ECCA3;       /* Softer green for progress indicators */
```

### Neutrals (Clean Medical Backgrounds)
```css
--sono-white: #FFFFFF;          /* Pure white for cards/backgrounds */
--sono-gray-50: #F8FAFB;        /* Lightest gray for page backgrounds */
--sono-gray-100: #F1F4F7;       /* Light gray for subtle dividers */
--sono-gray-300: #D1D9E0;       /* Medium gray for borders */
--sono-gray-600: #6B7785;       /* Dark gray for secondary text */
--sono-gray-900: #1A2332;       /* Near-black for primary text */
```

### Accent Colors
```css
--sono-amber: #F59E0B;          /* XP and achievements */
--sono-orange: #F97316;         /* Streak and motivation */
--sono-purple: #8B5CF6;         /* Mock exams */
--sono-red: #EF4444;            /* Errors and weak areas */
```

### Ultrasound-Inspired Gradients
```css
--gradient-primary: linear-gradient(135deg, #006666 0%, #008B8B 100%);
--gradient-success: linear-gradient(135deg, #00FFAA 0%, #4ECCA3 100%);
--gradient-soft: linear-gradient(135deg, #00B4D8 0%, #90E0EF 100%);
--gradient-ultrasound-wave: linear-gradient(90deg, #006666 0%, #00FFAA 50%, #006666 100%);
```

---

## Typography

**Primary Font**: Inter (fallback: SF Pro, system-ui, sans-serif)

### Scale
```css
--text-xs: 12px;       /* Small labels, captions */
--text-sm: 14px;       /* Body text, secondary info */
--text-base: 16px;     /* Default body text */
--text-lg: 18px;       /* Emphasized text */
--text-xl: 20px;       /* Section headings */
--text-2xl: 24px;      /* Card titles */
--text-3xl: 30px;      /* Page titles */
--text-4xl: 36px;      /* Hero elements */
--text-5xl: 48px;      /* Large numbers, metrics */
```

### Weight
```css
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-black: 900;    /* Reserved for logo and hero text */
```

---

## Navigation System

### **Simplified 4-Tab Bottom Navigation (Mobile)**

Clean, uncluttered design inspired by best-in-class financial/health apps:

```
┌─────────────────────────────────────────┐
│  [🏠 Main]  [📖 Study]  [📋 Exams]  [📊 Progress]  │
└─────────────────────────────────────────┘
```

**Tabs:**
1. **Main** (🏠 Home icon) - Dashboard/Overview
2. **Study Mode** (📖 Open book icon) - All learning content hub
3. **Mock Exams** (📋 Clipboard icon) - Practice tests
4. **Progress** (📊 Chart icon) - Analytics & insights

**Design Specs:**
- Height: 68px (mobile) + safe-area-inset-bottom
- Background: rgba(255, 255, 255, 0.95) with backdrop-blur
- Active tab: #006666 with top border indicator
- Inactive: #6B7785 with smooth transition
- Icons: 28px × 28px, rounded background (48px) for active state
- Label: 12px, font-weight 500 (active: 700)
- Elevation: subtle shadow for depth

### **Desktop Sidebar**
- Fixed left sidebar (240px wide)
- Same 4 sections with expanded labels
- Collapse to icon-only mode (<1024px)

---

## Screen Designs

### **1. Main (Home/Dashboard)**

**Purpose**: Welcome hub, motivational overview, and quick access to all features

**Layout Structure:**
```
┌──────────────────────────────────────────┐
│  GlobalHeader (Logo + Modality + Menu)   │
├──────────────────────────────────────────┤
│                                          │
│  [Greeting Section]                      │
│  "Good morning, Sarah! 🎯"              │
│  "You're 72% registry-ready"            │
│                                          │
│  [Large Circular Progress Ring]          │
│        72%                               │
│   Registry Ready                         │
│                                          │
│  [Streak + Level Cards]                  │
│   🔥 12 day streak  |  ⭐ Level 8       │
│                                          │
│  [Quick Stats Grid - 4 columns]          │
│   Questions | Accuracy | Topics | Badges │
│                                          │
│  [Personalized Recommendation Card]      │
│   "Focus Area: Venous Duplex"           │
│   "Your accuracy: 58% → Study Now"      │
│                                          │
│  [Quick Actions - Jump Back In]          │
│   [Quick 10] [Study Mode] [Mock Exam]   │
│                                          │
│  [Study Resources Section]               │
│   Study Guide | Glossary                │
│                                          │
├──────────────────────────────────────────┤
│  Bottom Nav: Main | Study | Exams | Progress │
└──────────────────────────────────────────┘
```

**Key Features:**
- **Registry Readiness Meter**: Large circular progress (120px diameter)
  - Gradient ring: #006666 → #00FFAA based on readiness
  - Percentage in center (48px, font-weight 900)
  - Motivational copy: "Almost there!" / "You're ready!" / "Keep going!"

- **Personalized Insights Card**:
  - Highlights weakest topic from Progress data
  - Direct "Study Now" button → deep-links to Study Mode filtered by topic
  - Background: soft gradient with ultrasound wave pattern (opacity 0.05)

- **Today's Goal Progress**:
  - "Daily Goal: 5/20 questions answered"
  - Horizontal progress bar with #00FFAA fill

- **Microcopy Examples**:
  - "You're on fire! 🔥 12-day streak"
  - "72% registry-ready — you're almost there!"
  - "Weak area detected: Venous Duplex (58% accuracy)"

---

### **2. Study Mode (Unified Learning Hub)**

**Purpose**: Single destination for ALL study content — Topics, Study Guide, Study Together, Glossary

**Layout Structure:**
```
┌──────────────────────────────────────────┐
│  GlobalHeader + Registry Readiness (mini)│
├──────────────────────────────────────────┤
│                                          │
│  [Segmented Control / Pills Navigation]  │
│  [Topics] [Study Guide] [Study Together] [Glossary] │
│                                          │
│  [Universal Search Bar]                  │
│  "Search topics, terms, concepts..."     │
│                                          │
│  ───── TOPICS VIEW (default) ─────      │
│                                          │
│  [Category List with Progress]           │
│   📘 Vascular Ultrasound                │
│      Progress: ████████░░ 82%           │
│      125/150 questions                  │
│      [Continue →]                        │
│                                          │
│   📕 Abdominal Ultrasound               │
│      Progress: ████░░░░░░ 45%           │
│      67/180 questions                   │
│      [Start Learning →]                  │
│                                          │
│   📗 OB/GYN Ultrasound                  │
│      Progress: ██████████ 94%           │
│      168/170 questions                  │
│      [Review Weak Areas →]              │
│                                          │
│  [Recently Studied - Quick Resume]       │
│                                          │
├──────────────────────────────────────────┤
│  Bottom Nav: Main | Study | Exams | Progress │
└──────────────────────────────────────────┘
```

**Sub-sections:**

#### **Topics Tab (Default)**
- Categorized topic list (Vascular, Abdominal, OB/GYN, etc.)
- Each card shows:
  - Category icon + name
  - Progress bar with percentage
  - Questions completed / total
  - Mastery badge (if 90%+)
  - CTA button: "Continue" / "Start Learning" / "Review Weak Areas"

#### **Study Guide Tab**
- Structured theory content
- Anatomy diagrams, concepts, protocols
- Cross-referenced with Glossary terms (tappable)
- "Mark as reviewed" progress tracking

#### **Study Together Tab**
- Live study rooms
- Compete with friends
- Leaderboards
- Social features (moved from standalone page)

#### **Glossary Tab**
- Searchable term database
- Alphabetical index with jump letters
- Each term card: Definition + related topics link
- Bookmark functionality

**Integration Points:**
- Tapping a weak topic from Progress screen → filters to that category in Topics
- Tapping a glossary term anywhere in the app → opens glossary popover with definition
- Search bar works across ALL sub-sections (shows categorized results)

**Microcopy:**
- "Master this topic to boost your Registry Readiness to 78%"
- "You're 3 questions away from unlocking the 'Vascular Expert' badge"

---

### **3. Mock Exams**

**Purpose**: Realistic exam simulation with timer, detailed review, and performance analytics

**Layout Structure:**
```
┌──────────────────────────────────────────┐
│  GlobalHeader                            │
├──────────────────────────────────────────┤
│                                          │
│  [Exam Type Selection]                   │
│                                          │
│   ┌────────────────────┐                │
│   │  Full-Length Exam  │                │
│   │  170 questions     │                │
│   │  ⏱ 3 hours         │                │
│   │  [Start Exam →]    │                │
│   └────────────────────┘                │
│                                          │
│   ┌────────────────────┐                │
│   │  Section-Specific  │                │
│   │  Choose: Vascular, │                │
│   │  Abdominal, OB/GYN │                │
│   │  [Customize →]     │                │
│   └────────────────────┘                │
│                                          │
│   ┌────────────────────┐                │
│   │  Quick 10 Practice │                │
│   │  10 random Qs      │                │
│   │  ⚡ ~5 minutes      │                │
│   │  [Start Now →]     │                │
│   └────────────────────┘                │
│                                          │
│  [Recent Exam History]                   │
│   Mock Exam #4 - 78% (Yesterday)        │
│   Mock Exam #3 - 72% (3 days ago)       │
│                                          │
├──────────────────────────────────────────┤
│  Bottom Nav: Main | Study | Exams | Progress │
└──────────────────────────────────────────┘
```

**Exam Interface (During Test):**
```
┌──────────────────────────────────────────┐
│  [Timer: 02:45:12] | Q 42/170 | [End]   │
├──────────────────────────────────────────┤
│                                          │
│  Q42. Which finding indicates...?        │
│                                          │
│  [Ultrasound Image Placeholder]          │
│                                          │
│  ⭕ A) Intrinsic compression             │
│  ⭕ B) Aortoiliac occlusive disease      │
│  ⭕ C) Inferior vena cava thrombosis     │
│  ⭕ D) Diabetic neuropathy               │
│                                          │
│  [💡 Use Hint -1❤️]                     │
│                                          │
│  [← Prev] [Flag for Review] [Next →]    │
│                                          │
└──────────────────────────────────────────┘
```

**Post-Exam Summary:**
- Overall score: Large percentage with grade (Pass/Fail)
- Section breakdown chart (bar graph by category)
- Weak areas highlighted with "Study Now" deep-links to Study Mode
- Time per question average
- Comparison to previous attempts (trend line)

**Microcopy:**
- "You scored 78% — passing score is 75%. You're registry-ready! 🎉"
- "Weak area: Venous Duplex (58%) — Study this topic to improve"

---

### **4. Progress (Analytics & Insights)**

**Purpose**: Comprehensive analytics, achievement tracking, and personalized recommendations

**Layout Structure:**
```
┌──────────────────────────────────────────┐
│  GlobalHeader                            │
├──────────────────────────────────────────┤
│                                          │
│  [Registry Readiness - Large]            │
│      ┌─────────────┐                    │
│      │     72%     │ ← Circular gauge   │
│      │  Registry   │                    │
│      │   Ready     │                    │
│      └─────────────┘                    │
│  "You're 8% away from exam-ready!"      │
│                                          │
│  [Performance Over Time - Line Chart]    │
│   Accuracy trend (last 30 days)         │
│                                          │
│  [Topic Mastery Breakdown]               │
│   ██████████ Vascular 94%               │
│   ████░░░░░░ Abdominal 45% [Study →]    │
│   ████████░░ OB/GYN 82%                 │
│   ██████░░░░ Physics 67%                │
│                                          │
│  [Weak vs Strong Areas]                  │
│   💪 Strongest: Vascular (94%)          │
│   ⚠️ Needs Work: Abdominal (45%)        │
│      [Study Abdominal Now →]            │
│                                          │
│  [Study Stats]                           │
│   Total Questions Answered: 847         │
│   Time Studied: 42 hours                │
│   Current Streak: 12 days               │
│   Longest Streak: 28 days               │
│                                          │
│  [Badges & Achievements]                 │
│   🏆 100-Day Warrior                    │
│   ⭐ Vascular Master (90%+)             │
│   🔥 Streak Legend (30 days)            │
│                                          │
├──────────────────────────────────────────┤
│  Bottom Nav: Main | Study | Exams | Progress │
└──────────────────────────────────────────┘
```

**Key Features:**
- **Registry Readiness Algorithm**: Weighted score based on:
  - Overall accuracy across all topics
  - Mock exam scores (weighted heavily)
  - Topic mastery distribution
  - Recent performance trends
  - Weak area improvement rate

- **Interactive Charts**: 
  - Accuracy by topic (horizontal bar chart)
  - Performance over time (line chart with trend)
  - Question type breakdown (pie chart)

- **Actionable Insights**:
  - "Focus on Abdominal to reach 80% registry-ready"
  - "You answered 15 questions today — only 5 more to hit your daily goal!"
  - "Your accuracy improved by 8% this week. Keep it up!"

- **One-Click Actions**:
  - Each weak area has direct "Study Now" button → filters Study Mode to that topic

**Microcopy:**
- "You're in the top 12% of SonoPass students!"
- "8% away from registry-ready — you're almost there!"
- "Your Abdominal score improved by 12% this week 📈"

---

## Component Library

### **Cards**
- **Default Card**: White background, 16px padding, 12px border-radius, subtle shadow
- **Elevated Card**: Larger shadow on hover, smooth transition
- **Interactive Card**: Scale transform (0.98) on active state
- **Gradient Card**: For featured content (Study Together, Mock Exams)

### **Buttons**
- **Primary**: Teal (#006666), white text, 48px height
- **Secondary**: White background, teal border + text
- **Ghost**: Transparent, teal text
- **Destructive**: Red (#EF4444)

### **Progress Indicators**
- **Circular Progress**: For Registry Readiness, Level progress
- **Linear Progress Bar**: For topic mastery, daily goals
- **Step Indicator**: For multi-step processes (exam setup)

### **Icons**
- **Library**: Lucide React (consistent, modern)
- **Ultrasound-Themed**: Subtle wave patterns, probe icons in backgrounds

### **Badges**
- **Mastery Badge**: Gold star for 90%+ topic completion
- **Streak Badge**: Fire icon for daily streaks
- **Level Badge**: Shield with level number

---

## Micro-interactions

### **Haptic Feedback (Mobile)**
- Light tap: Button press, tab switch
- Medium tap: Achievement unlocked
- Success pattern: Correct answer

### **Animations**
- **Page Transitions**: Slide up (300ms ease-out)
- **Card Entrance**: Staggered fade-in (100ms delay between cards)
- **Progress Updates**: Smooth value animation with spring physics
- **Button Press**: Scale down to 0.98, return to 1.0

### **Loading States**
- **Shimmer Effect**: For content loading
- **Skeleton Screens**: Match final content structure
- **Progress Spinner**: Teal gradient circular spinner

---

## Responsive Breakpoints

```css
--mobile: 0-640px      /* Single column, bottom nav */
--tablet: 641-1024px   /* 2 columns, bottom nav */
--desktop: 1025px+     /* 3-4 columns, sidebar */
```

### **Mobile Optimizations**
- Touch targets: Minimum 44px × 44px
- Safe area insets: Account for notches, home indicators
- Font scaling: Slightly larger for readability
- Reduced motion: Respect prefers-reduced-motion

---

## Branding & Voice

### **Tagline**
"One platform. One goal. Pass your registry."

### **Tone**
- **Motivational**: Encourage without overwhelming
- **Professional**: Medical-grade accuracy and trust
- **Friendly**: Approachable, supportive coach
- **Direct**: Clear, concise, actionable

### **Microcopy Guidelines**
- Use second person ("You're 72% ready")
- Celebrate progress ("Great work! +15 XP")
- Provide context ("Study Abdominal to reach 80%")
- Avoid jargon outside of medical terms
- Be specific ("8% away" vs "Almost there")

### **Success Messages**
- "Correct! +10 XP 🎉"
- "You earned the 'Vascular Master' badge!"
- "12-day streak! You're on fire 🔥"

### **Motivational Nudges**
- "Just 5 more questions to hit today's goal"
- "Your accuracy improved 8% this week!"
- "You're in the top 15% of students"

---

## Accessibility

### **WCAG 2.1 AA Compliance**
- Color contrast: 4.5:1 minimum for text
- Focus indicators: Visible keyboard focus states
- Alt text: All images, icons have descriptive labels
- Screen reader: Semantic HTML, ARIA labels
- Font size: Minimum 14px for body text

### **Keyboard Navigation**
- Tab through all interactive elements
- Enter/Space to activate buttons
- Arrow keys for radio groups, sliders
- Escape to close modals

### **Dark Mode** (Future Enhancement)
- Inverted color scheme
- Reduced blue light for evening study
- Maintains contrast ratios

---

## Implementation Notes

### **Tech Stack**
- Framework: Next.js 14+ (App Router)
- Styling: Tailwind CSS + CSS custom properties
- Icons: Lucide React
- Charts: Recharts or Chart.js
- State: React Context + localStorage

### **Performance**
- Code splitting: Route-based lazy loading
- Image optimization: Next.js Image component
- Caching: Service worker for offline support
- Bundle size: <200KB initial load

### **Analytics**
- Track: Screen views, button clicks, exam completion
- Metrics: Time to complete, accuracy trends, dropout points
- Privacy: No PII, anonymous user IDs

---

## Design Checklist

- [x] Simplified 4-tab navigation (not 6 tabs)
- [x] Consistent header across all screens
- [x] Registry Readiness widget visible everywhere
- [x] Unified Study Mode (consolidates Topics, Study Guide, Study Together, Glossary)
- [x] Professional medical color palette (teal + ultrasound green)
- [x] Cross-linking between sections (weak areas → Study Mode)
- [x] Motivational microcopy throughout
- [x] Clean, uncluttered layouts inspired by premium apps
- [x] Mobile-first, responsive design
- [x] Ultrasound-themed visual elements (subtle, not overwhelming)

---

## Future Enhancements

1. **AI Study Coach**: Personalized study plan based on weak areas
2. **Spaced Repetition**: Algorithm to resurface missed questions
3. **Dark Mode**: Evening study mode
4. **Offline Mode**: Download content for offline study
5. **Voice Mode**: Hands-free study with voice questions
6. **AR Mode**: 3D anatomy models with AR visualization
7. **Community Features**: Discussion forums, study groups
8. **Certification Tracking**: Upload cert, track expiration

---

**Designed for sonography students who refuse to settle for anything less than excellence.**

*SonoPass Design System v1.0 | Last Updated: 2026-04-06*
