import { useCallback, useState } from 'react';
import { BiSolidHome } from 'react-icons/bi';
import { RiFileList3Line } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { HOME_ROUTES } from '../../constants';
import { useSidebarNavigate } from '../../utils';
import { SidebarItem } from './sidebar-item.component';
import { SidebarListItem } from './sidebar-list-item.component';
import { SidebarList } from './sidebar-list.component';

export const Sidebar = () => {
	const navigate = useNavigate();
	const [currentItemId, setCurrentItemId] = useState<string>(HOME_ROUTES.main.id);
	useSidebarNavigate(currentItemId, navigate);

	const sidebarItemClick = useCallback((id: string) => {
		if (currentItemId !== id) {
			setCurrentItemId(id);
		}
	}, []);

	return (
		<div className="flex h-full w-[247px] flex-col pt-[20px]">
			<SidebarItem
				id={HOME_ROUTES.main.id}
				icon={BiSolidHome}
				isSelected={currentItemId === HOME_ROUTES.main.id}
				label="Главная"
				setId={sidebarItemClick}
			/>
			<SidebarList label="Справочники" icon={RiFileList3Line}>
				<>
					<SidebarListItem
						id={HOME_ROUTES.guidbooks.materials.id}
						label="Материалы"
						isSelected={currentItemId === HOME_ROUTES.guidbooks.materials.id}
						setId={sidebarItemClick}
					/>
					<SidebarListItem
						id={HOME_ROUTES.guidbooks.constructions.id}
						label="Конструкции"
						isSelected={currentItemId === HOME_ROUTES.guidbooks.constructions.id}
						setId={sidebarItemClick}
					/>
					<SidebarListItem
						id={HOME_ROUTES.guidbooks.requirements.id}
						label="Требования"
						isSelected={currentItemId === HOME_ROUTES.guidbooks.requirements.id}
						setId={sidebarItemClick}
					/>
					<SidebarListItem
						id={HOME_ROUTES.guidbooks.issuers.id}
						label="Производители"
						isSelected={currentItemId === HOME_ROUTES.guidbooks.issuers.id}
						setId={sidebarItemClick}
					/>
				</>
			</SidebarList>
		</div>
	);
};
