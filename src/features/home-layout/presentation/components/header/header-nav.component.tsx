import { useEffect, useState } from 'react';
import { HeaderNavItem } from './header-nav-item.component';

export const HeaderNav = () => {
	const [currentSectionId, setCurrentSectionId] = useState<string>('');

	useEffect(() => {
		//scrollto
	}, [currentSectionId]);

	return (
		<div className="flex flex-1 justify-center">
			<div className="flex flex-row items-center gap-[30px]">
				<HeaderNavItem
					clickCallback={setCurrentSectionId}
					text={'О нас'}
					isSelected={currentSectionId === 'some_id'}
					id=""
				/>
				<HeaderNavItem
					clickCallback={setCurrentSectionId}
					text={'Подписка'}
					isSelected={currentSectionId === 'some_id'}
					id=""
				/>
				<HeaderNavItem
					clickCallback={setCurrentSectionId}
					text={'Контакты'}
					isSelected={currentSectionId === 'some_id'}
					id=""
				/>
				<HeaderNavItem
					clickCallback={setCurrentSectionId}
					text={'Проектирование'}
					isSelected={currentSectionId === 'some_id'}
					id=""
				/>
			</div>
		</div>
	);
};
