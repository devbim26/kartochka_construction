export enum BuildingType {
	ResidentialBuildings = 'ResidentialBuildings',
	Hotel = 'Hotel',
	AdministrativeBuildings = 'AdministrativeBuildings',
	Hospital = 'Hospital',
	EducationalInstitutions = 'EducationalInstitutions',
	PreschoolEducationalInstitutions = 'PreschoolEducationalInstitutions',
}

export const RuBuildingTypeNamesMap = {
	ResidentialBuildings: 'Жилые здания',
	Hotel: 'Отель',
	AdministrativeBuildings: 'Административные здания',
	Hospital: 'Больница',
	EducationalInstitutions: 'Образовательные учреждения',
	PreschoolEducationalInstitutions: 'Дошкольные образовательные учреждения',
};

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

export const EnBuildingTypeSelectValues = [
	{ label: 'Residential buildings', value: BuildingType.ResidentialBuildings },
	{ label: 'Hotel', value: BuildingType.Hotel },
	{ label: 'Administrative buildings', value: BuildingType.AdministrativeBuildings },
	{ label: 'Hospital', value: BuildingType.Hospital },
	{ label: 'Educational institutions', value: BuildingType.EducationalInstitutions },
	{
		label: 'Preschool educational institutions',
		value: BuildingType.PreschoolEducationalInstitutions,
	},
];
