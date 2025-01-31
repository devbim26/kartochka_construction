import {
	Button,
	convertToBase64,
	FormElementLabel,
	Input,
	phoneNumberMask,
	useAppDispatch,
} from '@core';
import { AccountDataConfig, ButtonTitles, fileUpload, FormTitles, updateUser } from '@features';
import { AccountData } from '@features/account/types/account-data.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMask } from '@react-input/mask';
import { useEffect, useState } from 'react';
import { FormProvider, useForm, useFormContext, UseFormReturn } from 'react-hook-form';
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
			label={form.formState.errors.phoneNumbers?.[index]?.number?.message || 'Номер телефона'}
			labelClassName={
				form.formState.errors.phoneNumbers?.[index]?.number?.message ? 'text-error' : ''
			}
			ref={phoneRef}
			placeholder="+375 (__) ___-__-__"
			onChange={(e) => form.setValue(`phoneNumbers.${index}.number`, e.target.value)}
			error={form.formState.errors.phoneNumbers?.[index]?.message}
			iconPos="right"
			iconClassName="w-[40px] h-[40px] text-error right-[2px]"
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
			form.setValue('companyLogo.name', file.name);
			const base64 = await convertToBase64(file);
			const fileData = await file.arrayBuffer();
			if (base64) {
				form.setValue('companyLogo.data', base64);
				dispatch(
					fileUpload({
						data: { mimeType: file.type, isPublic: true },
						file: fileData,
					}),
				);
				form.setValue('companyLogo.url', '123');
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
			<div className="flex border-b-[1px] px-[24px] py-[18px]">
				<p className="font-sans text-lg font-semibold leading-4">
					{isViewMode ? FormTitles.default : FormTitles.edit}
				</p>
			</div>
			<div className="flex flex-col border-b-[1px] px-[24px] py-[11px]">
				<FormProvider {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<div className="flex flex-col gap-[20px]">
							<div className="flex flex-col gap-[8px] text-[14px] placeholder:text-input-label-primary">
								<Input
									label={
										formState.errors.mainPhoneNumber?.message ||
										'Номера телефонов'
									}
									labelClassName={
										formState.errors.mainPhoneNumber?.message
											? 'text-error'
											: ''
									}
									error={formState.errors.mainPhoneNumber?.message}
									disabled
									defaultValue={watch('mainPhoneNumber') || '+375(33)-606-13-82'}
									iconPos="right"
									iconClassName="w-[40px] h-[40px] text-primary right-[2px]"
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
								label={formState.errors.companyName?.message || 'Название компании'}
								labelClassName={
									formState.errors.companyName?.message ? 'text-error' : ''
								}
								error={formState.errors.companyName?.message}
								{...form.register('companyName')}
								maxLength={50}
								type={'text'}
								placeholder="Введите название компании"
							/>
							<Input
								label={
									formState.errors.directorFullName?.message || 'ФИО директора'
								}
								labelClassName={
									formState.errors.directorFullName?.message ? 'text-error' : ''
								}
								error={formState.errors.directorFullName?.message}
								{...form.register('directorFullName')}
								maxLength={50}
								type={'text'}
								placeholder="Введите ФИО"
							/>
							<Input
								label={formState.errors.companyAddress?.message || 'Адрес компании'}
								labelClassName={
									formState.errors.companyAddress?.message ? 'text-error' : ''
								}
								error={formState.errors.companyAddress?.message}
								{...form.register('companyAddress')}
								maxLength={50}
								type={'text'}
								placeholder="Введите адрес компании"
							/>
							<Input
								label={formState.errors.payersRegistrationNumber?.message || 'УНП'}
								labelClassName={
									formState.errors.payersRegistrationNumber?.message
										? 'text-error'
										: ''
								}
								error={formState.errors.payersRegistrationNumber?.message}
								{...form.register('payersRegistrationNumber')}
								type={'number'}
								placeholder="Введите УНП"
							/>
							<Input
								label={formState.errors.paymentAccount?.message || 'Расчетный счет'}
								labelClassName={
									formState.errors.paymentAccount?.message ? 'text-error' : ''
								}
								error={formState.errors.paymentAccount?.message}
								{...form.register('paymentAccount')}
								type={'text'}
								placeholder="Введите расчетный счет"
							/>
							<Input
								label={formState.errors.bankIdNumber?.message || 'БИК'}
								labelClassName={
									formState.errors.bankIdNumber?.message ? 'text-error' : ''
								}
								error={formState.errors.bankIdNumber?.message}
								{...form.register('bankIdNumber')}
								type={'number'}
								placeholder="Введите  БИК"
							/>

							<Input
								label={formState.errors.bankAddress?.message || 'Адрес банка'}
								labelClassName={
									formState.errors.bankAddress?.message ? 'text-error' : ''
								}
								error={formState.errors.bankAddress?.message}
								{...form.register('bankAddress')}
								maxLength={100}
								type={'text'}
								placeholder="Введите адрес"
							/>
							<div className="flex flex-col gap-[8px]">
								<FormElementLabel
									className={twMerge(
										'font-raleway text-[14px] text-input-label-primary',
										formState.errors.companyLogo?.url ? 'text-error' : '',
									)}
								>
									{formState.errors.companyLogo?.url?.message ||
										'Логотип компании'}
								</FormElementLabel>
								<div className="flex items-center gap-[10px]">
									<Button
										variant="primary"
										className="h-[36px] w-[168px]"
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
									<p>{logo.name}</p>
								</div>
							</div>
							<Input
								{...form.register('compannyInfo')}
								label="Информация о компании"
								maxLength={100}
								type={'text'}
								placeholder="Введите информацию"
							/>
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
