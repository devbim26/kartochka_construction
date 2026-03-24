import { Chevron, DeleteIcon, Input, Select } from '@core';
import type { AdditionalOpeningRow } from '@features/constructor/types';
import { getGuidebooksPaginated } from '@features/guidbooks/services';
import { Guidebooks } from '@features/guidbooks/types';
import {
	ConstructionTypeEnum as ApiConstructionType,
	type PaginatedConstructionHeaderDto,
} from '@api-gen';
import {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useMemo,
	useState,
} from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { twMerge } from 'tailwind-merge';

export type AdditionalOpeningsFormHandle = {
	getPayload: () => { windows: AdditionalOpeningRow[]; doors: AdditionalOpeningRow[] };
};

type FormValues = {
	additionalWindows: AdditionalOpeningRow[];
	additionalDoors: AdditionalOpeningRow[];
};

type SelectOption = { label: string; value: string };

type Props = {
	initialWindows?: AdditionalOpeningRow[];
	initialDoors?: AdditionalOpeningRow[];
	reportConstructionId?: string;
};

const emptyRow = (): AdditionalOpeningRow => ({
	constructionHeaderId: '',
	length: 0,
	height: 0,
	quantity: 0,
});

const fetchConstructionsByType = async (
	constructionType: ApiConstructionType,
): Promise<SelectOption[]> => {
	const response = await getGuidebooksPaginated({
		data: { constructionType },
		guidebookType: Guidebooks.CONSTRUCTION,
		pagination: { pageNumber: 1, pageSize: 500 },
	});
	const items = (response.data?.items ?? []) as PaginatedConstructionHeaderDto[];
	return items
		.filter((item): item is PaginatedConstructionHeaderDto & { id: string } => Boolean(item.id))
		.map((item) => ({
			label: item.name || item.shortName || item.id,
			value: item.id,
		}));
};

const mergeGlassConstructionOptions = async (): Promise<SelectOption[]> => {
	const [oneGlass, doubleGlass] = await Promise.all([
		fetchConstructionsByType(ApiConstructionType.OneGlassFrame),
		fetchConstructionsByType(ApiConstructionType.DoubleGlazedFrame),
	]);
	const byId = new Map<string, SelectOption>();
	[...oneGlass, ...doubleGlass].forEach((opt) => byId.set(opt.value, opt));
	return Array.from(byId.values());
};

