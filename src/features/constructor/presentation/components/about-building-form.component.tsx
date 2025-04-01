import {
	APP_ROUTES,
	Button,
	FormElementLabel,
	Input,
	Select,
	Switch,
	useAppDispatch,
	useAppNavigate,
} from '@core';
import { memoize } from '@core/utils/hoc/memo.utils';
import { CONSTRUCTOR_ROUTES } from '@features/constructor/constants';
import { constructorSlice } from '@features/constructor/store';
import type { AboutBuildingData } from '@features/constructor/types';
import { ConstructorAboutBuildingFormDataConfig } from '@features/constructor/utils';
import {
	RuBuildingTypeSelectValues,
	RuCategoryClassSelectValues,
	RuCountryNamesMap,
	RuCountryNamesSelectValues,
} from '@features/guidbooks/types';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

export const AboutBuildingForm = memoize(() => {
	const form = useForm<AboutBuildingData>({
		defaultValues: ConstructorAboutBuildingFormDataConfig.defaultValues,
	});
	const { register, control, formState } = form;
	const dispatch = useAppDispatch();
	const navigate = useAppNavigate();

	const handleSubmit = () => {
		form.handleSubmit(onSubmit)();
	};

	const onSubmit = (data: AboutBuildingData) => {
		dispatch(constructorSlice.actions.setAboutBuilding(data));
		navigate(APP_ROUTES.designing.route + CONSTRUCTOR_ROUTES.floorPlan.route);
	};

	return (
		<div className="flex flex-col rounded-xl bg-white">
			<div className="flex border-b px-[24px] py-[18px]">
				<p className="font-sans text-lg font-semibold leading-4">О здании</p>
			</div>
			<div className="flex flex-col border-b px-[24px] py-[11px]">
				<FormProvider {...form}>
					<div className="flex flex-col gap-[20px]">
						<Input
							{...register('name')}
							labelClassName={twMerge(
								'font-sans text-sm font-normal leading-5 text-input-label-primary w-[145px]',
								formState.errors.name?.message ? 'text-error' : '',
							)}
							wrapperClassName="flex-row items-center gap-[50px]"
							inputClassName="w-[226px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
							error={formState.errors.name?.message}
							containerClassName="w-[226px]"
							label="Название"
							placeholder="Введите название"
							maxLength={50}
						/>
						<Controller
							control={control}
							name={'region'}
							render={({ field }) => (
								<Select
									options={[
										{
											label: RuCountryNamesMap.None,
											value: RuCountryNamesMap.None,
										},
										...RuCountryNamesSelectValues.filter(
											(reg) => reg.label !== RuCountryNamesMap.None,
										).sort((a, b) => a.label.localeCompare(b.label)),
									]}
									{...field}
									value={field.value || ''}
									label="Регион"
									isSearchable
									labelClassName={twMerge(
										'font-sans text-sm font-normal leading-5 text-input-label-primary w-[145px]',
										formState.errors.region?.message ? 'text-error' : '',
									)}
									placeholder="Выберите регион"
									buttonClassName="w-[226px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] rounded-[8px]"
									wrapperClassname="shadow-none ring-input-border-primary flex-row items-center gap-[50px]"
								/>
							)}
						/>
						<div className="flex items-center gap-x-[50px]">
							<label className="w-[145px] font-sans text-sm font-normal leading-5 text-input-label-primary">
								Тип здания
							</label>
							<div className="flex gap-x-[12px]">
								<Controller
									control={control}
									name="buildingPurpose"
									render={({ field }) => (
										<Select
											options={RuCategoryClassSelectValues}
											{...field}
											value={field.value || ''}
											placeholder="Выберите назначение"
											isSearchable
											buttonClassName="w-[226px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] rounded-[8px]"
											wrapperClassname="shadow-none ring-input-border-primary"
										/>
									)}
								/>
								<Controller
									control={control}
									name="buildingType"
									render={({ field }) => (
										<Select
											options={RuBuildingTypeSelectValues}
											{...field}
											value={field.value || ''}
											placeholder="Выберите тип"
											isSearchable
											buttonClassName="w-[226px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] rounded-[8px]"
											wrapperClassname="shadow-none ring-input-border-primary"
										/>
									)}
								/>
							</div>
						</div>
						<Input
							{...register('maxHeight')}
							labelClassName={twMerge(
								'font-sans text-sm font-normal leading-5 text-input-label-primary w-[170px]',
								formState.errors.name?.message ? 'text-error' : '',
							)}
							wrapperClassName="flex-row items-center gap-[24px]"
							inputClassName="w-[226px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
							error={formState.errors.name?.message}
							containerClassName="w-[226px]"
							label="Наибольшая допустимая высота здания, м"
							type="number"
							placeholder="Введите высоту"
							max={3}
						/>
						<Controller
							control={control}
							name={'comfortClass'}
							render={({ field }) => (
								<Select
									options={RuCategoryClassSelectValues}
									{...field}
									value={field.value || ''}
									label={
										formState.errors?.comfortClass?.message ||
										'Класс комфортности'
									}
									isSearchable
									labelClassName={twMerge(
										'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary w-[145px]',
										formState.errors.comfortClass?.message ? 'text-error' : '',
									)}
									placeholder="Выберите класс"
									buttonClassName="w-[226px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] rounded-[8px]"
									wrapperClassname="shadow-none ring-input-border-primary flex-row items-center gap-[50px]"
								/>
							)}
						/>
						<FormElementLabel className="font-sans text-lg font-semibold leading-6">
							Ввод информации о конструкциях здания
						</FormElementLabel>
						<div className="flex items-center gap-x-[70px]">
							<label className="font-sans text-sm font-semibold leading-6">
								Поэтажные планы (pdf)
							</label>
							<Controller
								control={control}
								name="isFloorPlan"
								render={({ field }) => (
									<Switch
										onChange={(value) => field.onChange(value)}
										wrapperClassName="w-[36px] h-[20px]"
									/>
								)}
							/>
						</div>
						<div className="flex items-center gap-x-[50px]">
							<label className="font-sans text-sm font-semibold leading-6">
								BIM-модель (в разработке)
							</label>
							<Controller
								control={control}
								name="isBim"
								render={({ field }) => (
									<Switch
										onChange={(value) => field.onChange(value)}
										wrapperClassName="w-[36px] h-[20px]"
									/>
								)}
							/>
						</div>
						<div className="flex justify-end px-[16px] py-[13px]">
							<Button
								type={'submit'}
								onClick={handleSubmit}
								className="h-[40px] w-[76px] px-[16px]"
							>
								<p className="font-sans text-sm font-semibold leading-4">Далее</p>
							</Button>
						</div>
					</div>
				</FormProvider>
			</div>
		</div>
	);
}, 'AboutBuildingForm');
