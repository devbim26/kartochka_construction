import { AboutUs1, AboutUs2, AboutUs3, AboutUs4, AboutUs5 } from '@assets';
import { Chevron, useI18n } from '@core';
import { useState, type ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

const aboutImages = [AboutUs1, AboutUs2, AboutUs3, AboutUs4, AboutUs5];
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
		title: <span className="font-bold">Расчет звукоизоляции стен и перекрытий</span>,
		body: (
			<span className="whitespace-pre-line italic">
				{'по СП 02.04.03-2023.\n\nГенерирует PDF-отчет с формулами, готовый к подаче на экспертизу.'}
			</span>
		),
	},
	{
		title: (
			<div className="whitespace-pre-line">
				<span className="font-bold">Общий</span>
				{'\n'}
				<span className="italic">
					Доступ к новейшим моделям ИИ (от Open AI, Antropic, Google, Китайские модели)
				</span>
				{'\n\n'}
				<span className="font-bold">Аналитика документов PDF</span>
			</div>
		),
		body: (
			<div className="whitespace-pre-line italic">
				AI проверяет, суммаризирует и структурирует документы. Выдает готовый отчет в DOC/Excel
				— для смет, ТЗ, протоколов.
				{'\n\n'}
				<span className="not-italic font-bold">DeepResearch (Perplexity Sonar Pro Search)</span>
				{'\n'}
				глубокий поиск информации в интернете со ссылками на первоисточник
			</div>
		),
	},
	{
		title: (
			<div className="whitespace-pre-line">
				<span className="font-bold">AI-генерация изображений</span>
				{'\n'}
				<span className="italic">с кастомными настройками.</span>
			</div>
		),
		body: (
			<div className="whitespace-pre-line italic">
				Меняйте фасады, мебель,{'\n'}положение камеры и др.{'\n'}в один клик.
			</div>
		),
	},
	{
		title: (
			<div className="whitespace-pre-line">
				<span className="font-bold">Общая экспертиза</span>
				{'\n'}
				<span className="italic">
					- Проверяет общую структуру проекта;{'\n'}- Проверяет проект на соответствие
					актуальным ТНПА.{'\n'}- Проверка проекта по внутренним требованиям
				</span>
				{'\n\n'}
				<span className="font-bold">Экспертиза звукоизоляции</span>
			</div>
		),
		body: <span className="italic">Анализ заложенных в проекте решений по звукоизоляции</span>,
	},
	{
		title: (
			<div className="whitespace-pre-line">
				<span className="font-bold">Общая экспертиза</span>
				{'\n'}
				<span className="italic">
					- Проверяет общую структуру проекта;{'\n'}- Проверяет проект на соответствие
					актуальным ТНПА.{'\n'}- Проверка проекта по внутренним требованиям
				</span>
				{'\n\n'}
				<span className="font-bold">Экспертиза звукоизоляции</span>
			</div>
		),
		body: <span className="italic">Анализ заложенных в проекте решений по звукоизоляции</span>,
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
						className="relative w-[299px] [perspective:1200px] sm:w-[299px] md:w-[479px] lg:w-[555px] xl:w-[839px]"
						onMouseEnter={() => setIsHover(true)}
						onMouseLeave={() => setIsHover(false)}
					>
						<div
							className={twMerge(
								'relative min-h-[260px] w-full md:h-[408px]',
								'transition-transform duration-700 ease-in-out [transform-style:preserve-3d]',
								isHover
									? '[transform:rotateY(180deg)]'
									: '[transform:rotateY(0deg)]',
							)}
						>
							<div
								className={twMerge(
									'absolute inset-0 flex min-h-[260px] w-full flex-col gap-6 rounded-2xl bg-white p-5 shadow-blue',
									'[backface-visibility:hidden]',
								)}
							>
								{/* Content over image */}
								<div className="relative z-10 flex flex-col gap-6">
									<div
										className="flex w-full flex-row items-start justify-between gap-4 rounded-xl px-3 py-2 sm:gap-6"
										style={{ backgroundColor: cardAccentColors[selectedStep] }}
									>
										<div className="font-montserrat font-bold leading-snug text-black sm:text-lg">
											{stepTitles[selectedStep]}
										</div>
									</div>
									<div className="px-2 font-montserrat text-sm leading-relaxed text-black sm:text-base">
										{cardContents[selectedStep]?.title}
									</div>
									<div className="px-2 font-montserrat text-sm leading-relaxed text-black sm:text-base">
										{cardContents[selectedStep]?.body}
									</div>
								</div>
							</div>

							<div
								className={twMerge(
									'absolute inset-0 flex h-full min-h-[260px] w-full flex-col gap-4 overflow-hidden rounded-2xl bg-white p-5 shadow-blue',
									'[backface-visibility:hidden] [transform:rotateY(180deg)]',
								)}
							>
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
	);
};
