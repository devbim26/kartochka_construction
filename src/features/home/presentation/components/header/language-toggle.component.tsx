import { useI18n } from '@core';
import { twMerge } from 'tailwind-merge';

export const LanguageToggle = ({ className }: { className?: string }) => {
	const { locale, toggleLocale, t } = useI18n();

	return (
		<button
			type="button"
			onClick={toggleLocale}
			title={t('lang.switch')}
			aria-label={t('lang.switch')}
			className={twMerge(
				'flex h-[32px] items-center justify-center rounded-lg border border-solid border-[#EDEFF2] px-3 text-sm font-semibold text-[#14181F] hover:bg-gray-50',
				className,
			)}
		>
			{locale.toUpperCase()}
		</button>
	);
};

