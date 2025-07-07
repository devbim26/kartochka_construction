import { dateMask, Input } from '@core';
import type { Article } from '@features/news/types';
import { useMask } from '@react-input/mask';
import { useFormContext } from 'react-hook-form';

export const NewsFilter = () => {
	const form = useFormContext<Article>();
	const { register, watch, setValue } = form;

	const dateRef = useMask(dateMask);

	return (
		<>
			<Input
				{...register('title')}
				labelClassName={
					'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary'
				}
				inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
				containerClassName="w-[226px]"
				label="Заголовок"
				placeholder="Введите заголовок"
			/>

			<Input
				onChange={(event) => {
					setValue('publishDate', event.target.value);
				}}
				value={watch('publishDate')}
				ref={dateRef}
				labelClassName={
					'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary'
				}
				inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
				containerClassName="w-[226px]"
				label="Дата"
				placeholder="Введите дату"
				max={10}
			/>
		</>
	);
};
