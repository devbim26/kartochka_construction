import { APP_ROUTES, Button, useAppNavigate } from '@core';
import { CONSTRUCTOR_ROUTES } from '@features/constructor';
import { DESIGNING_ROUTES } from '@features/home/constants';
import { useCallback } from 'react';
import { FaPlus } from 'react-icons/fa6';

export const MainHeader = () => {
	const navigate = useAppNavigate();

	const reportType = sessionStorage.getItem('reportType');
	const repoortId = sessionStorage.getItem('reportId');

	const handleRedirect = useCallback(() => {
		if (repoortId && reportType)
			navigate(
				APP_ROUTES.designing.route +
					'/' +
					DESIGNING_ROUTES.constructor.route +
					'/' +
					CONSTRUCTOR_ROUTES.floorPlans.route,
				{ reportId: repoortId, reportType: reportType },
			);
		else
			navigate(
				APP_ROUTES.designing.route +
					'/' +
					DESIGNING_ROUTES.constructor.route +
					'/' +
					CONSTRUCTOR_ROUTES.aboutBuilding.route,
			);
	}, [repoortId, reportType]);

	return (
		<div className="flex w-full flex-row items-center justify-between">
			<p className="font-sans text-lg font-semibold leading-6">Главная</p>
			<div className="flex w-full justify-center">
				<Button className="flex h-10 flex-row items-center px-[16px] py-[6px]">
					<FaPlus fill="white" width={'16px'} height={'16px'} />
					<p
						onClick={handleRedirect}
						className="ml-2 font-sans text-sm font-semibold leading-4 text-white"
					>
						{repoortId && reportType
							? 'Продолжить проектирование'
							: 'Создать новый проект'}
					</p>
				</Button>
			</div>
		</div>
	);
};
