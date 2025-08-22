import { sidebarItemsConfig } from '@features/home/constants';
import { useLocation } from 'react-router-dom';
import { SidebarItem } from './sidebar-item.component';
import { SidebarListItem } from './sidebar-list-item.component';
import { SidebarList } from './sidebar-list.component';

export const Sidebar = () => {
	const { pathname } = useLocation();
	return (
		<div className="flex h-full w-[248px] min-w-[248px] flex-col">
			{sidebarItemsConfig.items.map((item) =>
				item.childrens ? (
					<SidebarList
						{...item.params}
						key={item.params.id}
						currentPath={pathname}
						path={`${sidebarItemsConfig.basePath}/${item.params.path}`}
						permission={item.params.permission}
					>
						<>
							{item.childrens.map((children) => (
								<SidebarListItem
									{...children}
									key={children.id}
									currentPath={pathname}
									path={`${sidebarItemsConfig.basePath}/${item.params.path}/${children.path}`}
								/>
							))}
						</>
					</SidebarList>
				) : (
					<SidebarItem
						{...item.params}
						key={item.params.id}
						currentPath={pathname}
						path={`${sidebarItemsConfig.basePath}/${item.params.path}`}
						permission={item.params.permission}
					/>
				),
			)}
		</div>
	);
};
