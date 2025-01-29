import { Button, ChevronLandingIcon } from '@core';

export const News = () => {
	return (
		<div className="flex w-1/2 flex-col justify-between gap-[15px] rounded-xl border border-gray-border bg-white px-[18px] pb-[15px] pt-[20px]">
			<p className="font-sans text-2xl font-semibold leading-4">Новости</p>
			<div className="flex flex-row items-center justify-between">
				<div className="flex gap-[12px]">
					<Button className="flex size-[24px] items-center justify-center p-0">
						<ChevronLandingIcon color="white" className="w-[5px]" direction="left" />
					</Button>
					<Button className="flex size-[24px] items-center justify-center p-0">
						<ChevronLandingIcon color="white" className="w-[5px]" direction="right" />
					</Button>
				</div>
				<p className="cursor-pointer text-primary">читать полностью...</p>
			</div>
		</div>
	);
};
