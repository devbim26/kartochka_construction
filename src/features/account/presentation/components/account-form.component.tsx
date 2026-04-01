import {
	accountMask,
	Button,
	convertToBase64,
	FormElementLabel,
	Input,
	phoneNumberMask,
	useAppDispatch,
	useAppNavigate,
	useAppSelector,
	useI18n,
} from '@core';
import { ACCOUNT_FETCH_ROUTES } from '@features/account/constants';
import { getCurrentUser, updateUser } from '@features/account/services';
import type { AccountData } from '@features/account/types';
import { AccountDataConfig } from '@features/account/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMask } from '@react-input/mask';
import { useEffect } from 'react';
import type { FieldErrors } from 'react-hook-form';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { TiDeleteOutline } from 'react-icons/ti';
import { useSearchParams } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

const PhoneInput = ({
	index,
	phoneNumber,
	isViewMode,
}: {
	index: number;
	isViewMode: boolean;
	phoneNumber: { id: string; number: string };
}) => {
	const { setValue, watch, formState } = useFormContext();
	const phoneRef = useMask(phoneNumberMask);
	const currentValue = watch(`phoneNumbers.${index}.number`);

	const errors = formState.errors as FieldErrors<{
		phoneNumbers: { number: { message: string } }[];
	}>;

	return (
		<Input
			ref={phoneRef}
			disabled={isViewMode}
			placeholder="+375(__)___-__-__"
			onChange={(e) => setValue(`phoneNumbers.${index}.number`, e.target.value)}
			value={currentValue}
			wrapperClassName="flex-row items-center gap-[10px]"
			inputClassName="w-[220px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
			iconPos="right"
			iconClassName={twMerge(
				isViewMode ? 'invisible' : 'visible',
				'size-[25px] text-error right-[2px]',
			)}
			Icon={TiDeleteOutline}
			onIconClick={() => {
				const updatedPhoneNumbers = watch('phoneNumbers').filter(
					(ph: { id: string }) => ph.id !== phoneNumber.id,
				);
				setValue('phoneNumbers', updatedPhoneNumbers);
			}}
			labelClassName={twMerge(
				'font-sans text-sm font-normal leading-5 text-input-label-primary w-[145px]',
				errors.phoneNumbers?.[index]?.number ? 'text-error' : '',
			)}
			error={errors.phoneNumbers?.[index]?.number?.message as string | undefined}
		/>
	);
};

export const PhoneNumbersList = ({ isViewMode }: { isViewMode: boolean }) => {
	const { watch } = useFormContext();
	const phoneNumbers = watch('phoneNumbers');

	return (
		<>
			{phoneNumbers.map((phoneNumber: { number: string; id: string }, index: number) => (
				<PhoneInput
					key={phoneNumber.id}
					index={index}
					phoneNumber={phoneNumber}
					isViewMode={isViewMode}
				/>
			))}
		</>
	);
};

