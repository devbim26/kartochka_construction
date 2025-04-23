import { APP_ROUTES } from '@core';
import { GUIDBOOKS_ROUTES } from '@features/guidbooks/constants';
import { BiNews, BiSolidCalendarEdit, BiSolidHome } from 'react-icons/bi';
import { FaUser } from 'react-icons/fa6';
import { HiOutlineUsers } from 'react-icons/hi2';
import { RiFileList3Line, RiPencilRulerLine, RiWallet3Fill } from 'react-icons/ri';
import { TiDocumentText } from 'react-icons/ti';
import type { SidebarItemsConfig } from '../types';
import { DESIGNING_ROUTES, USERS_LIST_ROUTES } from './home-routes.constants';

export const sidebarItemsConfig: SidebarItemsConfig = {
	basePath: APP_ROUTES.designing.route,
	items: [
		{
			params: {
				id: DESIGNING_ROUTES.main.id,
				label: 'Главная',
				icon: BiSolidHome,
				path: DESIGNING_ROUTES.main.route,
			},
		},
		{
			params: {
				id: DESIGNING_ROUTES.constructor.id,
				label: 'Конструктор',
				icon: RiPencilRulerLine,
				path: DESIGNING_ROUTES.constructor.route,
				isMutltiPathItem: true,
			},
		},
		{
			params: {
				id: DESIGNING_ROUTES.account.id,
				label: 'Личный кабинет',
				icon: FaUser,
				path: DESIGNING_ROUTES.account.route,
			},
		},
		{
			params: {
				id: DESIGNING_ROUTES.subscribes_constructor.id,
				label: 'Конструктор подписок',
				icon: BiSolidCalendarEdit,
				path: DESIGNING_ROUTES.subscribes_constructor.route,
			},
		},
		{
			params: {
				id: DESIGNING_ROUTES.accounts.id,
				label: 'Счета',
				icon: RiWallet3Fill,
				path: DESIGNING_ROUTES.accounts.route,
			},
		},
		{
			params: {
				id: DESIGNING_ROUTES.users_list.id,
				label: 'Список пользователей',
				icon: HiOutlineUsers,
				path: DESIGNING_ROUTES.users_list.route,
			},
			childrens: [
				{
					id: USERS_LIST_ROUTES.manager.id,
					path: USERS_LIST_ROUTES.manager.route,
					label: 'Менеджер',
				},
				{
					id: USERS_LIST_ROUTES.client.id,
					path: USERS_LIST_ROUTES.client.route,
					label: 'Клиент',
				},
			],
		},
		{
			params: {
				id: DESIGNING_ROUTES.guidbooks.id,
				label: 'Справочники',
				icon: RiFileList3Line,
				path: DESIGNING_ROUTES.guidbooks.route,
			},
			childrens: [
				{
					id: GUIDBOOKS_ROUTES.materials.id,
					path: GUIDBOOKS_ROUTES.materials.route,
					label: 'Материалы',
				},
				{
					id: GUIDBOOKS_ROUTES.constructions.id,
					path: GUIDBOOKS_ROUTES.constructions.route,
					label: 'Конструкции',
				},
				{
					id: GUIDBOOKS_ROUTES.requirements.id,
					path: GUIDBOOKS_ROUTES.requirements.route,
					label: 'Требования',
				},
				{
					id: GUIDBOOKS_ROUTES.issuers.id,
					path: GUIDBOOKS_ROUTES.issuers.route,
					label: 'Производители',
				},
			],
		},
		{
			params: {
				id: DESIGNING_ROUTES.news.id,
				path: DESIGNING_ROUTES.news.route,
				icon: BiNews,
				label: 'Новости',
			},
		},
		{
			params: {
				id: DESIGNING_ROUTES.reports.id,
				path: DESIGNING_ROUTES.reports.route,
				icon: TiDocumentText,
				label: 'Отчеты',
			},
		},
	],
};
