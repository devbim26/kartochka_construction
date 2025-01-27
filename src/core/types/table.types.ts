import { ColumnProps } from 'react-virtualized';

export interface TableColumn<T extends object> extends ColumnProps {
	dataKey: keyof T;
}
