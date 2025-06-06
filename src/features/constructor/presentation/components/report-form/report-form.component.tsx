import { Button } from '@core';
import { convertToClientReportFormFlags } from '@features/constructor/converters';
import { getReportFormInfo } from '@features/constructor/services';
import type { FormReportSchemaType } from '@features/constructor/utils';
import { FormReportConfig } from '@features/constructor/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { catchError, from } from 'rxjs';
import { DocumentFlags } from './document-flags.component';
import { GeneralInfoForm } from './general-info-form.component';

const ReportFromComponent = () => {
	const [search] = useSearchParams();
	const reportId = search.get('reportId');
	const form = useForm<FormReportSchemaType>({
		resolver: zodResolver(FormReportConfig.schema),
		defaultValues: FormReportConfig.defaultValues,
	});
	useEffect(() => {
		if (!reportId) return;
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
			});
	}, [reportId]);

	return (
		<FormProvider {...form}>
			<div className="flex size-full flex-col items-center gap-[50px] rounded-lg bg-white p-[50px]">
				<p className="font-sans text-lg font-semibold leading-4">Формирование отчета</p>
				<GeneralInfoForm />
				<DocumentFlags />
				<div className="flex w-full items-center justify-end gap-[50px]">
					<Button>Скачать</Button>
					<Button>Сохранить</Button>
				</div>
			</div>
		</FormProvider>
	);
};
export default ReportFromComponent;
