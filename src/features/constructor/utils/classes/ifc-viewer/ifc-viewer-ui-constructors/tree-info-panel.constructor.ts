import type { IFCDataTable } from '@features/constructor/types';
import { Component, html, Panel, type TextInput } from '@thatopen/ui';

export interface TreeInfoPanelConstructorProps {
	relationsTree: IFCDataTable;
	classificationsTree: IFCDataTable;
}

export const treeInfoPanelConstructor = (props: TreeInfoPanelConstructorProps) => {
	return Component.create<Panel>(() => {
		const onSearch = (e: Event) => {
			const input = e.target as TextInput;
			props.relationsTree.queryString = input.value;
		};

		return html`
			<bim-panel>
				<bim-panel-section
					label="Элементы модели"
					collapsed
					style="max-height: 600px; overflow-y: auto; color: #2175f3"
				>
					<bim-panel-section label="Дерево элементов" collapsed>
						<bim-text-input
							@input="${onSearch}"
							placeholder="Поиск..."
							debounce="200"
						></bim-text-input>
						<bim-panel-section
							style="max-height: 400px; overflow-y: auto; color: #2175f3"
						>
							${props.relationsTree}
						</bim-panel-section>
					</bim-panel-section>
					<bim-panel-section
						label="Классификация"
						collapsed
						style="max-height: 400px; overflow-y: auto; color: #2175f3;"
					>
						${props.classificationsTree}
					</bim-panel-section>
				</bim-panel-section>
			</bim-panel>
		`;
	});
};

export type TreeInfoPanelConstructor = typeof treeInfoPanelConstructor;
