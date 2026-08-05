import { Button, useAppNavigate, useI18n } from '@core';
import { CONSTRUCTOR_ROUTES } from '@features/constructor/constants';
import { ReportCategory } from '@features/constructor/types';
import {
	activateCalculationSession,
	activateProjectSession,
	getCalculationReportId,
	getProjectReportId,
} from '@features/constructor/utils';
import { DesigningSectionNav } from '@features/home/presentation/components/designing-section-nav.component';
import { FaPlus } from 'react-icons/fa6';
import { useLocation, useSearchParams } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

export const ConstructorHeader = () => {
	const navigate = useAppNavigate();
	const location = useLocation();
	const [search] = useSearchParams();
	const isActive = (route: string) => location.pathname.endsWith(route);
	const { t } = useI18n();

	const projectReportId = getProjectReportId();
	const hasFloorSession = !!projectReportId;

	const isCalculationRoute = isActive(CONSTRUCTOR_ROUTES.calculation.route);
	const isAboutBuildingRoute = isActive(CONSTRUCTOR_ROUTES.aboutBuilding.route);
	const reportTypeInUrl = search.get('reportType') as ReportCategory | null;

	/** Расчет — на своём экране; Single в URL не перекрывает вкладки проекта на «О здании». */
	const isCalculationContext =
		isCalculationRoute ||
		(!!getCalculationReportId() &&
			!isAboutBuildingRoute &&
			!isActive(CONSTRUCTOR_ROUTES.floorPlans.route) &&
			reportTypeInUrl !== ReportCategory.Floor);

	const showAboutBuilding = !isCalculationContext;
	const showFloorPlans = hasFloorSession && !isCalculationContext;
	const showCalculation = isCalculationContext;

	return (
		<div className="flex w-full flex-col gap-[30px]">
			<DesigningSectionNav title={t('sidebar.constructor')} />
			<div className="flex flex-row items-center gap-[20px]">
				{showAboutBuilding ? (
					<Button
						className={twMerge(
							'flex h-[30px] flex-row items-center px-[16px] font-sans text-sm font-semibold shadow-none',
							isActive(CONSTRUCTOR_ROUTES.aboutBuilding.route)
								? ''
								: 'bg-white text-primary ring-[2px] ring-inset ring-primary enabled:hover:bg-white',
						)}
						onClick={() => {
							if (hasFloorSession) {
								const id = activateProjectSession()!;
								navigate(CONSTRUCTOR_ROUTES.aboutBuilding.route, {
									reportId: id,
									reportType: ReportCategory.Floor,
									edit: 'true',
								});
								return;
							}
							navigate(CONSTRUCTOR_ROUTES.aboutBuilding.route, {
								intent: 'project',
							});
						}}
					>
						<FaPlus width={'16px'} height={'16px'} />
						{t('constructor.header.aboutBuilding')}
					</Button>
				) : null}
				{showFloorPlans ? (
					<Button
						className={twMerge(
							'h-[30px] px-[16px] font-sans text-sm font-semibold shadow-none',
							isActive(CONSTRUCTOR_ROUTES.floorPlans.route)
								? ''
								: 'bg-white text-primary ring-[2px] ring-inset ring-primary enabled:hover:bg-white',
						)}
						onClick={() => {
							const id = activateProjectSession()!;
							navigate(CONSTRUCTOR_ROUTES.floorPlans.route, {
								reportId: id,
								reportType: ReportCategory.Floor,
							});
						}}
					>
						{t('constructor.header.floorPlans')}
					</Button>
				) : null}
				{showCalculation ? (
					<Button
						className={twMerge(
							'h-[30px] px-[16px] font-sans text-sm font-semibold shadow-none',
							isCalculationRoute
								? ''
								: 'bg-white text-primary ring-[2px] ring-inset ring-primary enabled:hover:bg-white',
						)}
						onClick={() => {
							const id = activateCalculationSession();
							navigate(
								CONSTRUCTOR_ROUTES.calculation.route,
								id
									? {
											reportId: id,
											reportType: ReportCategory.Single,
										}
									: undefined,
							);
						}}
					>
						{t('constructor.header.calculation')}
					</Button>
				) : null}
			</div>
		</div>
	);
};
