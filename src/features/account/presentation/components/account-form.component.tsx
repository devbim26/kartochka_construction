import {
	Button,
	convertToBase64,
	FormElementLabel,
	Input,
	phoneNumberMask,
	useAppDispatch,
} from '@core';
import { AccountDataConfig, ButtonTitles, fileUpload, FormTitles, updateUser } from '@features';
import type { AccountData } from '@features/account/types/account-data.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMask } from '@react-input/mask';
import { useEffect, useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { FormProvider, useForm } from 'react-hook-form';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { TiDeleteOutline } from 'react-icons/ti';
import { twMerge } from 'tailwind-merge';

const PhoneInput = ({
	form,
	index,
	phoneNumber,
}: {
	form: UseFormReturn<AccountData>;
	index: number;
	phoneNumber: { id: string; number: string };
}) => {
	const phoneRef = useMask(phoneNumberMask);
	return (
		<Input
			key={phoneNumber.id}
			ref={phoneRef}
			placeholder="+375 (__) ___-__-__"
			onChange={(e) => form.setValue(`phoneNumbers.${index}.number`, e.target.value)}
			wrapperClassName="flex-row items-center gap-[10px]"
			inputClassName="w-[220px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
			error={form.formState.errors.phoneNumbers?.[index]?.message}
			iconPos="right"
			iconClassName="size-[25px] text-error right-[2px]"
			Icon={TiDeleteOutline}
			onIconClick={() => {
				const updatedPhoneNumbers = form
					.watch('phoneNumbers')
					.filter((ph) => ph.id !== phoneNumber.id);
				form.setValue('phoneNumbers', updatedPhoneNumbers);
			}}
		/>
	);
};

export const AccountForm = () => {
	const [isViewMode, setIsViewMode] = useState(true);
	const [preview, setPreview] = useState<string | null>(null);

	const form = useForm<AccountData>({
		resolver: zodResolver(AccountDataConfig.schema),
		defaultValues: AccountDataConfig.defaultValues,
	});

	const dispatch = useAppDispatch();
	const { register, setValue, watch, formState } = form;

	const onSubmit = () => {
		console.log(123);
		dispatch(
			updateUser({
				...form.getValues(),
			}),
		);
	};

	const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
		const file = event.target.files?.[0];
		if (file) {
			const base64 = await convertToBase64(file);
			const fileData = await file.arrayBuffer();
			if (base64) {
				setPreview(String(base64));
				dispatch(
					fileUpload({
						data: { mimeType: file.type, isPublic: true },
						file: fileData,
					}),
				);
				form.setValue('companyLogo', '123');
			}
		}
	};

	useEffect(() => {
		setValue('mainPhoneNumber', '+375(33)-606-13-82');
	}, []);

	const handleClick = () => {
		setIsViewMode(!isViewMode);
	};

	const [phoneNumbers, logo] = watch(['phoneNumbers', 'companyLogo']);

	return (
		<div className="flex flex-col rounded-xl bg-white">
			<div className="flex border-b px-[24px] py-[18px]">
				<p className="font-sans text-lg font-semibold leading-4">
					{isViewMode ? FormTitles.default : FormTitles.edit}
				</p>
			</div>
			<div className="flex flex-col border-b px-[24px] py-[11px]">
				<FormProvider {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
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
								type={'text'}
								placeholder="Введите название компании"
							/>
							<div className="flex flex-wrap gap-[8px] text-[14px] placeholder:text-input-label-primary">
								<Input
									label={
										formState.errors.mainPhoneNumber?.message ||
										'Номера телефонов'
									}
									labelClassName={twMerge(
										'font-sans text-sm font-normal leading-5 text-input-label-primary w-[145px]',
										formState.errors.mainPhoneNumber?.message
											? 'text-error'
											: '',
									)}
									wrapperClassName="flex-row items-center gap-[10px]"
									inputClassName="w-[220px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
									error={formState.errors.mainPhoneNumber?.message}
									disabled
									defaultValue={watch('mainPhoneNumber') || '+375(33)-606-13-82'}
									iconPos="right"
									iconClassName="size-[25px] text-primary right-[2px]"
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
								wrapperClassName="flex-row items-center gap-[10px]"
								inputClassName="w-[220px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
								error={formState.errors.payersRegistrationNumber?.message}
								{...form.register('payersRegistrationNumber')}
								type={'number'}
								placeholder="Введите УНП"
							/>
							<Input
								label={formState.errors.paymentAccount?.message || 'Расчетный счет'}
								labelClassName={twMerge(
									'font-sans text-sm font-normal leading-5 text-input-label-primary w-[145px]',
									formState.errors.paymentAccount?.message ? 'text-error' : '',
								)}
								wrapperClassName="flex-row items-center gap-[10px]"
								inputClassName="w-[220px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
								error={formState.errors.paymentAccount?.message}
								{...form.register('paymentAccount')}
								type={'text'}
								placeholder="Введите расчетный счет"
							/>
							<Input
								label={formState.errors.bankIdNumber?.message || 'БИК'}
								labelClassName={twMerge(
									'font-sans text-sm font-normal leading-5 text-input-label-primary w-[145px]',
									formState.errors.bankIdNumber?.message ? 'text-error' : '',
								)}
								wrapperClassName="flex-row items-center gap-[10px]"
								inputClassName="w-[220px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
								error={formState.errors.bankIdNumber?.message}
								{...form.register('bankIdNumber')}
								type={'number'}
								placeholder="Введите  БИК"
							/>
							<Input
								label={
									formState.errors.directorFullName?.message || 'ФИО директора'
								}
								labelClassName={twMerge(
									'font-sans text-sm font-normal leading-5 text-input-label-primary w-[145px]',
									formState.errors.directorFullName?.message ? 'text-error' : '',
								)}
								wrapperClassName="flex-row items-center gap-[10px]"
								inputClassName="w-[220px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
								error={formState.errors.directorFullName?.message}
								{...form.register('directorFullName')}
								maxLength={50}
								type={'text'}
								placeholder="Введите ФИО"
							/>
							<Input
								label={formState.errors.bankAddress?.message || 'Адрес банка'}
								labelClassName={twMerge(
									'font-sans text-sm font-normal leading-5 text-input-label-primary w-[145px]',
									formState.errors.bankAddress?.message ? 'text-error' : '',
								)}
								wrapperClassName="flex-row items-center gap-[10px]"
								inputClassName="w-[220px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
								error={formState.errors.bankAddress?.message}
								{...form.register('bankAddress')}
								maxLength={100}
								type={'text'}
								placeholder="Введите адрес"
							/>
							<Input
								label={formState.errors.companyAddress?.message || 'Адрес компании'}
								labelClassName={twMerge(
									'font-sans text-sm font-normal leading-5 text-input-label-primary w-[145px]',
									formState.errors.companyAddress?.message ? 'text-error' : '',
								)}
								wrapperClassName="flex-row items-center gap-[10px]"
								inputClassName="w-[220px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
								error={formState.errors.companyAddress?.message}
								{...form.register('companyAddress')}
								maxLength={50}
								type={'text'}
								placeholder="Введите адрес компании"
							/>
							<Input
								{...form.register('compannyInfo')}
								label="Информация о компании"
								labelClassName={twMerge(
									'font-sans text-sm font-normal leading-5 text-input-label-primary w-[145px]',
								)}
								wrapperClassName="flex-row items-center gap-[10px]"
								inputClassName="w-[220px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
								maxLength={100}
								type={'text'}
								placeholder="Введите информацию"
							/>
							<div className="flex flex-row items-center gap-[8px]">
								<FormElementLabel
									className={twMerge(
										'w-[145px] font-sans text-sm font-normal leading-5 text-input-label-primary',
										formState.errors.companyLogo ? 'text-error' : '',
									)}
								>
									{formState.errors.companyLogo?.message || 'Логотип компании'}
								</FormElementLabel>
								<div className="flex flex-col items-center gap-[10px]">
									{preview && (
										<div className="flex justify-center self-center">
											<img
												src={preview}
												alt="Превью изображения"
												className="h-[80px] w-[220px] rounded-md object-cover"
											/>
										</div>
									)}
									<Button
										variant="primary"
										type="button"
										className="h-[30px] w-[220px]"
										onClick={() =>
											document.getElementById('file-upload')!.click()
										}
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
							<Button
								type={isViewMode ? 'button' : 'submit'}
								onClick={handleClick}
								className="px-[16px]"
							>
								<p className="font-sans text-sm font-semibold leading-4">
									{isViewMode ? ButtonTitles.default : ButtonTitles.edit}
								</p>
							</Button>
						</div>
					</form>
				</FormProvider>
			</div>
		</div>
	);
};
