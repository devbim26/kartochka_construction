import { Input } from '@core';
import { Controller } from 'react-hook-form';
import { withMemo } from '../../../../../../../non-alias/with-memo.utils';
import {
	HeaderFormsProps,
	IMaterialsAddAndEditForm,
	MaterialsAddAndEditFormKeys,
} from '../../../../../types';

export const MaterialsAddAndEdit = withMemo(
	({ control, setValue }: HeaderFormsProps<IMaterialsAddAndEditForm>) => {
		return (
			<>
				<Controller
					control={control}
					name={MaterialsAddAndEditFormKeys.Name}
					render={({ field }) => (
						<Input
							{...field}
							value={field.value}
							label="Название"
							placeholder="Введите название"
						/>
					)}
				/>
			</>
		);
	},
);
