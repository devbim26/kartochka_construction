import { APP_ROUTES } from '@core';
import { UserRoles } from '@core/types';
import { CONSTRUCTOR_ROUTES } from '@features/constructor';
import { GUIDBOOKS_ROUTES } from '@features/guidbooks/constants';
import { BiNews, BiSolidCalendarEdit, BiSolidHome } from 'react-icons/bi';
import { FaUser } from 'react-icons/fa6';
import { GiCloudRing } from 'react-icons/gi';
import { HiOutlineUsers } from 'react-icons/hi2';
import { RiDraftLine, RiFileList3Line, RiPencilRulerLine, RiWallet3Fill } from 'react-icons/ri';
import { TiDocumentText } from 'react-icons/ti';
import type { SidebarItemsConfig } from '../types';
import { DESIGNING_ROUTES } from './home-routes.constants';

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

/** Читает sessionStorage при каждом вызове — иначе пункты не обновляются до F5. */
function getConstructorSidebarChildren() {
	const projectReportId = sessionStorage.getItem('projectReportId');
	// Миграция со старых ключей
	const legacyId = sessionStorage.getItem('reportId');
	const legacyType = sessionStorage.getItem('reportType');
	const floorId =
		projectReportId ||
		(legacyType === 'Floor' ? legacyId : null);
	const hasFloorSession = !!floorId;

	const projectChildren: Array<{
		id: string;
		path: string;
		labelKey: 'sidebar.aboutBuilding' | 'sidebar.floorPlans';
		permission: UserRoles[];
	}> = [
		{
			id: CONSTRUCTOR_ROUTES.aboutBuilding.id,
			path: hasFloorSession
				? buildPathWithParams(CONSTRUCTOR_ROUTES.aboutBuilding.route, {
						reportId: floorId!,
						reportType: 'Floor',
						edit: true,
					})
				: buildPathWithParams(CONSTRUCTOR_ROUTES.aboutBuilding.route, {
						intent: 'project',
					}),
			labelKey: 'sidebar.aboutBuilding',
			permission: [UserRoles.Admin, UserRoles.User],
		},
	];

	if (hasFloorSession) {
		projectChildren.push({
			id: CONSTRUCTOR_ROUTES.floorPlans.id,
			path: buildPathWithParams(CONSTRUCTOR_ROUTES.floorPlans.route, {
				reportId: floorId!,
				reportType: 'Floor',
			}),
			labelKey: 'sidebar.floorPlans',
			permission: [UserRoles.Admin, UserRoles.User],
		});
	}

	return [
		{
			id: 'constructor-sound-insulation-group-id',
			path: hasFloorSession
				? buildPathWithParams(CONSTRUCTOR_ROUTES.floorPlans.route, {
						reportId: floorId!,
						reportType: 'Floor',
					})
				: buildPathWithParams(CONSTRUCTOR_ROUTES.aboutBuilding.route, {
						intent: 'project',
					}),
			labelKey: 'sidebar.soundInsulation' as const,
			permission: [UserRoles.Admin, UserRoles.User],
			childrens: [
				{
					id: 'constructor-project-group-id',
					path: hasFloorSession
						? buildPathWithParams(CONSTRUCTOR_ROUTES.floorPlans.route, {
								reportId: floorId!,
								reportType: 'Floor',
							})
						: buildPathWithParams(CONSTRUCTOR_ROUTES.aboutBuilding.route, {
								intent: 'project',
							}),
					labelKey: 'sidebar.project' as const,
					permission: [UserRoles.Admin, UserRoles.User],
					childrens: projectChildren,
				},
				{
					id: CONSTRUCTOR_ROUTES.calculation.id,
					path: CONSTRUCTOR_ROUTES.calculation.route,
					labelKey: 'sidebar.calculation' as const,
					permission: [UserRoles.Admin, UserRoles.User],
				},
			],
		},
	];
}

export function getSidebarItemsConfig(): SidebarItemsConfig {
	return {
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
				childrens: getConstructorSidebarChildren(),
			},
			{
				params: {
					id: DESIGNING_ROUTES.activeReports.id,
					path: DESIGNING_ROUTES.activeReports.route,
					icon: RiDraftLine,
					labelKey: 'sidebar.activeReports',
					permission: [UserRoles.Admin, UserRoles.User],
				},
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
					{
						id: GUIDBOOKS_ROUTES.tariffPlans.id,
						path: GUIDBOOKS_ROUTES.tariffPlans.route,
						labelKey: 'sidebar.tariffPlans',
						permission: UserRoles.Admin,
					},
					{
						id: GUIDBOOKS_ROUTES.acousticModels.id,
						path: GUIDBOOKS_ROUTES.acousticModels.route,
						labelKey: 'sidebar.acousticModels',
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
}
