import { APP_ROUTES, Carousel, CarouselSlide, MainSliderLogo, useAppNavigate, useI18n } from '@core';
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
			title: t('main.ai.visualization.title'),
			description: t('main.ai.visualization.desc'),
			features: [
				t('main.ai.visualization.feature0'),
				t('main.ai.visualization.feature1'),
			],
			price: 'PRO',
			buttonText: t('common.startPro'),
			active: true,
		},
		{
			id: 'norm-control',
			title: t('main.ai.normControl.title'),
			description: t('main.ai.normControl.desc'),
			features: [t('main.ai.normControl.feature0')],
			price: 'PRO',
			buttonText: t('common.startPro'),
			active: true,
		},
		{
			id: 'document-analytics',
			title: t('main.ai.docAnalytics.title'),
			description: t('main.ai.docAnalytics.desc'),
			features: [t('main.ai.docAnalytics.feature0')],
			price: 'PRO',
			buttonText: t('common.startPro'),
			active: true,
		},
		{
			id: 'internet-search',
			title: t('main.ai.internetSearch.title'),
			description: t('main.ai.internetSearch.desc'),
			features: [t('main.ai.internetSearch.feature0')],
			price: 'PRO',
			buttonText: t('common.startPro'),
			active: true,
		},
		{
			id: 'ifc-analytics',
			title: t('main.ai.ifc.title'),
			description: t('main.ai.ifc.desc'),
			features: [t('main.ai.ifc.feature0')],
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
								'flex h-full flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md',
								!feature.active && 'bg-gray-text/30',
							)}
						>
							<div className="mb-3">
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
								'flex h-full flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md',
								!feature.active && 'bg-gray-text/30',
							)}
						>
							<div className="mb-3 h-full">
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
									onClick={() => handleFeatureClick(feature.id)}
									className={twMerge(
										'mt-auto w-fit cursor-default self-end rounded-lg bg-gray-text px-3 py-2 text-xs font-semibold text-white transition-colors',

										'cursor-pointer bg-primary hover:bg-blue-700',
									)}
								>
									{t('common.startPro')}
								</button>
							</div>
						</div>
					</CarouselSlide>
				))}
			</Carousel>
		</div>
	);
};
