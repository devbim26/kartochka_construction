import { Button, FormElementLabel, useAppDispatch } from '@core';
import { svgConstructionDetail } from '@features/constructor/services';
import { startLoading, stopLoading } from '@features/constructor/store';
import { formatMaterial } from '@features/constructor/utils';
import { convertToClientConstructionsEditData } from '@features/guidbooks/converters';
import { getGuidebooksDetail } from '@features/guidbooks/services';
import type {
	AlternateConstruction,
	ConstructionsEditData,
	ConstructionTypeEnum,
} from '@features/guidbooks/types';
import { Guidebooks, RuConstructionTypesMap } from '@features/guidbooks/types';
import { useEffect, useState } from 'react';
import { catchError, from, of, tap } from 'rxjs';
import { toast } from 'sonner';
import {
	GeneralInformationFireResistance,
	GeneralInformationPhysical,
	GeneralInformationSoundproofing,
	GeneralInformationThermal,
} from '../modals';

type Props = {
	construction: AlternateConstruction;
};

export const AlternateConstructionCard = ({ construction }: Props) => {
	const dispatch = useAppDispatch();

	const [svgUrl, setSvgUrl] = useState<string | null>(null);
	const [constructionHeader, setConstructionHeader] = useState<ConstructionsEditData | null>(
		null,
	);
	const handleGetConstructionByHeaderId = (id: string) => {
		dispatch(startLoading());
		from(getGuidebooksDetail({ id: id, guidebookType: Guidebooks.CONSTRUCTION }))
			.pipe(
				tap((response) => {
					if (response.status === 200) {
						setConstructionHeader(convertToClientConstructionsEditData(response.data));
					}
				}),
				catchError((error) => {
					console.error('Ошибка запроса:', error);
					toast.error('Ошибка при получении информации о конструкции');
					return of(null);
				}),
			)
			.subscribe(() => dispatch(stopLoading()));
	};

	useEffect(() => {
		if (!construction || svgUrl) return;
		handleGetConstructionByHeaderId(construction.id);
		from(svgConstructionDetail(construction.id))
			.pipe(
				catchError((error) => {
					toast.error('Не удалось получить картинку');
					return [];
				}),
			)
			.subscribe((response) => {
				if (response.status === 200 && typeof response.data === 'string') {
					setSvgUrl(response.data);
				} else {
					toast.error('Неверный формат');
				}
			});
	}, [construction, svgUrl]);

	return (
		<div className="flex w-1/2 flex-col gap-[30px] rounded-xl bg-white px-[30px] py-[25px]">
			<div className="flex w-full items-center justify-between">
				<p className="font-sans text-lg font-semibold leading-4 text-black">
					{RuConstructionTypesMap[construction.constructionType as ConstructionTypeEnum]}
				</p>
				<Button
					className={
						'h-[40px] w-fit self-end bg-white px-[16px] font-sans text-sm font-semibold text-primary shadow-none ring-2 ring-inset ring-primary enabled:hover:bg-primary enabled:hover:text-white'
					}
					onClick={() => {}}
				>
					Сделать базовой
				</Button>
			</div>
			<div className="flex w-full items-center gap-[20px]">
				<div className="flex items-center gap-[20px]">
					<img
						src={construction.issuerLogo ? construction.issuerLogo : ''}
						alt="Превью изображения"
						className="h-[66px] w-[140px] rounded-md object-cover"
					/>
				</div>
				<p className="font-sans text-[14px] font-semibold leading-4 text-black">
					{construction.issuer.name}
				</p>
			</div>
			<div className="flex size-fit">
				{svgUrl && <img className="h-full w-[200px]" src={svgUrl} alt="SVG Construction" />}
				<div className="flex w-fit flex-col">
					{constructionHeader?.constructionTypeObject.constructions?.map(
						(construction: any, index) =>
							construction.userMaterials?.map((material: any, materialIndex: any) => (
								<p key={`${index}-${materialIndex}`} className="text-[16px]">
									- {formatMaterial(material)}
								</p>
							)),
					)}
				</div>
			</div>
			<div className="flex w-full flex-col gap-[10px]">
				<FormElementLabel className="text-left font-sans font-semibold leading-6 text-primary">
					Технические параметры
				</FormElementLabel>
				<GeneralInformationPhysical />
				<GeneralInformationSoundproofing />
				<GeneralInformationThermal />
				<GeneralInformationFireResistance />
			</div>
			<FormElementLabel className="text-left font-sans font-semibold leading-6 text-primary">
				Стоимость
			</FormElementLabel>
			<div className="flex flex-col gap-1">
				<p className="text-[22px]">2500 RUB/м²</p>
				<p className="font-sans text-[14px] italic">(ориентировочная)</p>
				<p className="font-sans text-[14px] italic text-primary">{'подробнее>>'}</p>
			</div>
			<Button variant="primary" className="self-end" onClick={() => {}}>
				Добавить в отчет
			</Button>
		</div>
	);
};
