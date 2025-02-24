import { Select } from '@core';
import { Controller, useFormContext } from 'react-hook-form';
import { catchError, from, switchMap, tap } from 'rxjs';
import { twMerge } from 'tailwind-merge';

interface Props {
	fieldIndex: number;
	constructionIndex: number;
}

export const FrameMaterialType = ({ fieldIndex, constructionIndex }: Props) => {
	const form = useFormContext<ConstructionsAddData>();
	const { formState, control } = form;
	const [materials, setMaterials] = useState<Array<SelectOption>>();

	const handleGetMaterials = (data: MaterialsFilterData) => {
		from(
			getGuidebooksPaginated({
				data: data,
				guidebookType: Guidebooks.MATERIAL,
			}),
		)
			.pipe(
				switchMap((response: AxiosResponse) => {
					const items = convertToPaginatedType(convertToClientMaterialsAddAndEditData)(
						response.data,
					);
					return from([items]);
				}),
				tap((items) => setMaterials(convertToSelectValues(items!)!)),
				catchError((error) => {
					console.log('Error:', error);
					return from([null]);
				}),
			)
			.subscribe();
	};

	useEffect(() => {
		handleGetMaterials({
			materialType: MaterialTypeEnum.Frame,
		});
	}, []);

	return (
		<div className="flex flex-wrap gap-[16px]">
			<Controller
				name={`constructionTypeObject.constructions.${constructionIndex}.userMaterials.${fieldIndex}.materialTypeValue.${0}.value`}
				control={control}
				render={({ field }) => (
					<Select
						{...field}
						value={field.value || ''}
						options={[]}
						error={
							formState.errors.constructionTypeObject?.constructions?.[
								constructionIndex
							]?.userMaterials?.[fieldIndex]?.materialTypeValue?.[0]?.value?.message
						}
						labelClassName={twMerge(
							'text-sm leading-5 tracking-[0.1px] text-nowrap w-[226px]',
							formState.errors.constructionTypeObject?.constructions?.[
								constructionIndex
							]?.userMaterials?.[fieldIndex]?.materialTypeValue?.[0]?.value?.message
								? 'text-error'
								: '',
						)}
						wrapperClassname="flex-row ring-input-border-primary items-center gap-[16px]"
						buttonClassName="text-sm rounded-[8px] w-[226px]"
						label={
							formState.errors.constructionTypeObject?.constructions?.[
								constructionIndex
							]?.userMaterials?.[fieldIndex]?.materialTypeValue?.[0]?.value
								?.message || 'Каркас'
						}
						placeholder="Выберите материал"
					/>
				)}
			/>
		</div>
	);
};
