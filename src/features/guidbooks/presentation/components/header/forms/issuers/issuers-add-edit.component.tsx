import { Input } from '@core';
import { memoize } from '@core/utils/hoc/memo.utils';
import { Controller } from 'react-hook-form';
import { IssuersAddAndEditFormKeys, type IIssuersAddAndEditForm } from '../../../../../types/issuers.types';
import { FormSubTitle } from '../form-sub-title.components';
import { type HeaderFormsProps } from '../../../../../types';

//потом где надо будут селекты
export const IssuersAddAndEdit = memoize(
	({ control }: HeaderFormsProps<IIssuersAddAndEditForm>) => {
		return (
			<div className="flex flex-col gap-[23px]">
				<div className="flex flex-wrap gap-[23px]">
					<Controller
						control={control}
						name={IssuersAddAndEditFormKeys.Name}
						render={({ field }) => (
							<Input
								{...field}
								labelClassName="font-sans text-sm font-normal leading-5 tracking-[0.1px]"
								inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
								containerClassName="w-[226px]"
								label="Производитель"
								placeholder="Введите производителя"
							/>
						)}
					/>
					<Controller
						control={control}
						name={IssuersAddAndEditFormKeys.WebSite}
						render={({ field }) => (
							<Input
								{...field}
								labelClassName="font-sans text-sm font-normal leading-5 tracking-[0.1px]"
								inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
								containerClassName="w-[226px]"
								label="Сайт"
								placeholder="Введите ссылку"
							/>
						)}
					/>
					<Controller
						control={control}
						name={IssuersAddAndEditFormKeys.Country}
						render={({ field }) => (
							<Input
								{...field}
								value={field.value || ''}
								labelClassName="font-sans text-sm font-normal leading-5 tracking-[0.1px]"
								inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
								containerClassName="w-[226px]"
								label="Страна"
								placeholder="Выберите страну"
							/>
						)}
					/>
					<Controller
						control={control}
						name={IssuersAddAndEditFormKeys.LogoUrl}
						render={({ field: { onChange, value, ...field } }) => (
							<Input
								{...field}
								type="file"
								onChange={(e) => onChange(e.target.files?.[0] || null)}
								containerClassName="w-[226px]"
								label="Логотип"
								placeholder="Выбрать изображение"
							/>
						)}
					/>
				</div>
			</div>
		);
	},
	'IssuersAddAndEdit',
);
