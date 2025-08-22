import type { GraphParametrsDto } from '@api-gen';
import type { GraphDetailResponse } from '../types';

export const graphDotsConverterToClient = (data: GraphParametrsDto): GraphDetailResponse => ({
	...data,
});
