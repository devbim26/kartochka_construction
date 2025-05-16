import type { DocumentReportFlagsDto } from '@api-gen';
import type { FloorDocumentsFlagsSchemaType } from '../utils';

export const convertToClientReportFormFlags = (
	data: DocumentReportFlagsDto,
): FloorDocumentsFlagsSchemaType => {
	return {
		...data,
	};
};
