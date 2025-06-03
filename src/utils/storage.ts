import type { Task, StudySession, DailyProgress, AudioSettings } from '../types';

const STORAGE_KEYS = {
  SESSIONS: 'study_sessions',
  DAILY_PROGRESS: 'daily_progress',
  TAGS: 'available_tags',
  AUDIO_SETTINGS: 'audio_settings'
} as const;

export const storage = {
  getSessions(): StudySession[] {
    const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    return data ? JSON.parse(data) : [];
  },

  saveSessions(sessions: StudySession[]): void {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  },

  getDailyProgress(): DailyProgress[] {
    const data = localStorage.getItem(STORAGE_KEYS.DAILY_PROGRESS);
    return data ? JSON.parse(data) : [];
  },

  saveDailyProgress(progress: DailyProgress[]): void {
    localStorage.setItem(STORAGE_KEYS.DAILY_PROGRESS, JSON.stringify(progress));
  },

  getTags(): string[] {
    const data = localStorage.getItem(STORAGE_KEYS.TAGS);
    return data ? JSON.parse(data) : [];
  },

  saveTags(tags: string[]): void {
    localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(tags));
  },

  getAudioSettings(): AudioSettings {
    const data = localStorage.getItem(STORAGE_KEYS.AUDIO_SETTINGS);
    return data ? JSON.parse(data) : { enabled: true, volume: 0.5 };
  },

  saveAudioSettings(settings: AudioSettings): void {
    localStorage.setItem(STORAGE_KEYS.AUDIO_SETTINGS, JSON.stringify(settings));
  },

  // 计算总时间
  calculateTotalTime(): number {
    const sessions = this.getSessions();
    return sessions.reduce((total, session) => total + session.duration, 0);
  }
}; 