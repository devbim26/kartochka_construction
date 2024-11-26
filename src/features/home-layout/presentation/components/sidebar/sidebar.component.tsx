import { SessionStorageKeys } from '@core';
import { useCallback, useState } from 'react';
import { BiNews, BiSolidCalendarEdit, BiSolidHome } from 'react-icons/bi';
import { FaUser } from 'react-icons/fa6';
import { HiOutlineUsers } from 'react-icons/hi2';
import { RiFileList3Line, RiPencilRulerLine, RiWallet3Fill } from 'react-icons/ri';
import { TiDocumentText } from 'react-icons/ti';
import { useNavigate } from 'react-router-dom';
import { HOME_ROUTES } from '../../../constants';
import { useSidebarNavigate } from '../../../utils';
import { SidebarItem } from './sidebar-item.component';
import { SidebarListItem } from './sidebar-list-item.component';
import { SidebarList } from './sidebar-list.component';

export const Sidebar = () => {
	const navigate = useNavigate();
	const [currentItemId, setCurrentItemId] = useState<string>(
		sessionStorage.getItem(SessionStorageKeys.HomeRoutesId) || HOME_ROUTES.main.id,
	);
	useSidebarNavigate(currentItemId, navigate);

	const sidebarItemClick = useCallback(
		(id: string) => {
			if (currentItemId !== id) {
				setCurrentItemId(id);
			}
		},
		[currentItemId],
	);

	return (
		<div className="flex h-full w-[248px] flex-col">
			<SidebarItem
				id={HOME_ROUTES.main.id}
				icon={BiSolidHome}
				isSelected={currentItemId === HOME_ROUTES.main.id}
				label="Главная"
				setId={sidebarItemClick}
			/>
			<SidebarItem
				id={HOME_ROUTES.constructor.id}
				icon={RiPencilRulerLine}
				isSelected={currentItemId === HOME_ROUTES.constructor.id}
				label="Конструктор"
				setId={sidebarItemClick}
			/>
			<SidebarItem
				id={HOME_ROUTES.account.id}
				icon={FaUser}
				isSelected={currentItemId === HOME_ROUTES.account.id}
				label="Личный кабинет"
				setId={sidebarItemClick}
			/>
			<SidebarItem
				id={HOME_ROUTES.subscribes_constructor.id}
				icon={BiSolidCalendarEdit}
				isSelected={currentItemId === HOME_ROUTES.subscribes_constructor.id}
				label="Конструктор подписок"
				setId={sidebarItemClick}
			/>
			<SidebarItem
				id={HOME_ROUTES.accounts.id}
				icon={RiWallet3Fill}
				isSelected={currentItemId === HOME_ROUTES.accounts.id}
				label="Счета"
				setId={sidebarItemClick}
			/>
			<SidebarList
				icon={HiOutlineUsers}
				id={HOME_ROUTES.users_list.layout.id}
				label="Список пользователей"
			>
				<>
					<SidebarListItem
						id={HOME_ROUTES.users_list.childrens.manager.id}
						label="Менеджер"
						isSelected={currentItemId === HOME_ROUTES.users_list.childrens.manager.id}
						setId={sidebarItemClick}
					/>
					<SidebarListItem
						id={HOME_ROUTES.users_list.childrens.client.id}
						label="Клиент"
						isSelected={currentItemId === HOME_ROUTES.users_list.childrens.client.id}
						setId={sidebarItemClick}
					/>
				</>
			</SidebarList>
			<SidebarList
				label="Справочники"
				icon={RiFileList3Line}
				id={HOME_ROUTES.guidbooks.layout.id}
			>
				<>
					<SidebarListItem
						id={HOME_ROUTES.guidbooks.childrens.materials.id}
						label="Материалы"
						isSelected={currentItemId === HOME_ROUTES.guidbooks.childrens.materials.id}
						setId={sidebarItemClick}
					/>
					<SidebarListItem
						id={HOME_ROUTES.guidbooks.childrens.constructions.id}
						label="Конструкции"
						isSelected={
							currentItemId === HOME_ROUTES.guidbooks.childrens.constructions.id
						}
						setId={sidebarItemClick}
					/>
					<SidebarListItem
						id={HOME_ROUTES.guidbooks.childrens.requirements.id}
						label="Требования"
						isSelected={
							currentItemId === HOME_ROUTES.guidbooks.childrens.requirements.id
						}
						setId={sidebarItemClick}
					/>
					<SidebarListItem
						id={HOME_ROUTES.guidbooks.childrens.issuers.id}
						label="Производители"
						isSelected={currentItemId === HOME_ROUTES.guidbooks.childrens.issuers.id}
						setId={sidebarItemClick}
					/>
				</>
			</SidebarList>
			<SidebarItem
				id={HOME_ROUTES.news.id}
				icon={BiNews}
				isSelected={currentItemId === HOME_ROUTES.news.id}
				label="Новости"
				setId={sidebarItemClick}
			/>
			<SidebarItem
				id={HOME_ROUTES.reports.id}
				icon={TiDocumentText}
				isSelected={currentItemId === HOME_ROUTES.reports.id}
				label="Отчеты"
				setId={sidebarItemClick}
			/>
		</div>
	);
};
