import { Cladding, HeavySingleWall } from '@features/guidbooks/presentation';

export const ConstructionComponentsMap: Record<string, React.ReactNode> = {
	heavySingleWall: <HeavySingleWall />,
	heavySingleWallAndCladding: (
		<>
			<HeavySingleWall />
			<Cladding />
		</>
	),
};
