import { useState } from 'react';

export function useSafeJump(
	sides: number,
	safeSides: number[]
) {
	const [lastJump, setLastJump] = useState<number | null>(
		null
	);

	function jump(side: number) {
		setLastJump(side);
		return safeSides.includes(side);
	}

	return { lastJump, jump };
}
