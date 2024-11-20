import { ChangeEvent, memo, useRef, useState } from 'react';
import { RefCallBack } from 'react-hook-form';
import { IconType } from 'react-icons';
import { twMerge } from 'tailwind-merge';
import { useAutoScroll } from '../../../utils';
import { FormElementLabel } from '../forms';

type ListOption = {
	id: string;
	value: string;
	label: string;
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
	label?: string;
	placeholder?: string;
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
	Icon?: (() => JSX.Element) | IconType;
}

export const Select = memo((props: SelectProps) => {
	const optionsListRef = useRef<HTMLDivElement | null>(null);
	const [show, setShow] = useState<boolean>(false);
	const [visibleOptions, setVisibleOptions] = useState<ListOption[]>(props.options);
	const [selected, setSelected] = useState<ListOption[]>([]);

	const optionClickHandle = (opt: ListOption) => {
		let newValue = selected.map((o) => ({ ...o }));
		if (props.multiple) {
			const founded = newValue.findIndex((o) => o.id === opt.id);
			founded !== -1 ? newValue.push(opt) : newValue.splice(founded, 1);
		} else {
			newValue = newValue[0].id === opt.id ? [] : [opt];
		}
		setSelected(newValue);
	};

	useAutoScroll(optionsListRef, show, selected[0]?.id);

	return (
		<div className={twMerge('relative flex flex-col gap-y-2', props.wrapperClassName)}>
			{props.label && (
				<FormElementLabel
					forId={props.id}
					className={twMerge(
						'font-raleway text-[14px] text-input-label-primary',
						props.labelClassName,
					)}
				>
					{props.label}
				</FormElementLabel>
			)}
			<div
				className={twMerge(
					'color-[#91969E] flex flex-row items-center gap-[8px] truncate rounded-lg border-[1px] border-[#EDEFF2] bg-transparent py-[6px] pl-[12px] pr-[8px]',
					props.containerClassName,
				)}
				onClick={() => setShow(true)}
			>
				<select
					className="hidden"
					value={props.multiple ? selected[0].value : selected.map((o) => o.value)}
					{...props}
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
						className="placeholder:color-[#91969E] flex min-w-0 border-none bg-transparent outline-none"
						type="text"
						id={props.id}
						placeholder={props.placeholder}
						onChange={(e: ChangeEvent<HTMLInputElement>) => {
							const cloned = visibleOptions.map((o) => ({ ...o }));
							setVisibleOptions(
								e.target.value
									? cloned.filter((o) =>
											o.label
												.toLowerCase()
												.includes(e.target.value.toLowerCase()),
										)
									: props.options,
							);
						}}
					/>
				) : (
					<>{props.placeholder}</>
				)}
				{props.Icon && (
					<props.Icon
						className={twMerge(
							`text-gray absolute top-1/2 h-5 w-5 -translate-y-1/2 cursor-pointer`,
							props.iconClassName,
						)}
					/>
				)}
			</div>
			{show && (
				<div
					className={twMerge(
						'absolute top-[65px] flex max-h-[100px] w-full flex-col overflow-y-auto rounded-lg border-[1px] border-[#EDEFF2] bg-[#FFFFFF] px-[12px] py-[6px]',
						props.listOptionsClassName,
					)}
					ref={optionsListRef}
				>
					{visibleOptions.map((option) => (
						<div
							key={option.id}
							className={twMerge(
								'flex w-full cursor-pointer truncate p-1',
								selected.find((o) => option.id === o.id)
									? 'bg-red-500'
									: 'bg-transparent',
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
	);
});

Select.displayName = 'Select';
