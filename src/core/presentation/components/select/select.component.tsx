import { ChevronIcon } from '@core/presentation/icons';
import { memoize } from '@core/utils/hoc/memo.utils';
import { motion } from 'framer-motion';
import type { JSX } from 'react';
import { forwardRef, useCallback, useMemo } from 'react';
import SelectUI, {
	components,
	type ActionMeta,
	type ClassNamesConfig,
	type CSSObjectWithLabel,
	type GroupBase,
	type MenuPosition,
	type MultiValue,
	type Props as SelectProps,
	type SelectInstance,
	type SingleValue,
	type StylesConfig,
} from 'react-select';
import { twMerge } from 'tailwind-merge';

export interface SelectOption {
	label: string;
	value: string | number | boolean;
	icon?: JSX.Element;
	toolTip?: string;
	/** Пункт виден, но выбрать нельзя (например конструкция недоступна бесплатному пользователю). */
	isDisabled?: boolean;
}

export type SelectRef = SelectInstance<SelectOption, boolean, GroupBase<SelectOption>>;

interface AppSelectProps {
	label?: string;
	options: SelectOption[];
	headerImage?: JSX.Element;
	buttonLabelIcon?: JSX.Element;
	disabled?: boolean;
	value: SelectOption['value'] | SelectOption['value'][];
	labelClassName?: string;
	buttonClassName?: string;
	optionsClassName?: string;
	wrapperClassname?: string;
	buttonLabelClassName?: string;
	errorClassName?: string;
	error?: string;
	disablePlaceholder?: boolean;
	multiple?: boolean;
	chevronIcon?: JSX.Element;
	placeholder?: string;
	disableDefaultValue?: boolean;
	isSearchable?: boolean;
	menuPosition?: MenuPosition;
	highlightOnlyRussiaBelarus?: boolean;
	onChange?(value: unknown): void;
}

type Props = AppSelectProps & Omit<SelectProps<SelectOption>, 'value' | 'onChange'>;

const styles: StylesConfig<SelectOption, boolean, GroupBase<SelectOption>> = {
	control: (baseStyles: CSSObjectWithLabel) => ({
		...baseStyles,
		minHeight: '32px',
		':hover': {
			cursor: 'pointer',
		},
	}),
	menu: (baseStyles: CSSObjectWithLabel) => ({
		...baseStyles,
		backgroundColor: 'white',
	}),
	menuPortal: (baseStyles: CSSObjectWithLabel) => ({
		...baseStyles,
		zIndex: 50,
	}),
	valueContainer(base, props) {
		return {
			...base,
			display: 'flex',
			flexWrap: 'nowrap',
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			whiteSpace: 'nowrap',
			gap: 5,
		};
	},
};

