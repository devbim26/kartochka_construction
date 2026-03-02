import {
	Button,
	convertToBase64,
	dateMask,
	DeleteIcon,
	FormElementLabel,
	Input,
	useI18n,
} from '@core';
import type { FormReportSchemaType } from '@features/constructor/utils';
import { useMask } from '@react-input/mask';
import { useFormContext } from 'react-hook-form';

export const GeneralInfoForm = () => {
	const { setValue, watch, register } = useFormContext<FormReportSchemaType>();
	const dateRef = useMask(dateMask);
	const { t } = useI18n();

	const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
		const file = event.target.files?.[0];

		if (file) {
			const base64 = await convertToBase64(file);
			if (base64 && typeof base64 === 'string') {
				setValue('logo', file);
				setValue('logoValue', base64);
			}
		}
	};

	const logo = watch('logoValue');

	return (
		<div className="flex w-full justify-between">
			<div className="flex w-full flex-col items-center gap-[30px]">
				<p className="font-sans text-[18px]">{t('constructor.reportForm.generalInfo.titlePage')}</p>
				<div className="flex flex-col items-center justify-center gap-[13px]">
					<div className="flex w-full gap-[10px]">
						<FormElementLabel className="w-[110px] text-input-label-primary">
							{t('constructor.reportForm.generalInfo.reportNo')}
						</FormElementLabel>
						<Input
							wrapperClassName="flex-row items-center gap-[10px] "
							inputClassName="w-[300px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
							{...register('reportInfoId')}
							type={'number'}
							placeholder={t('constructor.reportForm.generalInfo.enterReportNo')}
							max={50}
						/>
					</div>
					<div className="flex w-full items-center justify-center gap-[10px]">
						<FormElementLabel className="w-[110px] text-input-label-primary">
							{t('constructor.reportForm.generalInfo.customer')}
						</FormElementLabel>
						<Input
							wrapperClassName="flex-row items-center gap-[10px]"
							inputClassName="w-[300px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
							{...register('customerName')}
							type={'text'}
							placeholder={t('constructor.reportForm.generalInfo.enterCustomer')}
							max={50}
						/>
					</div>
					<div className="flex w-full items-center justify-center gap-[10px]">
						<FormElementLabel className="w-[110px] text-input-label-primary">
							{t('constructor.reportForm.generalInfo.object')}
						</FormElementLabel>
						<Input
							wrapperClassName="flex-row items-center gap-[10px]"
							inputClassName="w-[300px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
							{...register('objectDescription')}
							type={'text'}
							placeholder={t('constructor.reportForm.generalInfo.enterObject')}
							max={50}
						/>
					</div>
					<div className="flex w-full items-center justify-center gap-[10px]">
						<FormElementLabel className="w-[110px] text-input-label-primary">
							{t('constructor.reportForm.generalInfo.project')}
						</FormElementLabel>
						<Input
							wrapperClassName="flex-row items-center gap-[10px]"
							inputClassName="w-[300px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
							{...register('projectName')}
							type={'text'}
							placeholder={t('constructor.reportForm.generalInfo.enterProject')}
							max={50}
						/>
					</div>
					<div className="flex w-full items-center justify-center gap-[10px]">
						<FormElementLabel className="w-[110px] text-input-label-primary">
							{t('constructor.reportForm.generalInfo.preparedBy')}
						</FormElementLabel>
						<Input
							wrapperClassName="flex-row items-center gap-[10px]"
							inputClassName="w-[300px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
							{...register('creatorFullName')}
							type={'text'}
							placeholder={t('constructor.reportForm.generalInfo.enterPreparedBy')}
							max={50}
						/>
					</div>
					<div className="flex w-full items-center justify-center gap-[10px]">
						<FormElementLabel className="w-[110px] text-input-label-primary">
							{t('constructor.reportForm.generalInfo.code')}
						</FormElementLabel>
						<Input
							wrapperClassName="flex-row items-center gap-[10px]"
							inputClassName="w-[300px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
							{...register('code')}
							type={'text'}
							placeholder={t('constructor.reportForm.generalInfo.enterCode')}
							max={50}
						/>
					</div>
					<div className="flex w-full items-center justify-center gap-[10px]">
						<FormElementLabel className="w-[110px] text-input-label-primary">
							{t('constructor.reportForm.generalInfo.city')}
						</FormElementLabel>
						<Input
							wrapperClassName="flex-row items-center gap-[10px]"
							inputClassName="w-[300px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
							{...register('country')}
							type={'text'}
							placeholder={t('constructor.reportForm.generalInfo.enterCity')}
							max={50}
						/>
					</div>
				</div>
				<div className="flex w-full items-center justify-center gap-[10px]">
					<FormElementLabel className="w-[110px] text-primary">
						{t('constructor.reportForm.generalInfo.project')}
					</FormElementLabel>
					<Input
						wrapperClassName="flex-row items-center gap-[10px]"
						inputClassName="w-[300px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
						{...register('commonProjectName')}
						value={watch('commonProjectName')}
						type={'text'}
						placeholder={t('constructor.reportForm.generalInfo.enterProject')}
						max={50}
					/>
				</div>
			</div>
			<div className="flex w-full flex-col items-center gap-[30px]">
				<p className="font-sans text-[18px]">{t('constructor.reportForm.generalInfo.protocol')}</p>
				<div className="flex flex-col items-center justify-center gap-[13px]">
					<div className="flex w-full items-center justify-center gap-[10px]">
						<FormElementLabel className="w-[110px] text-input-label-primary">
							{t('constructor.reportForm.generalInfo.director')}
						</FormElementLabel>
						<Input
							wrapperClassName="flex-row items-center gap-[10px]"
							inputClassName="w-[300px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
							{...register('director')}
							type={'text'}
							placeholder={t('constructor.reportForm.generalInfo.enterDirector')}
							max={50}
						/>
					</div>
					<div className="flex w-full items-center justify-center gap-[10px]">
						<FormElementLabel className="w-[110px] text-input-label-primary">
							{t('constructor.reportForm.generalInfo.date')}
						</FormElementLabel>
						<Input
							onChange={(event) => {
								setValue('date', event.target.value);
							}}
							value={watch('date')}
							inputClassName="w-[300px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
							placeholder={t('constructor.reportForm.generalInfo.enterDate')}
							max={10}
							ref={dateRef}
						/>
					</div>
					<div className="flex justify-center gap-[10px] pl-[40px]">
						<FormElementLabel className="w-[110px] text-input-label-primary">
							{t('constructor.reportForm.generalInfo.logo')}
						</FormElementLabel>

						{logo ? (
							<div className="flex h-fit w-[300px] items-center justify-center rounded-[8px] border border-input-border-primary p-[30px]">
								<img src={logo} alt="logo" />
							</div>
						) : (
							<div className="flex h-[100px] w-[300px] items-center justify-center rounded-[8px] border border-input-border-primary">
								<Button
									variant="primary"
									onClick={() => document.getElementById('file-upload')!.click()}
								>
									{t('constructor.reportForm.generalInfo.upload')}
								</Button>
							</div>
						)}
						<input
							type="file"
							id="file-upload"
							accept="image/*"
							onChange={handleFileChange}
							className="hidden"
						/>
						<DeleteIcon
							onClick={() => {
								setValue('logo', undefined);
								setValue('logoValue', '');
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};
