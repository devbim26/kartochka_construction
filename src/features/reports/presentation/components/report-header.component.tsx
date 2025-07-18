import { Button, CleanUpIcon, Input } from '@core';
import type { ReportFilter } from '@features/reports/types';
import { useFormContext } from 'react-hook-form';

const ReportHeaderComponent = () => {
	const { register, reset } = useFormContext<ReportFilter>();

	return (
		<div className="flex w-full flex-col gap-[14px]">
			<div className="flex items-center justify-between">
				<p className="font-sans text-lg font-semibold leading-6">Отчеты</p>
			</div>
			<div className="flex flex-col rounded-xl border border-solid bg-white">
				<div className="flex flex-wrap gap-[16px] border-b border-solid px-[16px] pb-[24px] pt-[16px]">
					<Input
						{...register('name')}
						labelClassName={
							'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary'
						}
						inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
						containerClassName="w-[226px]"
						label={'Название'}
						placeholder="Введите название"
					/>
					<Input
						{...register('client')}
						labelClassName={
							'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary'
						}
						inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
						containerClassName="w-[226px]"
						label={'Клиент'}
						placeholder="Введите клиента"
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
							Очистить
						</p>
					</Button>
				</div>
			</div>
		</div>
	);
};

export default ReportHeaderComponent;
