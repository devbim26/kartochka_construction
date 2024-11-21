import { useEffect } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { HomeRoutesMap } from '../../constants';

export const useSidebarNavigate = (selectedItemId: string, navigate: NavigateFunction) => {
	useEffect(() => {
		navigate(`${HomeRoutesMap.get(selectedItemId)}`);
	}, [selectedItemId]);
};
