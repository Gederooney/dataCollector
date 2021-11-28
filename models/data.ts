import { Schema, model } from "mongoose";
import { IData } from "../src/inerfaces";

const DataSchema = new Schema<IData>({
  id: { type: Number, required: [true, "An id is required"] },
  date: { type: String, required: [true, "A date is required"] },
  data: [
    {
      league: {
        uid: { type: String },
        midsizeName: { type: String },
        name: { type: String },
        season: {
          type: { hasStandings: Boolean },
        },
        id: { type: String },
        abbreviation: { type: String },
        slug: { type: String },
      },
      season: {
        year: { type: Number },
        type: { type: Number },
        slug: { type: String },
      },
      day: { date: { type: String } },
      events: [
        {
          date: { type: String },
          uid: { type: String },
          leagueId: { type: String },
          name: { type: String },
          season: {
            year: { type: Number },
            type: { type: Number },
            slug: { type: String },
          },
          isTopEvent: { type: Boolean },
          id: { type: String },
          shortName: { type: String },
          status: {
            period: { type: Number },
            displayClock: { type: String },
            clock: { type: Number },
            type: {
              name: { type: String },
              description: { type: String },
              id: { type: String },
              state: { type: String },
              completed: { type: Boolean },
              detail: { type: String },
              shortDetail: { type: String },
            },
          },
          links: [
            {
              isExternal: { type: Boolean },
              shortText: { type: String },
              rel: [{ type: String }],
              language: { type: String },
              href: { type: String },
            },
          ],
          competitions: [
            {
              date: { type: String },
              venue: {
                address: {
                  country: { type: String },
                  city: { type: String },
                },
                fullName: { type: String },
                id: { type: String },
                capacity: { type: Number },
              },
              conferenceCompetition: { type: Boolean },
              competitors: [
                {
                  uid: { type: String },
                  homeAway: { type: String },
                  score: { type: String },
                  winner: { type: Boolean },
                  form: { type: String },
                  records: [
                    {
                      summary: { type: String },
                      name: { type: String },
                      abbreviation: { type: String },
                      type: { type: String },
                    },
                  ],
                  id: { type: String },
                  team: {
                    shortDisplayName: { type: String },
                    uid: { type: String },
                    alternateColor: { type: String },
                    color: { type: String },
                    displayName: { type: String },
                    name: { type: String },
                    logo: { type: String },
                    location: { type: String },
                    links: [
                      {
                        isExternal: { type: Boolean },
                        rel: [{ type: String }],
                        text: { type: String },
                        href: { type: String },
                        isPremium: { type: Boolean },
                      },
                    ],
                    id: { type: String },
                    abbreviation: { type: String },
                    isActive: { type: Boolean },
                  },
                  type: { type: String },
                  order: { type: Number },
                  statistics: [
                    {
                      displayValue: { type: String },
                      name: { type: String },
                      abbreviation: { type: String },
                    },
                  ],
                },
              ],
              details: [
                {
                  redCard: { type: Boolean },
                  shootout: { type: Boolean },
                  athletesInvolved: [
                    {
                      displayName: { type: String },
                      jersey: { type: String },
                      fullName: { type: String },
                      links: [{ rel: [String], href: { type: String } }],
                      id: { type: String },
                      position: { type: String },
                      team: { id: { type: String } },
                      shortName: { type: String },
                    },
                  ],
                  yellowCard: { type: Boolean },
                  scoringPlay: { type: Boolean },
                  clock: {
                    displayValue: { type: String },
                    value: { type: Number },
                  },
                  team: { id: { type: String } },
                  ownGoal: { type: Boolean },
                  penaltyKick: { type: Boolean },
                  scoreValue: { type: Number },
                },
              ],
              id: { type: String },
              neutralSite: { type: Boolean },
              recent: { type: Boolean },
              attendance: { type: Number },
              situation: { $ref: { type: String } },
              startDate: { type: String },
              status: {
                period: { type: Number },
                displayClock: { type: String },
                clock: { type: Number },
                type: {
                  name: { type: String },
                  description: { type: String },
                  id: { type: String },
                  state: { type: String },
                  completed: { type: Boolean },
                  detail: { type: String },
                  shortDetail: { type: String },
                },
              },
            },
          ],
        },
      ],
    },
  ],
});
const Datamodel = model<IData>("data", DataSchema);

export default Datamodel;
