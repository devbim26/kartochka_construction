import type { UserRoles } from '@core';
import type { TranslationKey } from '@core';
import type { IconType } from 'react-icons';

export interface SidebarItemProps {
	id: string;
	icon?: IconType;
	currentPath?: string;
	labelKey: TranslationKey;
	path: string;
	isMutltiPathItem?: boolean;
	permission: UserRoles | UserRoles[];
}

export interface SidebarListProps extends SidebarItemProps {
	children: React.ReactNode;
}

export interface SidebarItemsConfig {
	items: {
		params: SidebarItemProps;
		childrens?: Array<SidebarItemProps>;
	}[];
	basePath: string;
}
