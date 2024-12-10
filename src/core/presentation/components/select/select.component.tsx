import { DropdownSelectButton, Input, Popover, SearchIcon, Separator } from '@core';
import React, { useEffect, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { twMerge } from 'tailwind-merge';

export type SelectOption = {
	id: string;
	label: string;
	value: string;
};

interface SelectClassNames {
	labelClassName?: string;
	popover?: {
		buttonClassName?: string;
		buttonTextClassName?: string;
		bodyClassName?: string;
	};
	searchInput?: {
		className?: string;
		iconClassName?: string;
	};
	option?: {
		container?: {
			selectedClassName?: string;
			className?: string;
		};
		label?: {
			selectedlassName?: string;
			className?: string;
		};
	};
}

interface SelectProps {
	options: SelectOption[];
	value: SelectOption;
	label: string;
	placeholder: string;
	searchable?: boolean;
	classNames?: SelectClassNames;
	cancelable?: boolean;
	onChange: (value: SelectOption) => void;
}

export const Select = React.forwardRef<HTMLDivElement, SelectProps>(
	(
		{
			options,
			searchable,
			value,
			classNames,
			cancelable,
			onChange,
			label,
			placeholder,
		}: SelectProps,
		ref,
	) => {
		const [searchValue, setSearch] = useState<string>('');
		const [filtredOptions, setFiltredOptions] = useState<SelectOption[]>(options);
		useEffect(() => {
			const filtred = searchValue
				? options.filter((v) => v.label?.toLowerCase().includes(searchValue.toLowerCase()))
				: options;
			setFiltredOptions(filtred);
		}, [options, searchValue]);

		return (
			<div ref={ref} className="flex flex-col gap-[8px]">
				<label
					className={twMerge(
						'text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
						classNames?.labelClassName,
					)}
				>
					{label}
				</label>
				<Popover
					hidePadding
					bodyClassName={twMerge('bg-[#FFFFFF] ', classNames?.popover?.bodyClassName)}
					buttonContent={
						<DropdownSelectButton
							displayText={value?.label || placeholder}
							iconClassName="size-[16px] cursor-pointer fill-[#6F7276]"
							Icon={FaChevronDown}
							className={twMerge(
								'flex h-fit w-[226px] flex-row gap-[8px] rounded-lg border-[1px] border-solid border-input-border-primary py-[6px] pl-[12px] pr-[8px]',
								classNames?.popover?.buttonClassName,
							)}
							textClassName={twMerge(
								'truncate text-sm font-normal leading-5 tracking-[0.1px] text-input-placeholder-primary',
								classNames?.popover?.buttonTextClassName,
							)}
						/>
					}
				>
					<div className="flex flex-col">
						{searchable && (
							<>
								<div className="z-[60] p-1">
									<Input
										Icon={SearchIcon}
										value={searchValue}
										placeholder="Поиск"
										iconClassName={twMerge(
											'w-4 h-4',
											classNames?.searchInput?.iconClassName,
										)}
										iconPos="left"
										className={twMerge(
											'z-[60] select-none shadow-none ring-transparent focus:ring-0',
											classNames?.searchInput?.className,
										)}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
											setSearch(e.target.value);
										}}
									/>
								</div>
								<Separator />
							</>
						)}
						<div className="flex max-h-[180px] flex-col overflow-auto">
							{filtredOptions.map((option, index) => (
								<div
									key={option.id}
									className={twMerge(
										'cursor-pointer px-4 py-2',
										index !== 0 && 'border-t',
										classNames?.option?.container?.className,
										value.id === option.id
											? classNames?.option?.container?.selectedClassName
											: '',
									)}
									onClick={() => {
										if (cancelable) {
											onChange(
												value.id === option.id
													? { id: '', label: '', value: '' }
													: option,
											);
										} else if (value.id !== option.id) {
											onChange(option);
										}
									}}
								>
									<p
										className={twMerge(
											'select-none truncate text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
											classNames?.option?.label?.className,
											value.id === option.id
												? classNames?.option?.label?.selectedlassName ||
														'text-black'
												: '',
										)}
									>
										{option.label}
									</p>
								</div>
							))}
						</div>
					</div>
				</Popover>
			</div>
		);
	},
);

Select.displayName = 'Select';
