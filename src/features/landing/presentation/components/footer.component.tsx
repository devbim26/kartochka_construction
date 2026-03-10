import { APP_ROUTES, LogoIcon, LogoTextIcon, useI18n } from '@core';
import { DESIGNING_ROUTES } from '@features/home/constants';
import { useNavigate } from 'react-router-dom';

export const Footer = () => {
	const navigate = useNavigate();
	const { t } = useI18n();

	return (
		<div className="flex w-full justify-center bg-background-primary px-4 sm:px-6 lg:px-10">
			<div className="flex w-full max-w-screen-xl flex-col gap-[40px] py-[40px] xs:flex-col xs:items-center sm:flex-col sm:items-center sm:gap-[30px] md:flex-row md:items-start md:justify-between md:gap-0 md:py-[50px]">
				<div className="flex flex-row items-center gap-[12px]">
					<LogoIcon className="size-[42px] sm:size-[70px]" />
					<LogoTextIcon className="h-[60px] w-[160px] sm:h-[79px] sm:w-[209px]" />
				</div>

				<div className="flex w-full max-w-[600px] justify-between gap-[40px] xs:gap-[30px] sm:gap-[40px] md:w-auto md:max-w-none md:flex-row">
					<div className="flex max-w-[200px] flex-col gap-[20px] sm:gap-[30px]">
						<span
							onClick={() =>
								navigate(
									`${APP_ROUTES.designing.route}/${DESIGNING_ROUTES.main.route}`,
								)
							}
							className="cursor-pointer font-montserrat text-[18px] leading-[22px] sm:text-[20px] sm:leading-[24px]"
						>
							{t('landing.footer.home')}
						</span>
						<span
							onClick={() =>
								navigate(
									`${APP_ROUTES.designing.route}/${DESIGNING_ROUTES.main.route}`,
								)
							}
							className="cursor-pointer font-montserrat text-[18px] leading-[22px] sm:text-[20px] sm:leading-[24px]"
						>
							{t('landing.footer.about')}
						</span>
						<span
							onClick={() =>
								navigate(
									`${APP_ROUTES.designing.route}/${DESIGNING_ROUTES.main.route}`,
								)
							}
							className="cursor-pointer font-montserrat text-[18px] leading-[22px] sm:text-[20px] sm:leading-[24px]"
						>
							{t('landing.footer.contacts')}
						</span>
					</div>

					<div className="flex max-w-[200px] flex-col gap-[20px] sm:gap-[30px]">
						<span
							onClick={() =>
								navigate(
									`${APP_ROUTES.designing.route}/${DESIGNING_ROUTES.main.route}`,
								)
							}
							className="cursor-pointer font-montserrat text-[18px] leading-[22px] sm:text-[20px] sm:leading-[24px]"
						>
							{t('landing.footer.design')}
						</span>
						<span
							onClick={() =>
								navigate(
									`${APP_ROUTES.designing.route}/${DESIGNING_ROUTES.main.route}`,
								)
							}
							className="cursor-pointer font-montserrat text-[18px] leading-[22px] sm:text-[20px] sm:leading-[24px]"
						>
							{t('landing.footer.subscriptions')}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};
