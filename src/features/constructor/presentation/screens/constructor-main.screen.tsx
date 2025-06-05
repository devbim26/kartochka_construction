import { Outlet } from 'react-router-dom';
import { ConstructorHeader } from '../components';

export const ConstructorLayout = () => {
	// useLayoutEffect(() => {
	// 	navigate(
	// 		`${APP_ROUTES.designing.route}/${DESIGNING_ROUTES.constructor.route}/${CONSTRUCTOR_ROUTES.aboutBuilding.route}`,
	// 	);
	// }, []);

	return (
		<div className="flex w-full flex-col gap-[30px] pb-[29px]">
			<ConstructorHeader />
			<Outlet />
		</div>
	);
};
