import { APP_ROUTES } from '@core';
import { UserRoles } from '@core/types';
import { CONSTRUCTOR_ROUTES } from '@features/constructor';
import { GUIDBOOKS_ROUTES } from '@features/guidbooks/constants';
import { BiNews, BiSolidCalendarEdit, BiSolidHome } from 'react-icons/bi';
import { FaUser } from 'react-icons/fa6';
import { GiCloudRing } from 'react-icons/gi';
import { HiOutlineUsers } from 'react-icons/hi2';
import { RiFileList3Line, RiPencilRulerLine, RiWallet3Fill } from 'react-icons/ri';
import { TiDocumentText } from 'react-icons/ti';
import type { SidebarItemsConfig } from '../types';
import { DESIGNING_ROUTES, USERS_LIST_ROUTES } from './home-routes.constants';

const reportId = sessionStorage.getItem('reportId');
const reportType = sessionStorage.getItem('reportType');

function buildPathWithParams(
	basePath: string,
	params: Record<string, string | number | boolean>,
): string {
	const stringParams: Record<string, string> = Object.fromEntries(
		Object.entries(params).map(([key, value]) => [key, String(value)]),
	);

	const query = new URLSearchParams(stringParams).toString();
	return `${basePath}?${query}`;
}

export const sidebarItemsConfig: SidebarItemsConfig = {
	basePath: APP_ROUTES.designing.route,
	items: [
		{
			params: {
				id: DESIGNING_ROUTES.main.id,
				labelKey: 'sidebar.home',
				icon: BiSolidHome,
				path: DESIGNING_ROUTES.main.route,
				permission: [UserRoles.Admin, UserRoles.User],
			},
		},

		{
			params: {
				id: DESIGNING_ROUTES.constructor.id,
				labelKey: 'sidebar.constructor',
				icon: RiPencilRulerLine,
				path: DESIGNING_ROUTES.constructor.route,
				isMutltiPathItem: true,
				permission: [UserRoles.Admin, UserRoles.User],
			},
			childrens:
				reportId && reportType
					? [
							{
								id: CONSTRUCTOR_ROUTES.aboutBuilding.id,
								path: buildPathWithParams(CONSTRUCTOR_ROUTES.aboutBuilding.route, {
									reportId,
									reportType,
									edit: true,
								}),
								labelKey: 'sidebar.aboutBuilding',
								permission: [UserRoles.Admin, UserRoles.User],
							},
							{
								id: CONSTRUCTOR_ROUTES.floorPlans.id,
								path: buildPathWithParams(CONSTRUCTOR_ROUTES.floorPlans.route, {
									reportId,
									reportType,
								}),
								labelKey: 'sidebar.floorPlans',
								permission: [UserRoles.Admin, UserRoles.User],
							},
						]
					: [
							{
								id: CONSTRUCTOR_ROUTES.aboutBuilding.id,
								path: CONSTRUCTOR_ROUTES.aboutBuilding.route,
								labelKey: 'sidebar.aboutBuilding',
								permission: [UserRoles.Admin, UserRoles.User],
							},
						],
		},
		{
			params: {
				id: DESIGNING_ROUTES.visualization.id,
				labelKey: 'sidebar.aiAssistant',
				icon: GiCloudRing,
				path: DESIGNING_ROUTES.visualization.route,
				permission: [UserRoles.Admin, UserRoles.User],
			},
		},
		{
			params: {
				id: DESIGNING_ROUTES.account.id,
				labelKey: 'sidebar.account',
				icon: FaUser,
				path: DESIGNING_ROUTES.account.route,
				permission: [UserRoles.Admin, UserRoles.User],
			},
		},
		{
			params: {
				id: DESIGNING_ROUTES.subscribes_constructor.id,
				labelKey: 'sidebar.subscriptionsConstructor',
				icon: BiSolidCalendarEdit,
				path: DESIGNING_ROUTES.subscribes_constructor.route,
				permission: UserRoles.Admin,
			},
		},
		{
			params: {
				id: DESIGNING_ROUTES.accounts.id,
				labelKey: 'sidebar.bills',
				icon: RiWallet3Fill,
				path: DESIGNING_ROUTES.accounts.route,
				permission: UserRoles.Admin,
			},
		},

		{
			params: {
				id: DESIGNING_ROUTES.users_list.id,
				labelKey: 'sidebar.usersList',
				icon: HiOutlineUsers,
				path: DESIGNING_ROUTES.users_list.route,
				permission: UserRoles.Admin,
			},
			childrens: [
				{
					id: USERS_LIST_ROUTES.manager.id,
					path: USERS_LIST_ROUTES.manager.route,
					labelKey: 'sidebar.manager',
					permission: UserRoles.Admin,
				},
				{
					id: USERS_LIST_ROUTES.client.id,
					path: USERS_LIST_ROUTES.client.route,
					labelKey: 'sidebar.client',
					permission: UserRoles.Admin,
				},
			],
		},
		{
			params: {
				id: DESIGNING_ROUTES.guidbooks.id,
				labelKey: 'sidebar.guides',
				icon: RiFileList3Line,
				path: DESIGNING_ROUTES.guidbooks.route,
				permission: UserRoles.Admin,
			},
			childrens: [
				{
					id: GUIDBOOKS_ROUTES.materials.id,
					path: GUIDBOOKS_ROUTES.materials.route,
					labelKey: 'sidebar.materials',
					permission: UserRoles.Admin,
				},
				{
					id: GUIDBOOKS_ROUTES.constructions.id,
					path: GUIDBOOKS_ROUTES.constructions.route,
					labelKey: 'sidebar.constructions',
					permission: UserRoles.Admin,
				},
				{
					id: GUIDBOOKS_ROUTES.requirements.id,
					path: GUIDBOOKS_ROUTES.requirements.route,
					labelKey: 'sidebar.requirements',
					permission: UserRoles.Admin,
				},
				{
					id: GUIDBOOKS_ROUTES.issuers.id,
					path: GUIDBOOKS_ROUTES.issuers.route,
					labelKey: 'sidebar.manufacturers',
					permission: UserRoles.Admin,
				},
			],
		},
		{
			params: {
				id: DESIGNING_ROUTES.news.id,
				path: DESIGNING_ROUTES.news.route,
				icon: BiNews,
				labelKey: 'sidebar.news',
				permission: UserRoles.Admin,
			},
		},
		{
			params: {
				id: DESIGNING_ROUTES.reports.id,
				path: DESIGNING_ROUTES.reports.route,
				icon: TiDocumentText,
				labelKey: 'sidebar.reports',
				permission: UserRoles.Admin,
			},
		},
	],
};
