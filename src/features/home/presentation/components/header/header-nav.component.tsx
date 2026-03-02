import { useI18n } from '@core';
import { LandingSections } from '@features/landing/constants';
import { HeaderNavItem } from './header-nav-item.component';

export const HeaderNav = ({ onItemClick }: { onItemClick?: () => void }) => {
	const { t } = useI18n();

	return (
		<div className="flex flex-col sm:w-full sm:flex-1 sm:justify-center">
			<div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-[30px]">
				<HeaderNavItem
					navOptions={{
						id: LandingSections.aboutUs.id,
						text: t('nav.aboutUs'),
					}}
					onItemClick={onItemClick}
				/>
				<HeaderNavItem
					navOptions={{
						id: LandingSections.subscription.id,
						text: t('nav.subscription'),
					}}
					onItemClick={onItemClick}
				/>
				<HeaderNavItem
					navOptions={{
						id: LandingSections.contacts.id,
						text: t('nav.contacts'),
					}}
					onItemClick={onItemClick}
				/>
				<HeaderNavItem
					navOptions={{
						id: LandingSections.designing.id,
						text: t('nav.designing'),
					}}
					onItemClick={onItemClick}
				/>
			</div>
		</div>
	);
};
