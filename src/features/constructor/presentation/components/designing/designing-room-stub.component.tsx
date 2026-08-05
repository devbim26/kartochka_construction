import {
	Button,
	DeleteIcon,
	FormElementLabel,
	Input,
	Select,
	useI18n,
	type SelectOption,
} from '@core';
import { useCallback, useMemo, useState } from 'react';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';
import { FloatingCalculateButton } from '../floating-calculate-button.component';
import { DesigningHeader } from './designing-header.component';

type RoomSurfaceTab = 'wallA' | 'wallB' | 'wallC' | 'wallD' | 'ceiling' | 'floor';

type DimKey = 'a1' | 'a2' | 'a3' | 'a4' | 'a5' | 'a6' | 'b1' | 'b2';

type ConstructionRow = { id: string; constructionKey: string; area: string };

const DIM_KEYS: DimKey[] = ['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'b1', 'b2'];

const DIM_LABEL_KEY: Record<
	DimKey,
	| 'constructor.designing.room.dim.a1'
	| 'constructor.designing.room.dim.a2'
	| 'constructor.designing.room.dim.a3'
	| 'constructor.designing.room.dim.a4'
	| 'constructor.designing.room.dim.a5'
	| 'constructor.designing.room.dim.a6'
	| 'constructor.designing.room.dim.b1'
	| 'constructor.designing.room.dim.b2'
> = {
	a1: 'constructor.designing.room.dim.a1',
	a2: 'constructor.designing.room.dim.a2',
	a3: 'constructor.designing.room.dim.a3',
	a4: 'constructor.designing.room.dim.a4',
	a5: 'constructor.designing.room.dim.a5',
	a6: 'constructor.designing.room.dim.a6',
	b1: 'constructor.designing.room.dim.b1',
	b2: 'constructor.designing.room.dim.b2',
};

const SURFACE_TOTAL_M2 = 150;

/**
 * Как в `materials-add-edit.component.tsx`: компактные поля, сетка flex-wrap gap-[16px].
 */
const MATERIAL_LABEL_CLASS =
	'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary';
const MATERIAL_INPUT_CLASS =
	'py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]';
const MATERIAL_FIELD_W = 'w-[226px]';

const MATERIAL_SELECT_LABEL = 'text-sm leading-5 tracking-[0.1px]';
const MATERIAL_SELECT_WRAPPER = `${MATERIAL_FIELD_W} ring-input-border-primary`;
const MATERIAL_SELECT_BUTTON = 'text-sm rounded-[8px]';

/** Компактные размерности a1–b2 (уже стандартного поля материалов) */
const DIM_FIELD_W = 'w-[88px]';

/** Как табы «Стены / Полы / Помещения» на поэтажных планах и кнопки в шапке конструктора */
const CONSTRUCTOR_TAB_ACTIVE =
	'flex h-[30px] flex-row items-center px-[16px] font-sans text-sm font-semibold shadow-none';
const CONSTRUCTOR_TAB_INACTIVE =
	'flex h-[30px] flex-row items-center px-[16px] font-sans text-sm font-semibold shadow-none bg-white text-primary ring-[2px] ring-inset ring-primary enabled:hover:bg-white';

const SCHEMA_NAV_BUTTON =
	'flex size-[28px] shrink-0 items-center justify-center bg-white p-0 shadow-none ring-1 ring-inset ring-input-border-primary text-primary enabled:hover:bg-gray-50';

const newRowId = () =>
	typeof crypto !== 'undefined' && crypto.randomUUID
		? crypto.randomUUID()
		: `row-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const DesigningRoomStubScreen = () => {
	const { t } = useI18n();
	const [roomName, setRoomName] = useState('');
	const [roomType, setRoomType] = useState('hall');
	const [activeTab, setActiveTab] = useState<RoomSurfaceTab>('wallA');
	const [dims, setDims] = useState<Record<DimKey, string>>(() =>
		DIM_KEYS.reduce(
			(acc, k) => {
				acc[k] = '13';
				return acc;
			},
			{} as Record<DimKey, string>,
		),
	);
	const [seats, setSeats] = useState('13');
	const [airVolume, setAirVolume] = useState('1500');
	const [roomArea] = useState('150');
	const [rowsBySurface, setRowsBySurface] = useState<Record<RoomSurfaceTab, ConstructionRow[]>>(
		() => ({
			wallA: [{ id: newRowId(), constructionKey: 'brick', area: '13' }],
			wallB: [],
			wallC: [],
			wallD: [],
			ceiling: [],
			floor: [],
		}),
	);

	const roomTypeOptions: SelectOption[] = useMemo(
		() => [{ label: t('constructor.designing.room.typeHall'), value: 'hall' }],
		[t],
	);

	const constructionOptions: SelectOption[] = useMemo(
		() => [
			{ label: t('constructor.designing.room.constructionBrick'), value: 'brick' },
			{ label: t('constructor.designing.room.constructionConcrete'), value: 'concrete' },
		],
		[t],
	);

	const tabDefs = useMemo(
		() =>
			[
				{ id: 'wallA' as const, labelKey: 'constructor.designing.room.tab.wallA' as const },
				{ id: 'wallB' as const, labelKey: 'constructor.designing.room.tab.wallB' as const },
				{ id: 'wallC' as const, labelKey: 'constructor.designing.room.tab.wallC' as const },
				{ id: 'wallD' as const, labelKey: 'constructor.designing.room.tab.wallD' as const },
				{
					id: 'ceiling' as const,
					labelKey: 'constructor.designing.room.tab.ceiling' as const,
				},
				{ id: 'floor' as const, labelKey: 'constructor.designing.room.tab.floor' as const },
			] as const,
		[],
	);

	const rows = rowsBySurface[activeTab];

	const balanceM2 = useMemo(() => {
		const used = rows.reduce((sum, r) => sum + (parseFloat(r.area.replace(',', '.')) || 0), 0);
		return SURFACE_TOTAL_M2 - used;
	}, [rows]);

	const updateRow = useCallback(
		(id: string, patch: Partial<Pick<ConstructionRow, 'constructionKey' | 'area'>>) => {
			setRowsBySurface((prev) => ({
				...prev,
				[activeTab]: prev[activeTab].map((r) => (r.id === id ? { ...r, ...patch } : r)),
			}));
		},
		[activeTab],
	);

	const removeRow = useCallback(
		(id: string) => {
			setRowsBySurface((prev) => ({
				...prev,
				[activeTab]: prev[activeTab].filter((r) => r.id !== id),
			}));
		},
		[activeTab],
	);

	const addRow = useCallback(() => {
		setRowsBySurface((prev) => ({
			...prev,
			[activeTab]: [
				...prev[activeTab],
				{ id: newRowId(), constructionKey: 'brick', area: '' },
			],
		}));
	}, [activeTab]);

	const defaultNamePlaceholder = t('constructor.designing.room.typeHall');

	return (
		<div className="relative flex w-full flex-col gap-[24px]">
			<DesigningHeader />
			<div className="flex w-full flex-col gap-[16px] rounded-[20px] bg-white px-[24px] py-[20px] sm:px-[32px] sm:py-[24px] lg:px-[44px] lg:py-[28px]">
				<h1 className="font-sans text-lg font-semibold leading-6 text-primary">
					{t('constructor.designing.room.title')}
				</h1>

				<div className="flex flex-col gap-[12px] border-b border-gray-100 pb-[16px]">
					<div className="flex flex-col gap-[20px]">
						<Input
							label={t('constructor.designing.room.name')}
							value={roomName}
							onChange={(e) => setRoomName(e.target.value)}
							placeholder={defaultNamePlaceholder}
							labelClassName={MATERIAL_LABEL_CLASS}
							inputClassName={MATERIAL_INPUT_CLASS}
							containerClassName={MATERIAL_FIELD_W}
						/>
						<Select
							options={roomTypeOptions}
							value={roomType}
							onChange={(v) => setRoomType(String(v))}
							label={t('constructor.designing.room.type')}
							labelClassName={MATERIAL_SELECT_LABEL}
							buttonClassName={MATERIAL_SELECT_BUTTON}
							wrapperClassname={MATERIAL_SELECT_WRAPPER}
							disablePlaceholder
						/>
					</div>
				</div>

				<div className="flex flex-col gap-[16px] lg:flex-row lg:items-start lg:gap-[24px]">
					<div className="flex w-full max-w-[min(100%,420px)] flex-col gap-y-2 lg:shrink-0">
						<FormElementLabel className={MATERIAL_LABEL_CLASS}>
							{t('constructor.designing.room.schema')}
						</FormElementLabel>
						<div className="relative flex min-h-[200px] flex-col items-center justify-center rounded-[8px] bg-white px-3 py-6 text-center ring-1 ring-inset ring-input-border-primary">
							<p className="max-w-[260px] font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary">
								{t('constructor.designing.room.schemaPlaceholder')}
							</p>
							<div className="mt-4 flex items-center gap-[12px]">
								<Button
									type="button"
									className={SCHEMA_NAV_BUTTON}
									aria-label="prev view"
								>
									<IoChevronBack className="size-4" />
								</Button>
								<Button
									type="button"
									className={SCHEMA_NAV_BUTTON}
									aria-label="next view"
								>
									<IoChevronForward className="size-4" />
								</Button>
							</div>
						</div>
					</div>

					<div className="flex min-w-0 flex-1 flex-col gap-[16px]">
						<div className="flex flex-row flex-wrap gap-[20px]">
							{tabDefs.map((tab) => (
								<Button
									key={tab.id}
									type="button"
									onClick={() => setActiveTab(tab.id)}
									className={twMerge(
										activeTab === tab.id
											? CONSTRUCTOR_TAB_ACTIVE
											: CONSTRUCTOR_TAB_INACTIVE,
									)}
								>
									{t(tab.labelKey)}
								</Button>
							))}
						</div>

						<div className="flex flex-wrap gap-[12px]">
							{DIM_KEYS.map((key) => (
								<Input
									key={key}
									label={t(DIM_LABEL_KEY[key])}
									value={dims[key]}
									onChange={(e) =>
										setDims((d) => ({ ...d, [key]: e.target.value }))
									}
									labelClassName={MATERIAL_LABEL_CLASS}
									inputClassName={MATERIAL_INPUT_CLASS}
									containerClassName={DIM_FIELD_W}
								/>
							))}
						</div>

						<div className="flex flex-wrap gap-[16px]">
							<Input
								label={t('constructor.designing.room.seats')}
								value={seats}
								onChange={(e) => setSeats(e.target.value)}
								labelClassName={MATERIAL_LABEL_CLASS}
								inputClassName={MATERIAL_INPUT_CLASS}
								containerClassName={MATERIAL_FIELD_W}
							/>
							<Input
								label={t('constructor.designing.room.airVolume')}
								value={airVolume}
								onChange={(e) => setAirVolume(e.target.value)}
								labelClassName={MATERIAL_LABEL_CLASS}
								inputClassName={MATERIAL_INPUT_CLASS}
								containerClassName={MATERIAL_FIELD_W}
							/>
							<Input
								label={t('constructor.designing.room.area')}
								value={roomArea}
								readOnly
								labelClassName={MATERIAL_LABEL_CLASS}
								inputClassName={twMerge(
									MATERIAL_INPUT_CLASS,
									'cursor-not-allowed bg-gray-50',
								)}
								containerClassName={MATERIAL_FIELD_W}
							/>
						</div>

						<div className="flex flex-col gap-[12px]">
							{rows.map((row) => (
								<div
									key={row.id}
									className="flex flex-wrap items-end gap-[16px] border-b border-gray-100 pb-[16px] last:mb-0 last:border-b-0 last:pb-0"
								>
									<Select
										options={constructionOptions}
										value={row.constructionKey}
										onChange={(v) =>
											updateRow(row.id, { constructionKey: String(v) })
										}
										label={t('constructor.designing.room.construction')}
										labelClassName={MATERIAL_SELECT_LABEL}
										buttonClassName={MATERIAL_SELECT_BUTTON}
										wrapperClassname="min-w-[200px] max-w-[320px] flex-1 ring-input-border-primary sm:min-w-[226px]"
										disablePlaceholder
									/>
									<Input
										label={t('constructor.designing.room.constructionArea')}
										value={row.area}
										onChange={(e) =>
											updateRow(row.id, { area: e.target.value })
										}
										labelClassName={MATERIAL_LABEL_CLASS}
										inputClassName={MATERIAL_INPUT_CLASS}
										containerClassName="w-[112px]"
									/>
									<div className="flex pb-[2px]">
										<DeleteIcon
											withoutBg
											withoutBorder
											onClick={() => removeRow(row.id)}
										/>
									</div>
								</div>
							))}
							<div className="flex flex-row flex-wrap items-center gap-[20px] pt-[4px]">
								<p className="font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary">
									{t('constructor.designing.room.balance')}:{' '}
									<span
										className={twMerge(
											'font-semibold',
											balanceM2 >= 0 ? 'text-green-600' : 'text-error',
										)}
									>
										{balanceM2 >= 0 ? '+' : ''}
										{balanceM2.toLocaleString(undefined, {
											maximumFractionDigits: 2,
										})}
									</span>
								</p>
								<AiOutlinePlusCircle
									className="size-[40px] cursor-pointer self-center text-primary"
									aria-label={t('constructor.designing.room.addConstructionRow')}
									onClick={addRow}
								/>
							</div>
						</div>
					</div>
				</div>

				<div className="flex justify-end pt-[4px]">
					<FloatingCalculateButton
						onClick={() =>
							toast.info(t('constructor.designing.room.calculateStubToast'))
						}
					>
						{t('constructor.designing.room.calculate')}
					</FloatingCalculateButton>
				</div>
			</div>
		</div>
	);
};
