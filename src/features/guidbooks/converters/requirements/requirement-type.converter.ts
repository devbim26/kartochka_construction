import { RequirementType } from '@api-gen';
import { createDataRecordConverter } from '@core/utils';
import { RequirementType as ClientRequirementType } from '@features/guidbooks/types';

const requirementTypeEnumMap = createDataRecordConverter({
	[ClientRequirementType.Calculation]: RequirementType.Calculation,
	[ClientRequirementType.Regulatory]: RequirementType.Regulatory,
});
export const convertToServerRequirementType = (type: ClientRequirementType): RequirementType => {
	return requirementTypeEnumMap.toServer[type];
};

export const convertToClientRequirementType = (type: RequirementType): ClientRequirementType => {
	return requirementTypeEnumMap.toClient[type];
};
