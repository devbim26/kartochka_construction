import {
	APP_ROUTES,
	Button,
	convertToBase64,
	FormElementLabel,
	Input,
	phoneNumberMask,
	useAppDispatch,
	useAppNavigate,
} from '@core';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMask } from '@react-input/mask';
import type { UseFormReturn } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { TiDeleteOutline } from 'react-icons/ti';
import { useSearchParams } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { authRegistration } from '../../../services';
import type { RegistrationFormData } from '../../../types';
import { RegistrationFormDataConfig } from '../../../utils';

const PhoneInput = ({
	form,
	index,
	phoneNumber,
}: {
	form: UseFormReturn<RegistrationFormData>;
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

const CompanyRegistrationPage = () => {
	const navigate = useAppNavigate();
	const dispatch = useAppDispatch();
	const [search] = useSearchParams();

	const form = useForm<RegistrationFormData>({
		resolver: zodResolver(RegistrationFormDataConfig.schema),
		defaultValues: RegistrationFormDataConfig.defaultValues,
	});

	const { formState, watch, trigger, setValue } = form;
	const phoneNumbers = watch('phoneNumbers');

	const onSubmit = () => {
		dispatch(
			authRegistration({
				...form.getValues(),
			}),
		)
			.unwrap()
			.then(() => {
				navigate(APP_ROUTES.designing.route);
			})
			.catch((e) => {});
	};

	// useEffect(() => {
	// 	authData.fetch_data?.fetch_name === AUTH_FETCH_ROUTES.registration.fetch_name &&
	// 		navigate(APP_ROUTES.auth.route + '/' + AUTH_ROUTES.login.route);
	// }, [authData.fetch_data]);

	const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
		const file = event.target.files?.[0];
		if (file) {
			const base64 = await convertToBase64(file);
			if (base64 && typeof base64 === 'string') {
				setValue('companyLogo', base64);
				setValue('formFile', file);
			}
			trigger('companyLogo');
		}
	};

	const logo = watch('companyLogo');
	const phoneRef = useMask(phoneNumberMask);
	return (
		<div className="mb-[100px] flex w-[508px] flex-col gap-[23px] rounded-[12px] border bg-white px-[32px] py-[23px]">
			<p className="text-center font-raleway text-[28px] font-semibold text-black">
				Регистрация компании
			</p>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<div className="flex flex-col gap-[20px]">
					<div className="flex flex-col gap-[8px] text-[14px] placeholder:text-input-label-primary">
						<Input
							{...form.register('email')}
							label={formState.errors.mainPhoneNumber?.message || 'Email'}
							labelClassName={
								formState.errors.mainPhoneNumber?.message ? 'text-error' : ''
							}
							error={formState.errors.mainPhoneNumber?.message}
							disabled
							defaultValue={search.get('email')!}
						/>
						<Input
							label={formState.errors.mainPhoneNumber?.message || 'Номер телефона'}
							labelClassName={
								formState.errors.mainPhoneNumber?.message ? 'text-error' : ''
							}
							ref={phoneRef}
							error={formState.errors.mainPhoneNumber?.message}
							iconPos="right"
							iconClassName="w-[40px] h-[40px] text-primary right-[2px]"
							Icon={phoneNumbers.length < 3 ? AiOutlinePlusCircle : undefined}
							onChange={(e) => {
								form.setValue('mainPhoneNumber', e.target.value);
							}}
							onIconClick={() =>
								form.setValue('phoneNumbers', [
									...phoneNumbers,
									{ id: crypto.randomUUID(), number: '' },
								])
							}
						/>
						{phoneNumbers &&
							phoneNumbers.map((phoneNumber, index) => (
								<PhoneInput
									key={index}
									form={form}
									index={index}
									phoneNumber={phoneNumber}
								/>
							))}
					</div>

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
						maxLength={9}
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
						maxLength={20}
					/>
					<Input
						label={formState.errors.bankIdNumber?.message || 'БИК'}
						labelClassName={formState.errors.bankIdNumber?.message ? 'text-error' : ''}
						error={formState.errors.bankIdNumber?.message}
						{...form.register('bankIdNumber')}
						type={'text'}
						placeholder="Введите  БИК"
						maxLength={9}
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
					<div className="relative flex items-start gap-4">
						<div className="flex flex-col gap-y-2">
							<FormElementLabel
								className={twMerge(
									'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
									formState.errors.companyLogo?.message ? 'text-error' : '',
								)}
								errorMessage={formState.errors.companyLogo?.message?.toString()}
							>
								Логотип компании
							</FormElementLabel>
							<div className="flex items-center gap-[8px]">
								<Button
									variant="primary"
									className={twMerge(
										'group flex w-fit flex-row items-center gap-[4px] border-2 border-solid border-primary bg-white',
										formState.errors.companyLogo?.message ? 'border-error' : '',
									)}
									onClick={() => document.getElementById('file-upload')!.click()}
								>
									<p className="border-primary font-sans text-base font-semibold leading-4 text-primary group-hover:text-white">
										Выбрать изображение
									</p>
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
						{logo && (
							<div className="flex justify-center self-center">
								<img
									src={logo}
									alt="Превью изображения"
									className="size-[60px] rounded-md object-cover"
								/>
							</div>
						)}
					</div>
					<Input
						{...form.register('compannyInfo')}
						label={formState.errors.compannyInfo?.message || 'Информация о компании'}
						maxLength={100}
						type={'text'}
						error={formState.errors.compannyInfo?.message}
						labelClassName={formState.errors.compannyInfo?.message ? 'text-error' : ''}
						placeholder="Введите информацию"
					/>
					<Button variant="primary" className="h-[36px]">
						Зарегистрироваться
					</Button>
					<div className="flex items-center justify-center gap-[2px] font-sans text-[14px]">
						<p
							onClick={() => navigate(APP_ROUTES.landing.route)}
							className="cursor-pointer font-semibold underline-offset-auto hover:underline"
						>
							На главную
						</p>
					</div>
				</div>
			</form>
		</div>
	);
};

export default CompanyRegistrationPage;
