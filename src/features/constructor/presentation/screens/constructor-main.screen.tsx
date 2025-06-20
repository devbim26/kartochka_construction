import { APP_ROUTES, useAppNavigate } from '@core';
import { CONSTRUCTOR_ROUTES } from '@features/constructor/constants';
import { DESIGNING_ROUTES } from '@features/home/constants';
import { useLayoutEffect } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';
import { ConstructorHeader } from '../components';

export const ConstructorLayout = () => {
	const [search] = useSearchParams();
	const navigate = useAppNavigate();

	useLayoutEffect(() => {
		if (!search.get('reportId') && !search.get('constructionId')) {
			navigate(
				`${APP_ROUTES.designing.route}/${DESIGNING_ROUTES.constructor.route}/${CONSTRUCTOR_ROUTES.aboutBuilding.route}`,
			);
		}
	}, [search]);

	return (
		<div className="flex w-full flex-col gap-[30px] pb-[29px]">
			<ConstructorHeader />
			<Outlet />
		</div>
	);
};
