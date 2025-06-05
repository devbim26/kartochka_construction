import {
	UiControlPanelConstructorCallbacks,
	UiControlPanelConstructorSceneItems,
} from '@features/constructor/types';
import { CameraProjection, NavModeID } from '@thatopen/components';
import {
	Checkbox,
	ColorInput,
	Component,
	Dropdown,
	html,
	NumberInput,
	PanelSection,
} from '@thatopen/ui';
import { Color } from 'three';

export const uiControlPanelConstructor = (
	sceneItems: UiControlPanelConstructorSceneItems,
	callbacks: UiControlPanelConstructorCallbacks,
) => {
	return Component.create<PanelSection>(() => {
		return html`
			<bim-panel
				label="Control panel"
				class="options-menu"
				style="max-height: 600px; overflow-y: auto; color: #2175f3"
			>
				<bim-panel-section collapsed label="IFC File">
					<bim-button
						label="Load IFC"
						@click="${() => {
							callbacks.loadIfcFileHandler();
						}}"
					>
					</bim-button>
					<bim-button
						label="Delete model"
						@click="${() => {
							callbacks.disposeFragmentsHandler();
						}}"
					>
					</bim-button>
				</bim-panel-section>
				<bim-panel-section collapsed label="Commands">
					<bim-label>Double click: Create clipping plane</bim-label>
					<bim-label>Delete key: Delete clipping plane</bim-label>
				</bim-panel-section>
				<bim-panel-section collapsed label="Clipper">
					<bim-checkbox
						label="Clipper enabled"
						checked
						@change="${({ target }: { target: Checkbox }) => {
							sceneItems.clipper.enabled = target.value;
							sceneItems.edges.visible = target.value;
						}}"
					>
					</bim-checkbox>

					<bim-checkbox
						label="Clipper visible"
						checked
						@change="${({ target }: { target: Checkbox }) => {
							sceneItems.clipper.visible = target.value;
						}}"
					>
					</bim-checkbox>

					<bim-color-input
						label="Planes Color"
						color="#202932"
						@input="${({ target }: { target: ColorInput }) => {
							sceneItems.clipper.material.color.set(target.color);
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
							sceneItems.clipper.material.opacity = target.value;
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
							sceneItems.clipper.size = target.value;
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
				<bim-panel-section collapsed label="Camera">
					<bim-dropdown
						required
						label="Navigation mode"
						@change="${({ target }: { target: Dropdown }) => {
							const selected = target.value[0] as NavModeID;

							const { current } = sceneItems.world.camera.projection;
							const isOrtho = current === 'Orthographic';
							const isFirstPerson = selected === 'FirstPerson';
							if (isOrtho && isFirstPerson) {
								target.value[0] = sceneItems.world.camera.mode.id;
								return;
							}
							sceneItems.world.camera.set(selected);
						}}"
					>
						<bim-option checked label="Orbit"></bim-option>
						<bim-option label="FirstPerson"></bim-option>
						<bim-option label="Plan"></bim-option>
					</bim-dropdown>
					<bim-dropdown
						required
						label="Camera projection"
						@change="${({ target }: { target: Dropdown }) => {
							const selected = target.value[0] as CameraProjection;
							const isOrtho = selected === 'Orthographic';
							const isFirstPerson = sceneItems.world.camera.mode.id === 'FirstPerson';
							if (isOrtho && isFirstPerson) {
								target.value[0] = sceneItems.world.camera.projection.current;
								return;
							}
							sceneItems.world.camera.projection.set(selected);
						}}"
					>
						<bim-option checked label="Perspective"></bim-option>
						<bim-option label="Orthographic"></bim-option>
					</bim-dropdown>
					<bim-checkbox
						label="Allow user input"
						checked
						@change="${({ target }: { target: Checkbox }) => {
							sceneItems.world.camera.setUserInput(target.checked);
						}}"
					>
					</bim-checkbox>
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
