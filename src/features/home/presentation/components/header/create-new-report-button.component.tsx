import { selectIsUserLoggedIn, useAppSelector, useI18n } from '@core';
import { SoundInsulationChoiceModal } from '@features/main';
import { useCallback, useState } from 'react';
import { twMerge } from 'tailwind-merge';

export const CreateNewReportButton = ({ className }: { className?: string }) => {
	const isLoggedIn = useAppSelector(selectIsUserLoggedIn);
	const { t } = useI18n();
	const [isChoiceOpen, setIsChoiceOpen] = useState(false);

	const handleClick = useCallback(() => {
		setIsChoiceOpen(true);
	}, []);

	if (!isLoggedIn) {
		return null;
	}

	return (
		<>
			<button
				type="button"
				onClick={handleClick}
				className={twMerge(
					'flex h-[32px] items-center justify-center whitespace-nowrap rounded-lg border border-solid border-[#EDEFF2] px-3 text-sm font-semibold text-[#14181F] hover:bg-gray-50',
					className,
				)}
			>
				{t('nav.createNewReport')}
			</button>
			<SoundInsulationChoiceModal
				isOpen={isChoiceOpen}
				onClose={() => setIsChoiceOpen(false)}
				mode="create"
			/>
		</>
	);
};
