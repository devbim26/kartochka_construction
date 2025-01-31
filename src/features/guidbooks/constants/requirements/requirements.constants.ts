import type { IRequirementsAddAndEditForm, IRequirementsFilterForm } from '../../types/requirements.types';

export const RequirementsFilterFormDefaultValues: IRequirementsFilterForm = {
	region: '',
	requirement: '',
	buildingType: '',
};

export const RequirementsAddFormDefaultValues: IRequirementsAddAndEditForm = {
	region: '',
	construction: '',
	room1: '',
	room2: '',
	buildingType: '',
	standardValidity: '',
	standardShortName: '',
	standardFullName: '',
	airNoiseInsulationIndex: null,
	impactNoiseLevelIndex: null,
	classification: '',
};
