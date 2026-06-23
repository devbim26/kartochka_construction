import {
	Button,
	FormElementLabel,
	getFileNameFromUrl,
	Input,
	TextArea,
	useI18n,
	useResolvedFileNames,
} from '@core';
import type { FileAttachment } from '@core/utils/helpers/file-display-name.helper';
import { mapConstructionAdditionalInfoFromApi } from '@features/guidbooks/converters';
import { getConstructionAdditionalInfo } from '@features/guidbooks/services';
import type { ConstructionsAddData } from '@features/guidbooks/types';
import type { ChangeEvent } from 'react';
import { useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { FormSubTitle } from '../../form-sub-title.component';

const MULTILINE_FIELDS = [
	{
		name: 'additionalInfo.suppliers',
		labelKey: 'guides.constructions.info.suppliers',
		placeholderKey: 'guides.constructions.info.multilinePlaceholder',
	},
	{
		name: 'additionalInfo.composition',
		labelKey: 'guides.constructions.info.composition',
		placeholderKey: 'guides.constructions.info.multilinePlaceholder',
	},
	{
		name: 'additionalInfo.features',
		labelKey: 'guides.constructions.info.features',
		placeholderKey: 'guides.constructions.info.multilinePlaceholder',
	},
	{
		name: 'additionalInfo.physicalCharacteristics',
		labelKey: 'guides.constructions.info.physicalCharacteristics',
		placeholderKey: 'guides.constructions.info.multilinePlaceholder',
	},
	{
		name: 'additionalInfo.fireSafetyAndMore',
		labelKey: 'guides.constructions.info.fireSafetyAndMore',
		placeholderKey: 'guides.constructions.info.multilinePlaceholder',
	},
	{
		name: 'additionalInfo.installation',
		labelKey: 'guides.constructions.info.installation',
		placeholderKey: 'guides.constructions.info.multilinePlaceholder',
	},
] as const;

const fieldLabelClassName = 'font-sans text-sm font-normal leading-5 tracking-[0.1px]';
const fieldInputClassName =
	'py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]';
const fieldTextAreaClassName =
	'py-[6px] px-[12px] min-h-[96px] font-sans text-sm font-normal leading-5 tracking-[0.1px]';

const listTextClassName =
	'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary';

const SelectedFilesList = ({
	title,
	items,
}: {
	title: string;
	items: Array<{ key: string; name: string; href?: string }>;
}) => {
	if (!items.length) return null;

	return (
		<div className="flex flex-col gap-1 text-left">
			<p className={twMerge(listTextClassName, 'font-semibold text-[#14181F]')}>
				{title} ({items.length})
			</p>
			<ul className="flex flex-col gap-1">
				{items.map((item) => (
					<li key={item.key} className={listTextClassName}>
						{item.href ? (
							<a
								className="text-primary underline"
								href={item.href}
								target="_blank"
								rel="noreferrer"
							>
								{item.name}
							</a>
						) : (
							<span>{item.name}</span>
						)}
					</li>
				))}
			</ul>
		</div>
	);
};

export const ConstructionsAdditionalInfo = () => {
	const { t } = useI18n();
	const [search] = useSearchParams();
	const { register, setValue, watch } = useFormContext<ConstructionsAddData>();
	const constructionHeaderId = search.get('entityId') ?? watch('id');
	const isEditMode = search.get('edit') === 'true';
	const fileAttachments = (watch('additionalInfo.fileUrls') ?? []) as FileAttachment[];
	const imageAttachments = (watch('additionalInfo.imageUrls') ?? []) as FileAttachment[];
	const selectedFiles = (watch('additionalInfo.files') ?? []) as File[];
	const selectedImages = (watch('additionalInfo.images') ?? []) as File[];
	const fileUrlsToResolve = useMemo(
		() =>
			fileAttachments
				.filter((attachment) => attachment.url && !attachment.name?.trim())
				.map((attachment) => attachment.url as string),
		[fileAttachments],
	);
	const imageUrlsToResolve = useMemo(
		() =>
			imageAttachments
				.filter((attachment) => attachment.url && !attachment.name?.trim())
				.map((attachment) => attachment.url as string),
		[imageAttachments],
	);
	const resolvedFileNames = useResolvedFileNames(fileUrlsToResolve);
	const resolvedImageNames = useResolvedFileNames(imageUrlsToResolve);

	const resolveAttachmentName = (
		attachment: FileAttachment,
		resolvedNames: Record<string, string>,
	) => {
		if (attachment.name?.trim()) return attachment.name.trim();
		const url = attachment.url ?? '';
		return resolvedNames[url] ?? getFileNameFromUrl(url);
	};

	useEffect(() => {
		if (!isEditMode || !constructionHeaderId) return;

		let cancelled = false;

		const loadAdditionalInfo = async () => {
			try {
				const response = await getConstructionAdditionalInfo(constructionHeaderId);
				if (cancelled || response.status !== 200 || !response.data) return;

				const mapped = mapConstructionAdditionalInfoFromApi(response.data);
				const setField = (name: keyof typeof mapped, value: (typeof mapped)[typeof name]) => {
					setValue(`additionalInfo.${name}`, value, { shouldDirty: false });
				};

				setField('suppliers', mapped.suppliers);
				setField('standartName', mapped.standartName);
				setField('composition', mapped.composition);
				setField('features', mapped.features);
				setField('physicalCharacteristics', mapped.physicalCharacteristics);
				setField('fireSafetyAndMore', mapped.fireSafetyAndMore);
				setField('installation', mapped.installation);
				setField('fileUrls', mapped.fileUrls);
				setField('imageUrls', mapped.imageUrls);
			} catch (error) {
				console.error('Failed to load construction additional info:', error);
			}
		};

		loadAdditionalInfo();

		return () => {
			cancelled = true;
		};
	}, [constructionHeaderId, isEditMode, setValue]);

	const selectedImagePreviews = useMemo(
		() => selectedImages.map((file) => URL.createObjectURL(file)),
		[selectedImages],
	);

	useEffect(
		() => () => {
			selectedImagePreviews.forEach((url) => URL.revokeObjectURL(url));
		},
		[selectedImagePreviews],
	);

	const existingFileItems = fileAttachments
		.filter((attachment) => attachment.url)
		.map((attachment, index) => ({
			key: `existing-file-${attachment.url}-${index}`,
			name: resolveAttachmentName(attachment, resolvedFileNames),
			href: attachment.url ?? undefined,
		}));

	const newFileItems = selectedFiles.map((file, index) => ({
		key: `new-file-${file.name}-${file.lastModified}-${index}`,
		name: file.name,
	}));

	const existingImageItems = imageAttachments
		.filter((attachment) => attachment.url)
		.map((attachment, index) => ({
			key: `existing-image-${attachment.url}-${index}`,
			name: resolveAttachmentName(attachment, resolvedImageNames),
			href: attachment.url ?? undefined,
		}));

	const newImageItems = selectedImages.map((file, index) => ({
		key: `new-image-${file.name}-${file.lastModified}-${index}`,
		name: file.name,
	}));

	const handleFilesChange =
		(field: 'additionalInfo.files' | 'additionalInfo.images') =>
		(event: ChangeEvent<HTMLInputElement>) => {
			setValue(field, Array.from(event.target.files ?? []), { shouldDirty: true });
		};

	return (
		<div className="flex flex-col gap-[16px]">
			<div className="flex flex-wrap gap-[16px]">
				<Input
					labelClassName={fieldLabelClassName}
					inputClassName={fieldInputClassName}
					containerClassName="w-[468px]"
					label={t('guides.constructions.info.standartName')}
					placeholder={t('guides.constructions.info.standartNamePlaceholder')}
					{...register('additionalInfo.standartName')}
					type="text"
				/>
			</div>

			<div className="flex flex-wrap gap-[16px]">
				{MULTILINE_FIELDS.map((field) => (
					<TextArea
						key={field.name}
						labelClassName={fieldLabelClassName}
						inputClassName={fieldTextAreaClassName}
						containerClassName="w-[468px]"
						label={t(field.labelKey)}
						placeholder={t(field.placeholderKey)}
						{...register(field.name)}
					/>
				))}
			</div>

			<FormSubTitle text={t('guides.constructions.info.attachmentsTitle')} />
			<div className="flex flex-wrap gap-[16px]">
				<div className="relative flex w-[468px] items-start gap-4">
					<div className="flex flex-col gap-y-2">
						<FormElementLabel className={twMerge(fieldLabelClassName, 'text-input-label-primary')}>
							{t('guides.constructions.info.files')}
						</FormElementLabel>
						<div className="flex items-center gap-[8px]">
							<Button
								variant="primary"
								type="button"
								className="group flex w-fit flex-row items-center gap-[4px] border-2 border-solid border-primary bg-white"
								onClick={() => document.getElementById('construction-files-upload')?.click()}
							>
								<p className="border-primary font-sans text-base font-semibold leading-4 text-primary group-hover:text-white">
									{t('guides.constructions.info.selectFiles')}
								</p>
							</Button>
							<input
								id="construction-files-upload"
								type="file"
								multiple
								className="hidden"
								onChange={handleFilesChange('additionalInfo.files')}
							/>
						</div>
						<SelectedFilesList
							title={t('guides.constructions.info.currentFiles')}
							items={existingFileItems}
						/>
						<SelectedFilesList
							title={t('guides.constructions.info.selectedFiles')}
							items={newFileItems}
						/>
					</div>
				</div>

				<div className="relative flex w-[468px] items-start gap-4">
					<div className="flex flex-col gap-y-2">
						<FormElementLabel className={twMerge(fieldLabelClassName, 'text-input-label-primary')}>
							{t('guides.constructions.info.images')}
						</FormElementLabel>
						<div className="flex items-center gap-[8px]">
							<Button
								variant="primary"
								type="button"
								className="group flex w-fit flex-row items-center gap-[4px] border-2 border-solid border-primary bg-white"
								onClick={() => document.getElementById('construction-images-upload')?.click()}
							>
								<p className="border-primary font-sans text-base font-semibold leading-4 text-primary group-hover:text-white">
									{t('guides.constructions.info.selectImages')}
								</p>
							</Button>
							<input
								id="construction-images-upload"
								type="file"
								multiple
								accept="image/*"
								className="hidden"
								onChange={handleFilesChange('additionalInfo.images')}
							/>
						</div>
						<SelectedFilesList
							title={t('guides.constructions.info.currentImages')}
							items={existingImageItems}
						/>
						<SelectedFilesList
							title={t('guides.constructions.info.selectedImages')}
							items={newImageItems}
						/>
					</div>
					{(imageAttachments.length > 0 || selectedImagePreviews.length > 0) && (
						<div className="flex flex-wrap gap-2 self-center">
							{imageAttachments.map((attachment, index) => (
								<a
									key={`${attachment.url}-${index}`}
									href={attachment.url ?? ''}
									target="_blank"
									rel="noreferrer"
								>
									<img
										src={attachment.url ?? ''}
										alt={
											resolveAttachmentName(attachment, resolvedImageNames) ||
											`${t('guides.constructions.info.currentImage')} ${index + 1}`
										}
										className="size-[60px] rounded-md object-cover"
									/>
								</a>
							))}
							{selectedImagePreviews.map((previewUrl, index) => (
								<img
									key={previewUrl}
									src={previewUrl}
									alt={selectedImages[index]?.name ?? ''}
									title={selectedImages[index]?.name}
									className="size-[60px] rounded-md object-cover"
								/>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
