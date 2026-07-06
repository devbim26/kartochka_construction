import type { GraphParametrsDto } from '@api-gen';
import { Modal, useAppDispatch, useI18n } from '@core';
import Loader from '@core/presentation/components/loaders/loader.component';
import {
	graphAdditionalValuesConverterToClient,
	graphDotsConverterToClient,
} from '@features/constructor/converters';
import { graphAdditionalDetail, graphDetail } from '@features/constructor/services';
import { startLoading, stopLoading } from '@features/constructor/store';
import type { AdditionalGraphParameters, GraphDetailResponse } from '@features/constructor/types';
import { useGraphNoiseMode } from '@features/constructor/utils';
import { catchError, finalize, from, of } from 'rxjs';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import DesigningGraph from '../designing/designing-graph.component';
import { GraphDetailTable } from '../designing/designing-tables/sound-reduction-table.component';

type Props = {
	isOpen: boolean;
	onClose: () => void;
	constructionHeaderId: string | null;
	regulatoryDocName: string;
	calculationDocName?: string;
};

export const CatalogLabTestGraphModal = ({
	isOpen,
	onClose,
	constructionHeaderId,
	regulatoryDocName,
	calculationDocName = '',
}: Props) => {
	const dispatch = useAppDispatch();
	const { t } = useI18n();
	const [graphData, setGraphData] = useState<GraphDetailResponse[] | null>(null);
	const [graphAdditionalData, setGraphAdditionalData] =
		useState<AdditionalGraphParameters | null>(null);
	const { noiseMode, setNoiseMode, activeNoiseMode } = useGraphNoiseMode(graphData);

	useEffect(() => {
		if (!isOpen || !constructionHeaderId) {
			setGraphData(null);
			setGraphAdditionalData(null);
			return;
		}

		let cancelled = false;
		setGraphData(null);
		setGraphAdditionalData(null);
		dispatch(startLoading());

		const sub = from(
			Promise.all([
				graphDetail({ constructionHeaderId }),
				graphAdditionalDetail({ constructionHeaderId }),
			]),
		)
			.pipe(
				catchError(() => {
					toast.error(t('errors.graphDataLoad'));
					return of([null, null] as const);
				}),
				finalize(() => dispatch(stopLoading())),
			)
			.subscribe(([gRes, aRes]) => {
				if (cancelled) return;
				if (gRes?.data && Array.isArray(gRes.data)) {
					setGraphData(
						(gRes.data as GraphParametrsDto[]).map((item) =>
							graphDotsConverterToClient(item),
						),
					);
				} else {
					setGraphData([]);
				}
				if (aRes?.data) {
					setGraphAdditionalData(graphAdditionalValuesConverterToClient(aRes.data));
				} else {
					setGraphAdditionalData(null);
				}
			});

		return () => {
			cancelled = true;
			sub.unsubscribe();
		};
	}, [isOpen, constructionHeaderId, dispatch, t]);

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			headerTitle={t('constructor.catalog.labTestGraphTitle')}
			className="max-h-[min(92vh,900px)] w-[min(96vw,1680px)] max-w-[min(96vw,1680px)] md:w-[min(96vw,1680px)]"
			contentClassName="max-h-[min(78vh,820px)] overflow-y-auto"
		>
			{graphData === null ? (
				<div className="flex min-h-[200px] items-center justify-center">
					<Loader />
				</div>
			) : (
				<div className="flex w-full min-w-0 flex-col items-stretch gap-6 lg:flex-row lg:items-start">
					<div className="flex min-h-0 min-w-0 flex-1 justify-center overflow-x-auto lg:basis-0">
						<DesigningGraph
							graphData={graphData}
							regulatoryDocName={regulatoryDocName}
							calculationDocName={calculationDocName}
							chartSize="large"
							noiseMode={noiseMode}
							onNoiseModeChange={setNoiseMode}
						/>
					</div>
					<div className="w-max min-w-0 shrink-0 lg:max-w-[min(100%,520px)]">
						<GraphDetailTable
							graphData={graphData}
							additional={graphAdditionalData || undefined}
							noPadding
							noiseMode={activeNoiseMode}
						/>
					</div>
				</div>
			)}
		</Modal>
	);
};
