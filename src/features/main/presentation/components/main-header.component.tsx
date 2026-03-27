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

const featureAccentColors: Record<string, string> = {
	'sound-isolation': '#B1C9E3',
	'ai-assistant': '#EED0C5',
	'ai-visualization': '#F3F2BA',
	'project-expertise': '#DFA4C2',
	'normative-analytics': '#B2CAA0',
};

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

	const handleAiVisualizationRedirect = useCallback(() => {
		navigate(APP_ROUTES.designing.route + '/' + DESIGNING_ROUTES.visualization.route);
	}, [navigate]);

	const AIFeatures: FeatureCard[] = [
		{
			id: 'ai-assistant',
			title: 'AI mode (3 режима)',
			description: (
				<div className="flex flex-col gap-3 text-gray-700">
					<p>
						<span className="font-semibold text-gray-800">Общий</span>
						<br />
						Доступ к новейшим моделям ИИ
					</p>
					<p>
						<span className="font-semibold text-gray-800">
							Аналитика документов PDF
						</span>
						<br />
						AI проверяет, суммаризирует и структурирует документы.
					</p>
					<p>
						<span className="font-semibold text-gray-800">DeepResearch</span> глубокий
						поиск в интернете
					</p>
				</div>
			),
			features: [],
			price: 'PRO',
			buttonText: t('common.start'),
			active: true,
			onClick: handleAiVisualizationRedirect,
		},
		{
			id: 'ai-visualization',
			title: 'Визуализация фасадов и интерьеров',
			description: (
				<div className="flex flex-col gap-3 text-gray-700">
					<p>
						<span className="font-semibold text-gray-800">AI-генерация</span>{' '}
						изображений
						<br />с кастомными настройками.
					</p>
					<p className="italic">
						Меняйте фасады, мебель,
						<br />
						положение камеры и др.
						<br />в один клик.
					</p>
				</div>
			),
			features: [],
			price: 'PRO',
			buttonText: t('common.startPro'),
			active: true,
		},
		{
			id: 'project-expertise',
			title: 'Экспертиза проекта (2 режима)',
			description: (
				<div className="flex flex-col gap-3 text-gray-700">
					<div>
						<span className="font-semibold text-gray-800">"Общая экспертиза"</span>
						<div className="italic text-gray-600">
							- Проверяет общую структуру проекта;
							<br />- Проверяет проект на соответствие актуальным ТНПА.
						</div>
					</div>
					<div>
						<span className="font-semibold text-gray-800">
							"Экспертиза звукоизоляции"
						</span>
						<div className="italic text-gray-600">
							Анализ заложенных в проекте решений по звукоизоляции.
						</div>
					</div>
				</div>
			),
			features: [],
			price: 'PRO',
			buttonText: t('common.startPro'),
			active: true,
		},
		{
			id: 'normative-analytics',
			title: 'Аналитика нормативной документации',
			description: (
				<div className="flex flex-col gap-3 text-gray-700">
					<p className="font-semibold text-gray-800">
						Выполняет глубокий анализ нормативных документов (СН, СП и др.)
					</p>
					<p className="italic">
						Задавайте любые вопросы, система создаст отчет с прямыми ссылками на пункты
						и страницы документов
					</p>
				</div>
			),
			features: [],
			price: 'PRO',
			buttonText: t('common.startPro'),
			active: true,
		},
	];

	const features: FeatureCard[] = [
		{
			id: 'sound-isolation',
			title: 'Расчет звукоизоляции стен и перекрытий',
			description: (
				<div className="flex flex-col gap-1">
					<p>Расчет звукоизоляции стен и перекрытий по СП 02.04.03-2023</p>
					<p className="italic">
						Генерирует PDF-отчет с формулами, готовый к подаче на экспертизу.
					</p>
				</div>
			),
			features: [],
			price: 'FREE',
			buttonText: reportId && reportType ? t('common.continue') : t('common.start'),
			active: true,
			onClick: handleRedirect,
		},
		{
			id: 'heat-isolation',
			title: 'Расчет теплоизоляции стен',
			description: (
				<div className="flex flex-col gap-1">
					<p>Расчет теплоизоляции стен по СП 2.04.01-2020</p>
					<p className="italic">
						Генерирует PDF-отчет с формулами, готовый к подаче на экспертизу.
					</p>
				</div>
			),
			features: [],
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
						className="min-w-0 basis-full px-3 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
					>
						<div
							className={twMerge(
								'flex h-[300px] flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md',
								!feature.active && 'bg-gray-text/30',
							)}
						>
							<div className="mb-3 flex-1 overflow-hidden">
								<div className="mb-2 flex items-start justify-between">
									<div
										className="w-full rounded-xl px-3 py-1.5"
										style={{
											backgroundColor:
												featureAccentColors[feature.id] || '#B1C9E3',
										}}
									>
										<h3 className="truncate text-[18px] font-bold leading-6 text-gray-800 sm:text-[19px]">
											{feature.title}
										</h3>
									</div>
								</div>

								<div className="mb-3 flex items-start gap-3">
									<div className="shrink-0">
										<MainSliderLogo className="size-16" />
									</div>
									<div className="flex flex-col">
										<div className="text-[16px] leading-6 text-gray-600">
											{feature.description}
										</div>
										<div className="mb-4 flex-1 overflow-auto">
											<ul className="space-y-1 pr-1">
												{feature.features.map((item, index) => (
													<li
														key={index}
														className="text-[17px] leading-snug text-gray-600"
													>
														• {item}
													</li>
												))}
											</ul>
										</div>
									</div>
								</div>
							</div>
							{feature.id !== 'heat-isolation' && (
								<div className="flex w-full justify-end">
									<button
										onClick={feature.onClick}
										className="mt-auto w-fit self-end rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
									>
										{feature.buttonText}
									</button>
								</div>
							)}
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
						className="min-w-0 basis-full px-3 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
					>
						<div
							className={twMerge(
								'flex h-[300px] flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md',
								!feature.active && 'bg-gray-text/30',
							)}
						>
							<div className="mb-3 flex-1 overflow-hidden">
								<div className="mb-2 flex items-start justify-between">
									<div
										className="w-full rounded-xl px-3 py-1.5"
										style={{
											backgroundColor:
												featureAccentColors[feature.id] || '#B1C9E3',
										}}
									>
										<h3 className="truncate text-[18px] font-bold leading-6 text-gray-800 sm:text-[19px]">
											{feature.title}
										</h3>
									</div>
								</div>

								<div className="mb-3 flex items-start gap-3">
									<div className="shrink-0">
										<MainSliderLogo className="size-16" />
									</div>
									<div className="flex flex-col">
										<div className="text-[16px] leading-6 text-gray-600">
											{feature.description}
										</div>
										<div className="mb-4 flex-1 overflow-auto">
											<ul className="space-y-1 pr-1">
												{feature.features.map((item, index) => (
													<li
														key={index}
														className="text-[17px] leading-snug text-gray-600"
													>
														• {item}
													</li>
												))}
											</ul>
										</div>
									</div>
								</div>
							</div>
							{feature.id === 'ai-assistant' && (
								<div className="flex w-full justify-end">
									<button
										onClick={feature.onClick}
										className="mt-auto w-fit self-end rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
									>
										{feature.buttonText}
									</button>
								</div>
							)}
						</div>
					</CarouselSlide>
				))}
			</Carousel>
		</div>
	);
};
