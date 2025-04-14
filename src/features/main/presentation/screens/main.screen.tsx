import { CurrentSub } from '@core';
import { MainHeader, News } from '../components';
import { SubSelect } from '@features/landing';

const MainScreen = () => {
	return (
		<div className="flex w-full flex-col gap-[30px] pb-[29px]">
			<MainHeader />
			<div className="flex w-full flex-row gap-[20px]">
				<News />
				<CurrentSub />
			</div>
			<SubSelect wrapperClassName="w-full p-0" subContainerClassName="bg-white" />
		</div>
	);
};

export default MainScreen;
