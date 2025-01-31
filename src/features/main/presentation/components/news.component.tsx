import { Button } from '@core';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';

export const News = () => {
	return (
		<div className="flex w-1/2 flex-col justify-between gap-[15px] rounded-xl border border-gray-border bg-white px-[18px] pb-[15px] pt-[20px]">
			<p className="font-sans text-2xl font-semibold leading-4">Новости</p>
			<div className="flex flex-row items-center justify-between">
				<div className="flex gap-[12px]">
					<Button className="flex h-[28px] w-[28px] items-center justify-center p-0">
						<FaAngleLeft />
					</Button>
					<Button className="flex h-[28px] w-[28px] items-center justify-center p-0">
						<FaAngleRight />
					</Button>
				</div>
				<p className="cursor-pointer font-sans text-base leading-5 text-primary">
					читать полностью...
				</p>
			</div>
		</div>
	);
};
