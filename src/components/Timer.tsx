import styled from '@emotion/styled';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';

const TimerContainer = styled.div<{ theme: 'light' | 'dark' }>`
  text-align: center;
  margin: 20px 0;
  padding: 20px;
  border-radius: 10px;
  background: ${props => props.theme === 'light' ? '#f8f9fa' : '#2a2a2a'};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const TimeDisplay = styled.div<{ theme: 'light' | 'dark' }>`
  font-size: 48px;
  font-weight: bold;
  margin: 20px 0;
  font-family: monospace;
  color: ${props => props.theme === 'light' ? '#333' : '#fff'};
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary'; theme: 'light' | 'dark' }>`
  padding: 10px 20px;
  margin: 0 10px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => {
    if (props.variant === 'primary') {
      return props.theme === 'light' ? '#4CAF50' : '#45a049';
    }
    return props.theme === 'light' ? '#e9ecef' : '#404040';
  }};
  color: ${props => {
    if (props.variant === 'primary') {
      return '#fff';
    }
    return props.theme === 'light' ? '#333' : '#e0e0e0';
  }};

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

interface TimerProps {
  duration: number;
  onComplete: () => void;
  onResume?: () => void;
  theme?: 'light' | 'dark';
}

export const Timer: React.FC<TimerProps> = ({ 
  duration, 
  onComplete, 
  onResume,
  theme = 'light'
}) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isRunning, setIsRunning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePauseResume = () => {
    if (isPaused) {
      setIsRunning(true);
      setIsPaused(false);
      onResume?.();
    } else {
      setIsRunning(false);
      setIsPaused(true);
    }
  };

  useEffect(() => {
    let timer: number;
    if (isRunning && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, onComplete]);

  return (
    <TimerContainer theme={theme}>
      <TimeDisplay theme={theme}>{formatTime(timeLeft)}</TimeDisplay>
      <Button
        onClick={handlePauseResume}
        variant={isPaused ? 'primary' : 'secondary'}
        disabled={timeLeft === 0}
        theme={theme}
      >
        {isPaused ? '继续' : '暂停'}
      </Button>
    </TimerContainer>
  );
}; 