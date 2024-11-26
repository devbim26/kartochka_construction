export type SessionStorage = {
	[key in SessionStorageKeys]: string;
};

export const enum SessionStorageKeys {
	HomeRoutesId = 'home_route_id',
	NavbarSelectId = 'navbar_select_id',
}
