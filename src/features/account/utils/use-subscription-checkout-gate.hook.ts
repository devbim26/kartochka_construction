import { useAppDispatch, useI18n } from '@core';
import { ensureCompanyRequisitesFilled } from '@features/account/services';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

export const useSubscriptionCheckoutGate = () => {
	const dispatch = useAppDispatch();
	const { t } = useI18n();
	const [isAllowed, setIsAllowed] = useState<boolean | null>(null);

	const resetCheckoutGate = useCallback(() => {
		setIsAllowed(null);
	}, []);

	const checkRequisites = useCallback(async (): Promise<boolean> => {
		const filled = await ensureCompanyRequisitesFilled(dispatch);
		setIsAllowed(filled);
		if (!filled) {
			toast.error(t('subscription.requisitesRequired'));
		}
		return filled;
	}, [dispatch, t]);

	return { isAllowed, checkRequisites, resetCheckoutGate };
};
