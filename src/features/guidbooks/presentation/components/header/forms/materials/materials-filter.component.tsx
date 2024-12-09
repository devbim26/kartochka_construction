import { Input } from '@core';
import { Controller } from 'react-hook-form';
import { withMemo } from '../../../../../../../non-alias';
import {
	HeaderFormsProps,
	IMaterialsFilterForm,
	MaterialsFilterFormKeys,
} from '../../../../../types';

export const MaterialsFilter = withMemo(({ control }: HeaderFormsProps<IMaterialsFilterForm>) => {
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
