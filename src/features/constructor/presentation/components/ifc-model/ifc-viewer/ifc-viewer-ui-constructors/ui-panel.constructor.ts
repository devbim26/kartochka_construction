import { SimpleCamera, SimpleRenderer, SimpleScene, SimpleWorld } from '@thatopen/components';
import { ColorInput, Component, html, NumberInput, PanelSection } from '@thatopen/ui';
import { Color } from 'three';

export const uiPanelConstructor = (
	world: SimpleWorld<SimpleScene, SimpleCamera, SimpleRenderer>,
) => {
	return Component.create<PanelSection>(() => {
		return html`
			<bim-panel label="Worlds Tutorial" class="options-menu">
				<bim-panel-section collapsed label="Controls">
					<bim-color-input
						label="Background Color"
						color="#202932"
						@input="${({ target }: { target: ColorInput }) => {
							world.scene.config.backgroundColor = new Color(target.color);
						}}"
					>
					</bim-color-input>

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
				</bim-panel-section>
			</bim-panel>
		`;
	});
};
