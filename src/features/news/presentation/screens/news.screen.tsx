import type { ArticleDto } from '@api-gen';
import {
	convertToPaginatedType,
	DeleteIcon,
	DeleteModal,
	EditIcon,
	paginationStateDefault,
	SafeImage,
	SimpleTable,
	SimpleTableCell,
	SimpleTableHeaderCell,
	useAppNavigate,
	useI18n,
	type PaginationState,
} from '@core';
import { useHeaderForm } from '@features/guidbooks/utils';
import {
	convertToClientArticleData,
	convertToServerArticleAddData,
	convertToServerArticleEditData,
	convertToServerArticleFilterData,
} from '@features/news/converters';
import {
	createArticle,
	deleteArticle,
	getArticleById,
	getPaginatedArticles,
	updateArticle,
} from '@features/news/services';
import type { Article } from '@features/news/types';
import { NewsAddAndEditConfig, NewsFilterConfig, isNewsDateReadyForFilter } from '@features/news/utils';
import type { ColumnDef } from '@tanstack/react-table';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { catchError, from, switchMap, tap } from 'rxjs';
import { toast } from 'sonner';
import { NewsAddEdit, NewsFilter, NewsPageHeaderWrapper } from '../components';

const NewsScreen = () => {
	const { t } = useI18n();
	const navigate = useAppNavigate();
	const [search] = useSearchParams();
	const [singleArticle, setSingleArticle] = useState<Article>();
	const [tableData, setTableData] = useState<Array<Article>>([]);
	const [paginationState, setPaginationState] = useState<PaginationState>(paginationStateDefault);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [itemToDelete, setItemToDelete] = useState({
		id: '',
		name: '',
	});

	const form = useHeaderForm<Article>(
		{
			filter: NewsFilterConfig.defaultValues,
			edit: NewsAddAndEditConfig.defaultValues,
			add: NewsAddAndEditConfig.defaultValues,
		},
		{
			filter: NewsFilterConfig.schema,
			edit: NewsAddAndEditConfig.schema,
			add: NewsAddAndEditConfig.schema,
		},
	);

	const [filterTitle, filterPublishDate] = form.filterForm.watch(['title', 'publishDate']);

	useEffect(() => {
		if (search.get('edit') && search.get('entityId')) {
			handleGetOneTableData(search.get('entityId')!);
		}
	}, [search]);

	useEffect(() => {
		if (singleArticle) form.editForm.reset(singleArticle);
	}, [singleArticle]);

	useEffect(() => {
		if (!isNewsDateReadyForFilter(filterPublishDate)) {
			return;
		}
		handleGetTableData(form.filterForm.getValues(), paginationState);
	}, [filterTitle, filterPublishDate]);

	const handleGetTableData = (
		data: Partial<Article>,
		pagination: Pick<PaginationState, 'pageNumber' | 'pageSize'>,
	) => {
		from(
			getPaginatedArticles({
				data: convertToServerArticleFilterData(data, pagination),
			}),
		)
			.pipe(
				switchMap((response) => {
					const res = convertToPaginatedType(convertToClientArticleData)(
						{
							items: response.data.items ?? [],
							pageNumber: response.data.pageNumber ?? 1,
							totalPages: response.data.totalPages ?? 0,
							totalCount: response.data.totalCount ?? 0,
							pageSize: response.data.pageSize ?? 10,
							hasPreviousPage: false,
							hasNextPage: false,
						},
						pagination,
					);
					return from([res]);
				}),
				tap((res) => {
					setTableData(res.items);
					setPaginationState(res.pagination);
				}),
				catchError((error) => {
					if (error instanceof AxiosError) {
						toast.error(error.response?.data?.message || t('news.loadError'));
					}
					return from([null]);
				}),
			)
			.subscribe();
	};

	const handleAddTableData = (data: Article) => {
		from(createArticle({ data: convertToServerArticleAddData(data) }))
			.pipe(
				catchError((error) => {
					if (error instanceof AxiosError) {
						toast.error(error.response?.data?.message || t('news.createError'));
					}
					return from([null]);
				}),
			)
			.subscribe((response) => {
				if (response?.status === 200) {
					handleGetTableData(form.filterForm.getValues(), paginationState);
					toast.success(t('news.addSuccess'));
					navigate('');
				}
			});
	};

	const handleDeleteTableData = (id: string) => {
		from(deleteArticle({ id, data: { articleId: id } }))
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
					handleGetTableData(form.filterForm.getValues(), paginationState);
					toast.success(t('news.deleteSuccess'));
				}
			});
	};

	const handleEditTableData = (data: Article) => {
		from(updateArticle({ data: convertToServerArticleEditData(data) }))
			.pipe(
				catchError((error) => {
					if (error instanceof AxiosError) {
						toast.error(error.response?.data?.message || t('news.editError'));
					}
					return from([null]);
				}),
			)
			.subscribe((response) => {
				if (response?.status === 200) {
					handleGetTableData(form.filterForm.getValues(), paginationState);
					toast.success(t('news.editSuccess'));
					navigate('');
				}
			});
	};

	const handleGetOneTableData = (id: string) => {
		from(getArticleById({ id }))
			.pipe(
				switchMap((response) => {
					const data = convertToClientArticleData(response.data as ArticleDto);
					return from([data]);
				}),
				tap((data) => setSingleArticle(data!)),
				catchError((error) => {
					if (error instanceof AxiosError) {
						toast.error(error.response?.data);
					}
					return from([null]);
				}),
			)
			.subscribe();
	};

	const onSaveHandle = useCallback(
		(data: Article) => {
			handleAddTableData(data);
		},
		[form.addForm],
	);

	const onEditHandle = useCallback(
		(data: Article) => {
			handleEditTableData(data);
		},
		[form.editForm],
	);

	const formElements = useMemo(
		() => ({
			filter: NewsFilter,
			add: NewsAddEdit,
			edit: NewsAddEdit,
		}),
		[],
	);

	const columns = useMemo(() => {
		const cols: ColumnDef<Article>[] = [
			{
				accessorKey: 'imageUrl',
				header: () => <SimpleTableHeaderCell text={t('news.columns.image')} />,
				cell: (info) => (
					<SimpleTableCell
						contentClassName="flex items-center size-[80px]"
						content={
							<SafeImage
								src={info.getValue() as string}
								className="size-[80px] rounded-lg object-cover"
								alt={t('news.columns.image')}
								fallbackClassName="size-[80px]"
							/>
						}
					/>
				),
			},
			{
				accessorKey: 'title',
				header: () => <SimpleTableHeaderCell text={t('news.columns.title')} />,
				cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
			},
			{
				accessorKey: 'publishDate',
				header: () => <SimpleTableHeaderCell text={t('news.columns.publishDate')} />,
				cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
			},
			{
				accessorKey: 'id',
				header: () => <SimpleTableHeaderCell text={t('common.actions')} />,
				cell: (info) => (
					<SimpleTableCell
						content={
							<div className="flex gap-2">
								<EditIcon
									onClick={() => {
										navigate('', {
											edit: 'true',
											entityId: info.row.original.id!,
										});
									}}
								/>
								<DeleteIcon
									onClick={() => {
										setItemToDelete({
											id: info.row.original.id!,
											name: info.row.original.title!,
										});
										setIsModalOpen(true);
									}}
								/>
							</div>
						}
					/>
				),
			},
		];
		return cols;
	}, [navigate, t]);

	return (
		<div className="flex w-full flex-col gap-[40px]">
			<NewsPageHeaderWrapper
				onSave={search.get('add') ? onSaveHandle : onEditHandle}
				titles={{
					pageTitleKey: 'news.pageTitle',
					editTitleKey: 'news.editTitle',
					addTitleKey: 'news.addTitle',
				}}
				forms={form}
				formElements={formElements}
			/>
			<SimpleTable
				data={tableData}
				columns={columns}
				paginationState={paginationState}
				onChangePaginationState={(newState) => {
					setPaginationState((prev) => ({ ...prev, ...newState }));
					handleGetTableData(form.filterForm.getValues(), newState);
				}}
			/>
			<DeleteModal
				isOpen={isModalOpen}
				onCancel={() => setIsModalOpen(false)}
				onClose={() => setIsModalOpen(false)}
				onConfirm={() => {
					handleDeleteTableData(itemToDelete.id);
					setIsModalOpen(false);
				}}
				headerTitle={t('guides.deleteModal.title')}
			>
				{t('guides.deleteModal.newsQuestion')} {itemToDelete.name}
			</DeleteModal>
		</div>
	);
};

export default NewsScreen;
