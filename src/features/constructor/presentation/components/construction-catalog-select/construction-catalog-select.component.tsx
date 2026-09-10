import { useI18n, type SelectOption } from '@core';
import { ChevronIcon } from '@core/presentation/icons';
import Loader from '@core/presentation/components/loaders/loader.component';
import { memoize } from '@core/utils/hoc/memo.utils';
import { useCallback, useMemo } from 'react';
import SelectUI, {
	components,
	type ClassNamesConfig,
	type GroupBase,
	type MenuListProps,
	type PlaceholderProps,
	type SingleValue,
	type SingleValueProps,
	type StylesConfig,
} from 'react-select';
import { twMerge } from 'tailwind-merge';

type Props = {
	typeOptions: SelectOption[];
	typeFilter: string;
	onTypeFilterChange: (value: string) => void;
	constructionOptions: SelectOption[];
	constructionValue: string;
	onConstructionChange: (value: string) => void;
	loading?: boolean;
	className?: string;
};

const CONTROL_CLASS =
	'relative flex min-h-[50px] w-full items-center rounded-[8px] bg-white px-3 py-[10px] font-sans text-base leading-5 tracking-[0.1px] ring-1 ring-inset ring-input-border-primary';

const selectStyles: StylesConfig<SelectOption, false, GroupBase<SelectOption>> = {
	control: (base) => ({
		...base,
		minHeight: '50px',
		':hover': { cursor: 'pointer' },
	}),
	menu: (base) => ({
		...base,
		backgroundColor: 'white',
	}),
	menuPortal: (base) => ({
		...base,
		zIndex: 50,
	}),
	valueContainer: (base) => ({
		...base,
		padding: 0,
		display: 'flex',
		alignItems: 'center',
	}),
	input: (base) => ({
		...base,
		margin: 0,
		padding: 0,
	}),
	indicatorsContainer: (base) => ({
		...base,
		alignSelf: 'center',
	}),
};

