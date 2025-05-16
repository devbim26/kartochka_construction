import { dateMask, FormElementLabel, Input } from '@core';
import type { FormReportSchemaType } from '@features/constructor/utils';
import { useMask } from '@react-input/mask';
import { useFormContext } from 'react-hook-form';

export const GeneralInfoForm = () => {
	const { setValue, control, watch, getValues, register } =
		useFormContext<FormReportSchemaType>();
	const dateRef = useMask(dateMask);
	return (
		<div className="flex w-full justify-between">
			<div className="flex w-full flex-col items-center gap-[30px]">
				<p className="font-sans text-[18px]">Титульный лист</p>
				<div className="flex flex-col items-center justify-center gap-[13px]">
					{/* <div className="flex w-full gap-[10px]">
						<FormElementLabel className="w-[110px] text-input-label-primary">Отчет №</FormElementLabel>
						<Input
							wrapperClassName="flex-row items-center gap-[10px] "
							inputClassName="w-[300px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
							{...register('reportInfoId')}
							type={'number'}
							placeholder="Введите номер отчета"
							max={50}
						/>
					</div> */}
					<div className="flex w-full items-center justify-center gap-[10px]">
						<FormElementLabel className="w-[110px] text-input-label-primary">
							Заказчик
						</FormElementLabel>
						<Input
							wrapperClassName="flex-row items-center gap-[10px]"
							inputClassName="w-[300px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
							{...register('customerName')}
							type={'text'}
							placeholder="Введите заказчика"
							max={50}
						/>
					</div>
					<div className="flex w-full items-center justify-center gap-[10px]">
						<FormElementLabel className="w-[110px] text-input-label-primary">
							Объект
						</FormElementLabel>
						<Input
							wrapperClassName="flex-row items-center gap-[10px]"
							inputClassName="w-[300px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
							{...register('objectDescription')}
							type={'text'}
							placeholder="Введите описание объекта"
							max={50}
						/>
					</div>
					{/* <div className="flex w-full items-center justify-center gap-[10px]">
						<FormElementLabel className="w-[110px]">Проект</FormElementLabel>
						<Input
							wrapperClassName="flex-row items-center gap-[10px]"
							inputClassName="w-[300px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
							{...register('name')}
							type={'number'}
							placeholder="Введите название проекта"
							max={50}
						/>
					</div> */}
					<div className="flex w-full items-center justify-center gap-[10px]">
						<FormElementLabel className="w-[110px] text-input-label-primary">
							Выполнил
						</FormElementLabel>
						<Input
							wrapperClassName="flex-row items-center gap-[10px]"
							inputClassName="w-[300px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
							{...register('creatorFullName')}
							type={'text'}
							placeholder="Введите фамилию инициалы"
							max={50}
						/>
					</div>
					<div className="flex w-full items-center justify-center gap-[10px]">
						<FormElementLabel className="w-[110px] text-input-label-primary">
							Шифр
						</FormElementLabel>
						<Input
							wrapperClassName="flex-row items-center gap-[10px]"
							inputClassName="w-[300px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
							{...register('code')}
							type={'text'}
							placeholder="Введите шифр"
							max={50}
						/>
					</div>
					<div className="flex w-full items-center justify-center gap-[10px]">
						<FormElementLabel className="w-[110px] text-input-label-primary">
							Город
						</FormElementLabel>
						<Input
							wrapperClassName="flex-row items-center gap-[10px]"
							inputClassName="w-[300px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
							{...register('country')}
							type={'text'}
							placeholder="Введите город"
							max={50}
						/>
					</div>
				</div>
				<div className="flex w-full items-center justify-center gap-[10px]">
					<FormElementLabel className="w-[110px] text-primary">Проект</FormElementLabel>
					<Input
						wrapperClassName="flex-row items-center gap-[10px]"
						inputClassName="w-[300px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
						value={watch('objectDescription')}
						disabled
						type={'text'}
						placeholder="Введите название проекта"
						max={50}
					/>
				</div>
			</div>
			<div className="flex w-full flex-col items-center gap-[30px]">
				<p className="font-sans text-[18px]">Протокол</p>
				<div className="flex flex-col items-center justify-center gap-[13px]">
					<div className="flex w-full items-center justify-center gap-[10px]">
						<FormElementLabel className="w-[110px] text-input-label-primary">
							Директор
						</FormElementLabel>
						<Input
							wrapperClassName="flex-row items-center gap-[10px]"
							inputClassName="w-[300px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
							{...register('director')}
							type={'text'}
							placeholder="Введите директора"
							max={50}
						/>
					</div>
					<div className="flex w-full items-center justify-center gap-[10px]">
						<FormElementLabel className="w-[110px] text-input-label-primary">
							Дата
						</FormElementLabel>
						<Input
							onChange={(event) => {
								setValue('date', event.target.value);
							}}
							value={watch('date')}
							inputClassName="w-[300px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
							placeholder="Введите дату"
							max={10}
							ref={dateRef}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};
