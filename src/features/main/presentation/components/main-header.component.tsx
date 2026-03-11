import {
	APP_ROUTES,
	Carousel,
	CarouselSlide,
	MainSliderLogo,
	useAppNavigate,
	useI18n,
} from '@core';
import { CONSTRUCTOR_ROUTES } from '@features/constructor';
import { DESIGNING_ROUTES } from '@features/home/constants';
import { useCallback, type ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

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

export const MainHeader = () => {
	const navigate = useAppNavigate();
	const { t } = useI18n();

	const reportType = sessionStorage.getItem('reportType');
	const reportId = sessionStorage.getItem('reportId');

	const handleRedirect = useCallback(() => {
		if (reportId && reportType)
			navigate(
				APP_ROUTES.designing.route +
					'/' +
					DESIGNING_ROUTES.constructor.route +
					'/' +
					CONSTRUCTOR_ROUTES.floorPlans.route,
				{ reportId: reportId, reportType: reportType },
			);
		else
			navigate(
				APP_ROUTES.designing.route +
					'/' +
					DESIGNING_ROUTES.constructor.route +
					'/' +
					CONSTRUCTOR_ROUTES.aboutBuilding.route,
			);
	}, [reportId, reportType, navigate]);

	const AIFeatures: FeatureCard[] = [
		{
			id: 'ai-assistant',
			title: 'AI ассистент (3 режима)',
			description: (
				<span className="text-gray-700">
					Доступ к новейшим моделям ИИ (от Open AI, Antropic, Google, китайские модели).
				</span>
			),
			features: [
				<span key="ai-mode-1">
					<span className="font-semibold text-gray-800">Общий</span>
				</span>,
				<span key="ai-mode-2">
					<span className="font-semibold text-gray-800">Аналитика документов PDF</span>
					<span className="text-gray-600">
						{' '}
						— AI проверяет, суммаризирует и структурирует документы. Выдаёт готовый
						отчёт в DOC/Excel — для смет, ТЗ, протоколов.
					</span>
				</span>,
				<span key="ai-mode-3">
					<span className="font-semibold text-gray-800">DeepResearch</span>
					<span className="text-gray-600"> (Perplexity Sonar Pro Search)</span>
					<span className="text-gray-600">
						{' '}
						— глубокий поиск информации в интернете со ссылками на первоисточник.
					</span>
				</span>,
			],
			price: 'PRO',
			buttonText: t('common.startPro'),
			active: true,
		},
		{
			id: 'ai-visualization',
			title: 'Визуализация фасадов и интерьеров',
			description: (
				<span className="text-gray-700">
					AI-генерация изображений{' '}
					<span className="font-semibold text-gray-800">(nano banano 2 pro)</span> с
					кастомными настройками.
				</span>
			),
			features: [
				<span key="ai-viz-feature">
					Меняйте материалы, мебель, положение камеры и др.{' '}
					<span className="font-semibold">в один клик</span>.
				</span>,
			],
			price: 'PRO',
			buttonText: t('common.startPro'),
			active: true,
		},
		{
			id: 'project-expertise',
			title: 'Экспертиза проекта (2 режима)',
			description: (
				<span className="text-gray-700">Проверка проекта по выбранному сценарию.</span>
			),
			features: [
				<div key="expertise-general" className="text-gray-700">
					<span className="font-semibold text-gray-800">Общая экспертиза</span>
					<ul className="mt-1 list-disc space-y-1 pl-4 text-gray-600">
						<li>Проверяет общую структуру проекта</li>
						<li>Проверяет проект на соответствие актуальным ТНПА</li>
						<li>Проверка проекта по внутренним требованиям</li>
					</ul>
				</div>,
				<div key="expertise-sound" className="text-gray-700">
					<span className="font-semibold text-gray-800">Экспертиза звукоизоляции</span>
					<div className="mt-1 text-gray-600">
						Анализ заложенных в проекте решений по звукоизоляции.
					</div>
				</div>,
			],
			price: 'PRO',
			buttonText: t('common.startPro'),
			active: true,
		},
		{
			id: 'normative-analytics',
			title: 'Аналитика нормативной документации',
			description: (
				<span className="text-gray-700">
					Выполняет глубокий анализ нормативных документов (СН, СП и др.).
				</span>
			),
			features: [
				<span key="norm-analytics-feature" className="text-gray-700">
					Задавайте любые вопросы — система создаст отчёт с прямыми ссылками на пункты и
					страницы документов.
				</span>,
			],
			price: 'PRO',
			buttonText: t('common.startPro'),
			active: true,
		},
	];

	const features: FeatureCard[] = [
		{
			id: 'sound-isolation',
			title: t('main.cards.sound.title'),
			description: t('main.cards.sound.desc'),
			features: [t('main.cards.sound.feature0')],
			price: 'FREE',
			buttonText: reportId && reportType ? t('common.continue') : t('common.start'),
			active: true,
			onClick: handleRedirect,
		},
		{
			id: 'heat-isolation',
			title: t('main.cards.heat.title'),
			description: t('main.cards.heat.desc'),
			features: [t('main.cards.heat.feature0')],
			price: 'PRO',
			buttonText: t('common.startPro'),
		},
	];

	const handleFeatureClick = useCallback(
		(featureId: string) => {
			console.log('Selected feature:', featureId);
		},
		[navigate],
	);

	return (
		<div className="w-full">
			<div className="mb-6 flex w-full items-center justify-between">
				<p className="font-sans text-lg font-semibold leading-6">{t('main.pageTitle')}</p>
			</div>

			<div className="mb-6 flex w-full items-center gap-[10px]">
				<h2 className="min-w-fit text-[15px] font-bold text-gray-400">
					{t('main.section.design')}
				</h2>
				<div className="h-px w-full bg-gray-400"></div>
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
					<CarouselSlide
						key={feature.id}
						className="min-w-0 basis-1/3 px-3 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
					>
						<div
							className={twMerge(
								'flex h-[300px] flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md',
								!feature.active && 'bg-gray-text/30',
							)}
						>
							<div className="mb-3 flex-1 overflow-hidden">
								<div className="mb-2 flex items-start justify-between">
									<h3 className="text-[15px] font-bold text-gray-800">
										{feature.title}
									</h3>
								</div>

								<div className="mb-3 flex items-start gap-3">
									<div className="shrink-0">
										<MainSliderLogo className="size-20" />
									</div>
									<div className="flex flex-col">
										<p className="text-xs text-gray-600">
											{feature.description}
										</p>
										<div className="mb-4 flex-1 overflow-auto">
											<ul className="space-y-1 pr-1">
												{feature.features.map((item, index) => (
													<li
														key={index}
														className="text-xs leading-snug text-gray-600"
													>
														• {item}
													</li>
												))}
											</ul>
										</div>
									</div>
								</div>
							</div>
							<div className="flex w-full justify-between">
								<button
									onClick={() => handleFeatureClick(feature.id)}
									className={twMerge(
										'mt-auto w-fit cursor-default self-end rounded-lg bg-gray-text px-3 py-2 text-xs font-semibold text-white transition-colors',
									)}
								>
									{t('common.free')}
								</button>
								<button
									onClick={feature.onClick}
									className={twMerge(
										'mt-auto w-fit cursor-default self-end rounded-lg bg-gray-text px-3 py-2 text-xs font-semibold text-white transition-colors',

										'cursor-pointer bg-primary hover:bg-blue-700',
									)}
								>
									{feature.buttonText}
								</button>
							</div>
						</div>
					</CarouselSlide>
				))}
			</Carousel>

			<div className="my-6 flex w-full items-center gap-[10px]">
				<h2 className="min-w-fit text-[15px] font-bold text-gray-400">
					{t('main.section.aiAssistant')}
				</h2>
				<div className="h-px w-full bg-gray-400"></div>
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
					<CarouselSlide
						key={feature.id}
						className="min-w-0 basis-1/3 px-3 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
					>
						<div
							className={twMerge(
								'flex h-[300px] flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md',
								!feature.active && 'bg-gray-text/30',
							)}
						>
							<div className="mb-3 flex-1 overflow-hidden">
								<div className="mb-2 flex items-start justify-between">
									<h3 className="text-[15px] font-bold text-gray-800">
										{feature.title}
									</h3>
								</div>

								<div className="mb-3 flex items-start gap-3">
									<div className="shrink-0">
										<MainSliderLogo className="size-20" />
									</div>
									<div className="flex flex-col">
										<p className="text-xs text-gray-600">
											{feature.description}
										</p>
										<div className="mb-4 flex-1 overflow-auto">
											<ul className="space-y-1 pr-1">
												{feature.features.map((item, index) => (
													<li
														key={index}
														className="text-xs leading-snug text-gray-600"
													>
														• {item}
													</li>
												))}
											</ul>
										</div>
									</div>
								</div>
							</div>
						</div>
					</CarouselSlide>
				))}
			</Carousel>
		</div>
	);
};
