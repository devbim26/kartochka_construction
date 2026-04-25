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
				<div className="flex w-full items-stretch gap-[20px] bg-white">
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
						</div>
						<div
							className={twMerge(
								'text-right text-[20px] text-gray-text',
								isPlatformSwitch && 'text-black',
							)}
						>
							<p className="font-bold">{t('landing.about.platform.block1.title')}</p>
							<p className="mt-[8px]">{t('landing.about.platform.block1.desc')}</p>
							<p className="mt-[6px] text-[20px] font-light italic">
								{t('landing.about.platform.block1.codeNote')}
							</p>
							<p className="mt-[12px] font-bold">
								{t('landing.about.platform.block2.title')}
							</p>
							<p className="mt-[8px]">{t('landing.about.platform.block2.desc')}</p>
						</div>
					</div>
					<div className="flex flex-col items-center justify-center gap-[15px] self-stretch">
						<Switch onChange={() => setIsPlatformSwitch((prev) => !prev)} />
						<div className="h-full w-[2px] bg-gray-text"></div>
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
						</div>
						<div
							className={twMerge(
								'text-[20px] text-gray-text',
								!isPlatformSwitch && 'text-black',
							)}
						>
							<ul className="mt-[8px] list-disc space-y-[8px] pl-[26px]">
								<li>
									<span className="font-bold">
										{t('landing.about.expertise.item1.title')}
									</span>{' '}
									{t('landing.about.expertise.item1.desc')}
								</li>
								<li>
									<span className="font-bold">
										{t('landing.about.expertise.item2.title')}
									</span>{' '}
									{t('landing.about.expertise.item2.desc')}
								</li>
								<li>
									<span className="font-bold">
										{t('landing.about.expertise.item3.title')}
									</span>{' '}
									{t('landing.about.expertise.item3.desc')}{' '}
									<span className="font-bold">
										{t('landing.about.expertise.item3.chatBold')}
									</span>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
