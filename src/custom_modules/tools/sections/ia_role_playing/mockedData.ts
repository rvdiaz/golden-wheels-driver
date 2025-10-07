export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Scenario {
  id: string;
  type: 'buyer' | 'seller' | 'investor' | 'objection' | 'negotiation';
  title: string;
  description: string;
  icon: string;
  color: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number;
  initialMessage: string;
  objections: string[];
  tips: string[];
}

export const ROLE_PLAY_SCENARIOS: Scenario[] = [
  {
    id: '1',
    type: 'buyer',
    title: 'First-Time Home Buyer',
    description:
      'Practice working with a nervous first-time buyer who has many questions about the process.',
    icon: '🏠',
    color: '#3b82f6',
    difficulty: 'Beginner',
    duration: 5,
    initialMessage:
      "Hi, I'm thinking about buying my first home but I'm not sure where to start. This all seems pretty overwhelming to be honest.",
    objections: [
      "I've heard the market is really expensive right now. How can I afford a home?",
      "I need to think about this. It's a big decision and I don't want to rush.",
      "My friend said I don't really need an agent. Can't I just find homes online myself?",
    ],
    tips: [
      'Build trust by acknowledging their concerns and showing empathy',
      'Educate them about the buying process step-by-step',
      'Use analogies and simple explanations for complex concepts',
      'Focus on long-term benefits rather than pushing for immediate action',
    ],
  },
  {
    id: '2',
    type: 'seller',
    title: 'Motivated Seller',
    description:
      'Work with a homeowner who needs to sell quickly but wants to maximize their profit.',
    icon: '💰',
    color: '#10b981',
    difficulty: 'Intermediate',
    duration: 7,
    initialMessage:
      "I need to sell my house within the next 60 days due to a job relocation. But I also don't want to leave money on the table. What can you do for me?",
    objections: [
      'Your commission seems high. Other agents are offering lower rates.',
      "Why should I choose you over the other agents I'm interviewing?",
      'I want to list at $50K above market value and see what happens.',
    ],
    tips: [
      'Balance urgency with realistic pricing strategies',
      'Present data-driven market analysis to support your recommendations',
      'Demonstrate your marketing plan and how it accelerates sales',
      'Show how proper pricing attracts more buyers and better offers',
    ],
  },
  {
    id: '3',
    type: 'investor',
    title: 'Real Estate Investor',
    description:
      'Handle an experienced investor looking for ROI-focused properties and detailed market analysis.',
    icon: '📊',
    color: '#f59e0b',
    difficulty: 'Advanced',
    duration: 10,
    initialMessage:
      "I'm looking to add rental properties to my portfolio. I need properties with at least 8% ROI and good appreciation potential. What do you have for me?",
    objections: [
      "These numbers don't make sense. Show me the actual cash flow analysis.",
      'I can find better deals myself on the MLS. Why do I need you?',
      'Your market knowledge seems limited. Do you actually work with investors?',
    ],
    tips: [
      'Speak in terms of numbers: ROI, cap rates, cash-on-cash returns',
      'Have specific market data and comps readily available',
      'Understand investor mindset - they care about profits, not emotions',
      'Show your track record with other investment clients',
    ],
  },
  {
    id: '4',
    type: 'objection',
    title: 'Price Objection Handler',
    description: 'Master handling the most common objection: "Your commission is too high."',
    icon: '⚡',
    color: '#ef4444',
    difficulty: 'Intermediate',
    duration: 5,
    initialMessage:
      "I like you, but honestly your 6% commission seems really high. I've been seeing a lot of discount brokers offering 1-2%. Why should I pay more?",
    objections: [
      "But you're just opening some doors and putting it on the MLS, right?",
      'The house will basically sell itself in this market.',
      'Can you at least match the 4% rate another agent quoted me?',
    ],
    tips: [
      'Never apologize for your commission - it shows lack of confidence',
      'Focus on value, not price. What services justify your fee?',
      'Use the "you get what you pay for" principle with examples',
      'Share success stories showing how you netted sellers MORE money',
    ],
  },
  {
    id: '5',
    type: 'objection',
    title: 'Timing Objection',
    description: 'Learn to handle prospects who say they need to "think about it" or "wait."',
    icon: '⏰',
    color: '#8b5cf6',
    difficulty: 'Beginner',
    duration: 5,
    initialMessage:
      "This all sounds good, but I think I need some time to think about it. Can I call you back in a few months when I'm ready?",
    objections: [
      "I'm just not ready to commit to anything right now.",
      "The market might be better in 6 months. I'll wait and see.",
      'I need to talk to my spouse/partner first before making any decisions.',
    ],
    tips: [
      'Uncover the real objection - "time to think" often masks another concern',
      'Ask what specifically they need to think about',
      'Create urgency by discussing market conditions and timing',
      'Offer a low-commitment next step instead of pushing for full commitment',
    ],
  },
  {
    id: '6',
    type: 'negotiation',
    title: 'Multiple Offer Situation',
    description:
      'Navigate a competitive bidding situation with a buyer who wants to win without overpaying.',
    icon: '🎯',
    color: '#ec4899',
    difficulty: 'Advanced',
    duration: 8,
    initialMessage:
      "We just found out there are 5 other offers on the house we want. I really love this place, but I don't want to get caught up in a bidding war and overpay. What should we do?",
    objections: [
      "Going $50K over asking price seems insane. Are you sure that's necessary?",
      'Why should we waive the inspection? That seems really risky.',
      "If we don't get this house, I'm going to be so disappointed. Can't you just make it happen?",
    ],
    tips: [
      'Set realistic expectations about competitive markets',
      'Discuss strategy: escalation clauses, clean offers, personal letters',
      'Know when to walk away - protect your client from overpaying',
      'Present creative solutions beyond just offering more money',
    ],
  },
  {
    id: '7',
    type: 'seller',
    title: 'FSBO Conversion',
    description:
      'Convert a For Sale By Owner who thinks they can save money by selling themselves.',
    icon: '🤝',
    color: '#06b6d4',
    difficulty: 'Advanced',
    duration: 10,
    initialMessage:
      "I've had my house listed For Sale By Owner for 3 months now. I've had some showings but no offers. I'm not sure I need an agent though - I'd rather save the commission.",
    objections: [
      "I've already done most of the work. Why would I give you thousands now?",
      "Can't you just charge me a flat fee instead of percentage?",
      'My neighbor sold their house themselves and saved $20,000 in commissions.',
    ],
    tips: [
      'Acknowledge their effort and initiative - dont criticize their FSBO attempt',
      'Focus on the time, stress, and potential money they are losing',
      'Present data on FSBO vs agent-sold homes (price and days on market)',
      'Offer to review their current situation with no obligation',
    ],
  },
  {
    id: '8',
    type: 'buyer',
    title: 'Unrealistic Expectations',
    description: 'Manage a buyer with champagne taste on a beer budget who needs a reality check.',
    icon: '🏰',
    color: '#f97316',
    difficulty: 'Intermediate',
    duration: 7,
    initialMessage:
      "I have a budget of $300K but I really want a 4-bedroom house with a pool in the best school district. I've been looking for months and can't find anything. Can you help?",
    objections: [
      "But I NEED 4 bedrooms. I can't compromise on that.",
      'I refuse to look at houses in anything less than a 9/10 school district.',
      'Maybe I should just wait until the market crashes and prices come down.',
    ],
    tips: [
      'Be honest but tactful about market realities',
      'Help them prioritize must-haves vs nice-to-haves',
      'Show the math - what their budget actually gets them',
      'Present creative alternatives: different areas, fixer-uppers, etc.',
    ],
  },
];

