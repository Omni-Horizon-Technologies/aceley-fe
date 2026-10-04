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

// Tier IDs mirror the backend Tier enum: none | small | best | unlimited.
export const PAYWALL_PLANS = [
  { id: "small", label: "2000 credits", price: "$9.99 / mo", cadence: "Billed monthly" },
  { id: "best", label: "4000 credits", price: "$5.83 / mo", cadence: "Billed $69.99/year", badge: "Save 42%" },
  { id: "unlimited", label: "Unlimited", price: "$23 / mo", cadence: "Billed monthly" },
] as const;

export const PAYWALL_FEATURES = [
  "AI Powered Answers",
  "Unlimited Flashcards",
  "Unlimited Quizzes",
] as const;
