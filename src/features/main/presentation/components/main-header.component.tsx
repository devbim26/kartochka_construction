import { Button } from '@core';
import { PlusIcon } from '@core/presentation/icons/plus.icon';

export const MainHeader = () => {
	return (
		<div className="flex flex-row items-center justify-between">
			<p className="font-sans text-lg font-semibold leading-4">Главная</p>
			<Button className="px-[16px] py-[6px] font-semibold">
				<div className="flex flex-row items-center gap-[5px]">
					<PlusIcon /> Создать новый проект
				</div>
			</Button>
		</div>
	);
};
