export type IfcPanelId = 'tree' | 'control' | 'properties';

export type IfcPanelPosition = {
	x: number;
	y: number;
};

export type IfcPanelLayoutState = {
	visible: Record<IfcPanelId, boolean>;
	positions: Partial<Record<IfcPanelId, IfcPanelPosition>>;
};

const STORAGE_KEY = 'acoustic-ifc-panel-layout-v1';

export const IFC_PANEL_DEFAULT_VISIBILITY: Record<IfcPanelId, boolean> = {
	tree: true,
	control: true,
	properties: true,
};

export const IFC_PANEL_DEFAULT_INITIAL = {
	tree: { left: 30, top: 70 },
	control: { right: 270, top: 70 },
	properties: { bottom: 270, left: 400 },
} as const satisfies Record<
	IfcPanelId,
	{ top?: number; left?: number; right?: number; bottom?: number }
>;

export const loadIfcPanelLayout = (): IfcPanelLayoutState => {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) {
			return { visible: { ...IFC_PANEL_DEFAULT_VISIBILITY }, positions: {} };
		}
		const parsed = JSON.parse(raw) as IfcPanelLayoutState;
		return {
			visible: { ...IFC_PANEL_DEFAULT_VISIBILITY, ...parsed.visible },
			positions: parsed.positions ?? {},
		};
	} catch {
		return { visible: { ...IFC_PANEL_DEFAULT_VISIBILITY }, positions: {} };
	}
};

export const saveIfcPanelLayout = (layout: IfcPanelLayoutState) => {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
	} catch {
		/* ignore quota */
	}
};

export const clearIfcPanelLayoutStorage = () => {
	try {
		localStorage.removeItem(STORAGE_KEY);
	} catch {
		/* ignore */
	}
};
