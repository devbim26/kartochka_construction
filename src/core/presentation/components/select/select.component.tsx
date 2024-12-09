import { DropdownSelectButton, Input, Popover, SearchIcon, Separator } from '@core';
import React, { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

export type SelectOption = {
	id: string;
	label: string;
	value: string;
};

interface SelectClassNames {
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
	searchable?: boolean;
	classNames?: SelectClassNames;
	cancelable?: boolean;
	onChange: (value: SelectOption) => void;
}

export const Select = React.forwardRef<HTMLDivElement, SelectProps>(
	({ options, searchable, value, classNames, cancelable, onChange, label }: SelectProps, ref) => {
		const [searchValue, setSearch] = useState<string>('');
		const [filtredOptions, setFiltredOptions] = useState<SelectOption[]>(options);
		useEffect(() => {
			const filtred = searchValue
				? options.filter((v) => v.label?.toLowerCase().includes(searchValue.toLowerCase()))
				: options;
			setFiltredOptions(filtred);
		}, [options, searchValue]);

		return (
			<div ref={ref}>
				<Popover
					hidePadding
					bodyClassName={twMerge(
						'bg-gray-isabelline',
						classNames?.popover?.bodyClassName,
					)}
					buttonContent={
						<DropdownSelectButton
							displayText={value.label}
							className={twMerge(
								'flex h-[26px]',
								classNames?.popover?.buttonClassName,
							)}
							textClassName={twMerge(
								'truncate',
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
													? { id: '-1', label: label, value: '' }
													: option,
											);
										} else if (value.id !== option.id) {
											onChange(option);
										}
									}}
								>
									<p
										className={twMerge(
											'text-black-eerie select-none',
											classNames?.option?.label?.className,
											value.id === option.id
												? classNames?.option?.label?.selectedlassName
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
