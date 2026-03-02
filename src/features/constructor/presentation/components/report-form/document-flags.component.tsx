import { Chevron, FormElementLabel, Switch, useI18n } from '@core';
import type { FormReportSchemaType } from '@features/constructor/utils';
import { useState } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

export const DocumentFlags = () => {
	const { setValue, control, watch } = useFormContext<FormReportSchemaType>();
	const [showGeneralInfo, setShowGeneralInfo] = useState(true);
	const [showSoundInfo, setShowSoundInfo] = useState(true);

	const [showThermalInfo, setShowThermalInfo] = useState(true);
	const { t } = useI18n();

	const generalCharacteristics = watch('floorDocumentFlags.generalCharacteristics');
	const isGeneralEnabled =
		generalCharacteristics?.takeFloorMaterialsVolumesCalculation ||
		generalCharacteristics?.takeRoomCharacteristic ||
		generalCharacteristics?.takeWallMaterialsVolumesCalculation;

	const soundBaseReportInfoFlags = useWatch({
		control,
		name: 'floorDocumentFlags.soundInsulationCalculation.baseReportInfoFlags',
	});
	const thermalBaseReportInfoFlags = useWatch({
		control,
		name: 'floorDocumentFlags.thermalInsulationCalculation.baseReportInfoFlags',
	});

	return (
		<div className="flex w-full flex-col gap-[20px] px-[300px] font-semibold">
			<div className="flex w-full items-center justify-start gap-[10px]">
				<FormElementLabel className="w-[120px] text-[#383838]">
					{t('constructor.reportForm.docs.titleList')}
				</FormElementLabel>
				<Controller
					control={control}
					name="floorDocumentFlags.takeTitleList"
					render={({ field }) => (
						<Switch
							onChange={(isEnabled) => {
								field.onChange(isEnabled);
							}}
						/>
					)}
				/>
			</div>
			<div className="flex w-full items-center justify-start gap-[10px]">
				<FormElementLabel className="w-[120px] text-[#383838]">
					{t('constructor.reportForm.docs.contents')}
				</FormElementLabel>
				<Controller
					control={control}
					name="floorDocumentFlags.takeContent"
					render={({ field }) => (
						<Switch
							onChange={(isEnabled) => {
								field.onChange(isEnabled);
							}}
						/>
					)}
				/>
			</div>
			<div className="flex w-full items-center justify-start gap-[10px]">
				<FormElementLabel className="w-[120px] text-[#383838]">
					{t('constructor.reportForm.docs.introduction')}
				</FormElementLabel>
				<Controller
					control={control}
					name="floorDocumentFlags.takeIntroduction"
					render={({ field }) => (
						<Switch
							onChange={(isEnabled) => {
								field.onChange(isEnabled);
							}}
						/>
					)}
				/>
			</div>
			<div className="flex w-full items-center justify-start gap-[10px]">
				<FormElementLabel className="w-[200px] text-[#383838]">
					{t('constructor.reportForm.docs.general.section')}
				</FormElementLabel>
				<Switch
					isEnabledProp={isGeneralEnabled}
					onChange={(isEnabled) => {
						setValue('floorDocumentFlags.generalCharacteristics', {
							takeFloorMaterialsVolumesCalculation: isEnabled,
							takeRoomCharacteristic: isEnabled,
							takeWallMaterialsVolumesCalculation: isEnabled,
						});
					}}
				/>
				<Chevron
					color="#383838"
					className="pl-[50px]"
					direction={showGeneralInfo ? 'down' : 'up'}
					onClick={() => setShowGeneralInfo(!showGeneralInfo)}
				/>
			</div>
			{showGeneralInfo && (
				<div className="flex w-full flex-col gap-[20px] pl-[50px] font-semibold text-input-label-primary">
					<div className="flex w-full items-center justify-start gap-[10px]">
						<FormElementLabel className="w-[350px]">
							{t('constructor.reportForm.docs.general.room')}
						</FormElementLabel>
						<Controller
							control={control}
							name="floorDocumentFlags.generalCharacteristics.takeRoomCharacteristic"
							render={({ field }) => (
								<Switch
									isEnabledProp={watch(
										'floorDocumentFlags.generalCharacteristics.takeRoomCharacteristic',
									)}
									onChange={(isEnabled) => {
										field.onChange(isEnabled);
									}}
								/>
							)}
						/>
					</div>
					<div className="flex w-full items-center justify-start gap-[10px]">
						<FormElementLabel className="w-[350px]">
							{t('constructor.reportForm.docs.general.wallVolumes')}
						</FormElementLabel>
						<Controller
							control={control}
							name="floorDocumentFlags.generalCharacteristics.takeWallMaterialsVolumesCalculation"
							render={({ field }) => (
								<Switch
									isEnabledProp={watch(
										'floorDocumentFlags.generalCharacteristics.takeWallMaterialsVolumesCalculation',
									)}
									onChange={(isEnabled) => {
										field.onChange(isEnabled);
									}}
								/>
							)}
						/>
					</div>
					<div className="flex w-full items-center justify-start gap-[10px]">
						<FormElementLabel className="w-[350px]">
							{t('constructor.reportForm.docs.general.floorVolumes')}
						</FormElementLabel>
						<Controller
							control={control}
							name="floorDocumentFlags.generalCharacteristics.takeFloorMaterialsVolumesCalculation"
							render={({ field }) => (
								<Switch
									isEnabledProp={watch(
										'floorDocumentFlags.generalCharacteristics.takeFloorMaterialsVolumesCalculation',
									)}
									onChange={(isEnabled) => {
										field.onChange(isEnabled);
									}}
								/>
							)}
						/>
					</div>
				</div>
			)}
			<div className="flex w-full items-center justify-start gap-[10px]">
				<FormElementLabel className="w-[400px] text-[#383838]">
					{t('constructor.reportForm.docs.sound.section')}
				</FormElementLabel>
				<Switch
					isEnabledProp={isGeneralEnabled}
					onChange={(isEnabled) => {
						setValue('floorDocumentFlags.soundInsulationCalculation', {
							takeEnclosingStructuresSoundInsulationCalculation: isEnabled,
						});
					}}
				/>
				<Chevron
					color="#383838"
					className="pl-[50px]"
					direction={showGeneralInfo ? 'down' : 'up'}
					onClick={() => setShowSoundInfo(!showSoundInfo)}
				/>
			</div>
			{showSoundInfo && (
				<>
					<div className="flex w-full flex-col gap-[20px] pl-[50px] font-semibold text-input-label-primary">
						<div className="flex w-full items-center justify-start gap-[10px]">
							<FormElementLabel className="w-[350px]">
								{t('constructor.reportForm.docs.sound.calc')}
							</FormElementLabel>
							<Controller
								control={control}
								name="floorDocumentFlags.soundInsulationCalculation.takeEnclosingStructuresSoundInsulationCalculation"
								render={({ field }) => (
									<Switch
										isEnabledProp={watch(
											'floorDocumentFlags.soundInsulationCalculation.takeEnclosingStructuresSoundInsulationCalculation',
										)}
										onChange={(isEnabled) => {
											field.onChange(isEnabled);
										}}
									/>
								)}
							/>
						</div>
					</div>
					<div className="flex w-full flex-col gap-[20px] pl-[100px] font-semibold text-input-label-primary">
						{soundBaseReportInfoFlags?.map((baseFlag, baseIndex) => {
							return (
								<>
									<div
										key={baseFlag.floorNumber}
										className="flex w-full items-center justify-start gap-[10px]"
									>
										<FormElementLabel className="w-[350px]">
											{`2.1.${baseIndex + 1} ${t('constructor.reportForm.docs.sound.constructionsAt')} ${baseFlag.floorNumber}.000`}
										</FormElementLabel>
										<Controller
											control={control}
											name="floorDocumentFlags.soundInsulationCalculation.takeEnclosingStructuresSoundInsulationCalculation"
											render={({ field }) => (
												<Switch
													isEnabledProp={watch(
														'floorDocumentFlags.soundInsulationCalculation.takeEnclosingStructuresSoundInsulationCalculation',
													)}
													onChange={(isEnabled) => {
														field.onChange(isEnabled);
													}}
												/>
											)}
										/>
									</div>
									{baseFlag.namedConstructionFlags?.map((namedConst, index) => {
										return (
											<>
												<div
													key={namedConst.reportConstructionId}
													className="flex w-full items-center justify-start gap-[10px]"
												>
													<FormElementLabel className="w-[350px]">
														{`2.1.${baseIndex + 1}.${index + 1} ${t('constructor.reportForm.docs.sound.construction')} ${namedConst.constructionName}`}
													</FormElementLabel>
													<Controller
														control={control}
														name="floorDocumentFlags.soundInsulationCalculation.takeEnclosingStructuresSoundInsulationCalculation"
														render={({ field }) => (
															<Switch
																isEnabledProp={watch(
																	'floorDocumentFlags.soundInsulationCalculation.takeEnclosingStructuresSoundInsulationCalculation',
																)}
																onChange={(isEnabled) => {
																	field.onChange(isEnabled);
																}}
															/>
														)}
													/>
												</div>
												<div className="flex w-full items-center justify-start gap-[10px] pl-[80px]">
													<FormElementLabel className="w-[350px]">
														{`2.1.${baseIndex + 1}.${index + 1}.1 ${t('constructor.reportForm.docs.sound.calcItem')}`}
													</FormElementLabel>
													<Controller
														control={control}
														name="floorDocumentFlags.soundInsulationCalculation.takeEnclosingStructuresSoundInsulationCalculation"
														render={({ field }) => (
															<Switch
																isEnabledProp={watch(
																	'floorDocumentFlags.soundInsulationCalculation.takeEnclosingStructuresSoundInsulationCalculation',
																)}
																onChange={(isEnabled) => {
																	field.onChange(isEnabled);
																}}
															/>
														)}
													/>
												</div>
												<div className="flex w-full items-center justify-start gap-[10px] pl-[80px]">
													<FormElementLabel className="w-[350px]">
														{`2.1.${baseIndex + 1}.${index + 1}.2 ${t('constructor.reportForm.docs.sound.labAnalysis')}`}
													</FormElementLabel>
													<Controller
														control={control}
														name="floorDocumentFlags.soundInsulationCalculation.takeEnclosingStructuresSoundInsulationCalculation"
														render={({ field }) => (
															<Switch
																isEnabledProp={watch(
																	'floorDocumentFlags.soundInsulationCalculation.takeEnclosingStructuresSoundInsulationCalculation',
																)}
																onChange={(isEnabled) => {
																	field.onChange(isEnabled);
																}}
															/>
														)}
													/>
												</div>
											</>
										);
									})}
								</>
							);
						})}
					</div>
				</>
			)}
			<div className="flex w-full items-center justify-start gap-[10px]">
				<FormElementLabel className="w-[400px] text-[#383838]">
					{t('constructor.reportForm.docs.thermal.section')}
				</FormElementLabel>
				<Switch
					isEnabledProp={isGeneralEnabled}
					onChange={(isEnabled) => {
						setValue(
							'floorDocumentFlags.thermalInsulationCalculation.takeDetailedCalculatingMethod',
							isEnabled,
						);
					}}
				/>
				<Chevron
					color="#383838"
					className="pl-[50px]"
					direction={showGeneralInfo ? 'down' : 'up'}
					onClick={() => setShowThermalInfo(!showThermalInfo)}
				/>
			</div>
			{showThermalInfo && (
				<>
					<div className="flex w-full flex-col gap-[20px] pl-[50px] font-semibold text-input-label-primary">
						<div className="flex w-full items-center justify-start gap-[10px]">
							<FormElementLabel className="w-[350px]">
								{t('constructor.reportForm.docs.thermal.detailMethod')}
							</FormElementLabel>
							<Controller
								control={control}
								name="floorDocumentFlags.thermalInsulationCalculation.takeDetailedCalculatingMethod"
								render={({ field }) => (
									<Switch
										isEnabledProp={watch(
											'floorDocumentFlags.thermalInsulationCalculation.takeDetailedCalculatingMethod',
										)}
										onChange={(isEnabled) => {
											field.onChange(isEnabled);
										}}
									/>
								)}
							/>
						</div>
					</div>
					<div className="flex w-full flex-col gap-[20px] pl-[100px] font-semibold text-input-label-primary">
						{thermalBaseReportInfoFlags?.map((baseFlag, baseIndex) => {
							return (
								<div
									key={baseFlag.floorNumber}
									className="flex flex-col gap-[20px]"
								>
									<div className="flex w-full items-center justify-start gap-[10px]">
										<FormElementLabel className="w-[350px]">
											{`3.1.${baseIndex + 1} ${t('constructor.reportForm.docs.thermal.constructionsAt')} ${baseFlag.floorNumber}.000`}
										</FormElementLabel>
										<Controller
											control={control}
											name="floorDocumentFlags.soundInsulationCalculation.takeEnclosingStructuresSoundInsulationCalculation"
											render={({ field }) => (
												<Switch
													isEnabledProp={watch(
														'floorDocumentFlags.soundInsulationCalculation.takeEnclosingStructuresSoundInsulationCalculation',
													)}
													onChange={(isEnabled) => {
														field.onChange(isEnabled);
													}}
												/>
											)}
										/>
									</div>
									{baseFlag.namedConstructionFlags?.map((namedConst, index) => {
										return (
											<div
												key={namedConst.reportConstructionId}
												className="flex flex-col gap-[20px]"
											>
												<div className="flex w-full items-center justify-start gap-[10px]">
													<FormElementLabel className="w-[350px]">
														{`3.1.${baseIndex + 1}.${index + 1} ${t('constructor.reportForm.docs.thermal.construction')} ${namedConst.constructionName}`}
													</FormElementLabel>
													<Controller
														control={control}
														name="floorDocumentFlags.soundInsulationCalculation.takeEnclosingStructuresSoundInsulationCalculation"
														render={({ field }) => (
															<Switch
																isEnabledProp={watch(
																	'floorDocumentFlags.soundInsulationCalculation.takeEnclosingStructuresSoundInsulationCalculation',
																)}
																onChange={(isEnabled) => {
																	field.onChange(isEnabled);
																}}
															/>
														)}
													/>
												</div>
											</div>
										);
									})}
								</div>
							);
						})}
					</div>
				</>
			)}
			<div className="flex w-full items-center justify-start gap-[10px]">
				<FormElementLabel className="w-[120px] text-[#383838]">
					{t('constructor.reportForm.docs.conclusion')}
				</FormElementLabel>
				<Controller
					control={control}
					name="floorDocumentFlags.takeConclusion"
					render={({ field }) => (
						<Switch
							onChange={(isEnabled) => {
								field.onChange(isEnabled);
							}}
						/>
					)}
				/>
			</div>
			<div className="flex w-full items-center justify-start gap-[10px]">
				<FormElementLabel className="w-[250px] text-[#383838]">
					{t('constructor.reportForm.docs.literature')}
				</FormElementLabel>
				<Controller
					control={control}
					name="floorDocumentFlags.takeUsedLiteratureList"
					render={({ field }) => (
						<Switch
							onChange={(isEnabled) => {
								field.onChange(isEnabled);
							}}
						/>
					)}
				/>
			</div>
			<div className="flex w-full items-center justify-start gap-[10px]">
				<FormElementLabel className="w-[410px] text-[#383838]">
					{t('constructor.reportForm.docs.appendix1')}
				</FormElementLabel>
				<Controller
					control={control}
					name="floorDocumentFlags.takeSupplementSoundInsulationProtocolsWithCalculation"
					render={({ field }) => (
						<Switch
							onChange={(isEnabled) => {
								field.onChange(isEnabled);
							}}
						/>
					)}
				/>
			</div>
			<div className="flex w-full items-center justify-start gap-[10px]">
				<FormElementLabel className="w-[410px] text-[#383838]">
					{t('constructor.reportForm.docs.appendix2')}
				</FormElementLabel>
				<Controller
					control={control}
					name="floorDocumentFlags.takeSupplementThermalInsulationProtocolsWithCalculation"
					render={({ field }) => (
						<Switch
							onChange={(isEnabled) => {
								field.onChange(isEnabled);
							}}
						/>
					)}
				/>
			</div>
		</div>
	);
};
