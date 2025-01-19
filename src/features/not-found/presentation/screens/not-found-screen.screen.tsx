import { LogoIcon, LogoTextIcon } from '@core';

export const NotFoundScreen = () => {
	return (
		<div className="flex h-screen w-screen items-center justify-center">
			<div className="flex flex-col gap-[30px]">
				<p className="text-center text-lg text-input-value-black">404 Not found</p>
				<div className="flex animate-pulse flex-row items-center gap-[12px]">
					<LogoIcon className="h-[40px] w-[39px]" />
					<LogoTextIcon className="h-[64px] w-[170px]" />
				</div>
			</div>
		</div>
	);
};
