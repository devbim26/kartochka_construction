import { Button, useAppNavigate } from '@core';
import { CONSTRUCTOR_ROUTES } from '@features/constructor/constants';
import { useLocation } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

export const DesigningHeader = () => {
	const navigate = useAppNavigate();
	const location = useLocation();

	const isActive = (route: string) => location.pathname.endsWith(route);

	return (
		<div className="flex w-full flex-col gap-[30px]">
			<p className="font-sans text-lg font-semibold leading-6">Конструкции</p>
			<div className="flex flex-row gap-[20px]">
				<Button
					className={twMerge(
						'h-[30px] px-[16px] font-sans text-sm font-semibold shadow-none',
						isActive(CONSTRUCTOR_ROUTES.designing.route)
							? ''
							: 'bg-white text-primary ring-[2px] ring-inset ring-primary enabled:hover:bg-white',
					)}
					onClick={() => navigate(CONSTRUCTOR_ROUTES.designing.route)}
				>
					Редактирование конструкции
				</Button>
				<Button
					className={twMerge(
						'h-[30px] px-[16px] font-sans text-sm font-semibold shadow-none',
						isActive(CONSTRUCTOR_ROUTES.myConstructions.route)
							? ''
							: 'bg-white text-primary ring-[2px] ring-inset ring-primary enabled:hover:bg-white',
					)}
					onClick={() => navigate(CONSTRUCTOR_ROUTES.myConstructions.route)}
				>
					Мои конструкции
				</Button>
			</div>
		</div>
	);
};
