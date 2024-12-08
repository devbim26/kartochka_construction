import { ChangeEvent, memo, useLayoutEffect, useRef, useState } from 'react';
import { RefCallBack } from 'react-hook-form';
import { IconType } from 'react-icons';
import { FaChevronDown } from 'react-icons/fa';
import { twMerge } from 'tailwind-merge';
import { useAutoScroll, useOutsideClick } from '../../../utils';
import { FormElementLabel } from '../forms';

export type ListOption = {
	id: string;
	value: string;
	label: string;
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
	label?: string;
	placeholder?: string;
	optionsAllPlaceholder?: string;
	options: ListOption[];
	searchable?: boolean;
	wrapperClassName?: string;
	searchInputClassName?: string;
	containerClassName?: string;
	iconClassName?: string;
	listOptionsClassName?: string;
	optionClassName?: string;
	errorClassName?: string;
	labelClassName?: string;
	error?: string;
	isLoading?: boolean;
	errorHighlight?: boolean;
	ref?: RefCallBack;
	icon?: (() => JSX.Element) | IconType;
	onChangePageSize: (value: ListOption['value']) => void;
}

export const Select = memo((props: SelectProps) => {
	const optionsListRef = useRef<HTMLDivElement | null>(null);
	const inputBlockRef = useRef<HTMLDivElement | null>(null);
	const [show, setShow] = useState<boolean>(false);
	const [searchValue, setSearchValue] = useState<string>('');
	const [visibleOptions, setVisibleOptions] = useState<ListOption[]>(props.options);
	const [selected, setSelected] = useState<ListOption[]>([]);
	const [selectedAll, setSelectedAll] = useState<boolean>(false);
	const [searchId] = useState<string>(`search-id-${Math.floor(Math.random() * 1000)}`);

	const optionClickHandle = (opt: ListOption) => {
		if (selectedAll) {
			setSelectedAll(false);
		} else {
			let newValue = selected.map((o) => ({ ...o }));
			if (props.multiple) {
				const founded = newValue.findIndex((o) => o.id === opt.id);
				if (founded !== -1) {
					newValue.splice(founded, 1);
				} else {
					newValue.push(opt);
				}
			} else {
				newValue = newValue[0] && newValue[0].id === opt.id ? [] : [opt];
			}
			setSelected(newValue);
		}
	};

	const close = () => {
		if (show) {
			setShow(false);
			setSearchValue('');
		}
	};

	useOutsideClick(close, [inputBlockRef, optionsListRef]);
	useAutoScroll(optionsListRef, show, selected[0]?.id);

	useLayoutEffect(() => {
		const cloned = visibleOptions.map((o) => ({ ...o }));
		setVisibleOptions(
			searchValue
				? cloned.filter((o) => o.label.toLowerCase().includes(searchValue.toLowerCase()))
				: props.options,
		);
	}, [searchValue]);

	useLayoutEffect(() => {
		selectedAll ? setSelected(props.options.map((o) => ({ ...o }))) : setSelected([]);
	}, [selectedAll]);

	return (
		<div className={twMerge('relative flex flex-col gap-y-2', props.wrapperClassName)}>
			{props.label && (
				<FormElementLabel
					forId={searchId}
					className={twMerge(
						'font-raleway text-[14px] text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
						props.labelClassName,
					)}
					onClick={() => !props.searchable && setShow(true)}
				>
					{props.label}
				</FormElementLabel>
			)}
			<div
				className={twMerge(
					'flex flex-row items-center gap-[8px] truncate rounded-lg bg-transparent py-[6px] pl-[12px] pr-[8px] text-base font-normal leading-6 text-input-label-primary ring-[1px] ring-input-border-primary',
					props.containerClassName,
				)}
				onClick={(e: React.MouseEvent<HTMLDivElement>) =>
					!props.searchable &&
					(e.target as HTMLDivElement) !== optionsListRef.current &&
					setShow(true)
				}
				ref={inputBlockRef}
				onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
					if (e.key === 'Escape') {
						(e.target as HTMLElement).blur();
						close();
					} else if (e.key === 'Tab') {
						close();
					}
				}}
			>
				<select
					className="hidden"
					value={props.multiple ? selected[0]?.value : selected.map((o) => o.value)}
					onChange={props.onChange ? props.onChange : () => {}}
					{...props}
					tabIndex={-1}
				>
					<option value={''}>{props.placeholder}</option>
					{props.options.map((option) => (
						<option key={option.id} id={option.id} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
				{props.searchable ? (
					<input
						id={searchId}
						className="flex min-w-0 flex-1 border-none bg-transparent outline-none placeholder:text-input-label-primary"
						type="text"
						placeholder={props.placeholder}
						onChange={(e: ChangeEvent<HTMLInputElement>) => {
							setSearchValue(e.target.value);
						}}
						onFocus={() => setShow(true)}
						onBlur={() => {}}
					/>
				) : (
					<p className="flex flex-1 cursor-pointer">{props.placeholder}</p>
				)}
				{props.icon ? (
					<props.icon tabIndex={-1} />
				) : (
					<FaChevronDown
						className={twMerge(
							'h-[20px] w-[20px] cursor-pointer fill-[#6F7276] transition duration-[0.2]',
							show ? '-rotate-180' : 'rotate-0',
							props.iconClassName,
						)}
					/>
				)}
				{show && (
					<div
						className={twMerge(
							'absolute left-[0px] top-[67px] z-10 max-h-[185px] w-full overflow-auto bg-white scrollbar-none',
							props.listOptionsClassName,
						)}
						ref={optionsListRef}
						tabIndex={show ? 0 : -1}
					>
						<div
							className={twMerge(
								'border-input-border flex w-full cursor-pointer truncate rounded-t-lg border-[1px] border-b-0 border-solid px-[12px] py-[6px] text-base font-normal leading-6 hover:bg-primary hover:text-white',
								selectedAll ? 'bg-primary text-white' : '',
								props.optionClassName,
							)}
							onClick={() => setSelectedAll(!selectedAll)}
						>
							{props.optionsAllPlaceholder ?? 'Все'}
						</div>
						{visibleOptions.map((option) => (
							<div
								key={option.id}
								className={twMerge(
									'last:rounded-b-lf border-input-border flex w-full cursor-pointer truncate border-[1px] border-solid px-[12px] py-[6px] text-base font-normal leading-6 last:rounded-b-lg last:border-t-0 hover:bg-primary hover:text-white',
									selected.find((o) => o.id === option.id)
										? 'bg-primary text-white'
										: '',
									props.optionClassName,
								)}
								onClick={() => optionClickHandle(option)}
							>
								{option.label}
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
});

Select.displayName = 'Select';
