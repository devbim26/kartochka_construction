import {
	Button,
	convertToBase64,
	FormElementLabel,
	Input,
	memoize,
	phoneNumberMask,
	useAppDispatch,
	useAppNavigate,
	useAppSelector,
} from '@core';
import {
	AccountDataConfig,
	ACCOUNT_FETCH_ROUTES,
	ButtonTitles,
	FormTitles,
	getCurrentUser,
	updateUser,
} from '@features';
import type { AccountData } from '@features/account/types/account-data.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMask } from '@react-input/mask';
import { useEffect } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { FormProvider, useForm } from 'react-hook-form';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { TiDeleteOutline } from 'react-icons/ti';
import { useSearchParams } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

const PhoneInput = memoize(
	({
		form,
		index,
		phoneNumber,
		isViewMode,
	}: {
		form: UseFormReturn<AccountData>;
		index: number;
		isViewMode: boolean;
		phoneNumber: { id: string; number: string };
	}) => {
		const phoneRef = useMask(phoneNumberMask);
		const currentValue = form.watch(`phoneNumbers.${index}.number`);

		return (
			<Input
				ref={phoneRef}
				disabled={isViewMode}
				placeholder="+375(__)___-__-__"
				onChange={(e) => form.setValue(`phoneNumbers.${index}.number`, e.target.value)}
				value={currentValue}
				wrapperClassName="flex-row items-center gap-[10px]"
				inputClassName="w-[220px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
				error={form.formState.errors.phoneNumbers?.[index]?.message}
				iconPos="right"
				iconClassName={twMerge(
					isViewMode ? 'invisible' : 'visible',
					'size-[25px] text-error right-[2px]',
				)}
				Icon={TiDeleteOutline}
				onIconClick={() => {
					const updatedPhoneNumbers = form
						.watch('phoneNumbers')
						.filter((ph) => ph.id !== phoneNumber.id);
					form.setValue('phoneNumbers', updatedPhoneNumbers);
				}}
			/>
		);
	},
	'PhoneInput',
);

