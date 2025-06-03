import styled from '@emotion/styled';
import { useState, useEffect, useRef } from 'react';
import { Timer } from './Timer';
import { Cat } from './Cat';
import type { Task, CompanionState, Character } from '../types';

const FocusModeContainer = styled.div<{ theme: 'light' | 'dark' }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => props.theme === 'light' ? '#f5f5f5' : '#1a1a1a'};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 1000;
`;

const TasksContainer = styled.div<{ theme: 'light' | 'dark' }>`
  position: absolute;
  top: 20px;
  left: 20px;
  padding: 10px;
  border-radius: 5px;
  background: ${props => props.theme === 'light' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.3)'};
  font-size: 14px;
  color: ${props => props.theme === 'light' ? '#666' : '#ccc'};
`;

const ExitButton = styled.button<{ theme: 'light' | 'dark' }>`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  background: ${props => props.theme === 'light' ? '#e9ecef' : '#333'};
  color: ${props => props.theme === 'light' ? '#333' : '#fff'};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`;

const encouragements = [
  '保持专注，你做得很棒！',
  '让我们一起完成目标！',
  '休息一下眼睛也很重要哦',
  '保持这个节奏，我们能行！',
  '你的进度很不错呢'
];

interface FocusModeProps {
  userTask: Task;
  companionTask: Task;
  character: Character;
  theme: 'light' | 'dark';
  onComplete: () => void;
  onExit: (elapsedMinutes: number) => void;
}

export const FocusMode: React.FC<FocusModeProps> = ({
  userTask,
  companionTask,
  character,
  theme,
  onComplete,
  onExit
}) => {
  const [companionState, setCompanionState] = useState<CompanionState>({
    status: 'working',
    message: `我在${companionTask.content}，让我们一起加油！`,
    task: companionTask
  });

  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef(Date.now());

  // 随机更新角色状态
  useEffect(() => {
    const updateInterval = Math.floor(Math.random() * 20000) + 10000; // 10-30秒
    const timer = setInterval(() => {
      const messages = [
        ...character.progressReports.working,
        ...encouragements
      ];
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      setCompanionState(prev => ({
        ...prev,
        message: randomMessage
      }));
    }, updateInterval);

    return () => clearInterval(timer);
  }, [character]);

  // 更新进度
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => Math.min(prev + 1, 100));
    }, (userTask.duration * 60 * 1000) / 100);

    return () => clearInterval(timer);
  }, [userTask.duration]);

  const handleExit = () => {
    const elapsedMs = Date.now() - startTimeRef.current;
    const elapsedMinutes = Math.floor(elapsedMs / (1000 * 60));
    onExit(elapsedMinutes);
  };

  return (
    <FocusModeContainer theme={theme}>
      <TasksContainer theme={theme}>
        你：{userTask.content}
        <br />
        {character.name}：{companionTask.content}
      </TasksContainer>
      
      <ExitButton onClick={handleExit} theme={theme}>
        退出专注
      </ExitButton>

      <Cat
        state={companionState}
        character={character}
        progress={progress}
        theme={theme}
      />
      
      <Timer
        duration={userTask.duration}
        onComplete={onComplete}
        theme={theme}
      />
    </FocusModeContainer>
  );
}; 