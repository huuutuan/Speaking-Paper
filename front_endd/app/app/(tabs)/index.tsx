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

  const morning = useArticles({ category: 'Thế giới', page: 1, limit: 10, hasAudio: true });
  const noon = useArticles({ category: 'Thế giới', page: 1, limit: 10, hasAudio: true });
  const evening = useArticles({ category: 'Thế giới', page: 1, limit: 10, hasAudio: true });
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
  useEffect(() => {
  if (morning.isSuccess && morning.data?.data) {
    console.log('morning.data =', morning.data);
    console.log('typeof data', typeof morning.data);
    morning.data.data.forEach(article => {
      console.log('article:', article._id);
      console.log('audio:', article.audio);
      console.log('streamUrl:', article.audio?.streamUrl);
    });
  }
}, [morning.isSuccess, morning.data]);

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
        {renderCard('Thời sự buổi sáng', morning)}
        {renderCard('Thời sự buổi trưa', noon)}
        {renderCard('Thời sự buổi tối', evening)}
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
    backgroundColor: 'rgba(26, 51, 96, 0.9)',
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
