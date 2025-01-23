import { Button, Input } from '@core';
import {
	ButtonTitles,
	FormFields,
	FormTitles,
	RegistrationFormData,
	RegistrationFormDataConfig,
} from '@features';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';

export const AccountForm = () => {
	const [isViewMode, setIsViewMode] = useState(true);
	const form = useForm<RegistrationFormData>({
		resolver: zodResolver(RegistrationFormDataConfig.schema),
		defaultValues: RegistrationFormDataConfig.defaultValues,
	});

	const handleClick = () => {
		setIsViewMode(!isViewMode);
	};

	return (
		<div className="flex flex-col rounded-xl bg-white">
			<div className="flex border-b-[1px] px-[24px] py-[18px]">
				<p className="font-sans text-lg font-semibold leading-4">
					{isViewMode ? FormTitles.default : FormTitles.edit}
				</p>
			</div>
			<div className="flex flex-col border-b-[1px] px-[24px] py-[11px]">
				<FormProvider {...form}>
					{FormFields.map((formField) =>
						!formField.fieldName.startsWith('companyLogo') ? (
							<Controller
								name={formField.fieldName}
								key={crypto.randomUUID()}
								render={({ field }) => (
									<Input
										{...field}
										labelClassName="font-sans text-sm font-semibold leading-5 tracking-[0.1px] w-[175px]"
										inputClassName="h-[26px] px-[12px] font-sans text-sm font-normal leading-5 tracking-[0.1px]"
										containerClassName="w-[220px]"
										label={formField.label}
										wrapperClassName="flex-row items-center mb-[20px]"
									/>
								)}
							/>
						) : (
							<Controller
								name={formField.fieldName}
								key={crypto.randomUUID()}
								render={({}) => <></>}
							/>
						),
					)}
				</FormProvider>
			</div>
			<div className="flex justify-end px-[16px] py-[13px]">
				<Button onClick={handleClick} className="px-[16px] font-semibold">
					{isViewMode ? ButtonTitles.default : ButtonTitles.edit}
				</Button>
			</div>
		</div>
	);
};
