import { APP_ROUTES, Button, LogoIcon, LogoTextIcon, useAppNavigate, useI18n } from '@core';

export const SomethingWentWrongScreen = () => {
	const navigate = useAppNavigate();
	const { t } = useI18n();

	return (
		<div className="flex min-h-screen w-full flex-col bg-[#fafafa]">
			<div className="flex h-[64px] w-full shrink-0 flex-row items-center gap-[10px] bg-white px-[25px] shadow-sm">
				<LogoIcon className="h-[40px] w-auto shrink-0" />
				<LogoTextIcon className="h-[26px] w-auto shrink-0" />
			</div>
			<div className="flex flex-1 items-center justify-center px-4 pb-16 pt-[40px]">
				<div className="flex w-full max-w-[412px] flex-col items-center gap-[28px] rounded-[16px] border border-[#e5e7eb] bg-white px-[36px] py-[32px] shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
					<div className="flex flex-col items-center gap-[14px] pt-[4px]">
						<div className="flex h-[56px] flex-row items-center justify-center gap-[8px]">
							<LogoIcon className="h-[44px] w-auto" />
							<LogoTextIcon className="h-[18px] w-auto" />
						</div>
						<h1 className="text-center font-montserrat text-[20px] font-bold tracking-[0.03em] text-[#4b5563]">
							{t('error.somethingWentWrong.title')}
						</h1>
						<p className="text-center font-sans text-[15px] leading-relaxed text-[#6b7280]">
							{t('error.somethingWentWrong.subtitle')}
						</p>
					</div>
					<Button
						variant="primary"
						type="button"
						className="h-[48px] w-full font-montserrat text-[17px] font-medium"
						onClick={() => navigate(APP_ROUTES.landing.route)}
					>
						{t('error.somethingWentWrong.backHome')}
					</Button>
				</div>
			</div>
		</div>
	);
};
