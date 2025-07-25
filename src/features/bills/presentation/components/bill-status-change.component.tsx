import { Checkbox, useAppNavigate } from '@core';
import { updateBill } from '@features/bills/services';
import { billType2title, BillTypeEnum } from '@features/bills/types';
import { AxiosError } from 'axios';
import { useSearchParams } from 'react-router-dom';
import { catchError, from } from 'rxjs';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

export const BillStatusChange = () => {
	const [search] = useSearchParams();
	const navigate = useAppNavigate();

	const handleChangeStatus = (billType: BillTypeEnum) => {
		from(
			updateBill({
				id: search.get('id')!,
				billType: billType,
				userId: search.get('userId')!,
			}),
		)
			.pipe(
				catchError((error) => {
					if (error instanceof AxiosError) {
						toast.error(error.response?.data);
					}
					return from([null]);
				}),
			)
			.subscribe((response) => {
				if (response?.status === 200) {
					toast.success('Счет успешно обновлен');
					navigate('');
				}
			});
	};

	return (
		<div className="flex w-fit flex-col gap-3">
			<Checkbox
				label={billType2title[BillTypeEnum.Paid]}
				direction="row"
				checked={search.get('status') == BillTypeEnum.Paid}
				onChange={() =>
					search.get('status') != BillTypeEnum.Paid &&
					handleChangeStatus(BillTypeEnum.Paid)
				}
				labelClassName={twMerge('text-input-value-black')}
			/>
			<Checkbox
				label={billType2title[BillTypeEnum.UnPaid]}
				direction="row"
				checked={search.get('status') == BillTypeEnum.UnPaid}
				onChange={() =>
					search.get('status') != BillTypeEnum.UnPaid &&
					handleChangeStatus(BillTypeEnum.UnPaid)
				}
				labelClassName={twMerge('text-input-value-black')}
			/>
		</div>
	);
};
