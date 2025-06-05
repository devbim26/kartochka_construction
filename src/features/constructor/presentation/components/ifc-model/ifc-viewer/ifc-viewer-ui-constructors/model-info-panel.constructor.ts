import { ModelInfoPanelConstructorViewerItems } from '@features/constructor/types';
import { Component, html, TextInput } from '@thatopen/ui';

export const modelInfoPanelConstructor = (viewerItems: ModelInfoPanelConstructorViewerItems) => {
	return Component.create(() => {
		const onSearch = (e: Event) => {
			const input = e.target as TextInput;
			viewerItems.relationsTree.queryString = input.value;
		};

		return html`
			<bim-panel label="Инфо">
				<bim-panel-section label="Иерархия модели">
					<bim-text-input
						@input=${onSearch}
						placeholder="Search..."
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
