# SonoPass - Vascular Sonography Registry Exam Prep

A Duolingo-style study app to help you ace your vascular sonography registry exam.

## Features

- **Quick 10 Mode**: Practice with 10 random questions for quick study sessions
- **Full Exam Mode**: Take complete practice exams to simulate the real test
- **Instant Feedback**: See explanations for every answer immediately
- **Progress Tracking**: Track your performance with detailed results
- **Beautiful UI**: Duolingo-inspired design for an engaging learning experience

## Getting Started

### Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Deploy to Vercel

The easiest way to deploy this app is with Vercel:

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Vercel will auto-detect Next.js and deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/sonopass)

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## Adding Your Own Exams

The app currently includes sample vascular sonography questions. To add your own exams:

1. Open `data/vascular-exams.ts`
2. Add your questions following this format:

```typescript
{
  id: 'unique-id',
  question: 'Your question text?',
  options: [
    'Option A',
    'Option B',
    'Option C',
    'Option D'
  ],
  correctAnswer: 0, // Index of correct option (0-3)
  explanation: 'Detailed explanation of the correct answer',
  category: 'Category Name',
  difficulty: 'easy' | 'medium' | 'hard'
}
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Study Tips

- Take your time to read each question carefully
- Review explanations to reinforce your learning
- Aim for 70% or higher to simulate passing the registry
- Retake exams to improve your score and understanding

## License

MIT

---

Built to help sonographers pass their registry exams. Good luck with your studies!
