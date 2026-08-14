import {
	APP_ROUTES,
	Button,
	getAxiosErrorMessage,
	useAppDispatch,
	useAppNavigate,
	useAppSelector,
	useI18n,
} from '@core';
import { getCurrentUser } from '@features/account/services';
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
import {
	clearCalculationSession,
	clearProjectSession,
	FormReportConfig,
	persistCalculationSession,
	persistProjectSession,
} from '@features/constructor/utils';
import { DESIGNING_ROUTES } from '@features/home/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { catchError, from } from 'rxjs';
import { toast } from 'sonner';
import { DocumentFlags } from './document-flags.component';
import { GeneralInfoForm } from './general-info-form.component';

const resolveReportFileUrl = (data: unknown): string | null => {
	if (typeof data === 'string') {
		const trimmed = data.trim();
		if (!trimmed) return null;
		if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
			try {
				return resolveReportFileUrl(JSON.parse(trimmed));
			} catch {
				return null;
			}
		}
		return trimmed;
	}

	if (data && typeof data === 'object') {
		const record = data as Record<string, unknown>;
		for (const key of ['fileUrl', 'url', 'downloadUrl', 'file', 'link']) {
			const value = record[key];
			if (typeof value === 'string' && value.trim()) return value.trim();
		}
	}

	return null;
};

const triggerReportFileDownload = (url: string) => {
	const link = document.createElement('a');
	link.href = url;
	link.target = '_blank';
	link.rel = 'noopener noreferrer';
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
};

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

	const fallbackError = t('error.somethingWentWrong.title');

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

	const showRequestError = async (error: unknown) => {
		const message = await getAxiosErrorMessage(error, fallbackError);
		toast.error(message || fallbackError);
	};

	const submitReportWithLogo = async (action: 'download' | 'save') => {
		const isValid = await form.trigger();
		if (!isValid) {
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
					return;
				}
			}

			// Для одиночной конструкции сразу дергаем ReportReceiving/single,
			// без отдельного заполнения параметров как для поэтажного плана.
			if (reportType === ReportCategory.Single) {
				const response = await reportReceiveSingle(reportId);
				if (response.status !== 200) {
					toast.error(fallbackError);
					return;
				}

				if (action === 'download') {
					const fileUrl = resolveReportFileUrl(response.data as unknown);
					if (!fileUrl) {
						toast.error(fallbackError);
						return;
					}
					triggerReportFileDownload(fileUrl);
					clearCalculationSession();
					dispatch(getCurrentUser());
				} else {
					navigate(APP_ROUTES.designing.route + '/' + DESIGNING_ROUTES.reports.route);
					persistCalculationSession(reportId);
				}
				return;
			}

			const reportData = {
				...formData,
				reportInfoId: reportId,
				logo: undefined,
				floorDocumentFlags: {
					...formData.floorDocumentFlags,
					takeSupplementSoundInsulationAlternativeProtocols: false,
				},
			};

			const formResponse = await formReport(reportData);
			if (formResponse.status !== 200) {
				toast.error(fallbackError);
				return;
			}

			const receiveResponse = await reportReceiveFloor(reportId);
			if (receiveResponse.status !== 200) {
				toast.error(fallbackError);
				return;
			}

			if (action === 'download') {
				const fileUrl = resolveReportFileUrl(receiveResponse.data as unknown);
				if (!fileUrl) {
					toast.error(fallbackError);
					return;
				}
				triggerReportFileDownload(fileUrl);
				clearProjectSession();
				dispatch(getCurrentUser());
			} else {
				navigate(APP_ROUTES.designing.route + '/' + DESIGNING_ROUTES.reports.route);
				persistProjectSession(reportId);
			}
		} catch (error) {
			console.error('Error in report submission:', error);
			await showRequestError(error);
		} finally {
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
							{t('main.currentSub.remainingDownloads')}:{' '}
							{userData.data?.dowloadReportsNumber ?? 0}
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
