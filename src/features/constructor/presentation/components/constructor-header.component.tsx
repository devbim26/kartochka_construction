import { Button, useAppNavigate } from '@core';
import { CONSTRUCTOR_ROUTES } from '@features/constructor/constants';
import { FaPlus } from 'react-icons/fa6';
import { useLocation } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

export const ConstructorHeader = () => {
	const navigate = useAppNavigate();
	const location = useLocation();

	const isActive = (route: string) => location.pathname.endsWith(route);

	return (
		<div className="flex w-full flex-col gap-[30px]">
			<p className="font-sans text-lg font-semibold leading-6">Конструктор</p>
			<div className="flex flex-row gap-[20px]">
				<Button
					className={twMerge(
						'flex h-[30px] flex-row items-center px-[16px] font-sans text-sm font-semibold shadow-none',
						isActive(CONSTRUCTOR_ROUTES.aboutBuilding.route)
							? ''
							: 'bg-white text-primary ring-[2px] ring-inset ring-primary enabled:hover:bg-white',
					)}
					onClick={() => navigate(CONSTRUCTOR_ROUTES.aboutBuilding.route)}
					disabled={!isActive(CONSTRUCTOR_ROUTES.aboutBuilding.route)}
				>
					<FaPlus width={'16px'} height={'16px'} />О здании
				</Button>
				<Button
					className={twMerge(
						'h-[30px] px-[16px] font-sans text-sm font-semibold shadow-none',
						isActive(CONSTRUCTOR_ROUTES.floorPlans.route)
							? ''
							: 'bg-white text-primary ring-[2px] ring-inset ring-primary enabled:hover:bg-white',
					)}
					onClick={() => navigate(CONSTRUCTOR_ROUTES.floorPlans.route)}
					disabled={!isActive(CONSTRUCTOR_ROUTES.floorPlans.route)}
				>
					Поэтажные планы
				</Button>
				<Button
					className={twMerge(
						'h-[30px] px-[16px] font-sans text-sm font-semibold shadow-none',
						isActive(CONSTRUCTOR_ROUTES.designing.route)
							? ''
							: 'bg-white text-primary ring-[2px] ring-inset ring-primary enabled:hover:bg-white',
					)}
					onClick={() => navigate(CONSTRUCTOR_ROUTES.designing.route)}
					disabled={!isActive(CONSTRUCTOR_ROUTES.designing.route)}
				>
					Проектирование
				</Button>
				<Button
					className={twMerge(
						'h-[30px] px-[16px] font-sans text-sm font-semibold shadow-none',
						isActive(CONSTRUCTOR_ROUTES.constructionSelect.route)
							? ''
							: 'bg-white text-primary ring-[2px] ring-inset ring-primary enabled:hover:bg-white',
					)}
					onClick={() => navigate(CONSTRUCTOR_ROUTES.constructionSelect.route)}
					disabled={!isActive(CONSTRUCTOR_ROUTES.constructionSelect.route)}
				>
					Выбор конструкции
				</Button>
				<Button
					className={twMerge(
						'h-[30px] px-[16px] font-sans text-sm font-semibold shadow-none',
						isActive(CONSTRUCTOR_ROUTES.ifcModel.route)
							? ''
							: 'bg-white text-primary ring-[2px] ring-inset ring-primary enabled:hover:bg-white',
					)}
					onClick={() => navigate(CONSTRUCTOR_ROUTES.ifcModel.route)}
					disabled={!isActive(CONSTRUCTOR_ROUTES.ifcModel.route)}
				>
					IFC модель
				</Button>
			</div>
		</div>
	);
};
