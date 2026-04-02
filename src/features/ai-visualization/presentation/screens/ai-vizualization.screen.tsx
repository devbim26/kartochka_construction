import { useI18n } from '@core';

export const AiVisualizationScreen = () => {
	const { t } = useI18n();
	return (
		<div className="flex h-full min-h-0 w-full flex-col">
			<p className="font-sans text-lg font-semibold leading-6">{t('ai.assistant.title')}</p>
			<div className="mt-3 flex min-h-0 flex-1 items-center justify-center">
				<iframe
					className="h-full min-h-[560px] w-full rounded-xl border border-[#EDEFF2] bg-white"
					src="https://ai.devscience.by/"
					title={t('ai.assistant.title')}
					loading="lazy"
				/>
			</div>
		</div>
	);
};
