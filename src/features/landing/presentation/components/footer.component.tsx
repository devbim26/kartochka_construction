import { APP_ROUTES, LogoIcon, LogoTextIcon, useI18n } from '@core';
import { DESIGNING_ROUTES } from '@features/home/constants';
import { LandingSections } from '@features/landing/constants';
import { useNavigate } from 'react-router-dom';
import { EmailImage, PhoneImage } from '../images';

const footerContactLineClass =
	'font-montserrat text-base font-normal leading-6 tracking-normal text-gray-800';

export const Footer = () => {
	const navigate = useNavigate();
	const { t } = useI18n();
	const navigateToLandingSection = (sectionId: string) =>
		navigate(`${APP_ROUTES.landing.route}?sectionId=${sectionId}`);

	return (
		<div className="flex w-full justify-center bg-background-primary px-4 sm:px-6 lg:px-10">
			<div className="grid w-full max-w-screen-xl grid-cols-1 place-items-center gap-10 py-10 sm:py-12 md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-6 md:py-[50px]">
				<div className="flex flex-row items-center gap-[12px] md:justify-self-start">
					<LogoIcon className="size-[42px] sm:size-[70px]" />
					<LogoTextIcon className="h-[60px] w-[160px] sm:h-[79px] sm:w-[209px]" />
				</div>

				<div
					className="flex w-full max-w-xl flex-col items-center gap-3 text-center md:max-w-sm md:px-2"
					id={LandingSections.contacts.id}
				>
					<h2 className="mb-2 font-montserrat text-lg font-normal leading-snug text-gray-800 sm:text-xl">
						{t('landing.contacts.title')}
					</h2>
					<p className={footerContactLineClass}>{t('landing.contacts.company')}</p>
					<p className={footerContactLineClass}>{t('landing.contacts.location')}</p>
					<p className={footerContactLineClass}>{t('landing.contacts.address')}</p>
					<div className="flex flex-row items-center justify-center gap-2">
						<PhoneImage />
						<span className={footerContactLineClass}>+375(44)570-89-48</span>
					</div>
					<div className="flex flex-row items-center justify-center gap-2">
						<EmailImage />
						<span className={footerContactLineClass}>info@transacoustic.ru</span>
					</div>
				</div>

				<div className="flex w-full max-w-[600px] justify-between gap-[40px] xs:gap-[30px] sm:gap-[40px] md:w-auto md:max-w-none md:justify-self-end md:flex-row">
					<div className="flex max-w-[200px] flex-col gap-[20px] sm:gap-[30px]">
						<span
							onClick={() =>
								navigate(`${APP_ROUTES.designing.route}/${DESIGNING_ROUTES.main.route}`)
							}
							className="cursor-pointer font-montserrat text-[18px] leading-[22px] sm:text-[20px] sm:leading-[24px]"
						>
							{t('landing.footer.home')}
						</span>
						<span
							onClick={() => navigateToLandingSection(LandingSections.aboutUs.id)}
							className="cursor-pointer font-montserrat text-[18px] leading-[22px] sm:text-[20px] sm:leading-[24px]"
						>
							{t('landing.footer.about')}
						</span>
						<span
							onClick={() => navigateToLandingSection(LandingSections.contacts.id)}
							className="cursor-pointer font-montserrat text-[18px] leading-[22px] sm:text-[20px] sm:leading-[24px]"
						>
							{t('landing.footer.contacts')}
						</span>
					</div>

					<div className="flex max-w-[200px] flex-col gap-[20px] sm:gap-[30px]">
						<span
							onClick={() =>
								navigateToLandingSection(LandingSections.subscription.id)
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
