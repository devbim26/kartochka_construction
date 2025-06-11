import { IFCViewerRelationsTree } from '@features/constructor/types';
import { Components } from '@thatopen/components';
import { Component, html, type TextInput } from '@thatopen/ui';

export interface TreeInfoPanelConstructorProps {
	components: Components;
	relationsTree: IFCViewerRelationsTree;
}

export const treeInfoPanelConstructor = (props: TreeInfoPanelConstructorProps) => {
	return Component.create(() => {
		const onSearch = (e: Event) => {
			const input = e.target as TextInput;
			props.relationsTree.queryString = input.value;
		};

		return html`
			<bim-panel>
				<bim-panel-section id="model-info-panel-content" label="Дерево элементов" collapsed>
					<bim-text-input
						@input="${onSearch}"
						placeholder="Поиск..."
						debounce="200"
					></bim-text-input>
					<bim-panel-section style="max-height: 400px; overflow-y: auto; color: #2175f3">
						${props.relationsTree}
					</bim-panel-section>
				</bim-panel-section>
			</bim-panel>
		`;
	});
};

export type TreeInfoPanelConstructor = typeof treeInfoPanelConstructor;
