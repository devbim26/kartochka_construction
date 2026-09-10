import { APP_ROUTES, Button, useAppNavigate, useI18n } from '@core';
import { CONSTRUCTOR_ROUTES } from '@features/constructor/constants';
import { ReportCategory } from '@features/constructor/types';
import { activateProjectSession, getProjectReportId } from '@features/constructor/utils';
import { DesigningSectionNav } from '@features/home/presentation/components/designing-section-nav.component';
import { DESIGNING_ROUTES } from '@features/home/constants';
import { FaPlus } from 'react-icons/fa6';
import { useLocation } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

export const ConstructorHeader = () => {
	const navigate = useAppNavigate();
	const location = useLocation();
	const isActive = (route: string) => location.pathname.endsWith(route);
	const { t } = useI18n();

	const projectReportId = getProjectReportId();
	const hasFloorSession = !!projectReportId;
	const isCalculationRoute = isActive(CONSTRUCTOR_ROUTES.calculation.route);
	const constructorBase = `${APP_ROUTES.designing.route}/${DESIGNING_ROUTES.constructor.route}`;

	return (
		<div className="flex w-full flex-col gap-[30px]">
			<DesigningSectionNav title={t('sidebar.constructor')} />
			{!isCalculationRoute ? (
				<div className="flex flex-row items-center gap-[20px]">
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
								navigate(
									`${constructorBase}/${CONSTRUCTOR_ROUTES.aboutBuilding.route}`,
									{
										reportId: id,
										reportType: ReportCategory.Floor,
										edit: 'true',
									},
								);
								return;
							}
							navigate(`${constructorBase}/${CONSTRUCTOR_ROUTES.aboutBuilding.route}`, {
								intent: 'project',
							});
						}}
					>
						<FaPlus width={'16px'} height={'16px'} />
						{t('constructor.header.aboutBuilding')}
					</Button>
					{hasFloorSession ? (
						<Button
							className={twMerge(
								'h-[30px] px-[16px] font-sans text-sm font-semibold shadow-none',
								isActive(CONSTRUCTOR_ROUTES.floorPlans.route)
									? ''
									: 'bg-white text-primary ring-[2px] ring-inset ring-primary enabled:hover:bg-white',
							)}
							onClick={() => {
								const id = activateProjectSession()!;
								navigate(
									`${constructorBase}/${CONSTRUCTOR_ROUTES.floorPlans.route}`,
									{
										reportId: id,
										reportType: ReportCategory.Floor,
									},
								);
							}}
						>
							{t('constructor.header.floorPlans')}
						</Button>
					) : null}
				</div>
			) : null}
		</div>
	);
};
