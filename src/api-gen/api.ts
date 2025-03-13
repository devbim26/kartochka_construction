/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface AccountDto {
	companyName?: string | null;
	phoneNumber?: string | null;
	payersRegistrationNumber?: string | null;
	paymentAccount?: string | null;
	bankIdNumber?: string | null;
	directorFullName?: string | null;
	bankAddress?: string | null;
	companyAddress?: string | null;
	companyDescription?: string | null;
	additionalPhoneNumbers?: AdditionalPhoneNumber[] | null;
	logoUrl?: string | null;
}

export interface AdditionalPhoneNumber {
	/** @format uuid */
	id?: string;
	phoneNumber?: string | null;
}

export interface ApproveSmsCommand {
	phoneNumber?: string | null;
	code?: string | null;
}

export interface ArticleDto {
	/** @format uuid */
	id?: string;
	title?: string | null;
	bodyText?: string | null;
	/** @format date */
	publishDate?: string;
	imageUrl?: string | null;
}

export enum BuildingType {
	ResidentialBuildings = 'ResidentialBuildings',
	Hotel = 'Hotel',
	AdministrativeBuildings = 'AdministrativeBuildings',
	Hospital = 'Hospital',
	EducationalInstitutions = 'EducationalInstitutions',
	PreschoolEducationalInstitutions = 'PreschoolEducationalInstitutions',
}

export enum CategoryClass {
	General = 'General',
	A = 'A',
	B = 'B',
	C = 'C',
}

export enum ConstructionClass {
	Wall = 'Wall',
	Floor = 'Floor',
}

export interface ConstructionDto {
	constructionPosition?: ConstructionPosition;
	userMaterials?: UserMaterialDto[] | null;
}

export interface ConstructionHeaderDto {
	/** @format uuid */
	id?: string;
	name?: string | null;
	description?: string | null;
	priority?: Priority;
	countries?: CountryType[] | null;
	descriptionSource?: string | null;
	notation?: string | null;
	/** @format uuid */
	issuerId?: string;
	issuer?: Issuer;
	/** @format double */
	maxHeight?: number;
	propertySource?: string | null;
	fireResistance?: string | null;
	rTotal?: number[] | null;
	laboratoryTestSource?: string | null;
	index?: IndexType;
	/** @format float */
	laboratoryIndexValue?: number;
	constructionType?: ConstructionTypeDto;
	/** @format double */
	rw?: number;
	/** @format double */
	computingIndexValue?: number;
}

export enum ConstructionPosition {
	Left = 'Left',
	Center = 'Center',
	Right = 'Right',
}

export interface ConstructionRootTemplate {
	constructions?: ConstructionTemplate[] | null;
}

export interface ConstructionTemplate {
	position?: ConstructionPosition;
	subConstructions?: SubConstructionTemplate[] | null;
}

export interface ConstructionTypeDto {
	constructionTypeEnum?: ConstructionTypeEnum;
	constructions?: ConstructionDto[] | null;
}

export enum ConstructionTypeEnum {
	HeavySingleLayerWall = 'HeavySingleLayerWall',
	HeavySingleLayerWallFacingOneSide = 'HeavySingleLayerWallFacingOneSide',
	HeavySingleLayerWallFacingBothSide = 'HeavySingleLayerWallFacingBothSide',
}

export interface ConstructionTypeTemplate {
	name?: string | null;
	shortName?: string | null;
	constructionTypeEnum?: ConstructionTypeEnum;
	constructionRoot?: ConstructionRootTemplate;
}

export interface Country {
	/** @format uuid */
	id?: string;
	countryType?: CountryType;
}

export enum CountryType {
	None = 'None',
	Albania = 'Albania',
	Andorra = 'Andorra',
	Austria = 'Austria',
	Belarus = 'Belarus',
	Belgium = 'Belgium',
	BosniaAndHerzegovina = 'BosniaAndHerzegovina',
	Bulgaria = 'Bulgaria',
	Croatia = 'Croatia',
	Cyprus = 'Cyprus',
	CzechRepublic = 'CzechRepublic',
	Denmark = 'Denmark',
	Estonia = 'Estonia',
	Finland = 'Finland',
	France = 'France',
	Germany = 'Germany',
	Greece = 'Greece',
	Hungary = 'Hungary',
	Iceland = 'Iceland',
	Ireland = 'Ireland',
	Italy = 'Italy',
	Latvia = 'Latvia',
	Lithuania = 'Lithuania',
	Luxembourg = 'Luxembourg',
	Malta = 'Malta',
	Moldova = 'Moldova',
	Monaco = 'Monaco',
	Montenegro = 'Montenegro',
	Netherlands = 'Netherlands',
	NorthMacedonia = 'NorthMacedonia',
	Norway = 'Norway',
	Poland = 'Poland',
	Portugal = 'Portugal',
	Romania = 'Romania',
	Russia = 'Russia',
	SanMarino = 'SanMarino',
	Serbia = 'Serbia',
	Slovakia = 'Slovakia',
	Slovenia = 'Slovenia',
	Spain = 'Spain',
	Sweden = 'Sweden',
	Switzerland = 'Switzerland',
	Ukrain = 'Ukrain',
}

