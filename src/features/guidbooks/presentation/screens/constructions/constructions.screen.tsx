import {
	ConstructionsAdd,
	ConstructionsAddConfig,
	ConstructionsEdit,
	ConstructionsEditConfig,
	ConstructionsFilter,
	ConstructionsFilterConfig,
	GuidbookPageHeaderWrapper,
	useHeaderForm,
} from '@features';
import { useCallback } from 'react';

const ConstructionsScreen = () => {
	// const createColumns = (data: ConstructionsAddData[]): TableColumn<ConstructionsAddData>[] => {
	// 	if (!data) return [];
	// 	const columns: TableColumn<ConstructionsAddData>[] = [
	// 		{
	// 			dataKey: 'imageUrl',
	// 			label: 'Изображение',
	// 			width: 0,
	// 			headerRenderer: (props) =>
	// 				ColumnHeader({ ...props, containerClassName: 'w-[300px]' }),
	// 			cellRenderer: (props) => ColumnCell({ ...props, containerClassName: 'w-[300px]' }),
	// 		},
	// 		{
	// 			dataKey: 'name',
	// 			label: 'Название',
	// 			width: 0,
	// 			headerRenderer: (props) =>
	// 				ColumnHeader({ ...props, containerClassName: 'w-[300px]' }),
	// 			cellRenderer: (props) => ColumnCell({ ...props, containerClassName: 'w-[300px]' }),
	// 		},
	// 		{
	// 			dataKey: 'shortName',
	// 			label: 'Краткое название',
	// 			width: 0,
	// 			headerRenderer: (props) =>
	// 				ColumnHeader({ ...props, containerClassName: 'w-[300px]' }),
	// 			cellRenderer: (props) => ColumnCell({ ...props, containerClassName: 'w-[300px]' }),
	// 		},
	// 		{
	// 			dataKey: 'description',
	// 			label: 'Описание',
	// 			width: 0,
	// 			headerRenderer: (props) =>
	// 				ColumnHeader({ ...props, containerClassName: 'w-[300px]' }),
	// 			cellRenderer: (props) => ColumnCell({ ...props, containerClassName: 'w-[300px]' }),
	// 		},
	// 		{
	// 			dataKey: 'description',
	// 			label: 'Описание',
	// 			width: 0,
	// 			headerRenderer: (props) =>
	// 				ColumnHeader({ ...props, containerClassName: 'w-[300px]' }),
	// 			cellRenderer: (props) => ColumnCell({ ...props, containerClassName: 'w-[300px]' }),
	// 		},
	// 		//цвет
	// 		//штриховка
	// 		{
	// 			dataKey: 'materialType',
	// 			label: 'Тип материала',
	// 			width: 0,
	// 			headerRenderer: (props) =>
	// 				ColumnHeader({ ...props, containerClassName: 'w-[300px]' }),
	// 			cellRenderer: (props) => ColumnCell({ ...props, containerClassName: 'w-[300px]' }),
	// 		},
	// 		{
	// 			dataKey: 'region',
	// 			label: 'Регион',
	// 			width: 0,
	// 			headerRenderer: (props) =>
	// 				ColumnHeader({ ...props, containerClassName: 'w-[300px]' }),
	// 			cellRenderer: (props) => ColumnCell({ ...props, containerClassName: 'w-[300px]' }),
	// 		},
	// 		{
	// 			dataKey: 'density',
	// 			label: 'Плотность материала',
	// 			width: 0,
	// 			headerRenderer: (props) =>
	// 				ColumnHeader({ ...props, containerClassName: 'w-[300px]' }),
	// 			cellRenderer: (props) => ColumnCell({ ...props, containerClassName: 'w-[300px]' }),
	// 		},
	// 		{
	// 			dataKey: 'thickness',
	// 			label: 'Толщина материала',
	// 			width: 0,
	// 			headerRenderer: (props) =>
	// 				ColumnHeader({ ...props, containerClassName: 'w-[300px]' }),
	// 			cellRenderer: (props) => ColumnCell({ ...props, containerClassName: 'w-[300px]' }),
	// 		},
	// 		{
	// 			dataKey: 'speedOfSound',
	// 			label: 'Скорость звука',
	// 			width: 0,
	// 			headerRenderer: (props) =>
	// 				ColumnHeader({ ...props, containerClassName: 'w-[300px]' }),
	// 			cellRenderer: (props) => ColumnCell({ ...props, containerClassName: 'w-[300px]' }),
	// 		},
	// 		{
	// 			dataKey: 'materialCoefficient',
	// 			label: 'Коэффициент материала',
	// 			width: 0,
	// 			headerRenderer: (props) =>
	// 				ColumnHeader({ ...props, containerClassName: 'w-[300px]' }),
	// 			cellRenderer: (props) => ColumnCell({ ...props, containerClassName: 'w-[300px]' }),
	// 		},
	// 		{
	// 			dataKey: 'lossFactor',
	// 			label: 'Коэффициент потерь',
	// 			width: 0,
	// 			headerRenderer: (props) =>
	// 				ColumnHeader({ ...props, containerClassName: 'w-[300px]' }),
	// 			cellRenderer: (props) => ColumnCell({ ...props, containerClassName: 'w-[300px]' }),
	// 		},
	// 		//коэффициент для расчетов
	// 		{
	// 			dataKey: 'youngModulus',
	// 			label: 'Модуль Юнга материала, ГПа',
	// 			width: 0,
	// 			headerRenderer: (props) =>
	// 				ColumnHeader({ ...props, containerClassName: 'w-[300px]' }),
	// 			cellRenderer: (props) => ColumnCell({ ...props, containerClassName: 'w-[300px]' }),
	// 		},
	// 		//коэффициент затухания
	// 		//процентная доля твердой массы
	// 		{
	// 			dataKey: 'id',
	// 			label: 'Действия',
	// 			width: 0,
	// 			headerRenderer: (props) =>
	// 				ColumnHeader({ ...props, containerClassName: 'w-[300px]' }),
	// 			cellRenderer: (props) =>
	// 				ColumnCell({
	// 					...props,
	// 					containerClassName: 'w-[300px]',
	// 					cellData: (
	// 						<div className="flex gap-2">
	// 							{/* <EditIcon
	// 									onClick={() =>
	// 										navigate('', { edit: 'true', entityId: props.cellData })
	// 									}
	// 								/>
	// 								<DeleteIcon
	// 									onClick={() => handleDeleteTableData(props.cellData as string)}
	// 								/> */}
	// 						</div>
	// 					),
	// 				}),
	// 		},
	// 	];
	// 	return mapColumns(columns);
	// };

	const forms = useHeaderForm(
		{
			filter: ConstructionsFilterConfig.defaultValues,
			edit: ConstructionsEditConfig.defaultValues,
			add: ConstructionsAddConfig.defaultValues,
		},
		{
			filter: ConstructionsFilterConfig.schema,
			edit: ConstructionsEditConfig.schema,
			add: ConstructionsAddConfig.schema,
		},
	);

	const onSaveHandle = useCallback(() => {}, []);
	return (
		<div className="flex w-full flex-col gap-[40px]">
			<GuidbookPageHeaderWrapper
				onSave={onSaveHandle}
				titles={{
					pageTitle: 'Конструкции',
					editTitle: 'Редактирование конструкции',
					addTitle: 'Добавление конструкции',
				}}
				forms={forms}
				formElements={{
					filter: ConstructionsFilter,
					add: ConstructionsAdd,
					edit: ConstructionsEdit,
				}}
			/>
			{/* <GuidbookPageTableWrapper /> */}
		</div>
	);
};

export default ConstructionsScreen;
