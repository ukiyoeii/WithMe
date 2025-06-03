export interface Task {
  id: string;
  content: string;
  duration: number; // 以分钟为单位
  createdAt: string;
  completedAt?: string;
  status: 'pending' | 'in-progress' | 'completed';
  reflection?: string;
  tags: string[];
  category: string;
}

export interface CompanionState {
  task?: Task;
  status: 'idle' | 'preparing' | 'working' | 'reflecting';
  message?: string;
  thoughtProcess?: string;
}

export interface StudySession {
  id: string;
  startTime: string;
  endTime: string;
  duration: number;
  userTask: Task;
  companionTask: Task;
  userReflection?: string;
  companionReflection?: string;
}

export interface DailyProgress {
  date: string;
  sessionsCount: number;
  totalDuration: number;
}

export interface AudioSettings {
  enabled: boolean;
  volume: number;
  currentTrack?: string;
}

export interface TaskCategory {
  name: string;
  color: string;
  icon: string;
} 