export interface CreateConstructionDto {
	constructionPosition?: ConstructionPosition;
	userMaterials?: CreateUserMaterialDto[] | null;
}

export interface CreateConstructionHeaderCommand {
	description?: string | null;
	priority?: Priority;
	countries?: CountryType[] | null;
	descriptionSource?: string | null;
	/** @format uuid */
	issuerId?: string;
	propertySource?: string | null;
	/** @format double */
	maxHeight?: number;
	fireResistance?: string | null;
	rTotal?: number[] | null;
	laboratoryTestSource?: string | null;
	index?: IndexType;
	/** @format float */
	indexValue?: number;
	constructionType?: CreateConstructionTypeDto;
}

export interface CreateConstructionTypeDto {
	constructionTypeEnum?: ConstructionTypeEnum;
	constructions?: CreateConstructionDto[] | null;
}

export interface CreateReportDto {
	reportNumber?: string | null;
	client?: string | null;
	description?: string | null;
	projectName?: string | null;
	engenierFullName?: string | null;
	city?: string | null;
	code?: string | null;
	/** @format uuid */
	constructionHeaderId?: string;
}

export interface CreateRequirementCommand {
	/** @format uuid */
	secondPlacementRoomId?: string;
	/** @format uuid */
	firstPlacementRoomId?: string;
	buildingType?: BuildingType;
	standartShortName?: string | null;
	standartFullName?: string | null;
	countryType?: CountryType;
	/** @format date */
	standartValidityPeriod?: string;
	class?: CategoryClass;
	/** @format float */
	noizeIsolationIndex?: number;
	/** @format float */
	noizeImpactIndex?: number | null;
	notice?: string | null;
	constructionClass?: ConstructionClass;
}

export interface CreateUserMaterialDto {
	/** @format uuid */
	materialId?: string;
	/** @format int32 */
	positionId?: number;
	materialTypeValue?: MaterialTypeValueDto[] | null;
}

export interface DeleteArticleCommand {
	/** @format uuid */
	articleId?: string;
}

export interface DeleteConstructionHeaderCommand {
	/** @format uuid */
	id?: string;
}

export interface DeleteIssuerCommand {
	/** @format uuid */
	id: string;
}

export interface DeleteMaterialCommand {
	/** @format uuid */
	id?: string;
}

export interface DeleteRequirementCommand {
	/** @format uuid */
	id?: string;
}

export interface GetArticlesWithPaginationParamsQuery {
	/** @format int32 */
	pageNumber?: number;
	/** @format int32 */
	pageSize?: number;
	sortOrder?: SortOrder;
	ordering?: string | null;
	title?: string | null;
	/** @format date */
	publishDate?: string | null;
}

export interface GetConstructionHeaderWithPaginationQuery {
	/** @format int32 */
	pageNumber?: number;
	/** @format int32 */
	pageSize?: number;
	sortOrder?: SortOrder;
	ordering?: string | null;
	name?: string | null;
	description?: string | null;
	constructionType?: ConstructionTypeEnum;
	countryType?: CountryType;
}

export interface GetIssuerWithPaginationParamsQuery {
	/** @format int32 */
	pageNumber?: number;
	/** @format int32 */
	pageSize?: number;
	sortOrder?: SortOrder;
	ordering?: string | null;
	name?: string | null;
	countryType?: CountryType;
	webSite?: string | null;
}

export interface GetMaterialsWithPaginationParamsQuery {
	/** @format int32 */
	pageNumber?: number;
	/** @format int32 */
	pageSize?: number;
	sortOrder?: SortOrder;
	ordering?: string | null;
	name?: string | null;
	/** @format float */
	density?: number | null;
	/** @format float */
	thickness?: number | null;
	materialTypeEnum?: MaterialTypeEnum;
}

export interface GetPalacementRoomVariantsWithTypesQuery {
	buildingType?: BuildingType;
	constructionType?: ConstructionClass;
}

export interface GetPlacementRoomVariantByAllParametersQuery {
	buildingType?: BuildingType;
	constructionType?: ConstructionClass;
	/** @format uuid */
	placementRoomId?: string;
}

export interface GetReportWithPaginationQuery {
	/** @format int32 */
	pageNumber?: number;
	/** @format int32 */
	pageSize?: number;
	sortOrder?: SortOrder;
	ordering?: string | null;
	name?: string | null;
	client?: string | null;
}

