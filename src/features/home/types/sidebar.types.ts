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
	/** 0 = корень, 1 = ребёнок Конструктора (Звукоизоляция), 2 = Проект/Расчет, 3 = пункты Проекта. */
	depth?: number;
}

export interface SidebarListProps extends SidebarItemProps {
	children: React.ReactNode;
}

export type SidebarConfigChild = SidebarItemProps & {
	/** Вложенная группа (Звукоизоляция → Проект/Расчет → О здании / …). */
	childrens?: SidebarConfigChild[];
};

export interface SidebarItemsConfig {
	items: {
		params: SidebarItemProps;
		childrens?: Array<SidebarConfigChild>;
	}[];
	basePath: string;
}
