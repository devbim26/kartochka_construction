import { Input } from '@core';
import { memoize } from '@core/utils/hoc/memo.utils';
import { Controller } from 'react-hook-form';
import { type HeaderFormsProps } from '../../../../../types';
import { FormSubTitle } from '../form-sub-title.components';
import { RequirementsAddAndEditFormKeys, type IRequirementsAddAndEditForm } from '@features/guidbooks/types/requirements.types';

//потом где-то будут селекты
export const RequirementsAddAndEdit = memoize(
	({ control }: HeaderFormsProps<IRequirementsAddAndEditForm>) => {
		return (
			<div className="flex flex-col gap-[23px]">
				<div className="flex flex-wrap gap-[23px]">
					<Controller
						control={control}
						name={RequirementsAddAndEditFormKeys.Region}
						render={({ field }) => (
							<Input
								{...field}
								labelClassName="font-sans text-sm font-normal leading-5 tracking-[0.1px]"
								inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
								containerClassName="w-[226px]"
								label="Регион"
								placeholder="Введите регион"
							/>
						)}
					/>
					<Controller
						control={control}
						name={RequirementsAddAndEditFormKeys.FirstPlacementRoom}
						render={({ field }) => (
							<Input
								{...field}
								labelClassName="font-sans text-sm font-normal leading-5 tracking-[0.1px]"
								inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
								containerClassName="w-[226px]"
								label="Помещение 1"
								placeholder="Введите помещение 1"
							/>
						)}
					/>
					<Controller
						control={control}
						name={RequirementsAddAndEditFormKeys.SecondPlacementRoom}
						render={({ field }) => (
							<Input
								{...field}
								labelClassName="font-sans text-sm font-normal leading-5 tracking-[0.1px]"
								inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
								containerClassName="w-[226px]"
								label="Помещение 2"
								placeholder="Введите помещение 2"
							/>
						)}
					/>
					<Controller
						control={control}
						name={RequirementsAddAndEditFormKeys.BuildingType}
						render={({ field }) => (
							<Input
								{...field}
								labelClassName="font-sans text-sm font-normal leading-5 tracking-[0.1px]"
								inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
								containerClassName="w-[226px]"
								label="Тип здания"
								placeholder="Введите тип"
							/>
						)}
					/>
					<Controller
						control={control}
						name={RequirementsAddAndEditFormKeys.StandardValidityPeriod}
						render={({ field }) => (
							<Input
								{...field}
								labelClassName="font-sans text-sm font-normal leading-5 tracking-[0.1px]"
								inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
								containerClassName="w-[226px]"
								label="Срок действия стандарта"
								placeholder="Введите срок действия"
							/>
						)}
					/>
					<Controller
						control={control}
						name={RequirementsAddAndEditFormKeys.StandardShortName}
						render={({ field }) => (
							<Input 
								{...field} 
								labelClassName="font-sans text-sm font-normal leading-5 tracking-[0.1px]"
								inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
								containerClassName="w-[226px]"
								label="Название стандарта краткое" 
								placeholder="Введите название стандарта" 
							/>
						)}
					/>
					<Controller
						control={control}
						name={RequirementsAddAndEditFormKeys.StandardFullName}
						render={({ field }) => (
							<Input 
								{...field} 
								labelClassName="font-sans text-sm font-normal leading-5 tracking-[0.1px]"
								inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
								containerClassName="w-[226px]"
								label="Название стандарта полное" 
								placeholder="Введите название стандарта" 
							/>
						)}
					/>
					<Controller
						control={control}
						name={RequirementsAddAndEditFormKeys.NoizeIsolationIndex}
						render={({ field }) => (
							<Input 
								{...field} 
								labelClassName="font-sans text-sm font-normal leading-5 tracking-[0.1px]"
								inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
								containerClassName="w-[226px]"
								type="number" 
								min={0}
								value={field.value || ''}
								label="Индекс изоляции воздушного шума" 
								placeholder="Введите индекс" 
							/>
						)}
					/>
					<Controller
						control={control}
						name={RequirementsAddAndEditFormKeys.NoizeImpactIndex}
						render={({ field }) => (
							<Input 
								{...field} 
								labelClassName="font-sans text-sm font-normal leading-5 tracking-[0.1px]"
								inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
								containerClassName="w-[226px]"
								type="number"
								min={0} 
								value={field.value || ''}
								label="Индекс приведённого уровня ударного шума" 
								placeholder="Введите индекс" 
							/>
						)}
					/>
					<Controller
						control={control}
						name={RequirementsAddAndEditFormKeys.Class}
						render={({ field }) => (
							<Input 
								{...field} 
								labelClassName="font-sans text-sm font-normal leading-5 tracking-[0.1px]"
								inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
								containerClassName="w-[226px]"
								label="Класс" 
								placeholder="Введите класс" 
							/>
						)}
					/>
					<Controller
						control={control}
						name={RequirementsAddAndEditFormKeys.Notice}
						render={({ field }) => (
							<Input 
								{...field} 
								labelClassName="font-sans text-sm font-normal leading-5 tracking-[0.1px]"
								inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
								containerClassName="w-[226px]"
								label="Примечание" 
								placeholder="Введите примечание" 
							/>
						)}
					/>
				</div>
			</div>
		);
	},
	'RequirementsAddAndEdit',
);
