import { Button, convertToBase64, dateMask, FormElementLabel, Input, SafeImage, useI18n } from '@core';
import type { Article } from '@features/news/types';
import { isRichTextEmpty } from '@features/news/utils';
import { useMask } from '@react-input/mask';
import { useId } from 'react';
import { useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import { RichTextEditor } from './rich-text-editor.component';

export const NewsAddEdit = () => {
	const form = useFormContext<Article>();
	const { setValue, register, formState, watch, clearErrors } = form;
	const { errors } = formState;
	const { t } = useI18n();
	const imageInputId = useId();
	const dateMaskRef = useMask(dateMask);
	const publishDateField = register('publishDate');

	const imageUrl = watch('imageUrl');
	const bodyText = watch('bodyText');

	const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
		const file = event.target.files?.[0];
		if (!file) return;

		try {
			const base64 = await convertToBase64(file);
			if (base64 && typeof base64 === 'string') {
				setValue('imageUrl', base64, { shouldDirty: true, shouldTouch: true });
				setValue('imageFile', file, { shouldDirty: true, shouldTouch: true });
				clearErrors(['imageUrl', 'imageFile']);
			}
		} catch {
			// ignore read errors — user can pick another file
		} finally {
			event.target.value = '';
		}
	};

	return (
		<>
			<div className="flex w-full items-end gap-6">
				<Input
					{...register('title')}
					labelClassName={twMerge(
						'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
						errors.title?.message ? 'text-error' : '',
					)}
					inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
					containerClassName="w-[226px]"
					label={errors.title?.message || t('news.columns.title')}
					placeholder={t('news.placeholders.title')}
					error={errors.title?.message}
				/>

				<Input
					name={publishDateField.name}
					onBlur={publishDateField.onBlur}
					onChange={(event) => {
						publishDateField.onChange(event);
						if (event.target.value.replace(/[_\s-]/g, '').length > 0) {
							clearErrors('publishDate');
						}
					}}
					ref={(element) => {
						publishDateField.ref(element);
						dateMaskRef.current = element as HTMLInputElement;
					}}
					labelClassName={twMerge(
						'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
						errors.publishDate?.message ? 'text-error' : '',
					)}
					inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
					containerClassName="w-[226px]"
					label={errors.publishDate?.message || t('news.columns.publishDate')}
					placeholder={t('news.placeholders.date')}
					max={10}
					error={errors.publishDate?.message}
				/>

				<div className="flex w-full items-end gap-4">
					<div className="flex flex-col gap-y-2">
						<FormElementLabel
							className={twMerge(
								'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
								errors.imageUrl?.message || errors.imageFile?.message
									? 'text-error'
									: '',
							)}
							errorMessage={
								errors.imageUrl?.message?.toString() ||
								errors.imageFile?.message?.toString()
							}
						>
							{t('news.columns.image')}
						</FormElementLabel>
						<div className="flex items-center gap-[8px]">
							<Button
								type="button"
								variant="primary"
								className={twMerge(
									'group flex w-fit flex-row items-center gap-[4px] whitespace-nowrap border-2 border-solid border-primary bg-white',
									errors.imageUrl?.message || errors.imageFile?.message
										? 'border-error'
										: '',
								)}
								onClick={() => document.getElementById(imageInputId)?.click()}
							>
								<p className="border-primary font-sans text-base font-semibold leading-4 text-primary group-hover:text-white">
									{t('news.selectImage')}
								</p>
							</Button>
							<input
								type="file"
								id={imageInputId}
								accept="image/*"
								onChange={handleFileChange}
								className="hidden"
							/>
						</div>
					</div>
					<div className="flex justify-center self-center">
						<SafeImage
							src={imageUrl || null}
							alt={t('account.form.companyLogo.preview')}
							className="size-[60px] rounded-md object-cover"
							fallbackClassName="size-[60px]"
						/>
					</div>
				</div>
			</div>

			<RichTextEditor
				value={bodyText || ''}
				onChange={(html) => {
					setValue('bodyText', html, { shouldDirty: true, shouldTouch: true });
					if (!isRichTextEmpty(html)) clearErrors('bodyText');
				}}
				className="w-full max-w-[700px]"
				label={errors.bodyText?.message || t('news.bodyText')}
				error={errors.bodyText?.message}
				placeholder={t('news.placeholders.bodyText')}
			/>
		</>
	);
};
