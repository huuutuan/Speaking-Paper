// src/components/player/NowPlayingBar.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { usePlayer } from '@/hooks/usePlayer';
import { COLORS1, SPACING } from '@/constants/theme';

export const NowPlayingBar: React.FC = () => {
  const {
    currentArticle,
    isPlaying,
    progress,
    togglePlay,
  } = usePlayer();

  // Chưa có bài đang phát → không render
  if (!currentArticle) return null;

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.9}
      onPress={() => router.push('/modal/player')}
    >
      {/* Progress bar */}
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${Math.min(progress, 100)}%` },
          ]}
        />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Left */}
        <View style={styles.left}>
          <View style={styles.cover}>
            <Text style={styles.emoji}>
              {'🎧'}
            </Text>
          </View>

          <View style={styles.info}>
            <Text style={styles.title} numberOfLines={1}>
              {currentArticle.title}
            </Text>
            <Text style={styles.artist} numberOfLines={1}>
              {currentArticle.author ?? 'Unknown'}
            </Text>
          </View>
        </View>

        {/* Controls */}
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation(); // ❗ tránh mở full player khi pause
            togglePlay();
          }}
        >
          <Ionicons
            name={isPlaying ? 'pause-circle' : 'play-circle'}
            size={42}
            color={COLORS1.text}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 8,
    right: 8,
    bottom: 86, // nằm trên tab bar
    backgroundColor: COLORS1.surface,
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: 2,
    backgroundColor: COLORS1.border,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS1.primary,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: SPACING.md,
  },
  cover: {
    width: 44,
    height: 44,
    borderRadius: 6,
    backgroundColor: COLORS1.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  emoji: {
    fontSize: 22,
  },
  info: {
    flex: 1,
  },
  title: {
    color: COLORS1.text,
    fontSize: 14,
    fontWeight: '600',
  },
  artist: {
    color: COLORS1.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
});
