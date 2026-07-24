import { APP_ROUTES } from '@core';
import { CONSTRUCTOR_ROUTES } from '@features/constructor/constants';
import { DESIGNING_ROUTES } from '@features/home/constants';
import { useLayoutEffect } from 'react';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { ConstructionComplianceProvider, ConstructorHeader } from '../components';

export const ConstructorLayout = () => {
	const [search] = useSearchParams();
	const navigate = useNavigate();

	useLayoutEffect(() => {
		if (search.get('reportId') || search.get('constructionId')) {
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
			navigate(`${base}/${CONSTRUCTOR_ROUTES.floorPlans.route}?${qs}`, { replace: true });
			return;
		}
		navigate(`${base}/${CONSTRUCTOR_ROUTES.aboutBuilding.route}`, { replace: true });
	}, [search, navigate]);

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
