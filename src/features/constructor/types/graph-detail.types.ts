import type { NamedDot } from './dot.types';

export type GraphDetailResponse = {
	name?: string | null;
	namedDots?: NamedDot[] | null;
};
