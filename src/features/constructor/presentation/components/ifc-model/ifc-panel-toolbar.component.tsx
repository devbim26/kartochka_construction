import type { IfcPanelId } from './ifc-panel-layout.utils';

const PANEL_LABELS: Record<IfcPanelId, string> = {
	tree: 'Дерево модели',
	control: 'Управление',
	properties: 'Свойства',
};

type IfcPanelToolbarProps = {
	visible: Record<IfcPanelId, boolean>;
	onToggle: (id: IfcPanelId) => void;
	onResetLayout: () => void;
};

export const IfcPanelToolbar = ({ visible, onToggle, onResetLayout }: IfcPanelToolbarProps) => {
	return (
		<div className="pointer-events-auto absolute left-3 top-3 z-[60] flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-white/95 px-3 py-2 shadow-md backdrop-blur-sm">
			<span className="text-xs font-semibold text-gray-700">Панели:</span>
			{(Object.keys(PANEL_LABELS) as IfcPanelId[]).map((id) => (
				<label
					key={id}
					className="flex cursor-pointer items-center gap-1.5 text-xs text-gray-800"
				>
					<input
						type="checkbox"
						checked={visible[id]}
						onChange={() => onToggle(id)}
						className="size-3.5 accent-primary"
					/>
					{PANEL_LABELS[id]}
				</label>
			))}
			<button
				type="button"
				onClick={onResetLayout}
				className="ml-1 rounded-md border border-gray-300 px-2 py-0.5 text-xs text-gray-700 hover:bg-gray-50"
			>
				Сбросить расположение
			</button>
		</div>
	);
};
