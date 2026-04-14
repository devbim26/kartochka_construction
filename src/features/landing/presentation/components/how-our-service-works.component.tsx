import { AboutUs1, AboutUs2, AboutUs3, AboutUs4, AboutUs5 } from '@assets';
import { Chevron, useI18n } from '@core';
import { useCallback, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

const aboutImages = [AboutUs1, AboutUs2, AboutUs3, AboutUs4, AboutUs5];
const cardAccentColors = ['#B1C9E3', '#EED0C5', '#F3F2BA', '#DFA4C2', '#B2CAA0'];
const stepKeys = [0, 1, 2, 3, 4] as const;

export const HowOurServiceWorks = () => {
	const [selectedStep, setSelectedStep] = useState(0);
	const [isHover, setIsHover] = useState<boolean | null>(null);
	const [cardHeightPx, setCardHeightPx] = useState<number | null>(null);
	const frontFaceRef = useRef<HTMLDivElement>(null);
	const backFaceRef = useRef<HTMLDivElement>(null);
	const { t } = useI18n();
	const stepTitles = stepKeys.map((index) => t(`landing.how.step.${index}`));
	const cardContents: Array<{ title: ReactNode; body: ReactNode }> = stepKeys.map((index) => ({
		title: (
			<span className="whitespace-pre-line font-bold not-italic">
				{t(`landing.how.desc.${index}`)}
			</span>
		),
		body: (
			<span className="whitespace-pre-line italic">{t(`landing.how.detail.${index}`)}</span>
		),
	}));

	const handleStepClick = (index: number) => {
		setSelectedStep(index);
	};

	const syncCardHeight = useCallback(() => {
		const front = frontFaceRef.current;
		const back = backFaceRef.current;
		if (!front || !back) return;
		const next = isHover ? back.offsetHeight : front.offsetHeight;
		if (next > 0) setCardHeightPx(next);
	}, [isHover]);

	useLayoutEffect(() => {
		syncCardHeight();
		const front = frontFaceRef.current;
		const back = backFaceRef.current;
		if (!front || !back) return;
		const ro = new ResizeObserver(() => syncCardHeight());
		ro.observe(front);
		ro.observe(back);
		return () => ro.disconnect();
	}, [syncCardHeight, selectedStep]);

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
							className="relative w-full overflow-hidden rounded-2xl transition-[height] duration-700 ease-in-out"
							style={cardHeightPx != null ? { height: cardHeightPx } : undefined}
						>
							<div
								className={twMerge(
									'relative w-full min-h-0 [transform-style:preserve-3d] will-change-transform',
									cardHeightPx != null && 'h-full',
									'transition-transform duration-700 ease-in-out',
									isHover
										? '[transform:rotateY(180deg)]'
										: '[transform:rotateY(0deg)]',
								)}
							>
								{/* translateZ separates faces for Firefox (coplanar backface bugs) */}
								<div
									ref={frontFaceRef}
									className={twMerge(
										'absolute left-0 right-0 top-0 flex w-full flex-col gap-5 rounded-2xl bg-white p-6 shadow-blue md:p-7',
										'[backface-visibility:hidden] [transform:translateZ(1px)]',
									)}
								>
									<div className="relative z-10 flex flex-col gap-4">
										<div
											className="flex w-full flex-row items-start justify-between gap-4 rounded-xl px-3 py-2.5 sm:gap-6"
											style={{
												backgroundColor: cardAccentColors[selectedStep],
											}}
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
								</div>

								<div
									ref={backFaceRef}
									className={twMerge(
										'absolute left-0 right-0 top-0 flex w-full flex-col gap-4 rounded-2xl bg-white p-6 shadow-blue md:p-7',
										'[backface-visibility:hidden] [transform:rotateY(180deg)_translateZ(1px)]',
									)}
								>
									<div className="font-montserrat font-semibold leading-snug text-black sm:text-lg">
										{stepTitles[selectedStep]}
									</div>
									<div className="flex justify-center">
										<img
											src={aboutImages[selectedStep]}
											alt=""
											aria-hidden="true"
											loading="lazy"
											className="max-h-[min(50vh,420px)] w-full max-w-full object-contain"
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
