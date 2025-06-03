import styled from '@emotion/styled';
import type { CompanionState } from '../types';
import type { Character } from '../data/characters';

const CatContainer = styled.div`
  position: relative;
  width: 300px;
  height: 300px;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CharacterEmoji = styled.div<{ status: CompanionState['status'] }>`
  font-size: 120px;
  line-height: 1;
  transition: transform 0.3s ease;
  margin-bottom: 60px;
  cursor: pointer;
  transform: ${props => {
    switch (props.status) {
      case 'preparing':
        return 'scale(1.1)';
      case 'working':
        return 'translateY(-5px)';
      case 'reflecting':
        return 'rotate(5deg)';
      default:
        return 'none';
    }
  }};

  &:hover {
    animation: bounce 0.5s ease infinite;
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
`;

const MessageBubble = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border-radius: 20px;
  padding: 15px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  max-width: 250px;
  width: 100%;
  text-align: center;
  z-index: 1;

  &:before {
    content: '';
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    border-width: 0 10px 10px;
    border-style: solid;
    border-color: transparent transparent white;
  }
`;

const ProgressBar = styled.div<{ progress: number }>`
  width: 100%;
  height: 4px;
  background: #eee;
  border-radius: 2px;
  margin-top: 10px;
  overflow: hidden;

  &:after {
    content: '';
    display: block;
    width: ${props => props.progress}%;
    height: 100%;
    background: #4CAF50;
    transition: width 0.3s ease;
  }
`;

const DialogBox = styled.div<{ theme: 'light' | 'dark' }>`
  background: ${props => props.theme === 'light' ? '#f5f5f5' : '#222'};
  border: 2px solid ${props => props.theme === 'light' ? '#ddd' : '#444'};
  border-radius: 10px;
  padding: 15px;
  margin-top: 20px;
  position: relative;
  color: ${props => props.theme === 'light' ? '#333' : '#e0e0e0'};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:before {
    content: '';
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid ${props => props.theme === 'light' ? '#ddd' : '#444'};
  }

  &:after {
    content: '';
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid ${props => props.theme === 'light' ? '#f5f5f5' : '#222'};
  }
`;

const Message = styled.div`
  margin-bottom: 10px;
`;

const ThoughtProcess = styled.div<{ theme: 'light' | 'dark' }>`
  margin-bottom: 10px;
  color: ${props => props.theme === 'light' ? '#333' : '#e0e0e0'};
`;

const Progress = styled.div<{ progress: number; theme: 'light' | 'dark' }>`
  width: 100%;
  height: 4px;
  background: ${props => props.theme === 'light' ? '#eee' : '#444'};
  border-radius: 2px;
  overflow: hidden;

  &:after {
    content: '';
    display: block;
    width: ${props => props.progress}%;
    height: 100%;
    background: ${props => props.theme === 'light' ? '#4CAF50' : '#4CAF50'};
    transition: width 0.3s ease;
  }
`;

interface CatProps {
  state: CompanionState;
  character: Character;
  progress?: number;
  theme?: 'light' | 'dark';
}

export const Cat: React.FC<CatProps> = ({ state, character, progress = 0, theme = 'light' }) => {
  return (
    <CatContainer>
      <CharacterEmoji status={state.status}>
        {character.emoji}
      </CharacterEmoji>
      <DialogBox theme={theme}>
        <Message>{state.message}</Message>
        {state.thoughtProcess && (
          <ThoughtProcess theme={theme}>{state.thoughtProcess}</ThoughtProcess>
        )}
        {state.task && <Progress progress={progress} theme={theme} />}
      </DialogBox>
    </CatContainer>
  );
}; 