import { AboutBuildingForm, ConstructorHeader } from '../components';

const ConstructorScreen = () => {
	return (
		<div className="flex w-full flex-col gap-[30px] pb-[29px]">
			<ConstructorHeader />
			<AboutBuildingForm />
		</div>
	);
};

export default ConstructorScreen;