export const ConstructionCatalogSelect = memoize(
	({
		typeOptions,
		typeFilter,
		onTypeFilterChange,
		constructionOptions,
		constructionValue,
		onConstructionChange,
		loading = false,
		className,
	}: Props) => {
		const { t, locale } = useI18n();
		const placeholder = t('createConstruction.construction.placeholder');

		const typeFilterChips = useMemo<SelectOption[]>(
			() => [
				{
					label: locale === 'ru' ? 'Все типы' : 'All types',
					value: '',
				},
				...typeOptions,
			],
			[locale, typeOptions],
		);

		const options = useMemo(
			() => [{ value: '', label: placeholder }, ...constructionOptions],
			[constructionOptions, placeholder],
		);

		const currentOption = useMemo(
			() =>
				options.find(
					(option) =>
						option.value === constructionValue ||
						String(option.value) === String(constructionValue),
				),
			[constructionValue, options],
		);

		const activeTypeLabel = useMemo(() => {
			if (!typeFilter) return '';
			return (
				typeFilterChips.find((chip) => String(chip.value) === String(typeFilter))
					?.label ?? ''
			);
		}, [typeFilter, typeFilterChips]);

		const classNames = useMemo(
			(): ClassNamesConfig<SelectOption, false, GroupBase<SelectOption>> => ({
				container: () => 'relative w-full',
				control: (state) =>
					twMerge(
						CONTROL_CLASS,
						state.isFocused && 'ring-2 ring-primary',
						state.isDisabled && 'bg-gray-100',
					),
				valueContainer: () => 'flex min-w-0 flex-1 items-center gap-1 py-0',
				singleValue: () =>
					'm-0 flex min-w-0 max-w-full items-center font-sans text-base leading-5 tracking-[0.1px] text-black',
				placeholder: () =>
					'm-0 truncate font-sans text-base leading-5 tracking-[0.1px] text-input-label-primary',
				input: () =>
					'm-0 font-sans text-base leading-5 tracking-[0.1px] text-black caret-primary',
				indicatorsContainer: () => 'flex shrink-0 items-center self-center pl-2',
				indicatorSeparator: () => 'hidden',
				dropdownIndicator: () => 'flex items-center justify-center text-gray-500',
				menu: () =>
					'mt-1 min-w-full overflow-hidden rounded-[8px] bg-white shadow-lg ring-1 ring-black/5',
				menuList: () => 'max-h-[360px] py-1',
				option: (state) =>
					twMerge(
						'flex min-h-[44px] w-full items-center truncate px-3 py-2.5 font-sans text-base leading-5 tracking-[0.1px]',
						state.isDisabled
							? 'cursor-not-allowed bg-gray-50 text-gray-400'
							: 'cursor-pointer hover:bg-primary hover:text-white',
						!state.isDisabled && state.isSelected && 'bg-primary text-white',
					),
				noOptionsMessage: () =>
					'px-3 py-2 font-sans text-sm leading-5 text-input-label-primary',
			}),
			[],
		);

		const MenuList = useCallback(
			(props: MenuListProps<SelectOption, false, GroupBase<SelectOption>>) => (
				<div>
					<div
						className="border-b border-gray-200 bg-gray-50/80 px-3 py-2.5"
						onMouseDown={(event) => event.preventDefault()}
					>
						<p className="mb-2 font-sans text-xs font-medium leading-4 text-input-label-primary">
							{t('createConstruction.constructionType.label')}
						</p>
						<div className="flex max-h-[108px] flex-wrap gap-1.5 overflow-y-auto">
							{typeFilterChips.map((chip) => {
								const isActive = String(typeFilter) === String(chip.value);
								return (
									<button
										key={String(chip.value || '__all__')}
										type="button"
										className={twMerge(
											'inline-flex items-center rounded-full px-2.5 py-1 font-sans text-xs leading-4 transition-colors',
											isActive
												? 'bg-primary text-white'
												: 'bg-white text-gray-700 ring-1 ring-inset ring-gray-200 hover:bg-gray-100',
										)}
										onClick={() =>
											onTypeFilterChange(chip.value ? String(chip.value) : '')
										}
									>
										{chip.label}
									</button>
								);
							})}
						</div>
					</div>
					<components.MenuList {...props} />
				</div>
			),
			[onTypeFilterChange, t, typeFilter, typeFilterChips],
		);

		const DropdownIndicator = useCallback(
			() => (
				<span className="flex size-5 items-center justify-center">
					<ChevronIcon />
				</span>
			),
			[],
		);

		const PlaceholderComponent = useCallback(
			(props: PlaceholderProps<SelectOption, false, GroupBase<SelectOption>>) => (
				<components.Placeholder {...props}>
					<span className="truncate">{props.children}</span>
				</components.Placeholder>
			),
			[],
		);

		const SingleValueComponent = useCallback(
			(props: SingleValueProps<SelectOption, false, GroupBase<SelectOption>>) => (
				<components.SingleValue {...props}>
					<span
						className="block truncate font-sans text-base leading-5 tracking-[0.1px] text-black"
						title={props.data.label}
					>
						{props.data.label}
					</span>
				</components.SingleValue>
			),
			[],
		);

		return (
			<div
				className={twMerge(
					'relative flex min-w-[280px] flex-[1.4] flex-col gap-[6px]',
					className,
				)}
			>
				<div className="flex w-full items-center justify-between gap-2">
					<label className="font-sans text-sm leading-5 tracking-[0.1px] text-input-label-primary">
						{t('createConstruction.construction.label')}
					</label>
					{activeTypeLabel ? (
						<span className="truncate font-sans text-xs leading-4 text-input-label-primary">
							{activeTypeLabel}
						</span>
					) : null}
				</div>
				<SelectUI<SelectOption, false, GroupBase<SelectOption>>
					placeholder={placeholder}
					value={currentOption ?? null}
					options={options}
					onChange={(newValue: SingleValue<SelectOption>) => {
						onConstructionChange(
							newValue?.value != null && newValue.value !== ''
								? String(newValue.value)
								: '',
						);
					}}
					isSearchable
					isOptionDisabled={(option) => !!option.isDisabled}
					classNames={classNames}
					styles={selectStyles}
					unstyled
					menuPosition="fixed"
					noOptionsMessage={() =>
						locale === 'ru' ? 'Нет конструкций' : 'No constructions'
					}
					components={{
						MenuList,
						DropdownIndicator,
						Placeholder: PlaceholderComponent,
						SingleValue: SingleValueComponent,
					}}
				/>
				{loading ? <Loader /> : null}
			</div>
		);
	},
	'ConstructionCatalogSelect',
);
