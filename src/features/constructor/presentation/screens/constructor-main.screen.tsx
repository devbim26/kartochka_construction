import { APP_ROUTES } from '@core';
import { CONSTRUCTOR_ROUTES } from '@features/constructor/constants';
import { DESIGNING_ROUTES } from '@features/home/constants';
import { useLayoutEffect } from 'react';
import { Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { ConstructionComplianceProvider, ConstructorHeader } from '../components';

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
		const storedId = sessionStorage.getItem('reportId');
		const storedType = sessionStorage.getItem('reportType');
		if (storedId && storedType) {
			const qs = new URLSearchParams({
				reportId: storedId,
				reportType: storedType,
			}).toString();
			const nextRoute =
				storedType === 'Single'
					? CONSTRUCTOR_ROUTES.calculation.route
					: CONSTRUCTOR_ROUTES.floorPlans.route;
			navigate(`${base}/${nextRoute}?${qs}`, { replace: true });
			return;
		}
		navigate(`${base}/${CONSTRUCTOR_ROUTES.aboutBuilding.route}?intent=project`, {
			replace: true,
		});
	}, [search, navigate, location.pathname]);

	return (
		<ConstructionComplianceProvider>
			<div className="flex min-h-0 w-full flex-1 flex-col gap-[30px] pb-[29px]">
				<ConstructorHeader />
				<div className="flex min-h-0 min-w-0 flex-1 flex-col">
					<Outlet />
				</div>
			</div>
		</ConstructionComplianceProvider>
	);
};
