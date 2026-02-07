import { Image } from 'expo-image';
import { Platform, StyleSheet, Pressable } from 'react-native';
import { useEffect } from 'react';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useArticles } from '@/queries/useArticles';
import { usePlayer } from '@/store/PlayerContext';
import { router } from 'expo-router';

export default function HomeScreen() {
  const { playPlaylist } = usePlayer();

  const a1 = useArticles({ category: 'Thế giới', page: 1, limit: 10, hasAudio: true });
  const a2 = useArticles({ category: 'Thời sự', page: 1, limit: 10, hasAudio: true });
  const a3 = useArticles({ category: 'Giải trí', page: 1, limit: 10, hasAudio: true });
  const a4 = useArticles({ category: 'Tin mới nhất', page: 1, limit: 10, hasAudio: true });
  const a5 = useArticles({ category: 'Kinh doanh', page: 1, limit: 10, hasAudio: true });
  const a6 = useArticles({ category: 'Thể thao', page: 1, limit: 10, hasAudio: true });
  const a7 = useArticles({ category: 'Pháp luật', page: 1, limit: 10, hasAudio: true });
  const a8 = useArticles({ category: 'Giáo dục', page: 1, limit: 10, hasAudio: true });
  const a9 = useArticles({ category: 'Sức khỏe', page: 1, limit: 10, hasAudio: true });
  const a10 = useArticles({ category: 'Du lịch', page: 1, limit: 10, hasAudio: true });
  const a11 = useArticles({ category: 'Khoa học - Công nghệ', page: 1, limit: 10, hasAudio: true });
  const a12 = useArticles({ category: 'Đời sống', page: 1, limit: 10, hasAudio: true });
  const a13 = useArticles({ category: 'Ô tô - Xe máy', page: 1, limit: 10, hasAudio: true });
  const a14 = useArticles({ category: 'Ý kiến', page: 1, limit: 10, hasAudio: true });
  const a15 = useArticles({ category: 'Tâm sự', page: 1, limit: 10, hasAudio: true });
  const a16 = useArticles({ category: 'Cười', page: 1, limit: 10, hasAudio: true });
  const a17 = useArticles({ category: 'Tin nổi bật', page: 1, limit: 10, hasAudio: true });
  const a18 = useArticles({ category: 'Tin xem nhiều', page: 1, limit: 10, hasAudio: true });


  // console.log(morning.data);
  
  
  const renderCard = (title: string, data: any) => (
    <Pressable
      style={styles.card}
      onPress={() => {
        
        const articles = data?.data?.data;

        console.log('articles', articles);
        console.log('isArray', Array.isArray(articles));

        if (!Array.isArray(articles)) return;

        playPlaylist(articles, 0);
        router.push('/modal/player');
      }}
    >
      <ThemedText type="subtitle" style={styles.cardTitle}>
         {title}
      </ThemedText>
      <ThemedText style={styles.cardDesc}>
        Bản tin thời sự cập nhật nhanh, có audio
      </ThemedText>

      <ThemedView style={styles.playBtn}>
        <ThemedText type="defaultSemiBold"> Nghe ngay</ThemedText>
      </ThemedView>
    </Pressable>
  );

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.container}>
        {renderCard('Thế giới', a1)}
        {renderCard('Thời sự', a2)}
        {renderCard('Giải trí', a3)}
        {renderCard('Tin mới nhất', a4)}
        {renderCard('Kinh doanh', a5)}
        {renderCard('Thể thao', a6)}
        {renderCard('Pháp luật', a7)}
        {renderCard('Giáo dục', a8)}
        {renderCard('Sức khỏe', a9)}
        {renderCard('Du lịch', a10)}
        {renderCard('Khoa học - Công nghệ', a11)}
        {renderCard('Đời sống', a12)}
        {renderCard('Ô tô - Xe máy', a13)}
        {renderCard('Ý kiến', a14)}
        {renderCard('Tâm sự', a15)}
        {renderCard('Cười', a16)}
        {renderCard('Tin nổi bật', a17)}
        {renderCard('Tin xem nhiều', a18)}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    paddingVertical: 12,
  },

  card: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: 'rgba(27, 68, 70, 0.9)',
    gap: 8,
  },

  cardTitle: {
    fontSize: 18,
  },

  cardDesc: {
    opacity: 0.7,
  },

  playBtn: {
    marginTop: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#A1CEDC',
  },

  reactLogo: {
    height: 178,
    width: 290,
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
});
