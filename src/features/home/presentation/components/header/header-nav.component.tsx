import { LandingSections } from '@features/landing/constants';
import { HeaderNavItem } from './header-nav-item.component';

export const HeaderNav = ({
	mobile = false,
	onItemClick,
}: {
	mobile?: boolean;
	onItemClick?: () => void;
}) => {
	return (
		<div className={`${mobile ? 'flex flex-col gap-6' : 'flex w-full flex-1 justify-center'}`}>
			<div
				className={`${mobile ? 'flex flex-col gap-6' : 'flex flex-row items-center gap-[30px]'}`}
			>
				<HeaderNavItem
					navOptions={{
						...LandingSections.aboutUs,
					}}
					mobile={mobile}
					onItemClick={onItemClick}
				/>
				<HeaderNavItem
					navOptions={{
						...LandingSections.subscription,
					}}
					mobile={mobile}
					onItemClick={onItemClick}
				/>
				<HeaderNavItem
					navOptions={{
						...LandingSections.contacts,
					}}
					mobile={mobile}
					onItemClick={onItemClick}
				/>
				<HeaderNavItem
					navOptions={{
						...LandingSections.designing,
					}}
					mobile={mobile}
					onItemClick={onItemClick}
				/>
			</div>
		</div>
	);
};