export const AccountForm = () => {
	const userData = useAppSelector((store) => store.userData);
	const form = useForm<AccountData>({
		resolver: zodResolver(AccountDataConfig.schema),
		defaultValues: AccountDataConfig.defaultValues,
	});

	useEffect(() => {
		if (userData.fetch_data?.fetch_name === ACCOUNT_FETCH_ROUTES.update.fetch_name) {
			dispatch(getCurrentUser());
		}
	}, [userData.fetch_data]);

	useEffect(() => {
		dispatch(getCurrentUser());
	}, []);
	const navigate = useAppNavigate();
	const dispatch = useAppDispatch();
	const [search] = useSearchParams();
	const { register, setValue, watch, formState, trigger } = form;

	const onSubmit = () => {
		dispatch(
			updateUser({
				...form.getValues(),
			}),
		);
		navigate('');
	};

	useEffect(() => {
		userData.data ? form.reset({ ...(userData.data as AccountData) }) : form.reset();
	}, [userData.data]);

	const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
		const file = event.target.files?.[0];
		if (file) {
			const base64 = await convertToBase64(file);
			if (base64 && typeof base64 === 'string') {
				setValue('companyLogo', base64);
				setValue('formFile', file);
			}
			trigger('formFile');
		}
	};

	const [phoneNumbers, logo] = watch(['phoneNumbers', 'companyLogo']);

	return (
		<div className="flex flex-col rounded-xl bg-white">
			<div className="flex border-b px-[24px] py-[18px]">
				<p className="font-sans text-lg font-semibold leading-4">
					{!search.get('edit') ? FormTitles.default : FormTitles.edit}
				</p>
			</div>
			<div className="flex flex-col border-b px-[24px] py-[11px]">
				<FormProvider {...form}>
					<div className="flex flex-col gap-[20px]">
						<Input
							label={formState.errors.companyName?.message || 'Название'}
							labelClassName={twMerge(
								'font-sans text-sm font-normal leading-5 text-input-label-primary w-[145px]',
								formState.errors.companyName?.message ? 'text-error' : '',
							)}
							wrapperClassName="flex-row items-center gap-[10px]"
							inputClassName="w-[220px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
							error={formState.errors.companyName?.message}
							{...form.register('companyName')}
							maxLength={50}
							disabled={!search.get('edit')}
							type={'text'}
							placeholder="Введите название компании"
							max={50}
						/>
						<div className="flex flex-wrap gap-[8px] text-[14px] placeholder:text-input-label-primary">
							<Input
								label={
									formState.errors.mainPhoneNumber?.message || 'Номера телефонов'
								}
								labelClassName={twMerge(
									'font-sans text-sm font-normal leading-5 text-input-label-primary w-[145px]',
									formState.errors.mainPhoneNumber?.message ? 'text-error' : '',
								)}
								wrapperClassName="flex-row items-center gap-[10px]"
								inputClassName="w-[220px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
								error={formState.errors.mainPhoneNumber?.message}
								disabled
								value={watch('mainPhoneNumber')}
								iconPos="right"
								iconClassName={twMerge(
									!search.get('edit') ? 'invisible' : 'visible',
									'size-[25px] text-primary right-[2px]',
								)}
								Icon={phoneNumbers.length < 3 ? AiOutlinePlusCircle : undefined}
								onIconClick={() =>
									form.setValue('phoneNumbers', [
										...phoneNumbers,
										{ id: crypto.randomUUID(), number: '' },
									])
								}
							/>
							<div className="flex gap-[10px]">
								{phoneNumbers &&
									phoneNumbers.map((phoneNumber, index) => (
										<PhoneInput
											key={crypto.randomUUID()}
											form={form}
											index={index}
											phoneNumber={phoneNumber}
											isViewMode={!search.get('edit')}
										/>
									))}
							</div>
						</div>
						<Input
							label={formState.errors.payersRegistrationNumber?.message || 'УНП'}
							labelClassName={twMerge(
								'font-sans text-sm font-normal leading-5 text-input-label-primary w-[145px]',
								formState.errors.payersRegistrationNumber?.message
									? 'text-error'
									: '',
							)}
							disabled={!search.get('edit')}
							wrapperClassName="flex-row items-center gap-[10px]"
							inputClassName="w-[220px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
							error={formState.errors.payersRegistrationNumber?.message}
							{...form.register('payersRegistrationNumber')}
							type={'number'}
							maxLength={9}
							placeholder="Введите УНП"
						/>
						<Input
							label={formState.errors.paymentAccount?.message || 'Расчетный счет'}
							labelClassName={twMerge(
								'font-sans text-sm font-normal leading-5 text-input-label-primary w-[145px]',
								formState.errors.paymentAccount?.message ? 'text-error' : '',
							)}
							disabled={!search.get('edit')}
							wrapperClassName="flex-row items-center gap-[10px]"
							inputClassName="w-[220px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
							error={formState.errors.paymentAccount?.message}
							{...form.register('paymentAccount')}
							type={'text'}
							placeholder="Введите расчетный счет"
							maxLength={20}
						/>
						<Input
							label={formState.errors.bankIdNumber?.message || 'БИК'}
							labelClassName={twMerge(
								'font-sans text-sm font-normal leading-5 text-input-label-primary w-[145px]',
								formState.errors.bankIdNumber?.message ? 'text-error' : '',
							)}
							disabled={!search.get('edit')}
							wrapperClassName="flex-row items-center gap-[10px]"
							inputClassName="w-[220px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
							error={formState.errors.bankIdNumber?.message}
							{...form.register('bankIdNumber')}
							type={'text'}
							placeholder="Введите  БИК"
							max={9}
						/>
						<Input
							label={formState.errors.directorFullName?.message || 'ФИО директора'}
							labelClassName={twMerge(
								'font-sans text-sm font-normal leading-5 text-input-label-primary w-[145px]',
								formState.errors.directorFullName?.message ? 'text-error' : '',
							)}
							disabled={!search.get('edit')}
							wrapperClassName="flex-row items-center gap-[10px]"
							inputClassName="w-[220px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
							error={formState.errors.directorFullName?.message}
							{...form.register('directorFullName')}
							maxLength={50}
							type={'text'}
							placeholder="Введите ФИО"
							max={50}
						/>
						<Input
							label={formState.errors.bankAddress?.message || 'Адрес банка'}
							labelClassName={twMerge(
								'font-sans text-sm font-normal leading-5 text-input-label-primary w-[145px]',
								formState.errors.bankAddress?.message ? 'text-error' : '',
							)}
							disabled={!search.get('edit')}
							wrapperClassName="flex-row items-center gap-[10px]"
							inputClassName="w-[220px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
							error={formState.errors.bankAddress?.message}
							{...form.register('bankAddress')}
							maxLength={100}
							type={'text'}
							placeholder="Введите адрес"
							max={50}
						/>
						<Input
							label={formState.errors.companyAddress?.message || 'Адрес компании'}
							labelClassName={twMerge(
								'font-sans text-sm font-normal leading-5 text-input-label-primary w-[145px]',
								formState.errors.companyAddress?.message ? 'text-error' : '',
							)}
							disabled={!search.get('edit')}
							wrapperClassName="flex-row items-center gap-[10px]"
							inputClassName="w-[220px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
							error={formState.errors.companyAddress?.message}
							{...form.register('companyAddress')}
							maxLength={50}
							type={'text'}
							max={50}
							placeholder="Введите адрес компании"
						/>
						<Input
							{...form.register('compannyInfo')}
							label="Информация о компании"
							labelClassName={twMerge(
								'font-sans text-sm font-normal leading-5 text-input-label-primary w-[145px]',
							)}
							disabled={!search.get('edit')}
							wrapperClassName="flex-row items-center gap-[10px]"
							inputClassName="w-[220px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
							maxLength={100}
							type={'text'}
							max={200}
							placeholder="Введите информацию"
						/>
						<div className="flex flex-row items-center gap-[8px]">
							<FormElementLabel
								className={twMerge(
									'w-[145px] font-sans text-sm font-normal leading-5 text-input-label-primary',
									formState.errors.formFile ? 'text-error' : '',
								)}
							>
								{(formState.errors.formFile?.message as string) ||
									'Логотип компании'}
							</FormElementLabel>
							<div className="flex flex-col items-center gap-[10px]">
								{logo && (
									<div className="flex justify-center self-center">
										<img
											src={logo}
											alt="Превью изображения"
											className="h-[80px] w-[220px] rounded-md object-cover"
										/>
									</div>
								)}
								<Button
									variant="primary"
									type="button"
									disabled={!search.get('edit')}
									className="h-[30px] w-[220px]"
									onClick={() => document.getElementById('file-upload')!.click()}
								>
									Загрузить
								</Button>
								<input
									type="file"
									id="file-upload"
									accept="image/*"
									onChange={handleFileChange}
									className="hidden"
								/>
							</div>
						</div>
					</div>
					<div className="flex justify-end px-[16px] py-[13px]">
						{search.get('edit') ? (
							<Button
								type={'submit'}
								onClick={() => {
									form.handleSubmit(onSubmit)();
								}}
								className="px-[16px]"
							>
								<p className="font-sans text-sm font-semibold leading-4">
									{!search.get('edit') ? ButtonTitles.default : ButtonTitles.edit}
								</p>
							</Button>
						) : (
							<Button
								onClick={() => navigate('', { edit: 'true' })}
								className="px-[16px]"
							>
								<p className="font-sans text-sm font-semibold leading-4">
									{!search.get('edit') ? ButtonTitles.default : ButtonTitles.edit}
								</p>
							</Button>
						)}
					</div>
				</FormProvider>
			</div>
		</div>
	);
};
