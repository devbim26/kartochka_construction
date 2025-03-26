import { ConstructorHeader } from '../components';
import { AboutBuildingForm } from '../components/about-building-form.component';

const ConstructorScreen = () => {
	return (
		<div className="flex w-full flex-col gap-[30px] pb-[29px]">
			<ConstructorHeader />
			<AboutBuildingForm />
		</div>
	);
};

export default ConstructorScreen;
