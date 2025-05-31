// Shows possible jump directions (arrows, highlights, etc)
import React from 'react';
import { View } from 'react-native';

export function JumpIndicator({
	sides,
	safeSides,
}: {
	sides: number;
	safeSides: number[];
}) {
	// TODO: Render jump indicators for each side
	return <View style={{ height: 20 }} />;
}
