import { APP_ROUTES, Button, useAppDispatch, useAppNavigate, useAppSelector, useI18n } from '@core';
import Loader from '@core/presentation/components/loaders/loader.component';
import { convertToClientReportFormFlags } from '@features/constructor/converters';
import {
	formReport,
	formReportLogo,
	getReportFormInfo,
	reportReceiveFloor,
	reportReceiveSingle,
} from '@features/constructor/services';
import { stopLoading } from '@features/constructor/store';
import { ReportCategory } from '@features/constructor/types';
import type { FormReportSchemaType } from '@features/constructor/utils';
import { FormReportConfig } from '@features/constructor/utils';
import { DESIGNING_ROUTES } from '@features/home/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { catchError, from, switchMap } from 'rxjs';
import { toast } from 'sonner';
import { DocumentFlags } from './document-flags.component';
import { GeneralInfoForm } from './general-info-form.component';

const ReportFromComponent = () => {
	const [search] = useSearchParams();
	const reportId = search.get('reportId');
	const reportType = search.get('reportType');
	const userData = useAppSelector((store) => store.userData);
	const navigate = useAppNavigate();
	const dispatch = useAppDispatch();
	const isLoading = useAppSelector((state) => state.constructorLoader.isLoading);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { t } = useI18n();

	const form = useForm<FormReportSchemaType>({
		resolver: zodResolver(FormReportConfig.schema),
		defaultValues: FormReportConfig.defaultValues,
	});

	useEffect(() => {
		if (!reportId) return;
		form.setValue('reportInfoId', reportId);
		from(getReportFormInfo(reportId))
			.pipe(
				catchError(() => {
					return [];
				}),
			)
			.subscribe((response) => {
				if (response.status === 200)
					form.setValue(
						'floorDocumentFlags',
						convertToClientReportFormFlags(response.data),
					);
				dispatch(stopLoading());
			});
	}, [reportId]);

	const submitReportWithLogo = async (action: 'download' | 'save') => {
		if (Object.keys(form.formState.errors).length) {
			toast.error(t('constructor.reportForm.fillForm'));
			return;
		}

		if (!reportId) return;

		setIsSubmitting(true);

		try {
			const formData = form.getValues();
			const logoFile = formData.logo;

			if (logoFile) {
				const logoResponse = await formReportLogo({
					reportInfoId: reportId,
					logo: logoFile,
				});

				if (logoResponse.status !== 200) {
					toast.error(t('constructor.reportForm.logoUploadError'));
					setIsSubmitting(false);
					return;
				}
			}

			const reportData = {
				...formData,
				reportInfoId: reportId,

				logo: undefined,
			};

			from(formReport(reportData))
				.pipe(
					catchError((error) => {
						console.error('Error submitting report:', error);
						return [];
					}),
					switchMap((response) => {
						if (response.status === 200) {
							const reportRequest =
								search.get('reportType') == ReportCategory.Floor
									? reportReceiveFloor(reportId)
									: reportReceiveSingle(reportId);

							return from(reportRequest).pipe(catchError(() => [null]));
						}
						return [null];
					}),
				)
				.subscribe((response) => {
					if (response?.status === 200) {
						if (action === 'download') {
							const link = document.createElement('a');
							link.href = response.data!;
							document.body.appendChild(link);
							link.click();
							document.body.removeChild(link);
							sessionStorage.removeItem('reportId');
							sessionStorage.removeItem('reportType');
						} else if (action === 'save') {
							navigate(
								APP_ROUTES.designing.route + '/' + DESIGNING_ROUTES.reports.route,
							);
							sessionStorage.setItem('reportId', reportId);
							sessionStorage.setItem('reportType', reportType as string);
						}
					}
					dispatch(stopLoading());
					setIsSubmitting(false);
				});
		} catch (error) {
			console.error('Error in submission:', error);
			toast.error(t('constructor.reportForm.submitError'));
			setIsSubmitting(false);
			dispatch(stopLoading());
		}
	};

	const handleDownloadReport = () => {
		submitReportWithLogo('download');
	};

	const handleSaveReport = () => {
		submitReportWithLogo('save');
	};

	return (
		<FormProvider {...form}>
			<div className="relative">
				{(isLoading || isSubmitting) && (
					<div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-white/60">
						<Loader />
					</div>
				)}
				<div className="flex size-full flex-col items-center gap-[50px] rounded-lg bg-white p-[50px]">
					<p className="font-sans text-lg font-semibold leading-4">
						{t('constructor.reportForm.title')}
					</p>
					<GeneralInfoForm />
					<DocumentFlags />
					<div className="flex w-full items-center justify-end gap-[50px]">
						<p>
							{t('constructor.reportForm.remainingReports')}:{' '}
							{userData.data?.reportsNumber || 0}
						</p>
						<Button onClick={handleDownloadReport} disabled={isLoading || isSubmitting}>
							{t('common.download')}
						</Button>
						<Button onClick={handleSaveReport} disabled={isLoading || isSubmitting}>
							{t('common.save')}
						</Button>
					</div>
				</div>
			</div>
		</FormProvider>
	);
};

export default ReportFromComponent;
