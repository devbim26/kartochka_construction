import type { ReactNode } from 'react';

interface ConstructionLayerProps {
	title?: string;
	children?: ReactNode;
}

export const ConstructionLayer = ({ title, children }: ConstructionLayerProps) => {
	return (
		<div className="flex flex-col">
			<div className="flex flex-row items-center justify-between">
				<p className="font-sans text-sm font-bold leading-5">{title}</p>
			</div>
			<div className="flex flex-col gap-[16px] pt-[16px]">{children}</div>
		</div>
	);
};
