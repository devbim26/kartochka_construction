import { APP_ROUTES, Carousel, CarouselSlide, MainSliderLogo, useAppNavigate } from '@core';
import { CONSTRUCTOR_ROUTES } from '@features/constructor';
import { DESIGNING_ROUTES } from '@features/home/constants';
import { useCallback } from 'react';
import { twMerge } from 'tailwind-merge';

interface FeatureCard {
	id: string;
	title: string;
	description: string;
	features: string[];
	price: 'FREE' | 'PRO';
	buttonText: string;
	isPro?: boolean;
}

const AIFeatures: FeatureCard[] = [
	{
		id: 'ai-assistant',
		title: 'Визуализация',
		description: 'Визуализация фасадов и интерьеров',
		features: [
			'AI-генерация изображений с кастомными настройками.',
			'Меняйте материалы, мебель, положение камеры и др.',
		],
		price: 'PRO',
		buttonText: 'Начать PRO',
	},
	{
		id: 'norm-control',
		title: 'Нормоконтроль',
		description: 'Проверка на соответствия действующим ТНПА Беларуси',
		features: ['Генерация отчетов'],
		price: 'PRO',
		buttonText: 'Начать PRO',
	},
	{
		id: 'document-analytics',
		title: 'Аналитика документов',
		description: 'AI проверяет, суммирует и структурирует документы',
		features: ['Выдает готовый отчет в DOC/Excel для смет, ТЗ, протоколов.'],
		price: 'PRO',
		buttonText: 'Начать PRO',
	},
	{
		id: 'internet-search',
		title: 'Поиск в интернете. deep research',
		description: 'Проверка на соответствия действующим ТНПА Беларуси',
		features: ['Генерация отчетов'],
		price: 'PRO',
		buttonText: 'Начать PRO',
	},
	{
		id: 'ifc-analytics',
		title: 'Аналитика IFC модели',
		description: 'Проверка на соответствия действующим ТНПА Беларуси',
		features: ['Генерация отчетов'],
		price: 'PRO',
		buttonText: 'Начать PRO',
	},
];

const features: FeatureCard[] = [
	{
		id: 'sound-isolation',
		title: 'Расчет звукоизоляции',
		description: 'стен и перекрытий по СП 02.03.01-2023.',
		features: ['Генератор PDF-отчет с формулами, готовый к подаче на экспертизу.'],
		price: 'FREE',
		buttonText: 'Начать',
	},
	{
		id: 'heat-isolation',
		title: 'Расчет теплоизоляции',
		description: 'стен и перекрытий по СП 02.03.01-2023.',
		features: ['Генератор PDF-отчет с формулами, готовый к подаче на экспертизу.'],
		price: 'PRO',
		buttonText: 'Начать PRO',
	},
];

export const MainHeader = () => {
	const navigate = useAppNavigate();

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

	const handleFeatureClick = useCallback(
		(featureId: string) => {
			console.log('Selected feature:', featureId);
		},
		[navigate],
	);

	return (
		<div className="w-full">
			<div className="mb-6 flex w-full items-center justify-between">
				<p className="font-sans text-lg font-semibold leading-6">Главная</p>
				{/* <button
					onClick={handleRedirect}
					className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
				>
					{reportId && reportType ? 'Продолжить проектирование' : 'Создать новый проект'}
					<FaArrowRight className="size-4" />
				</button> */}
			</div>

			<div className="mb-6 flex w-full items-center gap-[10px]">
				<h2 className="min-w-fit text-[15px] font-bold text-gray-400">
					Проектирование и расчеты
				</h2>
				<div className="h-[2px] w-full bg-gray-400"></div>
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
						<div className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
							<div className="mb-3">
								<div className="mb-2 flex items-start justify-between">
									<h3 className="text-[15px] font-semibold text-gray-800">
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
										<div className="mb-4 flex-1">
											<ul className="space-y-1">
												{feature.features.map((item, index) => (
													<li
														key={index}
														className="text-xs text-gray-600"
													>
														• {item}
													</li>
												))}
											</ul>
										</div>
									</div>
								</div>
							</div>
							<button
								onClick={() => handleFeatureClick(feature.id)}
								className={twMerge(
									'mt-auto w-[150px] cursor-default self-end rounded-lg bg-gray-text px-3 py-2 text-xs font-semibold text-white transition-colors',
									feature.price === 'FREE' &&
										'cursor-pointer bg-primary hover:bg-blue-700',
								)}
							>
								{feature.price === 'FREE' ? 'Начать бесплатно' : 'Начать PRO'}
							</button>
						</div>
					</CarouselSlide>
				))}
			</Carousel>

			<div className="my-6 flex w-full items-center gap-[10px]">
				<h2 className="min-w-fit text-[15px] font-bold text-gray-400">AI ассистент</h2>
				<div className="h-[2px] w-full bg-gray-400"></div>
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
						<div className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
							<div className="mb-3">
								<div className="mb-2 flex items-start justify-between">
									<h3 className="text-[15px] font-semibold text-gray-800">
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
										<div className="mb-4 flex-1">
											<ul className="space-y-1">
												{feature.features.map((item, index) => (
													<li
														key={index}
														className="text-xs text-gray-600"
													>
														• {item}
													</li>
												))}
											</ul>
										</div>
									</div>
								</div>
							</div>
							<button
								onClick={() => handleFeatureClick(feature.id)}
								className={twMerge(
									'mt-auto w-[150px] cursor-default self-end rounded-lg bg-gray-text px-3 py-2 text-xs font-semibold text-white transition-colors',
									feature.price === 'FREE' &&
										'cursor-pointer bg-primary hover:bg-blue-700',
								)}
							>
								{feature.price === 'FREE' ? 'Начать бесплатно' : 'Начать PRO'}
							</button>
						</div>
					</CarouselSlide>
				))}
			</Carousel>
		</div>
	);
};
