import { GraphType } from '@api-gen';
import type { GraphDetailResponse } from '../types';

/** Серия расчёта Rw (Computed или старое имя computedDots). */
export const graphHasComputedData = (graphData: GraphDetailResponse[] | null): boolean =>
	(graphData ?? []).some(
		(g) =>
			(g.namedDots?.length ?? 0) > 0 &&
			(g.graphType === GraphType.Computed ||
				(g.name || '').toLowerCase() === 'computeddots'),
	);

/** Лабораторная серия (Laboratory или старое имя LaboratoryDots). */
export const graphHasLaboratoryData = (graphData: GraphDetailResponse[] | null): boolean =>
	(graphData ?? []).some(
		(g) =>
			(g.namedDots?.length ?? 0) > 0 &&
			(g.graphType === GraphType.Laboratory ||
				(g.name || '').toLowerCase() === 'laboratorydots'),
	);
