import {
	SimpleCamera,
	SimpleGrid,
	SimpleRenderer,
	SimpleScene,
	SimpleWorld,
} from '@thatopen/components';
import { Checkbox, ColorInput, Component, html, NumberInput, PanelSection } from '@thatopen/ui';
import { Color } from 'three';

export const uiControlPanelConstructor = (
	world: SimpleWorld<SimpleScene, SimpleCamera, SimpleRenderer>,
	grid: SimpleGrid,
) => {
	return Component.create<PanelSection>(() => {
		return html`
			<bim-panel label="Control panel" class="options-menu">
				<bim-panel-section collapsed label="Controls">
					<bim-number-input
						slider
						step="0.1"
						label="Directional lights intensity"
						value="1.5"
						min="0.1"
						max="10"
						@change="${({ target }: { target: NumberInput }) => {
							world.scene.config.directionalLight.intensity = target.value;
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
							world.scene.config.ambientLight.intensity = target.value;
						}}"
					>
					</bim-number-input>
					<bim-checkbox
						label="Grid visible"
						checked
						@change="${({ target }: { target: Checkbox }) => {
							grid.config.visible = target.value;
						}}"
					>
					</bim-checkbox>

					<bim-color-input
						label="Grid Color"
						color="#bbbbbb"
						@input="${({ target }: { target: ColorInput }) => {
							grid.config.color = new Color(target.color);
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
							grid.config.primarySize = target.value;
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
							grid.config.secondarySize = target.value;
						}}"
					>
					</bim-number-input>
				</bim-panel-section>
			</bim-panel>
		`;
	});
};
