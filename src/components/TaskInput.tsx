import { useState } from 'react';
import styled from '@emotion/styled';
import type { Task } from '../types';

const Form = styled.form<{ theme: 'light' | 'dark' }>`
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 500px;
  margin: 20px auto;
  padding: 20px;
  background: ${props => props.theme === 'light' ? 'white' : '#444'};
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const Input = styled.input<{ theme: 'light' | 'dark' }>`
  padding: 12px;
  border: 1px solid ${props => props.theme === 'light' ? '#ddd' : '#666'};
  border-radius: 5px;
  font-size: 16px;
  background: ${props => props.theme === 'light' ? 'white' : '#333'};
  color: ${props => props.theme === 'light' ? '#333' : 'white'};
  &:focus {
    outline: none;
    border-color: #4CAF50;
  }
`;

const Select = styled.select<{ theme: 'light' | 'dark' }>`
  padding: 12px;
  border: 1px solid ${props => props.theme === 'light' ? '#ddd' : '#666'};
  border-radius: 5px;
  font-size: 16px;
  background: ${props => props.theme === 'light' ? 'white' : '#333'};
  color: ${props => props.theme === 'light' ? '#333' : 'white'};
  &:focus {
    outline: none;
    border-color: #4CAF50;
  }
`;

const Button = styled.button<{ theme: 'light' | 'dark' }>`
  padding: 12px;
  border: none;
  border-radius: 5px;
  background-color: #4CAF50;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #45a049;
  }

  &:disabled {
    background-color: ${props => props.theme === 'light' ? '#cccccc' : '#666'};
    cursor: not-allowed;
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Tag = styled.div<{ selected: boolean; theme: 'light' | 'dark' }>`
  padding: 6px 12px;
  border-radius: 15px;
  background-color: ${props => {
    if (props.selected) return '#4CAF50';
    return props.theme === 'light' ? '#f5f5f5' : '#555';
  }};
  color: ${props => {
    if (props.selected) return 'white';
    return props.theme === 'light' ? '#333' : '#fff';
  }};
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;

  &:hover {
    background-color: ${props => props.selected ? '#45a049' : props.theme === 'light' ? '#e0e0e0' : '#666'};
  }
`;

const categories = [
  { name: '学习', color: '#4CAF50', icon: '📚' },
  { name: '工作', color: '#2196F3', icon: '💼' },
  { name: '阅读', color: '#9C27B0', icon: '📖' },
  { name: '写作', color: '#FF9800', icon: '✍️' },
  { name: '运动', color: '#F44336', icon: '🏃' },
  { name: '其他', color: '#607D8B', icon: '📌' }
];

interface TaskInputProps {
  onSubmit: (task: Omit<Task, 'id' | 'status' | 'createdAt'>) => void;
  disabled?: boolean;
  availableTags: string[];
  onAddTag?: (tag: string) => void;
  theme: 'light' | 'dark';
  durations?: number[];
}

export const TaskInput = ({
  onSubmit,
  disabled = false,
  availableTags,
  onAddTag,
  theme,
  durations = [25, 30, 45, 60]
}: TaskInputProps) => {
  const [content, setContent] = useState('');
  const [duration, setDuration] = useState(25);
  const [category, setCategory] = useState('学习');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    onSubmit({
      content: content.trim(),
      duration,
      category,
      tags: selectedTags
    });

    setContent('');
    setDuration(25);
    setSelectedTags([]);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTag.trim() && onAddTag) {
      e.preventDefault();
      onAddTag(newTag.trim());
      setSelectedTags(prev => [...prev, newTag.trim()]);
      setNewTag('');
    }
  };

  return (
    <Form onSubmit={handleSubmit} theme={theme}>
      <Input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="输入你想完成的任务..."
        disabled={disabled}
        theme={theme}
      />
      <Select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        disabled={disabled}
        theme={theme}
      >
        <option value="学习">📚 学习</option>
        <option value="工作">💼 工作</option>
        <option value="阅读">📖 阅读</option>
        <option value="写作">✍️ 写作</option>
        <option value="运动">🏃 运动</option>
        <option value="其他">📌 其他</option>
      </Select>
      <Select
        value={duration}
        onChange={(e) => setDuration(Number(e.target.value))}
        disabled={disabled}
        theme={theme}
      >
        {durations.map(d => (
          <option key={d} value={d}>{d}分钟</option>
        ))}
      </Select>
      <TagsContainer>
        {availableTags.map(tag => (
          <Tag
            key={tag}
            selected={selectedTags.includes(tag)}
            onClick={() => toggleTag(tag)}
            theme={theme}
          >
            {tag}
          </Tag>
        ))}
      </TagsContainer>
      <Input
        type="text"
        value={newTag}
        onChange={(e) => setNewTag(e.target.value)}
        onKeyDown={handleAddTag}
        placeholder="输入新标签并按回车添加..."
        disabled={disabled}
        theme={theme}
      />
      <Button type="submit" disabled={disabled || !content.trim()} theme={theme}>
        准备开始
      </Button>
    </Form>
  );
}; 