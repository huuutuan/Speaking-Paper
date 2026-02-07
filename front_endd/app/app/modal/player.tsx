import React from 'react';

import { View, Text, StyleSheet, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Slider from '@react-native-community/slider';

import { usePlayer } from '@/hooks/usePlayer';
import { COLORS1, SPACING } from '@/constants/theme';

const { width } = Dimensions.get('window');

export default function PlayerModel() {
	const {
		playlist,
		currentIndex,
		currentArticle,
		isPlaying,
		progress,
		duration,
		playAtIndex,
		togglePlay,
		seekTo,
		next,
		prev,
	} = usePlayer();

	if (!currentArticle) return null;

	return (
		<View style={styles.container}>
			{/* Header */}
			<View style={styles.header}>
				<TouchableOpacity onPress={() => router.back()}>
					<Ionicons name="chevron-down" size={28} color={COLORS1.text} />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>Đang phát</Text>
				<View style={{ width: 28}}></View>
			</View>
			{/* Cover */}
			<View style={styles.coverWrapper}>
				<View style={styles.cover}>
					<Text style={styles.emoji}>
						{'🎧'}
					</Text>
				</View>
			</View>
			{/* playlist */}
			<FlatList 
				data={playlist}
				keyExtractor={(item) => item._id.toString()}
				renderItem={({item, index}) => {
					const isActive = index === currentIndex;

					return (
						<View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: isActive ? '#222' : 'transparent'}}>
							<TouchableOpacity
								onPress={() => {playAtIndex(index)}}
								style={{flex: 1}}
							>
								<Text style={{ color: isActive ? '#1DB954': '#fff'}} >{item.title}</Text>
							</TouchableOpacity>

							<TouchableOpacity
								onPress={() => router.push({
									pathname: 'articles/[id]',
									params: { id: item._id.toString() },
								})}
								style= {{
									paddingHorizontal: 12,
									paddingVertical: 6,
									borderRadius: 6,
									backgroundColor: '#1DB954',
								}}
								>
								<Ionicons name="information-circle-outline" size={22} color={COLORS1.text} />
								{/* <Text style= {{ color: "#000", fontSize: 12}} >  </Text> */}
							</TouchableOpacity>
						</View>
					)
				}}
			/>
			{/* Info */}
			<View style={styles.info}>
				<Text style={styles.title}>{currentArticle.title}</Text>
				<Text style={styles.artist}>{currentArticle.author ?? 'Unkown'}</Text>
			</View>
			{/* Progress */}
			<View style={styles.progress}>
				<Slider
					style={{width: width - 48}}
					minimumValue={0}
					maximumValue={100}
					value={progress}
					minimumTrackTintColor={COLORS1.primary}
					maximumTrackTintColor={COLORS1.textSecondary}
					thumbTintColor={COLORS1.primary}
					onSlidingComplete={seekTo}
				/>
				
			</View>
			{/* Controls */}
			<View style={styles.controls}>
				<TouchableOpacity onPress={prev}>
					<Ionicons name="play-skip-back" size= {32} color={COLORS1.text} />
				</TouchableOpacity>

				<TouchableOpacity onPress={togglePlay}>
					<Ionicons
						name={isPlaying ? 'pause-circle' : 'play-circle'}
						size={72}
						color={COLORS1.text}
					/>
				</TouchableOpacity>
				<TouchableOpacity onPress={next}>
					<Ionicons name="play-skip-forward" size={32} color={COLORS1.text} />
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS1.background,
		paddingTop: 48,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		marginBottom: 24,
	},
	headerTitle: {
		color: COLORS1.textSecondary,
		fontSize: 13,
		fontWeight: '600',
	},
	coverWrapper: {
		alignItems: 'center',
		marginBottom: 32,
	},
	cover: {
		width: width * 0.4,
		height: width *0.4,
		backgroundColor: COLORS1.surface,
		borderRadius: 12,
		alignItems: 'center',
		justifyContent: 'center',
	},
	emoji: {
		fontSize: 96,
	},
	info: {
		alignItems: 'center',
		marginBottom: 24,
	},
	title: {
		color: COLORS1.text,
		fontSize: 15,
		fontWeight: '700',
		marginBottom: 6,
		marginTop: 6,
	},
	artist: {
		color: COLORS1.textSecondary,
		fontSize: 14,
	},
	progress: {
		alignItems: 'center',
		marginBottom: 20,
	},
	controls: {
		flexDirection: 'row' ,
		alignItems: 'center',
		justifyContent: 'space-around',
		paddingHorizontal: 32,
		marginBottom: 28,
	},
});