import { memoize } from 'core/utils/hoc/memo.utils';
import { twMerge } from 'tailwind-merge';

interface HeaderNavItemProps {
	clickCallback: (id: string) => void;
	isSelected: boolean;
	text: string;
	id: string;
}

export const HeaderNavItem = memoize(
	({ clickCallback, isSelected, text, id }: HeaderNavItemProps) => {
		return (
			<p
				className={twMerge(
					'cursor-pointer text-xl font-medium',
					isSelected ? 'text-primary' : 'text-input-value-black',
				)}
				onClick={() => clickCallback(id)}
			>
				{text}
			</p>
		);
	},
	'memoize',
);
