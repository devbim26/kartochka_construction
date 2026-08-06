import { APP_ROUTES, useAppNavigate, useI18n } from '@core';
import { setDesignCalculationModeFromFeatureId } from '@core/utils/helpers/design-calculation-mode.helper';
import { CONSTRUCTOR_ROUTES } from '@features/constructor/constants';
import { ReportCategory } from '@features/constructor/types';
import {
	activateCalculationSession,
	activateProjectSession,
	clearCalculationSession,
	clearProjectSession,
} from '@features/constructor/utils';
import { DESIGNING_ROUTES } from '@features/home/constants';
import { AnimatePresence, motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { IoCloseOutline } from 'react-icons/io5';
import { SubImage } from './current-sub/images';

type Mode = 'resume' | 'create';

type Props = {
	isOpen: boolean;
	onClose: () => void;
	/** resume — Продолжить, если есть сессия; create — всегда новый отчёт выбранного типа */
	mode?: Mode;
};

const constructorBase =
	APP_ROUTES.designing.route + '/' + DESIGNING_ROUTES.constructor.route;

const choiceButtonClass =
	'w-full rounded-[12px] border-2 border-primary bg-white px-4 py-[14px] text-center font-sans text-[17px] font-semibold leading-snug text-primary transition-colors hover:bg-primary hover:text-white';

export const SoundInsulationChoiceModal = ({
	isOpen,
	onClose,
	mode = 'resume',
}: Props) => {
	const { t } = useI18n();
	const navigate = useAppNavigate();

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

	if (typeof document === 'undefined') return null;

	return createPortal(
		<AnimatePresence>
			{isOpen ? (
				<>
					<motion.button
						type="button"
						aria-label={t('common.close')}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="fixed inset-0 z-20 bg-black/30 backdrop-blur-sm"
						onClick={onClose}
					/>
					<div className="pointer-events-none fixed inset-0 z-30 flex items-center justify-center p-4">
						<motion.div
							role="dialog"
							aria-modal="true"
							aria-labelledby="sound-insulation-choice-title"
							initial={{ y: 40, scale: 0.96, opacity: 0 }}
							animate={{ y: 0, scale: 1, opacity: 1 }}
							exit={{ y: 40, scale: 0.96, opacity: 0 }}
							transition={{ duration: 0.2 }}
							className="pointer-events-auto relative flex w-full max-w-[720px] overflow-hidden rounded-[20px] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
						>
							<button
								type="button"
								className="absolute right-3 top-3 z-10 flex size-8 items-center justify-center rounded-md text-[#14181F] transition-colors hover:bg-black/5"
								onClick={onClose}
								aria-label={t('common.close')}
							>
								<IoCloseOutline className="size-6" />
							</button>

							<div className="hidden w-[42%] shrink-0 items-center justify-center bg-[#F3F6FA] p-6 sm:flex">
								<SubImage />
							</div>

							<div className="flex min-w-0 flex-1 flex-col justify-center gap-5 px-6 py-8 sm:px-8 sm:py-10">
								<div className="flex flex-col gap-3">
									<h2
										id="sound-insulation-choice-title"
										className="font-sans text-[22px] font-semibold leading-tight text-[#14181F]"
									>
										{t('main.designCards.sound.choiceModalTitle')}
									</h2>
									<div className="h-px w-full bg-primary" />
								</div>

								<div className="flex flex-col gap-3">
									<button
										type="button"
										className={choiceButtonClass}
										onClick={goCalculation}
									>
										{t('main.designCards.sound.choiceCalculation')}
									</button>
									<button
										type="button"
										className={choiceButtonClass}
										onClick={goProject}
									>
										{t('main.designCards.sound.choiceProject')}
									</button>
								</div>
							</div>
						</motion.div>
					</div>
				</>
			) : null}
		</AnimatePresence>,
		document.body,
	);
};
