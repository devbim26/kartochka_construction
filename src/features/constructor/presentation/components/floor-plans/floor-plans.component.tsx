import { Button, DeleteIcon, DeleteModal } from '@core';
import { memoize, useAppNavigate } from '@core/utils';
import { getReportFloorById, getReportSingleById } from '@features/constructor/services';
import * as pdfjs from 'pdfjs-dist';
import { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa6';
import { useSearchParams } from 'react-router-dom';
import { catchError, from } from 'rxjs';
import {
	CreateConstructionForm,
	CreateConstructionModal,
	EditConstructionModal,
	GeneralInformationForm,
	GeneralInformationModal,
} from '../modals';
import { ConstructionSheets } from './constructions-sheet.component';
import { FloorPlanViewer } from './floor-plan-viewer.component';

export const FloorPlans = memoize(() => {
	const navigate = useAppNavigate();
	const [pdfDoc, setPdfDoc] = useState<pdfjs.PDFDocumentProxy | null>(null);
	const [search] = useSearchParams();
	const reportId = search.get('reportId');
	const [category, setCategory] = useState<string | null>(null);

	const handleUploadPdf = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
		const file = event.target.files?.[0];

		if (file && file.type === 'application/pdf') {
			const arrayBuffer = await file.arrayBuffer();
			const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
			setPdfDoc(pdf);
		}
	};

	useEffect(() => {
		if (!reportId) return;
		from(getReportSingleById({ id: reportId }))
			.pipe(
				catchError(() => {
					return from(getReportFloorById({ id: reportId }));
				}),
			)
			.subscribe((response) => {
				const reportCategory = response?.data?.category;
				if (reportCategory) {
					setCategory(reportCategory);
				}
			});
	}, [reportId]);

	return (
		<div className="flex flex-col gap-[36px]">
			<div className="flex flex-col rounded-xl bg-white">
				<div className="flex flex-col gap-[18px] border-b px-[24px] py-[18px]">
					<p className="font-sans text-lg font-semibold leading-4">Добавить уровень</p>
					<Button className="flex h-[28px] w-[100px] flex-row items-center bg-white px-[10px] py-[6px] font-sans font-semibold text-primary shadow-none ring-2 ring-inset ring-primary enabled:hover:bg-white">
						<FaPlus width={'16px'} height={'16px'} />
						0.000
						<DeleteIcon onClick={() => console.log(123)} withoutBg withoutBorder />
					</Button>
				</div>
				<div className="flex flex-col justify-center border-b">
					<div className="flex flex-col items-center">
						{pdfDoc ? (
							<FloorPlanViewer pdfFile={pdfDoc} />
						) : (
							<div className="flex h-[518px] flex-col items-center justify-center gap-[20px]">
								<Button
									className="h-[40px] w-[190px] px-[16px] text-[16px]"
									onClick={() => document.getElementById('pdf-upload')?.click()}
									disabled={category === 'Single'}
								>
									Загрузить план этажа
								</Button>
								<input
									type="file"
									id="pdf-upload"
									accept="application/pdf"
									onChange={handleUploadPdf}
									className="hidden"
								/>
								<p className="font-sans text-lg leading-4 text-input-border-primary">
									или
								</p>
								<Button
									onClick={() =>
										navigate(``, {
											create: 'true',
											reportId: reportId!,
										})
									}
									disabled={category === 'Floor'}
									className="h-[40px] w-[190px] bg-white px-[16px] text-[16px] text-primary ring-2 ring-inset ring-primary enabled:hover:bg-white"
								>
									Создать конструкцию
								</Button>
							</div>
						)}
					</div>
				</div>

				<div className="flex py-[30px]"></div>

				<CreateConstructionModal
					isOpen={!!search.get('create')}
					onCancel={() => window.history.back()}
					onClose={() => window.history.back()}
					onConfirm={() => window.history.back()}
					headerTitle="Добавление конструкции"
					className="!w-[1000px] md:!w-[900px]"
				>
					<CreateConstructionForm />
				</CreateConstructionModal>
				<GeneralInformationModal
					isOpen={!!search.get('info')}
					onCancel={() => navigate('')}
					onClose={() => navigate('')}
					headerTitle="Добавление конструкции"
					className="!w-[1000px] md:!w-[900px]"
				>
					<GeneralInformationForm />
				</GeneralInformationModal>
				<EditConstructionModal
					isOpen={!!search.get('edit')}
					onCancel={() => navigate('')}
					onClose={() => navigate('')}
					onConfirm={() => {
						navigate('');
					}}
					headerTitle="Редактирование конструкцию"
					className="!w-[1000px] md:!w-[900px]"
				>
					<CreateConstructionForm />
				</EditConstructionModal>
				<DeleteModal
					isOpen={!!search.get('delete')}
					onCancel={() => navigate('')}
					onClose={() => navigate('')}
					onConfirm={() => {
						navigate('');
					}}
					headerTitle="Подтвердите действие"
				>
					Вы уверены, что хотите удалить конструкцию?
				</DeleteModal>
			</div>
			<ConstructionSheets />
		</div>
	);
};

export default FloorPlansScreen;
