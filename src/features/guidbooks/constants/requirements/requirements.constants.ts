import type { Requirement, RequirementFilter } from '../../types/requirements/requirements.types';

export const RequirementsFilterFormDefaultValues: RequirementFilter = {
	region: '',
	construction: '',
	firstPlacementRoom: '',
	secondPlacementRoom: '',
	buildingType: '',
};

export const RequirementsAddFormDefaultValues: Requirement = {
	region: '',
	construction: '',
	class: '',
	firstPlacementRoom: '',
	secondPlacementRoom: '',
	buildingType: '',
	standartValidityPeriod: '',
	standartShortName: '',
	standartFullName: '',
	noizeIsolationIndex: '',
	notice: '',
};
