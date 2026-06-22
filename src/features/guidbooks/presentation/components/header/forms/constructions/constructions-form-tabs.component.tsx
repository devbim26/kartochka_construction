import { IoMdWarning } from 'react-icons/io';
import { twMerge } from 'tailwind-merge';

export type ConstructionFormTab = 'description' | 'characteristics' | 'info';

type TabConfig = {
	id: ConstructionFormTab;
	label: string;
	hasError?: boolean;
};

type Props = {
	activeTab: ConstructionFormTab;
	onChange: (tab: ConstructionFormTab) => void;
	tabs: TabConfig[];
};

export const ConstructionsFormTabs = ({ activeTab, onChange, tabs }: Props) => (
	<div className="flex w-fit self-center rounded-[10px] bg-primary p-[3px]">
		{tabs.map((tab) => (
			<button
				key={tab.id}
				type="button"
				onClick={() => onChange(tab.id)}
				className={twMerge(
					'flex h-[26px] min-w-[145px] items-center justify-center gap-1 rounded-[8px] px-3 font-sans text-[17px] font-normal leading-5 tracking-[0.1px] text-white transition-colors',
					activeTab === tab.id && 'bg-white text-primary',
				)}
			>
				{tab.label}
				{tab.hasError && <IoMdWarning />}
			</button>
		))}
	</div>
);