export interface GetRequirementsWithPaginationParamsQuery {
	/** @format int32 */
	pageNumber?: number;
	/** @format int32 */
	pageSize?: number;
	sortOrder?: SortOrder;
	ordering?: string | null;
	countryType?: CountryType;
	buildingType?: BuildingType;
	firstPlacementRoomName?: string | null;
	secondPlacementRoomName?: string | null;
	standartShortName?: string | null;
	standartFullName?: string | null;
	/** @format date */
	standartValidityPeriod?: string | null;
	class?: CategoryClass;
}

export enum IndexType {
	Rw = 'Rw',
	Lnw = 'Lnw',
	ValueΔRw = 'ΔRw',
}

export interface Issuer {
	/** @format uuid */
	id?: string;
	name?: string | null;
	countries?: Country[] | null;
	logoUrl?: string | null;
	webSite?: string | null;
}

export interface IssuerDto {
	/** @format uuid */
	id: string;
	name: string | null;
	countries?: CountryType[] | null;
	logoUrl?: string | null;
	webSite?: string | null;
}

export interface IssuerDtoPaginatedList {
	items?: IssuerDto[] | null;
	/** @format int32 */
	pageNumber?: number;
	/** @format int32 */
	totalPages?: number;
	/** @format int32 */
	totalCount?: number;
	/** @format int32 */
	pageSize?: number;
	hasPreviousPage?: boolean;
	hasNextPage?: boolean;
}

export interface MaterialDto {
	/** @format uuid */
	id?: string;
	publicId?: string | null;
	name?: string | null;
	shortName?: string | null;
	description?: string | null;
	/** @format float */
	density?: number;
	/** @format float */
	thickness?: number;
	materialType?: MaterialTypeEnum;
	type?: MaterialOriginType;
	countries?: CountryType[] | null;
	issuer?: IssuerDto;
	imageUrl?: string | null;
	/** @format float */
	materialCoefficient?: number;
	/** @format float */
	velocity?: number;
	/** @format float */
	lossFactor?: number;
	/** @format float */
	youngModulus?: number;
	/** @format float */
	damping?: number;
	/** @format float */
	solid?: number;
}

export enum MaterialOriginType {
	Generic = 'Generic',
	Manufacturer = 'Manufacturer',
	UserDefinedProduct = 'UserDefinedProduct',
}

export enum MaterialParametrs {
	Thickness = 'Thickness',
	Density = 'Density',
	ConnectionNumber = 'ConnectionNumber',
	RackStep = 'RackStep',
	Width = 'Width',
}

export interface MaterialTypeDto {
	/** @format uuid */
	id?: string;
	name?: string | null;
	shortName?: string | null;
	materialTypeEnum?: MaterialTypeEnum;
	materialTypeValues?: MaterialTypeValueDto[] | null;
	fullName?: string | null;
}

export enum MaterialTypeEnum {
	MasonryAndSolid = 'MasonryAndSolid',
	Frame = 'Frame',
	PorousMaterials = 'PorousMaterials',
	SandwichPanel = 'SandwichPanel',
	GypsumBondedbBoards = 'GypsumBondedbBoards',
	WoodBasedBoard = 'WoodBasedBoard',
	MineralBondedBoards = 'MineralBondedBoards',
	Metal = 'Metal',
	Glazing = 'Glazing',
	Membrane = 'Membrane',
	FoamMaterials = 'FoamMaterials',
	AcousticTreatmentMaterials = 'AcousticTreatmentMaterials',
	AirGap = 'AirGap',
	Link = 'Link',
	Filler = 'Filler',
	Heavy = 'Heavy',
	Board = 'Board',
}

export interface MaterialTypeValueDto {
	/** @format double */
	value?: number;
	materialParametrs?: MaterialParametrs;
}

export interface NamedEntity {
	/** @format uuid */
	id?: string;
	name?: string | null;
}

export interface PaginatedArticleDto {
	title?: string | null;
	bodyText?: string | null;
	/** @format date */
	publishDate?: string;
	imageUrl?: string | null;
}

export interface PaginatedArticleDtoPaginatedList {
	items?: PaginatedArticleDto[] | null;
	/** @format int32 */
	pageNumber?: number;
	/** @format int32 */
	totalPages?: number;
	/** @format int32 */
	totalCount?: number;
	/** @format int32 */
	pageSize?: number;
	hasPreviousPage?: boolean;
	hasNextPage?: boolean;
}

export interface PaginatedConstructionHeaderDto {
	/** @format uuid */
	id?: string;
	constructionId?: string | null;
	name?: string | null;
	descriptionSource?: string | null;
	/** @format double */
	maxHeight?: number;
	description?: string | null;
	countries?: CountryType[] | null;
	constructionType?: ConstructionTypeEnum;
	issuer?: NamedEntity;
	issuerLogo?: string | null;
}

