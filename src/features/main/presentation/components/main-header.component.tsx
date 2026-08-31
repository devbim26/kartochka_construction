import {
	APP_ROUTES,
	Carousel,
	CarouselSlide,
	useAppNavigate,
	useI18n,
} from '@core';
import {
	AcousticDesignLogo,
	ArchDesignLogo,
	ExpertiseDocumentsLogo,
	ExpertiseGeneralLogo,
	ExpertiseNormsLogo,
	ExpertiseSubjectLogo,
	MainSliderLogo,
	SoundInsulationLogo,
	TermoInsulationLogo,
} from '@core/presentation/logos';
import { getOpenWebUiModelFromFeatureId } from '@core/utils/helpers/open-webui-model.helper';
import { DESIGNING_ROUTES } from '@features/home/constants';
import { DesigningSectionNav } from '@features/home/presentation/components/designing-section-nav.component';
import { Fragment, useCallback, useState, type ComponentType, type ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { SoundInsulationChoiceModal } from './sound-insulation-choice-modal.component';

interface FeatureCard {
	id: string;
	title: ReactNode;
	description: ReactNode;
	features: ReactNode[];
	price: 'FREE' | 'PRO';
	buttonText: string;
	isPro?: boolean;
	active?: boolean;
	onClick?: () => void;
}

const featureLogos: Record<string, ComponentType<{ className?: string }>> = {
	'sound-isolation': SoundInsulationLogo,
	'room-acoustics': AcousticDesignLogo,
	'heat-isolation': TermoInsulationLogo,
	'arch-design': ArchDesignLogo,
	'expertise-general': ExpertiseGeneralLogo,
	'expertise-subject': ExpertiseSubjectLogo,
	'expertise-documents': ExpertiseDocumentsLogo,
	'expertise-norms': ExpertiseNormsLogo,
};

const featureAccentColors: Record<string, string> = {
	'sound-isolation': '#B1C9E3',
	'room-acoustics': '#EED0C5',
	'heat-isolation': '#F3F2BA',
	'arch-design': '#DFA4C2',
	'expertise-general': '#DFA4C2',
	'expertise-subject': '#B2CAA0',
	'expertise-documents': '#EED0C5',
	'expertise-norms': '#B1C9E3',
	'ai-assistant': '#EED0C5',
	'ai-visualization': '#F3F2BA',
	'project-expertise': '#DFA4C2',
	'normative-analytics': '#B2CAA0',
};

/** Одинаковая оболочка слайдера: высота ряда по самой высокой карточке, кнопка внизу. */
const MAIN_SLIDER_SLIDE =
	'min-w-0 basis-full px-3 sm:basis-1/2 md:basis-1/3 lg:basis-1/4';
const MAIN_SLIDER_CARD =
	'flex min-h-0 w-full min-w-0 flex-1 flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md';
const MAIN_SLIDER_TEXT =
	'min-w-0 flex-1 text-[14px] leading-snug text-gray-600 [&_ul]:text-[13px] [&_ul]:leading-tight';

function MainSliderFeatureCard({
	feature,
	footer,
}: {
	feature: FeatureCard;
	footer: ReactNode;
}) {
	const Logo = featureLogos[feature.id] ?? MainSliderLogo;
	const isCardClickable = feature.id === 'sound-isolation' && Boolean(feature.onClick);

	return (
		<div
			className={twMerge(
				MAIN_SLIDER_CARD,
				!feature.active && 'bg-gray-text/30',
				isCardClickable && 'cursor-pointer',
			)}
			onClick={isCardClickable ? feature.onClick : undefined}
			onKeyDown={
				isCardClickable
					? (e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								feature.onClick?.();
							}
						}
					: undefined
			}
			role={isCardClickable ? 'button' : undefined}
			tabIndex={isCardClickable ? 0 : undefined}
		>
			<div className="flex min-h-0 flex-1 flex-col">
				<div className="mb-1.5 flex shrink-0 items-start justify-between">
					<div
						className="w-full rounded-xl px-2.5 py-1.5"
						style={{ backgroundColor: featureAccentColors[feature.id] || '#B1C9E3' }}
					>
						<h3 className="text-[16px] font-bold leading-tight text-gray-800 sm:text-[17px]">
							{feature.title}
						</h3>
					</div>
				</div>

				<div className="flex min-h-0 flex-1 items-stretch gap-2.5">
					<div className="shrink-0 self-start">
						<Logo className="size-14" />
					</div>
					<div className={MAIN_SLIDER_TEXT}>
						{feature.description}
						{feature.features.length > 0 && (
							<div className="mb-2 mt-1">
								<ul className="space-y-1 pr-1">
									{feature.features.map((item, index) => (
										<li
											key={index}
											className="text-[14px] leading-snug text-gray-600"
										>
											• {item}
										</li>
									))}
								</ul>
							</div>
						)}
					</div>
				</div>
			</div>
			<div
				className="mt-3 flex w-full shrink-0 justify-end"
				onClick={(e) => e.stopPropagation()}
				onKeyDown={(e) => e.stopPropagation()}
			>
				{footer}
			</div>
		</div>
	);
}

