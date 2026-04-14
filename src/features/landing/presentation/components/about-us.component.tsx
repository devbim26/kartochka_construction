import { Switch, useI18n } from '@core';
import { LandingSections } from '@features/landing/constants';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

export const AboutUsComponent = () => {
	const [isPlatformSwitch, setIsPlatformSwitch] = useState<boolean>(true);
	const { t } = useI18n();

	return (
		<div
			className="w-full bg-white px-6 py-8 xs:px-8 sm:px-12 md:px-14 lg:px-20"
			id={LandingSections.aboutUs.id}
		>
			<div className="mx-auto max-w-screen-xl py-[50px]">
				<div className="flex w-full gap-[20px] bg-white">
					<div className="flex flex-col gap-[15px]">
						<div className="flex flex-col gap-[2px]">
							<span
								className={twMerge(
									'text-right text-[20px] font-bold text-gray-text',
									isPlatformSwitch && 'text-primary',
								)}
							>
								{t('landing.about.platformTitle')}
							</span>
							<span
								className={twMerge(
									'text-right text-[20px] font-bold italic text-gray-text',
									isPlatformSwitch && 'text-primary',
								)}
							>
								{t('landing.about.platformSubtitle')}
							</span>
						</div>
						<span
							className={twMerge(
								'text-right text-[20px] font-bold italic text-gray-text',
								isPlatformSwitch && 'text-black',
							)}
						>
							{t('landing.about.platformDesc')}
						</span>
					</div>
					<div className="flex flex-col items-center justify-center gap-[15px]">
						<Switch onChange={() => setIsPlatformSwitch((prev) => !prev)} />
						<div className="h-[80px] w-[2px] bg-gray-text"></div>
					</div>
					<div className="flex flex-col gap-[15px]">
						<div className="flex flex-col gap-[2px]">
							<span
								className={twMerge(
									'text-[20px] font-bold text-gray-text',
									!isPlatformSwitch && 'text-primary',
								)}
							>
								{t('landing.about.aiTitle')}
							</span>
							<span
								className={twMerge(
									'text-[20px] font-bold italic text-gray-text',
									!isPlatformSwitch && 'text-primary',
								)}
							>
								{t('landing.about.aiSubtitle')}
							</span>
						</div>
						<span
							className={twMerge(
								'text-[20px] font-bold italic text-gray-text',
								!isPlatformSwitch && 'text-black',
							)}
						>
							{t('landing.about.aiDesc')}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};
