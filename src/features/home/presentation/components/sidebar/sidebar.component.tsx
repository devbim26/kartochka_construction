import { getSidebarItemsConfig } from '@features/home/constants';
import type { SidebarConfigChild } from '@features/home/types';
import { useLocation } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { useDesigningSidebar } from '../../context/designing-sidebar.context';
import { SidebarItem } from './sidebar-item.component';
import { SidebarListItem } from './sidebar-list-item.component';
import { SidebarList } from './sidebar-list.component';

const buildChildPath = (basePath: string, parentPath: string, childPath: string) =>
	`${basePath}/${parentPath}/${childPath}`;

const renderSidebarChildren = ({
	children,
	basePath,
	parentRoute,
	pathname,
	depth,
}: {
	children: SidebarConfigChild[];
	basePath: string;
	parentRoute: string;
	pathname: string;
	depth: number;
}) =>
	children.map((child) => {
		if (child.childrens?.length) {
			return (
				<SidebarList
					{...child}
					key={child.id}
					currentPath={pathname}
					path={`${basePath}/${parentRoute}`}
					permission={child.permission}
					depth={depth}
				>
					<>
						{renderSidebarChildren({
							children: child.childrens,
							basePath,
							parentRoute,
							pathname,
							depth: depth + 1,
						})}
					</>
				</SidebarList>
			);
		}

		return (
			<SidebarListItem
				{...child}
				key={child.id}
				currentPath={pathname}
				path={buildChildPath(basePath, parentRoute, child.path)}
				depth={depth}
			/>
		);
	});

export const Sidebar = () => {
	const { pathname } = useLocation();
	const sidebarItemsConfig = getSidebarItemsConfig();
	const sidebar = useDesigningSidebar();

	if (!sidebar) {
		return null;
	}

	const { open, close } = sidebar;

	return (
		<>
			<button
				type="button"
				tabIndex={open ? 0 : -1}
				aria-hidden={!open}
				aria-label="Закрыть меню навигации"
				className={twMerge(
					'absolute inset-0 z-30 bg-black/40 transition-opacity duration-300',
					open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
				)}
				onClick={close}
			/>
			<aside
				className={twMerge(
					'absolute left-0 top-0 z-40 flex h-full w-[248px] flex-col border-r border-solid border-[#EDEFF2] bg-white transition-transform duration-300 ease-out',
					open
						? 'translate-x-0 shadow-[4px_0_24px_rgba(0,0,0,0.08)]'
						: '-translate-x-full',
				)}
				aria-hidden={!open}
			>
				<div className="flex h-full flex-col overflow-y-auto">
					{sidebarItemsConfig.items.map((item) =>
						item.childrens ? (
							<SidebarList
								{...item.params}
								key={item.params.id}
								currentPath={pathname}
								path={`${sidebarItemsConfig.basePath}/${item.params.path}`}
								permission={item.params.permission}
								depth={0}
							>
								<>
									{renderSidebarChildren({
										children: item.childrens,
										basePath: sidebarItemsConfig.basePath,
										parentRoute: item.params.path,
										pathname,
										depth: 1,
									})}
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
			</aside>
		</>
	);
};
