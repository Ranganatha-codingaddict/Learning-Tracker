
import { DailySchedule, DSATracker, LinkedInReminder, Progress, AppSettings, WeeklyReport, RoadmapMonth } from './types';
import { getStartOfWeek, getFormattedDate } from './utils/dateUtils'; // Import getFormattedDate

export const WEEKLY_SCHEDULE: DailySchedule[] = [
  {
    day: 'Monday',
    tasks: [
      { id: 'm1', name: 'DSA: Linked Lists & Arrays - Advanced Problems', estimatedTime: 2.0, isCompleted: false, videoLink: 'https://www.tapacademy.com/dsa-linked-lists-arrays-advanced' },
      { id: 'm2', name: 'Frontend: React State Management (Redux/Zustand)', estimatedTime: 2.5, isCompleted: false, videoLink: 'https://www.youtube.com/watch?v=react-state-management' },
      { id: 'm3', name: 'Review new JS ESNext features (Proxies, Reflect)', estimatedTime: 1.0, isCompleted: false, videoLink: 'https://www.youtube.com/watch?v=js-esnext' },
      { id: 'm4', name: 'Frontend: Responsive Design Principles & CSS Grid', estimatedTime: 1.5, isCompleted: false, videoLink: 'https://www.youtube.com/watch?v=responsive-css-grid' },
    ],
  },
  {
    day: 'Tuesday',
    tasks: [
      { id: 't1', name: 'DSA: Trees & Graphs - DFS/BFS Applications', estimatedTime: 2.0, isCompleted: false, videoLink: 'https://www.tapacademy.com/dsa-trees-graphs-applications' },
      { id: 't2', name: 'Backend: Spring Boot Microservices Architecture', estimatedTime: 3.0, isCompleted: false, videoLink: 'https://www.udemy.com/course/spring-boot-microservices-advanced/' },
      { id: 't3', name: 'Database Optimization Techniques (Indexing, Query Tuning)', estimatedTime: 1.5, isCompleted: false, videoLink: 'https://www.youtube.com/watch?v=database-optimization' },
      { id: 't4', name: 'Backend: REST API Security Best Practices', estimatedTime: 2.0, isCompleted: false, videoLink: 'https://www.youtube.com/watch?v=rest-api-security' },
    ],
  },
  {
    day: 'Wednesday',
    tasks: [
      { id: 'w1', name: 'Python: Decorators, Generators & Context Managers', estimatedTime: 2.0, isCompleted: false, videoLink: 'https://www.tapacademy.com/python-advanced-features' },
      { id: 'w2', name: 'ML: Unsupervised Learning (Clustering, PCA)', estimatedTime: 3.0, isCompleted: false, videoLink: 'https://www.youtube.com/watch?v=unsupervised-learning' },
      { id: 'w3', name: 'Implement a simple NLP sentiment analysis model', estimatedTime: 2.0, isCompleted: false, videoLink: 'https://www.youtube.com/watch?v=nlp-sentiment' },
      { id: 'w4', name: 'Python: Asynchronous Programming (async/await)', estimatedTime: 1.5, isCompleted: false, videoLink: 'https://www.youtube.com/watch?v=python-async' },
    ],
  },
  {
    day: 'Thursday',
    tasks: [
      { id: 'th1', name: 'AWS: Lambda & API Gateway for Serverless', estimatedTime: 2.5, isCompleted: false, videoLink: 'https://www.youtube.com/watch?v=aws-lambda-api-gateway' },
      { id: 'th2', name: 'ML Projects: Deep Learning with TensorFlow/PyTorch', estimatedTime: 3.5, isCompleted: false, videoLink: 'https://www.youtube.com/watch?v=ml-deep-learning' },
      { id: 'th3', name: 'Deploy a static website on AWS S3 & CloudFront', estimatedTime: 1.5, isCompleted: false, videoLink: 'https://www.youtube.com/watch?v=aws-s3-cloudfront' },
      { id: 'th4', name: 'ML Projects: Model Deployment & Monitoring', estimatedTime: 2.0, isCompleted: false, videoLink: 'https://www.youtube.com/watch?v=ml-model-deployment' },
    ],
  },
  {
    day: 'Friday',
    tasks: [
      { id: 'f1', name: 'DevOps: Kubernetes Basics & Pods', estimatedTime: 3.0, isCompleted: false, videoLink: 'https://www.youtube.com/watch?v=kubernetes-basics' },
      { id: 'f2', name: 'Deployment: Advanced CI/CD with Jenkins/GitLab CI', estimatedTime: 3.0, isCompleted: false, videoLink: 'https://www.udemy.com/course/advanced-ci-cd/' },
      { id: 'f3', name: 'Set up local Kubernetes cluster (Minikube/Docker Desktop)', estimatedTime: 1.5, isCompleted: false, videoLink: 'https://www.youtube.com/watch?v=kubernetes-local-setup' },
      { id: 'f4', name: 'DevOps: Infrastructure as Code (Terraform/Ansible)', estimatedTime: 2.0, isCompleted: false, videoLink: 'https://www.youtube.com/watch?v=iac-terraform' },
    ],
  },
  {
    day: 'Saturday',
    tasks: [
      { id: 'sa1', name: 'System Design: Distributed Systems & Consensus', estimatedTime: 3.5, isCompleted: false, videoLink: 'https://www.youtube.com/watch?v=distributed-systems' },
      { id: 'sa2', name: 'Projects: Implement a new feature in personal project', estimatedTime: 3.0, isCompleted: false, videoLink: 'https://www.youtube.com/watch?v=personal-project-feature' },
      { id: 'sa3', name: 'Participate in a coding contest or hackathon prep', estimatedTime: 2.0, isCompleted: false, videoLink: 'https://www.youtube.com/watch?v=coding-contest-prep' },
      { id: 'sa4', name: 'System Design: Microservices Patterns & Communication', estimatedTime: 2.5, isCompleted: false, videoLink: 'https://www.youtube.com/watch?v=microservices-patterns' },
    ],
  },
  {
    day: 'Sunday',
    tasks: [
      { id: 'su1', name: 'Revision: Weekly review of challenging topics', estimatedTime: 2.5, isCompleted: false, videoLink: 'https://www.youtube.com/watch?v=weekly-challenging-revision' },
      { id: 'su2', name: 'Mocks: Full-stack coding interview practice', estimatedTime: 2.0, isCompleted: false, videoLink: 'https://www.tapacademy.com/mock-interview-fullstack' },
      { id: 'su3', name: 'LinkedIn: Engage with connections & industry posts', estimatedTime: 1.0, isCompleted: false, videoLink: 'https://www.youtube.com/watch?v=linkedin-engagement' },
      { id: 'su4', name: 'Revision: System Design Case Study Analysis', estimatedTime: 1.5, isCompleted: false, videoLink: 'https://www.youtube.com/watch?v=system-design-case-study' },
    ],
  },
];

