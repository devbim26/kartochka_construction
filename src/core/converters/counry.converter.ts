import { Country as ServerCountry } from '@api-gen/api';
import { createDataRecordConverter } from '@core/utils/helpers';
import { Country as ClientCountry } from '@features/guidbooks/types';

export const countryMap = createDataRecordConverter({
	[ClientCountry.None]: ServerCountry.None,
	[ClientCountry.Albania]: ServerCountry.Albania,
	[ClientCountry.Andorra]: ServerCountry.Andorra,
	[ClientCountry.Austria]: ServerCountry.Austria,
	[ClientCountry.Belarus]: ServerCountry.Belarus,
	[ClientCountry.Belgium]: ServerCountry.Belgium,
	[ClientCountry.BosniaAndHerzegovina]: ServerCountry.BosniaAndHerzegovina,
	[ClientCountry.Bulgaria]: ServerCountry.Bulgaria,
	[ClientCountry.Croatia]: ServerCountry.Croatia,
	[ClientCountry.Cyprus]: ServerCountry.Cyprus,
	[ClientCountry.CzechRepublic]: ServerCountry.CzechRepublic,
	[ClientCountry.Denmark]: ServerCountry.Denmark,
	[ClientCountry.Estonia]: ServerCountry.Estonia,
	[ClientCountry.Finland]: ServerCountry.Finland,
	[ClientCountry.France]: ServerCountry.France,
	[ClientCountry.Germany]: ServerCountry.Germany,
	[ClientCountry.Greece]: ServerCountry.Greece,
	[ClientCountry.Hungary]: ServerCountry.Hungary,
	[ClientCountry.Iceland]: ServerCountry.Iceland,
	[ClientCountry.Ireland]: ServerCountry.Ireland,
	[ClientCountry.Italy]: ServerCountry.Italy,
	[ClientCountry.Latvia]: ServerCountry.Latvia,
	[ClientCountry.Lithuania]: ServerCountry.Lithuania,
	[ClientCountry.Luxembourg]: ServerCountry.Luxembourg,
	[ClientCountry.Malta]: ServerCountry.Malta,
	[ClientCountry.Moldova]: ServerCountry.Moldova,
	[ClientCountry.Monaco]: ServerCountry.Monaco,
	[ClientCountry.Montenegro]: ServerCountry.Montenegro,
	[ClientCountry.Netherlands]: ServerCountry.Netherlands,
	[ClientCountry.NorthMacedonia]: ServerCountry.NorthMacedonia,
	[ClientCountry.Norway]: ServerCountry.Norway,
	[ClientCountry.Poland]: ServerCountry.Poland,
	[ClientCountry.Portugal]: ServerCountry.Portugal,
	[ClientCountry.Romania]: ServerCountry.Romania,
	[ClientCountry.Russia]: ServerCountry.Russia,
	[ClientCountry.SanMarino]: ServerCountry.SanMarino,
	[ClientCountry.Serbia]: ServerCountry.Serbia,
	[ClientCountry.Slovakia]: ServerCountry.Slovakia,
	[ClientCountry.Slovenia]: ServerCountry.Slovenia,
	[ClientCountry.Spain]: ServerCountry.Spain,
	[ClientCountry.Sweden]: ServerCountry.Sweden,
	[ClientCountry.Switzerland]: ServerCountry.Switzerland,
	[ClientCountry.Ukrain]: ServerCountry.Ukrain,
});

export const convertToServerCountryData = (
	type: ClientCountry | ClientCountry[],
): ServerCountry | ServerCountry[] => {
	if (Array.isArray(type)) {
		return type.map((t) => countryMap.toServer[t]);
	}
	return countryMap.toServer[type];
};

export const convertToClientCountryData = (
	type: ServerCountry | ServerCountry[],
): ClientCountry | ClientCountry[] => {
	if (Array.isArray(type)) {
		return type.map((t) => countryMap.toClient[t]);
	}
	return countryMap.toClient[type];
};
