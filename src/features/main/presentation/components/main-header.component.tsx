import { Button } from '@core';
import { FaPlus } from 'react-icons/fa6';

export const MainHeader = () => {
	return (
		<div className="flex flex-row items-center justify-between">
			<p className="font-sans text-lg font-semibold leading-4">Главная</p>
			<Button className="flex flex-row items-center px-[16px] py-[6px] font-semibold">
				<FaPlus fill="white" width={'16px'} height={'16px'} />
				Создать новый проект
			</Button>
		</div>
	);
};
