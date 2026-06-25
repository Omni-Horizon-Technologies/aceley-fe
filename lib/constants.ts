export const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Canada",
  "Nigeria",
  "Ghana",
  "South Africa",
  "Kenya",
  "India",
  "Pakistan",
  "Bangladesh",
  "Australia",
  "Ireland",
  "Germany",
  "France",
  "Spain",
  "Brazil",
  "Mexico",
  "China",
  "Japan",
  "Other",
] as const;

export const MAJOR_SUGGESTIONS = [
  "Computer Science",
  "Biology",
  "Chemistry",
  "Mathematics",
  "Physics",
  "Engineering",
  "Economics",
  "Business",
  "Psychology",
  "Pre-Med",
  "Nursing",
  "Law",
  "Accounting",
  "English",
  "Political Science",
  "Mechanical Engineering",
  "Electrical Engineering",
  "Architecture",
] as const;

export const SOURCE_OPTIONS = [
  { id: "instagram", label: "Instagram Reels", color: "bg-pink-500", icon: "camera" },
  { id: "tiktok", label: "TikTok", color: "bg-black", icon: "music" },
  { id: "youtube", label: "YouTube", color: "bg-red-600", icon: "play" },
  { id: "friend", label: "Friend or Family", color: "bg-blue-600", icon: "chat" },
  { id: "app-store", label: "App Store", color: "bg-black", icon: "apple" },
  { id: "google", label: "Google Search", color: "bg-white", icon: "google" },
  { id: "other", label: "Other", color: "bg-amber-500", icon: "pencil" },
] as const;

export const DUMMY_SPACES = [
  {
    code: "BIO 101",
    title: "Cell Biology Lab",
    description: "Core cell structure, membranes, organelles, and mitosis review.",
    members: 184,
    color: "#16A34A",
    sampleNotes: ["Organelle functions", "Mitosis phases", "Cell membrane transport"],
    pastQuestions: ["Compare mitosis and meiosis.", "Explain active transport."],
    tips: ["Draw each phase once before revising labels."],
    resources: ["Cell cycle checklist", "Membrane transport guide"],
  },
  {
    code: "CS 251",
    title: "Data Structures",
    description: "Trees, graphs, heaps, queues, and algorithm walkthroughs.",
    members: 231,
    color: "#312E81",
    sampleNotes: ["Binary trees", "Graph traversal", "Hash maps"],
    pastQuestions: ["Trace BFS on a weighted graph.", "Compare stack and queue use cases."],
    tips: ["Write complexity beside every operation."],
    resources: ["Big-O crib sheet", "Traversal practice pack"],
  },
  {
    code: "MATH 201",
    title: "Calculus Studio",
    description: "Limits, derivatives, integrals, and exam-style problem sets.",
    members: 146,
    color: "#CA8A04",
    sampleNotes: ["Chain rule", "Integration by parts", "Optimization"],
    pastQuestions: ["Find the derivative using the product rule.", "Set up an area integral."],
    tips: ["State the rule before applying it."],
    resources: ["Derivative table", "Integral patterns"],
  },
  {
    code: "ECON 202",
    title: "Microeconomics",
    description: "Supply, demand, elasticity, markets, and policy analysis.",
    members: 119,
    color: "#DC2626",
    sampleNotes: ["Elasticity", "Market failures", "Consumer surplus"],
    pastQuestions: ["Explain price ceilings with a diagram.", "Calculate PED."],
    tips: ["Label axes before interpreting the graph."],
    resources: ["Diagram bank", "Formula sheet"],
  },
] as const;

export const SAMPLE_DECK = [
  {
    front: "What is mitosis?",
    back: "Mitosis is nuclear division that produces two genetically identical daughter cells.",
  },
  {
    front: "What is meiosis?",
    back: "Meiosis is cell division that produces four genetically different haploid gametes.",
  },
  {
    front: "Which mitosis phase lines chromosomes at the equator?",
    back: "Metaphase.",
  },
  {
    front: "What separates during anaphase I of meiosis?",
    back: "Homologous chromosomes separate during anaphase I.",
  },
  {
    front: "Why does crossing over matter?",
    back: "It creates genetic variation by exchanging DNA between homologous chromosomes.",
  },
] as const;

export const SAMPLE_QUIZ = {
  title: "Cell Biology Check",
  questions: [
    {
      question: "Which organelle releases energy from glucose?",
      options: ["Nucleus", "Mitochondrion", "Ribosome", "Golgi body"],
      answer: 1,
      explanation: "Mitochondria carry out aerobic respiration and release usable energy.",
    },
    {
      question: "What is the function of ribosomes?",
      options: ["Make proteins", "Store DNA", "Digest waste", "Control water balance"],
      answer: 0,
      explanation: "Ribosomes translate genetic instructions into proteins.",
    },
    {
      question: "Which structure controls what enters and leaves the cell?",
      options: ["Cell membrane", "Cell wall", "Vacuole", "Cytoplasm"],
      answer: 0,
      explanation: "The cell membrane is selectively permeable.",
    },
    {
      question: "What is the main role of the nucleus?",
      options: ["Photosynthesis", "Protein folding", "Control cell activity", "Make ATP"],
      answer: 2,
      explanation: "The nucleus contains DNA and controls cell activities.",
    },
    {
      question: "Which process produces identical body cells?",
      options: ["Meiosis", "Mitosis", "Fertilisation", "Osmosis"],
      answer: 1,
      explanation: "Mitosis produces genetically identical cells for growth and repair.",
    },
  ],
} as const;

export const EXPLAIN_STYLES = [
  { id: "kid", label: "Like I'm 10", description: "Simple words and everyday comparisons." },
  { id: "lecturer", label: "Like my lecturer", description: "Clear academic explanation." },
  { id: "exam", label: "Like an exam answer", description: "Structured points for marks." },
  { id: "friend", label: "Like a friend", description: "Casual and encouraging." },
] as const;

export const FOCUS_PRESETS = [
  { id: "pomodoro", label: "Pomodoro", minutes: 25 },
  { id: "deep-work", label: "Deep Work", minutes: 50 },
  { id: "sprint", label: "Sprint", minutes: 15 },
  { id: "marathon", label: "Marathon", minutes: 90 },
] as const;

export const FOCUS_AUDIO = [
  { id: "silence", label: "Silence" },
  { id: "rain", label: "Soft rain" },
  { id: "forest", label: "Forest" },
  { id: "lofi", label: "Lo-fi study" },
  { id: "cafe", label: "Library cafe" },
] as const;

export const PAYWALL_PLANS = [
  { id: "monthly", label: "Monthly", price: "$14.99/mo", cadence: "Flexible access" },
  { id: "yearly", label: "Yearly", price: "$97.99/yr", cadence: "Best value", badge: "Most Popular" },
] as const;

export const PAYWALL_FEATURES = [
  "AI Powered Answers",
  "Unlimited Flashcards",
  "Unlimited Quizzes",
] as const;
