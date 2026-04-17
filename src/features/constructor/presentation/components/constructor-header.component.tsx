import { Button, useAppNavigate, useI18n } from '@core';
import { CONSTRUCTOR_ROUTES } from '@features/constructor/constants';
import { FaPlus } from 'react-icons/fa6';
import { useLocation, useSearchParams } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

export const ConstructorHeader = () => {
	const navigate = useAppNavigate();
	const location = useLocation();
	const [search] = useSearchParams();
	const reportType =
		search.get('reportType') ?? sessionStorage.getItem('reportType') ?? undefined;
	const reportId = search.get('reportId') ?? sessionStorage.getItem('reportId') ?? undefined;
	const isActive = (route: string) => location.pathname.endsWith(route);
	const { t } = useI18n();

	return (
		<div className="flex w-full flex-col gap-[30px]">
			<p className="font-sans text-lg font-semibold leading-6">{t('constructor.header.title')}</p>
			<div className="flex flex-row gap-[20px]">
				<Button
					className={twMerge(
						'flex h-[30px] flex-row items-center px-[16px] font-sans text-sm font-semibold shadow-none',
						isActive(CONSTRUCTOR_ROUTES.aboutBuilding.route)
							? ''
							: 'bg-white text-primary ring-[2px] ring-inset ring-primary enabled:hover:bg-white',
					)}
					onClick={
						reportType && reportId
							? () =>
									navigate(CONSTRUCTOR_ROUTES.aboutBuilding.route, {
										reportId: reportId,
										reportType: reportType,
										edit: 'true',
									})
							: () => navigate(CONSTRUCTOR_ROUTES.aboutBuilding.route)
					}
				>
					<FaPlus width={'16px'} height={'16px'} />
					{t('constructor.header.aboutBuilding')}
				</Button>
				<Button
					className={twMerge(
						'h-[30px] px-[16px] font-sans text-sm font-semibold shadow-none',
						isActive(CONSTRUCTOR_ROUTES.aboutBuilding.route) &&
							!reportType &&
							!reportId &&
							'hidden',
						isActive(CONSTRUCTOR_ROUTES.floorPlans.route)
							? ''
							: 'bg-white text-primary ring-[2px] ring-inset ring-primary enabled:hover:bg-white',
					)}
					onClick={
						reportType && reportId
							? () =>
									navigate(CONSTRUCTOR_ROUTES.floorPlans.route, {
										reportId: reportId,
										reportType: reportType,
									})
							: () => navigate(CONSTRUCTOR_ROUTES.floorPlans.route)
					}
				>
					{t('constructor.header.floorPlans')}
				</Button>
				<Button
					className={twMerge(
						'h-[30px] px-[16px] font-sans text-sm font-semibold shadow-none',
						(isActive(CONSTRUCTOR_ROUTES.aboutBuilding.route) ||
							isActive(CONSTRUCTOR_ROUTES.floorPlans.route)) &&
							'hidden',

						isActive(CONSTRUCTOR_ROUTES.designing.route) ||
							isActive(CONSTRUCTOR_ROUTES.myConstructions.route)
							? ''
							: 'hidden bg-white text-primary ring-[2px] ring-inset ring-primary enabled:hover:bg-white',
					)}
					disabled
				>
					{t('constructor.header.designing')}
				</Button>
				<Button
					className={twMerge(
						'h-[30px] px-[16px] font-sans text-sm font-semibold shadow-none',
						(isActive(CONSTRUCTOR_ROUTES.aboutBuilding.route) ||
							isActive(CONSTRUCTOR_ROUTES.floorPlans.route) ||
							isActive(CONSTRUCTOR_ROUTES.constructionSelect.route)) &&
							'hidden',
						isActive(CONSTRUCTOR_ROUTES.constructionSelect.route)
							? ''
							: 'hidden bg-white text-primary ring-[2px] ring-inset ring-primary enabled:hover:bg-white',
					)}
					disabled
				>
					{t('constructor.header.constructionPick')}
				</Button>
			</div>
		</div>
	);
};
