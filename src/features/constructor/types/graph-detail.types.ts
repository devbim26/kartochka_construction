import type { NamedDot } from './dot.types';

export type GraphDetailResponse = {
	name?: string | null;
	namedDots?: NamedDot[] | null;
};

export interface AdditionalGraphParameters {
	delta?: number;
	c?: number;
	ctr?: number;
	computingRw?: number;
	laboratoryIndexValue?: number;
	laboratoryC?: number;
	laboratoryCtr?: number;
	laboratoryDelta?: number;
}
