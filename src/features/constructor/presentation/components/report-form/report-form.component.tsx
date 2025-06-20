import { Button, useAppDispatch, useAppSelector } from '@core';
import Loader from '@core/presentation/components/loaders/loader.component';
import { convertToClientReportFormFlags } from '@features/constructor/converters';
import { formReport, getReportFormInfo, reportReceive } from '@features/constructor/services';
import { stopLoading } from '@features/constructor/store';
import type { FormReportSchemaType } from '@features/constructor/utils';
import { FormReportConfig } from '@features/constructor/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { catchError, from } from 'rxjs';
import { toast } from 'sonner';
import { DocumentFlags } from './document-flags.component';
import { GeneralInfoForm } from './general-info-form.component';

const ReportFromComponent = () => {
	const [search] = useSearchParams();
	const reportId = search.get('reportId');
	const dispatch = useAppDispatch();
	const isLoading = useAppSelector((state) => state.constructorLoader.isLoading);

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
						'floorDocumentsFlags',
						convertToClientReportFormFlags(response.data),
					);
				dispatch(stopLoading());
			});
	}, [reportId]);

	const handleDownloadReport = () => {
		if (!Object.keys(form.formState.errors).length) {
			if (!reportId) return;
			from(formReport({ ...form.getValues(), reportInfoId: reportId }))
				.pipe(
					catchError(() => {
						return [];
					}),
				)
				.subscribe((response) => {
					if (response.status === 200)
						from(reportReceive(reportId))
							.pipe(
								catchError(() => {
									return [null];
								}),
							)
							.subscribe((response) => {
								if (response?.status === 200) {
									const link = document.createElement('a');
									link.href = response.data!;
									document.body.appendChild(link);
									link.click();
									document.body.removeChild(link);
								}
								dispatch(stopLoading());
							});
				});
		} else {
			toast.error('Заполните форму');
		}
	};

	return (
		<FormProvider {...form}>
			<div className="relative">
				{isLoading && (
					<div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-white/60">
						<Loader />
					</div>
				)}
				<div className="flex size-full flex-col items-center gap-[50px] rounded-lg bg-white p-[50px]">
					<p className="font-sans text-lg font-semibold leading-4">Формирование отчета</p>
					<GeneralInfoForm />
					<DocumentFlags />
					<div className="flex w-full items-center justify-end gap-[50px]">
						<Button onClick={() => form.handleSubmit(handleDownloadReport)()}>
							Скачать
						</Button>
						<Button>Сохранить</Button>
					</div>
				</div>
			</div>
		</FormProvider>
	);
};
export default ReportFromComponent;
