import { zodResolver } from '@hookform/resolvers/zod';
import type { DefaultValues, FieldValues, UseFormProps, UseFormReturn } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { ZodType } from 'zod';

export const useHeaderForm = <T extends FieldValues>(
	defObjects: {
		filter: DefaultValues<T>;
		add: DefaultValues<T>;
		edit: DefaultValues<T>;
	},
	resolvers: {
		filter: ZodType<any>;
		add: ZodType<any>;
		edit: ZodType<any>;
	},
	props?: UseFormProps<T>,
): { editForm: UseFormReturn<T>; addForm: UseFormReturn<T>; filterForm: UseFormReturn<T> } => {
	return {
		editForm: useForm<T>({
			...props,
			resolver: zodResolver(resolvers.edit),
			defaultValues: defObjects.edit,
		}),
		addForm: useForm<T>({
			...props,
			resolver: zodResolver(resolvers.add),
			defaultValues: defObjects.add,
		}),
		filterForm: useForm<T>({
			...props,
			resolver: zodResolver(resolvers.filter),
			defaultValues: defObjects.filter,
		}),
	};
};
