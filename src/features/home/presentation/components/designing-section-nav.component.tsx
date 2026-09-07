import { APP_ROUTES, useAppNavigate, useI18n } from '@core';
import { CONSTRUCTOR_ROUTES } from '@features/constructor/constants';
import { ReportCategory } from '@features/constructor/types';
import {
	activateProjectSession,
	clearCalculationSession,
	getProjectReportId,
} from '@features/constructor/utils';
import { DESIGNING_ROUTES } from '@features/home/constants';
import { useEffect, useId, useRef, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa6';
import { useLocation } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

const designingBase = APP_ROUTES.designing.route;
const constructorBase = `${designingBase}/${DESIGNING_ROUTES.constructor.route}`;

type Props = {
	/** Текущий заголовок страницы (триггер дропдауна). */
	title: string;
};

/**
 * Единый дропдаун-заголовок разделов (как «Конструктор» на скрине).
 * Ставится вместо статичного page title на страницах designing.
 */
export const DesigningSectionNav = ({ title }: Props) => {
	const { t } = useI18n();
	const navigate = useAppNavigate();
	const location = useLocation();
	const [open, setOpen] = useState(false);
	const rootRef = useRef<HTMLDivElement>(null);
	const menuId = useId();

	const path = location.pathname;
	const isCalculation = path.endsWith(`/${CONSTRUCTOR_ROUTES.calculation.route}`);
	const isConstructor =
		path.includes(`/${DESIGNING_ROUTES.constructor.route}`) && !isCalculation;
	const isAiMode = path.includes(`/${DESIGNING_ROUTES.visualization.route}`);
	const isReports =
		path.includes(`/${DESIGNING_ROUTES.activeReports.route}`) ||
		path.includes(`/${DESIGNING_ROUTES.reports.route}`);

	useEffect(() => {
		if (!open) return;
		const onPointerDown = (event: MouseEvent) => {
			if (!rootRef.current?.contains(event.target as Node)) {
				setOpen(false);
			}
		};
		document.addEventListener('mousedown', onPointerDown);
		return () => document.removeEventListener('mousedown', onPointerDown);
	}, [open]);

	useEffect(() => {
		setOpen(false);
	}, [location.pathname, location.search]);

	const goSoundReport = () => {
		setOpen(false);
		const id = activateProjectSession() || getProjectReportId();
		if (id) {
			navigate(`${constructorBase}/${CONSTRUCTOR_ROUTES.floorPlans.route}`, {
				reportId: id,
				reportType: ReportCategory.Floor,
			});
			return;
		}
		navigate(`${constructorBase}/${CONSTRUCTOR_ROUTES.aboutBuilding.route}`, {
			intent: 'project',
		});
	};

	const goSoundCalculation = () => {
		setOpen(false);
		clearCalculationSession();
		navigate(`${constructorBase}/${CONSTRUCTOR_ROUTES.calculation.route}`);
	};

	const goAiMode = () => {
		setOpen(false);
		navigate(`${designingBase}/${DESIGNING_ROUTES.visualization.route}`);
	};

	const goReports = () => {
		setOpen(false);
		navigate(`${designingBase}/${DESIGNING_ROUTES.activeReports.route}`);
	};

	const items = [
		{
			id: 'sound-report',
			label: t('constructor.sectionNav.soundReport'),
			active: isConstructor,
			onClick: goSoundReport,
		},
		{
			id: 'sound-calculation',
			label: t('constructor.sectionNav.soundCalculation'),
			active: isCalculation,
			onClick: goSoundCalculation,
		},
		{
			id: 'ai-mode',
			label: t('constructor.sectionNav.aiMode'),
			active: isAiMode,
			onClick: goAiMode,
		},
		{
			id: 'reports',
			label: t('constructor.sectionNav.reports'),
			active: isReports,
			onClick: goReports,
		},
	];

	return (
		<div ref={rootRef} className="relative">
			<button
				type="button"
				aria-expanded={open}
				aria-haspopup="menu"
				aria-controls={menuId}
				aria-label={t('constructor.sectionNav.aria')}
				onClick={() => setOpen((prev) => !prev)}
				className={twMerge(
					'inline-flex items-center gap-1.5 font-sans text-lg font-semibold leading-6 transition-colors',
					open ? 'text-primary' : 'text-[#14181F] hover:text-primary',
				)}
			>
				{title}
				<FaChevronDown
					className={twMerge('size-3.5 transition-transform', open && 'rotate-180')}
				/>
			</button>

			{open ? (
				<div
					id={menuId}
					role="menu"
					className="absolute left-0 top-full z-20 mt-2 min-w-[240px] overflow-hidden rounded-md bg-white py-1 shadow-xl ring-1 ring-black/5"
				>
					{items.map((item) => (
						<button
							key={item.id}
							type="button"
							role="menuitem"
							onClick={item.onClick}
							className={twMerge(
								'block w-full px-4 py-2.5 text-left font-sans text-sm transition-colors',
								item.active
									? 'bg-[#EDF2FA] font-semibold text-primary'
									: 'font-normal text-[#383838] hover:bg-[#F5F7FA]',
							)}
						>
							{item.label}
						</button>
					))}
				</div>
			) : null}
		</div>
	);
};

/** @deprecated Используйте DesigningSectionNav — оставлено для совместимости импортов. */
export const ConstructorSectionNav = () => {
	const { t } = useI18n();
	return <DesigningSectionNav title={t('sidebar.constructor')} />;
};
