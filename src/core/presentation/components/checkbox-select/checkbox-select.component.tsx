import { Checkbox, DropdownSelectButton, Input, Popover, SearchIcon, Separator } from '@core';
import React, { useCallback, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

export interface CheckboxSelectOptions {
	id: string;
	name: string;
}

interface CheckboxSelectPropsClassNames {
	popover?: {
		buttonClassName?: string;
		buttonTextClassName?: string;
		bodyClassName?: string;
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
	label: string;
	classNames?: CheckboxSelectPropsClassNames;
	value: CheckboxSelectOptions[] | CheckboxSelectOptions;
	onChange: (value: CheckboxSelectOptions[] | CheckboxSelectOptions) => void;
}

export const CheckboxSelect = React.forwardRef<HTMLDivElement, CheckboxSelectProps>(
	(
		{ options, searchable, multiple, label, classNames, value, onChange }: CheckboxSelectProps,
		ref,
	) => {
		const [searchValue, setSearch] = useState<string>('');
		const [filtredOptions, setFiltredOptions] = useState<CheckboxSelectOptions[]>(options);

		useEffect(() => {
			const filtred = searchValue
				? options.filter((v) => v.name?.toLowerCase().includes(searchValue.toLowerCase()))
				: options;
			setFiltredOptions(filtred);
		}, [options, searchValue]);

		const singleCheck = useCallback(
			(sValue: CheckboxSelectOptions) => {
				onChange(sValue);
			},
			[options],
		);

		const multipleCheck = useCallback(
			(mValue: CheckboxSelectOptions) => {
				const clone = (value as CheckboxSelectOptions[]).map((o) => ({ ...o }));
				const existI = clone.findIndex((v) => v.id == mValue.id);
				existI === -1 ? clone.push(mValue) : clone.splice(existI, 1);
				onChange(clone);
			},
			[options, value],
		);

		const selectAll = useCallback(() => {
			const isChecked = options.length === (value as CheckboxSelectOptions[]).length;
			onChange(isChecked ? [] : options.map((o) => ({ ...o })));
		}, [options, value]);

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
							displayText={multiple ? label : (value as CheckboxSelectOptions).name}
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
							{multiple && !searchValue && (
								<div className={'px-4 py-2'}>
									<Checkbox
										label={'Все'}
										direction="row"
										checked={
											options.length ===
											(value as CheckboxSelectOptions[]).length
										}
										onChange={selectAll}
										labelClassName={twMerge(
											'text-black-eerie select-none',
											classNames?.checkbox?.labelClassName,
										)}
									/>
								</div>
							)}
							{filtredOptions.map((option, index) => (
								<div
									key={option.id}
									className={twMerge('px-4 py-2', index !== 0 && 'border-t')}
								>
									<Checkbox
										label={option.name}
										direction="row"
										checked={
											multiple
												? (value as CheckboxSelectOptions[]).findIndex(
														(o) => option.id === o.id,
													) !== -1
												: (value as CheckboxSelectOptions).id === option.id
										}
										onChange={() => {
											multiple ? multipleCheck(option) : singleCheck(option);
										}}
										labelClassName={twMerge(
											'text-black-eerie select-none',
											classNames?.checkbox?.labelClassName,
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