export const INITIAL_PROGRESS: Progress = {
  fullStack: 0,
  dsa: 0,
  aiMl: 0,
  cloud: 0,
  devOps: 0,
  systemDesign: 0,
};

export const INITIAL_DSA_TRACKER: DSATracker = {
  totalSolved: 0,
  easy: 0,
  medium: 0,
  hard: 0,
  todayProblems: 0,
  weeklyTarget: 10,
  dailySolved: [],
  dsaStreak: 0,
  difficultyProgressHistory: [], // Initialize new field
};

export const INITIAL_LINKEDIN_REMINDER: LinkedInReminder = {
  dailyTemplate: "Today's learning: [Topic]. Key takeaway: [Insight]. #coding #dev #learning",
  postIdeas: [
    "Share a recent coding challenge you overcame.",
    "Discuss a new technology you're excited about.",
    "Post about a valuable resource you found.",
    "Reflect on your learning journey or career goals.",
    "Ask a question to engage your network.",
  ],
  lastPostedDate: null,
  streak: 0,
};

// Initial overall streak values, including the history array for the chart
export const INITIAL_OVERALL_STREAK = {
  overallLearningStreak: 0,
  lastOverallStreakCheckDate: null,
  overallStreakHistory: [], // New field for streak chart
};

// Initial values for weekly progress tracking
export const INITIAL_WEEKLY_PROGRESS_STATE = {
  weeklySummaries: [],
  currentWeekNumber: 1, // Start with Week 1
  currentWeekStartDate: getFormattedDate(getStartOfWeek(new Date())),
};

