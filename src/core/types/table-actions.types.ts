export enum TableActionType {
	EDIT = 'edit',
	DELETE = 'delete',
	PROFILE = 'profile',
	CUSTOM = 'custom',
	VIEW = 'view',
	APPROVE = 'approve',
}

interface TableAction {
	type: TableActionType;
	content?: string | React.ReactElement;
	onAction: () => void;
	permission?: string;
	isDisabled?: boolean;
}

export { type TableAction };
