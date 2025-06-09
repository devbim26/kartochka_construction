import type { ModelInfoPanelConstructorViewerItems } from '@features/constructor/types';
import { Component, html, type TextInput } from '@thatopen/ui';

export const modelInfoPanelConstructor = (viewerItems: ModelInfoPanelConstructorViewerItems) => {
	return Component.create(() => {
		const onSearch = (e: Event) => {
			const input = e.target as TextInput;
			viewerItems.relationsTree.queryString = input.value;
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
						${viewerItems.relationsTree}
					</bim-panel-section>
				</bim-panel-section>
			</bim-panel>
		`;
	});
};