/** Text between a pair of asterisks is shown bold, e.g. *foo* */
const renderAsteriskBold = (text: string) => {
	if (!text || !text.includes('*')) return text;
	const parts = text.split(/(\*[^*]+\*)/g);
	return parts.map((part, i) => {
		if (part.length >= 2 && part.startsWith('*') && part.endsWith('*')) {
			return (
				<span key={i} className="font-bold text-gray-800">
					{part.slice(1, -1)}
				</span>
			);
		}
		return <Fragment key={i}>{part}</Fragment>;
	});
};

export const MainHeader = () => {
	const navigate = useAppNavigate();
	const { t } = useI18n();
	const [isSoundChoiceOpen, setIsSoundChoiceOpen] = useState(false);

	const handleAiVisualizationRedirect = useCallback(
		(featureId: string) => {
			const path =
				APP_ROUTES.designing.route + '/' + DESIGNING_ROUTES.visualization.route;
			const modelId = getOpenWebUiModelFromFeatureId(featureId);
			if (modelId) {
				navigate(path, { model: modelId });
				return;
			}
			navigate(path);
		},
		[navigate],
	);

	const AIFeatures: FeatureCard[] = [
		{
			id: 'expertise-general',
			title: t('main.expertiseCards.general.title'),
			description: (
				<ul className="list-disc space-y-0.5 pl-4 pr-1 text-gray-600">
					{(t('main.expertiseCards.general.bullets') as string)
						.split('||')
						.map((line) => line.trim())
						.filter(Boolean)
						.map((item, idx) => (
							<li key={idx}>{item}</li>
						))}
				</ul>
			),
			features: [],
			price: 'PRO',
			buttonText: t('main.designCards.continueInAiMode'),
			active: true,
			onClick: () => handleAiVisualizationRedirect('expertise-general'),
		},
		{
			id: 'expertise-subject',
			title: t('main.expertiseCards.subject.title'),
			description: (
				<ul className="list-disc space-y-0.5 pl-4 pr-1 text-gray-600">
					<li>
						{renderAsteriskBold(t('main.expertiseCards.subject.bullet1'))}
					</li>
					<li>{t('main.expertiseCards.subject.bullet2')}</li>
					<li>{t('main.expertiseCards.subject.bullet3')}</li>
				</ul>
			),
			features: [],
			price: 'PRO',
			buttonText: t('main.designCards.continueInAiMode'),
			active: true,
			onClick: () => handleAiVisualizationRedirect('expertise-subject'),
		},
		{
			id: 'expertise-documents',
			title: t('main.expertiseCards.documents.title'),
			description: (
				<div className="flex flex-col gap-2 text-gray-600">
					<p className="whitespace-pre-line">
						{renderAsteriskBold(t('main.expertiseCards.documents.p1'))}
					</p>
					<p>{t('main.expertiseCards.documents.p2')}</p>
					<p>
						{renderAsteriskBold(t('main.expertiseCards.documents.p3'))}
					</p>
					<p>{t('main.expertiseCards.documents.p4')}</p>
				</div>
			),
			features: [],
			price: 'PRO',
			buttonText: t('main.designCards.continueInAiMode'),
			active: true,
			onClick: () => handleAiVisualizationRedirect('expertise-documents'),
		},
		{
			id: 'expertise-norms',
			title: t('main.expertiseCards.norms.title'),
			description: (
				<p className="italic">{t('main.expertiseCards.norms.body')}</p>
			),
			features: [],
			price: 'PRO',
			buttonText: t('main.designCards.continueInAiMode'),
			active: true,
			onClick: () => handleAiVisualizationRedirect('expertise-norms'),
		},
	];

	const features: FeatureCard[] = [
		{
			id: 'sound-isolation',
			title: t('main.designCards.sound.title'),
			description: (
				<div className="flex flex-col gap-1.5 text-[14px] leading-snug text-gray-600">
					<p className="whitespace-pre-line">
						{renderAsteriskBold(t('main.designCards.sound.lead'))}
					</p>
					<p>{t('main.designCards.sound.forLabel')}</p>
					<ul className="mb-1 list-disc space-y-0.5 pl-4 pr-1 text-[13px] leading-tight text-gray-600">
						{(t('main.designCards.sound.bullets') as string)
							.split('||')
							.map((line) => line.trim())
							.filter(Boolean)
							.map((item, idx) => (
								<li key={idx}>{item}</li>
							))}
					</ul>
					<p className="whitespace-pre-line">{t('main.designCards.sound.footer')}</p>
				</div>
			),
			features: [],
			price: 'FREE',
			buttonText: t('main.designCards.continueInConstructor'),
			active: true,
			onClick: () => setIsSoundChoiceOpen(true),
		},
		{
			id: 'room-acoustics',
			title: t('main.designCards.roomAcoustics.title'),
			description: (
				<div className="flex flex-col gap-1.5 text-[14px] leading-snug text-gray-600">
					<p className="whitespace-pre-line">
						{renderAsteriskBold(t('main.designCards.roomAcoustics.lead'))}
					</p>
					<p>{t('main.designCards.roomAcoustics.forLabel')}</p>
					<ul className="mb-1 list-disc space-y-0.5 pl-4 pr-1 text-[13px] leading-tight text-gray-600">
						{(t('main.designCards.roomAcoustics.bullets') as string)
							.split('||')
							.map((line) => line.trim())
							.filter(Boolean)
							.map((item, idx) => (
								<li key={idx}>{item}</li>
							))}
					</ul>
					<p className="whitespace-pre-line">
						{t('main.designCards.roomAcoustics.footer')}
					</p>
				</div>
			),
			features: [],
			price: 'PRO',
			buttonText: t('main.designCards.heat.inDevelopment'),
			active: false,
		},
		{
			id: 'heat-isolation',
			title: t('main.designCards.heatEngineering.title'),
			description: (
				<div className="flex flex-col gap-1.5 text-[14px] leading-snug text-gray-600">
					<p className="whitespace-pre-line">
						{renderAsteriskBold(t('main.designCards.heatEngineering.body'))}
					</p>
					<p className="whitespace-pre-line">
						{t('main.designCards.heatEngineering.footer')}
					</p>
				</div>
			),
			features: [],
			price: 'PRO',
			buttonText: t('main.designCards.heat.inDevelopment'),
		},
		{
			id: 'arch-design',
			title: t('main.designCards.architecture.title'),
			description: (
				<div className="flex flex-col gap-1.5 text-[14px] leading-snug text-gray-600">
					<p className="whitespace-pre-line">
						{renderAsteriskBold(t('main.designCards.architecture.lead'))}
					</p>
					<ul className="mb-1 list-disc space-y-0.5 pl-4 pr-1 text-[13px] leading-tight text-gray-600">
						{(t('main.designCards.architecture.bullets') as string)
							.split('||')
							.map((line) => line.trim())
							.filter(Boolean)
							.map((item, idx) => (
								<li key={idx}>{item}</li>
							))}
					</ul>
					<p className="whitespace-pre-line">{t('main.designCards.architecture.hint')}</p>
				</div>
			),
			features: [],
			price: 'PRO',
			buttonText: t('main.designCards.continueInAiMode'),
			active: true,
			onClick: () => handleAiVisualizationRedirect('arch-design'),
		},
	];

	return (
		<div className="w-full">
			<SoundInsulationChoiceModal
				isOpen={isSoundChoiceOpen}
				onClose={() => setIsSoundChoiceOpen(false)}
				mode="resume"
			/>

			<div className="mb-6 flex w-full items-center justify-between">
				<DesigningSectionNav title={t('main.pageTitle')} />
			</div>

			<div className="mb-6 flex w-full items-center gap-[10px]">
				<h2 className="min-w-fit text-[15px] font-bold text-primary">
					{t('main.section.design')}
				</h2>
				<div className="h-px w-full bg-primary"></div>
			</div>

			<Carousel
				options={{
					align: 'start',
					loop: true,
					slidesToScroll: 1,
					containScroll: 'trimSnaps',
				}}
				className="w-full"
			>
				{features.map((feature) => (
					<CarouselSlide key={feature.id} className={MAIN_SLIDER_SLIDE}>
						<MainSliderFeatureCard
							feature={feature}
							footer={
								feature.id === 'room-acoustics' || feature.id === 'heat-isolation' ? (
									<button
										type="button"
										disabled
										className="w-fit cursor-not-allowed rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-500"
									>
										{feature.buttonText}
									</button>
								) : (
									<button
										type="button"
										onClick={feature.onClick}
										className="w-fit rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
									>
										{feature.buttonText}
									</button>
								)
							}
						/>
					</CarouselSlide>
				))}
			</Carousel>

			<div className="my-6 flex w-full items-center gap-[10px]">
				<h2 className="min-w-fit text-[15px] font-bold text-primary">
					{t('main.section.aiAssistant')}
				</h2>
				<div className="h-px w-full bg-primary"></div>
			</div>

			<Carousel
				options={{
					align: 'start',
					loop: true,
					slidesToScroll: 1,
					containScroll: 'trimSnaps',
				}}
				className="w-full"
			>
				{AIFeatures.map((feature) => (
					<CarouselSlide key={feature.id} className={MAIN_SLIDER_SLIDE}>
						<MainSliderFeatureCard
							feature={feature}
							footer={
								<button
									type="button"
									onClick={feature.onClick}
									className="w-fit rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
								>
									{feature.buttonText}
								</button>
							}
						/>
					</CarouselSlide>
				))}
			</Carousel>
		</div>
	);
};
