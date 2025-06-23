

export type Event = {
  id: string;
  eventId: string;
  title: string;
  description: string;
  socialIssue: string;
  status: string;
  lastChange: string;
  date: string;
  dateISO: string | null;
  shortDate: string;
  startTime: string;
  endTime: string;
  weekDay: number;
  weekDayName: string;
  topic: string;
  topic2: string;
  category: string;
  eventType: string;
  location: {

    description: string;
    longitude: number;
    latitude: number;
  };
  organizer: string[];
  persons: any; // or a more specific type if known
  contactPerson1: {
    name: string;
    title: string;
    org: string;
    phone: string;
    email: string;
  };
  contactPerson2: any; // or a more specific type if known
  url: string;
  uri: string;
  urls: {
    facebookUrl: string;
    url1: string;
  };
  digitalStream: string;
  digitalStreamUrl: string;
  digitalArchiveUrl: string;
  digitalMeeting: string;
  color: {
    main: string;
    item: string;
    itemSecondary: string;
  };
  showEmail: string;
  showPhone: string;
  languages: string;
  accessibility: string[];
  environmental: {
    stationary: string;
    serviceTravel: string;
    serviceCooking: string;
    recycling: string;
    certified: string;
    battery: string;
    noFood: string;
    disposable: string;
    sourceSorting: string;
  };
  interactiveLink: string;
  interactiveLinkDescription: string;
  streamService: string;
};

export type EventResponse = {
  data: Event[];
  pagination: {
    perPage: number;
    page: number;
    total: number;
    totalPages: number
  };
};
