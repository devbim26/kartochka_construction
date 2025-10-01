import { Checkbox, DropdownSelectButton, Input, Popover, SearchIcon } from '@core';
import React, { useCallback, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

export interface CheckboxSelectOptions {
	label: string;
	value: string;
}

interface CheckboxSelectPropsClassNames {
	popover?: {
		buttonClassName?: string;
		buttonTextClassName?: string;
		bodyClassName?: string;
		labelClassName?: string;
	};
	searchInput?: {
		className?: string;
		iconClassName?: string;
	};
	checkbox?: {
		labelClassName?: string;
	};
}

interface CheckboxSelectProps {
	options: CheckboxSelectOptions[];
	searchable?: boolean;
	multiple?: boolean;
	placeholder: string;
	label?: string;
	classNames?: CheckboxSelectPropsClassNames;
	value: string[] | string;
	onChange: (value: string | string[]) => void;
}

export const CheckboxSelect = React.forwardRef<HTMLDivElement, CheckboxSelectProps>(
	(
		{
			options,
			searchable,
			multiple,
			placeholder,
			label,
			classNames,
			value,
			onChange,
		}: CheckboxSelectProps,
		ref,
	) => {
		const [searchValue, setSearch] = useState<string>('');
		const [filtredOptions, setFiltredOptions] = useState<CheckboxSelectOptions[]>(options);

		useEffect(() => {
			const filtred = searchValue
				? options.filter((v) => v.label?.toLowerCase().includes(searchValue.toLowerCase()))
				: options;
			setFiltredOptions(filtred);
		}, [options, searchValue]);

		const singleCheck = useCallback((sValue: string) => {
			onChange(sValue);
		}, []);

		const multipleCheck = useCallback(
			(mValue: string) => {
				const clone = (value as string[]).slice();
				const existI = clone.findIndex((v) => v === mValue);
				existI === -1 ? clone.push(mValue) : clone.splice(existI, 1);
				onChange(clone);
			},
			[value],
		);

		const selectAll = useCallback(() => {
			const isChecked = options.length === (value as string[]).length;
			onChange(isChecked ? [] : options.map((o) => o.value));
		}, [options, value]);

		return (
			<div ref={ref} className="flex flex-col gap-y-2">
				{label && (
					<label
						className={twMerge(
							'block font-sans text-sm font-normal text-input-label-primary',
							classNames?.popover?.labelClassName,
						)}
					>
						{label}
					</label>
				)}
				<Popover
					hidePadding
					bodyClassName={(twMerge(classNames?.popover?.bodyClassName), 'w-[226px]')}
					buttonContent={
						<DropdownSelectButton
							displayText={
								multiple
									? (value as string[]).length === options.length
										? 'Все'
										: (value as string[]).length > 0
											? options
													.filter((opt) =>
														(value as string[]).includes(opt.value),
													)
													.map((opt) => opt.label)
													.join(', ')
											: placeholder
									: typeof value === 'string' && value.length
										? (options.find((opt) => opt.value === value)?.label ??
											value)
										: placeholder
							}
							title={
								multiple
									? (value as string[]).length > 0
										? options
												.filter((opt) =>
													(value as string[]).includes(opt.value),
												)
												.map((opt) => opt.label)
												.join(', ')
										: label
									: typeof value === 'string' && value.length
										? options.find((opt) => opt.value === value)?.label
										: label
							}
							className={twMerge(
								'flex w-[226px] rounded-[8px] ring-1 ring-inset ring-input-border-primary',
								classNames?.popover?.buttonClassName,
							)}
							textClassName={twMerge(
								'truncate',
								classNames?.popover?.buttonTextClassName,
								value.length && 'text-input-value-black',
							)}
						/>
					}
				>
					<div className="flex flex-col">
						{searchable && (
							<>
								<div className="px-[16px] py-[8px]">
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
											'select-none font-sans font-normal shadow-none ring-input-border-primary',
											classNames?.searchInput?.className,
										)}
										inputClassName="font-sans font-normal h-[32px]"
										onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
											setSearch(e.target.value);
										}}
									/>
								</div>
							</>
						)}
						<div className="flex max-h-[360px] flex-col overflow-auto">
							{multiple && !searchValue && (
								<div className={'px-4 py-2'}>
									<Checkbox
										label={'Все'}
										direction="row"
										checked={options.length === (value as string[]).length}
										onChange={selectAll}
										labelClassName={twMerge(
											classNames?.checkbox?.labelClassName,
											'text-input-value-black',
										)}
									/>
								</div>
							)}
							{filtredOptions.map((option) => (
								<div
									key={option.value}
									className={twMerge('px-4 py-2', 'border-t')}
								>
									<Checkbox
										label={option.label}
										direction="row"
										checked={
											multiple
												? (value as string[]).includes(option.value)
												: value === option.value
										}
										onChange={() => {
											multiple
												? multipleCheck(option.value)
												: singleCheck(option.value);
										}}
										labelClassName={twMerge(
											classNames?.checkbox?.labelClassName,
											'text-input-value-black',
										)}
									/>
								</div>
							))}
						</div>
					</div>
				</Popover>
			</div>
		);
	},
);

CheckboxSelect.displayName = 'CheckboxSelect';
