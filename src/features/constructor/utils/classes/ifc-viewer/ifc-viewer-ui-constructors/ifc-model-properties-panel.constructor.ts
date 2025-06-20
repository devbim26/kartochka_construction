import type { IFCDataTable } from '@features/constructor/types';
import { Component, html, type Panel } from '@thatopen/ui';

export interface IFCModelProperiesPanelConstructorProps {
	propertiesTable: IFCDataTable;
}

export const ifcModelProperiesPanelConstructor = (
	props: IFCModelProperiesPanelConstructorProps,
) => {
	return Component.create<Panel>(() => {
		return html`
			<bim-panel>
				<bim-panel-section
					label="Свойства"
					collapsed
					style="max-height: 600px; overflow-y: auto; color: #2175f3"
				>
					${props.propertiesTable}
				</bim-panel-section>
			</bim-panel>
		`;
	});
};

export type IFCModelProperiesPanelConstructor = typeof ifcModelProperiesPanelConstructor;
