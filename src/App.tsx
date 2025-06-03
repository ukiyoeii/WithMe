import { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import { Cat } from './components/Cat'
import { Timer } from './components/Timer'
import { TaskInput } from './components/TaskInput'
import { History } from './components/History'
import { TaskReflection } from './components/TaskReflection'
import { AudioPlayer } from './components/AudioPlayer'
import { IconButton } from './components/IconButton'
import { HeatmapModal } from './components/HeatmapModal'
import { FocusMode } from './components/FocusMode'
import type { Task, CompanionState, StudySession, DailyProgress, AudioSettings } from './types'
import { storage } from './utils/storage'
import { characters } from './data/characters'
import dayjs from 'dayjs'
import { generateId } from './utils/idUtils'
import { getRandomMessage } from './utils/messageUtils'
import { formatDuration } from './utils/timeUtils'

const AppContainer = styled.div<{ theme: 'light' | 'dark' }>`
  min-height: 100vh;
  background: ${props => props.theme === 'light' ? '#f5f5f5' : '#1a1a1a'};
  padding: 20px;
  color: ${props => props.theme === 'light' ? '#333' : '#fff'};
`

const MainSection = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const Section = styled.div<{ theme: 'light' | 'dark' }>`
  background: ${props => props.theme === 'light' ? 'white' : '#333'};
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`

const TotalTime = styled.div<{ theme: 'light' | 'dark' }>`
  text-align: center;
  margin-bottom: 20px;
  font-size: 18px;
  color: ${props => props.theme === 'light' ? '#666' : '#ccc'};
`

const CharacterSelect = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
`

const CharacterButton = styled.button<{ isSelected: boolean; theme: 'light' | 'dark' }>`
  padding: 10px 20px;
  border: 2px solid ${props => props.isSelected ? '#4CAF50' : props.theme === 'light' ? '#ddd' : '#666'};
  border-radius: 20px;
  background: ${props => props.isSelected ? '#4CAF50' : 'transparent'};
  color: ${props => props.isSelected ? 'white' : props.theme === 'light' ? '#333' : '#fff'};
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: ${props => props.isSelected ? '#45a049' : props.theme === 'light' ? '#f5f5f5' : '#444'};
  }
`

const Controls = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
`

