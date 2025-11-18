import type { GraphParametrsDto } from '@api-gen';
import type { GraphDetailResponse } from '../types';

export const graphDotsConverterToClient = (data: GraphParametrsDto): GraphDetailResponse => ({
	...data,
	namedDots: data.namedDots?.map((dot) => ({
		name: dot.name ?? data.name,
		dot: {
			f: dot.dot?.f !== undefined ? parseFloat(dot.dot.f.toFixed(2)) : 0,
			r: dot.dot?.r !== undefined ? parseFloat(dot.dot.r.toFixed(2)) : 0,
		},
	})),
});
