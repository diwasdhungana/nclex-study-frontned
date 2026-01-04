// components/VideoPlayer.tsx
import React, { useRef, useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { Box, ActionIcon, Slider, Text, Group, Modal, Paper, Stack, Title } from '@mantine/core';
import {
  PiPlay,
  PiPause,
  PiSpeakerHigh,
  PiSpeakerNone,
  PiArrowsOut,
  PiGauge,
  PiFastForward,
  PiRewind,
  PiX,
} from 'react-icons/pi';
import { VideoControls } from './VideoControls';
import { Video } from '../../pages/dashboard/admin/video/types';

interface VideoPlayerProps {
  video: Video;
  onClose: () => void;
  isFullscreen?: boolean;
  onFullscreenChange?: (isFullscreen: boolean) => void;
}

export const VideoPlayer = ({
  video,
  onClose,
  isFullscreen = false,
  onFullscreenChange,
}: VideoPlayerProps) => {
  const playerRef = useRef<ReactPlayer>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => setIsMuted(!isMuted);

  const handleProgress = (state: { playedSeconds: number }) => {
    setPlayedSeconds(state.playedSeconds);
  };

  const handleSeek = (value: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(value, 'seconds');
      setPlayedSeconds(value);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && wrapperRef.current) {
      wrapperRef.current.requestFullscreen();
      onFullscreenChange?.(true);
    } else {
      document.exitFullscreen();
      onFullscreenChange?.(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  return (
    <Modal
      opened={!!video}
      onClose={onClose}
      size="xl"
      fullScreen={isFullscreen}
      withCloseButton={false}
      padding={0}
      radius={0}
    >
      <Box
        ref={wrapperRef}
        style={{
          background: '#000',
          height: isFullscreen ? '100vh' : '70vh',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <ActionIcon
          variant="subtle"
          color="gray"
          size="lg"
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 10,
          }}
          onClick={onClose}
        >
          <PiX size={24} />
        </ActionIcon>

        <ReactPlayer
          ref={playerRef}
          url={video.link}
          playing={isPlaying}
          volume={isMuted ? 0 : volume}
          playbackRate={playbackSpeed}
          width="100%"
          height="100%"
          style={{ position: 'absolute', top: 0, left: 0 }}
          onProgress={handleProgress}
          onDuration={setDuration}
          onEnded={() => setIsPlaying(false)}
        />

        <VideoControls
          isPlaying={isPlaying}
          playedSeconds={playedSeconds}
          duration={duration}
          volume={volume}
          isMuted={isMuted}
          playbackSpeed={playbackSpeed}
          showControls={showControls}
          onPlayPause={togglePlay}
          onSeek={handleSeek}
          onVolumeChange={setVolume}
          onMuteToggle={toggleMute}
          onFullscreenToggle={toggleFullscreen}
          onPlaybackSpeedChange={setPlaybackSpeed}
        />
      </Box>

      <Box p="md">
        <Stack>
          <Group justify="space-between">
            <Title order={3}>{video.title}</Title>
            <Text size="sm" c="dimmed">
              {new Date(video.createdAt).toLocaleDateString()}
            </Text>
          </Group>
          <Text size="sm" c="gray">
            {video.description}
          </Text>
        </Stack>
      </Box>
    </Modal>
  );
};