// Initial Pomodoro sessions
export const INITIAL_POMODORO_SESSIONS = [];

// Initial App Settings
export const INITIAL_APP_SETTINGS: AppSettings = {
  isAutoRescheduleEnabled: false, // Default to disabled
};

// Initial past weekly reports
export const INITIAL_PAST_WEEKLY_REPORTS: WeeklyReport[] = [];

// Skill Tree data structure (simplified for mock, would be more detailed in a real app)
export const SKILL_TREE_DATA = {
  'Full-Stack': [
    { id: 'fs-1', name: 'HTML/CSS Basics', category: 'Full-Stack', relatedTasks: ['m2', 'm4'], isCompleted: false, children: [] },
    { id: 'fs-2', name: 'JavaScript Fundamentals', category: 'Full-Stack', relatedTasks: ['m3'], isCompleted: false, children: [] },
    { id: 'fs-3', name: 'React.js Core', category: 'Full-Stack', relatedTasks: ['m2'], isCompleted: false, children: ['fs-1', 'fs-2'] },
    { id: 'fs-4', name: 'Node.js/Express Basics', category: 'Full-Stack', relatedTasks: ['t2', 't3'], isCompleted: false, children: ['fs-2'] },
    { id: 'fs-5', name: 'Database Fundamentals', category: 'Full-Stack', relatedTasks: ['t3'], isCompleted: false, children: [] },
    { id: 'fs-6', name: 'API Design', category: 'Full-Stack', relatedTasks: ['t4'], isCompleted: false, children: ['fs-4'] },
  ],
  'DSA': [
    { id: 'dsa-1', name: 'Arrays & Strings', category: 'DSA', relatedTasks: ['m1'], relatedProgressField: 'dsa', isCompleted: false, children: [] },
    { id: 'dsa-2', name: 'Linked Lists', category: 'DSA', relatedTasks: ['m1'], relatedProgressField: 'dsa', isCompleted: false, children: [] },
    { id: 'dsa-3', name: 'Trees & Graphs', category: 'DSA', relatedTasks: ['t1'], relatedProgressField: 'dsa', isCompleted: false, children: ['dsa-1'] },
    { id: 'dsa-4', name: 'Dynamic Programming', category: 'DSA', relatedProgressField: 'dsa', isCompleted: false, children: ['dsa-1', 'dsa-3'] },
  ],
  'Cloud': [
    { id: 'cloud-1', name: 'AWS S3 Basics', category: 'Cloud', relatedTasks: ['th1'], relatedProgressField: 'cloud', isCompleted: false, children: [] },
    { id: 'cloud-2', name: 'AWS EC2 Concepts', category: 'Cloud', relatedTasks: ['th1'], relatedProgressField: 'cloud', isCompleted: false, children: [] },
    { id: 'cloud-3', name: 'Serverless (Lambda/API GW)', category: 'Cloud', relatedTasks: ['th1'], relatedProgressField: 'cloud', isCompleted: false, children: ['cloud-1', 'cloud-2'] },
  ],
  'DevOps': [
    { id: 'devops-1', name: 'Docker Fundamentals', category: 'DevOps', relatedTasks: ['f1'], relatedProgressField: 'devOps', isCompleted: false, children: [] },
    { id: 'devops-2', name: 'CI/CD Pipelines', category: 'DevOps', relatedTasks: ['f2'], relatedProgressField: 'devOps', isCompleted: false, children: [] },
    { id: 'devops-3', name: 'Kubernetes Orchestration', category: 'DevOps', relatedTasks: ['f1'], relatedProgressField: 'devOps', isCompleted: false, children: ['devops-1'] },
  ],
  'AI/ML': [
    { id: 'aiml-1', name: 'Python for ML', category: 'AI/ML', relatedTasks: ['w1'], relatedProgressField: 'aiMl', isCompleted: false, children: [] },
    { id: 'aiml-2', name: 'Supervised Learning', category: 'AI/ML', relatedTasks: ['w2'], relatedProgressField: 'aiMl', isCompleted: false, children: ['aiml-1'] },
    { id: 'aiml-3', name: 'Unsupervised Learning', category: 'AI/ML', relatedTasks: ['w2'], relatedProgressField: 'aiMl', isCompleted: false, children: ['aiml-1'] },
    { id: 'aiml-4', name: 'Deep Learning Basics', category: 'AI/ML', relatedTasks: ['th2'], relatedProgressField: 'aiMl', isCompleted: false, children: ['aiml-2', 'aiml-3'] },
  ],
};

