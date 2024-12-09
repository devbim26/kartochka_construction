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

				{/* <Controller
					control={control}
					name={MaterialsAddFormKeys.sel}
					render={({ field }) => (
						<Select
							{...field}
							value={field.value}
							label="Label"
							options={[
								{
									id: '1',
									value: 'some v',
									label: '1',
								},
								{
									id: '2',
									value: 'some 2',
									label: '2',
								},
							]}
						/>
					)}
				/> */}
			</>
		);
	},
);
