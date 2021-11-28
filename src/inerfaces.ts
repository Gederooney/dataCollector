// Mongoose connection options

import { Mongoose } from "mongoose";

export interface ConnectionOptions {
  useNewUrlParser: boolean;
  useUnifiedTopology: boolean;
  authSource: "admin";
}

// end of mongoose

export interface ReturnType {
  sucess: boolean;
  message: string;
}

export interface ILeague {
  uid: string;
  midsizeName: string;
  name: string;
  season: {
    type: { hasStandings: boolean };
  };
  id: string;
  abbreviation: string;
  slug: string;
}
export interface ISeason {
  year: number;
  type: number;
  slug: string;
}
export interface IStatus {
  period: number;
  displayClock: string;
  clock: number;
  type: {
    name: string;
    description: string;
    id: string;
    state: string;
    completed: boolean;
    detail: string;
    shortDetail: string;
  };
}
export interface IElink {
  isExternal: boolean;
  shortText: string;
  rel: string[];
  language: string;
  href: string;
}
export interface IECaddress {
  country: string;
  city: string;
}
export interface IECvenue {
  address?: IECaddress;
  fullName: string;
  id: string;
  capacity: number;
}

export interface IECCrecords {
  summary: string;
  name: string;
  abbreviation: string;
  type: string;
}
export interface IECCTlink {
  isExternal: boolean;
  rel: string[];
  text: string;
  href: string;
  isPremium: boolean;
}
export interface IECCteam {
  shortDisplayName: string;
  uid: string;
  alternateColor: string;
  color: string;
  displayName: string;
  name: string;
  logo: string;
  location: string;
  links: IECCTlink[];
  id: string;
  abbreviation: string;
  isActive: boolean;
}
export interface IECCstatistics {
  displayValue: string;
  name: string;
  abbreviation: string;
}

export interface IECcompetitor {
  uid: string;
  homeAway: string;
  score: string;
  winner: boolean;
  form: string;
  records: IECCrecords[];
  id: string;
  team: IECCteam;
  type: string;
  order: number;
  statistics: IECCstatistics[];
}
export interface IECDathletesInvolved {
  displayName: string;
  jersey: string;
  fullName: string;
  links: [{ rel: string; href: string }];
  id: string;
  position: string;
  team: { id: string };
  shortName: string;
}
export interface IECdetail {
  redCard: boolean;
  shootout: boolean;
  athletesInvolved: IECDathletesInvolved[];
  yellowCard: boolean;
  scoringPlay: boolean;
  clock: { displayValue: string; value: number };
  team: { id: string };
  ownGoal: boolean;
  penaltyKick: boolean;
  scoreValue: number;
}
export interface IECStype {
  name: string;
  description: string;
  id: string;
  state: string;
  completed: boolean;
  detail: string;
  shortDetail: string;
}

export interface IECstatus {
  period: number;
  displayClock: string;
  clock: number;
  type: IECStype;
}
export interface IEcompetition {
  date: string;
  venue?: IECvenue;
  conferenceCompetition: boolean;
  competitors: IECcompetitor[];
  details: IECdetail[];
  id: string;
  neutralSite: boolean;
  recent: boolean;
  attendance: boolean;
  situation: { $ref: string };
  startDate: string;
  status: IECstatus;
}
export interface IEvent {
  date: string;
  uid: string;
  leagueId: string;
  name: string;
  season: ISeason;
  isTopEvent: boolean;
  id: string;
  shortName: string;
  status: IStatus;
  links: IElink[];
  competitions: IEcompetition[];
}
export interface IScore {
  league: ILeague;
  season: ISeason;
  day: { date: string };
  events: IEvent[];
}
export interface IData {
  id: number;
  date: string;
  data: IScore[];
}
