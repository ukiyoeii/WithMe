import { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import type { AudioSettings } from '../types';

const Container = styled.div<{ theme: 'light' | 'dark' }>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: ${props => props.theme === 'light' ? 'white' : '#333'};
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 1000;
  color: ${props => props.theme === 'light' ? '#333' : 'white'};
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Button = styled.button<{ theme: 'light' | 'dark' }>`
  padding: 8px;
  border: none;
  border-radius: 5px;
  background: #4CAF50;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background: #45a049;
  }

  &:disabled {
    background: ${props => props.theme === 'light' ? '#cccccc' : '#666'};
    cursor: not-allowed;
  }
`;

const VolumeControl = styled.input<{ theme: 'light' | 'dark' }>`
  width: 100px;
  accent-color: #4CAF50;
  
  &::-webkit-slider-runnable-track {
    background: ${props => props.theme === 'light' ? '#eee' : '#555'};
  }
`;

const FileInput = styled.input`
  display: none;
`;

const TrackName = styled.div<{ theme: 'light' | 'dark' }>`
  font-size: 14px;
  color: ${props => props.theme === 'light' ? '#666' : '#ccc'};
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

interface AudioPlayerProps {
  settings: AudioSettings;
  onSettingsChange: (settings: AudioSettings) => void;
  theme: 'light' | 'dark';
}

export const AudioPlayer = ({ settings, onSettingsChange, theme }: AudioPlayerProps) => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = settings.volume;
    }
  }, [settings.volume]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      onSettingsChange({
        ...settings,
        currentTrack: file.name
      });
    }
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(event.target.value);
    onSettingsChange({
      ...settings,
      volume
    });
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Container theme={theme}>
      <audio ref={audioRef} src={audioUrl || undefined} loop />
      <Controls>
        <Button onClick={togglePlay} disabled={!audioUrl} theme={theme}>
          {audioRef.current?.paused ? '播放' : '暂停'}
        </Button>
        <Button onClick={handleUploadClick} theme={theme}>
          上传音频
        </Button>
        <VolumeControl
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={settings.volume}
          onChange={handleVolumeChange}
          theme={theme}
        />
      </Controls>
      {settings.currentTrack && (
        <TrackName theme={theme}>{settings.currentTrack}</TrackName>
      )}
      <FileInput
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
      />
    </Container>
  );
}; 