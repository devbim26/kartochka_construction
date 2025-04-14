import { Outlet } from 'react-router-dom';
import { ConstructorHeader } from '../components';

const ConstructorScreen = () => {
	return (
		<div className="flex w-full flex-col gap-[30px] pb-[29px]">
			<ConstructorHeader />
			<Outlet />
		</div>
	);
};

export default ConstructorScreen;
