import { IMaterialsAddForm, IMaterialsEditForm, IMaterialsFilterForm } from '../../types';

export const MaterialsFilterFormDefaultValues: IMaterialsFilterForm = {
	name: '',
	materialType: '',
};

export const MaterialsAddFormDefaultValues: IMaterialsAddForm = {
	name: 'добавление',
	sel: {
		id: '1',
		value: 'some v',
		label: '1',
	},
};

export const MaterialsEditFormDefaultValues: IMaterialsEditForm = {
	name: 'изменение',
};
