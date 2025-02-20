import { DeleteIcon } from '@core';
import type { ReactNode } from 'react';

interface ConstructionLayerProps {
	title?: string;
	children?: ReactNode;
	onDeleteClick: () => void;
}

export const ConstructionLayer = ({ title, children, onDeleteClick }: ConstructionLayerProps) => {
	return (
		<div className="flex flex-col">
			<div className="flex flex-row items-center justify-between">
				<p className="font-sans text-sm font-bold leading-5">{title}</p>
				<DeleteIcon onClick={onDeleteClick} />
			</div>
			<div className="flex flex-wrap gap-[16px] py-[16px]">{children}</div>
		</div>
	);
};