export const AccountForm = () => {
	const { t } = useI18n();
	const accountRef = useMask(accountMask);
	const userData = useAppSelector((store) => store.userData);
	const form = useForm<AccountData>({
		resolver: zodResolver(AccountDataConfig.schema),
		defaultValues: AccountDataConfig.defaultValues,
	});

	const navigate = useAppNavigate();
	const dispatch = useAppDispatch();
	const [search] = useSearchParams();

	useEffect(() => {
		if (userData.fetch_data?.fetch_name === ACCOUNT_FETCH_ROUTES.update.fetch_name) {
			dispatch(getCurrentUser());
		}
	}, [userData.fetch_data, dispatch]);

	useEffect(() => {
		dispatch(getCurrentUser());
	}, [dispatch]);
	const { setValue, watch, formState, trigger, reset } = form;

	const onSubmit = () => {
		dispatch(
			updateUser({
				...form.getValues(),
			}),
		);
		navigate('');
	};

	useEffect(() => {
		userData.data ? reset({ ...(userData.data as AccountData) }) : reset();
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

	const phoneNumbers = watch('phoneNumbers');
	const logo = watch('companyLogo');

	return (
		<div className="flex flex-col rounded-xl bg-white">
			<div className="flex border-b px-[24px] py-[18px]">
				<p className="font-sans text-lg font-semibold leading-4">
					{!search.get('edit') ? t('account.form.title') : t('account.form.titleEdit')}
				</p>
			</div>
			<div className="flex flex-col border-b px-[24px] py-[11px]">
				<FormProvider {...form}>
					<div className="flex flex-col gap-[20px]">
						<Input
							label={formState.errors.companyName?.message || t('account.form.companyName.label')}
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
							placeholder={t('account.form.companyName.placeholder')}
							max={50}
						/>
						<div className="flex flex-wrap gap-[8px] text-[14px] placeholder:text-input-label-primary">
							<Input
								label={
									formState.errors.mainPhoneNumber?.message || t('account.form.phoneNumbers.label')
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
								onIconClick={() => {
									const updatedPhoneNumbers = [
										...phoneNumbers,
										{ id: String(phoneNumbers.length), number: '' },
									];
									setValue('phoneNumbers', updatedPhoneNumbers);
								}}
							/>
							<div className="flex gap-[10px]">
								{phoneNumbers && (
									<PhoneNumbersList isViewMode={!search.get('edit')} />
								)}
							</div>
						</div>
						<Input
							label={formState.errors.payersRegistrationNumber?.message || t('account.form.unp.label')}
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
							placeholder={t('account.form.unp.placeholder')}
						/>
						<Input
							label={formState.errors.paymentAccount?.message || t('account.form.paymentAccount.label')}
							value={form.watch('paymentAccount')}
							labelClassName={twMerge(
								'font-sans text-sm font-normal leading-5 text-input-label-primary w-[145px]',
								formState.errors.paymentAccount?.message ? 'text-error' : '',
							)}
							disabled={!search.get('edit')}
							wrapperClassName="flex-row items-center gap-[10px]"
							inputClassName="w-[220px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
							error={formState.errors.paymentAccount?.message}
							type={'text'}
							placeholder={t('account.form.paymentAccount.placeholder')}
							maxLength={28}
							{...form.register('paymentAccount')}
						/>
						<Input
							label={formState.errors.bankIdNumber?.message || t('account.form.bik.label')}
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
							placeholder={t('account.form.bik.placeholder')}
							maxLength={8}
						/>
						<Input
							label={formState.errors.directorFullName?.message || t('account.form.directorFullName.label')}
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
							placeholder={t('account.form.directorFullName.placeholder')}
							max={50}
						/>
						<Input
							label={formState.errors.bankAddress?.message || t('account.form.bankAddress.label')}
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
							placeholder={t('account.form.bankAddress.placeholder')}
							max={50}
						/>
						<Input
							label={formState.errors.companyAddress?.message || t('account.form.companyAddress.label')}
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
							placeholder={t('account.form.companyAddress.placeholder')}
						/>
						<Input
							{...form.register('compannyInfo')}
							labelClassName={twMerge(
								'font-sans text-sm font-normal leading-5 text-input-label-primary w-[145px]',

								formState.errors.compannyInfo?.message ? 'text-error' : '',
							)}
							disabled={!search.get('edit')}
							wrapperClassName="flex-row items-center gap-[10px]"
							inputClassName="w-[220px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
							maxLength={100}
							type={'text'}
							max={200}
							placeholder={t('account.form.companyInfo.placeholder')}
							label={
								formState.errors.compannyInfo?.message || t('account.form.companyInfo.label')
							}
							error={formState.errors.compannyInfo?.message}
						/>
						<div className="flex flex-row items-center gap-[8px]">
							<FormElementLabel
								className={twMerge(
									'w-[145px] font-sans text-sm font-normal leading-5 text-input-label-primary',
									formState.errors.formFile ? 'text-error' : '',
								)}
							>
								{(formState.errors.formFile?.message as string) ||
									t('account.form.companyLogo.label')}
							</FormElementLabel>
							<div className="flex flex-col items-center gap-[10px]">
								{logo && (
									<div className="flex justify-center self-center">
										<img
											src={logo}
											alt={t('account.form.companyLogo.preview')}
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
									{t('account.form.companyLogo.upload')}
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
									{!search.get('edit') ? t('account.form.btnEdit') : t('account.form.btnSave')}
								</p>
							</Button>
						) : (
							<Button
								onClick={() => navigate('', { edit: 'true' })}
								className="px-[16px]"
							>
								<p className="font-sans text-sm font-semibold leading-4">
									{!search.get('edit') ? t('account.form.btnEdit') : t('account.form.btnSave')}
								</p>
							</Button>
						)}
					</div>
				</FormProvider>
			</div>
		</div>
	);
};
