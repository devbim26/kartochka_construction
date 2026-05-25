import { GraphType } from '@api-gen';
import type { GraphDetailResponse } from '../types';

/** Воздушный шум: расчёт Rw (Computed / legacy computedDots). */
export const graphHasAirborneComputedData = (graphData: GraphDetailResponse[] | null): boolean =>
	(graphData ?? []).some(
		(g) =>
			(g.namedDots?.length ?? 0) > 0 &&
			(g.graphType === GraphType.Computed ||
				(g.name || '').toLowerCase() === 'computeddots'),
	);

/** Воздушный шум: лаборатория (Laboratory / legacy laboratoryDots). */
export const graphHasAirborneLaboratoryData = (graphData: GraphDetailResponse[] | null): boolean =>
	(graphData ?? []).some(
		(g) =>
			(g.namedDots?.length ?? 0) > 0 &&
			(g.graphType === GraphType.Laboratory ||
				(g.name || '').toLowerCase() === 'laboratorydots'),
	);

/** Ударный шум: расчёт Lw (ComputedImpact / legacy impactComputedDots). */
export const graphHasImpactComputedData = (graphData: GraphDetailResponse[] | null): boolean =>
	(graphData ?? []).some(
		(g) =>
			(g.namedDots?.length ?? 0) > 0 &&
			(g.graphType === GraphType.ComputedImpact ||
				(g.name || '').toLowerCase() === 'impactcomputeddots'),
	);

/** Ударный шум: лаборатория Lw (LaboratoryImpact / legacy impactLaboratoryDots). */
export const graphHasImpactLaboratoryData = (graphData: GraphDetailResponse[] | null): boolean =>
	(graphData ?? []).some(
		(g) =>
			(g.namedDots?.length ?? 0) > 0 &&
			(g.graphType === GraphType.LaboratoryImpact ||
				(g.name || '').toLowerCase() === 'impactlaboratorydots'),
	);

/** @deprecated алиас: только воздушный расчёт (стены и Rw на графике). */
export const graphHasComputedData = graphHasAirborneComputedData;

/** @deprecated алиас: только воздушная лаборатория. */
export const graphHasLaboratoryData = graphHasAirborneLaboratoryData;
