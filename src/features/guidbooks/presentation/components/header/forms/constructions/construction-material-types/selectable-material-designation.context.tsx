import { createContext, useContext, type ReactNode } from 'react';

export type SelectableMaterialDesignationContextValue = {
	/** Доп. поле «обозначение» справа от выбора материала — только на экране проектирования. */
	showMaterialDesignationInput: boolean;
};

const defaultValue: SelectableMaterialDesignationContextValue = {
	showMaterialDesignationInput: false,
};

const SelectableMaterialDesignationContext = createContext(defaultValue);

export const SelectableMaterialDesignationProvider = ({
	children,
	value,
}: {
	children: ReactNode;
	value: SelectableMaterialDesignationContextValue;
}) => (
	<SelectableMaterialDesignationContext.Provider value={value}>
		{children}
	</SelectableMaterialDesignationContext.Provider>
);

export const useSelectableMaterialDesignation = () =>
	useContext(SelectableMaterialDesignationContext);
