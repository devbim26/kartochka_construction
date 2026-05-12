import { ConstructionPurpose } from '@api-gen';

/** Режим расчёта с главной (карточка «Проектирование») — для фильтра справочника конструкций. */
export const DESIGN_CALCULATION_MODE_STORAGE_KEY = 'designCalculationMode';

const FEATURE_ID_TO_PURPOSE: Record<string, ConstructionPurpose> = {
	'sound-isolation': ConstructionPurpose.Soundproofing,
	'room-acoustics': ConstructionPurpose.Acoustic,
	'heat-isolation': ConstructionPurpose.ThermalInsulation,
};

export function setDesignCalculationModeFromFeatureId(featureId: string): void {
	const purpose = FEATURE_ID_TO_PURPOSE[featureId];
	if (!purpose || typeof window === 'undefined') return;
	try {
		window.sessionStorage.setItem(DESIGN_CALCULATION_MODE_STORAGE_KEY, purpose);
	} catch {
		/* ignore */
	}
}

export function getDesignCalculationConstructionPurpose(): ConstructionPurpose | null {
	if (typeof window === 'undefined') return null;
	try {
		const raw = window.sessionStorage.getItem(DESIGN_CALCULATION_MODE_STORAGE_KEY);
		if (
			raw === ConstructionPurpose.Soundproofing ||
			raw === ConstructionPurpose.Acoustic ||
			raw === ConstructionPurpose.ThermalInsulation
		) {
			return raw;
		}
		return null;
	} catch {
		return null;
	}
}
