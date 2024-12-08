import { FaAngleLeft } from 'react-icons/fa6';
import { twMerge } from 'tailwind-merge';
import { paginate } from '../../../utils';
import { Button } from '../button';
import { ListOption, Select } from '../select';

interface Props {
	pageSizeOptions: ListOption[];
	onChangePageSize: (value: ListOption['value']) => void;
	currentPageSize: ListOption;
	pageItemsInfo: string;
	onPrevPage: () => void;
	onNextPage: () => void;
	canPrevPage: boolean;
	canNextPage: boolean;
	className?: string;
	optionsClassName?: string;
	onNumberedPage: (n: number) => void;
	totalPages: number;
	currentPage: number;
}

export const Pagination = ({
	pageSizeOptions,
	onChangePageSize,
	currentPageSize,
	pageItemsInfo,
	onNextPage,
	onPrevPage,
	canNextPage,
	canPrevPage,
	className,
	optionsClassName,
	currentPage,
	totalPages,
	onNumberedPage,
}: Props) => {
	return (
		<div className={twMerge('flex items-center justify-end gap-x-6', className)}>
			<Select
				options={pageSizeOptions}
				onChangePageSize={onChangePageSize}
				value={currentPageSize.value}
				className="text-text-primary"
			/>
			<span className="p-semibold-14 text-gray">{pageItemsInfo}</span>
			<div className="flex-center gap-1">
				<Button
					className="esm:px-0 size-8"
					onClick={onPrevPage}
					disabled={!canPrevPage}
					variant="inactive"
				>
					<FaAngleLeft className="size-6 shrink-0 scale-75" />
				</Button>
				{paginate({ current: currentPage, max: totalPages }).items.map((i) => {
					if (i === -1) return '...';
					else
						return (
							<Button
								key={i}
								className="esm:px-0 size-8"
								variant={i !== currentPage ? 'inactive' : 'active'}
								onClick={() => onNumberedPage(i)}
							>
								{i}
							</Button>
						);
				})}
				<Button
					onClick={onNextPage}
					disabled={!canNextPage}
					className="esm:px-0 size-8"
					variant="inactive"
				>
					<FaAngleLeft className="size-6 shrink-0 rotate-180 scale-75" />
				</Button>
			</div>
		</div>
	);
};
