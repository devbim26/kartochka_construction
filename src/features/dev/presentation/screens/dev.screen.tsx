import type { TranslationKey } from '@core';
import { useI18n } from '@core';

interface DevScreenProps {
	titleKey: TranslationKey;
}

export const DevScreen = ({ titleKey }: DevScreenProps) => {
	const { t } = useI18n();

	return (
		<div className="flex flex-1 items-center justify-center">
			<div className="flex size-[400px] flex-col items-center justify-center gap-[20px] rounded-lg border-0 border-r-8 bg-background-secondary">
				<p className="truncate text-lg font-semibold leading-6 tracking-wide text-[#14181F]">
					{t(titleKey)}
				</p>
				<p className="text-lg font-semibold leading-6 tracking-wide text-[#14181F]">
					{t('dev.inDevelopment')}
				</p>
			</div>
		</div>
	);
};
