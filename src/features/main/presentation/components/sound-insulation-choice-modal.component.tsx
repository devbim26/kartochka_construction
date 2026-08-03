import { APP_ROUTES, Button, Modal, useAppNavigate, useI18n } from '@core';
import { setDesignCalculationModeFromFeatureId } from '@core/utils/helpers/design-calculation-mode.helper';
import { CONSTRUCTOR_ROUTES } from '@features/constructor/constants';
import { ReportCategory } from '@features/constructor/types';
import {
	activateCalculationSession,
	activateProjectSession,
	clearCalculationSession,
	clearProjectSession,
	getCalculationReportId,
	getProjectReportId,
} from '@features/constructor/utils';
import { DESIGNING_ROUTES } from '@features/home/constants';
import { useMemo } from 'react';

type Mode = 'resume' | 'create';

type Props = {
	isOpen: boolean;
	onClose: () => void;
	/** resume — Продолжить, если есть сессия; create — всегда новый отчёт выбранного типа */
	mode?: Mode;
};

const constructorBase =
	APP_ROUTES.designing.route + '/' + DESIGNING_ROUTES.constructor.route;

export const SoundInsulationChoiceModal = ({
	isOpen,
	onClose,
	mode = 'resume',
}: Props) => {
	const { t } = useI18n();
	const navigate = useAppNavigate();

	const projectId = useMemo(
		() => (isOpen ? getProjectReportId() : null),
		[isOpen],
	);
	const calculationId = useMemo(
		() => (isOpen ? getCalculationReportId() : null),
		[isOpen],
	);

	const canContinueProject = mode === 'resume' && !!projectId;
	const canContinueCalculation = mode === 'resume' && !!calculationId;

	const goProject = () => {
		setDesignCalculationModeFromFeatureId('sound-isolation');
		onClose();

		if (mode === 'create') {
			clearProjectSession();
			navigate(constructorBase + '/' + CONSTRUCTOR_ROUTES.aboutBuilding.route, {
				intent: 'project',
			});
			return;
		}

		const id = activateProjectSession();
		if (id) {
			navigate(constructorBase + '/' + CONSTRUCTOR_ROUTES.floorPlans.route, {
				reportId: id,
				reportType: ReportCategory.Floor,
			});
			return;
		}

		navigate(constructorBase + '/' + CONSTRUCTOR_ROUTES.aboutBuilding.route, {
			intent: 'project',
		});
	};

	const goCalculation = () => {
		setDesignCalculationModeFromFeatureId('sound-isolation');
		onClose();

		if (mode === 'create') {
			clearCalculationSession();
			navigate(constructorBase + '/' + CONSTRUCTOR_ROUTES.calculation.route);
			return;
		}

		const id = activateCalculationSession();
		if (id) {
			navigate(constructorBase + '/' + CONSTRUCTOR_ROUTES.calculation.route, {
				reportId: id,
				reportType: ReportCategory.Single,
			});
			return;
		}

		navigate(constructorBase + '/' + CONSTRUCTOR_ROUTES.calculation.route);
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			headerTitle={t('main.designCards.sound.choiceModalTitle')}
			className="max-w-xl md:w-[32rem]"
			contentClassName="gap-4 py-6"
			backdropClassName="bg-black/30 backdrop-blur-sm"
		>
			<div className="flex flex-col gap-4">
				<div className="flex items-center justify-between gap-4">
					<p className="font-sans text-base font-medium text-[#1f2937]">
						{t('main.designCards.sound.choiceCalculation')}
					</p>
					<Button
						type="button"
						className="h-[36px] shrink-0 px-4 font-sans text-sm font-semibold shadow-none"
						onClick={goCalculation}
					>
						{canContinueCalculation ? t('common.continue') : t('common.start')}
					</Button>
				</div>
				<div className="flex items-center justify-between gap-4">
					<p className="font-sans text-base font-medium text-[#1f2937]">
						{t('main.designCards.sound.choiceProject')}
					</p>
					<Button
						type="button"
						className="h-[36px] shrink-0 px-4 font-sans text-sm font-semibold shadow-none"
						onClick={goProject}
					>
						{canContinueProject ? t('common.continue') : t('common.start')}
					</Button>
				</div>
			</div>
		</Modal>
	);
};
