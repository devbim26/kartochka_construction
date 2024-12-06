import { Input } from '@core';
import { memo } from 'react';
import { Controller } from 'react-hook-form';
import { HeaderFormsProps, IMaterialsEditForm, MaterialsEditFormKeys } from '../../../../../types';

export const MaterialsEdit = memo(({ control }: HeaderFormsProps<IMaterialsEditForm>) => {
	return (
		<>
			<Controller
				control={control}
				name={MaterialsEditFormKeys.name}
				render={({ field }) => (
					<Input {...field} label="Название" placeholder="Введите название" />
				)}
			/>
		</>
	);
});

MaterialsEdit.displayName = 'MaterialsEdit';
