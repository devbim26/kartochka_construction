import {
	Button,
	convertToBase64,
	FormElementLabel,
	Input,
	useAppDispatch,
	useAppNavigate,
	useAppSelector,
} from '@core';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { TiDeleteOutline } from 'react-icons/ti';
import { useSearchParams } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { AUTH_FETCH_ROUTES } from '../../../constants';
import { authRegistration, fileUpload } from '../../../services';
import { RegistrationFormData } from '../../../types';
import { RegistrationFormDataConfig } from '../../../utils';

export const CompanyRegistrationPage = () => {
	const navigate = useAppNavigate();

	const dispatch = useAppDispatch();

	const authData = useAppSelector((store) => store.authData);

	const [search] = useSearchParams();

	useEffect(() => {
		console.log(search.get('phoneNumber'));
		form.setValue('mainPhoneNumber', search.get('phoneNumber')!);
	}, [search]);

	const form = useForm<RegistrationFormData>({
		resolver: zodResolver(RegistrationFormDataConfig.schema),
		defaultValues: RegistrationFormDataConfig.defaultValues,
	});

	const { formState } = form;
	const phoneNumbers = form.watch('phoneNumbers');
	const logo = form.watch('companyLogo');

	const [showPassword, setShowPassword] = useState(false);

	const onSubmit = () => {
		dispatch(
			authRegistration({
				...form.getValues(),
			}),
		);
	};

	console.log(formState.errors);

	useEffect(() => {
		authData.fetch_data?.fetch_name === AUTH_FETCH_ROUTES.registration.fetch_name &&
			navigate('/');
	}, [authData.fetch_data?.fetch_name]);

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

	return (
		<div className="mb-[100px] flex w-[508px] flex-col gap-[23px] rounded-[12px] border border-gray-border bg-white px-[32px] py-[23px]">
			<p className="text-center font-raleway text-[28px] font-semibold text-black">
				Регистрация компании
			</p>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<div className="flex flex-col gap-[20px]">
					<div className="flex flex-col gap-[8px] text-[14px] placeholder:text-input-label-primary">
						<Input
							label={formState.errors.mainPhoneNumber?.message || 'Номер телефона'}
							labelClassName={
								formState.errors.mainPhoneNumber?.message ? 'text-error' : ''
							}
							error={formState.errors.mainPhoneNumber?.message}
							disabled
							{...form.register(`mainPhoneNumber`)}
							placeholder="+375 (29) 21-21-211"
							mask="+375 (99) 999-99-99"
							iconPos="right"
							iconClassName="w-[40px] h-[40px] text-primary right-[2px]"
							Icon={phoneNumbers.length < 3 ? AiOutlinePlusCircle : undefined}
							defaultValue={search.get('phoneNumber')!}
							onIconClick={() =>
								form.setValue('phoneNumbers', [
									...phoneNumbers,
									{ id: crypto.randomUUID(), number: '' },
								])
							}
						/>
						{phoneNumbers &&
							phoneNumbers.map((phoneNumber, index) => (
								<Input
									key={phoneNumber.id}
									label={
										formState.errors.phoneNumbers?.[index]?.number?.message ||
										'Номер телефона'
									}
									labelClassName={
										formState.errors.phoneNumbers?.[index]?.number?.message
											? 'text-error'
											: ''
									}
									error={formState.errors.phoneNumbers?.[index]?.message}
									placeholder="+375 (29) 21-21-211"
									mask="+375 (99) 999-99-99"
									{...form.register(`phoneNumbers.${index}.number`)}
									iconPos="right"
									iconClassName="w-[40px] h-[40px] text-error right-[2px]"
									Icon={TiDeleteOutline}
									onIconClick={() => {
										const updatedPhoneNumbers = phoneNumbers.filter(
											(ph) => ph.id !== phoneNumber.id,
										);
										form.setValue('phoneNumbers', updatedPhoneNumbers);
									}}
								/>
							))}
					</div>
					<Input
						label={formState.errors.password?.message || 'Пароль'}
						labelClassName={formState.errors.password?.message ? 'text-error' : ''}
						{...form.register('password')}
						error={formState.errors.password?.message}
						type={showPassword ? 'password' : 'text'}
						placeholder="Введите пароль"
						Icon={showPassword ? IoMdEyeOff : IoMdEye}
						iconClassName="text-input-label-primary"
						iconPos="right"
						onIconClick={() => setShowPassword(!showPassword)}
					/>
					<Input
						label={formState.errors.secondPassword?.message || 'Повторите пароль'}
						labelClassName={
							formState.errors.secondPassword?.message ? 'text-error' : ''
						}
						{...form.register('secondPassword')}
						error={formState.errors.secondPassword?.message}
						type={showPassword ? 'password' : 'text'}
						placeholder="Введите пароль"
						Icon={showPassword ? IoMdEyeOff : IoMdEye}
						iconClassName="text-input-label-primary"
						iconPos="right"
						onIconClick={() => setShowPassword(!showPassword)}
					/>
					<Input
						label={formState.errors.companyName?.message || 'Название компании'}
						labelClassName={formState.errors.companyName?.message ? 'text-error' : ''}
						error={formState.errors.companyName?.message}
						{...form.register('companyName')}
						maxLength={50}
						type={'text'}
						placeholder="Введите название компании"
					/>
					<Input
						label={formState.errors.directorFullName?.message || 'ФИО директора'}
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
							formState.errors.payersRegistrationNumber?.message ? 'text-error' : ''
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
						labelClassName={formState.errors.bankIdNumber?.message ? 'text-error' : ''}
						error={formState.errors.bankIdNumber?.message}
						{...form.register('bankIdNumber')}
						type={'number'}
						placeholder="Введите  БИК"
					/>

					<Input
						label={formState.errors.bankAddress?.message || 'Адрес банка'}
						labelClassName={formState.errors.bankAddress?.message ? 'text-error' : ''}
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
							{formState.errors.companyLogo?.url?.message || 'Логотип компании'}
						</FormElementLabel>
						<div className="flex items-center gap-[10px]">
							<Button
								variant="primary"
								className="h-[36px] w-[168px]"
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
					<Button variant="primary" className="h-[36px]">
						Зарегистрироваться
					</Button>
				</div>
			</form>
		</div>
	);
};
