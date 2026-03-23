import type { GetAlternativeConstructionHeadersQuery } from '@api-gen';
import type { AlternateConstructionsType } from '../types';

const toNum = (v: unknown): number | null => {
	if (v === '' || v === null || v === undefined) return null;
	const n = Number(v);
	return Number.isFinite(n) ? n : null;
};

export const convertAlternateConstructionsCommand = (
	data: AlternateConstructionsType,
): GetAlternativeConstructionHeadersQuery => ({
	pageNumber: data.pageNumber,
	pageSize: data.pageSize,
	minThickness: toNum(data.minThickness),
	maxThickness: toNum(data.maxThickness),
	minMass: toNum(data.minWeight),
	maxMass: toNum(data.maxWeight),
	minLabRw: toNum(data.minLabIndex),
	maxLabRw: toNum(data.maxLabIndex),
});
