import { APP_ROUTES, Button, useAppNavigate, useI18n } from '@core';
import { CONSTRUCTOR_ROUTES } from '@features/constructor/constants';
import { ReportCategory } from '@features/constructor/types';
import { activateProjectSession, getProjectReportId } from '@features/constructor/utils';
import { DESIGNING_ROUTES } from '@features/home/constants';
import { useLocation, useSearchParams } from 'react-router-dom';

const HIDDEN_ON_ROUTES = [
	CONSTRUCTOR_ROUTES.aboutBuilding.route,
	CONSTRUCTOR_ROUTES.floorPlans.route,
	CONSTRUCTOR_ROUTES.calculation.route,
] as const;

/** Кнопка возврата к поэтажным планам — на дочерних экранах Floor-проекта. */
export const BackToFloorPlansButton = () => {
	const navigate = useAppNavigate();
	const location = useLocation();
	const [search] = useSearchParams();
	const { t } = useI18n();

	const reportType = search.get('reportType');
	const projectReportId = getProjectReportId();
	const isFloorContext =
		reportType === ReportCategory.Floor ||
		(reportType !== ReportCategory.Single && !!projectReportId);

	const isHiddenRoute = HIDDEN_ON_ROUTES.some((route) => location.pathname.endsWith(`/${route}`));

	if (!isFloorContext || isHiddenRoute) {
		return null;
	}

	const handleClick = () => {
		const id = activateProjectSession() || search.get('reportId') || projectReportId;
		if (!id) return;

		navigate(
			`${APP_ROUTES.designing.route}/${DESIGNING_ROUTES.constructor.route}/${CONSTRUCTOR_ROUTES.floorPlans.route}`,
			{
				reportId: id,
				reportType: ReportCategory.Floor,
			},
		);
	};

	return (
		<div className="mt-auto flex w-full justify-end pt-[20px]">
			<Button
				type="button"
				variant="primary"
				onClick={handleClick}
				className="h-[50px] self-end text-[20px]"
			>
				{t('constructor.backToFloorPlans')}
			</Button>
		</div>
	);
};
