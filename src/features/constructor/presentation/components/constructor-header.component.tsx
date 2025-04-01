import { Button } from '@core';
import { FaPlus } from 'react-icons/fa6';

export const ConstructorHeader = () => {
	return (
		<div className="flex w-full flex-col gap-[30px]">
			<p className="font-sans text-lg font-semibold leading-6">Конструктор</p>
			<div className="flex flex-row gap-[20px]">
				<Button className="flex w-[110px] flex-row items-center px-[16px] py-[6px]">
					<FaPlus fill="white" width={'16px'} height={'16px'} />
					<p className="font-sans text-sm font-semibold leading-4 text-white">О здании</p>
				</Button>
				<Button className="flex w-[147px] flex-row items-center px-[16px] py-[6px]">
					<p className="font-sans text-sm font-semibold leading-4 text-white">
						Поэтажные планы
					</p>
				</Button>
			</div>
		</div>
	);
};
