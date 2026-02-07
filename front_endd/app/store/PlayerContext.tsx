import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from 'react';
import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from 'expo-av';
import { Article } from '@/type';

interface PlayerContextType {
  playlist: Article[];
  currentIndex: number;
  currentArticle: Article | null;
  isPlaying: boolean;
  progress: number;
  duration: number;

  playPlaylist: (list: Article[], index: number) => Promise<void>;
  playAtIndex: (index: number) => Promise<void>;
  togglePlay: () => Promise<void>;
  next: () => Promise<void>;
  prev: () => Promise<void>;
  seekTo: (percentage: number) => Promise<void>;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const soundRef = useRef<Audio.Sound | null>(null);
  const isSwitchingRef = useRef(false);

  const [playlist, setPlaylist] = useState<Article[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  /* ================= CORE ================= */

  const stopAndUnload = async () => {
    if (!soundRef.current) return;

    try {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
    } catch (e) {
      console.warn('stop/unload error', e);
    }

    soundRef.current.setOnPlaybackStatusUpdate(null);
    soundRef.current = null;
  };

  const loadAndPlay = async (article: Article) => {
    if (isSwitchingRef.current) return;
    if (!article.audio?.streamUrl) return;

    isSwitchingRef.current = true;

    try {
      await stopAndUnload();

      const { sound } = await Audio.Sound.createAsync(
        {
          uri: `http://172.20.10.4:3000${article.audio.streamUrl}`,
        },
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );

      soundRef.current = sound;
      setCurrentArticle(article);
      setIsPlaying(true);
    } finally {
      isSwitchingRef.current = false;
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (!status.isLoaded) return;

    if (status.durationMillis) {
      setProgress(
        (status.positionMillis / status.durationMillis) * 100
      );
      setDuration(status.durationMillis);
    }

    if (
      status.didJustFinish &&
      !isSwitchingRef.current &&
      currentIndex + 1 < playlist.length
    ) {
      next();
    }
  };

  /* ================= CONTROLS ================= */

  const playPlaylist = async (list: Article[], index: number) => {
    if (!Array.isArray(list) || !list[index]) return;

    setPlaylist(list);
    setCurrentIndex(index);
    await loadAndPlay(list[index]);
  };

  const playAtIndex = async (index: number) => {
    if (!playlist[index]) return;

    setCurrentIndex(index);
    await loadAndPlay(playlist[index]);
  };

  const togglePlay = async () => {
    if (!soundRef.current) return;

    if (isPlaying) {
      await soundRef.current.pauseAsync();
    } else {
      await soundRef.current.playAsync();
    }
    setIsPlaying(v => !v);
  };

  const next = async () => {
    if (currentIndex + 1 >= playlist.length) return;
    await playAtIndex(currentIndex + 1);
  };

  const prev = async () => {
    if (currentIndex === 0) return;
    await playAtIndex(currentIndex - 1);
  };

  const seekTo = async (percentage: number) => {
    if (!soundRef.current || !duration) return;
    await soundRef.current.setPositionAsync(
      (percentage / 100) * duration
    );
  };

  /* ================= AUDIO MODE ================= */

  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      playsInSilentModeIOS: true,

      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      shouldDuckAndroid: false,
    });

    return () => {
      stopAndUnload();
    };
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        playlist,
        currentIndex,
        currentArticle,
        isPlaying,
        progress,
        duration,
        playPlaylist,
        playAtIndex,
        togglePlay,
        next,
        prev,
        seekTo,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
};
