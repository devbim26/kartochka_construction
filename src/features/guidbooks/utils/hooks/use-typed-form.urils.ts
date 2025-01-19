import {
	useForm,
	type DefaultValues,
	type FieldValues,
	type UseFormProps,
	type UseFormReturn,
} from 'react-hook-form';
import { HeaderFormTypes } from '../../types';

export const useHeaderForm = <T extends FieldValues>(
	defObjects: {
		filter: DefaultValues<T>;
		add: DefaultValues<T>;
		edit: DefaultValues<T>;
	},
	currentHeaderFormType: HeaderFormTypes,
	props?: UseFormProps<T>,
): UseFormReturn<T> => {
	return useForm<T>({
		...props,
		defaultValues:
			currentHeaderFormType === HeaderFormTypes.filter
				? defObjects.filter
				: currentHeaderFormType === HeaderFormTypes.edit
					? defObjects.edit
					: defObjects.add,
	});
};
