import { Input } from '@core';
import { memo } from 'react';
import { Controller } from 'react-hook-form';
import {
	HeaderFormsProps,
	IMaterialsFilterForm,
	MaterialsFilterFormKeys,
} from '../../../../../types';

export const MaterialsFilter = memo(({ control }: HeaderFormsProps<IMaterialsFilterForm>) => {
	return (
		<Controller
			control={control}
			name={MaterialsFilterFormKeys.name}
			render={({ field }) => (
				<Input {...field} label="Название" placeholder="Введите название" />
			)}
		/>
	);
});

MaterialsFilter.displayName = 'MaterialsFilter';
