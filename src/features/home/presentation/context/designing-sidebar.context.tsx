import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
	type ReactNode,
} from 'react';
import { useLocation } from 'react-router-dom';

type DesigningSidebarContextValue = {
	open: boolean;
	toggle: () => void;
	close: () => void;
};

const DesigningSidebarContext = createContext<DesigningSidebarContextValue | null>(null);

export const useDesigningSidebar = () => useContext(DesigningSidebarContext);

export const DesigningSidebarProvider = ({ children }: { children: ReactNode }) => {
	const { pathname } = useLocation();
	const [open, setOpen] = useState(false);
	const close = useCallback(() => setOpen(false), []);
	const toggle = useCallback(() => setOpen((o) => !o), []);

	useEffect(() => {
		close();
	}, [pathname, close]);

	const value = useMemo(
		() => ({
			open,
			toggle,
			close,
		}),
		[open, toggle, close],
	);

	useEffect(() => {
		if (!open) {
			return;
		}
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				close();
			}
		};
		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, [open, close]);

	return (
		<DesigningSidebarContext.Provider value={value}>{children}</DesigningSidebarContext.Provider>
	);
};