// Helper function to create standard week tasks to avoid repetition in constant definition
const createStandardWeek = (weekNum: number, monthNum: number, focus: string): any => {
    return {
        weekNumber: weekNum,
        title: `${focus} Focus`,
        weeklyGoals: [`Advance in ${focus}`, "Complete 3 DSA Mediums", "Deploy one service"],
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, idx) => ({
            day,
            tasks: [
                { id: `m${monthNum}-w${weekNum}-d${idx}-t1`, domain: "Core Tech", topic: `${focus} Concepts`, taskDescription: `Deep dive into ${focus} part ${idx+1}`, durationHours: 2 },
                { id: `m${monthNum}-w${weekNum}-d${idx}-t2`, domain: "DSA", topic: "Problem Solving", taskDescription: "LeetCode Medium", durationHours: 1 },
                { id: `m${monthNum}-w${weekNum}-d${idx}-t3`, domain: "Project", topic: "Implementation", taskDescription: "Apply concepts to project", durationHours: 2 },
            ]
        }))
    };
};

// --- Full 12-Month Roadmap Data ---
export const FULL_LEARNING_ROADMAP: RoadmapMonth[] = [
  // --- Phase 1: Months 1-4 ---
  {
    monthNumber: 1,
    title: "Month 1: Foundations of Full Stack & Cloud",
    phase: "Phase 1",
    goal: "Establish strong core skills in Frontend, Backend (Java), and AWS basics.",
    weeks: [
      {
        weekNumber: 1,
        title: "Setup & Core Syntax",
        weeklyGoals: ["Master JS ES6+", "React Functional Components", "Java Syntax refresher", "AWS Account Setup"],
        days: [
          {
            day: "Monday",
            tasks: [
              { id: "m1-w1-d1-t1", domain: "React+Next.js", topic: "ES6+ Features & React Intro", taskDescription: "Arrow functions, Destructuring, Components, Props", durationHours: 1 },
              { id: "m1-w1-d1-t2", domain: "HTML/CSS/JS", topic: "Semantic HTML & Flexbox", taskDescription: "Build a responsive navbar layout", durationHours: 0.5 },
              { id: "m1-w1-d1-t3", domain: "Java+Spring", topic: "Java Syntax & OOP", taskDescription: "Interfaces, Abstract Classes, Collections", durationHours: 1 },
              { id: "m1-w1-d1-t4", domain: "DSA", topic: "Arrays & Strings", taskDescription: "Solve 2 LeetCode Easy problems", durationHours: 0.5 },
              { id: "m1-w1-d1-t5", domain: "GenAI Python", topic: "Python Basics", taskDescription: "Variables, Loops, Functions for Scripts", durationHours: 1 },
            ]
          },
          {
            day: "Tuesday",
            tasks: [
              { id: "m1-w1-d2-t1", domain: "React+Next.js", topic: "React State (useState)", taskDescription: "Build a simple counter & todo list", durationHours: 1 },
              { id: "m1-w1-d2-t2", domain: "HTML/CSS/JS", topic: "CSS Grid", taskDescription: "Grid template areas practice", durationHours: 0.5 },
              { id: "m1-w1-d2-t3", domain: "Cloud (AWS)", topic: "AWS IAM & Billing", taskDescription: "Setup User, Group, Billing Alarm", durationHours: 1 },
              { id: "m1-w1-d2-t4", domain: "DSA", topic: "Arrays & Strings", taskDescription: "Sliding Window Pattern", durationHours: 0.5 },
              { id: "m1-w1-d2-t5", domain: "GenAI Python", topic: "Python Libraries", taskDescription: "Intro to NumPy and Pandas", durationHours: 1 },
            ]
          },
          {
            day: "Wednesday",
            tasks: [
              { id: "m1-w1-d3-t1", domain: "React+Next.js", topic: "React Effects (useEffect)", taskDescription: "Fetch data from a public API", durationHours: 1 },
              { id: "m1-w1-d3-t2", domain: "HTML/CSS/JS", topic: "DOM Manipulation", taskDescription: "Event listeners without framework", durationHours: 0.5 },
              { id: "m1-w1-d3-t3", domain: "DevOps", topic: "Git & Linux", taskDescription: "Git workflow (branch/merge), Basic Linux commands", durationHours: 1 },
              { id: "m1-w1-d3-t4", domain: "DSA", topic: "Hashing", taskDescription: "Hash Map implementation & usage", durationHours: 0.5 },
              { id: "m1-w1-d3-t5", domain: "GenAI Python", topic: "Data Analysis", taskDescription: "Data cleaning with Pandas", durationHours: 1 },
            ]
          },
          {
            day: "Thursday",
            tasks: [
              { id: "m1-w1-d4-t1", domain: "React+Next.js", topic: "React Router", taskDescription: "Client-side routing setup", durationHours: 1 },
              { id: "m1-w1-d4-t2", domain: "HTML/CSS/JS", topic: "CSS Variables", taskDescription: "Theming basics", durationHours: 0.5 },
              { id: "m1-w1-d4-t3", domain: "Java+Spring", topic: "Java Streams API", taskDescription: "Filter, Map, Reduce practice", durationHours: 1 },
              { id: "m1-w1-d4-t4", domain: "DSA", topic: "Two Pointers", taskDescription: "Solve Two Sum II", durationHours: 0.5 },
              { id: "m1-w1-d4-t5", domain: "GenAI Python", topic: "Visualization", taskDescription: "Matplotlib basics", durationHours: 1 },
            ]
          },
          {
            day: "Friday",
            tasks: [
              { id: "m1-w1-d5-t1", domain: "React+Next.js", topic: "Next.js Intro", taskDescription: "Pages, Routing, Link component", durationHours: 1 },
              { id: "m1-w1-d5-t2", domain: "HTML/CSS/JS", topic: "Accessibility", taskDescription: "ARIA labels and contrast check", durationHours: 0.5 },
              { id: "m1-w1-d5-t3", domain: "Cloud (AWS)", topic: "AWS EC2 Basics", taskDescription: "Launch an EC2 instance, SSH into it", durationHours: 1 },
              { id: "m1-w1-d5-t4", domain: "DSA", topic: "Sorting", taskDescription: "Merge Sort, Quick Sort concepts", durationHours: 0.5 },
              { id: "m1-w1-d5-t5", domain: "GenAI Python", topic: "Scikit-Learn Intro", taskDescription: "Linear Regression example", durationHours: 1 },
            ]
          },
          {
            day: "Saturday",
            tasks: [
              { id: "m1-w1-d6-t1", domain: "React+Next.js", topic: "Mini Project", taskDescription: "Build a multi-page Portfolio site", durationHours: 1 },
              { id: "m1-w1-d6-t2", domain: "HTML/CSS/JS", topic: "Project Polish", taskDescription: "Refine CSS for Portfolio", durationHours: 0.5 },
              { id: "m1-w1-d6-t3", domain: "DevOps", topic: "Docker Basics", taskDescription: "Write a Dockerfile for a static node app", durationHours: 1 },
              { id: "m1-w1-d6-t4", domain: "DSA", topic: "Weekly Contest", taskDescription: "Participate or simulate a contest", durationHours: 0.5 },
              { id: "m1-w1-d6-t5", domain: "GenAI Python", topic: "ML Basic Project", taskDescription: "Predict housing prices (Toy dataset)", durationHours: 1 },
            ]
          },
          {
            day: "Sunday",
            tasks: [
              { id: "m1-w1-d7-t1", domain: "Review", topic: "Weekly Retrospective", taskDescription: "Review difficult concepts, plan next week", durationHours: 2 },
              { id: "m1-w1-d7-t2", domain: "Light Study", topic: "Reading/Docs", taskDescription: "Read React Docs / AWS Whitepapers", durationHours: 1 },
            ]
          }
        ]
      },
      createStandardWeek(2, 1, "State & Server"),
      createStandardWeek(3, 1, "API & Fetching"),
      createStandardWeek(4, 1, "Routing & Layouts")
    ],
    project: {
      title: "Personal Cloud Resume",
      description: "Host a static HTML/React resume on AWS S3, accessed via CloudFront.",
      acceptanceCriteria: [
        "Website is accessible via HTTPS",
        "React frontend code hosted on S3",
        "CloudFront distribution set up",
        "Source code in GitHub"
      ]
    }
  },
  {
    monthNumber: 2,
    title: "Month 2: Backend Deep Dive & Containerization",
    phase: "Phase 1",
    goal: "Build robust APIs with Spring Boot and containerize them using Docker.",
    weeks: [
      createStandardWeek(5, 2, "Spring Boot API"),
      createStandardWeek(6, 2, "Database & ORM"),
      createStandardWeek(7, 2, "Docker Compose"),
      createStandardWeek(8, 2, "Microservices Intro")
    ],
    project: {
        title: "REST API with DB",
        description: "Spring Boot API connecting to RDS, Containerized",
        acceptanceCriteria: ["CRUD Endpoints", "Docker Compose setup", "Postgres Integration"]
    }
  },
  {
    monthNumber: 3,
    title: "Month 3: Microservices & Cloud Native",
    phase: "Phase 1",
    goal: "Architect scalable systems using AWS Lambda, S3, and API Gateway.",
    weeks: [
      createStandardWeek(9, 3, "AWS Lambda"),
      createStandardWeek(10, 3, "API Gateway"),
      createStandardWeek(11, 3, "Messaging (SNS/SQS)"),
      createStandardWeek(12, 3, "CloudFormation/Terraform")
    ],
    project: {
        title: "Serverless Image Processor",
        description: "Upload image to S3, trigger Lambda to resize, store in another bucket.",
        acceptanceCriteria: ["S3 Triggers", "Lambda Resize Logic", "Infrastructure as Code"]
    }
  },
  {
    monthNumber: 4,
    title: "Month 4: DevOps & Advanced Frontend",
    phase: "Phase 1",
    goal: "Automate deployments with CI/CD and polish Frontend performance.",
    weeks: [
      createStandardWeek(13, 4, "CI/CD (GitHub Actions)"),
      createStandardWeek(14, 4, "Advanced React Patterns"),
      createStandardWeek(15, 4, "Testing (Jest/Cypress)"),
      createStandardWeek(16, 4, "Monitoring & Logging")
    ],
    project: {
        title: "Full Stack CI/CD Pipeline",
        description: "Auto-deploy React app to S3 and Spring Boot to EB/EC2 on git push.",
        acceptanceCriteria: ["Automated Tests", "Build & Deploy Steps", "Zero-downtime attempt"]
    }
  },

  // --- Phase 2: Months 5-8 ---
  {
    monthNumber: 5,
    title: "Month 5: Advanced DSA & Python ML",
    phase: "Phase 2",
    goal: "Shift focus to AI foundations: Advanced Algorithms and Python Data Science Stack.",
    weeks: [
      createStandardWeek(17, 5, "Graph Algorithms"),
      createStandardWeek(18, 5, "Dynamic Programming"),
      createStandardWeek(19, 5, "NumPy & Pandas Deep Dive"),
      createStandardWeek(20, 5, "Data Visualization (Seaborn)")
    ],
    project: {
        title: "EDA Dashboard",
        description: "Exploratory Data Analysis dashboard using Streamlit and Pandas.",
        acceptanceCriteria: ["Interactive Charts", "Data Upload", "Statistical Summary"]
    }
  },
  {
    monthNumber: 6,
    title: "Month 6: MLOps & Cloud AI",
    phase: "Phase 2",
    goal: "Understand the Machine Learning Lifecycle and Cloud AI Services.",
    weeks: [
      createStandardWeek(21, 6, "AWS SageMaker Basics"),
      createStandardWeek(22, 6, "Model Packaging"),
      createStandardWeek(23, 6, "Model Serving (Flask/FastAPI)"),
      createStandardWeek(24, 6, "Feature Stores")
    ],
    project: {
        title: "Model API Service",
        description: "Train a simple model, wrap it in FastAPI, dockerize and deploy.",
        acceptanceCriteria: ["REST API for Prediction", "Dockerized Model", "Basic Monitoring"]
    }
  },
  {
    monthNumber: 7,
    title: "Month 7: Deep Learning Foundations",
    phase: "Phase 2",
    goal: "Master Neural Networks using PyTorch or TensorFlow.",
    weeks: [
      createStandardWeek(25, 7, "Neural Network Basics"),
      createStandardWeek(26, 7, "CNNs (Computer Vision)"),
      createStandardWeek(27, 7, "RNNs & LSTMs (Seq2Seq)"),
      createStandardWeek(28, 7, "Transfer Learning")
    ],
    project: {
        title: "Image Classifier",
        description: "Build and train a CNN to classify images (e.g., CIFAR-10).",
        acceptanceCriteria: ["Training Script", "Accuracy > 80%", "Inference Notebook"]
    }
  },
  {
    monthNumber: 8,
    title: "Month 8: LLM Foundations",
    phase: "Phase 2",
    goal: "Introduction to Transformers, NLP, and HuggingFace ecosystem.",
    weeks: [
      createStandardWeek(29, 8, "Attention Mechanism"),
      createStandardWeek(30, 8, "Transformer Architecture"),
      createStandardWeek(31, 8, "HuggingFace Transformers Lib"),
      createStandardWeek(32, 8, "Tokenization & Embeddings")
    ],
    project: {
        title: "Sentiment Analysis with BERT",
        description: "Fine-tune BERT for a specific sentiment analysis task.",
        acceptanceCriteria: ["HuggingFace Hub Upload", "Fine-tuning Script", "Evaluation Metrics"]
    }
  },

  // --- Phase 3: Months 9-12 ---
  {
    monthNumber: 9,
    title: "Month 9: Advanced GenAI & RAG",
    phase: "Phase 3",
    goal: "Build context-aware AI applications using RAG.",
    weeks: [
      createStandardWeek(33, 9, "Vector Databases (Pinecone/Weaviate)"),
      createStandardWeek(34, 9, "RAG Architectures"),
      createStandardWeek(35, 9, "LangChain Framework"),
      createStandardWeek(36, 9, "Advanced RAG (Hybrid Search)")
    ],
    project: {
        title: "DocuChat RAG App",
        description: "Chat with your PDF documents using RAG.",
        acceptanceCriteria: ["PDF Ingestion", "Vector Search", "Accurate Answers"]
    }
  },
  {
    monthNumber: 10,
    title: "Month 10: AI Agents & Orchestration",
    phase: "Phase 3",
    goal: "Create autonomous agents that can use tools and reason.",
    weeks: [
      createStandardWeek(37, 10, "ReAct Pattern"),
      createStandardWeek(38, 10, "LangChain Agents"),
      createStandardWeek(39, 10, "Tool Use & Function Calling"),
      createStandardWeek(40, 10, "Multi-Agent Systems")
    ],
    project: {
        title: "Personal Assistant Agent",
        description: "Agent that can search web, calculate math, and summarize emails.",
        acceptanceCriteria: ["Tool integration", "Reasoning Traces", "Web Interface"]
    }
  },
  {
    monthNumber: 11,
    title: "Month 11: Fine-Tuning & Deployment",
    phase: "Phase 3",
    goal: "Optimize and deploy Large Language Models efficiently.",
    weeks: [
      createStandardWeek(41, 11, "PEFT & LoRA"),
      createStandardWeek(42, 11, "Quantization (QLoRA)"),
      createStandardWeek(43, 11, "vLLM & TGI"),
      createStandardWeek(44, 11, "Eval Frameworks (RAGAS)")
    ],
    project: {
        title: "Domain Specific Fine-Tune",
        description: "Fine-tune Llama 2/3 on specific medical or legal dataset.",
        acceptanceCriteria: ["Efficient Fine-tune", "GGUF Export", "Deployment on CPU/GPU"]
    }
  },
  {
    monthNumber: 12,
    title: "Month 12: Final Capstone",
    phase: "Phase 3",
    goal: "Build a production-ready Full Stack AI Application.",
    weeks: [
      createStandardWeek(45, 12, "Architecture & Planning"),
      createStandardWeek(46, 12, "Core Development"),
      createStandardWeek(47, 12, "Integration & UI Polish"),
      createStandardWeek(48, 12, "Final Launch & Demo")
    ],
    project: {
        title: "SaaS AI Platform",
        description: "End-to-end AI solution solving a real world problem.",
        acceptanceCriteria: ["Auth & Payments", "Scalable Backend", "AI Core Feature", "Polished UI"]
    }
  }
];
