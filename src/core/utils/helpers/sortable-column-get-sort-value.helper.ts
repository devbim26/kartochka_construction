import { TableSorcTypes } from '../../types';

export const getSortableColumnSortValue = (curr: TableSorcTypes): TableSorcTypes => {
	if (curr === TableSorcTypes.Asc) {
		return TableSorcTypes.Desc;
	} else if (curr === TableSorcTypes.Desc) {
		return TableSorcTypes.None;
	} else {
		return TableSorcTypes.Asc;
	}
};
