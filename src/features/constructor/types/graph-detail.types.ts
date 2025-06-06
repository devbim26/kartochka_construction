import type { Dot } from './dot.types';

export type GraphDetailResponse = {
	delta?: number;
	c?: number;
	ctr?: number;
	computingRw?: number;
	labRw?: number;
	dotRs?: Dot[] | null;
	laboratoryDots?: Dot[] | null;
	deviationDots?: Dot[] | null;
	dotC?: Dot;
	dotB?: Dot;
};
