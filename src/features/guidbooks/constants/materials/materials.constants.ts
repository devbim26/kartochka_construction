import { IMaterialsAddForm, IMaterialsEditForm, IMaterialsFilterForm } from '../../types';

export const MaterialsFilterFormDefaultValues: IMaterialsFilterForm = {
	name: 'фильтр',
	materialType: '',
};

export const MaterialsAddFormDefaultValues: IMaterialsAddForm = {
	name: 'добавление',
};

export const MaterialsEditFormDefaultValues: IMaterialsEditForm = {
	name: 'изменение',
};
