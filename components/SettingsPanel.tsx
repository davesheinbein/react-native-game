import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export function SettingsPanel({
	isOpen,
	onOpen,
	onClose,
	isMusicPlaying,
	onToggleMusic,
	onNextTrack,
	isMuted,
	onToggleMute,
	sfxEnabled,
	onToggleSfx,
	onResetHighScore,
	musicTitle,
	musicIndex,
}) {
	return (
		<View
			style={{
				position: 'absolute',
				top: 18,
				right: 18,
				zIndex: 10,
			}}
		>
			{!isOpen ?
				<TouchableOpacity
					onPress={onOpen}
					style={{
						padding: 8,
						backgroundColor: 'rgba(34,34,34,0.7)',
						borderRadius: 24,
						elevation: 4,
					}}
				>
					<MaterialCommunityIcons
						name='cog-outline'
						size={32}
						color='#ffd600'
						accessibilityLabel='Open settings'
					/>
				</TouchableOpacity>
			:	<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						backgroundColor: 'rgba(34,34,34,0.92)',
						borderRadius: 32,
						paddingVertical: 10,
						paddingHorizontal: 16,
						shadowColor: '#000',
						shadowOpacity: 0.18,
						shadowRadius: 8,
						elevation: 8,
						gap: 18,
						minWidth: 0,
						transform: [{ translateX: isOpen ? 0 : 200 }],
					}}
				>
					<TouchableOpacity
						onPress={onClose}
						style={{ padding: 6 }}
					>
						<MaterialCommunityIcons
							name='close-circle-outline'
							size={28}
							color='#ffd600'
							accessibilityLabel='Close settings'
						/>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={onToggleMusic}
						style={{ padding: 6 }}
					>
						<MaterialCommunityIcons
							name={
								isMusicPlaying ?
									'pause-circle-outline'
								:	'play-circle-outline'
							}
							size={28}
							color='#b2dfdb'
							accessibilityLabel={
								isMusicPlaying ? 'Pause music' : (
									'Play music'
								)
							}
						/>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={onNextTrack}
						style={{ padding: 6 }}
					>
						<Text
							style={{
								color: '#ffd600',
								fontSize: 14,
								marginBottom: 2,
							}}
						>
							{musicTitle} (tap to change)
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={onToggleMute}
						style={{ padding: 6 }}
					>
						<MaterialCommunityIcons
							name={isMuted ? 'volume-off' : 'volume-high'}
							size={28}
							color='#ffd600'
							accessibilityLabel={
								isMuted ? 'Unmute all' : 'Mute all'
							}
						/>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={onToggleSfx}
						style={{ padding: 6 }}
					>
						<MaterialCommunityIcons
							name={
								sfxEnabled ?
									'bell-ring-outline'
								:	'bell-off-outline'
							}
							size={26}
							color='#ffd600'
							accessibilityLabel={
								sfxEnabled ? 'Disable SFX' : 'Enable SFX'
							}
						/>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={onResetHighScore}
						style={{ padding: 6 }}
					>
						<MaterialCommunityIcons
							name='restore'
							size={26}
							color='#ffd600'
							accessibilityLabel='Reset High Score'
						/>
					</TouchableOpacity>
				</View>
			}
		</View>
	);
}
