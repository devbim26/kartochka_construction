import { UiControlPanelConstructorSceneItems } from '@features/constructor/types';
import { Checkbox, ColorInput, Component, html, NumberInput, PanelSection } from '@thatopen/ui';
import { Color } from 'three';

export const uiControlPanelConstructor = (sceneItems: UiControlPanelConstructorSceneItems) => {
	return Component.create<PanelSection>(() => {
		return html`
			<bim-panel label="Control panel" class="options-menu">
				<bim-panel-section collapsed label="Commands">
					<bim-label>Double click: Create / delete clipping plane</bim-label>
				</bim-panel-section>
				<bim-panel-section collapsed label="Clipper">
					<bim-checkbox
						label="Clipper enabled"
						checked
						@change="${({ target }: { target: Checkbox }) => {
							sceneItems.clipper.config.enabled = target.value;
						}}"
					>
					</bim-checkbox>

					<bim-checkbox
						label="Clipper visible"
						checked
						@change="${({ target }: { target: Checkbox }) => {
							sceneItems.clipper.config.visible = target.value;
						}}"
					>
					</bim-checkbox>
					<bim-color-input
						label="Planes Color"
						color="#202932"
						@input="${({ target }: { target: ColorInput }) => {
							sceneItems.clipper.config.color = new Color(target.color);
						}}"
					>
					</bim-color-input>

					<bim-number-input
						slider
						step="0.01"
						label="Planes opacity"
						value="0.2"
						min="0.1"
						max="1"
						@change="${({ target }: { target: NumberInput }) => {
							sceneItems.clipper.config.opacity = target.value;
						}}"
					>
					</bim-number-input>

					<bim-number-input
						slider
						step="0.1"
						label="Planes size"
						value="5"
						min="2"
						max="10"
						@change="${({ target }: { target: NumberInput }) => {
							sceneItems.clipper.config.size = target.value;
						}}"
					>
					</bim-number-input>

					<bim-button
						label="Delete all"
						@click="${() => {
							sceneItems.clipper.deleteAll();
						}}"
					>
					</bim-button>
				</bim-panel-section>
				<bim-panel-section collapsed label="Scene">
					<bim-number-input
						slider
						step="0.1"
						label="Directional lights intensity"
						value="1.5"
						min="0.1"
						max="10"
						@change="${({ target }: { target: NumberInput }) => {
							sceneItems.world.scene.config.directionalLight.intensity = target.value;
						}}"
					>
					</bim-number-input>

					<bim-number-input
						slider
						step="0.1"
						label="Ambient light intensity"
						value="1"
						min="0.1"
						max="5"
						@change="${({ target }: { target: NumberInput }) => {
							sceneItems.world.scene.config.ambientLight.intensity = target.value;
						}}"
					>
					</bim-number-input>
				</bim-panel-section>
				<bim-panel-section collapsed label="Grid">
					<bim-checkbox
						label="Grid visible"
						checked
						@change="${({ target }: { target: Checkbox }) => {
							sceneItems.grid.config.visible = target.value;
						}}"
					>
					</bim-checkbox>
					<bim-color-input
						label="Grid Color"
						color="#bbbbbb"
						@input="${({ target }: { target: ColorInput }) => {
							sceneItems.grid.config.color = new Color(target.color);
						}}"
					>
					</bim-color-input>
					<bim-number-input
						slider
						step="0.1"
						label="Grid primary size"
						value="1"
						min="0"
						max="10"
						@change="${({ target }: { target: NumberInput }) => {
							sceneItems.grid.config.primarySize = target.value;
						}}"
					>
					</bim-number-input>
					<bim-number-input
						slider
						step="0.1"
						label="Grid secondary size"
						value="10"
						min="0"
						max="20"
						@change="${({ target }: { target: NumberInput }) => {
							sceneItems.grid.config.secondarySize = target.value;
						}}"
					>
					</bim-number-input>
				</bim-panel-section>
			</bim-panel>
		`;
	});
};
