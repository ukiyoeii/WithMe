import styled from '@emotion/styled';
import { useState } from 'react';
import type { DailyProgress } from '../types';
import { formatDuration } from '../utils/timeUtils';
import dayjs from 'dayjs';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div<{ theme: 'light' | 'dark' }>`
  background: ${props => props.theme === 'light' ? '#fff' : '#333'};
  padding: 20px;
  border-radius: 10px;
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  color: ${props => props.theme === 'light' ? '#333' : '#fff'};
`;

const CloseButton = styled.button<{ theme: 'light' | 'dark' }>`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: ${props => props.theme === 'light' ? '#666' : '#ccc'};
  
  &:hover {
    color: ${props => props.theme === 'light' ? '#333' : '#fff'};
  }
`;

const ViewToggle = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  gap: 10px;
`;

const ToggleButton = styled.button<{ active: boolean; theme: 'light' | 'dark' }>`
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background: ${props => props.active 
    ? props.theme === 'light' ? '#4CAF50' : '#45a049'
    : props.theme === 'light' ? '#e9ecef' : '#404040'
  };
  color: ${props => props.active ? '#fff' : props.theme === 'light' ? '#333' : '#e0e0e0'};
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const HeatmapGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-top: 20px;
`;

const DayCell = styled.div<{ intensity: number; theme: 'light' | 'dark' }>`
  aspect-ratio: 1;
  border-radius: 2px;
  background: ${props => {
    const base = props.theme === 'light' ? 144 : 71;
    const intensity = Math.min(props.intensity * 0.2, 1);
    return props.theme === 'light'
      ? `hsl(120, 40%, ${100 - (base * intensity)}%)`
      : `hsl(120, 40%, ${base * intensity}%)`;
  }};
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

const DaySummary = styled.div<{ theme: 'light' | 'dark' }>`
  margin-top: 20px;
  padding: 10px;
  border-radius: 5px;
  background: ${props => props.theme === 'light' ? '#f8f9fa' : '#2a2a2a'};
`;

interface HeatmapModalProps {
  dailyProgress: DailyProgress[];
  onClose: () => void;
  theme: 'light' | 'dark';
}

type ViewType = 'today' | 'month';

export const HeatmapModal: React.FC<HeatmapModalProps> = ({
  dailyProgress,
  onClose,
  theme
}) => {
  const [viewType, setViewType] = useState<ViewType>('today');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const today = dayjs().format('YYYY-MM-DD');
  const currentMonth = dayjs().format('YYYY-MM');

  const getFilteredProgress = () => {
    if (viewType === 'today') {
      return dailyProgress.filter(p => p.date === today);
    }
    return dailyProgress.filter(p => p.date.startsWith(currentMonth));
  };

  const filteredProgress = getFilteredProgress();
  const maxDuration = Math.max(...filteredProgress.map(p => p.totalDuration), 1);

  const renderHeatmap = () => {
    if (viewType === 'today') {
      const todayProgress = filteredProgress[0] || { 
        date: today,
        sessionsCount: 0,
        totalDuration: 0
      };
      return (
        <DaySummary theme={theme}>
          今日专注：{formatDuration(todayProgress.totalDuration)}
          <br />
          完成任务数：{todayProgress.sessionsCount}
        </DaySummary>
      );
    }

    const days = Array.from({ length: 31 }, (_, i) => {
      const date = dayjs(currentMonth + '-01').add(i, 'day');
      if (date.format('YYYY-MM') !== currentMonth) return null;
      const progress = filteredProgress.find(p => p.date === date.format('YYYY-MM-DD'));
      return {
        date: date.format('YYYY-MM-DD'),
        intensity: progress ? progress.totalDuration / maxDuration : 0
      };
    }).filter(Boolean);

    return (
      <HeatmapGrid>
        {days.map(day => (
          <DayCell
            key={day!.date}
            intensity={day!.intensity}
            theme={theme}
            onClick={() => setSelectedDate(day!.date)}
          />
        ))}
      </HeatmapGrid>
    );
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent theme={theme} onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose} theme={theme}>×</CloseButton>
        
        <ViewToggle>
          <ToggleButton
            active={viewType === 'today'}
            onClick={() => setViewType('today')}
            theme={theme}
          >
            今日
          </ToggleButton>
          <ToggleButton
            active={viewType === 'month'}
            onClick={() => setViewType('month')}
            theme={theme}
          >
            本月
          </ToggleButton>
        </ViewToggle>

        {renderHeatmap()}

        {selectedDate && viewType === 'month' && (
          <DaySummary theme={theme}>
            {selectedDate} 专注记录：
            <br />
            {filteredProgress.find(p => p.date === selectedDate)
              ? `完成 ${filteredProgress.find(p => p.date === selectedDate)!.sessionsCount} 个任务，
                 总时长 ${formatDuration(filteredProgress.find(p => p.date === selectedDate)!.totalDuration)}`
              : '暂无记录'
            }
          </DaySummary>
        )}
      </ModalContent>
    </ModalOverlay>
  );
}; 