export enum BuildingType {
	ResidentialBuildings = 'ResidentialBuildings',
	Hotel = 'Hotel',
	AdministrativeBuildings = 'AdministrativeBuildings',
	Hospital = 'Hospital',
	EducationalInstitutions = 'EducationalInstitutions',
	PreschoolEducationalInstitutions = 'PreschoolEducationalInstitutions',
}

export const RuBuildingTypeSelectValues = [
	{ label: 'Жилые здания', value: BuildingType.ResidentialBuildings },
	{ label: 'Отель', value: BuildingType.Hotel },
	{ label: 'Административные здания', value: BuildingType.AdministrativeBuildings },
	{ label: 'Больница', value: BuildingType.Hospital },
	{ label: 'Образовательные учреждения', value: BuildingType.EducationalInstitutions },
	{
		label: 'Дошкольные образовательные учреждения',
		value: BuildingType.PreschoolEducationalInstitutions,
	},
];
