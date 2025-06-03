export interface Task {
  id: string;
  content: string;
  duration: number;
  category: string;
  tags: string[];
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: string;
  completedAt?: string;
  reflection?: string;
}

export interface CompanionState {
  status: 'idle' | 'preparing' | 'working' | 'reflecting';
  message: string;
  thoughtProcess?: string;
  task?: Task;
}

export interface Character {
  id: string;
  name: string;
  emoji: string;
  description: string;
  personality: {
    traits: string[];
    interests: string[];
    emotions: string[];
  };
  taskTemplates: {
    [key: string]: {
      content: string;
      type: '创意' | '工作' | '学习' | '家务' | '娱乐';
      progressTypes: string[];
    }[];
  };
  tasks: string[];
  progressReports: {
    thinking: string[];
    working: string[];
    reflecting: string[];
  };
  reflectionTemplates: {
    completed: string[];
    partial: string[];
  };
}

export interface StudySession {
  id: string;
  startTime: string;
  endTime: string;
  duration: number;
  userTask: Task;
  companionTask: Task;
  userReflection: string;
  companionReflection: string;
}

export interface DailyProgress {
  date: string;
  sessionsCount: number;
  totalDuration: number;
}

export interface AudioSettings {
  enabled: boolean;
  volume: number;
} 