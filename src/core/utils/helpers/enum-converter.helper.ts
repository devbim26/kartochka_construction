import { swap } from '.';

export interface CreateDataRecordConverter<T extends string, K extends string> {
	toClient: Record<K, T>;
	toServer: Record<T, K>;
}

/**
 * @desc Left field from client enum, right - from server enum.
 *
 * @example
 * const adBlockTypeMap = createDataRecordConverter({
 * 	[ClientAdBlockType.AdBlock]: AdBlockType.Adblock,
 * 	[ClientAdBlockType.PartnerAdBlock]: AdBlockType.Partneradblock,
 * 	[ClientAdBlockType.IntegratedEventsBlock]: AdBlockType.Integratedeventsblock,
 * });
 *
 * export const convertToServerAdBlockType = (adBlockType: ClientAdBlockType): AdBlockType => {
 * 	return adBlockTypeMap.toServer[adBlockType];
 * };
 *
 * export const convertToClientAdBlockType = (adBlockType: AdBlockType): ClientAdBlockType => {
 * 	return adBlockTypeMap.toClient[adBlockType];
 * };
 */
export const createDataRecordConverter = <T extends string, K extends string>(
	serverData: Record<T, K>,
): CreateDataRecordConverter<T, K> => {
	const reversed = swap(serverData);

	return {
		toClient: reversed,
		toServer: serverData,
	};
};
