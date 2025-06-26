import type { GetAlternativeConstructionHeadersQuery } from '@api-gen';
import type { AlternateConstructionsType } from '../types';

export const convertAlternateConstructionsCommand = (
	data: AlternateConstructionsType,
): GetAlternativeConstructionHeadersQuery => ({
	maxComputingRw: data.maxIndex || undefined,
	maxHeight: data.maxHeight || undefined,
	maxMass: data.maxWeight || undefined,
	maxFireResistanceLimit: data.maxFireresistance || undefined,
	maxLabRw: data.maxLabIndex || undefined,
	maxThickness: data.maxThickness || undefined,
	minComputingRw: data.minIndex || undefined,
	minHeight: data.minHeight || undefined,
	minMass: data.minWeight || undefined,
	minFireResistanceLimit: data.minFireresistance || undefined,
	minLabRw: data.minLabIndex || undefined,
	minThickness: data.minThickness || undefined,
	requirementId: data.requirementId,
	pageNumber: data.pageNumber,
	pageSize: data.pageSize,
});
