import styled from '@emotion/styled';

const Button = styled.button<{ theme: 'light' | 'dark' }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: ${props => props.theme === 'light' ? 'white' : '#333'};
  color: ${props => props.theme === 'light' ? '#333' : 'white'};
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  transition: all 0.3s;

  &:hover {
    transform: scale(1.1);
  }
`;

interface IconButtonProps {
  icon: string;
  onClick: () => void;
  theme: 'light' | 'dark';
  title?: string;
}

export const IconButton = ({ icon, onClick, theme, title }: IconButtonProps) => {
  return (
    <Button onClick={onClick} theme={theme} title={title}>
      {icon}
    </Button>
  );
}; 