export interface PaginatedConstructionHeaderDtoPaginatedList {
	items?: PaginatedConstructionHeaderDto[] | null;
	/** @format int32 */
	pageNumber?: number;
	/** @format int32 */
	totalPages?: number;
	/** @format int32 */
	totalCount?: number;
	/** @format int32 */
	pageSize?: number;
	hasPreviousPage?: boolean;
	hasNextPage?: boolean;
}

export interface PaginatedMaterialDto {
	/** @format uuid */
	id?: string;
	publicId?: string | null;
	name?: string | null;
	shortName?: string | null;
	description?: string | null;
	/** @format float */
	density?: number;
	/** @format float */
	thickness?: number;
	materialType?: MaterialTypeEnum;
	type?: MaterialOriginType;
	countries?: CountryType[] | null;
	imageUrl?: string | null;
	/** @format float */
	materialCoefficient?: number;
	/** @format float */
	velocity?: number;
	/** @format float */
	lossFactor?: number;
	/** @format float */
	youngModulus?: number;
	/** @format float */
	damping?: number;
	/** @format float */
	solid?: number;
}

export interface PaginatedMaterialDtoPaginatedList {
	items?: PaginatedMaterialDto[] | null;
	/** @format int32 */
	pageNumber?: number;
	/** @format int32 */
	totalPages?: number;
	/** @format int32 */
	totalCount?: number;
	/** @format int32 */
	pageSize?: number;
	hasPreviousPage?: boolean;
	hasNextPage?: boolean;
}

export interface PasswordGrantFlow {
	phoneNumber: string | null;
	password: string | null;
}

export interface PlacementRoomDto {
	/** @format uuid */
	id?: string;
	name?: string | null;
}

export enum Priority {
	Zero = 'Zero',
	One = 'One',
	Two = 'Two',
	Three = 'Three',
	Four = 'Four',
	Five = 'Five',
	Six = 'Six',
	Seven = 'Seven',
	Eight = 'Eight',
	Nine = 'Nine',
	Ten = 'Ten',
}

export interface ReportDto {
	/** @format uuid */
	id?: string;
	name?: string | null;
	client?: string | null;
	/** @format date */
	lastUpdated?: string;
	status?: ReportStatus;
	fileUrl?: string | null;
}

export interface ReportDtoPaginatedList {
	items?: ReportDto[] | null;
	/** @format int32 */
	pageNumber?: number;
	/** @format int32 */
	totalPages?: number;
	/** @format int32 */
	totalCount?: number;
	/** @format int32 */
	pageSize?: number;
	hasPreviousPage?: boolean;
	hasNextPage?: boolean;
}

export enum ReportStatus {
	None = 'None',
	ValueСonsideration = 'Сonsideration',
	Confirmed = 'Confirmed',
}

export interface RequirementDto {
	/** @format uuid */
	id?: string;
	secondPlacementRoom?: PlacementRoomDto;
	firstPlacementRoom?: PlacementRoomDto;
	buildingType?: BuildingType;
	standartShortName?: string | null;
	standartFullName?: string | null;
	countryType?: CountryType;
	/** @format date */
	standartValidityPeriod?: string;
	class?: CategoryClass;
	/** @format float */
	noizeIsolationIndex?: number;
	/** @format float */
	noizeImpactIndex?: number;
	notice?: string | null;
	constructionClass?: ConstructionClass;
}

export interface RequirementDtoPaginatedList {
	items?: RequirementDto[] | null;
	/** @format int32 */
	pageNumber?: number;
	/** @format int32 */
	totalPages?: number;
	/** @format int32 */
	totalCount?: number;
	/** @format int32 */
	pageSize?: number;
	hasPreviousPage?: boolean;
	hasNextPage?: boolean;
}

export interface SendSmsCommand {
	phoneNumber: string | null;
}

export enum SortOrder {
	Asc = 'Asc',
	Desc = 'Desc',
}

export interface SubConstructionTemplate {
	name?: string | null;
	userMaterials?: UserMaterialTemplate[] | null;
	subPosition?: ConstructionPosition;
}

export interface UpdateConstructionHeaderCommand {
	/** @format uuid */
	id?: string;
	name?: string | null;
	description?: string | null;
	priority?: Priority;
	countries?: CountryType[] | null;
	descriptionSource?: string | null;
	notation?: string | null;
	/** @format uuid */
	issuerId?: string;
	propertySource?: string | null;
	/** @format double */
	maxHeight?: number;
	fireResistance?: string | null;
	rTotal?: number[] | null;
	laboratoryTestSource?: string | null;
	index?: IndexType;
	/** @format float */
	indexValue?: number;
	constructionType?: CreateConstructionTypeDto;
}