export const Select = memoize(
	forwardRef(
		(
			props: Props,
			ref: React.Ref<SelectInstance<SelectOption, boolean, GroupBase<SelectOption>>>,
		) => {
			const {
				label,
				options,
				error,
				value,
				headerImage,
				labelClassName,
				buttonClassName,
				optionsClassName,
				wrapperClassname,
				disablePlaceholder,
				errorClassName,
				chevronIcon,
				buttonLabelIcon,
				buttonLabelClassName,
				multiple = false,
				placeholder = 'Выбрать',
				disableDefaultValue = false,
				isSearchable = false,
				menuPosition = 'fixed',
				highlightOnlyRussiaBelarus = false,
				className,
				onChange,
			} = props;

			const _onChange = useCallback(
				(
					newValue: SingleValue<SelectOption> | MultiValue<SelectOption>,
					actionMeta: ActionMeta<SelectOption>,
				) => {
					onChange?.(
						multiple
							? (newValue as MultiValue<SelectOption>).map((v) => v.value)
							: (newValue as SingleValue<SelectOption>)?.value,
					);
				},
				[onChange, multiple],
			);

			const defaultOption: SelectOption = { value: '', label: placeholder };

			const _options = useMemo(() => {
				const opt = [...options];

				if (disableDefaultValue) return opt;
				if (!disablePlaceholder) {
					opt.unshift(defaultOption);
				}

				return opt;
			}, [options]);

			const currentOption = useMemo(() => {
				if (multiple) {
					return _options.filter((o) =>
						(value as SelectOption['value'][])?.some((v) => v === o.value),
					);
				}
				return _options.find((o) => o.value === value);
			}, [value, _options, multiple, disablePlaceholder]);

			const classNames = useMemo((): ClassNamesConfig<SelectOption> => {
				return {
					container: (state) => {
						return twMerge(
							'flex-between items-center p-regular-14 lg:p-regular-16 relative flex h-8 w-full gap-3 rounded-md bg-white text-left text-gray ring-1 ring-inset ring-gray-border focus:outline-none focus:ring-2 focus:ring-primary',
							state.isDisabled && 'bg-gray-100',
							buttonClassName,
							wrapperClassname,
							error ? 'ring-inset ring-error focus:ring-error' : '',
						);
					},
					singleValue: (state) => {
						return twMerge('flex flex-nowrap bg-red-300');
					},
					control: () => {
						return twMerge('w-full rounded-md py-1.5 px-3', buttonClassName);
					},
					indicatorSeparator: () => {
						return twMerge('hidden');
					},
					placeholder: () => {
						return twMerge(
							'p-regular-14 lg:p-regular-16 block h-6 truncate w-full group-data-[selected=true]:font-bold ui-selected:font-bold',
						);
					},
					menu: () => {
						return twMerge(
							'min-h-[32px] rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none absolute z-50',
							optionsClassName,
						);
					},
					indicatorsContainer: () => {
						return twMerge('');
					},
					option: (state) => {
						return twMerge(
							'flex w-full items-center truncate py-2 pl-3 pr-9',
							state.isDisabled
								? 'cursor-not-allowed bg-gray-50 text-gray-400'
								: 'hover:cursor-pointer hover:bg-primary hover:text-white',
							!state.isDisabled && state.isSelected && 'bg-primary text-white',
							optionsClassName,
						);
					},
					noOptionsMessage: () => {
						return twMerge('py-2 pl-3 pr-9');
					},
				};
			}, [buttonClassName, className, optionsClassName, wrapperClassname, error]);

			const Option = memoize((props) => {
				const currentValue = props.getValue()?.[0];
				const isCurrent = currentValue?.value === props.data?.value;
				const isHighlighted = ['Беларусь', 'Россия', 'Нет'].includes(props.data.label);
				const isUnavailable = !!props.data.isDisabled || !!props.isDisabled;
				return (
					<div
						className={twMerge(
							props.getClassNames('option', props),
							!isUnavailable && isCurrent && 'bg-primary text-white',
							isUnavailable && 'bg-gray-50 text-gray-400',
						)}
						{...props.innerProps}
					>
						{headerImage}
						{props.data.icon}
						<p
							className={twMerge(
								'ml-3 truncate',
								!isUnavailable && isCurrent && 'font-bold',
								isUnavailable && 'text-gray-400',
								highlightOnlyRussiaBelarus && !isHighlighted && 'text-gray-400',
							)}
							title={props.data.label}
						>
							{props.data.label}
						</p>
					</div>
				);
			}, 'selectOption');

			const SingleValue = memoize((props) => {
				return (
					<div className="absolute" {...props.innerProps}>
						{headerImage}
						<div className={twMerge('flex items-center gap-3')}>
							{props.data.icon}
							<p
								className={twMerge(
									'block truncate',
									props.data.label === placeholder
										? 'text-input-label-primary'
										: 'text-black',
									buttonLabelClassName,
								)}
								title={props.data.label}
							>
								{props.data.label}
							</p>
						</div>
					</div>
				);
			}, 'selectSingleValue');

			const MultiValue = memoize((props) => {
				const index = props.index;
				const values = props.getValue() as MultiValue<SelectOption>;

				return (
					<p className="font-bold">
						{props.data.label +
							(values.length === 1 || index === values.length - 1 ? '' : ',')}
					</p>
				);
			}, 'selectMultiValue');

			const MenuList = memoize((props) => {
				return (
					<motion.div
						initial={{ opacity: 0, scaleY: 0.75 }}
						animate={{
							opacity: true ? 1 : 0,
							scaleY: true ? 1 : 0.75,
						}}
						transition={{
							duration: true ? 0.3 : 0.2,
							ease: true ? 'easeOut' : 'easeIn',
						}}
						className={optionsClassName}
					>
						<components.MenuList {...props} />
					</motion.div>
				);
			}, 'selectMenuList');

			const DropdownIndicator = memoize((props) => {
				return chevronIcon || <ChevronIcon />;
			}, 'selectDropDownIndicator');

			const Control = memoize((props) => {
				return (
					<components.Control {...props}>
						{buttonLabelIcon ? <div className="mr-3">{buttonLabelIcon}</div> : null}
						{props.children}
					</components.Control>
				);
			}, 'selectCotrol');

			return (
				<div
					className={twMerge(
						'relative flex flex-col gap-y-2',
						wrapperClassname,
						className,
					)}
				>
					{label && (
						<label
							className={twMerge(
								'p-regular-14 block text-input-label-primary',
								labelClassName,
							)}
						>
							{label}
						</label>
					)}
					<SelectUI
						ref={ref}
						placeholder={placeholder}
						value={currentOption}
						isMulti={multiple}
						options={_options}
						onChange={_onChange}
						isSearchable={isSearchable}
						isOptionDisabled={(option) => !!option.isDisabled}
						classNames={classNames}
						styles={styles}
						isDisabled={props.disabled}
						unstyled
						menuPosition={menuPosition}
						noOptionsMessage={() => 'Нет вариантов'}
						components={{
							Option,
							SingleValue,
							MultiValue,
							MenuList,
							DropdownIndicator,
							Control,
						}}
					/>
				</div>
			);
		},
	),
	'select',
);
