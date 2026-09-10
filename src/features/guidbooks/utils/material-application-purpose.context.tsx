import { MaterialPurpose } from '@api-gen';
import { ConstructionClass } from '@features/guidbooks/types';
import { createContext, useMemo, type ReactNode } from 'react';

export const MaterialApplicationPurposeContext = createContext<MaterialPurpose | undefined>(
	undefined,
);

/** На расчёте / проектировании в селектах только материалы производителя «Общий». */
export const MaterialCatalogOnlyGeneralIssuerContext = createContext(false);

type MaterialApplicationPurposeProviderProps = {
	layoutClass?: string | null;
	/** Фильтровать только производителя «Общий» (`isCommonMaterials: true`). */
	onlyGeneralIssuer?: boolean;
	children: ReactNode;
};

/** Класс конструкции (Wall/Floor) из отчёта/вкладки — запасной источник для фильтра материалов. */
export const MaterialApplicationPurposeProvider = ({
	layoutClass,
	onlyGeneralIssuer = false,
	children,
}: MaterialApplicationPurposeProviderProps) => {
	const purpose = useMemo(() => {
		if (layoutClass === ConstructionClass.Floor) return MaterialPurpose.ForFloor;
		if (layoutClass === ConstructionClass.Wall) return MaterialPurpose.ForWall;
		return undefined;
	}, [layoutClass]);

	return (
		<MaterialCatalogOnlyGeneralIssuerContext.Provider value={onlyGeneralIssuer}>
			<MaterialApplicationPurposeContext.Provider value={purpose}>
				{children}
			</MaterialApplicationPurposeContext.Provider>
		</MaterialCatalogOnlyGeneralIssuerContext.Provider>
	);
};
