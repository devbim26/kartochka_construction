import { Input } from '@core';
import { Controller } from 'react-hook-form';
import { withMemo } from '../../../../../../../non-alias';
import { HeaderFormsProps, IMaterialsEditForm, MaterialsEditFormKeys } from '../../../../../types';

export const MaterialsEdit = withMemo(({ control }: HeaderFormsProps<IMaterialsEditForm>) => {
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
