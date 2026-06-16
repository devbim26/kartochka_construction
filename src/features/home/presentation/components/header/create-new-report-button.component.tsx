import { APP_ROUTES, selectIsUserLoggedIn, useAppNavigate, useAppSelector, useI18n } from '@core';
import { CONSTRUCTOR_ROUTES } from '@features/constructor/constants';
import { DESIGNING_ROUTES } from '@features/home/constants';
import { useCallback } from 'react';
import { twMerge } from 'tailwind-merge';

const REPORT_SESSION_KEYS = ['reportId', 'reportType'] as const;

export const clearReportSession = () => {
	for (const key of REPORT_SESSION_KEYS) {
		sessionStorage.removeItem(key);
	}
};

export const CreateNewReportButton = ({ className }: { className?: string }) => {
	const isLoggedIn = useAppSelector(selectIsUserLoggedIn);
	const navigate = useAppNavigate();
	const { t } = useI18n();

	const handleClick = useCallback(() => {
		clearReportSession();
		navigate(
			`${APP_ROUTES.designing.route}/${DESIGNING_ROUTES.constructor.route}/${CONSTRUCTOR_ROUTES.aboutBuilding.route}`,
		);
	}, [navigate]);

	if (!isLoggedIn) {
		return null;
	}

	return (
		<button
			type="button"
			onClick={handleClick}
			className={twMerge(
				'flex h-[32px] items-center justify-center whitespace-nowrap rounded-lg border border-solid border-[#EDEFF2] px-3 text-sm font-semibold text-[#14181F] hover:bg-gray-50',
				className,
			)}
		>
			{t('nav.createNewReport')}
		</button>
	);
};
