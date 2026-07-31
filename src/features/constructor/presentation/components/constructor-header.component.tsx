import { Button, useAppNavigate, useI18n } from '@core';
import { CONSTRUCTOR_ROUTES } from '@features/constructor/constants';
import { ReportCategory } from '@features/constructor/types';
import { FaPlus } from 'react-icons/fa6';
import { useLocation, useSearchParams } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { ConstructionComplianceBanner } from './construction-compliance-banner.component';
import { useConstructionCompliance } from './construction-compliance.context';

export const ConstructorHeader = () => {
	const navigate = useAppNavigate();
	const location = useLocation();
	const [search] = useSearchParams();
	const reportType =
		(search.get('reportType') as ReportCategory | null) ??
		(sessionStorage.getItem('reportType') as ReportCategory | null) ??
		undefined;
	const reportId = search.get('reportId') ?? sessionStorage.getItem('reportId') ?? undefined;
	const isActive = (route: string) => location.pathname.endsWith(route);
	const { t } = useI18n();
	const { status } = useConstructionCompliance();
	const showComplianceBanner = isActive(CONSTRUCTOR_ROUTES.constructionSelect.route);
	const hasFloorSession = reportType === ReportCategory.Floor && !!reportId;
	const hasSingleSession = reportType === ReportCategory.Single && !!reportId;
	const isCalculationRoute = isActive(CONSTRUCTOR_ROUTES.calculation.route);
	const isAboutBuildingRoute = isActive(CONSTRUCTOR_ROUTES.aboutBuilding.route);
	/** Расчет — только на своём экране; сессия Single не перекрывает «О здании». */
	const isCalculationContext =
		isCalculationRoute || (hasSingleSession && !isAboutBuildingRoute);
	const showAboutBuilding = !isCalculationContext;
	const showFloorPlans = hasFloorSession && !isCalculationContext;
	const showCalculation = isCalculationContext;

	return (
		<div className="flex w-full flex-col gap-[30px]">
			<p className="font-sans text-lg font-semibold leading-6">{t('constructor.header.title')}</p>
			<div className="flex flex-row items-center justify-between gap-[20px]">
				<div className="flex flex-row gap-[20px]">
					{showAboutBuilding ? (
						<Button
							className={twMerge(
								'flex h-[30px] flex-row items-center px-[16px] font-sans text-sm font-semibold shadow-none',
								isActive(CONSTRUCTOR_ROUTES.aboutBuilding.route)
									? ''
									: 'bg-white text-primary ring-[2px] ring-inset ring-primary enabled:hover:bg-white',
							)}
							onClick={
								hasFloorSession
									? () =>
											navigate(CONSTRUCTOR_ROUTES.aboutBuilding.route, {
												reportId: reportId!,
												reportType: ReportCategory.Floor,
												edit: 'true',
											})
									: () =>
											navigate(CONSTRUCTOR_ROUTES.aboutBuilding.route, {
												intent: 'project',
											})
							}
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
							onClick={() =>
								navigate(CONSTRUCTOR_ROUTES.floorPlans.route, {
									reportId: reportId!,
									reportType: ReportCategory.Floor,
								})
							}
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
							onClick={() =>
								navigate(
									CONSTRUCTOR_ROUTES.calculation.route,
									hasSingleSession
										? {
												reportId: reportId!,
												reportType: ReportCategory.Single,
											}
										: undefined,
								)
							}
						>
							{t('constructor.header.calculation')}
						</Button>
					) : null}
				</div>
				{showComplianceBanner ? <ConstructionComplianceBanner status={status} /> : null}
			</div>
		</div>
	);
};
