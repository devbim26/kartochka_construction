import type { IconType } from 'react-icons';

export interface SidebarItemCommonProps {
	id: string;
	icon?: IconType;
	currentPath?: string;
	label: string;
	path: string;
}

export interface SidebarListProps extends SidebarItemCommonProps {
	children: React.ReactNode;
}

export interface SidebarItemsConfig {
	items: {
		params: SidebarItemCommonProps | SidebarListProps;
		childrens?: Array<SidebarItemCommonProps>;
	}[];
	basePath: string;
}
