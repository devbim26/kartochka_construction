import { Input } from '@core';
import { Controller } from 'react-hook-form';
import { withMemo } from '../../../../../../../non-alias/with-memo.utils';
import { HeaderFormsProps, IMaterialsAddForm, MaterialsAddFormKeys } from '../../../../../types';

export const MaterialsAdd = withMemo(
	({ control, setValue }: HeaderFormsProps<IMaterialsAddForm>) => {
		return (
			<>
				<Controller
					control={control}
					name={MaterialsAddFormKeys.name}
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