export interface UpdateRequirementCommand {
	/** @format uuid */
	id?: string;
	/** @format uuid */
	secondPlacementRoomId?: string;
	/** @format uuid */
	firstPlacementRoomId?: string;
	buildingType?: BuildingType;
	standartShortName?: string | null;
	standartFullName?: string | null;
	countryType?: CountryType;
	/** @format date */
	standartValidityPeriod?: string;
	class?: CategoryClass;
	/** @format float */
	noizeIsolationIndex?: number;
	/** @format float */
	noizeImpactIndex?: number | null;
	notice?: string | null;
	constructionClass?: ConstructionClass;
}

export interface UserMaterialDto {
	/** @format uuid */
	materialId?: string;
	/** @format int32 */
	positionId?: number;
	materialTypeValue?: MaterialTypeValueDto[] | null;
}

export interface UserMaterialTemplate {
	/** @format uuid */
	materialId?: string;
	/** @format float */
	thickness?: number;
	/** @format float */
	density?: number;
}

import type {
	AxiosInstance,
	AxiosRequestConfig,
	AxiosResponse,
	HeadersDefaults,
	ResponseType,
} from 'axios';
import axios from 'axios';

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
	extends Omit<AxiosRequestConfig, 'data' | 'params' | 'url' | 'responseType'> {
	/** set parameter to `true` for call `securityWorker` for this request */
	secure?: boolean;
	/** request path */
	path: string;
	/** content type of request body */
	type?: ContentType;
	/** query params */
	query?: QueryParamsType;
	/** format of response (i.e. response.json() -> format: "json") */
	format?: ResponseType;
	/** request body */
	body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>;

export interface ApiConfig<SecurityDataType = unknown>
	extends Omit<AxiosRequestConfig, 'data' | 'cancelToken'> {
	securityWorker?: (
		securityData: SecurityDataType | null,
	) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
	secure?: boolean;
	format?: ResponseType;
}

export enum ContentType {
	Json = 'application/json',
	FormData = 'multipart/form-data',
	UrlEncoded = 'application/x-www-form-urlencoded',
	Text = 'text/plain',
}

export class HttpClient<SecurityDataType = unknown> {
	public instance: AxiosInstance;
	private securityData: SecurityDataType | null = null;
	private securityWorker?: ApiConfig<SecurityDataType>['securityWorker'];
	private secure?: boolean;
	private format?: ResponseType;

	constructor({
		securityWorker,
		secure,
		format,
		...axiosConfig
	}: ApiConfig<SecurityDataType> = {}) {
		this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || '' });
		this.secure = secure;
		this.format = format;
		this.securityWorker = securityWorker;
	}

	public setSecurityData = (data: SecurityDataType | null) => {
		this.securityData = data;
	};

	protected mergeRequestParams(
		params1: AxiosRequestConfig,
		params2?: AxiosRequestConfig,
	): AxiosRequestConfig {
		const method = params1.method || (params2 && params2.method);

		return {
			...this.instance.defaults,
			...params1,
			...(params2 || {}),
			headers: {
				...((method &&
					this.instance.defaults.headers[
						method.toLowerCase() as keyof HeadersDefaults
					]) ||
					{}),
				...(params1.headers || {}),
				...((params2 && params2.headers) || {}),
			},
		};
	}

	protected stringifyFormItem(formItem: unknown) {
		if (typeof formItem === 'object' && formItem !== null) {
			return JSON.stringify(formItem);
		} else {
			return `${formItem}`;
		}
	}

	protected createFormData(input: Record<string, unknown>): FormData {
		if (input instanceof FormData) {
			return input;
		}
		return Object.keys(input || {}).reduce((formData, key) => {
			const property = input[key];
			const propertyContent: any[] = property instanceof Array ? property : [property];

			for (const formItem of propertyContent) {
				const isFileType = formItem instanceof Blob || formItem instanceof File;
				formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
			}

			return formData;
		}, new FormData());
	}

	public request = async <T = any, _E = any>({
		secure,
		path,
		type,
		query,
		format,
		body,
		...params
	}: FullRequestParams): Promise<AxiosResponse<T>> => {
		const secureParams =
			((typeof secure === 'boolean' ? secure : this.secure) &&
				this.securityWorker &&
				(await this.securityWorker(this.securityData))) ||
			{};
		const requestParams = this.mergeRequestParams(params, secureParams);
		const responseFormat = format || this.format || undefined;

		if (type === ContentType.FormData && body && body !== null && typeof body === 'object') {
			body = this.createFormData(body as Record<string, unknown>);
		}

		if (type === ContentType.Text && body && body !== null && typeof body !== 'string') {
			body = JSON.stringify(body);
		}

		return this.instance.request({
			...requestParams,
			headers: {
				...(requestParams.headers || {}),
				...(type ? { 'Content-Type': type } : {}),
			},
			params: query,
			responseType: responseFormat,
			data: body,
			url: path,
		});
	};
}

