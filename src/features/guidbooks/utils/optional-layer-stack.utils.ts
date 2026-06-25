/** Порядок от внешнего слоя к внутреннему — удалять можно только первый заполненный. */
export const isOutermostRemovableOptionalLayer = (
	positionId: string,
	hasPosition: (id: string) => boolean,
	outerToInnerOrder: readonly string[],
): boolean => {
	for (const id of outerToInnerOrder) {
		if (hasPosition(id)) {
			return positionId === id;
		}
	}
	return false;
};

export const CLADDING_OPTIONAL_OUTER_TO_INNER = ['6', '5'] as const;

export const BASE_TOP_OUTER_TO_INNER = ['0', '1'] as const;

export const BASE_BOTTOM_OUTER_TO_INNER = ['6', '5'] as const;

/** Симметричная база вокруг центра (поз. 2): сверху 0→1, снизу 4→3. */
export const CENTER_TOP_OUTER_TO_INNER = ['0', '1'] as const;

export const CENTER_BOTTOM_OUTER_TO_INNER = ['4', '3'] as const;

export const FRAME_PARTITION_TOP_OUTER_TO_INNER = ['0', '1'] as const;

export const FRAME_PARTITION_BOTTOM_OUTER_TO_INNER = ['8', '7'] as const;

export const FRAME_PARTITION_DOUBLE_BOTTOM_OUTER_TO_INNER = ['10', '9'] as const;
