import { Button, convertToBase64, dateMask, FormElementLabel, Input, useI18n } from '@core';
import type { Article } from '@features/news/types';
import { useMask } from '@react-input/mask';
import { useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

export const NewsAddEdit = () => {
	const form = useFormContext<Article>();
	const { setValue, register, formState, trigger, watch } = form;
	const { t } = useI18n();

	const dateRef = useMask(dateMask);

	const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
		const file = event.target.files?.[0];
		if (file) {
			const base64 = await convertToBase64(file);
			if (base64 && typeof base64 === 'string') {
				setValue('imageUrl', base64);
				setValue('imageFile', file);
			}
			trigger('imageUrl');
			trigger('imageFile');
		}
	};

	const imageUrl = watch('imageUrl');

	return (
		<>
			<div className="flex w-full items-end gap-6">
				<Input
					{...register('title')}
					labelClassName={twMerge(
						'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
						formState.errors.title?.message ? 'text-error' : '',
					)}
					inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
					containerClassName="w-[226px]"
					label={formState.errors?.title?.message || t('news.columns.title')}
					placeholder={t('news.placeholders.title')}
				/>

				<Input
					onChange={(event) => {
						setValue('publishDate', event.target.value);
					}}
					value={watch('publishDate')}
					labelClassName={twMerge(
						'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
						formState.errors.publishDate?.message ? 'text-error' : '',
					)}
					inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
					containerClassName="w-[226px]"
					label={formState.errors?.publishDate?.message || t('news.columns.publishDate')}
					placeholder={t('news.placeholders.date')}
					max={10}
					ref={dateRef}
				/>

				<div className="flex w-full items-end gap-4">
					<div className="flex flex-col gap-y-2">
						<FormElementLabel
							className={twMerge(
								'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
								formState.errors.imageUrl?.message ||
									formState.errors.imageFile?.message?.toString()
									? 'text-error'
									: '',
							)}
							errorMessage={
								formState.errors.imageUrl?.message?.toString() ||
								formState.errors.imageFile?.message?.toString()
							}
						>
							{t('news.columns.image')}
						</FormElementLabel>
						<div className="flex items-center gap-[8px]">
							<Button
								variant="primary"
								className={twMerge(
									'group flex w-fit flex-row items-center gap-[4px] whitespace-nowrap border-2 border-solid border-primary bg-white', // Добавлено whitespace-nowrap
									formState.errors.imageUrl?.message ||
										formState.errors.imageFile?.message
										? 'border-error'
										: '',
								)}
								onClick={() =>
									document.getElementById('news-image-upload')!.click()
								}
							>
								<p className="border-primary font-sans text-base font-semibold leading-4 text-primary group-hover:text-white">
									{t('news.selectImage')}
								</p>
							</Button>
							<input
								type="file"
								id="news-image-upload"
								accept="image/*"
								onChange={handleFileChange}
								className="hidden"
							/>
						</div>
					</div>
					{imageUrl && (
						<div className="flex justify-center self-center">
							<img
								src={imageUrl}
								alt={t('account.form.companyLogo.preview')}
								className="size-[60px] rounded-md object-cover"
							/>
						</div>
					)}
				</div>
			</div>

			<Input
				{...register('bodyText')}
				labelClassName={twMerge(
					'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
					formState.errors.bodyText?.message ? 'text-error' : '',
				)}
				inputClassName="py-[6px] px-[12px] h-[100px] font-sans text-sm font-normal leading-5 tracking-[0.1px] align-top"
				containerClassName="w-[700px]"
				label={formState.errors?.bodyText?.message || t('news.bodyText')}
				placeholder={t('news.placeholders.bodyText')}
			/>
		</>
	);
};
