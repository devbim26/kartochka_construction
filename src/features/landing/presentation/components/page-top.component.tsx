import { LandingGif } from '@assets';
import { APP_ROUTES, Button, useAppSelector, useI18n } from '@core';
import { AUTH_ROUTES } from '@features/auth/constants';
import { DESIGNING_ROUTES } from '@features/home/constants';
import { useNavigate } from 'react-router-dom';

export const PageTop = () => {
	const navigate = useNavigate();
	const isAuthenticated = useAppSelector((store) => store.authData.data?.isAuth);
	const { t } = useI18n();

	const handleStart = () => {
		if (isAuthenticated) {
			navigate(APP_ROUTES.designing.route + '/' + DESIGNING_ROUTES.main.route);
		} else {
			navigate(APP_ROUTES.auth.route + '/' + AUTH_ROUTES.login.route);
		}
	};

	return (
		<div className="relative flex min-h-[500px] w-full items-center overflow-hidden">
			{/* Animation on the right */}
			<img
				src={LandingGif}
				alt={t('landing.pageTop.gifAlt')}
				className="absolute right-0 h-full w-3/4"
			/>

			{/* Translucent card overlay */}
			<div className="relative z-10 ml-[5%] flex h-full w-1/2 rounded-3xl bg-[#74b1f7]/20 p-[20px] backdrop-blur-sm">
				<div className="flex h-[400px] flex-col gap-[30px]">
					<span className="block font-montserrat text-[20px] font-bold leading-[1.2] text-black sm:text-[22px] md:text-[28px] lg:text-[28px] xl:text-[36px]">
						{t('landing.pageTop.title')}
					</span>
					<span className="block w-1/2 font-montserrat text-[16px] leading-[1.2] text-black sm:text-[18px] md:text-[22px] lg:text-[22px] xl:text-[28px]">
						{t('landing.pageTop.subtitle')}
					</span>
					<Button
						className="mt-auto w-fit bg-primary text-[25px] leading-[24px]"
						onClick={handleStart}
					>
						{t('landing.pageTop.start')}
					</Button>
				</div>
			</div>
		</div>
	);
};
