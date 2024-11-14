import { Button, convertToBase64, FormElementLabel, Input } from '@core';
import { useForm } from 'react-hook-form';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

export const CompanyRegistrationPage = () => {
	const navigate = useNavigate();

	const form = useForm({
		defaultValues: {
			phoneNumbers: [{ id: crypto.randomUUID(), number: '+375 (29) 21-21-211' }],
			companyLogo: { name: '', data: '' as string | ArrayBuffer },
		},
	});

	const phoneNumbers = form.watch('phoneNumbers');
	const logo = form.watch('companyLogo');

	const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
		const file = event.target.files?.[0];
		if (file) {
			form.setValue('companyLogo.name', file.name);
			const base64 = await convertToBase64(file);
			if (base64) form.setValue('companyLogo.data', base64);
		}
	};

	return (
		<div className="flex max-h-[700px] w-[508px] flex-col gap-[23px] overflow-auto rounded-[12px] border-[1px] border-gray-border bg-white px-[32px] py-[23px]">
			<p className="text-center font-raleway text-[28px] font-semibold text-black">
				Регистрация компании
			</p>
			<div className="flex flex-col gap-[20px]">
				<div className="flex flex-col gap-[8px] text-[14px] placeholder:text-input-label-primary">
					<FormElementLabel className="text-input-label-primary">
						Номер телефона
					</FormElementLabel>
					{phoneNumbers &&
						phoneNumbers.map((phoneNumber, index) => (
							<Input
								key={phoneNumber.id}
								placeholder="+375 (29) 21-21-211"
								mask="+375 (99) 999-99-99"
								{...form.register(`phoneNumbers.${index}.number`)}
								iconPos="right"
								iconClassName="w-[40px] h-[40px] text-primary right-[2px]"
								Icon={
									phoneNumbers.length < 3 && index === phoneNumbers.length - 1
										? AiOutlinePlusCircle
										: undefined
								}
								onIconClick={() =>
									form.setValue('phoneNumbers', [
										...phoneNumbers,
										{ id: crypto.randomUUID(), number: '' },
									])
								}
							/>
						))}
				</div>
				<Input
					label="Название компании"
					maxLength={50}
					type={'text'}
					placeholder="Введите название компании"
				/>
				<Input label="УНП" type={'number'} placeholder="Введите УНП" />
				<Input label="Расчетный счет" type={'text'} placeholder="Введите расчетный счет" />
				<Input label="Бик" type={'number'} placeholder="Введите  БИК" />
				<Input
					label="ФИО директора"
					maxLength={50}
					type={'text'}
					placeholder="Введите ФИО"
				/>
				<Input
					label="Адрес банка"
					maxLength={100}
					type={'text'}
					placeholder="Введите адрес"
				/>
				<Input
					label="Адрес компании"
					maxLength={100}
					type={'text'}
					placeholder="Введите адрес"
				/>
				<div className="flex flex-col gap-[8px]">
					<FormElementLabel className="font-raleway text-[14px] text-input-label-primary">
						Логотип компании
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
					label="Информация о компании"
					maxLength={100}
					type={'text'}
					placeholder="Введите информацию"
				/>
				<Button variant="primary" className="h-[36px]">
					Зарегистрироваться
				</Button>
			</div>
		</div>
	);
};
