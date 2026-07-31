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
	/** 1 = ребёнок Конструктора (Проект/Расчет), 2 = вложенные пункты Проекта. */
	depth?: number;
}

export interface SidebarListProps extends SidebarItemProps {
	children: React.ReactNode;
}

export type SidebarConfigChild = SidebarItemProps & {
	/** Вложенная группа (например Проект → О здании / Поэтажные планы). */
	childrens?: SidebarItemProps[];
};

export interface SidebarItemsConfig {
	items: {
		params: SidebarItemProps;
		childrens?: Array<SidebarConfigChild>;
	}[];
	basePath: string;
}
