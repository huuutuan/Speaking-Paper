import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ArticleDetail } from '@/type/index';
import { COLORS1, SPACING } from '@/constants/theme';
import { api } from '@/services/api';

export default function ArticleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [article, setArticle] = useState< ArticleDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    api.getArticleDetail(id)
      .then(res => {
        setArticle(res.data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS1.primary} />
      </View>
    );
  }

  if (!article) {
    return (
      <View style={styles.center}>
        <Text style={{ color: COLORS1.text }}>Không tìm thấy bài viết</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons
          name="chevron-back"
          size={28}
          color={COLORS1.text}
          onPress={() => router.back()}
        />
      </View>

      {/* Title */}
      <Text style={styles.title}>{article.title}</Text>

      {/* Meta */}
      <Text style={styles.meta}>
        {article.author ?? 'Không rõ tác giả'} ·{' '}
        {new Date(article.pubDate).toLocaleDateString('vi-VN')}
      </Text>

      {/* Description */}
      {article.description && (
        <Text style={styles.description}>{article.description}</Text>
      )}

      {/* Content / Summary */}
      <Text style={styles.content}>
        {article.fullContent}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS1.background,
    paddingHorizontal: SPACING.md,
  },
  header: {
    paddingTop: 48,
    marginBottom: 16,
  },
  title: {
    color: COLORS1.text,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
  },
  meta: {
    color: COLORS1.textSecondary,
    fontSize: 13,
    marginBottom: 16,
  },
  description: {
    color: COLORS1.text,
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  content: {
    color: COLORS1.text,
    fontSize: 16,
    lineHeight: 24,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS1.background,
  },
});
