import { GraphType } from '@api-gen';
import type { GraphDetailResponse } from '../types';

export type GraphNoiseMode = 'airborne' | 'impact';

const hasNamedDots = (g: GraphDetailResponse): boolean => (g.namedDots?.length ?? 0) > 0;

/** Серия графика относится к ударному шуму (Lw). */
export const isImpactGraphResponse = (g: GraphDetailResponse): boolean => {
	if (!hasNamedDots(g)) return false;
	const name = (g.name || '').toLowerCase();
	if (name === 'deviationdotslist') return false;
	const gt = g.graphType;
	if (
		gt === GraphType.ComputedImpact ||
		gt === GraphType.LaboratoryImpact ||
		gt === GraphType.ImpactAtalon
	) {
		return true;
	}
	return name === 'impactcomputeddots' || name === 'impactlaboratorydots';
};

/** Есть хотя бы одна серия воздушного шума (Rw и доп. слои). */
export const graphHasAirborneGraphData = (graphData: GraphDetailResponse[] | null): boolean =>
	(graphData ?? []).some(
		(g) => hasNamedDots(g) && !isImpactGraphResponse(g) && (g.name || '').toLowerCase() !== 'deviationdotslist',
	);

/** Есть хотя бы одна серия ударного шума (Lw). */
export const graphHasImpactGraphData = (graphData: GraphDetailResponse[] | null): boolean =>
	(graphData ?? []).some(isImpactGraphResponse);

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
