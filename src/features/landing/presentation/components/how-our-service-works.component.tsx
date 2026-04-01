import { AboutUs1, AboutUs2, AboutUs3, AboutUs4, AboutUs5 } from '@assets';
import { Chevron, useI18n } from '@core';
import {
	FifthNumberImage,
	FirstNumberImage,
	FourthNumberImage,
	SecondNumberImage,
	ThirdNumberImage,
} from '../images';
import { useState, type ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

const aboutImages = [AboutUs1, AboutUs2, AboutUs3, AboutUs4, AboutUs5];
const numberImages = [
	<FirstNumberImage key="1" />,
	<SecondNumberImage key="2" />,
	<ThirdNumberImage key="3" />,
	<FourthNumberImage key="4" />,
	<FifthNumberImage key="5" />,
];
const cardAccentColors = ['#B1C9E3', '#EED0C5', '#F3F2BA', '#DFA4C2', '#B2CAA0'];
const stepTitles = [
	'Проектирование. Звукоизоляция',
	'AI ассистент (3 режима)',
	'Визуализация фасадов и интерьеров',
	'Экспертиза проекта (2 режима)',
	'Аналитика нормативной документации',
];

const cardContents: Array<{ title: ReactNode; body: ReactNode }> = [
	{
		title: <span className="font-bold not-italic">Расчет звукоизоляции стен и перекрытий</span>,
		body: (
			<span className="whitespace-pre-line italic">
				{
					'по СП 02.04.03-2023.\n\nГенерирует PDF-отчет с формулами, готовый к подаче на экспертизу.'
				}
			</span>
		),
	},
	{
		title: (
			<div className="whitespace-pre-line">
				<span className="font-bold not-italic">Общий</span>
				{'\n'}
				<span className="italic">
					Доступ к новейшим моделям ИИ (от Open AI, Anthropic, Google, Китайские модели)
				</span>
				{'\n\n'}
				<span className="font-bold not-italic">Аналитика документов PDF</span>
			</div>
		),
		body: (
			<div className="whitespace-pre-line italic">
				AI проверяет, суммаризирует и структурирует документы. Выдает готовый отчет в
				DOC/Excel — для смет, ТЗ, протоколов.
				{'\n\n'}
				<span className="font-bold not-italic">
					DeepResearch (Perplexity Sonar Pro Search)
				</span>
				{'\n'}
				глубокий поиск информации в интернете со ссылками на первоисточник.
			</div>
		),
	},
	{
		title: (
			<div className="whitespace-pre-line">
				<span className="font-bold not-italic">
					AI-генерация изображений (nano banano 2 pro)
				</span>
			</div>
		),
		body: (
			<div className="whitespace-pre-line italic">
				С кастомными настройками. Меняйте материалы, мебель, положение камеры и др. в один
				клик.
			</div>
		),
	},
	{
		title: (
			<div className="whitespace-pre-line">
				<span className="font-bold not-italic">"Общая экспертиза"</span>
				{'\n'}
				<span className="italic">
					- Проверяет общую структуру проекта;{'\n'}- Проверяет проект на соответствие
					актуальным ТНПА;{'\n'}- Проверка проекта по внутренним требованиям.
				</span>
				{'\n\n'}
				<span className="font-bold not-italic">"Экспертиза звукоизоляции"</span>
			</div>
		),
		body: <span className="italic">Анализ заложенных в проекте решений по звукоизоляции.</span>,
	},
	{
		title: (
			<div className="whitespace-pre-line">
				<span className="font-bold not-italic">
					Выполняет глубокий анализ нормативных документов
				</span>
			</div>
		),
		body: (
			<span className="whitespace-pre-line italic">
				{
					'(СН, СП и др.). Задавайте любые вопросы, система создаст отчет с прямыми ссылками на пункты и страницы документов.'
				}
			</span>
		),
	},
];

export const HowOurServiceWorks = () => {
	const [selectedStep, setSelectedStep] = useState(0);
	const [isHover, setIsHover] = useState<boolean | null>(null);
	const { t } = useI18n();

	const handleStepClick = (index: number) => {
		setSelectedStep(index);
	};

	return (
		<div className="flex w-full justify-center bg-background-primary">
			<div className="w-full max-w-screen-xl px-4 py-12 sm:px-6 md:px-8 xl:px-20">
				<div className="mb-8 text-center font-montserrat text-lg font-normal leading-snug sm:text-xl">
					{t('landing.how.title')}
				</div>

				<div className="flex flex-col items-center justify-center gap-10 xs:flex-row xs:flex-nowrap xs:items-center xs:justify-center">
					<div className="w-full max-w-xs sm:max-w-sm md:max-w-md">
						<div className="mt-10 flex flex-col gap-6">
							{stepTitles.map((stepTitle, index) => (
								<div
									key={index}
									className="flex cursor-pointer flex-row justify-between gap-4 sm:gap-6"
									onClick={() => handleStepClick(index)}
								>
									<div
										className={twMerge(
											'font-montserrat text-base font-normal leading-snug transition-colors sm:text-lg',
											selectedStep === index ? 'text-primary' : 'text-black',
										)}
									>
										{index + 1}. {stepTitle}
									</div>
									<div className="flex">
										<Chevron
											color={selectedStep === index ? 'primary' : 'grey'}
											direction={selectedStep === index ? 'right' : 'down'}
										/>
									</div>
								</div>
							))}
						</div>
					</div>

					<div
						className="relative w-[320px] [perspective:1200px] [transform-style:preserve-3d] sm:w-[360px] md:w-[560px] lg:w-[660px] xl:w-[900px]"
						onMouseEnter={() => setIsHover(true)}
						onMouseLeave={() => setIsHover(false)}
					>
						<div
							className={twMerge(
								'relative min-h-[320px] w-full md:h-[500px]',
								'[transform-style:preserve-3d] will-change-transform',
								'transition-transform duration-700 ease-in-out',
								isHover
									? '[transform:rotateY(180deg)]'
									: '[transform:rotateY(0deg)]',
							)}
						>
							{/* translateZ separates faces for Firefox (coplanar backface bugs); avoid overflow on 3D layer */}
							<div
								className={twMerge(
									'absolute inset-0 flex min-h-[320px] w-full flex-col gap-5 rounded-2xl bg-white p-6 shadow-blue md:p-7',
									'[backface-visibility:hidden] [transform:translateZ(1px)]',
								)}
							>
								{/* Content over image */}
								<div className="relative z-10 flex min-h-0 flex-1 flex-col gap-4">
									<div
										className="flex w-full flex-row items-start justify-between gap-4 rounded-xl px-3 py-2.5 sm:gap-6"
										style={{ backgroundColor: cardAccentColors[selectedStep] }}
									>
										<div className="font-montserrat text-base font-bold leading-snug text-black sm:text-lg md:text-xl">
											{stepTitles[selectedStep]}
										</div>
									</div>
									<div className="px-2 font-montserrat text-sm italic leading-relaxed text-black sm:text-base md:text-[17px]">
										{cardContents[selectedStep]?.title}
									</div>
									<div className="px-2 font-montserrat text-sm italic leading-relaxed text-black sm:text-base md:text-[17px]">
										{cardContents[selectedStep]?.body}
									</div>
								</div>
								<div className="pointer-events-none absolute bottom-3 right-4 z-0 opacity-70">
									{numberImages[selectedStep]}
								</div>
							</div>

							<div
								className={twMerge(
									'absolute inset-0 flex h-full min-h-[320px] w-full flex-col gap-4 rounded-2xl bg-white p-6 shadow-blue md:p-7',
									'[backface-visibility:hidden] [transform:rotateY(180deg)_translateZ(1px)]',
								)}
							>
								<div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden">
									<div className="font-montserrat font-semibold leading-snug text-black sm:text-lg">
										{stepTitles[selectedStep]}
									</div>
									<div className="flex min-h-0 flex-1 items-center justify-center">
										<img
											src={aboutImages[selectedStep]}
											alt=""
											aria-hidden="true"
											loading="lazy"
											className="max-h-full max-w-full object-contain"
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
