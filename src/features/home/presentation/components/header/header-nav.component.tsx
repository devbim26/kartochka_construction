import { LandingSections } from '@features/landing/constants';
import { HeaderNavItem } from './header-nav-item.component';

export const HeaderNav = () => {
	return (
		<div className="flex w-full flex-1 justify-center">
			<div className="flex flex-row items-center gap-[30px]">
				<HeaderNavItem
					navOptions={{
						...LandingSections.aboutUs,
					}}
				/>
				<HeaderNavItem
					navOptions={{
						...LandingSections.subscription,
					}}
				/>
				<HeaderNavItem
					navOptions={{
						...LandingSections.contacts,
					}}
				/>
				<HeaderNavItem
					navOptions={{
						...LandingSections.designing,
					}}
				/>
			</div>
		</div>
	);
};
