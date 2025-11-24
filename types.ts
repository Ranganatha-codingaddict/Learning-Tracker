

// User type
export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string; // New field
  photoUrl?: string; // New field
}

// Schedule types
export interface ScheduleTask {
  id: string;
  name: string;
  estimatedTime: number; // in hours
  isCompleted: boolean;
  notes?: string;
  videoLink?: string; // Add videoLink property
  originalRoadmapTaskId?: string; // Link back to the static roadmap ID
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface DailySchedule {
  day: DayOfWeek;
  tasks: ScheduleTask[];
}

// Study Timer types
export interface StudySession {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  duration: number; // in milliseconds
}

// Pomodoro types
export interface PomodoroSession {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  duration: number; // in milliseconds (e.g., 25 minutes)
  type: 'focus' | 'short-break' | 'long-break';
  completedAt: string; // ISO string
}

// Progress Tracking types
export interface Progress {
  fullStack: number; // Percentage 0-100
  dsa: number;       // Problem count
  aiMl: number;      // Percentage 0-100
  cloud: number;     // Percentage 0-100
  devOps: number;    // Percentage 0-100
  systemDesign: number; // Percentage 0-100
}

// DSA Counter types
export interface DSATracker {
  totalSolved: number;
  easy: number;
  medium: number;
  hard: number;
  todayProblems: number;
  weeklyTarget: number;
  // History for graph
  dailySolved: { date: string; count: number }[]; // YYYY-MM-DD
  dsaStreak: number;
  // History for difficulty progress over time
  difficultyProgressHistory: { date: string; easy: number; medium: number; hard: number }[]; // YYYY-MM-DD
}

// Project Tracker types
export type ProjectStatus = 'Not Started' | 'In Progress' | 'Completed';

export interface ProjectTask {
  id: string;
  description: string;
  isCompleted: boolean;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  description: string;
  status: ProjectStatus;
  githubLink?: string;
  tasks: ProjectTask[];
  milestoneDate?: string; // YYYY-MM-DD for calendar
}

// LinkedIn Reminder types
export interface LinkedInReminder {
  dailyTemplate: string;
  postIdeas: string[];
  lastPostedDate: string | null; // YYYY-MM-DD
  streak: number;
}

export interface AuthResponse {
  user: User;
  token: string; // Mock token
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface SignupDetails extends UserCredentials {
  name?: string;
  phone?: string;
  photoUrl?: string;
}

export interface WeeklySummary {
  id: string;
  weekNumber: number;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  totalTasks: number;
  completedTasks: number;
  percentageCompleted: number; // 0-100
  isWeekCompleted: boolean; // True if 100% completed
}

// Weekly Report types
export interface WeeklyReport {
  id: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  totalStudyHours: number;
  dsaTotalSolved: number;
  dsaEasy: number;
  dsaMedium: number;
  dsaHard: number;
  overallLearningStreakAtEndOfWeek: number;
  tasksCompletedPercentage: number;
  isWeekCompleted: boolean;
  notes?: string; // For user to add notes to the report
}

// Skill Tree types
export interface SkillNode {
  id: string;
  name: string;
  category: 'Full-Stack' | 'DSA' | 'Cloud' | 'DevOps' | 'AI/ML';
  prerequisites?: string[]; // IDs of prerequisite skills
  relatedTasks?: string[]; // IDs of weekly schedule tasks
  relatedProgressField?: keyof Progress; // Links to a field in Progress
  isCompleted: boolean; // Derived status
  children?: SkillNode[];
}

export interface SkillTree {
  [category: string]: SkillNode[];
}

// AI Recommendations types
export interface AIRecommendation {
  type: 'study' | 'dsa' | 'project' | 'weakTopic';
  title: string;
  description: string;
  link?: string;
}

// App-level settings
export interface AppSettings {
  isAutoRescheduleEnabled: boolean;
}

// --- Roadmap Types (New) ---

export interface RoadmapResource {
  title: string;
  url: string;
  type: 'course' | 'article' | 'book' | 'video';
}

export interface RoadmapTask {
  id: string; // Added ID for tracking
  domain: string; // e.g., "React+Next.js", "DSA"
  topic: string; // e.g., "Components & Props"
  taskDescription: string;
  durationHours: number;
  isCompleted?: boolean; // For tracking within the roadmap view
}

export interface RoadmapDay {
  day: DayOfWeek;
  tasks: RoadmapTask[];
}

export interface RoadmapWeek {
  weekNumber: number;
  title: string;
  days: RoadmapDay[];
  weeklyGoals: string[];
  deliverable?: string;
}

export interface RoadmapMonth {
  monthNumber: number;
  title: string;
  phase: 'Phase 1' | 'Phase 2' | 'Phase 3';
  goal: string;
  weeks: RoadmapWeek[];
  project?: {
    title: string;
    description: string;
    acceptanceCriteria: string[];
  };
  resources?: {
    courses: RoadmapResource[];
    books: RoadmapResource[];
  };
}

// General data structure for the app state
export interface AppData {
  userId: string;
  weeklySchedule: DailySchedule[];
  studySessions: StudySession[];
  pomodoroSessions: PomodoroSession[];
  progress: Progress;
  dsaTracker: DSATracker;
  projects: Project[];
  linkedInReminder: LinkedInReminder;
  overallLearningStreak: number;
  lastOverallStreakCheckDate: string | null;
  overallStreakHistory: { date: string; streak: number }[];
  weeklySummaries: WeeklySummary[];
  currentWeekNumber: number;
  currentWeekStartDate: string;
  pastWeeklyReports: WeeklyReport[];
  appSettings: AppSettings;
  completedRoadmapTaskIds?: string[]; // New: IDs of completed roadmap tasks
}