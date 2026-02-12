import { Button, FormElementLabel, useAppDispatch } from '@core';
import { svgConstructionDetail } from '@features/constructor/services';
import { startLoading, stopLoading } from '@features/constructor/store';
import type { ReportInfoShort } from '@features/constructor/utils';
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
	reportInfo: ReportInfoShort;
};

export const AlternateConstructionCard = ({ construction, reportInfo }: Props) => {
	const dispatch = useAppDispatch();

	const [svgUrl, setSvgUrl] = useState<string | null>(null);
	const [constructionHeader, setConstructionHeader] = useState<ConstructionsEditData | null>(
		null,
	);
	const [thickness, setThickness] = useState<number>(0);
	const [mass, setMass] = useState<number>(0);
	const [density, setDensity] = useState<number>(0);

	useEffect(() => {
		if (!constructionHeader) return;

		const allMaterials = [
			...(constructionHeader.constructionTypeObject.leftConstruction || []),
			...(constructionHeader.constructionTypeObject.centerConstruction || []),
			...(constructionHeader.constructionTypeObject.rightConstruction || []),
		];

		const thicknessValues = allMaterials
			.flatMap((m) => m.materialTypeValue || [])
			.filter((v) => v.materialParameters === 'Thickness')
			.map((v) => Number(v.value) || 0);

		const densityValues = allMaterials
			.flatMap((m) => m.materialTypeValue || [])
			.filter((v) => v.materialParameters === 'Density')
			.map((v) => Number(v.value) || 0);

		const totalThickness = thicknessValues.reduce((acc, val) => acc + val, 0);
		const avgDensity = densityValues.length
			? densityValues.reduce((acc, val) => acc + val, 0) / densityValues.length
			: 0;

		setThickness(totalThickness);
		setDensity(avgDensity);
	}, [constructionHeader]);

	useEffect(() => {
		if (!thickness || !density || !construction) return;

		const square = 100;
		if (!square) return;

		const calculatedMass = (square * thickness * density) / 1000;
		setMass(calculatedMass);
	}, [thickness, density, construction]);

	const handleGetConstructionByHeaderId = (id: string) => {
		dispatch(startLoading());
		from(getGuidebooksDetail({ id, guidebookType: Guidebooks.CONSTRUCTION }))
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
					className="h-[40px] w-fit self-end bg-white px-[16px] font-sans text-sm font-semibold text-primary shadow-none ring-2 ring-inset ring-primary enabled:hover:bg-primary enabled:hover:text-white"
					onClick={() => {}}
				>
					Сделать базовой
				</Button>
			</div>

			<div className="flex w-full items-center gap-[20px]">
				<div className="flex items-center gap-[20px]">
					<img
						src={construction.issuerLogo || ''}
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
					{[
						...(constructionHeader?.constructionTypeObject.leftConstruction || []),
						...(constructionHeader?.constructionTypeObject.centerConstruction || []),
						...(constructionHeader?.constructionTypeObject.rightConstruction || []),
					].map((material: any, index: number) => (
						<p key={index} className="text-[16px]">
							- {formatMaterial(material)}
						</p>
					))}
				</div>
			</div>

			<div className="flex w-full flex-col gap-[10px]">
				<FormElementLabel className="text-left font-sans font-semibold leading-6 text-primary">
					Технические параметры
				</FormElementLabel>
				<GeneralInformationPhysical
					data={[
						{
							physical: 'Толщина, мм',
							values: String(thickness) || '-',
							requirements: '?',
						},
						{
							physical: 'Масса, кг/м²',
							values: String(mass) || '-',
							requirements: '?',
						},
						{
							physical: 'Высота, м',
							values: String(constructionHeader?.maxHeight) || '-',
							requirements: String(constructionHeader?.maxHeight) || '-',
						},
					]}
				/>
				<GeneralInformationSoundproofing
					data={[
						{
							label: 'Расчёт',
							soundproofing: 'Rw, dB',
							values: String(constructionHeader?.labIndexValue) || '-',
							requirements:
								reportInfo?.regulatoryRequirement?.noizeIsolationIndex || '-',
						},
						{
							label: 'Лаб.тест',
							soundproofing: 'Rw, dB',
							values: String(constructionHeader?.RCalcs) || '-',
							requirements:
								reportInfo?.regulatoryRequirement?.noizeIsolationIndex || '-',
						},
					]}
				/>
				<GeneralInformationThermal />
				<GeneralInformationFireResistance />
			</div>

			<Button variant="primary" className="self-end" onClick={() => {}}>
				Добавить в отчет
			</Button>
		</div>
	);
};
