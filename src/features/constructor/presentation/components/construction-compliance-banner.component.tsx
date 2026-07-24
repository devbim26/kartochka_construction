import { useI18n } from '@core';
import { MdCheckCircle, MdWarning } from 'react-icons/md';

export type ConstructionComplianceStatus = 'match' | 'mismatch' | null;

type Props = {
	status: ConstructionComplianceStatus;
	className?: string;
};

export const ConstructionComplianceBanner = ({ status, className }: Props) => {
	const { t } = useI18n();

	if (!status) return null;

	const isMatch = status === 'match';

	return (
		<div
			className={`flex max-w-[360px] items-center gap-2 ${className ?? ''}`}
			role="status"
		>
			{isMatch ? (
				<MdCheckCircle className="size-7 shrink-0 text-green-600" aria-hidden />
			) : (
				<MdWarning className="size-7 shrink-0 text-orange-500" aria-hidden />
			)}
			<p
				className={`font-sans text-sm font-semibold leading-snug ${
					isMatch ? 'text-green-600' : 'text-orange-500'
				}`}
			>
				{isMatch
					? t('constructor.relevant.matchSuccess')
					: t('constructor.relevant.mismatchWarning')}
			</p>
		</div>
	);
};

export const getAirborneComplianceStatus = (
	value: number | string | null | undefined,
	requirement: number | string | null | undefined,
): ConstructionComplianceStatus => {
	if (value == null || value === '' || requirement == null || requirement === '') {
		return null;
	}
	const valueNum = Number(String(value).replace(',', '.'));
	const requirementNum = Number(String(requirement).replace(',', '.'));
	if (!Number.isFinite(valueNum) || !Number.isFinite(requirementNum)) {
		return null;
	}
	return valueNum >= requirementNum ? 'match' : 'mismatch';
};
