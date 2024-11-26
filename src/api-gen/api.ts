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

export enum Country {
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

export interface CreateIssuerCommand {
	name: string | null;
	country?: Country;
	logoUrl?: string | null;
	webSite?: string | null;
}

export interface CreateMaterialCommand {
	name?: string | null;
	description?: string | null;
	/** @format float */
	density?: number;
	/** @format float */
	thickness?: number;
	region?: Region;
	/** @format uuid */
	issuerId?: string;
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

export interface CreateRequirementCommand {
	secondPlacementRoom?: string | null;
	firstPlacementRoom?: string | null;
	buildingType?: BuildingType;
	standartShortName?: string | null;
	standartFullName?: string | null;
	region?: Region;
	/** @format date */
	standartValidityPeriod?: string;
	class?: CategoryClass;
	/** @format float */
	noizeIsolationIndex?: number;
	/** @format float */
	noizeImpactIndex?: number;
	notice?: string | null;
}

export interface CreateUploadingUrlCommand {
	mimeType: string | null;
	isPublic: boolean;
}

export interface CreateUserCommand {
	phoneNumber?: string | null;
	companyName?: string | null;
	bankIdNumber?: string | null;
	payersRegistrationNumber?: string | null;
	paymentAccount?: string | null;
	bankAddress?: string | null;
	companyAddress?: string | null;
	directorFullName?: string | null;
	companyDescription?: string | null;
	additionalPhoneNumbers?: string[] | null;
	logoUrl?: string | null;
	password: string | null;
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

export interface GetIssuerWithPaginationParamsQuery {
	/** @format int32 */
	pageNumber?: number;
	/** @format int32 */
	pageSize?: number;
	sortOrder?: SortOrder;
	ordering?: string | null;
	name?: string | null;
	country?: Country;
	logo?: string | null;
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
}

export interface GetRequirementsWithPaginationParamsQuery {
	/** @format int32 */
	pageNumber?: number;
	/** @format int32 */
	pageSize?: number;
	sortOrder?: SortOrder;
	ordering?: string | null;
	region?: Region;
	buildingType?: BuildingType;
	placementRoom?: string | null;
}

export interface PasswordGrantFlow {
	phoneNumber: string | null;
	password: string | null;
}

export enum Region {
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

export interface SendSmsCommand {
	phoneNumber: string | null;
}

export enum SortOrder {
	Asc = 'Asc',
	Desc = 'Desc',
}

export interface UpdateIssuerCommand {
	/** @format uuid */
	id: string;
	name: string | null;
	country?: Country;
	logoUrl?: string | null;
	webSite?: string | null;
}

export interface UpdateMaterialCommand {
	/** @format uuid */
	id?: string;
	name?: string | null;
	description?: string | null;
	/** @format float */
	density?: number;
	/** @format float */
	thickness?: number;
	region?: Region;
	/** @format uuid */
	issuerId?: string;
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

export interface UpdateRequirementCommand {
	/** @format uuid */
	id?: string;
	secondPlacementRoom?: string | null;
	firstPlacementRoom?: string | null;
	buildingType?: BuildingType;
	standartShortName?: string | null;
	standartFullName?: string | null;
	region?: Region;
	/** @format date */
	standartValidityPeriod?: string;
	class?: CategoryClass;
	/** @format float */
	noizeIsolationIndex?: number;
	/** @format float */
	noizeImpactIndex?: number;
	notice?: string | null;
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
		accountRegisterCreate: (data: CreateUserCommand, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/Account/register`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
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
			this.request<void, any>({
				path: `/api/Account/current`,
				method: 'GET',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Account
		 * @name AccountUpdateUpdate
		 * @request PUT:/api/Account/update
		 */
		accountUpdateUpdate: (data: AccountDto, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/Account/update`,
				method: 'PUT',
				body: data,
				type: ContentType.Json,
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
		 * @tags File
		 * @name FileCreate
		 * @request POST:/api/File
		 */
		fileCreate: (data: CreateUploadingUrlCommand, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/File`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
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
			this.request<void, any>({
				path: `/api/Issuer/${id}`,
				method: 'GET',
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
			this.request<void, any>({
				path: `/api/Issuer/get-paginated`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Issuer
		 * @name IssuerCreate
		 * @request POST:/api/Issuer
		 */
		issuerCreate: (data: CreateIssuerCommand, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/Issuer`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
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
		issuerUpdate: (data: UpdateIssuerCommand, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/Issuer`,
				method: 'PUT',
				body: data,
				type: ContentType.Json,
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
			this.request<void, any>({
				path: `/api/Material/${id}`,
				method: 'GET',
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
			this.request<void, any>({
				path: `/api/Material/get-paginated`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Material
		 * @name MaterialCreate
		 * @request POST:/api/Material
		 */
		materialCreate: (data: CreateMaterialCommand, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/Material`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
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
		materialUpdate: (data: UpdateMaterialCommand, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/Material`,
				method: 'PUT',
				body: data,
				type: ContentType.Json,
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
			this.request<void, any>({
				path: `/api/Requirement/${id}`,
				method: 'GET',
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
			this.request<void, any>({
				path: `/api/Requirement/get-paginated`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
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
			this.request<void, any>({
				path: `/api/Requirement`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
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
			this.request<void, any>({
				path: `/api/Requirement`,
				method: 'PUT',
				body: data,
				type: ContentType.Json,
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