/**
 * @title Acoustics.API
 * @version 1.0
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
	api = {
		/**
		 * No description
		 *
		 * @tags Account
		 * @name AccountRegisterCreate
		 * @request POST:/api/Account/register
		 */
		accountRegisterCreate: (
			data: {
				phoneNumber?: string;
				companyName?: string;
				bankIdNumber?: string;
				payersRegistrationNumber?: string;
				paymentAccount?: string;
				bankAddress?: string;
				companyAddress?: string;
				directorFullName?: string;
				companyDescription?: string;
				additionalPhoneNumbers?: string[];
				/** @format binary */
				formFile?: File;
				password: string;
			},
			params: RequestParams = {},
		) =>
			this.request<void, any>({
				path: `/api/Account/register`,
				method: 'POST',
				body: data,
				type: ContentType.FormData,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Account
		 * @name AccountCurrentList
		 * @request GET:/api/Account/current
		 */
		accountCurrentList: (params: RequestParams = {}) =>
			this.request<AccountDto, any>({
				path: `/api/Account/current`,
				method: 'GET',
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Account
		 * @name AccountUpdateUpdate
		 * @request PUT:/api/Account/update
		 */
		accountUpdateUpdate: (
			data: {
				companyName?: string;
				phoneNumber?: string;
				payersRegistrationNumber?: string;
				paymentAccount?: string;
				bankIdNumber?: string;
				directorFullName?: string;
				bankAddress?: string;
				companyAddress?: string;
				companyDescription?: string;
				additionalPhoneNumbers?: AdditionalPhoneNumber[];
				/** @format binary */
				formFile?: File;
			},
			params: RequestParams = {},
		) =>
			this.request<void, any>({
				path: `/api/Account/update`,
				method: 'PUT',
				body: data,
				type: ContentType.FormData,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Article
		 * @name ArticleDetail
		 * @request GET:/api/Article/{id}
		 */
		articleDetail: (id: string, params: RequestParams = {}) =>
			this.request<ArticleDto, any>({
				path: `/api/Article/${id}`,
				method: 'GET',
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Article
		 * @name ArticleDelete
		 * @request DELETE:/api/Article/{id}
		 */
		articleDelete: (id: string, data: DeleteArticleCommand, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/Article/${id}`,
				method: 'DELETE',
				body: data,
				type: ContentType.Json,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Article
		 * @name ArticleGetPaginatedCreate
		 * @request POST:/api/Article/getPaginated
		 */
		articleGetPaginatedCreate: (
			data: GetArticlesWithPaginationParamsQuery,
			params: RequestParams = {},
		) =>
			this.request<PaginatedArticleDtoPaginatedList, any>({
				path: `/api/Article/getPaginated`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Article
		 * @name ArticleCreate
		 * @request POST:/api/Article
		 */
		articleCreate: (
			data: {
				title?: string;
				bodyText?: string;
				/** @format date */
				publishDate?: string;
				/** @format binary */
				formFile?: File;
			},
			params: RequestParams = {},
		) =>
			this.request<ArticleDto, any>({
				path: `/api/Article`,
				method: 'POST',
				body: data,
				type: ContentType.FormData,
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Article
		 * @name ArticleUpdate
		 * @request PUT:/api/Article
		 */
		articleUpdate: (
			data: {
				/** @format uuid */
				id?: string;
				title?: string;
				bodyText?: string;
				/** @format date */
				publishDate?: string;
				/** @format binary */
				formFile?: File;
			},
			params: RequestParams = {},
		) =>
			this.request<void, any>({
				path: `/api/Article`,
				method: 'PUT',
				body: data,
				type: ContentType.FormData,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Auth
		 * @name AuthLoginCreate
		 * @request POST:/api/Auth/login
		 */
		authLoginCreate: (data: PasswordGrantFlow, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/Auth/login`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Auth
		 * @name AuthRefreshCreate
		 * @request POST:/api/Auth/refresh
		 */
		authRefreshCreate: (params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/Auth/refresh`,
				method: 'POST',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Auth
		 * @name AuthLogoutCreate
		 * @request POST:/api/Auth/logout
		 */
		authLogoutCreate: (params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/Auth/logout`,
				method: 'POST',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Construction
		 * @name ConstructionDetail
		 * @request GET:/api/Construction/{ConstructionHeaderId}
		 */
		constructionDetail: (constructionHeaderId: string, params: RequestParams = {}) =>
			this.request<ConstructionHeaderDto, any>({
				path: `/api/Construction/${constructionHeaderId}`,
				method: 'GET',
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Construction
		 * @name ConstructionConstructionTypesList
		 * @request GET:/api/Construction/ConstructionTypes
		 */
		constructionConstructionTypesList: (params: RequestParams = {}) =>
			this.request<ConstructionTypeTemplate[], any>({
				path: `/api/Construction/ConstructionTypes`,
				method: 'GET',
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Construction
		 * @name ConstructionGetPaginatedCreate
		 * @request POST:/api/Construction/get-paginated
		 */
		constructionGetPaginatedCreate: (
			data: GetConstructionHeaderWithPaginationQuery,
			params: RequestParams = {},
		) =>
			this.request<PaginatedConstructionHeaderDtoPaginatedList, any>({
				path: `/api/Construction/get-paginated`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Construction
		 * @name ConstructionCreate
		 * @request POST:/api/Construction
		 */
		constructionCreate: (data: CreateConstructionHeaderCommand, params: RequestParams = {}) =>
			this.request<ConstructionHeaderDto, any>({
				path: `/api/Construction`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Construction
		 * @name ConstructionDelete
		 * @request DELETE:/api/Construction
		 */
		constructionDelete: (data: DeleteConstructionHeaderCommand, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/Construction`,
				method: 'DELETE',
				body: data,
				type: ContentType.Json,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Construction
		 * @name ConstructionUpdate
		 * @request PUT:/api/Construction
		 */
		constructionUpdate: (data: UpdateConstructionHeaderCommand, params: RequestParams = {}) =>
			this.request<ConstructionHeaderDto, any>({
				path: `/api/Construction`,
				method: 'PUT',
				body: data,
				type: ContentType.Json,
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Issuer
		 * @name IssuerDetail
		 * @request GET:/api/Issuer/{id}
		 */
		issuerDetail: (id: string, params: RequestParams = {}) =>
			this.request<IssuerDto, any>({
				path: `/api/Issuer/${id}`,
				method: 'GET',
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Issuer
		 * @name IssuerGetPaginatedCreate
		 * @request POST:/api/Issuer/get-paginated
		 */
		issuerGetPaginatedCreate: (
			data: GetIssuerWithPaginationParamsQuery,
			params: RequestParams = {},
		) =>
			this.request<IssuerDtoPaginatedList, any>({
				path: `/api/Issuer/get-paginated`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Issuer
		 * @name IssuerCreate
		 * @request POST:/api/Issuer
		 */
		issuerCreate: (
			data: {
				name: string;
				countryTypes?: CountryType[];
				webSite?: string;
				/** @format binary */
				formFile?: File;
			},
			params: RequestParams = {},
		) =>
			this.request<IssuerDto, any>({
				path: `/api/Issuer`,
				method: 'POST',
				body: data,
				type: ContentType.FormData,
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Issuer
		 * @name IssuerDelete
		 * @request DELETE:/api/Issuer
		 */
		issuerDelete: (data: DeleteIssuerCommand, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/Issuer`,
				method: 'DELETE',
				body: data,
				type: ContentType.Json,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Issuer
		 * @name IssuerUpdate
		 * @request PUT:/api/Issuer
		 */
		issuerUpdate: (
			data: {
				/** @format uuid */
				id: string;
				name: string;
				countries?: CountryType[];
				webSite?: string;
				/** @format binary */
				formFile?: File;
			},
			params: RequestParams = {},
		) =>
			this.request<IssuerDto, any>({
				path: `/api/Issuer`,
				method: 'PUT',
				body: data,
				type: ContentType.FormData,
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Material
		 * @name MaterialDetail
		 * @request GET:/api/Material/{id}
		 */
		materialDetail: (id: string, params: RequestParams = {}) =>
			this.request<MaterialDto, any>({
				path: `/api/Material/${id}`,
				method: 'GET',
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Material
		 * @name MaterialGetPaginatedCreate
		 * @request POST:/api/Material/get-paginated
		 */
		materialGetPaginatedCreate: (
			data: GetMaterialsWithPaginationParamsQuery,
			params: RequestParams = {},
		) =>
			this.request<PaginatedMaterialDtoPaginatedList, any>({
				path: `/api/Material/get-paginated`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Material
		 * @name MaterialCreate
		 * @request POST:/api/Material
		 */
		materialCreate: (
			data: {
				name?: string;
				description?: string;
				shortName?: string;
				/** @format float */
				density?: number;
				/** @format float */
				thickness?: number;
				countryTypes?: CountryType[];
				/** @format uuid */
				issuerId?: string;
				/** @format binary */
				formFile?: File;
				/** @format float */
				materialCoefficient?: number;
				materialTypeEnum?: MaterialTypeEnum;
				/** @format float */
				velocity?: number;
				/** @format float */
				lossFactor?: number;
				/** @format float */
				youngModulus?: number;
				/** @format float */
				damping?: number;
				/** @format float */
				solid?: number;
			},
			params: RequestParams = {},
		) =>
			this.request<MaterialDto, any>({
				path: `/api/Material`,
				method: 'POST',
				body: data,
				type: ContentType.FormData,
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Material
		 * @name MaterialDelete
		 * @request DELETE:/api/Material
		 */
		materialDelete: (data: DeleteMaterialCommand, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/Material`,
				method: 'DELETE',
				body: data,
				type: ContentType.Json,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Material
		 * @name MaterialUpdate
		 * @request PUT:/api/Material
		 */
		materialUpdate: (
			data: {
				/** @format uuid */
				id?: string;
				name?: string;
				description?: string;
				/** @format float */
				density?: number;
				/** @format float */
				thickness?: number;
				countries?: CountryType[];
				/** @format uuid */
				issuerId?: string;
				materialTypeEnum?: MaterialTypeEnum;
				/** @format float */
				materialCoefficient?: number;
				/** @format float */
				velocity?: number;
				/** @format float */
				lossFactor?: number;
				/** @format float */
				youngModulus?: number;
				/** @format float */
				damping?: number;
				/** @format float */
				solid?: number;
				/** @format binary */
				formFile?: File;
			},
			params: RequestParams = {},
		) =>
			this.request<MaterialDto, any>({
				path: `/api/Material`,
				method: 'PUT',
				body: data,
				type: ContentType.FormData,
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags MaterialType
		 * @name MaterialTypeList
		 * @request GET:/api/MaterialType
		 */
		materialTypeList: (params: RequestParams = {}) =>
			this.request<MaterialTypeDto[], any>({
				path: `/api/MaterialType`,
				method: 'GET',
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags PlacementRoomVariants
		 * @name PlacementRoomVariantsCreate
		 * @request POST:/api/PlacementRoomVariants
		 */
		placementRoomVariantsCreate: (
			data: GetPalacementRoomVariantsWithTypesQuery,
			params: RequestParams = {},
		) =>
			this.request<void, any>({
				path: `/api/PlacementRoomVariants`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags PlacementRoomVariants
		 * @name PlacementRoomVariantsGetSecondRoomCreate
		 * @request POST:/api/PlacementRoomVariants/get-second-room
		 */
		placementRoomVariantsGetSecondRoomCreate: (
			data: GetPlacementRoomVariantByAllParametersQuery,
			params: RequestParams = {},
		) =>
			this.request<void, any>({
				path: `/api/PlacementRoomVariants/get-second-room`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Report
		 * @name ReportGetPaginatedCreate
		 * @request POST:/api/Report/get-paginated
		 */
		reportGetPaginatedCreate: (
			data: GetReportWithPaginationQuery,
			params: RequestParams = {},
		) =>
			this.request<ReportDtoPaginatedList, any>({
				path: `/api/Report/get-paginated`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Report
		 * @name ReportCreate
		 * @request POST:/api/Report
		 */
		reportCreate: (data: CreateReportDto, params: RequestParams = {}) =>
			this.request<ReportDto, any>({
				path: `/api/Report`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Requirement
		 * @name RequirementDetail
		 * @request GET:/api/Requirement/{id}
		 */
		requirementDetail: (id: string, params: RequestParams = {}) =>
			this.request<RequirementDto, any>({
				path: `/api/Requirement/${id}`,
				method: 'GET',
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Requirement
		 * @name RequirementGetPaginatedCreate
		 * @request POST:/api/Requirement/get-paginated
		 */
		requirementGetPaginatedCreate: (
			data: GetRequirementsWithPaginationParamsQuery,
			params: RequestParams = {},
		) =>
			this.request<RequirementDtoPaginatedList, any>({
				path: `/api/Requirement/get-paginated`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Requirement
		 * @name RequirementCreate
		 * @request POST:/api/Requirement
		 */
		requirementCreate: (data: CreateRequirementCommand, params: RequestParams = {}) =>
			this.request<RequirementDto, any>({
				path: `/api/Requirement`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Requirement
		 * @name RequirementDelete
		 * @request DELETE:/api/Requirement
		 */
		requirementDelete: (data: DeleteRequirementCommand, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/Requirement`,
				method: 'DELETE',
				body: data,
				type: ContentType.Json,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Requirement
		 * @name RequirementUpdate
		 * @request PUT:/api/Requirement
		 */
		requirementUpdate: (data: UpdateRequirementCommand, params: RequestParams = {}) =>
			this.request<RequirementDto, any>({
				path: `/api/Requirement`,
				method: 'PUT',
				body: data,
				type: ContentType.Json,
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Sms
		 * @name PostApi
		 * @request POST:/api/Sms
		 */
		postApi: (data: SendSmsCommand, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/Sms`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Sms
		 * @name SmsApproveCreate
		 * @request POST:/api/Sms/approve
		 */
		smsApproveCreate: (data: ApproveSmsCommand, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/Sms/approve`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				...params,
			}),
	};
}
