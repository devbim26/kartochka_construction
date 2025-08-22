export enum UserRoles {
	Admin = 'Администратор',
	User = 'Пользователь',
	Manager = 'Менеджер',
}

export type UserRole = {
	id: string;
	name: string;
};
