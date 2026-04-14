import {
	APP_ROUTES,
	Button,
	convertToBase64,
	FormElementLabel,
	Input,
	phoneNumberMask,
	selectIsUserLoggedIn,
	useAppDispatch,
	useAppNavigate,
	useAppSelector,
	useI18n,
} from '@core';
import { DESIGNING_ROUTES } from '@features/home/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMask } from '@react-input/mask';
import type { FieldPath, UseFormReturn } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { useMemo } from 'react';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { BsQuestionSquareFill } from 'react-icons/bs';
import { TiDeleteOutline } from 'react-icons/ti';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';
import { authRegistration } from '../../../services';
import type { RegistrationFormData } from '../../../types';
import { RegistrationFormDataConfig, RegistrationFormFullSchema } from '../../../utils';

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
			error={form.formState.errors.phoneNumbers?.[index]?.number?.message}
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
	const isLoggedIn = useAppSelector(selectIsUserLoggedIn);
	const { t } = useI18n();

	const registrationDefaults = useMemo(
		() => ({
			...RegistrationFormDataConfig.defaultValues,
			email: search.get('email') ?? '',
		}),
		[search],
	);

	const form = useForm<RegistrationFormData>({
		resolver: zodResolver(RegistrationFormDataConfig.schema),
		defaultValues: registrationDefaults,
	});

	const { formState, watch, trigger, setValue, clearErrors, setError, handleSubmit } = form;
	const phoneNumbers = watch('phoneNumbers');

	const submitRegistration = (values: RegistrationFormData) => {
		dispatch(authRegistration(values))
			.unwrap()
			.then(() => {
				navigate(`${APP_ROUTES.designing.route}/${DESIGNING_ROUTES.main.route}`);
			})
			.catch(() => {});
	};

	const onSubmitFull = (data: RegistrationFormData) => {
		clearErrors();
		const parsed = RegistrationFormFullSchema.safeParse(data);
		if (!parsed.success) {
			for (const issue of parsed.error.issues) {
				if (issue.path.length === 0) continue;
				const path = issue.path.join('.') as FieldPath<RegistrationFormData>;
				setError(path, { type: 'manual', message: issue.message ?? '' });
			}
			toast.error(t('auth.registration.fullFormError'));
			return;
		}
		submitRegistration(data);
	};

	const onSubmitShort = (data: RegistrationFormData) => {
		clearErrors();
		submitRegistration(data);
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
				{t('auth.registration.companyTitle')}
			</p>
			<form onSubmit={handleSubmit(onSubmitFull)}>
				<div className="flex flex-col gap-[20px]">
					<div className="flex flex-col gap-[8px] text-[14px] placeholder:text-input-label-primary">
						<Input
							{...form.register('email')}
							label={formState.errors.email?.message || 'Email'}
							labelClassName={formState.errors.email?.message ? 'text-error' : ''}
							error={formState.errors.email?.message}
							disabled
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
					<div className="flex flex-col items-stretch gap-3">
						<Button variant="primary" type="submit" className="h-[36px] w-full shrink-0">
							{t('auth.registration.register')}
						</Button>
						<div className="flex flex-row items-center justify-center gap-2">
							<button
								type="button"
								className="font-sans text-sm font-semibold text-primary underline-offset-2 hover:underline"
								onClick={() => void handleSubmit(onSubmitShort)()}
							>
								{t('auth.registration.skip')}
							</button>
							<div
								className="group relative shrink-0"
								title={t('auth.registration.skipTooltip')}
							>
								<BsQuestionSquareFill
									className="size-[20px] cursor-pointer text-primary"
									aria-label={t('auth.registration.skipTooltip')}
								/>
								<div className="pointer-events-none absolute left-1/2 top-full z-10 w-[min(280px,calc(100vw-2rem))] max-w-[280px] -translate-x-1/2 translate-y-2 rounded bg-black px-3 py-2 text-left text-sm font-normal leading-snug text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
									{t('auth.registration.skipTooltip')}
								</div>
							</div>
						</div>
					</div>
					<div className="flex items-center justify-center gap-[2px] font-sans text-[14px]">
						<p
							onClick={() =>
								navigate(
									isLoggedIn
										? `${APP_ROUTES.designing.route}/${DESIGNING_ROUTES.main.route}`
										: APP_ROUTES.landing.route,
								)
							}
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
