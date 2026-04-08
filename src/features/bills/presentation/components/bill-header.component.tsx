import {
	Button,
	CleanUpIcon,
	Input,
	Select,
	useI18n,
	useAccessValidator,
	useAppNavigate,
	UserRoles,
} from '@core';
import { BillTypeSelectValues, type BillFilter } from '@features/bills/types';
import { Controller, useFormContext } from 'react-hook-form';
import { FaPlus } from 'react-icons/fa6';

const BillHeaderComponent = () => {
	const { register, reset, control } = useFormContext<BillFilter>();
	const { validate } = useAccessValidator();
	const navigate = useAppNavigate();
	const { t } = useI18n();
	const isAdmin = validate(UserRoles.Admin);

	return (
		<div className="flex w-full flex-col gap-[14px]">
			<div className="flex w-full items-center justify-between">
				<p className="font-sans text-lg font-semibold leading-6">{t('bills.pageTitle')}</p>
				{isAdmin && (
					<Button
						className="flex w-fit flex-row items-center gap-[4px] px-[16px] py-[6px]"
						onClick={() => navigate('', { add: 'true' })}
					>
						<FaPlus fill="white" width={'16px'} height={'16px'} />
						<p className="font-sans text-sm font-semibold leading-[18px]">
							{t('common.create')}
						</p>
					</Button>
				)}
			</div>

			<div className="flex flex-col rounded-xl border border-solid bg-white">
				<div className="flex flex-wrap gap-[16px] border-b border-solid px-[16px] pb-[24px] pt-[16px]">
					<Input
						{...register('number')}
						labelClassName={
							'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary'
						}
						type="number"
						inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
						containerClassName="w-[226px]"
						label={t('bills.fields.number')}
						placeholder={t('bills.placeholders.number')}
					/>
					<Controller
						name="billType"
						control={control}
						render={({ field }) => (
							<Select
								{...field}
								value={field.value || ''}
								options={BillTypeSelectValues}
								labelClassName={'text-sm leading-5 tracking-[0.1px]'}
								wrapperClassname="w-[226px] ring-input-border-primary"
								buttonClassName="text-sm rounded-[8px]"
								label={t('bills.fields.status')}
								placeholder={t('bills.placeholders.status')}
							/>
						)}
					/>
					<Input
						{...register('clientName')}
						labelClassName={
							'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary'
						}
						type="number"
						inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
						containerClassName="w-[226px]"
						label={t('bills.fields.client')}
						placeholder={t('bills.placeholders.client')}
					/>
				</div>
				<div className="flex flex-row justify-end gap-[30px] px-[16px] py-[13px]">
					<Button
						className="group flex w-fit flex-row items-center gap-[4px] border border-solid border-primary bg-background-button-secondary px-[16px] py-[5px] hover:bg-primary"
						onClick={() => reset()}
					>
						<CleanUpIcon
							width={'16px'}
							height={'16px'}
							className="fill-primary group-hover:fill-white"
						/>
						<p className="font-sans text-sm font-semibold leading-[18px] text-primary group-hover:text-white">
							{t('common.clear')}
						</p>
					</Button>
				</div>
			</div>
		</div>
	);
};

export default BillHeaderComponent;
