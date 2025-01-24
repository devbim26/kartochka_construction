import { Button } from '@core';
import { FaPlus } from 'react-icons/fa6';

export const MainHeader = () => {
	return (
		<div className="flex flex-row items-center justify-between">
			<p className="font-sans text-lg font-semibold leading-6">Главная</p>
			<Button className="flex flex-row items-center px-[16px] py-[6px]">
				<FaPlus fill="white" width={'16px'} height={'16px'} />
				<p className="font-sans text-sm font-semibold leading-4 text-white">
					Создать новый проект
				</p>
			</Button>
		</div>
	);
};
