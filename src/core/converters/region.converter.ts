import { Region as ServerRegion } from '@api-gen';
import { createDataRecordConverter } from '@core/utils/helpers';
import { Region as ClientRegion } from '@features/guidbooks/types';

export const regionMap = createDataRecordConverter({
	[ClientRegion.None]: ServerRegion.None,
	[ClientRegion.Albania]: ServerRegion.Albania,
	[ClientRegion.Andorra]: ServerRegion.Andorra,
	[ClientRegion.Austria]: ServerRegion.Austria,
	[ClientRegion.Belarus]: ServerRegion.Belarus,
	[ClientRegion.Belgium]: ServerRegion.Belgium,
	[ClientRegion.BosniaAndHerzegovina]: ServerRegion.BosniaAndHerzegovina,
	[ClientRegion.Bulgaria]: ServerRegion.Bulgaria,
	[ClientRegion.Croatia]: ServerRegion.Croatia,
	[ClientRegion.Cyprus]: ServerRegion.Cyprus,
	[ClientRegion.CzechRepublic]: ServerRegion.CzechRepublic,
	[ClientRegion.Denmark]: ServerRegion.Denmark,
	[ClientRegion.Estonia]: ServerRegion.Estonia,
	[ClientRegion.Finland]: ServerRegion.Finland,
	[ClientRegion.France]: ServerRegion.France,
	[ClientRegion.Germany]: ServerRegion.Germany,
	[ClientRegion.Greece]: ServerRegion.Greece,
	[ClientRegion.Hungary]: ServerRegion.Hungary,
	[ClientRegion.Iceland]: ServerRegion.Iceland,
	[ClientRegion.Ireland]: ServerRegion.Ireland,
	[ClientRegion.Italy]: ServerRegion.Italy,
	[ClientRegion.Latvia]: ServerRegion.Latvia,
	[ClientRegion.Lithuania]: ServerRegion.Lithuania,
	[ClientRegion.Luxembourg]: ServerRegion.Luxembourg,
	[ClientRegion.Malta]: ServerRegion.Malta,
	[ClientRegion.Moldova]: ServerRegion.Moldova,
	[ClientRegion.Monaco]: ServerRegion.Monaco,
	[ClientRegion.Montenegro]: ServerRegion.Montenegro,
	[ClientRegion.Netherlands]: ServerRegion.Netherlands,
	[ClientRegion.NorthMacedonia]: ServerRegion.NorthMacedonia,
	[ClientRegion.Norway]: ServerRegion.Norway,
	[ClientRegion.Poland]: ServerRegion.Poland,
	[ClientRegion.Portugal]: ServerRegion.Portugal,
	[ClientRegion.Romania]: ServerRegion.Romania,
	[ClientRegion.Russia]: ServerRegion.Russia,
	[ClientRegion.SanMarino]: ServerRegion.SanMarino,
	[ClientRegion.Serbia]: ServerRegion.Serbia,
	[ClientRegion.Slovakia]: ServerRegion.Slovakia,
	[ClientRegion.Slovenia]: ServerRegion.Slovenia,
	[ClientRegion.Spain]: ServerRegion.Spain,
	[ClientRegion.Sweden]: ServerRegion.Sweden,
	[ClientRegion.Switzerland]: ServerRegion.Switzerland,
	[ClientRegion.Ukrain]: ServerRegion.Ukrain,
});

export const convertToServerRegionData = (type: ClientRegion[]): ServerRegion[] => {
	return type.map((t) => regionMap.toServer[t]);
};

export const convertToClientRegionData = (type: ServerRegion[]): ClientRegion[] => {
	return type.map((t) => regionMap.toClient[t]);
};
