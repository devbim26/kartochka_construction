import { APP_ROUTES } from '@core';
import { CONSTRUCTOR_ROUTES } from '@features/constructor/constants';
import { DESIGNING_ROUTES } from '@features/home/constants';
import { useLayoutEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { ConstructorHeader } from '../components';

export const ConstructorLayout = () => {
	const navigate = useNavigate();

	useLayoutEffect(() => {
		navigate(
			`${APP_ROUTES.designing.route}/${DESIGNING_ROUTES.constructor.route}/${CONSTRUCTOR_ROUTES.aboutBuilding.route}`,
		);
	}, []);

	return (
		<div className="flex w-full flex-col gap-[30px] pb-[29px]">
			<ConstructorHeader />
			<Outlet />
		</div>
	);
};
