import { LogoIcon, LogoTextIcon } from '@core/presentation/logos';

export const PageLoader = () => {
	return (
		<div className="flex grow items-center justify-center">
			<div className="flex animate-pulse flex-row items-center gap-[12px]">
				<LogoIcon className="h-[40px] w-[39px]" />
				<LogoTextIcon className="h-[64px] w-[170px]" />
			</div>
		</div>
	);
};
