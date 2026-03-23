import { ConsignmentApiDto, TransportMode } from './types';

export const mockConsignments: ConsignmentApiDto[] = [
  {
    platformId: 'SE-TRAFA-01',
    datasetId: 'DS-2024-SE-448291',
    gateId: 'SE',
    consignment: {
      id: 'CONS-2024-448291',
      carrierAcceptanceDateTime: '2024-11-14T08:30:00Z',
      transportEquipment: [
        {
          id: 'ABCU1234567',
          categoryCode: 'CN',
          sequenceNumber: 1,
          registrationCountryCode: 'SE',
          dangerousGoodsIndicator: false,
          grossWeightMeasure: 24500,
          grossVolumeMeasure: 86,
          sealIds: ['SEAL-001'],
        },
      ],
      transportMovements: [
        {
          id: 'MOV-001',
          modeCode: TransportMode.ROAD,
          dangerousGoodsIndicator: false,
          registrationCountryCode: 'SE',
          usedTransportEquipmentId: 'ABCU1234567',
          departureLocation: {
            name: 'Stockholm Frihamnen',
            cityName: 'Stockholm',
            countryCode: 'SE',
            latitude: 59.3293,
            longitude: 18.0686,
          },
          arrivalLocation: {
            name: 'Hamburg Hafen',
            cityName: 'Hamburg',
            countryCode: 'DE',
            latitude: 53.5461,
            longitude: 9.9958,
          },
          carrierName: 'Nordic Freight AB',
        },
      ],
      customsProcedure: {
        exportCustomsOffice: 'SE001000',
        importCustomsOffice: 'DE003011',
        procedureTypeCode: 'EX',
      },
      parties: [
        {
          id: 'PARTY-001',
          name: 'Nordic Freight AB',
          roleCode: 'CA',
          countryCode: 'SE',
        },
        {
          id: 'PARTY-002',
          name: 'Maschinen GmbH',
          roleCode: 'CN',
          countryCode: 'DE',
        },
      ],
      pickupLocation: {
        name: 'Stockholm Frihamnen',
        cityName: 'Stockholm',
        countryCode: 'SE',
      },
      deliveryLocation: {
        name: 'Hamburg Hafen',
        cityName: 'Hamburg',
        countryCode: 'DE',
      },
    },
  },
  {
    platformId: 'SE-TRAFA-01',
    datasetId: 'DS-2024-SE-331057',
    gateId: 'SE',
    consignment: {
      id: 'CONS-2024-331057',
      carrierAcceptanceDateTime: '2024-11-13T14:15:00Z',
      transportEquipment: [
        {
          id: 'MSCU7654321',
          categoryCode: 'CN',
          sequenceNumber: 1,
          registrationCountryCode: 'SE',
          dangerousGoodsIndicator: true,
          grossWeightMeasure: 18200,
          grossVolumeMeasure: 67,
          sealIds: ['SEAL-DG-009', 'SEAL-DG-010'],
        },
      ],
      transportMovements: [
        {
          id: 'MOV-002',
          modeCode: TransportMode.SEA,
          dangerousGoodsIndicator: true,
          registrationCountryCode: 'SE',
          usedTransportEquipmentId: 'MSCU7654321',
          departureLocation: {
            name: 'Göteborgs hamn',
            cityName: 'Göteborg',
            countryCode: 'SE',
            latitude: 57.7089,
            longitude: 11.9746,
          },
          arrivalLocation: {
            name: 'Rotterdam Haven',
            cityName: 'Rotterdam',
            countryCode: 'NL',
            latitude: 51.9244,
            longitude: 4.4777,
          },
          carrierName: 'Stena Line AB',
        },
      ],
      customsProcedure: {
        exportCustomsOffice: 'SE002000',
        importCustomsOffice: 'NL000510',
        procedureTypeCode: 'EX',
      },
      parties: [
        {
          id: 'PARTY-003',
          name: 'Stena Line AB',
          roleCode: 'CA',
          countryCode: 'SE',
        },
        {
          id: 'PARTY-004',
          name: 'Chemie BV',
          roleCode: 'CN',
          countryCode: 'NL',
        },
      ],
      pickupLocation: {
        name: 'Göteborgs hamn',
        cityName: 'Göteborg',
        countryCode: 'SE',
      },
      deliveryLocation: {
        name: 'Rotterdam Haven',
        cityName: 'Rotterdam',
        countryCode: 'NL',
      },
    },
  },
];

export const mockQRPayload = {
  datasetId: 'DS-2024-SE-448291',
  gateId: 'SE',
  platformId: 'SE-TRAFA-01',
};
