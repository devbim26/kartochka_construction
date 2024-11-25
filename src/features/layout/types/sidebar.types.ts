import { IconType } from 'react-icons';

export interface SidebarItemCommonProps {
	icon?: IconType;
	label: string;
	id: string;
}

export interface SidebarItemProps extends SidebarItemCommonProps {
	isSelected: boolean;
	setId: (id: string) => void;
}
