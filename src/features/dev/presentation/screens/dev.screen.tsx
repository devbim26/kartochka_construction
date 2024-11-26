import { memo } from 'react';

interface DevScreenProps {
	title: string;
}

export const DevScreen = memo(({ title }: DevScreenProps) => {
	return (
		<div className="flex flex-1 items-center justify-center">
			<div className="flex size-[400px] flex-col items-center justify-center gap-[20px] rounded-lg border-0 border-r-8 bg-background-secondary">
				<p className="truncate text-lg font-semibold leading-6 tracking-wide text-[#14181F]">
					{title}
				</p>
				<p className="text-lg font-semibold leading-6 tracking-wide text-[#14181F]">
					В разработке...
				</p>
			</div>
		</div>
	);
});

DevScreen.displayName = 'DevScreen';
