import type { IconType } from 'react-icons';

export interface SidebarItemProps {
	id: string;
	icon?: IconType;
	currentPath?: string;
	label: string;
	path: string;
	isMutltiPathItem?: boolean;
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
