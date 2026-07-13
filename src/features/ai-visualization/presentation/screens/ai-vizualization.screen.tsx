import { buildOpenWebUiChatUrl, PageLoader, useI18n } from '@core';
import { useEffect, useMemo, useState } from 'react';
import { BsQuestionSquareFill } from 'react-icons/bs';
import { useSearchParams } from 'react-router-dom';
import { AiAccessDenied } from '../components/ai-access-denied.component';
import { checkAiAccess } from '../../services/ai-access.service';

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
			<div className="flex h-full min-h-[560px] w-full items-center justify-center">
				<PageLoader />
			</div>
		);
	}

	if (accessState === 'denied') {
		return <AiAccessDenied />;
	}

	return (
		<div className="flex h-full min-h-0 w-full flex-col">
			<div className="flex flex-col gap-2">
				<p className="font-sans text-lg font-semibold leading-6">{t('ai.assistant.title')}</p>
				<p className="flex items-start gap-2 font-sans text-sm leading-snug text-[#6b7280]">
					<BsQuestionSquareFill className="mt-0.5 size-[16px] shrink-0 text-primary" />
					<span>{t('ai.assistant.firstLoginHint')}</span>
				</p>
			</div>
			<div className="mt-3 flex min-h-0 flex-1 items-center justify-center">
				<iframe
					key={iframeSrc}
					className="h-full min-h-[560px] w-full rounded-xl border border-[#EDEFF2] bg-white"
					src={iframeSrc}
					title={t('ai.assistant.title')}
					loading="lazy"
				/>
			</div>
		</div>
	);
};
