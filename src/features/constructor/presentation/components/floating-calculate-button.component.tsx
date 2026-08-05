import { Button } from '@core';
import type { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

type Props = {
	onClick?: () => void;
	children?: ReactNode;
	disabled?: boolean;
	className?: string;
	/** Доп. кнопки слева (например «Вернуть»). */
	leading?: ReactNode;
};

/**
 * Плавающая «Рассчитать»: остаётся внизу viewport при скролле.
 * Размер как у «Сформировать отчет» на поэтажных планах (h-[50px] text-[20px]).
 */
export const FloatingCalculateButton = ({
	onClick,
	children,
	disabled,
	className,
	leading,
}: Props) => {
	if (!leading && !children) return null;

	return (
		<div className="sticky bottom-4 z-20 mt-4 flex items-center justify-end gap-[10px] bg-gradient-to-t from-white via-white/95 to-transparent pb-1 pt-6">
			{leading}
			{children ? (
				<Button
					type="button"
					variant="primary"
					disabled={disabled}
					onClick={onClick}
					className={twMerge(
						'h-[50px] min-w-[220px] px-8 font-sans text-[20px] font-semibold shadow-lg',
						className,
					)}
				>
					{children}
				</Button>
			) : null}
		</div>
	);
};
