import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
	type ReactNode,
} from 'react';
import type { ConstructionComplianceStatus } from './construction-compliance-banner.component';

type ConstructionComplianceContextValue = {
	status: ConstructionComplianceStatus;
	setStatus: (status: ConstructionComplianceStatus) => void;
};

const ConstructionComplianceContext = createContext<ConstructionComplianceContextValue | null>(
	null,
);

export const ConstructionComplianceProvider = ({ children }: { children: ReactNode }) => {
	const [status, setStatusState] = useState<ConstructionComplianceStatus>(null);
	const setStatus = useCallback((next: ConstructionComplianceStatus) => {
		setStatusState(next);
	}, []);

	const value = useMemo(
		() => ({
			status,
			setStatus,
		}),
		[status, setStatus],
	);

	return (
		<ConstructionComplianceContext.Provider value={value}>
			{children}
		</ConstructionComplianceContext.Provider>
	);
};

export const useConstructionCompliance = () => {
	const ctx = useContext(ConstructionComplianceContext);
	if (!ctx) {
		return {
			status: null as ConstructionComplianceStatus,
			setStatus: (_status: ConstructionComplianceStatus) => undefined,
		};
	}
	return ctx;
};
