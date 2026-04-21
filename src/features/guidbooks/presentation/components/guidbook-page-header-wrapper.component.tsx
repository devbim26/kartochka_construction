import type { TranslationKey } from '@core';
import { Button, CleanUpIcon, useAppNavigate, useI18n } from '@core';
import { memoize } from '@core/utils/hoc/memo.utils';
import { GUIDBOOKS_ROUTES, guidbookHeaderTitlesMap } from '@features/guidbooks/constants';
import { importMaterials, importRequirements } from '@features/guidbooks/services';
import {
	HeaderFormTypes,
	type HeaderFormElements,
	type HeaderFormTitles,
} from '@features/guidbooks/types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FormProvider, type UseFormReturn } from 'react-hook-form';
import { FaPlus } from 'react-icons/fa6';
import { PiExportBold } from 'react-icons/pi';
import { useLocation, useSearchParams } from 'react-router-dom';
import { catchError, from, of, tap } from 'rxjs';
import { toast } from 'sonner';

interface GuidbookPageHeaderWrapperProps {
	titles: HeaderFormTitles;
	onSave: () => void;
	onExport?: () => void;
	forms: {
		filterForm: UseFormReturn<any, any, any>;
		addForm: UseFormReturn<any, any, any>;
		editForm: UseFormReturn<any, any, any>;
	};
	formElements: HeaderFormElements<any>;
}

export const GuidbookPageHeaderWrapper = memoize(
	({ titles, forms, formElements, onSave, onExport }: GuidbookPageHeaderWrapperProps) => {
		const [currentForm, setCurrentForm] = useState<UseFormReturn>(forms.filterForm);
		const [currentHeaderFormType, setCurrentHeaderFormType] = useState<HeaderFormTypes>(
			HeaderFormTypes.filter,
		);
		const fileInputRef = useRef<HTMLInputElement>(null);
		const { pathname } = useLocation();
		const { t } = useI18n();

		const showImportButton =
			pathname.includes(`/${GUIDBOOKS_ROUTES.materials.route}`) ||
			pathname.includes(`/${GUIDBOOKS_ROUTES.requirements.route}`);

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

		const onImportHandle = (event: React.ChangeEvent<HTMLInputElement>) => {
			const file = event.target.files?.[0];
			event.target.value = '';

			if (!file) {
				toast.error(t('errors.fileNotSelected'));
				return;
			}

			const isRequirements = pathname.includes(`/${GUIDBOOKS_ROUTES.requirements.route}`);
			const importRequest = isRequirements
				? importRequirements({ formFile: file })
				: importMaterials({ formFile: file });

			from(importRequest)
				.pipe(
					tap((response) => {
						if (response.status === 200) {
							toast.success(t('guides.import.success'));
						} else {
							toast.error(t('errors.import'));
						}
					}),
					catchError((error) => {
						console.error(error);
						toast.error(t('errors.fileUpload'));
						return of(null);
					}),
				)
				.subscribe(() => navigate(''));
		};

		useEffect(() => {
			search.get('add')
				? setCurrentHeaderFormType(HeaderFormTypes.add)
				: search.get('edit')
					? setCurrentHeaderFormType(HeaderFormTypes.edit)
					: setCurrentHeaderFormType(HeaderFormTypes.filter);
		}, [search.get('add'), search.get('edit')]);

		useEffect(() => {
			if (currentHeaderFormType === HeaderFormTypes.add) setCurrentForm(forms.addForm);
			else if (currentHeaderFormType === HeaderFormTypes.filter)
				setCurrentForm(forms.filterForm);
			else if (currentHeaderFormType === HeaderFormTypes.edit) setCurrentForm(forms.editForm);
			currentForm.reset();
		}, [currentHeaderFormType]);

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
									>
										<PiExportBold
											fill="white"
											width={'16px'}
											height={'16px'}
										/>
										<p className="font-sans text-sm font-semibold leading-[18px]">
											{t('common.import')}
										</p>
									</Button>
									<input
										ref={fileInputRef}
										type="file"
										accept=".txt,.xlsx,.xls,.csv"
										onChange={onImportHandle}
										className="hidden"
									/>
								</>
							)}
						</div>
						<div className="flex items-center justify-between">
							{currentHeaderFormType === HeaderFormTypes.filter && onExport && (
								<Button
									className="flex w-fit flex-row items-center gap-[4px] px-[16px] py-[6px]"
									onClick={onExport}
								>
									<PiExportBold fill="white" width={'16px'} height={'16px'} />
									<p className="font-sans text-sm font-semibold leading-[18px]">
										Экспорт
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
