// components/VideoControls.tsx
import React from 'react';
import { Box, Group, ActionIcon, Slider, Text, Menu, rem } from '@mantine/core';
import {
  PiPlay,
  PiPause,
  PiSpeakerHigh,
  PiSpeakerNone,
  PiArrowsOut,
  PiGauge,
  PiFastForward,
  PiRewind,
} from 'react-icons/pi';

const playbackOptions = [
  { value: 0.5, label: '0.5x' },
  { value: 0.75, label: '0.75x' },
  { value: 1, label: '1x' },
  { value: 1.5, label: '1.5x' },
  { value: 2, label: '2x' },
];

interface VideoControlsProps {
  isPlaying: boolean;
  playedSeconds: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playbackSpeed: number;
  showControls: boolean;
  onPlayPause: () => void;
  onSeek: (value: number) => void;
  onVolumeChange: (value: number) => void;
  onMuteToggle: () => void;
  onFullscreenToggle: () => void;
  onPlaybackSpeedChange: (speed: number) => void;
}

export const VideoControls = ({
  isPlaying,
  playedSeconds,
  duration,
  volume,
  isMuted,
  playbackSpeed,
  showControls,
  onPlayPause,
  onSeek,
  onVolumeChange,
  onMuteToggle,
  onFullscreenToggle,
  onPlaybackSpeedChange,
}: VideoControlsProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <PiSpeakerNone size={20} />;
    return <PiSpeakerHigh size={20} />;
  };

  return (
    <Box
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
        padding: '16px',
        transition: 'opacity 0.3s',
        opacity: showControls ? 1 : 0,
        zIndex: 10,
      }}
    >
      <Slider
        value={playedSeconds}
        onChange={onSeek}
        max={duration || 100}
        min={0}
        step={0.1}
        styles={{
          thumb: { display: 'none' },
          track: { height: 4 },
          bar: { backgroundColor: '#ff4136' },
        }}
        mb="sm"
      />

      <Group justify="space-between">
        <Group gap="xs">
          <ActionIcon variant="transparent" color="gray" size="lg" onClick={onPlayPause}>
            {isPlaying ? <PiPause size={20} /> : <PiPlay size={20} />}
          </ActionIcon>
          <ActionIcon
            variant="transparent"
            color="gray"
            size="lg"
            onClick={() => onSeek(Math.max(0, playedSeconds - 10))}
          >
            <PiRewind size={20} />
          </ActionIcon>
          <ActionIcon
            variant="transparent"
            color="gray"
            size="lg"
            onClick={() => onSeek(Math.min(duration, playedSeconds + 10))}
          >
            <PiFastForward size={20} />
          </ActionIcon>
          <ActionIcon variant="transparent" color="gray" size="lg" onClick={onMuteToggle}>
            {getVolumeIcon()}
          </ActionIcon>
          <Slider
            value={isMuted ? 0 : volume * 100}
            onChange={(value) => onVolumeChange(value / 100)}
            max={100}
            min={0}
            step={1}
            style={{ width: 80 }}
            styles={{
              thumb: { width: 12, height: 12 },
              track: { height: 4 },
            }}
          />
          <Text size="sm" c="gray">
            {formatTime(playedSeconds)} / {formatTime(duration)}
          </Text>
        </Group>

        <Group>
          <Menu shadow="md" width={120}>
            <Menu.Target>
              <ActionIcon variant="transparent" color="gray" size="lg">
                <PiGauge size={20} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Playback Speed</Menu.Label>
              {playbackOptions.map((option) => (
                <Menu.Item
                  key={option.value}
                  rightSection={playbackSpeed === option.value ? '✓' : undefined}
                  onClick={() => onPlaybackSpeedChange(option.value)}
                >
                  {option.label}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>

          <ActionIcon variant="transparent" color="gray" size="lg" onClick={onFullscreenToggle}>
            <PiArrowsOut size={20} />
          </ActionIcon>
        </Group>
      </Group>
    </Box>
  );
};