export const App = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(characters.programmingCat);
  const [companionState, setCompanionState] = useState<CompanionState>({
    status: 'idle',
    message: selectedCharacter.progressReports.thinking[0]
  });
  
  const [userTask, setUserTask] = useState<Task | null>(null)
  const [companionTask, setCompanionTask] = useState<Task | null>(null)
  const [sessions, setSessions] = useState<StudySession[]>([])
  const [dailyProgress, setDailyProgress] = useState<DailyProgress[]>([])
  const [isWorking, setIsWorking] = useState(false)
  const [showReflection, setShowReflection] = useState(false)
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [audioSettings, setAudioSettings] = useState<AudioSettings>({
    enabled: true,
    volume: 0.5
  })
  const [totalTime, setTotalTime] = useState(0)
  const [taskProgress, setTaskProgress] = useState(0)
  const [showFocusMode, setShowFocusMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // 加载保存的数据
  useEffect(() => {
    setSessions(storage.getSessions())
    setDailyProgress(storage.getDailyProgress())
    setAvailableTags(storage.getTags())
    setAudioSettings(storage.getAudioSettings())
    setTotalTime(storage.calculateTotalTime())
  }, [])

  const handleUserTaskSubmit = (taskData: Omit<Task, 'id' | 'status' | 'createdAt'>) => {
    const task: Task = {
      ...taskData,
      id: generateId(),
      status: 'pending',
      createdAt: new Date().toISOString()
    }
    setUserTask(task)
    setCompanionState({
      status: 'preparing',
      message: selectedCharacter.progressReports.thinking[0],
      thoughtProcess: '思考中...'
    })

    // 让角色选择自己的任务
    setTimeout(() => {
      const randomTask = selectedCharacter.tasks[Math.floor(Math.random() * selectedCharacter.tasks.length)];
      const companionTask: Task = {
        id: generateId(),
        content: randomTask,
        duration: taskData.duration,
        createdAt: new Date().toISOString(),
        status: 'pending',
        category: 'companion',
        tags: []
      }
      setCompanionTask(companionTask)
      setCompanionState({
        status: 'working',
        message: `我要${randomTask}，让我们一起加油吧！`,
        task: companionTask
      })
      setShowFocusMode(true);
    }, 2000)
  }

  const handleTimerComplete = () => {
    if (!userTask || !companionTask) return;

    const endTime = new Date().toISOString();
    setCompanionState({
      status: 'reflecting',
      message: selectedCharacter.reflectionTemplates.completed[0]
    });

    // 先不要清空任务状态，等反思完成后再清空
    setShowReflection(true);
    setIsWorking(false);
    setTaskProgress(100);
  };

  const handleExitFocus = (elapsedMinutes: number) => {
    setShowFocusMode(false);
    
    // 如果专注时间超过1分钟，显示反思对话框
    if (elapsedMinutes >= 1) {
      const endTime = new Date().toISOString();
      if (userTask && companionTask) {
        const session: StudySession = {
          id: generateId(),
          startTime: userTask.createdAt,
          endTime,
          duration: elapsedMinutes,
          userTask: {
            ...userTask,
            status: 'completed',
            completedAt: endTime
          },
          companionTask: {
            ...companionTask,
            status: 'completed',
            completedAt: endTime
          },
          userReflection: '',
          companionReflection: getRandomMessage(selectedCharacter.reflectionTemplates.partial)
        };

        const newSessions = [session, ...sessions];
        setSessions(newSessions);
        storage.saveSessions(newSessions);

        updateDailyProgress(session);
        
        // 更新总时间
        const newTotalTime = storage.calculateTotalTime();
        setTotalTime(newTotalTime);
        
        setShowReflection(true);
        setIsWorking(false);
        setTaskProgress(100);
      }
    } else {
      // 如果时间太短，直接重置状态
      setUserTask(null);
      setCompanionTask(null);
      setTaskProgress(0);
      setCompanionState({
        status: 'idle',
        message: getRandomMessage(selectedCharacter.progressReports.thinking)
      });
    }
  };

  const handleReflectionSubmit = (reflection: string) => {
    if (!userTask || !companionTask) return;

    const endTime = new Date().toISOString();
    const completionLevel = reflection ? 'completed' : 'partial';
    
    const session: StudySession = {
      id: generateId(),
      startTime: userTask.createdAt,
      endTime,
      duration: userTask.duration,
      userTask: {
        ...userTask,
        status: 'completed',
        completedAt: endTime,
        reflection
      },
      companionTask: {
        ...companionTask,
        status: 'completed',
        completedAt: endTime
      },
      userReflection: reflection,
      companionReflection: getRandomMessage(selectedCharacter.reflectionTemplates[completionLevel])
    };

    const newSessions = [session, ...sessions];
    setSessions(newSessions);
    storage.saveSessions(newSessions);

    updateDailyProgress(session);
    
    // 更新总时间
    const newTotalTime = storage.calculateTotalTime();
    setTotalTime(newTotalTime);

    // 关闭反思对话框
    setShowReflection(false);

    // 延迟重置状态，给用户时间看到完成信息
    setTimeout(() => {
      setUserTask(null);
      setCompanionTask(null);
      setTaskProgress(0);
      setCompanionState({
        status: 'idle',
        message: getRandomMessage(selectedCharacter.progressReports.thinking)
      });
    }, 2000);
  };

  const updateDailyProgress = (session: StudySession) => {
    const date = dayjs(session.startTime).format('YYYY-MM-DD')
    const newProgress = dailyProgress.slice()
    const existing = newProgress.find(p => p.date === date)

    if (existing) {
      existing.sessionsCount += 1
      existing.totalDuration += session.duration
    } else {
      newProgress.push({
        date,
        sessionsCount: 1,
        totalDuration: session.duration
      })
    }

    setDailyProgress(newProgress)
    storage.saveDailyProgress(newProgress)
  }

  const handleAddTag = (tag: string) => {
    const newTags = [...availableTags, tag]
    setAvailableTags(newTags)
    storage.saveTags(newTags)
  }

  const handleAudioSettingsChange = (settings: AudioSettings) => {
    setAudioSettings(settings)
    storage.saveAudioSettings(settings)
  }

  const formatTotalTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    if (days > 0) {
      return `总共陪伴了 ${days} 天 ${hours % 24} 小时`
    }
    return `总共陪伴了 ${hours} 小时 ${minutes % 60} 分钟`
  }

  return (
    <AppContainer theme={theme}>
      <Controls>
        <IconButton
          icon="📊"
          onClick={() => setShowHeatmap(true)}
          theme={theme}
          title="查看专注记录"
        />
        <IconButton
          icon={theme === 'light' ? '🌙' : '☀️'}
          onClick={toggleTheme}
          theme={theme}
          title={theme === 'light' ? '切换到夜间模式' : '切换到日间模式'}
        />
      </Controls>
      
      {showFocusMode && userTask && companionTask ? (
        <FocusMode
          userTask={userTask}
          companionTask={companionTask}
          character={selectedCharacter}
          theme={theme}
          onComplete={handleTimerComplete}
          onExit={handleExitFocus}
        />
      ) : (
        <MainSection>
          <Section theme={theme}>
            <CharacterSelect>
              {Object.values(characters).map(char => (
                <CharacterButton
                  key={char.id}
                  isSelected={selectedCharacter.id === char.id}
                  onClick={() => setSelectedCharacter(char)}
                  theme={theme}
                >
                  {char.emoji} {char.name}
                </CharacterButton>
              ))}
            </CharacterSelect>
            <TotalTime theme={theme}>{formatTotalTime(totalTime)}</TotalTime>
            <Cat
              state={companionState}
              character={selectedCharacter}
              progress={taskProgress}
              theme={theme}
            />
            <TaskInput
              onSubmit={handleUserTaskSubmit}
              disabled={!!userTask || isWorking}
              availableTags={availableTags}
              onAddTag={handleAddTag}
              theme={theme}
              durations={[1, 25, 30, 45, 60]}
            />
          </Section>
          <Section theme={theme}>
            <History
              sessions={sessions}
              dailyProgress={dailyProgress}
              theme={theme}
            />
          </Section>
        </MainSection>
      )}

      <AudioPlayer
        settings={audioSettings}
        onSettingsChange={handleAudioSettingsChange}
        theme={theme}
      />
      {showReflection && userTask && (
        <TaskReflection
          task={userTask}
          companionThoughts={selectedCharacter.reflectionTemplates.completed[0]}
          onSubmit={handleReflectionSubmit}
          onClose={() => {
            setShowReflection(false);
            handleReflectionSubmit('');
          }}
          theme={theme}
        />
      )}
      {showHeatmap && (
        <HeatmapModal
          dailyProgress={dailyProgress}
          onClose={() => setShowHeatmap(false)}
          theme={theme}
        />
      )}
    </AppContainer>
  )
}
