import { MaterialPurpose } from '@api-gen';
import { ConstructionClass } from '@features/guidbooks/types';
import { createContext, useMemo, type ReactNode } from 'react';

export const MaterialApplicationPurposeContext = createContext<MaterialPurpose | undefined>(
	undefined,
);

type MaterialApplicationPurposeProviderProps = {
	layoutClass?: string | null;
	children: ReactNode;
};

/** Класс конструкции (Wall/Floor) из отчёта/вкладки — запасной источник для фильтра материалов. */
export const MaterialApplicationPurposeProvider = ({
	layoutClass,
	children,
}: MaterialApplicationPurposeProviderProps) => {
	const purpose = useMemo(() => {
		if (layoutClass === ConstructionClass.Floor) return MaterialPurpose.ForFloor;
		if (layoutClass === ConstructionClass.Wall) return MaterialPurpose.ForWall;
		return undefined;
	}, [layoutClass]);

	return (
		<MaterialApplicationPurposeContext.Provider value={purpose}>
			{children}
		</MaterialApplicationPurposeContext.Provider>
	);
};
