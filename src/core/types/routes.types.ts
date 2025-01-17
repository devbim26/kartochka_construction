export interface RouteItem {
	id: string;
	route: string;
	element: () => React.JSX.Element;
	childrens?: Routes;
}

export type Routes = RouteItem[];
