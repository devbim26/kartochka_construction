import {
	APP_ROUTES,
	Button,
	LogoIcon,
	LogoTextIcon,
	useAppNavigate,
	useI18n,
} from '@core';
import { DESIGNING_ROUTES } from '@features/home/constants';

export const AiAccessDenied = () => {
	const navigate = useAppNavigate();
	const { t } = useI18n();

	const handleSubscribe = () => {
		navigate(`${APP_ROUTES.designing.route}/${DESIGNING_ROUTES.main.route}`, {
			subSelectModal: 'true',
			changePlanFlow: 'true',
		});
	};

	return (
		<div className="flex h-full min-h-0 w-full flex-col">
			<p className="font-sans text-lg font-semibold leading-6">{t('ai.assistant.title')}</p>
			<div className="mt-3 flex min-h-0 flex-1 items-center justify-center">
				<div className="flex w-full max-w-[412px] flex-col items-center gap-[28px] rounded-[16px] border border-[#e5e7eb] bg-white px-[36px] py-[32px] shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
					<div className="flex flex-col items-center gap-[14px] pt-[4px]">
						<div className="flex h-[56px] flex-row items-center justify-center gap-[8px]">
							<LogoIcon className="h-[44px] w-auto" />
							<LogoTextIcon className="h-[18px] w-auto" />
						</div>
						<h1 className="text-center font-montserrat text-[20px] font-bold tracking-[0.03em] text-[#4b5563]">
							{t('ai.accessDenied.title')}
						</h1>
						<p className="text-center font-sans text-[15px] leading-relaxed text-[#6b7280]">
							{t('ai.accessDenied.subtitle')}
						</p>
					</div>
					<Button
						variant="primary"
						type="button"
						className="h-[48px] w-full font-montserrat text-[17px] font-medium"
						onClick={handleSubscribe}
					>
						{t('ai.accessDenied.subscribe')}
					</Button>
				</div>
			</div>
		</div>
	);
};
