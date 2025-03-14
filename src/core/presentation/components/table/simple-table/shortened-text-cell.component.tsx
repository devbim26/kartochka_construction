import { Popover } from '@core';
import { useEffect, useRef, useState } from 'react';
import { IoIosInformationCircleOutline } from 'react-icons/io';
import { twMerge } from 'tailwind-merge';

interface IShortenedTextCellClassNames {
	containerClassName?: string;
	textClassName?: string;
	popover?: {
		buttonClassName?: string;
		bodyClassName?: string;
		textClassName?: string;
		containerClassName?: string;
	};
}

interface ShortenedTextCellProps {
	text: string;
	visibleSymbolsAmount?: number;
	showPopoverInfo?: boolean;
	classNames?: IShortenedTextCellClassNames;
	icon?: React.JSX.Element;
}

export const ShortenedTextCell = ({
	text,
	showPopoverInfo = true,
	classNames,
	icon,
}: ShortenedTextCellProps) => {
	const refP = useRef<HTMLParagraphElement>(null);
	const [needPopover, setNeedPopover] = useState<boolean>(false);

	useEffect(() => {
		if (refP.current) {
			refP.current.scrollWidth > refP.current.clientWidth && setNeedPopover(true);
		}
	}, [refP]);

	return (
		<div
			className={twMerge(
				'flex h-full max-w-full flex-row items-center',
				classNames?.containerClassName,
			)}
		>
			<p
				ref={refP}
				title={showPopoverInfo ? '' : text}
				className={twMerge(
					'overflow-hidden whitespace-nowrap text-[12px]',
					classNames?.textClassName,
				)}
			>
				{text + '    '}
			</p>
			{showPopoverInfo && needPopover && (
				<Popover
					buttonContent={icon ?? <CellInfoIcon />}
					containerClassName={twMerge(
						'h-[12px] flex items-center justify-center',
						classNames?.popover?.containerClassName,
					)}
					buttonClassName={twMerge(
						'ml-1 w-4 h-4 cursor-default p-0',
						classNames?.popover?.buttonClassName,
					)}
					bodyClassName={twMerge('!max-w-[400px]', classNames?.popover?.bodyClassName)}
					triggerOn={'hover'}
				>
					<p className={twMerge('text-[12px]', classNames?.popover?.textClassName)}>
						{text}
					</p>
				</Popover>
			)}
		</div>
	);
};

export const CellInfoIcon = () => {
	return (
		<div className="flex w-max items-center justify-center rounded-md hover:brightness-75">
			<IoIosInformationCircleOutline />
		</div>
	);
};
