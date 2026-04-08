import type { NamedEntity, UserRole } from '@core';
import {
	accountMask,
	Button,
	convertToBase64,
	convertToSelectValues,
	FormElementLabel,
	Input,
	phoneNumberMask,
	Select,
	useI18n,
} from '@core';
import type { AccountData } from '@features/account/types';
import { getRoles } from '@features/users/services';
import { useMask } from '@react-input/mask';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import type { FieldErrors } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { TiDeleteOutline } from 'react-icons/ti';
import { useSearchParams } from 'react-router-dom';
import { catchError, from } from 'rxjs';
import { toast } from 'sonner';
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

export const UserAddEdit = () => {
	const accountRef = useMask(accountMask);
	const form = useFormContext<AccountData>();
	const phoneRef = useMask(phoneNumberMask);
	const [search] = useSearchParams();
	const { setValue, watch, formState, trigger } = form;
	const { t } = useI18n();
	const [roles, setRoles] = useState<Array<UserRole>>([]);
	const isAddMode = !!search.get('add');
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

	useEffect(() => {
		from(getRoles())
			.pipe(
				catchError((error) => {
					if (error instanceof AxiosError) {
						toast.error(error.response?.data);
					}
					return from([null]);
				}),
			)
			.subscribe((response) => {
				if (response?.status === 200) {
					setRoles(
						(response.data as unknown as NamedEntity[]).map((role) => ({
							id: role.id!,
							name: role.name!,
						})),
					);
				}
			});
	}, []);

	const phoneNumbers = watch('phoneNumbers');
	const logo = watch('companyLogo');

	return (
		<div className="flex flex-col rounded-xl bg-white">
			<div className="flex flex-col px-[24px] py-[11px]">
				<div className="flex flex-col gap-[20px]">
					<div className="flex gap-[20px]">
						{isAddMode && (
							<Input
								label={formState.errors.email?.message || 'Email'}
								labelClassName={twMerge(
									'font-sans text-sm font-normal leading-5 text-input-label-primary w-[145px]',
									formState.errors.email?.message ? 'text-error' : '',
								)}
								wrapperClassName="flex-row items-center gap-[10px]"
								inputClassName="w-[220px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
								error={formState.errors.email?.message}
								{...form.register('email')}
								maxLength={100}
								type={'email'}
								placeholder={t('auth.emailPlaceholder')}
							/>
						)}
						<Input
							label={
								formState.errors.companyName?.message ||
								t('account.form.companyName.label')
							}
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
							placeholder={t('account.form.companyName.placeholder')}
							max={50}
						/>
						<div className="flex flex-wrap gap-[8px] text-[14px] placeholder:text-input-label-primary">
							<Input
								ref={phoneRef}
								label={
									formState.errors.mainPhoneNumber?.message ||
									t('account.form.phoneNumbers.label')
								}
								labelClassName={twMerge(
									'font-sans text-sm font-normal leading-5 text-input-label-primary w-[145px]',
									formState.errors.mainPhoneNumber?.message ? 'text-error' : '',
								)}
								wrapperClassName="flex-row items-center gap-[10px]"
								inputClassName="w-[220px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
								error={formState.errors.mainPhoneNumber?.message}
								value={watch('mainPhoneNumber')}
								placeholder="+375(__)___-__-__"
								iconPos="right"
								iconClassName={twMerge('size-[25px] text-primary right-[2px]')}
								onChange={(e) => setValue('mainPhoneNumber', e.target.value)}
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
					</div>
					<div className="flex flex-wrap gap-[20px]">
						<Input
							label={
								formState.errors.payersRegistrationNumber?.message ||
								t('account.form.unp.label')
							}
							labelClassName={twMerge(
								'font-sans text-sm font-normal leading-5 text-input-label-primary w-[145px]',
								formState.errors.mainPhoneNumber?.message ? 'text-error' : '',
							)}
							wrapperClassName="flex-row items-center gap-[10px]"
							inputClassName="w-[220px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
							error={formState.errors.payersRegistrationNumber?.message}
							{...form.register('payersRegistrationNumber')}
							type={'number'}
							maxLength={9}
							placeholder={t('account.form.unp.placeholder')}
						/>
						<Input
							label={
								formState.errors.paymentAccount?.message ||
								t('account.form.paymentAccount.label')
							}
							onChange={(event) => {
								setValue('paymentAccount', event.target.value);
							}}
							value={form.watch('paymentAccount')}
							labelClassName={twMerge(
								'font-sans text-sm font-normal leading-5 text-input-label-primary w-[145px]',
								formState.errors.paymentAccount?.message ? 'text-error' : '',
							)}
							wrapperClassName="flex-row items-center gap-[10px]"
							inputClassName="w-[220px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
							error={formState.errors.paymentAccount?.message}
							type={'text'}
							placeholder={t('account.form.paymentAccount.placeholder')}
							maxLength={28}
						/>
						<Input
							label={formState.errors.bankIdNumber?.message || t('account.form.bik.label')}
							labelClassName={twMerge(
								'font-sans text-sm font-normal leading-5 text-input-label-primary w-[145px]',
								formState.errors.bankIdNumber?.message ? 'text-error' : '',
							)}
							wrapperClassName="flex-row items-center gap-[10px]"
							inputClassName="w-[220px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
							error={formState.errors.bankIdNumber?.message}
							{...form.register('bankIdNumber')}
							type={'text'}
							placeholder={t('account.form.bik.placeholder')}
							maxLength={8}
						/>
						<Input
							label={
								formState.errors.directorFullName?.message ||
								t('account.form.directorFullName.label')
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
							placeholder={t('account.form.directorFullName.placeholder')}
							max={50}
						/>
						<Input
							label={
								formState.errors.bankAddress?.message ||
								t('account.form.bankAddress.label')
							}
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
							placeholder={t('account.form.bankAddress.placeholder')}
							max={50}
						/>
						<Input
							label={
								formState.errors.companyAddress?.message ||
								t('account.form.companyAddress.label')
							}
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
							max={50}
							placeholder={t('account.form.companyAddress.placeholder')}
						/>
						<Input
							{...form.register('compannyInfo')}
							labelClassName={twMerge(
								'font-sans text-sm font-normal leading-5 text-input-label-primary w-[145px]',

								formState.errors.compannyInfo?.message ? 'text-error' : '',
							)}
							wrapperClassName="flex-row items-center gap-[10px]"
							inputClassName="w-[220px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
							maxLength={100}
							type={'text'}
							max={200}
							placeholder={t('account.form.companyInfo.placeholder')}
							label={
								formState.errors.compannyInfo?.message ||
								t('account.form.companyInfo.label')
							}
							error={formState.errors.compannyInfo?.message}
						/>
						<Select
							onChange={(value) => setValue('roleId', value as string)}
							value={watch('roleId') || ''}
							options={convertToSelectValues(roles) ?? []}
							error={formState.errors.roleId?.message}
							labelClassName={twMerge(
								'text-sm leading-5 tracking-[0.1px] w-[145px]',
								formState.errors.roleId?.message ? 'text-error' : '',
							)}
							wrapperClassname="flex-row items-center gap-[10px] ring-input-border-primary"
							buttonClassName="text-sm w-[220px] rounded-[8px]"
							label={formState.errors.roleId?.message || t('users.role')}
							placeholder={t('users.rolePlaceholder')}
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
				</div>
			</div>
		</div>
	);
};
