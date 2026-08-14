import type { TranslationKey } from '@core';
import { Button, CleanUpIcon, getAxiosErrorMessage, useAppNavigate, useI18n } from '@core';
import { memoize } from '@core/utils/hoc/memo.utils';
import { GUIDBOOKS_ROUTES, guidbookHeaderTitlesMap } from '@features/guidbooks/constants';
import { importConstructions, importMaterials, importRequirements } from '@features/guidbooks/services';
import {
	HeaderFormTypes,
	type HeaderFormElements,
	type HeaderFormTitles,
} from '@features/guidbooks/types';
import {
	formatImportResultToast,
	parseImportResultFromResponse,
	resolveImportDownloadAction,
	triggerDownloadAction,
} from '@features/guidbooks/utils';
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { FormProvider, type UseFormReturn } from 'react-hook-form';
import { FaPlus } from 'react-icons/fa6';
import { PiExportBold } from 'react-icons/pi';
import { useLocation, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

interface GuidbookPageHeaderWrapperProps {
	titles: HeaderFormTitles;
	onSave: () => void;
	onExport?: () => void | Promise<void>;
	isExporting?: boolean;
	/** Элемент справа от кнопки экспорта (например, фильтр типа для экспорта конструкций). */
	exportAccessory?: ReactNode;
	/** После успешного импорта (например, обновить таблицу). */
	onImportSuccess?: () => void;
	forms: {
		filterForm: UseFormReturn<any, any, any>;
		addForm: UseFormReturn<any, any, any>;
		editForm: UseFormReturn<any, any, any>;
	};
	formElements: HeaderFormElements<any>;
}

export const GuidbookPageHeaderWrapper = memoize(
	({
		titles,
		forms,
		formElements,
		onSave,
		onExport,
		isExporting = false,
		exportAccessory,
		onImportSuccess,
	}: GuidbookPageHeaderWrapperProps) => {
		const [currentForm, setCurrentForm] = useState<UseFormReturn>(forms.filterForm);
		const [currentHeaderFormType, setCurrentHeaderFormType] = useState<HeaderFormTypes>(
			HeaderFormTypes.filter,
		);
		const [isImporting, setIsImporting] = useState(false);
		const fileInputRef = useRef<HTMLInputElement>(null);
		const { pathname } = useLocation();
		const { t } = useI18n();

		const isMaterialsPage = pathname.includes(`/${GUIDBOOKS_ROUTES.materials.route}`);
		const isRequirementsPage = pathname.includes(`/${GUIDBOOKS_ROUTES.requirements.route}`);
		const isConstructionsPage = pathname.includes(`/${GUIDBOOKS_ROUTES.constructions.route}`);

		const showImportButton = isMaterialsPage || isRequirementsPage || isConstructionsPage;
		const importAccept = isConstructionsPage ? '.json,application/json' : '.txt,.xlsx,.xls,.csv';

		const handleImportClick = () => {
			if (fileInputRef.current) {
				fileInputRef.current.click();
			}
		};

		const navigate = useAppNavigate();
		const [search] = useSearchParams();
		const onCancelHandle = useCallback(() => {
			navigate('');
			setCurrentHeaderFormType(HeaderFormTypes.filter);
		}, []);

		const onClearHandle = useCallback(() => {
			currentForm.reset();
		}, []);

		const onAddHandle = useCallback(() => {
			navigate('', { add: 'true' });
			setCurrentHeaderFormType(HeaderFormTypes.add);
		}, []);

		const isTransferInProgress = isImporting || isExporting;

		const onImportHandle = async (event: React.ChangeEvent<HTMLInputElement>) => {
			const file = event.target.files?.[0];
			event.target.value = '';

			if (!file) {
				toast.error(t('errors.fileNotSelected'));
				return;
			}

			if (isConstructionsPage && !file.name.toLowerCase().endsWith('.json')) {
				toast.error(t('errors.fileUpload'));
				return;
			}

			const fallbackFilename = isRequirementsPage
				? 'requirements-import-result.xlsx'
				: isConstructionsPage
					? 'constructions-import-result.json'
					: 'materials-import-result.xlsx';

			setIsImporting(true);
			try {
				const response = isRequirementsPage
					? await importRequirements({ formFile: file })
					: isConstructionsPage
						? await importConstructions({ file })
						: await importMaterials({ formFile: file });

				if (response.status !== 200) {
					toast.error(t('errors.import'));
					return;
				}

				const result = await parseImportResultFromResponse(response);
				if (result) {
					const toastInfo = formatImportResultToast(result, {
						success: t('guides.import.success'),
						summary: t('guides.import.summary'),
					});
					if (toastInfo.variant === 'warning') {
						toast.warning(toastInfo.message);
					} else {
						toast.success(toastInfo.message);
					}

					const action = resolveImportDownloadAction(result, fallbackFilename);
					if (action) {
						await triggerDownloadAction(action);
					} else if ((result.failedCount ?? 0) > 0) {
						toast.error(t('guides.import.noReport'));
					}
				} else {
					toast.success(t('guides.import.success'));
				}

				onImportSuccess?.();
				navigate('');
			} catch (error) {
				console.error(error);
				const message = await getAxiosErrorMessage(error, t('errors.fileUpload'));
				toast.error(message);
			} finally {
				setIsImporting(false);
			}
		};

		const onExportHandle = async () => {
			if (!onExport || isTransferInProgress) return;
			await onExport();
		};

		useEffect(() => {
			search.get('add')
				? setCurrentHeaderFormType(HeaderFormTypes.add)
				: search.get('edit')
					? setCurrentHeaderFormType(HeaderFormTypes.edit)
					: setCurrentHeaderFormType(HeaderFormTypes.filter);
		}, [search.get('add'), search.get('edit')]);

		const prevHeaderFormTypeRef = useRef<HeaderFormTypes | null>(null);

		useEffect(() => {
			const prevHeaderFormType = prevHeaderFormTypeRef.current;
			prevHeaderFormTypeRef.current = currentHeaderFormType;

			if (currentHeaderFormType === HeaderFormTypes.add) {
				setCurrentForm(forms.addForm);
				if (prevHeaderFormType !== HeaderFormTypes.add) {
					forms.addForm.reset();
				}
				return;
			}
			if (currentHeaderFormType === HeaderFormTypes.filter) {
				setCurrentForm(forms.filterForm);
				if (
					prevHeaderFormType != null &&
					prevHeaderFormType !== HeaderFormTypes.filter
				) {
					forms.filterForm.reset();
				}
				return;
			}
			if (currentHeaderFormType === HeaderFormTypes.edit) {
				setCurrentForm(forms.editForm);
			}
		}, [currentHeaderFormType, forms.addForm, forms.editForm, forms.filterForm]);

		const submitHandle = useCallback(() => {
			currentForm.handleSubmit(() => onSave())();
		}, [currentForm, onSave]);

		const formComponent = useMemo(() => {
			return (
				<FormProvider {...currentForm}>
					{currentHeaderFormType == HeaderFormTypes.filter ? (
						<formElements.filter
							control={currentForm.control}
							setValue={currentForm.setValue}
							formState={currentForm.formState}
						/>
					) : currentHeaderFormType == HeaderFormTypes.edit ? (
						<formElements.edit
							control={currentForm.control}
							setValue={currentForm.setValue}
							formState={currentForm.formState}
						/>
					) : (
						<formElements.add
							control={currentForm.control}
							setValue={currentForm.setValue}
							formState={currentForm.formState}
						/>
					)}
				</FormProvider>
			);
		}, [currentForm, forms]);

		return (
			<div className="flex w-full flex-col gap-[14px]">
				<div className="flex w-full items-center justify-between">
					<p className="font-sans text-lg font-semibold leading-6">
						{t(titles.pageTitleKey)}
					</p>
					<div className="flex items-center gap-2">
						<div className="flex items-center justify-between">
							{currentHeaderFormType === HeaderFormTypes.filter && showImportButton && (
								<>
									<Button
										className="flex w-fit flex-row items-center gap-[4px] px-[16px] py-[6px]"
										onClick={handleImportClick}
										disabled={isTransferInProgress}
									>
										{isImporting ? (
											<span className="inline-block size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
										) : (
											<PiExportBold
												fill="white"
												width={'16px'}
												height={'16px'}
											/>
										)}
										<p className="font-sans text-sm font-semibold leading-[18px]">
											{isImporting
												? t('guides.import.inProgress')
												: t('common.import')}
										</p>
									</Button>
									<input
										ref={fileInputRef}
										type="file"
										accept={importAccept}
										onChange={onImportHandle}
										className="hidden"
										disabled={isTransferInProgress}
									/>
								</>
							)}
						</div>
						<div className="flex items-center gap-2">
							{currentHeaderFormType === HeaderFormTypes.filter &&
								onExport &&
								exportAccessory}
							{currentHeaderFormType === HeaderFormTypes.filter && onExport && (
								<Button
									className="flex w-fit flex-row items-center gap-[4px] px-[16px] py-[6px]"
									onClick={onExportHandle}
									disabled={isTransferInProgress}
								>
									{isExporting ? (
										<span className="inline-block size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
									) : (
										<PiExportBold fill="white" width={'16px'} height={'16px'} />
									)}
									<p className="font-sans text-sm font-semibold leading-[18px]">
										{isExporting
											? t('guides.export.inProgress')
											: t('common.export')}
									</p>
								</Button>
							)}
						</div>
						<div className="flex items-center justify-between">
							{currentHeaderFormType === HeaderFormTypes.filter && (
								<Button
									className="flex w-fit flex-row items-center gap-[4px] px-[16px] py-[6px]"
									onClick={onAddHandle}
								>
									<FaPlus fill="white" width={'16px'} height={'16px'} />
									<p className="font-sans text-sm font-semibold leading-[18px]">
										{t('common.add')}
									</p>
								</Button>
							)}
						</div>
					</div>
				</div>

				<div className="flex flex-col rounded-xl border border-solid bg-white">
					<p className="flex justify-center pt-[16px] font-sans text-base font-semibold leading-4">
						{guidbookHeaderTitlesMap.get(currentHeaderFormType)!(titles) &&
							t(
								guidbookHeaderTitlesMap.get(currentHeaderFormType)!(
									titles,
								) as unknown as TranslationKey,
							)}
					</p>
					<div className="flex flex-wrap gap-[16px] border-b border-solid px-[16px] pb-[24px] pt-[16px]">
						{formComponent}
					</div>
					<div className="flex flex-row justify-end gap-[30px] px-[16px] py-[13px]">
						{currentHeaderFormType !== HeaderFormTypes.filter && (
							<Button
								onClick={() => submitHandle()}
								className="group flex w-fit flex-row items-center gap-[6px] border border-solid border-primary bg-background-button-secondary px-[16px] py-[5px] group-hover:bg-primary"
							>
								<p className="font-sans text-sm font-semibold leading-[18px] text-primary group-hover:text-white">
									{currentHeaderFormType === HeaderFormTypes.add
										? t('common.save')
										: t('common.saveChanges')}
								</p>
							</Button>
						)}
						<Button
							className="group flex w-fit flex-row items-center gap-[4px] border border-solid border-primary bg-background-button-secondary px-[16px] py-[5px] group-hover:bg-primary"
							onClick={
								currentHeaderFormType === HeaderFormTypes.filter
									? onClearHandle
									: onCancelHandle
							}
						>
							<CleanUpIcon
								width={'16px'}
								height={'16px'}
								className="fill-primary group-hover:fill-white"
							/>
							<p className="font-sans text-sm font-semibold leading-[18px] text-primary group-hover:text-white">
								{currentHeaderFormType === HeaderFormTypes.filter
									? t('common.clear')
									: t('common.cancel')}
							</p>
						</Button>
					</div>
				</div>
			</div>
		);
	},
	'GuidbookPageHeaderWrapper',
);
