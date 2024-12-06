import { Input } from '@core';
import { memo } from 'react';
import { Controller } from 'react-hook-form';
import { HeaderFormsProps, IMaterialsAddForm, MaterialsAddFormKeys } from '../../../../../types';

export const MaterialsAdd = memo(({ control }: HeaderFormsProps<IMaterialsAddForm>) => {
	return (
		<>
			<Controller
				control={control}
				name={MaterialsAddFormKeys.name}
				render={({ field }) => (
					<Input {...field} label="Название" placeholder="Введите название" />
				)}
			/>
		</>
	);
});

MaterialsAdd.displayName = 'MaterialsAdd';
