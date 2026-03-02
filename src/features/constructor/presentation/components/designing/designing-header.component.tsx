import { APP_ROUTES, Button, useAppNavigate, useI18n } from '@core';
import { CONSTRUCTOR_ROUTES } from '@features/constructor/constants';
import { DESIGNING_ROUTES } from '@features/home/constants';
import { useLocation, useSearchParams } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

export const DesigningHeader = () => {
	const navigate = useAppNavigate();
	const location = useLocation();
	const [search] = useSearchParams();
	const { t } = useI18n();

	const isActive = (route: string) => location.pathname.endsWith(route);

	return (
		<div className="flex w-full flex-col gap-[30px]">
			<p className="font-sans text-lg font-semibold leading-6">
				{t('constructor.designingHeader.title')}
			</p>
			<div className="flex flex-row gap-[20px]">
				<Button
					className={twMerge(
						'h-[30px] px-[16px] font-sans text-sm font-semibold shadow-none',
						isActive(CONSTRUCTOR_ROUTES.designing.route)
							? ''
							: 'bg-white text-primary ring-[2px] ring-inset ring-primary enabled:hover:bg-white',
					)}
					onClick={() =>
						navigate(
							APP_ROUTES.designing.route +
								'/' +
								DESIGNING_ROUTES.constructor.route +
								'/' +
								CONSTRUCTOR_ROUTES.designing.route,
							{
								reportId: search.get('reportId')!,
								reportType: search.get('reportType')!,
								constructionHeaderId: search.get('constructionHeaderId')!,
								reportFloorInfoId: search.get('reportFloorInfoId')!,
							},
						)
					}
				>
					{t('constructor.designingHeader.editConstruction')}
				</Button>
				<Button
					className={twMerge(
						'h-[30px] px-[16px] font-sans text-sm font-semibold shadow-none',
						isActive(CONSTRUCTOR_ROUTES.myConstructions.route)
							? ''
							: 'bg-white text-primary ring-[2px] ring-inset ring-primary enabled:hover:bg-white',
					)}
					onClick={() =>
						navigate(
							APP_ROUTES.designing.route +
								'/' +
								DESIGNING_ROUTES.constructor.route +
								'/' +
								CONSTRUCTOR_ROUTES.myConstructions.route,
							{
								reportId: search.get('reportId')!,
								reportType: search.get('reportType')!,
								constructionHeaderId: search.get('constructionHeaderId')!,
								reportFloorInfoId: search.get('reportFloorInfoId')!,
							},
						)
					}
				>
					{t('constructor.designingHeader.myConstructions')}
				</Button>
			</div>
		</div>
	);
};
