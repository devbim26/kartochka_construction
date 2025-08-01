import { useAppNavigate } from '@core';
import { SubSelect } from '@features/landing';
import { ReportScreen } from '@features/reports';
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CurrentSub, MainHeader, News } from '../components';
import { FormSubModal } from '../components/modals';

const MainScreen = () => {
	const [search] = useSearchParams();
	const navigate = useAppNavigate();

	const sectionId = search.get('sectionId');
	const pageContentWrapperRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		pageContentWrapperRef.current
			?.querySelector(`#${sectionId}`)
			?.scrollIntoView({ behavior: 'smooth' });
	}, [sectionId]);

	return (
		<div className="flex w-full flex-col gap-[30px] pb-[29px]">
			<MainHeader />
			<div className="flex w-full flex-row gap-[20px]">
				<News />
				<CurrentSub />
			</div>
			<ReportScreen />
			<SubSelect wrapperClassName="w-full p-0" subContainerClassName="bg-white" />
			<FormSubModal
				isOpen={!!search.get('subId') && !!search.get('subModal')}
				onConfirm={() => navigate('')}
				onClose={() => navigate('')}
				confirmTitle="Оплачено по счетам"
				headerTitle="Оформление пакета"
				contentClassName="visible"
				hasUndoButton={false}
			/>
		</div>
	);
};

export default MainScreen;
