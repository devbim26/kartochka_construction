import type { Requirement, RequirementFilter } from '../../types/requirements/requirements.types';

export const RequirementsFilterFormDefaultValues: RequirementFilter = {
	region: '',
	constructionType: '',
	firstPlacementRoom: '',
	secondPlacementRoom: '',
	buildingType: '',
};

export const RequirementsAddFormDefaultValues: Requirement = {
	region: '',
	constructionType: '',
	class: '',
	firstPlacementRoom: '',
	secondPlacementRoom: '',
	buildingType: '',
	standartValidityPeriod: '',
	standartShortName: '',
	standartFullName: '',
	noizeIsolationIndex: '',
	noizeImpactIndex: '',
	notice: '',
};
