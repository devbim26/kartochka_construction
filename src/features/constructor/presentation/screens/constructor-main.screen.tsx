import { APP_ROUTES } from '@core';
import { CONSTRUCTOR_ROUTES } from '@features/constructor/constants';
import { DESIGNING_ROUTES } from '@features/home/constants';
import { useLayoutEffect } from 'react';
import { Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { ConstructorHeader } from '../components';

export const ConstructorLayout = () => {
	const [search] = useSearchParams();
	const navigate = useNavigate();
	const location = useLocation();

	useLayoutEffect(() => {
		if (search.get('reportId') || search.get('constructionId')) {
			return;
		}

		const path = location.pathname;
		const base = `${APP_ROUTES.designing.route}/${DESIGNING_ROUTES.constructor.route}`;
		const projectId = sessionStorage.getItem('projectReportId');
		const storedId = sessionStorage.getItem('reportId');
		const storedType = sessionStorage.getItem('reportType');

		// «Расчёт» без query — чистый лист, сессию не подставляем.
		if (path.endsWith(`/${CONSTRUCTOR_ROUTES.calculation.route}`)) {
			return;
		}

		// Явный экран «О здании» без reportId — новый проект, сессию не трогаем.
		if (path.endsWith(`/${CONSTRUCTOR_ROUTES.aboutBuilding.route}`)) {
			return;
		}

		if (projectId || (storedId && storedType === 'Floor')) {
			const id = projectId || storedId!;
			navigate(
				{
					pathname: `${base}/${CONSTRUCTOR_ROUTES.floorPlans.route}`,
					search: `?${new URLSearchParams({
						reportId: id,
						reportType: 'Floor',
					}).toString()}`,
				},
				{ replace: true },
			);
			return;
		}
		navigate(
			{
				pathname: `${base}/${CONSTRUCTOR_ROUTES.aboutBuilding.route}`,
				search: '?intent=project',
			},
			{ replace: true },
		);
	}, [search, navigate, location.pathname]);

	return (
		<div className="flex min-h-0 w-full flex-1 flex-col gap-[30px] pb-[29px]">
			<ConstructorHeader />
			<div className="flex min-h-0 min-w-0 flex-1 flex-col">
				<Outlet />
			</div>
		</div>
	);
};
