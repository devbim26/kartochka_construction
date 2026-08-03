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
		// Явные экраны без reportId в URL — не перехватываем sessionStorage.
		if (
			path.endsWith(`/${CONSTRUCTOR_ROUTES.calculation.route}`) ||
			path.endsWith(`/${CONSTRUCTOR_ROUTES.aboutBuilding.route}`)
		) {
			return;
		}

		const base = `${APP_ROUTES.designing.route}/${DESIGNING_ROUTES.constructor.route}`;
		const projectId = sessionStorage.getItem('projectReportId');
		const calculationId = sessionStorage.getItem('calculationReportId');
		const storedId = sessionStorage.getItem('reportId');
		const storedType = sessionStorage.getItem('reportType');

		if (projectId || (storedId && storedType === 'Floor')) {
			const id = projectId || storedId!;
			const qs = new URLSearchParams({
				reportId: id,
				reportType: 'Floor',
			}).toString();
			navigate(`${base}/${CONSTRUCTOR_ROUTES.floorPlans.route}?${qs}`, { replace: true });
			return;
		}
		if (calculationId || (storedId && storedType === 'Single')) {
			const id = calculationId || storedId!;
			const qs = new URLSearchParams({
				reportId: id,
				reportType: 'Single',
			}).toString();
			navigate(`${base}/${CONSTRUCTOR_ROUTES.calculation.route}?${qs}`, { replace: true });
			return;
		}
		navigate(`${base}/${CONSTRUCTOR_ROUTES.aboutBuilding.route}?intent=project`, {
			replace: true,
		});
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
