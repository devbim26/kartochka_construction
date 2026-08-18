import type { UserRoles } from '@core';
import { getSidebarItemsConfig } from '../constants';
import type { SidebarConfigChild } from '../types';

const stripQuery = (path: string) => path.split('?')[0];

const hasMatchingDescendant = (nodes: SidebarConfigChild[] | undefined, segment: string): boolean => {
	if (!nodes?.length) return false;
	return nodes.some(
		(node) =>
			stripQuery(node.path) === segment || hasMatchingDescendant(node.childrens, segment),
	);
};

const walkPermission = (
	nodes: SidebarConfigChild[] | undefined,
	segments: string[],
	inherited: UserRoles | UserRoles[],
): UserRoles | UserRoles[] => {
	if (!nodes?.length || !segments.length) {
		return inherited;
	}

	const [current, ...rest] = segments;
	const direct = nodes.find((node) => stripQuery(node.path) === current);
	if (direct) {
		return walkPermission(direct.childrens, rest, direct.permission);
	}

	const group = nodes.find((node) => hasMatchingDescendant(node.childrens, current));
	if (group) {
		return walkPermission(group.childrens, segments, group.permission);
	}

	return inherited;
};

/** Роли для текущего URL — те же, что скрывают пункт в сайдбаре. */
export const getRequiredPermissionForPath = (
	pathname: string,
): UserRoles | UserRoles[] | undefined => {
	const { basePath, items } = getSidebarItemsConfig();
	const normalizedBase = basePath.replace(/\/$/, '');
	if (pathname !== normalizedBase && !pathname.startsWith(`${normalizedBase}/`)) {
		return undefined;
	}

	const relative = pathname.slice(normalizedBase.length).replace(/^\//, '');
	const segments = relative.split('/').filter(Boolean);
	if (!segments.length) {
		return undefined;
	}

	const top = items.find((item) => stripQuery(item.params.path) === segments[0]);
	if (!top) {
		return undefined;
	}

	return walkPermission(top.childrens, segments.slice(1), top.params.permission);
};
