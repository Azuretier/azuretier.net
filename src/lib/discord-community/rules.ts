export interface Rule {
  id: string
  title: string
  icon: string
  description: string
  examples: string[]
  doExamples: string[]
  dontExamples: string[]
}

export interface Quiz {
  id: string
  ruleId: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

export const RULES: Rule[] = [
  {
    id: 'rule-1',
    title: 'Be Respectful and Inclusive',
    icon: '🤝',
    description: 'Treat all community members with respect. No harassment, hate speech, discrimination, or personal attacks. We welcome everyone regardless of background, experience level, or identity.',
    examples: [
      'Welcome new members warmly and answer their questions patiently',
      'Disagree with ideas respectfully without attacking the person',
      'Use inclusive language that makes everyone feel valued'
    ],
    doExamples: [
      '✅ "I see your point, but have you considered..."',
      '✅ "Welcome! Feel free to ask any questions."',
      '✅ "That approach works, though here\'s another way..."'
    ],
    dontExamples: [
      '❌ "That\'s a stupid question, just Google it"',
      '❌ Using slurs or discriminatory language',
      '❌ "Only real developers would understand this"'
    ]
  },
  {
    id: 'rule-2',
    title: 'Keep Content Appropriate',
    icon: '🛡️',
    description: 'Share content that is safe for work and appropriate for all ages. No NSFW, illegal, or harmful content. Keep discussions professional and constructive.',
    examples: [
      'Share code examples, technical articles, and learning resources',
      'Post project screenshots and demo videos',
      'Discuss technology trends and best practices'
    ],
    doExamples: [
      '✅ Sharing your latest project demo',
      '✅ Posting a technical tutorial link',
      '✅ Asking for code review feedback'
    ],
    dontExamples: [
      '❌ Sharing inappropriate images or links',
      '❌ Posting content with explicit language',
      '❌ Discussing illegal activities or tools'
    ]
  },
  {
    id: 'rule-3',
    title: 'No Spam or Self-Promotion',
    icon: '🚫',
    description: 'Avoid excessive self-promotion, spam, or unsolicited advertising. Share your projects in designated channels and contribute meaningfully to discussions.',
    examples: [
      'Share your projects when they\'re relevant to the conversation',
      'Contribute to discussions before mentioning your work',
      'Ask for feedback in appropriate channels'
    ],
    doExamples: [
      '✅ "Here\'s a tool I built that solves this problem"',
      '✅ Sharing in #showcase after helping others first',
      '✅ "I wrote a blog post about this topic: [link]"'
    ],
    dontExamples: [
      '❌ "Buy my course!" posted in every channel',
      '❌ Joining just to advertise your product',
      '❌ Repeatedly posting the same promotional content'
    ]
  },
  {
    id: 'rule-4',
    title: 'Use Channels Appropriately',
    icon: '📌',
    description: 'Post content in the correct channels. Read channel descriptions before posting. Keep conversations on-topic and use threads for extended discussions.',
    examples: [
      'Read the channel description and pinned messages first',
      'Use #help for questions and #showcase for projects',
      'Start a thread for detailed discussions'
    ],
    doExamples: [
      '✅ Posting beginner questions in #beginners',
      '✅ Using threads for off-topic conversations',
      '✅ Checking pinned messages before asking common questions'
    ],
    dontExamples: [
      '❌ Posting off-topic memes in #help',
      '❌ Job postings in the general channel',
      '❌ Long debates flooding the main channel'
    ]
  },
  {
    id: 'rule-5',
    title: 'Respect Privacy and Security',
    icon: '🔒',
    description: 'Do not share personal information of others without consent. Keep credentials, API keys, and sensitive data private. Report security issues to moderators.',
    examples: [
      'Use .env files and never commit API keys',
      'Ask permission before sharing someone\'s contact info',
      'Report security vulnerabilities privately to moderators'
    ],
    doExamples: [
      '✅ "I\'ll DM you my contact info"',
      '✅ Using environment variables for secrets',
      '✅ Reporting security issues through proper channels'
    ],
    dontExamples: [
      '❌ Posting API keys or passwords in chat',
      '❌ Sharing someone else\'s email without asking',
      '❌ Publicly discussing security exploits in detail'
    ]
  },
  {
    id: 'rule-6',
    title: 'Follow Discord Terms of Service',
    icon: '📜',
    description: 'All Discord Terms of Service and Community Guidelines apply. Violations may result in warnings, temporary restrictions, or permanent bans.',
    examples: [
      'Be at least 13 years old (or older per local laws)',
      'Don\'t use automation or bots without permission',
      'Report violations to moderators'
    ],
    doExamples: [
      '✅ Following Discord\'s age requirements',
      '✅ Using approved bots and integrations',
      '✅ Reporting problematic behavior to mods'
    ],
    dontExamples: [
      '❌ Using alt accounts to evade bans',
      '❌ Running unauthorized bots',
      '❌ Raiding or brigading other servers'
    ]
  }
]

export const QUIZZES: Quiz[] = [
  {
    id: 'quiz-1-1',
    ruleId: 'rule-1',
    question: 'A new member asks a basic question that was just answered. How should you respond?',
    options: [
      'Ignore them, they should have read the previous messages',
      '"Use the search function, this was just asked"',
      '"Welcome! Here\'s the answer: [helpful response]"',
      'Tell them to Google it instead of asking here'
    ],
    correctAnswer: 2,
    explanation: 'Being welcoming and helpful to new members creates an inclusive community. While they could have searched, a friendly response is always better.'
  },
  {
    id: 'quiz-1-2',
    ruleId: 'rule-1',
    question: 'Someone disagrees with your technical approach. What\'s the best response?',
    options: [
      '"You clearly don\'t understand how this works"',
      '"I respect your view. Here\'s why I chose this approach..."',
      'Ignore them and delete your message',
      '"My way is better, you\'re wrong"'
    ],
    correctAnswer: 1,
    explanation: 'Technical discussions should focus on ideas, not people. Respectful disagreement leads to better learning for everyone.'
  },
  {
    id: 'quiz-2-1',
    ruleId: 'rule-2',
    question: 'You found a funny meme with some mild profanity. Should you share it?',
    options: [
      'Yes, it\'s just a joke',
      'No, keep content appropriate for all ages',
      'Yes, but with a content warning',
      'Only in DMs, not in channels'
    ],
    correctAnswer: 1,
    explanation: 'The community should be professional and safe for work. Even mild inappropriate content doesn\'t belong in public channels.'
  },
  {
    id: 'quiz-2-2',
    ruleId: 'rule-2',
    question: 'Which of these is appropriate to share in the community?',
    options: [
      'A blog post with excessive profanity',
      'A tutorial video with background music containing explicit lyrics',
      'A clean technical tutorial about Azure services',
      'A joke website with inappropriate imagery'
    ],
    correctAnswer: 2,
    explanation: 'Technical content that\'s professional and educational is always welcome. Keep everything safe for work.'
  },
  {
    id: 'quiz-3-1',
    ruleId: 'rule-3',
    question: 'You just launched a paid course. When can you share it?',
    options: [
      'Post it in every channel immediately',
      'Share it once in a relevant discussion or showcase channel',
      'Send DMs to everyone in the server',
      'Post it daily to maximize visibility'
    ],
    correctAnswer: 1,
    explanation: 'Occasional, relevant sharing of your work is fine, especially in designated channels. Spam and excessive promotion are not.'
  },
  {
    id: 'quiz-3-2',
    ruleId: 'rule-3',
    question: 'Someone asks about a problem you solved in your blog. What\'s appropriate?',
    options: [
      '"Buy my $199 course to learn how"',
      '"I wrote about this here: [link]. Hope it helps!"',
      'Refuse to help unless they subscribe',
      'Share only after posting 10 promotional messages'
    ],
    correctAnswer: 1,
    explanation: 'Sharing your content when it\'s directly relevant and helpful is perfect. The focus should be on helping, not selling.'
  },
  {
    id: 'quiz-4-1',
    ruleId: 'rule-4',
    question: 'You have a JavaScript question. Where should you post it?',
    options: [
      'In #general for maximum visibility',
      'In every channel to increase chances of an answer',
      'In #help or #javascript (if it exists)',
      'In #introductions'
    ],
    correctAnswer: 2,
    explanation: 'Using appropriate channels keeps the community organized and helps people find relevant discussions.'
  },
  {
    id: 'quiz-4-2',
    ruleId: 'rule-4',
    question: 'You\'re having a detailed debate with someone about tabs vs spaces. What should you do?',
    options: [
      'Keep posting in the main channel',
      'Move the discussion to a thread',
      'Create a new channel for it',
      'Take it to every channel for more opinions'
    ],
    correctAnswer: 1,
    explanation: 'Threads are perfect for extended discussions that might flood the main channel. It keeps the conversation accessible without overwhelming others.'
  },
  {
    id: 'quiz-5-1',
    ruleId: 'rule-5',
    question: 'You accidentally included an API key in a screenshot. What should you do?',
    options: [
      'Leave it, no one will notice',
      'Immediately delete it and regenerate the API key',
      'Just delete the message, the key is still safe',
      'Edit the image to blur it out'
    ],
    correctAnswer: 1,
    explanation: 'Once a credential is exposed, consider it compromised. Delete the message and immediately regenerate the key.'
  },
  {
    id: 'quiz-5-2',
    ruleId: 'rule-5',
    question: 'Someone asks for another member\'s email to collaborate. What should you do?',
    options: [
      'Share it if you know it',
      'Tell them to DM the person directly',
      'Post it publicly so others can connect too',
      'Give them the person\'s social media instead'
    ],
    correctAnswer: 1,
    explanation: 'Never share someone else\'s contact information without their permission. Let people connect directly.'
  },
  {
    id: 'quiz-6-1',
    ruleId: 'rule-6',
    question: 'You were temporarily banned for breaking rules. What\'s the right approach?',
    options: [
      'Create a new account to get around the ban',
      'Wait out the ban and follow rules when you return',
      'Use a friend\'s account to keep participating',
      'DM all the mods to complain'
    ],
    correctAnswer: 1,
    explanation: 'Ban evasion violates Discord\'s Terms of Service and can result in a permanent ban. Respect the moderation decision.'
  },
  {
    id: 'quiz-6-2',
    ruleId: 'rule-6',
    question: 'You see someone consistently breaking community rules. What should you do?',
    options: [
      'Argue with them publicly',
      'Report them to moderators',
      'Create a callout post',
      'Ignore it completely'
    ],
    correctAnswer: 1,
    explanation: 'Moderators are here to handle rule violations. Report issues to them rather than engaging in public conflicts.'
  }
]

export function getQuizzesForRule(ruleId: string): Quiz[] {
  return QUIZZES.filter(q => q.ruleId === ruleId)
}

export function getAllRuleIds(): string[] {
  return RULES.map(r => r.id)
}
