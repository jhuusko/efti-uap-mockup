export enum TransportMode {
  RAIL = '1',
  ROAD = '2',
  SEA = '3',
  AIR = '4',
  WATERWAY = '5',
}

export const TransportModeLabel: Record<TransportMode, string> = {
  [TransportMode.RAIL]: 'Järnväg',
  [TransportMode.ROAD]: 'Väg',
  [TransportMode.SEA]: 'Sjö',
  [TransportMode.AIR]: 'Luft',
  [TransportMode.WATERWAY]: 'Inre vattenvägar',
};

export enum RequestStatus {
  PENDING = 'PENDING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR',
  TIMEOUT = 'TIMEOUT',
}

export interface UILQuery {
  datasetId: string;
  gateId: string;
  platformId: string;
  subsetId?: string;
}

export interface IdentifierQuery {
  identifier: string;
  modeCode?: TransportMode;
  identifierType?: string[];
  registrationCountryCode?: string;
  dangerousGoodsIndicator?: boolean;
  eftiGateIndicator?: string[];
}

export interface Authority {
  id: string;
  country: string;
  name: string;
  nationalUniqueIdentifier?: string;
}

export interface LogisticsLocation {
  id?: string;
  name?: string;
  latitude?: number;
  longitude?: number;
  countryCode?: string;
  cityName?: string;
}

export interface TransportEquipment {
  id: string;
  categoryCode?: string;
  sequenceNumber?: number;
  registrationCountryCode?: string;
  dangerousGoodsIndicator?: boolean;
  grossWeightMeasure?: number;
  grossVolumeMeasure?: number;
  sealIds?: string[];
}

export interface TransportMovement {
  id?: string;
  modeCode?: TransportMode;
  dangerousGoodsIndicator?: boolean;
  registrationCountryCode?: string;
  usedTransportEquipmentId?: string;
  departureLocation?: LogisticsLocation;
  arrivalLocation?: LogisticsLocation;
  carrierName?: string;
}

export interface CustomsProcedure {
  exportCustomsOffice?: string;
  importCustomsOffice?: string;
  transitCustomsOffice?: string;
  procedureTypeCode?: string;
}

export interface TradeParty {
  id?: string;
  name?: string;
  roleCode?: string;
  countryCode?: string;
}

export interface SupplyChainConsignment {
  id?: string;
  carrierAcceptanceDateTime?: string;
  deliveryEventActualOccurrenceDatetime?: string;
  transportEquipment?: TransportEquipment[];
  transportMovements?: TransportMovement[];
  customsProcedure?: CustomsProcedure;
  parties?: TradeParty[];
  pickupLocation?: LogisticsLocation;
  deliveryLocation?: LogisticsLocation;
}

export interface ConsignmentApiDto {
  platformId: string;
  datasetId: string;
  gateId: string;
  consignment: SupplyChainConsignment;
}

export interface RequestResult {
  requestId: string;
  status: RequestStatus;
  queryType: 'uil' | 'identifiers';
  query: UILQuery | IdentifierQuery;
  data?: ConsignmentApiDto[];
  errorDescription?: string;
  submittedAt: string;
}

export interface RecentSearch {
  requestId: string;
  queryType: 'uil' | 'identifiers';
  summary: string;
  submittedAt: string;
}
