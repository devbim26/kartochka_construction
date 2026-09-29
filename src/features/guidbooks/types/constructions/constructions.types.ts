import type { NamedEntity } from '@core';
import type {
	ConstructionsAddSchemaType,
	ConstructionsEditSchemaType,
	ConstructionsFilterSchemaType,
	ConstructionTypeSchemaType,
	SubConstructionTypeSchemaType,
} from '@features/guidbooks/utils';
import type { Country } from '../country.types';
import type { ConstructionTypeEnum } from './construction-types.types';

export type ConstructionsAddData = ConstructionsAddSchemaType;
export type ConstructionsEditData = ConstructionsEditSchemaType;
export type ConstructionsFilterData = ConstructionsFilterSchemaType;
export type ConstructionType = ConstructionTypeSchemaType;
export type SubConstructionType = SubConstructionTypeSchemaType;

export type AlternateConstruction = {
	constructionId: string;
	constructionType: ConstructionTypeEnum;
	countries: Country[];
	description: string;
	id: string;
	descriptionSource: string;
	issuer: NamedEntity;
	issuerLogo: string | null;
	maxHeight: number;
	name: string;
	shortName: string;
	/** Лабораторный Rw из ответа alternativeConstructions */
	rLab: number | null;
	/** Оплачено ли размещение: false — базовая карточка без брендинга. */
	isPaidPlacement?: boolean;
};
