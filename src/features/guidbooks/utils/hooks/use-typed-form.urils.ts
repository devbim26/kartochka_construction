import { useMemo } from 'react';
import type { DefaultValues, FieldValues, Resolver, UseFormReturn } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import { HeaderFormTypes } from '../../types';

export const useHeaderForm = <T extends FieldValues>(
	defObjects: {
		filter: DefaultValues<T>;
		add: DefaultValues<T>;
		edit: DefaultValues<T>;
	},
	resolvers: {
		filter: Resolver<T>;
		add: Resolver<T>;
		edit: Resolver<T>;
	},
	currentHeaderFormType: HeaderFormTypes,
): UseFormReturn<T> => {
	const form = useMemo(
		() =>
			useForm<T>({
				resolver:
					currentHeaderFormType === HeaderFormTypes.filter
						? resolvers.filter
						: currentHeaderFormType === HeaderFormTypes.edit
							? resolvers.add
							: resolvers.edit,
				defaultValues:
					currentHeaderFormType === HeaderFormTypes.filter
						? defObjects.filter
						: currentHeaderFormType === HeaderFormTypes.edit
							? defObjects.edit
							: defObjects.add,
			}),
		[currentHeaderFormType],
	);

	return form;
};
