import { buildOpenWebUiChatUrl, PageLoader, useI18n } from '@core';
import { DesigningSectionNav } from '@features/home/presentation/components/designing-section-nav.component';
import { useEffect, useMemo, useState } from 'react';
import { BsQuestionSquareFill } from 'react-icons/bs';
import { useSearchParams } from 'react-router-dom';
import { checkAiAccess } from '../../services/ai-access.service';
import { AiAccessDenied } from '../components/ai-access-denied.component';

type AccessState = 'loading' | 'granted' | 'denied';

export const AiVisualizationScreen = () => {
	const { t } = useI18n();
	const [search] = useSearchParams();
	const [accessState, setAccessState] = useState<AccessState>('loading');
	const modelId = search.get('model');
	const iframeSrc = useMemo(() => buildOpenWebUiChatUrl(modelId), [modelId]);

	useEffect(() => {
		let cancelled = false;

		checkAiAccess()
			.then((hasAccess) => {
				if (!cancelled) {
					setAccessState(hasAccess ? 'granted' : 'denied');
				}
			})
			.catch(() => {
				if (!cancelled) {
					setAccessState('denied');
				}
			});

		return () => {
			cancelled = true;
		};
	}, []);

	if (accessState === 'loading') {
		return (
			<div className="flex size-full min-h-[560px] items-center justify-center">
				<PageLoader />
			</div>
		);
	}

	if (accessState === 'denied') {
		return <AiAccessDenied />;
	}

	return (
		<div className="flex size-full min-h-0 flex-col">
			<div className="flex gap-2">
				<DesigningSectionNav title={t('ai.assistant.title')} />

				<div className="group relative flex items-center">
					<BsQuestionSquareFill className="size-[16px] shrink-0 text-primary" />

					<span className="absolute left-6 top-0 z-10 hidden w-64 rounded-md bg-gray-800 p-2 text-xs leading-snug text-white shadow-md group-hover:block">
						{t('ai.assistant.firstLoginHint')}
					</span>
				</div>
			</div>

			<div className="mt-3 flex min-h-0 flex-1 items-center justify-center">
				<iframe
					key={iframeSrc}
					className="size-full min-h-[560px] rounded-xl border border-[#EDEFF2] bg-white"
					src={iframeSrc}
					title={t('ai.assistant.title')}
					loading="lazy"
				/>
			</div>
		</div>
	);
};
