import { Button, DeleteIcon, useAppSelector } from '@core';
import { memoize } from '@core/utils';
import * as pdfjs from 'pdfjs-dist';
import { useState } from 'react';
import { FaPlus } from 'react-icons/fa6';
import {
	AddConstructionForm,
	AddConstructionModal,
	CreateConstructionForm,
	CreateConstructionModal,
} from '../modals';
import { FloorPlanViewer } from './floor-plan-viewer.component';

export const FloorPlans = memoize(() => {
	const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
	const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

	const handleUploadPdf = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
		const file = event.target.files?.[0];

		if (file && file.type === 'application/pdf') {
			const arrayBuffer = await file.arrayBuffer();
			const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
			setPdfDoc(pdf);
		}
	};

	const [pdfDoc, setPdfDoc] = useState<pdfjs.PDFDocumentProxy | null>(null);

	const aboutBuildingData = useAppSelector((store) => store.constructorData);

	return (
		<div className="flex flex-col rounded-xl bg-white">
			<div className="flex flex-col gap-[18px] border-b px-[24px] py-[18px]">
				<p className="font-sans text-lg font-semibold leading-4">Добавить уровень</p>
				<Button
					className="flex h-[28px] w-[100px] flex-row items-center bg-white px-[10px] py-[6px] font-sans font-semibold text-primary shadow-none ring-2 ring-inset ring-primary enabled:hover:bg-white"
					onClick={() => setIsAddModalOpen(true)}
				>
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
								//disabled={!aboutBuildingData?.data?.isFloorPlan}
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
							<Button className="h-[40px] w-[190px] bg-white px-[16px] text-[16px] text-primary ring-2 ring-inset ring-primary enabled:hover:bg-white">
								Создать конструкцию
							</Button>
						</div>
					)}
				</div>
			</div>
			<div className="flex py-[30px]"></div>
			<AddConstructionModal
				isOpen={isAddModalOpen}
				onCancel={() => setIsAddModalOpen(false)}
				onClose={() => setIsAddModalOpen(false)}
				onConfirm={() => {
					setIsAddModalOpen(false);
				}}
				headerTitle="Добавить конструкцию"
				className="!w-[1000px] md:!w-[900px]"
			>
				<AddConstructionForm />
			</AddConstructionModal>
			<CreateConstructionModal
				isOpen={isCreateModalOpen}
				onCancel={() => setIsCreateModalOpen(false)}
				onClose={() => setIsCreateModalOpen(false)}
				onConfirm={() => {
					setIsCreateModalOpen(false);
				}}
				headerTitle="Добавить конструкцию"
				className="!w-[1000px] md:!w-[900px]"
			>
				<CreateConstructionForm />
			</CreateConstructionModal>
		</div>
	);
}, 'FloorPlans');
