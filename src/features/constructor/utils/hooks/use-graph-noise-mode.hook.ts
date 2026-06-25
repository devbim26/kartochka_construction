import type { GraphDetailResponse } from '@features/constructor/types';
import { useEffect, useMemo, useState } from 'react';
import {
	graphHasAirborneGraphData,
	graphHasImpactGraphData,
	type GraphNoiseMode,
} from '../graph-visibility.utils';

export const useGraphNoiseMode = (graphData: GraphDetailResponse[] | null) => {
	const hasAirborneData = useMemo(() => graphHasAirborneGraphData(graphData), [graphData]);
	const hasImpactData = useMemo(() => graphHasImpactGraphData(graphData), [graphData]);
	const showNoiseModeSwitch = hasAirborneData && hasImpactData;

	const [noiseMode, setNoiseMode] = useState<GraphNoiseMode>('airborne');

	useEffect(() => {
		if (hasAirborneData) {
			setNoiseMode('airborne');
		} else if (hasImpactData) {
			setNoiseMode('impact');
		}
	}, [graphData, hasAirborneData, hasImpactData]);

	const activeNoiseMode: GraphNoiseMode = showNoiseModeSwitch
		? noiseMode
		: hasImpactData && !hasAirborneData
			? 'impact'
			: 'airborne';

	return {
		noiseMode,
		setNoiseMode,
		activeNoiseMode,
		showNoiseModeSwitch,
		hasAirborneData,
		hasImpactData,
	};
};
