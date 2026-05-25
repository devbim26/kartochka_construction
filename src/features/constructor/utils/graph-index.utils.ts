import { IndexType } from '@api-gen';
import type { AdditionalGraphParameters } from '../types';

export const parseGraphIndexNumber = (value: unknown): number | null => {
	if (value == null || value === '') return null;
	const n = Number(String(value).trim().replace(',', '.'));
	return Number.isFinite(n) ? n : null;
};

export type GraphRelevanceInputs = {
	additional: AdditionalGraphParameters | null | undefined;
	headerRw?: string | number | null;
	headerLw?: string | number | null;
	headerLabRw?: string | number | null;
	headerLabLw?: string | number | null;
	reqRw?: number | null;
	reqLw?: number | null;
	isFloorConstruction: boolean;
	hasComputedDots: boolean;
	hasLaboratoryDots: boolean;
	hasImpactComputedDots: boolean;
	hasImpactLaboratoryDots: boolean;
};

export type GraphRelevanceResult = {
	compIsRelevant: boolean;
	labIsRelevant: boolean;
	compImpactRelevant: boolean;
	labImpactRelevant: boolean;
	displayComputedRw: number | null;
	displayComputedLw: number | null;
	displayLabRw: number | null;
	displayLabLw: number | null;
};

export const evaluateGraphRelevance = (inputs: GraphRelevanceInputs): GraphRelevanceResult => {
	const {
		additional,
		headerRw,
		headerLw,
		headerLabRw,
		headerLabLw,
		reqRw,
		reqLw,
		isFloorConstruction,
		hasComputedDots,
		hasLaboratoryDots,
		hasImpactComputedDots,
		hasImpactLaboratoryDots,
	} = inputs;

	const computedRw = additional?.computingRw ?? parseGraphIndexNumber(headerRw);
	const computedLw = additional?.computingLw ?? parseGraphIndexNumber(headerLw);

	const labType = additional?.laboratoryIndexType;
	const labVal = additional?.laboratoryIndexValue;

	const displayLabRw =
		labType === IndexType.Rw || labType == null
			? (labVal ?? parseGraphIndexNumber(headerLabRw))
			: parseGraphIndexNumber(headerLabRw);
	const displayLabLw =
		labType === IndexType.Lnw
			? (labVal ?? parseGraphIndexNumber(headerLabLw))
			: parseGraphIndexNumber(headerLabLw);

	let compIsRelevant = false;
	let labIsRelevant = false;
	let compImpactRelevant = false;
	let labImpactRelevant = false;

	if (reqRw != null && !Number.isNaN(reqRw)) {
		const hasRw = hasComputedDots || computedRw != null;
		const hasLabRwVal = hasLaboratoryDots || displayLabRw != null;
		if (hasRw && computedRw != null) compIsRelevant = computedRw >= reqRw;
		if (hasLabRwVal && displayLabRw != null) labIsRelevant = displayLabRw >= reqRw;
	}

	if (isFloorConstruction && reqLw != null && !Number.isNaN(reqLw)) {
		const hasLwCalc = hasImpactComputedDots || computedLw != null;
		const hasLwLab = hasImpactLaboratoryDots || displayLabLw != null;
		if (hasLwCalc && computedLw != null) compImpactRelevant = computedLw <= reqLw;
		if (hasLwLab && displayLabLw != null) labImpactRelevant = displayLabLw <= reqLw;
	}

	return {
		compIsRelevant,
		labIsRelevant,
		compImpactRelevant,
		labImpactRelevant,
		displayComputedRw: computedRw,
		displayComputedLw: computedLw,
		displayLabRw,
		displayLabLw,
	};
};
