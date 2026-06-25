import { Button } from '@core';
import type { OneSideCladdingPosition } from '@features/guidbooks/utils/one-side-cladding-position.utils';

type FacingOneSideMoveCladdingButtonProps = {
	side: OneSideCladdingPosition;
	onMove: () => void;
};

export const FacingOneSideMoveCladdingButton = ({
	side,
	onMove,
}: FacingOneSideMoveCladdingButtonProps) => (
	<div className="flex justify-center py-2">
		<Button type="button" variant="outline" onClick={onMove}>
			{side === 'Left' ? 'Переместить облицовку направо' : 'Переместить облицовку налево'}
		</Button>
	</div>
);
