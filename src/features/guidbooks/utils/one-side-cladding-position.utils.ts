import {
	multiLayerBottomCladdingInitialRows,
	multiLayerTopCladdingInitialRows,
} from '@features/guidbooks/constants/constructions/multi-layer-vertical-cladding.defaults';
import type { UseFormGetValues, UseFormSetValue } from 'react-hook-form';
import {
	normalizeBottomCladdingLayers,
	normalizeTopCladdingLayers,
	type CladdingMaterialRow,
} from './cladding-layer-normalization.utils';

export type OneSideCladdingPosition = 'Left' | 'Right';

const hasCladdingRows = (layers?: unknown[] | null): boolean =>
	Array.isArray(layers) && layers.length > 0;

export const detectOneSideCladdingPosition = (
	left?: unknown[] | null,
	right?: unknown[] | null,
	defaultPosition: OneSideCladdingPosition = 'Right',
): OneSideCladdingPosition => {
	const hasLeft = hasCladdingRows(left);
	const hasRight = hasCladdingRows(right);

	if (hasLeft && !hasRight) {
		return 'Left';
	}
	if (hasRight && !hasLeft) {
		return 'Right';
	}

	return defaultPosition;
};

export const moveCladdingToOneSide = (
	cladding: CladdingMaterialRow[],
	target: OneSideCladdingPosition,
): CladdingMaterialRow[] => {
	if (!cladding.length) {
		return [];
	}

	return target === 'Left'
		? normalizeTopCladdingLayers(cladding)
		: normalizeBottomCladdingLayers(cladding);
};

export const switchOneSideCladdingPosition = (
	setValue: UseFormSetValue<any>,
	getValues: UseFormGetValues<any>,
	current: OneSideCladdingPosition,
	next: OneSideCladdingPosition,
) => {
	if (current === next) {
		return;
	}

	const left = (getValues('constructionTypeObject.leftConstruction') ??
		[]) as CladdingMaterialRow[];
	const right = (getValues('constructionTypeObject.rightConstruction') ??
		[]) as CladdingMaterialRow[];
	const source = current === 'Left' ? left : right;
	const converted = moveCladdingToOneSide(source, next);

	if (next === 'Left') {
		setValue('constructionTypeObject.leftConstruction', converted);
		setValue('constructionTypeObject.rightConstruction', []);
	} else {
		setValue('constructionTypeObject.rightConstruction', converted);
		setValue('constructionTypeObject.leftConstruction', []);
	}
};

export const ensureOneSideCladdingInitialized = (
	setValue: UseFormSetValue<any>,
	getValues: UseFormGetValues<any>,
	defaultPosition: OneSideCladdingPosition,
): OneSideCladdingPosition => {
	const left = getValues('constructionTypeObject.leftConstruction');
	const right = getValues('constructionTypeObject.rightConstruction');
	const position = detectOneSideCladdingPosition(left, right, defaultPosition);

	if (hasCladdingRows(left) || hasCladdingRows(right)) {
		return position;
	}

	const initialRows =
		position === 'Left'
			? multiLayerTopCladdingInitialRows()
			: multiLayerBottomCladdingInitialRows();

	setValue(
		position === 'Left'
			? 'constructionTypeObject.leftConstruction'
			: 'constructionTypeObject.rightConstruction',
		initialRows,
		{ shouldDirty: false },
	);

	return position;
};
