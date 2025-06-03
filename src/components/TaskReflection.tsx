import { useState } from 'react';
import styled from '@emotion/styled';
import type { Task } from '../types';

const Container = styled.div<{ theme: 'light' | 'dark' }>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${props => props.theme === 'light' ? 'white' : '#333'};
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  max-width: 500px;
  width: 90%;
  z-index: 1000;
  color: ${props => props.theme === 'light' ? '#333' : 'white'};
`;

const Title = styled.h2<{ theme: 'light' | 'dark' }>`
  margin-bottom: 20px;
  color: ${props => props.theme === 'light' ? '#333' : 'white'};
`;

const TextArea = styled.textarea<{ theme: 'light' | 'dark' }>`
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border: 1px solid ${props => props.theme === 'light' ? '#ddd' : '#666'};
  border-radius: 5px;
  margin-bottom: 20px;
  font-size: 16px;
  resize: vertical;
  background: ${props => props.theme === 'light' ? 'white' : '#444'};
  color: ${props => props.theme === 'light' ? '#333' : 'white'};
  &:focus {
    outline: none;
    border-color: #4CAF50;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary'; theme: 'light' | 'dark' }>`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  ${({ variant, theme }) => variant === 'primary' ? `
    background-color: #4CAF50;
    color: white;
    &:hover {
      background-color: #45a049;
    }
  ` : `
    background-color: ${theme === 'light' ? '#f5f5f5' : '#555'};
    color: ${theme === 'light' ? '#333' : 'white'};
    &:hover {
      background-color: ${theme === 'light' ? '#e0e0e0' : '#666'};
    }
  `}
`;

interface TaskReflectionProps {
  task: Task;
  companionThoughts: string;
  onSubmit: (reflection: string) => void;
  onClose: () => void;
  theme: 'light' | 'dark';
}

export const TaskReflection = ({
  task,
  companionThoughts,
  onSubmit,
  onClose,
  theme
}: TaskReflectionProps) => {
  const [reflection, setReflection] = useState('');

  const handleSubmit = () => {
    onSubmit(reflection.trim());
    onClose();
  };

  return (
    <Container theme={theme}>
      <Title theme={theme}>任务完成反思</Title>
      <div style={{ marginBottom: 20 }}>
        <strong>任务内容：</strong> {task.content}
      </div>
      <div style={{ marginBottom: 20 }}>
        <strong>小伙伴的想法：</strong>
        <p style={{ color: theme === 'light' ? '#666' : '#ccc' }}>{companionThoughts}</p>
      </div>
      <TextArea
        value={reflection}
        onChange={(e) => setReflection(e.target.value)}
        placeholder="分享一下你对这次任务的完成情况和感受..."
        theme={theme}
      />
      <ButtonGroup>
        <Button onClick={onClose} theme={theme}>跳过</Button>
        <Button variant="primary" onClick={handleSubmit} theme={theme}>
          提交反思
        </Button>
      </ButtonGroup>
    </Container>
  );
}; 