export const AdditionalOpeningsForm = forwardRef<AdditionalOpeningsFormHandle, Props>(
	function AdditionalOpeningsForm(
		{ initialWindows = [], initialDoors = [], reportConstructionId }: Props,
		ref,
	) {
		const [windowsExpanded, setWindowsExpanded] = useState(true);
		const [doorsExpanded, setDoorsExpanded] = useState(true);
		const [doorOptions, setDoorOptions] = useState<SelectOption[]>([]);
		const [windowOptions, setWindowOptions] = useState<SelectOption[]>([]);

		const initialSignature = useMemo(
			() => JSON.stringify({ w: initialWindows, d: initialDoors }),
			[initialWindows, initialDoors],
		);

		const { control, reset, getValues } = useForm<FormValues>({
			defaultValues: {
				additionalWindows: initialWindows.length ? initialWindows : [],
				additionalDoors: initialDoors.length ? initialDoors : [],
			},
		});

		const {
			fields: windowFields,
			append: appendWindow,
			remove: removeWindow,
		} = useFieldArray({ control, name: 'additionalWindows' });

		const {
			fields: doorFields,
			append: appendDoor,
			remove: removeDoor,
		} = useFieldArray({ control, name: 'additionalDoors' });

		useEffect(() => {
			reset({
				additionalWindows: initialWindows.length ? [...initialWindows] : [],
				additionalDoors: initialDoors.length ? [...initialDoors] : [],
			});
		}, [reportConstructionId, initialSignature, reset]);

		useImperativeHandle(ref, () => ({
			getPayload: () => {
				const v = getValues();
				return {
					windows: v.additionalWindows || [],
					doors: v.additionalDoors || [],
				};
			},
		}));

		useEffect(() => {
			let cancelled = false;
			(async () => {
				try {
					const doors = await fetchConstructionsByType(ApiConstructionType.Door);
					if (!cancelled) setDoorOptions(doors);
					const wins = await mergeGlassConstructionOptions();
					if (!cancelled) setWindowOptions(wins);
				} catch {
					if (!cancelled) {
						setDoorOptions([]);
						setWindowOptions([]);
					}
				}
			})();
			return () => {
				cancelled = true;
			};
		}, []);

		const inlineLabelClass =
			'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-nowrap text-input-label-primary';
		const inlineInputClass =
			'py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] w-[78px]';
		const openingSelectLabelClass =
			'text-sm leading-5 tracking-[0.1px] text-nowrap w-[226px] text-input-label-primary';

		const renderLayerBlock = (
			kind: 'windows' | 'doors',
			fieldId: string,
			index: number,
			options: SelectOption[],
			onRemove: () => void,
		) => {
			const prefix = kind === 'windows' ? 'additionalWindows' : 'additionalDoors';
			const openingLabel = kind === 'windows' ? 'Окно' : 'Дверь';
			const openingPlaceholder =
				kind === 'windows' ? 'Выберите окно' : 'Выберите дверь';

			return (
				<div key={fieldId} className="flex w-full items-start justify-between">
					<div className="flex min-w-0 flex-1 flex-wrap items-center gap-[20px] lg:flex-nowrap">
						<div className="flex flex-wrap gap-[16px]">
							<Controller
								name={`${prefix}.${index}.constructionHeaderId` as const}
								control={control}
								render={({ field }) => (
									<Select
										label={openingLabel}
										labelClassName={openingSelectLabelClass}
										wrapperClassname="flex-row ring-input-border-primary items-center gap-[16px]"
										buttonClassName="text-sm rounded-[8px] w-[226px]"
										isSearchable
										value={field.value || ''}
										onChange={(v) => field.onChange(v)}
										options={options}
										placeholder={openingPlaceholder}
									/>
								)}
							/>
						</div>
						<div className="flex flex-wrap items-center gap-[8px]">
							<Controller
								name={`${prefix}.${index}.height` as const}
								control={control}
								render={({ field }) => (
									<Input
										label="Высота, мм"
										labelClassName={inlineLabelClass}
										wrapperClassName="flex-row items-center gap-[16px]"
										inputClassName={inlineInputClass}
										type="number"
										name={field.name}
										onBlur={field.onBlur}
										ref={field.ref}
										value={field.value === 0 ? '' : String(field.value)}
										onChange={(e) =>
											field.onChange(e.target.value === '' ? 0 : Number(e.target.value))
										}
									/>
								)}
							/>
							<Controller
								name={`${prefix}.${index}.length` as const}
								control={control}
								render={({ field }) => (
									<Input
										label="Ширина, мм"
										labelClassName={inlineLabelClass}
										wrapperClassName="flex-row items-center gap-[16px]"
										inputClassName={inlineInputClass}
										type="number"
										name={field.name}
										onBlur={field.onBlur}
										ref={field.ref}
										value={field.value === 0 ? '' : String(field.value)}
										onChange={(e) =>
											field.onChange(e.target.value === '' ? 0 : Number(e.target.value))
										}
									/>
								)}
							/>
							<Controller
								name={`${prefix}.${index}.quantity` as const}
								control={control}
								render={({ field }) => (
									<Input
										label="Кол-во, шт"
										labelClassName={inlineLabelClass}
										wrapperClassName="flex-row items-center gap-[16px]"
										inputClassName={inlineInputClass}
										type="number"
										name={field.name}
										onBlur={field.onBlur}
										ref={field.ref}
										value={field.value === 0 ? '' : String(field.value)}
										onChange={(e) =>
											field.onChange(e.target.value === '' ? 0 : Number(e.target.value))
										}
									/>
								)}
							/>
						</div>
					</div>
					<DeleteIcon className="shrink-0 self-start" onClick={onRemove} />
				</div>
			);
		};

		return (
			<div className="flex w-full flex-col gap-8 border-t border-input-border-primary pt-8">
				<section>
					<div className="flex items-center justify-center gap-2">
						<button
							type="button"
							className="text-center text-[18px] font-semibold text-primary"
							onClick={() => setWindowsExpanded((v) => !v)}
						>
							Добавить окно
						</button>
						<Chevron
							direction={windowsExpanded ? 'up' : 'down'}
							color="primary"
							className="size-8 shrink-0"
							onClick={() => setWindowsExpanded((v) => !v)}
						/>
					</div>
					<div
						className={twMerge(
							'grid transition-[grid-template-rows] duration-300 ease-in-out',
							windowsExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
						)}
					>
						<div className="min-h-0 overflow-hidden">
							<div className="flex flex-col gap-[24px] pt-4">
								{windowFields.map((f, i) =>
									renderLayerBlock('windows', f.id, i, windowOptions, () =>
										removeWindow(i),
									),
								)}
								<div className="flex justify-center">
									<button
										type="button"
										className="text-primary"
										aria-label="Добавить слой"
										onClick={() => appendWindow(emptyRow())}
									>
										<AiOutlinePlusCircle className="size-[40px] text-primary" />
									</button>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section>
					<div className="flex items-center justify-center gap-2">
						<button
							type="button"
							className="text-center text-[18px] font-semibold text-primary"
							onClick={() => setDoorsExpanded((v) => !v)}
						>
							Добавить дверь
						</button>
						<Chevron
							direction={doorsExpanded ? 'up' : 'down'}
							color="primary"
							className="size-8 shrink-0"
							onClick={() => setDoorsExpanded((v) => !v)}
						/>
					</div>
					<div
						className={twMerge(
							'grid transition-[grid-template-rows] duration-300 ease-in-out',
							doorsExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
						)}
					>
						<div className="min-h-0 overflow-hidden">
							<div className="flex flex-col gap-[24px] pt-4">
								{doorFields.map((f, i) =>
									renderLayerBlock('doors', f.id, i, doorOptions, () => removeDoor(i)),
								)}
								<div className="flex justify-center">
									<button
										type="button"
										className="text-primary"
										aria-label="Добавить слой"
										onClick={() => appendDoor(emptyRow())}
									>
										<AiOutlinePlusCircle className="size-[40px] text-primary" />
									</button>
								</div>
							</div>
						</div>
					</div>
				</section>
			</div>
		);
	},
);
