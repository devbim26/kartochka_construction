import { IconType } from 'react-icons';

export interface SidebarItemCommonProps {
	icon?: IconType;
	label: string;
}

export interface SidebarItemProps extends SidebarItemCommonProps {
	isSelected: boolean;
	id: string;
	setId: (id: string) => void;
}
