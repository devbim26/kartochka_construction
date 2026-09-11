import { Input, useI18n } from '@core';
import type { Article } from '@features/news/types';
import { isNewsDateComplete, newsDateMask } from '@features/news/utils';
import { useMask } from '@react-input/mask';
import { useFormContext } from 'react-hook-form';

export const NewsFilter = () => {
	const form = useFormContext<Article>();
	const { register, clearErrors } = form;
	const { t } = useI18n();
	const dateMaskRef = useMask(newsDateMask);
	const publishDateField = register('publishDate');

	return (
		<>
			<Input
				{...register('title')}
				labelClassName={
					'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary'
				}
				inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
				containerClassName="w-[226px]"
				label={t('news.columns.title')}
				placeholder={t('news.placeholders.title')}
			/>

			<Input
				name={publishDateField.name}
				onBlur={publishDateField.onBlur}
				onChange={(event) => {
					publishDateField.onChange(event);
					const value = event.target.value;
					if (!value.replace(/\D/g, '') || isNewsDateComplete(value)) {
						clearErrors('publishDate');
					}
				}}
				ref={(element) => {
					publishDateField.ref(element);
					dateMaskRef.current = element as HTMLInputElement;
				}}
				labelClassName={
					'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary'
				}
				inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
				containerClassName="w-[226px]"
				label={t('news.columns.publishDate')}
				placeholder="ДД.ММ.ГГГГ"
				max={10}
			/>
		</>
	);
};
