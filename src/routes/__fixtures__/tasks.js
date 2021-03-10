const baseTask = {
  movementStatus: 'PF - Empty Vehicle',
  mode: 'RORO Accompanied Freight',
  matchedSelectors: [
    {
      threatType: 'National Security at the Border',
      priority: 'Category A',
    },
    {
      threatType: 'Cash Paid',
      priority: 'Tier 4',
    },
  ],
  departureTime: '2020-03-15T09:39:21',
  arrivalTime: '2020-03-16T09:39:21',
  people: [
    {
      fullName: 'Bob',
      dateOfBirth: '1963-05-12',
      gender: 'M',
      role: 'DRIVER',
    },
    {
      fullName: 'Jane',
      dateOfBirth: '1963-05-12',
      gender: 'F',
      role: 'PASSENGER',
    },
  ],
  vehicles: [{
    registrationNumber: 'LG67 ABY',
    description: 'Hatchback',
  },
  {
    registrationNumber: 'ZS026ME',
    description: null,
  },
  ],
  trailers: [{
    registrationNumber: 'CR66 PRT',
    description: 'Caravan',
  },
  {
    registrationNumber: 'ZS026ME',
    description: 'Ford Fiesta',
  },
  ],
  organisations: [
    {
      name: 'Volkman LLC',
      type: 'ORGACCOUNT',
    },
    {
      name: 'Monsters Inc',
      type: 'ORGBOOKER',
    },
    {
      name: 'Sauer Incorporated Worldwide',
      type: 'ORGHAULIER',
    },
  ],
  freight: {
    hazardousCargo: '',
    descriptionOfCargo: 'Widgets', // Goods description
  },
  bookingDateTime: '2020-03-15T09:39:21',
  aggregateDriverTrips: 3,
  aggregateVehicleTrips: 3,
  aggregateTrailerTrips: 2,
  voyage: {
    departFrom: 'DUN',
    arriveAt: 'DOV',
    description: 'Stena Line voyage of Stena Superfast VII',
  },
  changes: 1,
  consignor: {
    name: 'Kameko K. Velez',
    address: 'Ap #211-4467 Dui, Rd. Bhuj Fiji 7766',
  },
  consignee: {
    name: 'Autumn S. Dalton',
    address: 'P.O. Box 897, 7714 Dictum. Rd. Kassel Canada 503607',
  },
  consignment: {
    mawb: '110-49759200',
    countryOfOrigin: '',
    mode: 'FP',
    carrier: 'ICELANDAIR',
    hawb: '42143636',
    weight: 55.02,
    numberOfPieces: 94,
    shipmentValue: 17.50,
  },
  updated: '2020-10-05T09:39:21',
};

const tasks = [...Array(10)].map((_, i) => ({
  movementId: `2021-5891${i}`,
  businessKey: `CERB-2021-5891${i}`,
  activity: [
    {
      date: '2020-10-05T09:39:21',
      by: 'john.doe@homeoffice.gov.uk',
      note: 'Leverage agile frameworks to provide a robust synopsis for high level overviews.',
    },
    {
      date: '2020-10-03T09:39:21',
      by: 'test.example@homeoffice.gov.uk',
      note: 'Target sheet submitted',
    },
    {
      date: '2020-10-02T09:39:21',
      by: 'test2.example@homeoffice.gov.uk',
      note: 'Bring to the table win-win survival strategies to ensure proactive domination. At the end of the day, going forward, a new normal that has evolved from generation X is on the runway heading towards a streamlined cloud solution. User generated content in real-time will have multiple touchpoints for offshoring.',
    },
    {
      date: '2020-10-01T09:39:21',
      by: 'test3.example@homeoffice.gov.uk',
      note: 'Capitalize on low hanging fruit to identify a ballpark value added activity to beta test.',
    },
  ],
  versions: [
    baseTask,
    baseTask,
    baseTask,
  ],
}));

export default tasks;
