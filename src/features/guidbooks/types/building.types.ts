export enum BuildingType {
	ResidentialBuildings = 'ResidentialBuildings',
	Hotel = 'Hotel',
	AdministrativeBuildings = 'AdministrativeBuildings',
	Hospital = 'Hospital',
	EducationalInstitutions = 'EducationalInstitutions',
	PreschoolEducationalInstitutions = 'PreschoolEducationalInstitutions',
	ResearchAndPublicBuildings = 'ResearchAndPublicBuildings',
	BowlingAlleys = 'BowlingAlleys',
}

export const RuBuildingTypeNamesMap = {
	ResidentialBuildings: 'Жилые здания',
	Hotel: 'Отель',
	AdministrativeBuildings: 'Административные здания',
	Hospital: 'Больницы',
	EducationalInstitutions: 'Учреждения образования',
	PreschoolEducationalInstitutions: 'Учреждения дошкольного образования',
	ResearchAndPublicBuildings: 'Научно-исследовательские и общественные здания',
	BowlingAlleys: 'Помещения кегельбанов',
};

export const RuBuildingTypeSelectValues = [
	{ label: 'Жилые здания', value: BuildingType.ResidentialBuildings },
	{ label: 'Отель', value: BuildingType.Hotel },
	{ label: 'Административные здания', value: BuildingType.AdministrativeBuildings },
	{ label: 'Больницы', value: BuildingType.Hospital },
	{ label: 'Учреждения образования', value: BuildingType.EducationalInstitutions },
	{
		label: 'Учреждения дошкольного образования',
		value: BuildingType.PreschoolEducationalInstitutions,
	},
	{
		label: 'Научно-исследовательские и общественные здания',
		value: BuildingType.ResearchAndPublicBuildings,
	},
	{ label: 'Помещения кегельбанов', value: BuildingType.BowlingAlleys },
];

export const EnBuildingTypeSelectValues = [
	{ label: 'Residential buildings', value: BuildingType.ResidentialBuildings },
	{ label: 'Hotel', value: BuildingType.Hotel },
	{ label: 'Administrative buildings', value: BuildingType.AdministrativeBuildings },
	{ label: 'Hospitals', value: BuildingType.Hospital },
	{ label: 'Educational institutions', value: BuildingType.EducationalInstitutions },
	{
		label: 'Preschool educational institutions',
		value: BuildingType.PreschoolEducationalInstitutions,
	},
	{
		label: 'Research and public buildings',
		value: BuildingType.ResearchAndPublicBuildings,
	},
	{ label: 'Bowling alleys', value: BuildingType.BowlingAlleys },
];
