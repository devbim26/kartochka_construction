import { LandingImage } from '@assets';
import { APP_ROUTES, Button, selectIsUserLoggedIn, useAppSelector, useI18n } from '@core';
import { AUTH_ROUTES } from '@features/auth/constants';
import { DESIGNING_ROUTES } from '@features/home/constants';
import { useNavigate } from 'react-router-dom';

export const PageTop = () => {
	const navigate = useNavigate();
	const isAuthenticated = useAppSelector(selectIsUserLoggedIn);
	const { t } = useI18n();

	const handleStart = () => {
		if (isAuthenticated) {
			navigate(APP_ROUTES.designing.route + '/' + DESIGNING_ROUTES.main.route);
		} else {
			navigate(APP_ROUTES.auth.route + '/' + AUTH_ROUTES.login.route);
		}
	};

	return (
		<div className="relative flex min-h-fit w-full items-center overflow-hidden">
			{/* Animation on the right */}
			<img
				src={LandingImage}
				alt={t('landing.pageTop.gifAlt')}
				className="absolute right-0 object-contain"
			/>

			{/* Translucent card overlay */}
			<div className="relative z-10 ml-[5%] flex h-[400px] w-1/2 rounded-3xl bg-[#74b1f7]/20 px-[44px] py-[40px] backdrop-blur-sm md:px-[56px] md:py-[48px]">
				<div className="flex h-full w-full flex-col items-center justify-center gap-[20px] text-center">
					<span className="block w-full font-montserrat text-[20px] font-bold leading-normal text-black sm:text-[22px] md:text-[28px] lg:text-[28px] xl:text-[36px]">
						{t('landing.pageTop.title')}
					</span>
					<span className="block w-full whitespace-pre-line font-montserrat text-[16px] leading-normal text-black sm:text-[18px] md:text-[22px] lg:text-[22px] xl:text-[28px]">
						{t('landing.pageTop.subtitle')}
					</span>
					<Button
						className="mt-auto min-h-[58px] w-fit rounded-xl bg-primary px-[28px] text-[30px] font-semibold leading-none"
						onClick={handleStart}
					>
						{t('landing.pageTop.start')}
					</Button>
				</div>
			</div>
		</div>
	);
};
