import { useFieldArray } from 'react-hook-form';

type ConstructionPosition = 'Left' | 'Center' | 'Right';

export const useConstructionMaterials = (
	control: any,
	watch: any,
	constructionPosition: ConstructionPosition,
) => {
	const positionMap: Record<ConstructionPosition, string> = {
		Left: 'constructionTypeObject.leftConstruction',
		Center: 'constructionTypeObject.centerConstruction',
		Right: 'constructionTypeObject.rightConstruction',
	};

	const fieldName = positionMap[constructionPosition];

	const { fields, append, remove, insert, update, replace } = useFieldArray({
		control,
		name: fieldName,
	});

	const userMaterials = watch(fieldName) || [];

	return {
		fields,
		append,
		remove,
		insert,
		update,
		replace,
		userMaterials,
	};
};
