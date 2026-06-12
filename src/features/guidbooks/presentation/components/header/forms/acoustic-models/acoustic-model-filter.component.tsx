import { Input, useI18n } from '@core';
import type { AcousticModelFilters } from '@features/guidbooks/types/acoustic-models';
import { useFormContext } from 'react-hook-form';

export const AcousticModelFilter = () => {
	const form = useFormContext<AcousticModelFilters>();
	const { register } = form;
	const { t } = useI18n();

	return (
		<Input
			{...register('name')}
			labelClassName="font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary"
			inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
			containerClassName="w-[226px]"
			label={t('guides.acousticModels.fields.name')}
			placeholder={t('guides.acousticModels.placeholders.nameFilter')}
			maxLength={200}
		/>
	);
};
