import type { DefaultValues, FieldValues, Resolver, UseFormReturn } from 'react-hook-form';
import { useForm } from 'react-hook-form';

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
): { editForm: UseFormReturn<T>; addForm: UseFormReturn<T>; filterForm: UseFormReturn<T> } => {
	return {
		editForm: useForm<T>({
			resolver: resolvers.edit,
			defaultValues: defObjects.edit,
		}),
		addForm: useForm<T>({
			resolver: resolvers.add,
			defaultValues: defObjects.add,
		}),
		filterForm: useForm<T>({
			resolver: resolvers.filter,
			defaultValues: defObjects.filter,
		}),
	};
};
