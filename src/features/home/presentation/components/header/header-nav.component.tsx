import { LandingSections } from '@features/landing/constants';
import { HeaderNavItem } from './header-nav-item.component';

export const HeaderNav = ({ onItemClick }: { onItemClick?: () => void }) => {
	return (
		<div className="flex flex-col sm:w-full sm:flex-1 sm:justify-center">
			<div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-[30px]">
				<HeaderNavItem
					navOptions={{
						...LandingSections.aboutUs,
					}}
					onItemClick={onItemClick}
				/>
				<HeaderNavItem
					navOptions={{
						...LandingSections.subscription,
					}}
					onItemClick={onItemClick}
				/>
				<HeaderNavItem
					navOptions={{
						...LandingSections.contacts,
					}}
					onItemClick={onItemClick}
				/>
				<HeaderNavItem
					navOptions={{
						...LandingSections.designing,
					}}
					onItemClick={onItemClick}
				/>
			</div>
		</div>
	);
};
