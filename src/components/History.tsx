import styled from '@emotion/styled';
import type { StudySession, DailyProgress } from '../types';
import dayjs from 'dayjs';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Title = styled.h2<{ theme: 'light' | 'dark' }>`
  margin: 0 0 20px;
  color: ${props => props.theme === 'light' ? '#333' : 'white'};
`;

const SessionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const SessionCard = styled.div<{ theme: 'light' | 'dark' }>`
  background: ${props => props.theme === 'light' ? 'white' : '#444'};
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
`;

const TaskItem = styled.div<{ isUser: boolean; theme: 'light' | 'dark' }>`
  padding: 10px;
  margin: 5px 0;
  border-radius: 8px;
  background-color: ${props => {
    if (props.isUser) {
      return props.theme === 'light' ? '#e3f2fd' : '#1a3f5c';
    }
    return props.theme === 'light' ? '#fff3e0' : '#4a3319';
  }};
  color: ${props => props.theme === 'light' ? '#333' : 'white'};
`;

const TaskHeader = styled.div<{ theme: 'light' | 'dark' }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
  font-size: 14px;
  color: ${props => props.theme === 'light' ? '#666' : '#ccc'};
`;

const TaskContent = styled.div`
  margin: 10px 0;
`;

const TaskReflection = styled.div<{ theme: 'light' | 'dark' }>`
  font-style: italic;
  color: ${props => props.theme === 'light' ? '#666' : '#ccc'};
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed ${props => props.theme === 'light' ? '#eee' : '#555'};
`;

const HeatMap = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-top: 20px;
`;

const DayCell = styled.div<{ intensity: number }>`
  width: 100%;
  padding-bottom: 100%;
  background-color: ${props => {
    const base = 0.1;
    const alpha = base + (props.intensity * 0.2);
    return `rgba(76, 175, 80, ${alpha})`;
  }};
  border-radius: 2px;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

interface HistoryProps {
  sessions: StudySession[];
  dailyProgress: DailyProgress[];
  theme: 'light' | 'dark';
}

export const History = ({ sessions, dailyProgress, theme }: HistoryProps) => {
  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}分钟`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}小时${remainingMinutes > 0 ? ` ${remainingMinutes}分钟` : ''}`;
  };

  const getIntensity = (duration: number) => {
    if (duration === 0) return 0;
    if (duration <= 60) return 1;
    if (duration <= 120) return 2;
    if (duration <= 180) return 3;
    if (duration <= 240) return 4;
    return 5;
  };

  return (
    <Container>
      <Title theme={theme}>历史记录</Title>
      <HeatMap>
        {dailyProgress.map((day, index) => (
          <DayCell
            key={day.date}
            intensity={getIntensity(day.totalDuration)}
            title={`${day.date}: ${formatDuration(day.totalDuration)}`}
          />
        ))}
      </HeatMap>
      <SessionList>
        {sessions.map(session => (
          <SessionCard key={session.id} theme={theme}>
            <TaskHeader theme={theme}>
              {dayjs(session.startTime).format('YYYY-MM-DD HH:mm')}
              <span>{formatDuration(session.duration)}</span>
            </TaskHeader>
            <TaskItem isUser={true} theme={theme}>
              <strong>我的任务：</strong>
              <TaskContent>{session.userTask.content}</TaskContent>
              {session.userReflection && (
                <TaskReflection theme={theme}>
                  反思：{session.userReflection}
                </TaskReflection>
              )}
            </TaskItem>
            <TaskItem isUser={false} theme={theme}>
              <strong>伙伴任务：</strong>
              <TaskContent>{session.companionTask.content}</TaskContent>
              {session.companionReflection && (
                <TaskReflection theme={theme}>
                  反思：{session.companionReflection}
                </TaskReflection>
              )}
            </TaskItem>
          </SessionCard>
        ))}
      </SessionList>
    </Container>
  );
}; 