export const generateAIFeedback = (
  messageCount: number,
  scenarioType: string
): {
  score: number;
  strengths: string[];
  improvements: string[];
} => {
  const baseScore = 60;
  const messageBonus = Math.min(messageCount * 5, 30);
  const score = Math.min(baseScore + messageBonus + Math.floor(Math.random() * 10), 95);

  const allStrengths = [
    'Demonstrated active listening by acknowledging client concerns',
    'Asked clarifying questions to understand needs better',
    'Maintained professional and empathetic tone throughout',
    'Used real estate terminology appropriately',
    'Provided specific examples to support your points',
    'Showed confidence in your expertise',
    'Built rapport effectively',
    'Addressed objections directly and honestly',
  ];

  const allImprovements = [
    'Could have asked more open-ended questions',
    'Try incorporating more market data and statistics',
    'Consider using analogies to make complex concepts clearer',
    'Work on creating more urgency in your responses',
    'Practice handling objections with the feel-felt-found method',
    'Could be more specific about your value proposition',
    'Try to uncover the root concern behind surface objections',
    'Consider using success stories from past clients',
  ];

  const strengths = allStrengths.sort(() => 0.5 - Math.random()).slice(0, 3);

  const improvements = allImprovements.sort(() => 0.5 - Math.random()).slice(0, 3);

  return { score, strengths, improvements };
};
