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
	/** @format uuid */
	id?: string;
	email?: string | null;
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
	role?: UserRole;
	/** @format int32 */
	reportsNumber?: number;
	/** @format int32 */
	dowloadReportsNumber?: number;
	/** @format double */
	budgetRemaining?: number;
}

export interface AcousticModelDto {
	name?: string | null;
	/** @format double */
	coefficient?: number;
	openRouterModelId?: string | null;
}

export interface AdditionalConstructionHeaderDto {
	constructionHeader?: ConstructionHeaderDto;
	/** @format double */
	lenght?: number;
	/** @format double */
	height?: number;
	/** @format int32 */
	quantity?: number;
}

export interface AdditionalGraphParametersDto {
	/** @format double */
	delta?: number;
	/** @format double */
	c?: number;
	/** @format double */
	ctr?: number;
	/** @format double */
	computingRw?: number;
	/** @format double */
	computingLw?: number;
	laboratoryIndexType?: IndexType;
	/** @format float */
	laboratoryIndexValue?: number;
	/** @format double */
	laboratoryDelta?: number;
	/** @format double */
	laboratoryC?: number;
	/** @format double */
	laboratoryCtr?: number;
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

export interface Attachment {
	name?: string | null;
	url?: string | null;
}

export interface BillDto {
	/** @format uuid */
	id?: string;
	/** @format int64 */
	number?: number;
	/** @format date */
	date?: string;
	clientName?: string | null;
	billType?: BillTypeEnum;
	fileUrl?: string | null;
	/** @format uuid */
	userId?: string;
	subscriptionName?: string | null;
}

export interface BillDtoPaginatedList {
	items?: BillDto[] | null;
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

export enum BillTypeEnum {
	UnPaid = 'UnPaid',
	Paid = 'Paid',
}

export enum BuildingType {
	ResidentialBuildings = 'ResidentialBuildings',
	Hotel = 'Hotel',
	AdministrativeBuildings = 'AdministrativeBuildings',
	Hospital = 'Hospital',
	EducationalInstitutions = 'EducationalInstitutions',
	PreschoolEducationalInstitutions = 'PreschoolEducationalInstitutions',
	ResearchAndPublicBuildings = 'ResearchAndPublicBuildings',
	BowlingAlleys = 'BowlingAlleys',
}

export interface CalculationRequirementDocumentDto {
	/** @format uuid */
	id?: string;
	country?: CountryType;
	shortName?: string | null;
	fullName?: string | null;
}

export enum CategoryClass {
	General = 'General',
	A = 'A',
	B = 'B',
	C = 'C',
}

export interface ConstructionAdditionalInfoDto {
	suppliers?: string[] | null;
	standartName?: string | null;
	composition?: string[] | null;
	features?: string[] | null;
	physicalCharacteristics?: string[] | null;
	fireSafetyAndMore?: string[] | null;
	installation?: string[] | null;
	fileUrls?: Attachment[] | null;
	imageUrls?: Attachment[] | null;
}

export interface ConstructionAdditionalInfoForReportDto {
	suppliers?: string[] | null;
	standartName?: string | null;
	composition?: string[] | null;
	features?: string[] | null;
	physicalCharacteristics?: string[] | null;
	fireSafetyAndMore?: string[] | null;
	installation?: string[] | null;
	fileUrls?: Attachment[] | null;
	imageUrls?: Attachment[] | null;
	issuerName?: string | null;
	issuerImage?: string | null;
	constructionType?: ConstructionTypeEnum;
	firstRoomName?: string | null;
	secondRoomName?: string | null;
	/** @format double */
	length?: number;
	/** @format double */
	width?: number;
	/** @format double */
	square?: number;
	/** @format double */
	totalThickness?: number;
	/** @format double */
	totalMass?: number;
	isHaveAdditionalConstruction?: boolean;
	/** @format double */
	rw?: number;
	graphImage?: string | null;
}

export interface ConstructionBase {
	constructions?: ConstructionTemplate[] | null;
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
	constructionPurpose?: ConstructionPurpose;
	isViewForDefaultUser?: boolean;
	/** @format double */
	maxHeight?: number;
	propertySource?: string | null;
	fireResistance?: string | null;
	airNoiseLaboratoryData?: ConstructionLaboratoryDataDto;
	impactNoiseLaboratoryData?: ConstructionLaboratoryDataDto;
	constructionType?: ConstructionTypeDto;
	/** @format double */
	rw?: number | null;
	/** @format double */
	computingIndexValue?: number;
	isReportConstruction?: boolean;
}

export interface ConstructionLaboratoryDataDto {
	rTotals?: RTotalDto[] | null;
	index?: IndexType;
	/** @format float */
	indexValue?: number;
	laboratoryTestSource?: string | null;
	/** @format double */
	laboratoryC?: number;
	/** @format double */
	laboratoryCtr?: number;
	/** @format double */
	laboratoryDelta?: number;
}

export enum ConstructionPosition {
	Left = 'Left',
	Center = 'Center',
	Right = 'Right',
}

export enum ConstructionPurpose {
	Soundproofing = 'Soundproofing',
	Acoustic = 'Acoustic',
	ThermalInsulation = 'ThermalInsulation',
}

export interface ConstructionTemplate {
	constructionPosition?: ConstructionPosition;
	materialTypes?: MaterialType[] | null;
}

export interface ConstructionTypeDto {
	constructionTypeEnum?: ConstructionTypeEnum;
	constructions?: ConstructionDto[] | null;
}

export enum ConstructionTypeEnum {
	HeavySingleLayerWall = 'HeavySingleLayerWall',
	HeavySingleLayerWallFacingOneSide = 'HeavySingleLayerWallFacingOneSide',
	HeavySingleLayerWallFacingBothSide = 'HeavySingleLayerWallFacingBothSide',
	HeavyMultipleLayerWall = 'HeavyMultipleLayerWall',
	HeavyMultipleLayerWallFacingOneSide = 'HeavyMultipleLayerWallFacingOneSide',
	HeavyMultipleLayerWallFacingBothSide = 'HeavyMultipleLayerWallFacingBothSide',
	ZPanel = 'ZPanel',
	OneFramePartition = 'OneFramePartition',
	TwoFramePartition = 'TwoFramePartition',
	HeavySingleWallFacing = 'HeavySingleWallFacing',
	DoubleGlazedFrame = 'DoubleGlazedFrame',
	OneGlassFrame = 'OneGlassFrame',
	HomogeneousFloor = 'HomogeneousFloor',
	ElasticBaseFloor = 'ElasticBaseFloor',
	Door = 'Door',
}

export interface ConstructionTypeTemplate {
	name?: string | null;
	shortName?: string | null;
	constructionTypeEnum?: ConstructionTypeEnum;
	constructionBase?: ConstructionBase;
}

export interface Coordinates {
	/** @format int32 */
	x?: number;
	/** @format int32 */
	y?: number;
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

export interface CreateBillByAdminCommand {
	/** @format uuid */
	subscriptionId?: string;
	/** @format uuid */
	userId?: string;
	billType?: BillTypeEnum;
}

export interface CreateBillCommand {
	/** @format uuid */
	subscriptionId?: string;
}

export interface CreateConstructionAdditionalInformationDto {
	suppliers?: string[] | null;
	standartName?: string | null;
	composition?: string[] | null;
	features?: string[] | null;
	physicalCharacteristics?: string[] | null;
	fireSafetyAndMore?: string[] | null;
	installation?: string[] | null;
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
	isViewForDefaultUser?: boolean;
	airNoizeLaboratoryData?: CreateConstructionLaboratoryDataDto;
	impactNoizeLaboratoryData?: CreateConstructionLaboratoryDataDto;
	constructionPurpose?: ConstructionPurpose;
	constructionType?: CreateConstructionTypeDto;
	createConstructionAdditionalInformationDto?: CreateConstructionAdditionalInformationDto;
}

export interface CreateConstructionLaboratoryDataDto {
	rTotal?: number[] | null;
	laboratoryTestSource?: string | null;
	index?: IndexType;
}

export interface CreateConstructionTypeDto {
	constructionTypeEnum?: ConstructionTypeEnum;
	constructions?: CreateConstructionDto[] | null;
}

export interface CreateFloorReportReceivingCommand {
	/** @format uuid */
	reportInfoId?: string;
}

export interface CreateOrUpdateAcousticModelsCommand {
	modelId?: string | null;
	/** @format double */
	coefficient?: number;
}

export interface CreateReportConstructionDto {
	/** @format uuid */
	id?: string | null;
	name?: string | null;
	/** @format uuid */
	constructionHeaderId?: string;
	/** @format double */
	square?: number;
	/** @format double */
	width?: number;
	/** @format double */
	length?: number;
	/** @format uuid */
	secondPlacementRoomId?: string;
	/** @format uuid */
	firstPlacementRoomId?: string;
}

export interface CreateReportFloorInfoCommand {
	/** @format uuid */
	reportInfoId?: string;
	floorName?: string | null;
}

export interface CreateReportInfoCommand {
	buildingName?: string | null;
	description?: string | null;
	/** @format uuid */
	calculationDocumentId?: string;
	/** @format uuid */
	regulatoryDocumentId?: string;
	country?: CountryType;
	category?: ReportCategory;
	buildingType?: BuildingType;
	class?: CategoryClass;
}

export interface CreateReportInfoDto {
	/** @format uuid */
	id?: string;
	buildingName?: string | null;
	description?: string | null;
	calculationRequirements?: Requirement[] | null;
	regulatoryRequirements?: Requirement[] | null;
	category?: ReportCategory;
	buildingType?: BuildingType;
	class?: CategoryClass;
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
	/** @format uuid */
	regulatoryDocumentId?: string;
}

export interface CreateSingleReportReceivingCommand {
	/** @format uuid */
	reportInfoId?: string;
}

export interface CreateSubscriptionCommand {
	name?: string | null;
	description?: string | null;
	/** @format double */
	price?: number;
	/** @format int32 */
	numberOfReports?: number;
	/** @format int32 */
	numberOfDowloadReports?: number;
	/** @format uuid */
	tariffPlanId?: string | null;
}

export interface CreateUserMaterialDto {
	/** @format uuid */
	materialId?: string;
	/** @format int32 */
	positionId?: number;
	additionalName?: string | null;
	materialTypeValue?: MaterialTypeValueDto[] | null;
}

export interface DeleteAcousticModelsCommand {
	modelId?: string | null;
}

export interface DeleteArticleCommand {
	/** @format uuid */
	articleId?: string;
}

export interface DeleteBillCommand {
	/** @format uuid */
	id?: string;
}

export interface DeleteConstructionHeaderCommand {
	/** @format uuid */
	id?: string;
}

export interface DeleteFloorConstructionCommand {
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

export interface DeleteReportCommand {
	/** @format uuid */
	reportId?: string;
}

export interface DeleteReportConstructionCommand {
	/** @format uuid */
	id?: string;
}

export interface DeleteReportFloorInfoCommand {
	/** @format uuid */
	id?: string;
}

export interface DeleteReportInfoCommand {
	/** @format uuid */
	id?: string;
}

export interface DeleteRequirementCommand {
	/** @format uuid */
	id?: string;
}

export interface DeleteSubscriptionCommand {
	/** @format uuid */
	id?: string;
}

export interface DeleteTariffPlanCommand {
	/** @format uuid */
	tariffId?: string;
}

export interface DeleteUserCommand {
	/** @format uuid */
	userId?: string;
}

export interface DocumentReportFlagsDto {
	takeTitleList?: boolean;
	takeContent?: boolean;
	takeIntroduction?: boolean;
	soundInsulationCalculation?: EnclosingStructuresSoundInsulationCalculationFlagsDto;
	thermalInsulationCalculation?: EnclosingStructuresThermalInsulationCalculationFlagsDto;
	takeConclusion?: boolean;
	takeUsedLiteratureList?: boolean;
	takeSupplementSoundInsulationProtocolsWithCalculation?: boolean;
	takeSupplementThermalInsulationProtocolsWithCalculation?: boolean;
	takeSupplementSoundInsulationAlternativeProtocols?: boolean;
}

export interface Dot {
	/** @format double */
	r?: number;
	/** @format double */
	f?: number;
}

export interface EnclosingStructuresSoundInsulationCalculationFlagsDto {
	takeEnclosingStructuresSoundInsulationCalculation?: boolean;
	baseReportInfoFlags?: SoundInsulationFloorReportInfoFlagsDto[] | null;
}

export interface EnclosingStructuresThermalInsulationCalculationFlagsDto {
	takeDetailedCalculatingMethod?: boolean;
	baseReportInfoFlags?: ThermalInsulationFloorReportInfoFlagsDto[] | null;
}

export interface ExportMaterialsQuery {
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
	materialType?: MaterialTypeEnum;
}

export interface ExportRequirementQuery {
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
	/** @format uuid */
	regulatoryDocumentId?: string | null;
}

export interface FinalizeReportInfoCommand {
	/** @format uuid */
	reportInfoId?: string;
	reportNumber?: string | null;
	reportName?: string | null;
	customerName?: string | null;
	objectDescription?: string | null;
	creatorFullName?: string | null;
	code?: string | null;
	country?: string | null;
	director?: string | null;
	/** @format date */
	date?: string | null;
	floorDocumentFlags?: DocumentReportFlagsDto;
}

export interface FirstRequirementPlacementRoomDto {
	firstPlacementRoom?: PlacementRoomDto;
	secondRequirementRooms?: SecondRequirementPlacementRoomDto[] | null;
}

export interface FloorConstructionInfoIdDto {
	/** @format uuid */
	id?: string;
}

export interface GetAcousticModelsQuery {
	name?: string | null;
}

export interface GetAlternativeConstructionHeadersQuery {
	/** @format int32 */
	pageNumber?: number;
	/** @format int32 */
	pageSize?: number;
	sortOrder?: SortOrder;
	ordering?: string | null;
	/** @format double */
	minThickness?: number | null;
	/** @format double */
	maxThickness?: number | null;
	/** @format double */
	minMass?: number | null;
	/** @format double */
	maxMass?: number | null;
	/** @format double */
	minLabRw?: number | null;
	/** @format double */
	maxLabRw?: number | null;
	constructionTypeEnum?: ConstructionTypeEnum;
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

export interface GetBillWithPaginationParamsQuery {
	/** @format int32 */
	pageNumber?: number;
	/** @format int32 */
	pageSize?: number;
	sortOrder?: SortOrder;
	ordering?: string | null;
	/** @format int64 */
	number?: number | null;
	/** @format date */
	date?: string | null;
	clientName?: string | null;
	billType?: BillTypeEnum;
}

export interface GetConstructionAdditionalInfoForReportQuery {
	/** @format uuid */
	reportConstructionId?: string;
}

export interface GetConstructionAdditionalInfoQuery {
	/** @format uuid */
	constructionHeaderId?: string;
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
	shortName?: string | null;
	constructionType?: ConstructionTypeEnum;
	countryType?: CountryType;
	isReportConstruction?: boolean;
	/** @format uuid */
	constructionIdToUpdate?: string | null;
	/** @format uuid */
	userId?: string | null;
	constructionClass?: ConstructionClass;
	/** @format float */
	rw?: number | null;
	orderByPriority?: boolean;
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
	materialType?: MaterialTypeEnum;
}

export interface GetPalacementRoomVariantsWithTypesQuery {
	buildingType?: BuildingType;
	constructionType?: ConstructionClass;
}

export interface GetPlacementRoomFromRequirementsQuery {
	buildingType?: BuildingType;
	constructionClass?: ConstructionClass;
	class?: CategoryClass;
	/** @format uuid */
	regulatoryDocumentId?: string;
}

export interface GetPlacementRoomVariantByAllParametersQuery {
	buildingType?: BuildingType;
	constructionType?: ConstructionClass;
	/** @format uuid */
	placementRoomId?: string;
}

export interface GetReportInfoWithPaginationQuery {
	/** @format int32 */
	pageNumber?: number;
	/** @format int32 */
	pageSize?: number;
	sortOrder?: SortOrder;
	ordering?: string | null;
	status?: ReportInfoStatus;
}

export interface GetReportWithPaginationQuery {
	/** @format int32 */
	pageNumber?: number;
	/** @format int32 */
	pageSize?: number;
	sortOrder?: SortOrder;
	ordering?: string | null;
	/** @format uuid */
	userId?: string | null;
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
	/** @format uuid */
	regulatoryDocumentId?: string | null;
}

export interface GetSubscriptionsWithPaginationParamsQuery {
	/** @format int32 */
	pageNumber?: number;
	/** @format int32 */
	pageSize?: number;
	sortOrder?: SortOrder;
	ordering?: string | null;
	name?: string | null;
	/** @format double */
	price?: number | null;
	/** @format int32 */
	numberOfReports?: number | null;
}

export interface GetTariffPlanWithPaginationQuery {
	/** @format int32 */
	pageNumber?: number;
	/** @format int32 */
	pageSize?: number;
	sortOrder?: SortOrder;
	ordering?: string | null;
}

export interface GetUsersWithPaginationParamsQuery {
	/** @format int32 */
	pageNumber?: number;
	/** @format int32 */
	pageSize?: number;
	sortOrder?: SortOrder;
	ordering?: string | null;
	/** @format uuid */
	roleId?: string | null;
	roleName?: string | null;
	directorFullName?: string | null;
	companyName?: string | null;
	mail?: string | null;
}

export interface GraphParametrsDto {
	graphType?: GraphType;
	name?: string | null;
	namedDots?: NamedDotDto[] | null;
}

export enum GraphType {
	Computed = 'Computed',
	ComputedImpact = 'ComputedImpact',
	Laboratory = 'Laboratory',
	LaboratoryImpact = 'LaboratoryImpact',
	Atalon = 'Atalon',
	ImpactAtalon = 'ImpactAtalon',
	AdditionalDoor = 'AdditionalDoor',
	AdditionalWindow = 'AdditionalWindow',
	Intermediate = 'Intermediate',
}

export interface ImportResultDto {
	/** @format int32 */
	totalCount?: number;
	/** @format int32 */
	failedCount?: number;
	fileUrl?: string | null;
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
	materialPurpose?: MaterialPurpose;
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
	relativeCompression?: number;
	/** @format float */
	damping?: number;
	/** @format float */
	solid?: number;
	/** @format float */
	edin?: number;
	/** @format float */
	fb?: number;
	/** @format float */
	fc?: number;
	/** @format float */
	rb?: number;
	/** @format float */
	rc?: number;
	/** @format float */
	velocityLongitudinal?: number;
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
	ConnectionType = 'ConnectionType',
	RackStep = 'RackStep',
	Width = 'Width',
	Length = 'Length',
	Square = 'Square',
	Filler = 'Filler',
}

export enum MaterialPurpose {
	Any = 'Any',
	ForWall = 'ForWall',
	ForFloor = 'ForFloor',
}

export interface MaterialType {
	/** @format uuid */
	id?: string;
	name?: string | null;
	shortName?: string | null;
	materialTypeEnum?: MaterialTypeEnum;
	materialTypeValues?: MaterialTypeValue[] | null;
	fullName?: string | null;
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
	Plaster = 'Plaster',
	Frame = 'Frame',
	WoodBasedBoard = 'WoodBasedBoard',
	MineralBondedBoards = 'MineralBondedBoards',
	Glazing = 'Glazing',
	Membrane = 'Membrane',
	AcousticTreatmentMaterials = 'AcousticTreatmentMaterials',
	AirGap = 'AirGap',
	Link = 'Link',
	Filler = 'Filler',
	Heavy = 'Heavy',
	Board = 'Board',
	ZPanel = 'ZPanel',
	GapDistance = 'GapDistance',
	Screed = 'Screed',
}

export interface MaterialTypeValue {
	/** @format uuid */
	id?: string;
	/** @format double */
	value?: number;
	materialParametrs?: MaterialParametrs;
}

export interface MaterialTypeValueDto {
	/** @format double */
	value?: number;
	materialParametrs?: MaterialParametrs;
}

export interface NamedDotDto {
	name?: string | null;
	dot?: Dot;
}

export interface NamedEntity {
	/** @format uuid */
	id?: string;
	name?: string | null;
}

export interface NewFloorIfoDto {
	/** @format uuid */
	id?: string;
	reportFloorConstructionInfoIds?: string[] | null;
	floorNumber?: string | null;
}

export interface NewReportConstructionFloorInfoDto {
	reportConstructionHeader?: ReportConstructionDto;
	documentImageUrl?: string | null;
	coordinates1?: Coordinates;
	coordinates2?: Coordinates;
	/** @format int32 */
	page?: number;
}

export interface PaginatedArticleDto {
	/** @format uuid */
	id?: string;
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
	constructionPurpose?: ConstructionPurpose;
	issuer?: NamedEntity;
	issuerLogo?: string | null;
	shortName?: string | null;
	/** @format double */
	labR?: number;
	isView?: boolean;
	/** @format uuid */
	userId?: string | null;
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
	materialPurpose?: MaterialPurpose;
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
	/** @format float */
	edin?: number;
	/** @format float */
	fb?: number;
	/** @format float */
	fc?: number;
	/** @format float */
	rb?: number;
	/** @format float */
	rc?: number;
	/** @format float */
	velocityLongitudinal?: number;
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

export interface PaginatedUserDto {
	/** @format uuid */
	id?: string;
	email?: string | null;
	phoneNumber?: string | null;
	companyName?: string | null;
	bankIdNumber?: string | null;
	payersRegistrationNumber?: string | null;
	paymentAccount?: string | null;
	directorFullName?: string | null;
	bankAddress?: string | null;
	companyAddress?: string | null;
	companyDescription?: string | null;
	additionalPhoneNumbers?: AdditionalPhoneNumber[] | null;
	logoUrl?: string | null;
	/** @format uuid */
	roleId?: string;
	role?: UserRole;
	/** @format uuid */
	userSubscriptionId?: string;
}

export interface PaginatedUserDtoPaginatedList {
	items?: PaginatedUserDto[] | null;
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

export interface PlacementRoom {
	/** @format uuid */
	id?: string;
	name?: string | null;
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

export enum PurposeBuilding {
	LargePanelBuilding = 'LargePanelBuilding',
	FramePanelBuilding = 'FramePanelBuilding',
}

export interface RTotalDto {
	/** @format double */
	value?: number;
	/** @format int32 */
	index?: number;
}

export interface RegulatoryRequirementDocument {
	/** @format uuid */
	id?: string;
	country?: CountryType;
	shortName?: string | null;
	fullName?: string | null;
	requirements?: Requirement[] | null;
}

export interface RegulatoryRequirementDocumentDto {
	/** @format uuid */
	id?: string;
	country?: CountryType;
	shortName?: string | null;
	fullName?: string | null;
}

export interface RemoveFavoriteFromConstructionCommand {
	/** @format uuid */
	constructionHeaderId?: string;
}

export enum ReportCategory {
	Floor = 'Floor',
	Single = 'Single',
}

export interface ReportConstructionDto {
	/** @format uuid */
	id?: string;
	/** @format uuid */
	constructionHeaderId?: string;
	/** @format double */
	square?: number;
	/** @format double */
	width?: number;
	/** @format double */
	length?: number;
	secondPlacementRoom?: PlacementRoomDto;
	firstPlacementRoom?: PlacementRoomDto;
	/** @format float */
	requirementNoizeIsolationIndex?: number;
	/** @format float */
	requirementNoizeImpactIndex?: number | null;
	additionalDoors?: AdditionalConstructionHeaderDto[] | null;
	additionalWindows?: AdditionalConstructionHeaderDto[] | null;
}

export interface ReportDocumentInfoDto {
	/** @format uuid */
	reportInfoId?: string;
	customerName?: string | null;
	objectDescription?: string | null;
	creatorFullName?: string | null;
	code?: string | null;
	country?: string | null;
	director?: string | null;
	/** @format date */
	date?: string;
	logoUrl?: string | null;
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
	reportCategory?: ReportCategory;
	/** @format uuid */
	reportInfoId?: string;
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

export interface ReportFloorConstructionInfoDto {
	/** @format uuid */
	id?: string;
	reportConstructionHeader?: ReportConstructionDto;
	documentImageUrl?: string | null;
	coordinates1?: Coordinates;
	coordinates2?: Coordinates;
	/** @format int32 */
	page?: number;
}

export interface ReportFloorInfoDto {
	/** @format uuid */
	id?: string;
	reportFloorConstructionInfos?: ReportFloorConstructionInfoDto[] | null;
	floorNumber?: string | null;
}

export interface ReportInfoFloorConstructionDto {
	floorConstructionInfos?: ReportFloorInfoDto[] | null;
	buildingName?: string | null;
	calculationRequirementDocument?: CalculationRequirementDocumentDto;
	regulatoryRequirementDocument?: RegulatoryRequirementDocumentDto;
	category?: ReportCategory;
	buildingType?: BuildingType;
	class?: CategoryClass;
	reportDocumentInfo?: ReportDocumentInfoDto;
	country?: CountryType;
	status?: ReportInfoStatus;
	purposeBuilding?: PurposeBuilding;
	description?: string | null;
	floorDocumentUrl?: string | null;
}

export interface ReportInfoShortDto {
	/** @format uuid */
	id?: string;
	buildingName?: string | null;
	purposeBuilding?: PurposeBuilding;
	description?: string | null;
	category?: ReportCategory;
	status?: ReportInfoStatus;
	class?: CategoryClass;
	buildingType?: BuildingType;
	country?: CountryType;
	calculationRequirementDocument?: CalculationRequirementDocumentDto;
	regulatoryRequirementDocument?: RegulatoryRequirementDocumentDto;
	floorDocumentUrl?: string | null;
}

export interface ReportInfoShortDtoPaginatedList {
	items?: ReportInfoShortDto[] | null;
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

export interface ReportInfoSingleConstructionDto {
	/** @format uuid */
	id?: string;
	singleConstructionInfos?: SingleConstructionInfoDto[] | null;
	buildingName?: string | null;
	description?: string | null;
	calculationRequirementDocument?: CalculationRequirementDocumentDto;
	regulatoryRequirementDocument?: RegulatoryRequirementDocumentDto;
	category?: ReportCategory;
	reportDocumentInfo?: ReportDocumentInfoDto;
	status?: ReportInfoStatus;
	buildingType?: BuildingType;
	purposeBuilding?: PurposeBuilding;
	class?: CategoryClass;
}

export enum ReportInfoStatus {
	InProgress = 'InProgress',
	Completed = 'Completed',
}

export enum ReportStatus {
	None = 'None',
	Consideration = 'Consideration',
	Confirmed = 'Confirmed',
}

export interface Requirement {
	/** @format uuid */
	id?: string;
	secondPlacementRoom?: PlacementRoom;
	firstPlacementRoom?: PlacementRoom;
	regulatoryDocument?: RegulatoryRequirementDocument;
	/** @format uuid */
	regulatoryDocumentId?: string;
	buildingType?: BuildingType;
	standartShortName?: string | null;
	standartFullName?: string | null;
	country?: Country;
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
	regulatoryDocument?: NamedEntity;
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

export enum ResetInterval {
	Daily = 'daily',
	Monthly = 'monthly',
}

export enum RoleType {
	Admin = 'Admin',
	User = 'User',
	Manager = 'Manager',
}

export interface SecondRequirementPlacementRoomDto {
	secondPlacementRoom?: PlacementRoomDto;
	/** @format uuid */
	requirementId?: string;
	/** @format float */
	rw?: number;
	annotation?: string | null;
}

export interface SendSmsCommand {
	phoneNumber: string | null;
}

export interface SingleConstructionInfoDto {
	reportConstructionHeader?: ReportConstructionDto;
}

export enum SortOrder {
	Asc = 'Asc',
	Desc = 'Desc',
}

export interface SoundInsulationFloorReportInfoFlagsDto {
	namedConstructionFlags?: SoundInsulationNamedConstructionFlagsDto[] | null;
	floorNumber?: string | null;
	takeFloor?: boolean;
}

export interface SoundInsulationNamedConstructionFlagsDto {
	/** @format uuid */
	reportConstructionId?: string;
	constructionName?: string | null;
	takeConstruction?: boolean;
}

export interface SubscriptionDto {
	/** @format uuid */
	id?: string;
	name?: string | null;
	description?: string | null;
	/** @format double */
	price?: number;
	/** @format int32 */
	numberOfReports?: number;
	/** @format int32 */
	numberOfDowloadReports?: number;
	tariffPlan?: TariffPlanDto;
}

export interface SubscriptionDtoPaginatedList {
	items?: SubscriptionDto[] | null;
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

export interface SwapConstructionHeaderCommand {
	/** @format uuid */
	reportConstructionId?: string;
	/** @format uuid */
	alternativeConstructionHeaderId?: string;
}

export interface TariffPlanDto {
	/** @format uuid */
	id?: string;
	name?: string | null;
	resetInterval?: ResetInterval;
	/** @format double */
	credits?: number;
	/** @format double */
	coefficient?: number;
}

export interface TariffPlanDtoPaginatedList {
	items?: TariffPlanDto[] | null;
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

export interface ThermalInsulationFloorReportInfoFlagsDto {
	namedConstructionFlags?: ThermalInsulationNamedConstructionFlagsDto[] | null;
	floorNumber?: string | null;
	takeFloor?: boolean;
}

export interface ThermalInsulationNamedConstructionFlagsDto {
	/** @format uuid */
	reportConstructionId?: string;
	constructionName?: string | null;
	takeConstruction?: boolean;
}

export interface UpdateAdditionalConstructionHeaderDto {
	/** @format uuid */
	constructionHeaderId?: string;
	/** @format double */
	lenght?: number;
	/** @format double */
	height?: number;
	/** @format int32 */
	quantity?: number;
}

export interface UpdateBillCommand {
	/** @format uuid */
	id?: string;
	/** @format int64 */
	number?: number;
	/** @format date */
	date?: string;
	/** @format uuid */
	userId?: string;
	billType?: BillTypeEnum;
}

export interface UpdateConstructionAdditionalInformationDto {
	suppliers?: string[] | null;
	standartName?: string | null;
	composition?: string[] | null;
	features?: string[] | null;
	physicalCharacteristics?: string[] | null;
	fireSafetyAndMore?: string[] | null;
	installation?: string[] | null;
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
	constructionPurpose?: ConstructionPurpose;
	isViewForDefaultUser?: boolean;
	/** @format uuid */
	issuerId?: string;
	propertySource?: string | null;
	/** @format double */
	maxHeight?: number;
	fireResistance?: string | null;
	airNoizeLaboratoryData?: CreateConstructionLaboratoryDataDto;
	impactNoizeLaboratoryData?: CreateConstructionLaboratoryDataDto;
	constructionType?: CreateConstructionTypeDto;
	/** @format uuid */
	reportInfoId?: string | null;
	updateConstructionAdditionalInformationDto?: UpdateConstructionAdditionalInformationDto;
}

export interface UpdateReportCommand {
	/** @format uuid */
	reportId?: string;
	name?: string | null;
	client?: string | null;
	/** @format date */
	lastUpdated?: string;
	status?: ReportStatus;
}

export interface UpdateReportConstructionByAdditionalConstructionsCommand {
	/** @format uuid */
	reportConstructionId?: string;
	additionalWindows?: UpdateAdditionalConstructionHeaderDto[] | null;
	additionalDoors?: UpdateAdditionalConstructionHeaderDto[] | null;
}

export interface UpdateReportFloorInfoCommand {
	/** @format uuid */
	reportFloorInfoId?: string;
	floorName?: string | null;
}

export interface UpdateReportInfoBaseFieldsCommand {
	/** @format uuid */
	reportInfoId?: string;
	buildingName?: string | null;
	description?: string | null;
	buildingType?: BuildingType;
	class?: CategoryClass;
	purposeBuilding?: PurposeBuilding;
}

export interface UpdateReportInfoWithSingleConstructionCommand {
	/** @format uuid */
	reportInfoId?: string;
	/** @format uuid */
	requirementId?: string;
	reportConstruction?: CreateReportConstructionDto;
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
	/** @format uuid */
	regulatoryDocumentId?: string;
}

export interface UpdateSubscriptionCommand {
	/** @format uuid */
	id?: string;
	name?: string | null;
	description?: string | null;
	/** @format double */
	price?: number;
	/** @format int32 */
	numberOfReports?: number;
	/** @format int32 */
	numberOfDownloadReports?: number;
	/** @format uuid */
	tariffPlanId?: string | null;
}

export interface UpdateUserSubscriptionByModelMessageComand {
	/** @format uuid */
	openRouterWebUiUserId?: string;
	/** @format double */
	messageCost?: number;
	modelId?: string | null;
}

export interface UserMaterialDto {
	/** @format uuid */
	materialId?: string;
	materialName?: string | null;
	materialType?: MaterialTypeEnum;
	/** @format int32 */
	positionId?: number;
	additionalName?: string | null;
	materialTypeValue?: MaterialTypeValueDto[] | null;
}

export interface UserRole {
	/** @format uuid */
	id?: string;
	name: string | null;
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
				email?: string;
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
				/** @format uuid */
				userId?: string;
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
		 * @tags Admin
		 * @name AdminCreateUserCreate
		 * @request POST:/api/Admin/createUser
		 */
		adminCreateUserCreate: (
			data: {
				roleType?: RoleType;
				email?: string;
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
			},
			params: RequestParams = {},
		) =>
			this.request<void, any>({
				path: `/api/Admin/createUser`,
				method: 'POST',
				body: data,
				type: ContentType.FormData,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Admin
		 * @name AdminCreateBillCreate
		 * @request POST:/api/Admin/createBill
		 */
		adminCreateBillCreate: (data: CreateBillByAdminCommand, params: RequestParams = {}) =>
			this.request<BillDto, any>({
				path: `/api/Admin/createBill`,
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
		 * @tags Auth
		 * @name AuthLoginGoogleList
		 * @request GET:/api/Auth/login-google
		 */
		authLoginGoogleList: (params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/Auth/login-google`,
				method: 'GET',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Auth
		 * @name AuthGoogleResponseList
		 * @request GET:/api/Auth/google-response
		 */
		authGoogleResponseList: (params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/Auth/google-response`,
				method: 'GET',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Bill
		 * @name BillDetail
		 * @request GET:/api/Bill/{id}
		 */
		billDetail: (id: string, params: RequestParams = {}) =>
			this.request<BillDto, any>({
				path: `/api/Bill/${id}`,
				method: 'GET',
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Bill
		 * @name BillGetPaginatedCreate
		 * @request POST:/api/Bill/get-paginated
		 */
		billGetPaginatedCreate: (
			data: GetBillWithPaginationParamsQuery,
			params: RequestParams = {},
		) =>
			this.request<BillDtoPaginatedList, any>({
				path: `/api/Bill/get-paginated`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Bill
		 * @name BillCreate
		 * @request POST:/api/Bill
		 */
		billCreate: (data: CreateBillCommand, params: RequestParams = {}) =>
			this.request<BillDto, any>({
				path: `/api/Bill`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Bill
		 * @name BillDelete
		 * @request DELETE:/api/Bill
		 */
		billDelete: (data: DeleteBillCommand, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/Bill`,
				method: 'DELETE',
				body: data,
				type: ContentType.Json,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Bill
		 * @name BillUpdate
		 * @request PUT:/api/Bill
		 */
		billUpdate: (data: UpdateBillCommand, params: RequestParams = {}) =>
			this.request<BillDto, any>({
				path: `/api/Bill`,
				method: 'PUT',
				body: data,
				type: ContentType.Json,
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags CalculationRequirementDocument
		 * @name CalculationRequirementDocumentList
		 * @request GET:/api/CalculationRequirementDocument
		 */
		calculationRequirementDocumentList: (params: RequestParams = {}) =>
			this.request<CalculationRequirementDocumentDto[], any>({
				path: `/api/CalculationRequirementDocument`,
				method: 'GET',
				format: 'json',
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
		 * @tags Construction
		 * @name ConstructionAdditionalInfoFilesUpdate
		 * @request PUT:/api/Construction/additionalInfoFiles
		 */
		constructionAdditionalInfoFilesUpdate: (
			data: {
				files?: File[];
				images?: File[];
			},
			query?: {
				/** @format uuid */
				constructionHeaderId?: string;
				isUpdateFiles?: boolean;
				isUpdateImages?: boolean;
			},
			params: RequestParams = {},
		) =>
			this.request<void, any>({
				path: `/api/Construction/additionalInfoFiles`,
				method: 'PUT',
				query: query,
				body: data,
				type: ContentType.FormData,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Construction
		 * @name ConstructionAlternativeConstructionsCreate
		 * @request POST:/api/Construction/alternativeConstructions
		 */
		constructionAlternativeConstructionsCreate: (
			data: GetAlternativeConstructionHeadersQuery,
			params: RequestParams = {},
		) =>
			this.request<PaginatedConstructionHeaderDtoPaginatedList, any>({
				path: `/api/Construction/alternativeConstructions`,
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
		 * @name ConstructionFavoriteConstructionUpdate
		 * @request PUT:/api/Construction/favoriteConstruction/{constructionId}
		 */
		constructionFavoriteConstructionUpdate: (
			constructionId: string,
			params: RequestParams = {},
		) =>
			this.request<void, any>({
				path: `/api/Construction/favoriteConstruction/${constructionId}`,
				method: 'PUT',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Construction
		 * @name ConstructionFavoriteConstructionDelete
		 * @request DELETE:/api/Construction/favoriteConstruction/{constructionId}
		 */
		constructionFavoriteConstructionDelete: (
			constructionId: string,
			data: RemoveFavoriteFromConstructionCommand,
			params: RequestParams = {},
		) =>
			this.request<void, any>({
				path: `/api/Construction/favoriteConstruction/${constructionId}`,
				method: 'DELETE',
				body: data,
				type: ContentType.Json,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Construction
		 * @name ConstructionFavoriteConstructionList
		 * @request GET:/api/Construction/favoriteConstruction
		 */
		constructionFavoriteConstructionList: (params: RequestParams = {}) =>
			this.request<PaginatedConstructionHeaderDtoPaginatedList, any>({
				path: `/api/Construction/favoriteConstruction`,
				method: 'GET',
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Construction
		 * @name ConstructionAdditionalInfoForReportCreate
		 * @request POST:/api/Construction/additionalInfoForReport
		 */
		constructionAdditionalInfoForReportCreate: (
			data: GetConstructionAdditionalInfoForReportQuery,
			params: RequestParams = {},
		) =>
			this.request<ConstructionAdditionalInfoForReportDto, any>({
				path: `/api/Construction/additionalInfoForReport`,
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
		 * @name ConstructionAdditionalInfoCreate
		 * @request POST:/api/Construction/additionalInfo
		 */
		constructionAdditionalInfoCreate: (
			data: GetConstructionAdditionalInfoQuery,
			params: RequestParams = {},
		) =>
			this.request<ConstructionAdditionalInfoDto, any>({
				path: `/api/Construction/additionalInfo`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Graph
		 * @name GraphDetail
		 * @request GET:/api/Graph/{constructionHeaderId}
		 */
		graphDetail: (constructionHeaderId: string, params: RequestParams = {}) =>
			this.request<GraphParametrsDto[], any>({
				path: `/api/Graph/${constructionHeaderId}`,
				method: 'GET',
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Graph
		 * @name GraphAdditionalGraphParamsDetail
		 * @request GET:/api/Graph/additionalGraphParams/{constructionHeaderId}
		 */
		graphAdditionalGraphParamsDetail: (
			constructionHeaderId: string,
			params: RequestParams = {},
		) =>
			this.request<AdditionalGraphParametersDto, any>({
				path: `/api/Graph/additionalGraphParams/${constructionHeaderId}`,
				method: 'GET',
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
				editFile?: boolean;
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
		 * @name MaterialExportCreate
		 * @request POST:/api/Material/export
		 */
		materialExportCreate: (data: ExportMaterialsQuery, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/Material/export`,
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
				materialPurpose?: MaterialPurpose;
				type?: MaterialOriginType;
				/** @format float */
				velocity?: number;
				/** @format float */
				lossFactor?: number;
				/** @format float */
				youngModulus?: number;
				/** @format float */
				relativeCompression?: number;
				/** @format float */
				damping?: number;
				/** @format float */
				solid?: number;
				/** @format float */
				edin?: number;
				/** @format float */
				fb?: number;
				/** @format float */
				fc?: number;
				/** @format float */
				rb?: number;
				/** @format float */
				rc?: number;
				/** @format float */
				velocityLongitudinal?: number;
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
				relativeCompression?: number;
				/** @format float */
				damping?: number;
				/** @format float */
				solid?: number;
				/** @format float */
				edin?: number;
				/** @format float */
				velocityLongitudinal?: number;
				/** @format float */
				fb?: number;
				/** @format float */
				fc?: number;
				/** @format float */
				rb?: number;
				/** @format float */
				rc?: number;
				editFile?: boolean;
				materialPurpose?: MaterialPurpose;
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
		 * @tags Material
		 * @name MaterialImportCreate
		 * @request POST:/api/Material/import
		 */
		materialImportCreate: (
			data: {
				/** @format binary */
				formFile?: File;
			},
			params: RequestParams = {},
		) =>
			this.request<ImportResultDto, any>({
				path: `/api/Material/import`,
				method: 'POST',
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
		 * @tags OpenRouterModels
		 * @name OpenRouterModelsModelsCreate
		 * @request POST:/api/OpenRouterModels/Models
		 */
		openRouterModelsModelsCreate: (data: GetAcousticModelsQuery, params: RequestParams = {}) =>
			this.request<AcousticModelDto[], any>({
				path: `/api/OpenRouterModels/Models`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags OpenRouterModels
		 * @name OpenRouterModelsCreate
		 * @request POST:/api/OpenRouterModels
		 */
		openRouterModelsCreate: (
			data: CreateOrUpdateAcousticModelsCommand,
			params: RequestParams = {},
		) =>
			this.request<AcousticModelDto, any>({
				path: `/api/OpenRouterModels`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags OpenRouterModels
		 * @name OpenRouterModelsDelete
		 * @request DELETE:/api/OpenRouterModels
		 */
		openRouterModelsDelete: (data: DeleteAcousticModelsCommand, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/OpenRouterModels`,
				method: 'DELETE',
				body: data,
				type: ContentType.Json,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags OpenRouterModels
		 * @name OpenRouterModelsIsHaveAccessList
		 * @request GET:/api/OpenRouterModels/isHaveAccess
		 */
		openRouterModelsIsHaveAccessList: (params: RequestParams = {}) =>
			this.request<SubscriptionDto, any>({
				path: `/api/OpenRouterModels/isHaveAccess`,
				method: 'GET',
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags OpenRouterModels
		 * @name OpenRouterModelsUpdateSubscriptionUpdate
		 * @request PUT:/api/OpenRouterModels/updateSubscription
		 */
		openRouterModelsUpdateSubscriptionUpdate: (
			data: UpdateUserSubscriptionByModelMessageComand,
			params: RequestParams = {},
		) =>
			this.request<SubscriptionDto, any>({
				path: `/api/OpenRouterModels/updateSubscription`,
				method: 'PUT',
				body: data,
				type: ContentType.Json,
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
		 * @tags PlacementRoomVariants
		 * @name PlacementRoomVariantsRequirementsCreate
		 * @request POST:/api/PlacementRoomVariants/requirements
		 */
		placementRoomVariantsRequirementsCreate: (
			data: GetPlacementRoomFromRequirementsQuery,
			params: RequestParams = {},
		) =>
			this.request<FirstRequirementPlacementRoomDto[], any>({
				path: `/api/PlacementRoomVariants/requirements`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags RegulatoryRequirementDocument
		 * @name RegulatoryRequirementDocumentList
		 * @request GET:/api/RegulatoryRequirementDocument
		 */
		regulatoryRequirementDocumentList: (params: RequestParams = {}) =>
			this.request<RegulatoryRequirementDocumentDto[], any>({
				path: `/api/RegulatoryRequirementDocument`,
				method: 'GET',
				format: 'json',
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
		 * @name ReportUpdate
		 * @request PUT:/api/Report
		 */
		reportUpdate: (data: UpdateReportCommand, params: RequestParams = {}) =>
			this.request<ReportDto, any>({
				path: `/api/Report`,
				method: 'PUT',
				body: data,
				type: ContentType.Json,
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Report
		 * @name ReportDelete
		 * @request DELETE:/api/Report
		 */
		reportDelete: (data: DeleteReportCommand, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/Report`,
				method: 'DELETE',
				body: data,
				type: ContentType.Json,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags ReportInfo
		 * @name ReportInfoGetReportInfoRenewDetail
		 * @request GET:/api/ReportInfo/{id}/GetReportInfoRenew
		 */
		reportInfoGetReportInfoRenewDetail: (id: string, params: RequestParams = {}) =>
			this.request<ReportInfoShortDto, any>({
				path: `/api/ReportInfo/${id}/GetReportInfoRenew`,
				method: 'GET',
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags ReportInfo
		 * @name ReportInfoGetPaginatedCreate
		 * @request POST:/api/ReportInfo/get-paginated
		 */
		reportInfoGetPaginatedCreate: (
			data: GetReportInfoWithPaginationQuery,
			params: RequestParams = {},
		) =>
			this.request<ReportInfoShortDtoPaginatedList, any>({
				path: `/api/ReportInfo/get-paginated`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags ReportInfo
		 * @name ReportInfoReportInfoFlagsDetail
		 * @request GET:/api/ReportInfo/{id}/ReportInfoFlags
		 */
		reportInfoReportInfoFlagsDetail: (id: string, params: RequestParams = {}) =>
			this.request<DocumentReportFlagsDto, any>({
				path: `/api/ReportInfo/${id}/ReportInfoFlags`,
				method: 'GET',
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags ReportInfo
		 * @name ReportInfoDocumentInfoLogoUpdate
		 * @request PUT:/api/ReportInfo/documentInfo/logo
		 */
		reportInfoDocumentInfoLogoUpdate: (
			data: {
				/** @format uuid */
				reportInfoId?: string;
				/** @format binary */
				logo?: File;
			},
			params: RequestParams = {},
		) =>
			this.request<void, any>({
				path: `/api/ReportInfo/documentInfo/logo`,
				method: 'PUT',
				body: data,
				type: ContentType.FormData,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags ReportInfo
		 * @name ReportInfoReportInfoBaseInformationUpdate
		 * @request PUT:/api/ReportInfo/reportInfo/baseInformation
		 */
		reportInfoReportInfoBaseInformationUpdate: (
			data: UpdateReportInfoBaseFieldsCommand,
			params: RequestParams = {},
		) =>
			this.request<ReportDto, any>({
				path: `/api/ReportInfo/reportInfo/baseInformation`,
				method: 'PUT',
				body: data,
				type: ContentType.Json,
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags ReportInfo
		 * @name ReportInfoCreate
		 * @request POST:/api/ReportInfo
		 */
		reportInfoCreate: (data: CreateReportInfoCommand, params: RequestParams = {}) =>
			this.request<CreateReportInfoDto, any>({
				path: `/api/ReportInfo`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags ReportInfo
		 * @name ReportInfoDelete
		 * @request DELETE:/api/ReportInfo
		 */
		reportInfoDelete: (data: DeleteReportInfoCommand, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/ReportInfo`,
				method: 'DELETE',
				body: data,
				type: ContentType.Json,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags ReportInfo
		 * @name ReportInfoDocumentInfoUpdate
		 * @request PUT:/api/ReportInfo/documentInfo
		 */
		reportInfoDocumentInfoUpdate: (
			data: FinalizeReportInfoCommand,
			params: RequestParams = {},
		) =>
			this.request<void, any>({
				path: `/api/ReportInfo/documentInfo`,
				method: 'PUT',
				body: data,
				type: ContentType.Json,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags ReportInfo
		 * @name ReportInfoDocumentUpdate
		 * @request PUT:/api/ReportInfo/document
		 */
		reportInfoDocumentUpdate: (
			data: {
				/** @format binary */
				floorDocument?: File;
			},
			query?: {
				/** @format uuid */
				reportInfoId?: string;
			},
			params: RequestParams = {},
		) =>
			this.request<void, any>({
				path: `/api/ReportInfo/document`,
				method: 'PUT',
				query: query,
				body: data,
				type: ContentType.FormData,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags ReportInfo
		 * @name ReportInfoSingleDetail
		 * @request GET:/api/ReportInfo/{id}/single
		 */
		reportInfoSingleDetail: (id: string, params: RequestParams = {}) =>
			this.request<ReportInfoSingleConstructionDto, any>({
				path: `/api/ReportInfo/${id}/single`,
				method: 'GET',
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags ReportInfo
		 * @name ReportInfoSingleUpdate
		 * @request PUT:/api/ReportInfo/single
		 */
		reportInfoSingleUpdate: (
			data: UpdateReportInfoWithSingleConstructionCommand,
			params: RequestParams = {},
		) =>
			this.request<ReportInfoSingleConstructionDto, any>({
				path: `/api/ReportInfo/single`,
				method: 'PUT',
				body: data,
				type: ContentType.Json,
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags ReportInfo
		 * @name ReportInfoFloorDetail
		 * @request GET:/api/ReportInfo/{id}/floor
		 */
		reportInfoFloorDetail: (id: string, params: RequestParams = {}) =>
			this.request<ReportInfoFloorConstructionDto, any>({
				path: `/api/ReportInfo/${id}/floor`,
				method: 'GET',
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags ReportInfo
		 * @name ReportInfoGetReportFloorInfoIdsRenewDetail
		 * @request GET:/api/ReportInfo/{id}/GetReportFloorInfoIdsRenew
		 */
		reportInfoGetReportFloorInfoIdsRenewDetail: (id: string, params: RequestParams = {}) =>
			this.request<FloorConstructionInfoIdDto[], any>({
				path: `/api/ReportInfo/${id}/GetReportFloorInfoIdsRenew`,
				method: 'GET',
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags ReportInfo
		 * @name ReportInfoGetReportFloorInfoRenewDetail
		 * @request GET:/api/ReportInfo/{id}/GetReportFloorInfoRenew
		 */
		reportInfoGetReportFloorInfoRenewDetail: (id: string, params: RequestParams = {}) =>
			this.request<NewFloorIfoDto, any>({
				path: `/api/ReportInfo/${id}/GetReportFloorInfoRenew`,
				method: 'GET',
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags ReportInfo
		 * @name ReportInfoGetReportFloorConstructionInfoRenewDetail
		 * @request GET:/api/ReportInfo/{id}/GetReportFloorConstructionInfoRenew
		 */
		reportInfoGetReportFloorConstructionInfoRenewDetail: (
			id: string,
			params: RequestParams = {},
		) =>
			this.request<NewReportConstructionFloorInfoDto, any>({
				path: `/api/ReportInfo/${id}/GetReportFloorConstructionInfoRenew`,
				method: 'GET',
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags ReportInfo
		 * @name ReportInfoGetConstructionsByFloorDetail
		 * @request GET:/api/ReportInfo/{id}/getConstructionsByFloor
		 */
		reportInfoGetConstructionsByFloorDetail: (id: string, params: RequestParams = {}) =>
			this.request<ReportFloorInfoDto, any>({
				path: `/api/ReportInfo/${id}/getConstructionsByFloor`,
				method: 'GET',
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags ReportInfo
		 * @name ReportInfoReportFloorInfoDelete
		 * @request DELETE:/api/ReportInfo/reportFloorInfo
		 */
		reportInfoReportFloorInfoDelete: (
			data: DeleteReportFloorInfoCommand,
			params: RequestParams = {},
		) =>
			this.request<void, any>({
				path: `/api/ReportInfo/reportFloorInfo`,
				method: 'DELETE',
				body: data,
				type: ContentType.Json,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags ReportInfo
		 * @name ReportInfoReportFloorInfoCreate
		 * @request POST:/api/ReportInfo/reportFloorInfo
		 */
		reportInfoReportFloorInfoCreate: (
			data: CreateReportFloorInfoCommand,
			params: RequestParams = {},
		) =>
			this.request<void, any>({
				path: `/api/ReportInfo/reportFloorInfo`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags ReportInfo
		 * @name ReportInfoReportFloorInfoUpdate
		 * @request PUT:/api/ReportInfo/reportFloorInfo
		 */
		reportInfoReportFloorInfoUpdate: (
			data: UpdateReportFloorInfoCommand,
			params: RequestParams = {},
		) =>
			this.request<void, any>({
				path: `/api/ReportInfo/reportFloorInfo`,
				method: 'PUT',
				body: data,
				type: ContentType.Json,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags ReportInfo
		 * @name ReportInfoReportConstructionDetail
		 * @request GET:/api/ReportInfo/{id}/reportConstruction
		 */
		reportInfoReportConstructionDetail: (id: string, params: RequestParams = {}) =>
			this.request<ReportConstructionDto, any>({
				path: `/api/ReportInfo/${id}/reportConstruction`,
				method: 'GET',
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags ReportInfo
		 * @name ReportInfoReportConstructionUpdate
		 * @request PUT:/api/ReportInfo/reportConstruction
		 */
		reportInfoReportConstructionUpdate: (
			data: UpdateReportConstructionByAdditionalConstructionsCommand,
			params: RequestParams = {},
		) =>
			this.request<ReportConstructionDto, any>({
				path: `/api/ReportInfo/reportConstruction`,
				method: 'PUT',
				body: data,
				type: ContentType.Json,
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags ReportInfo
		 * @name ReportInfoReportConstructionDelete
		 * @request DELETE:/api/ReportInfo/reportConstruction
		 */
		reportInfoReportConstructionDelete: (
			data: DeleteReportConstructionCommand,
			params: RequestParams = {},
		) =>
			this.request<void, any>({
				path: `/api/ReportInfo/reportConstruction`,
				method: 'DELETE',
				body: data,
				type: ContentType.Json,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags ReportInfo
		 * @name ReportInfoFloorConstructionUpdate
		 * @request PUT:/api/ReportInfo/floor/construction
		 */
		reportInfoFloorConstructionUpdate: (
			data: {
				/** @format uuid */
				reportInfoId?: string;
				/** @format uuid */
				reportFloorInfoId?: string;
				/** @format uuid */
				floorConstructionInfoId?: string;
				/** @format uuid */
				requirementId?: string;
				/** @format uuid */
				'floorInfo.reportConstructionHeader.id'?: string;
				'floorInfo.reportConstructionHeader.name'?: string;
				/** @format uuid */
				'floorInfo.reportConstructionHeader.constructionHeaderId'?: string;
				/** @format double */
				'floorInfo.reportConstructionHeader.square'?: number;
				/** @format double */
				'floorInfo.reportConstructionHeader.width'?: number;
				/** @format double */
				'floorInfo.reportConstructionHeader.length'?: number;
				/** @format uuid */
				'floorInfo.reportConstructionHeader.secondPlacementRoomId'?: string;
				/** @format uuid */
				'floorInfo.reportConstructionHeader.firstPlacementRoomId'?: string;
				/** @format int32 */
				'floorInfo.coordinates1.x'?: number;
				/** @format int32 */
				'floorInfo.coordinates1.y'?: number;
				/** @format int32 */
				'floorInfo.coordinates2.x'?: number;
				/** @format int32 */
				'floorInfo.coordinates2.y'?: number;
				/** @format int32 */
				'floorInfo.page'?: number;
			},
			params: RequestParams = {},
		) =>
			this.request<ReportFloorInfoDto, any>({
				path: `/api/ReportInfo/floor/construction`,
				method: 'PUT',
				body: data,
				type: ContentType.FormData,
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags ReportInfo
		 * @name ReportInfoFloorSwapByAlternativeUpdate
		 * @request PUT:/api/ReportInfo/floor/swapByAlternative
		 */
		reportInfoFloorSwapByAlternativeUpdate: (
			data: SwapConstructionHeaderCommand,
			params: RequestParams = {},
		) =>
			this.request<void, any>({
				path: `/api/ReportInfo/floor/swapByAlternative`,
				method: 'PUT',
				body: data,
				type: ContentType.Json,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags ReportInfo
		 * @name ReportInfoFloorConstructionImageUpdate
		 * @request PUT:/api/ReportInfo/floor/construction/image
		 */
		reportInfoFloorConstructionImageUpdate: (
			data: {
				/** @format binary */
				floorDocumentImage?: File;
				/** @format uuid */
				reportFloorConstructionInfoId?: string;
			},
			params: RequestParams = {},
		) =>
			this.request<ReportFloorInfoDto, any>({
				path: `/api/ReportInfo/floor/construction/image`,
				method: 'PUT',
				body: data,
				type: ContentType.FormData,
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags ReportInfo
		 * @name ReportInfoFloorConstructionDelete
		 * @request DELETE:/api/ReportInfo/floorConstruction
		 */
		reportInfoFloorConstructionDelete: (
			data: DeleteFloorConstructionCommand,
			params: RequestParams = {},
		) =>
			this.request<void, any>({
				path: `/api/ReportInfo/floorConstruction`,
				method: 'DELETE',
				body: data,
				type: ContentType.Json,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags ReportReceiving
		 * @name ReportReceivingSingleCreate
		 * @request POST:/api/ReportReceiving/single
		 */
		reportReceivingSingleCreate: (
			data: CreateSingleReportReceivingCommand,
			params: RequestParams = {},
		) =>
			this.request<void, any>({
				path: `/api/ReportReceiving/single`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags ReportReceiving
		 * @name ReportReceivingFloorCreate
		 * @request POST:/api/ReportReceiving/floor
		 */
		reportReceivingFloorCreate: (
			data: CreateFloorReportReceivingCommand,
			params: RequestParams = {},
		) =>
			this.request<void, any>({
				path: `/api/ReportReceiving/floor`,
				method: 'POST',
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
		 * @name RequirementExportCreate
		 * @request POST:/api/Requirement/export
		 */
		requirementExportCreate: (data: ExportRequirementQuery, params: RequestParams = {}) =>
			this.request<RequirementDto, any>({
				path: `/api/Requirement/export`,
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
		 * @name RequirementImportCreate
		 * @request POST:/api/Requirement/import
		 */
		requirementImportCreate: (
			data: {
				/** @format binary */
				formFile?: File;
			},
			params: RequestParams = {},
		) =>
			this.request<ImportResultDto, any>({
				path: `/api/Requirement/import`,
				method: 'POST',
				body: data,
				type: ContentType.FormData,
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

		/**
		 * No description
		 *
		 * @tags Subscription
		 * @name SubscriptionDetail
		 * @request GET:/api/Subscription/{id}
		 */
		subscriptionDetail: (id: string, params: RequestParams = {}) =>
			this.request<SubscriptionDto, any>({
				path: `/api/Subscription/${id}`,
				method: 'GET',
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Subscription
		 * @name SubscriptionGetPaginatedCreate
		 * @request POST:/api/Subscription/getPaginated
		 */
		subscriptionGetPaginatedCreate: (
			data: GetSubscriptionsWithPaginationParamsQuery,
			params: RequestParams = {},
		) =>
			this.request<SubscriptionDtoPaginatedList, any>({
				path: `/api/Subscription/getPaginated`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Subscription
		 * @name SubscriptionCreate
		 * @request POST:/api/Subscription
		 */
		subscriptionCreate: (data: CreateSubscriptionCommand, params: RequestParams = {}) =>
			this.request<SubscriptionDto, any>({
				path: `/api/Subscription`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Subscription
		 * @name SubscriptionDelete
		 * @request DELETE:/api/Subscription
		 */
		subscriptionDelete: (data: DeleteSubscriptionCommand, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/Subscription`,
				method: 'DELETE',
				body: data,
				type: ContentType.Json,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Subscription
		 * @name SubscriptionUpdate
		 * @request PUT:/api/Subscription
		 */
		subscriptionUpdate: (data: UpdateSubscriptionCommand, params: RequestParams = {}) =>
			this.request<SubscriptionDto, any>({
				path: `/api/Subscription`,
				method: 'PUT',
				body: data,
				type: ContentType.Json,
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags SvgConstruction
		 * @name SvgConstructionDetail
		 * @request GET:/api/SvgConstruction/{id}
		 */
		svgConstructionDetail: (id: string, params: RequestParams = {}) =>
			this.request<string, any>({
				path: `/api/SvgConstruction/${id}`,
				method: 'GET',
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags TariffPlan
		 * @name TariffPlanDetail
		 * @request GET:/api/TariffPlan/{id}
		 */
		tariffPlanDetail: (id: string, params: RequestParams = {}) =>
			this.request<TariffPlanDto, any>({
				path: `/api/TariffPlan/${id}`,
				method: 'GET',
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags TariffPlan
		 * @name TariffPlanDelete
		 * @request DELETE:/api/TariffPlan/{id}
		 */
		tariffPlanDelete: (id: string, data: DeleteTariffPlanCommand, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/TariffPlan/${id}`,
				method: 'DELETE',
				body: data,
				type: ContentType.Json,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags TariffPlan
		 * @name TariffPlanGetPaginatedCreate
		 * @request POST:/api/TariffPlan/getPaginated
		 */
		tariffPlanGetPaginatedCreate: (
			data: GetTariffPlanWithPaginationQuery,
			params: RequestParams = {},
		) =>
			this.request<TariffPlanDtoPaginatedList, any>({
				path: `/api/TariffPlan/getPaginated`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags TariffPlan
		 * @name TariffPlanCreate
		 * @request POST:/api/TariffPlan
		 */
		tariffPlanCreate: (
			data: {
				name?: string;
				resetInterval?: ResetInterval;
				/** @format double */
				credits?: number;
				/** @format double */
				coefficient?: number;
			},
			params: RequestParams = {},
		) =>
			this.request<TariffPlanDto, any>({
				path: `/api/TariffPlan`,
				method: 'POST',
				body: data,
				type: ContentType.FormData,
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags TariffPlan
		 * @name TariffPlanUpdate
		 * @request PUT:/api/TariffPlan
		 */
		tariffPlanUpdate: (
			data: {
				/** @format uuid */
				id?: string;
				name?: string;
				resetInterval?: ResetInterval;
				/** @format double */
				credits?: number;
				/** @format double */
				coefficient?: number;
			},
			params: RequestParams = {},
		) =>
			this.request<void, any>({
				path: `/api/TariffPlan`,
				method: 'PUT',
				body: data,
				type: ContentType.FormData,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags User
		 * @name UserGetPaginatedCreate
		 * @request POST:/api/User/get-paginated
		 */
		userGetPaginatedCreate: (
			data: GetUsersWithPaginationParamsQuery,
			params: RequestParams = {},
		) =>
			this.request<PaginatedUserDtoPaginatedList, any>({
				path: `/api/User/get-paginated`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags User
		 * @name UserDetail
		 * @request GET:/api/User/{id}
		 */
		userDetail: (id: string, params: RequestParams = {}) =>
			this.request<AccountDto, any>({
				path: `/api/User/${id}`,
				method: 'GET',
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags User
		 * @name UserDelete
		 * @request DELETE:/api/User
		 */
		userDelete: (data: DeleteUserCommand, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/User`,
				method: 'DELETE',
				body: data,
				type: ContentType.Json,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags User
		 * @name UserActiveUserSubscriptionList
		 * @request GET:/api/User/active-userSubscription
		 */
		userActiveUserSubscriptionList: (params: RequestParams = {}) =>
			this.request<PaginatedUserDto, any>({
				path: `/api/User/active-userSubscription`,
				method: 'GET',
				format: 'json',
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags User
		 * @name UserUpdateUpdate
		 * @request PUT:/api/User/update
		 */
		userUpdateUpdate: (
			data: {
				/** @format uuid */
				userId?: string;
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
				path: `/api/User/update`,
				method: 'PUT',
				body: data,
				type: ContentType.FormData,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags User
		 * @name UserRolesList
		 * @request GET:/api/User/roles
		 */
		userRolesList: (params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/User/roles`,
				method: 'GET',
				...params,
			}),
	};
	testAuth = {
		/**
		 * No description
		 *
		 * @tags Acoustics.API
		 * @name TestAuthDetail
		 * @request GET:/test-auth/{email}
		 */
		testAuthDetail: (email: string, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/test-auth/${email}`,
				method: 'GET',
				...params,
			}),
	};
}
