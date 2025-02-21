import { useCallback, useEffect, useState } from 'react';
import { BiNews, BiSolidCalendarEdit, BiSolidHome } from 'react-icons/bi';
import { FaUser } from 'react-icons/fa6';
import { HiOutlineUsers } from 'react-icons/hi2';
import { RiFileList3Line, RiPencilRulerLine, RiWallet3Fill } from 'react-icons/ri';
import { TiDocumentText } from 'react-icons/ti';
import { useNavigate } from 'react-router-dom';
import { GUIDBOOKS_ROUTES } from '../../../../guidbooks';
import { DESIGNING_ROUTES, HomeRoutesMap, USERS_LIST_ROUTES } from '../../../constants';
import { SidebarSessionStorageKeys } from '../../../types';
import { SidebarItem } from './sidebar-item.component';
import { SidebarListItem } from './sidebar-list-item.component';
import { SidebarList } from './sidebar-list.component';

export const Sidebar = () => {
	const navigate = useNavigate();
	const [currentItemId, setCurrentItemId] = useState<string>(
		sessionStorage.getItem(SidebarSessionStorageKeys.HomeRoutesId) || DESIGNING_ROUTES.main.id,
	);

	useEffect(() => {
		navigate(`${HomeRoutesMap.get(currentItemId)}`);
		sessionStorage.setItem(SidebarSessionStorageKeys.HomeRoutesId, currentItemId);
	}, [currentItemId]);

	const sidebarItemClick = useCallback(
		(id: string) => {
			if (currentItemId !== id) {
				setCurrentItemId(id);
			}
		},
		[currentItemId],
	);

	return (
		<div className="flex h-full w-[248px] min-w-[248px] flex-col">
			<SidebarItem
				id={DESIGNING_ROUTES.main.id}
				icon={BiSolidHome}
				isSelected={currentItemId === DESIGNING_ROUTES.main.id}
				label="Главная"
				setId={sidebarItemClick}
			/>
			<SidebarItem
				id={DESIGNING_ROUTES.constructor.id}
				icon={RiPencilRulerLine}
				isSelected={currentItemId === DESIGNING_ROUTES.constructor.id}
				label="Конструктор"
				setId={sidebarItemClick}
			/>
			<SidebarItem
				id={DESIGNING_ROUTES.account.id}
				icon={FaUser}
				isSelected={currentItemId === DESIGNING_ROUTES.account.id}
				label="Личный кабинет"
				setId={sidebarItemClick}
			/>
			<SidebarItem
				id={DESIGNING_ROUTES.subscribes_constructor.id}
				icon={BiSolidCalendarEdit}
				isSelected={currentItemId === DESIGNING_ROUTES.subscribes_constructor.id}
				label="Конструктор подписок"
				setId={sidebarItemClick}
			/>
			<SidebarItem
				id={DESIGNING_ROUTES.accounts.id}
				icon={RiWallet3Fill}
				isSelected={currentItemId === DESIGNING_ROUTES.accounts.id}
				label="Счета"
				setId={sidebarItemClick}
			/>
			<SidebarList
				icon={HiOutlineUsers}
				id={DESIGNING_ROUTES.users_list.id}
				label="Список пользователей"
			>
				<SidebarListItem
					id={USERS_LIST_ROUTES.manager.id}
					label="Менеджер"
					isSelected={currentItemId === USERS_LIST_ROUTES.manager.id}
					setId={sidebarItemClick}
				/>
				<SidebarListItem
					id={USERS_LIST_ROUTES.client.id}
					label="Клиент"
					isSelected={currentItemId === USERS_LIST_ROUTES.client.id}
					setId={sidebarItemClick}
				/>
			</SidebarList>
			<SidebarList
				label="Справочники"
				icon={RiFileList3Line}
				id={DESIGNING_ROUTES.guidbooks.id}
			>
				<SidebarListItem
					id={GUIDBOOKS_ROUTES.materials.id}
					label="Материалы"
					isSelected={currentItemId === GUIDBOOKS_ROUTES.materials.id}
					setId={sidebarItemClick}
				/>
				<SidebarListItem
					id={GUIDBOOKS_ROUTES.constructions.id}
					label="Конструкции"
					isSelected={currentItemId === GUIDBOOKS_ROUTES.constructions.id}
					setId={sidebarItemClick}
				/>
				<SidebarListItem
					id={GUIDBOOKS_ROUTES.requirements.id}
					label="Требования"
					isSelected={currentItemId === GUIDBOOKS_ROUTES.requirements.id}
					setId={sidebarItemClick}
				/>
				<SidebarListItem
					id={GUIDBOOKS_ROUTES.issuers.id}
					label="Производители"
					isSelected={currentItemId === GUIDBOOKS_ROUTES.issuers.id}
					setId={sidebarItemClick}
				/>
			</SidebarList>
			<SidebarItem
				id={DESIGNING_ROUTES.news.id}
				icon={BiNews}
				isSelected={currentItemId === DESIGNING_ROUTES.news.id}
				label="Новости"
				setId={sidebarItemClick}
			/>
			<SidebarItem
				id={DESIGNING_ROUTES.reports.id}
				icon={TiDocumentText}
				isSelected={currentItemId === DESIGNING_ROUTES.reports.id}
				label="Отчеты"
				setId={sidebarItemClick}
			/>
		</div>
	);
};
