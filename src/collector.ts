import axios, { AxiosResponse } from "axios";
import cheerio, { CheerioAPI } from "cheerio";
import { ReturnType, IScore } from "./inerfaces";
import { Logger } from "tslog";
import dotenv from "dotenv";
import Datamodel from "../models/data";
import { formatDate } from "../utils/date";
import fs from "fs";

const log = new Logger({ name: "SoccerData logs" });
dotenv.config();

export default class Collector {
  url: string = process.env.SOCCER_DATA_URL || "";
  data: any;
  async fetchHtml(): Promise<any | ReturnType> {
    try {
      log.info({
        Source: "Collector",
        message: `Feching html from ${this.url}`,
      });
      if (this.url !== "") {
        const res: AxiosResponse = await axios.get(this.url);
        return { sucess: true, data: res.data };
      } else {
        return { sucess: false, message: "No link was found in env" };
      }
    } catch (err: any) {
      log.debug({
        source: "collector",
        message: "There was an error while fetching html",
        error: `${err.message}`,
      });
      return { sucess: false, message: `${err.message}` };
    }
  }
  async parseData(data: any): Promise<IScore[] | ReturnType> {
    if (!data) {
      return {
        sucess: false,
        message: "No data was received. Couldn't proceed",
      };
    }
    const $: CheerioAPI = cheerio.load(data);
    const scripts: Array<any> = $("script").toArray();
    const soccerDataScript = scripts.find((script) => {
      return (
        script.children[0] &&
        script.children[0].data.includes("window.espn.scoreboardData")
      );
    })?.children[0].data;
    let parsedData = soccerDataScript
      .replace("window.espn.scoreboardData", "")
      .replace("=", "")
      .replace(
        'if(!window.espn_ui.device.isMobile){window.espn.loadType = "ready"};',
        ""
      )
      .replace(/;/g, "")
      .split("window.espn.scoreboardSettings")[0]
      .trim();

    const { scores } = await JSON.parse(parsedData);
    let rtn: IScore[] = [];
    if (scores) {
      rtn = scores.map((s: any, i: number) => {
        let events = [];
        if (s.events) {
          events = s.events.map((e: any) => {
            let competitions = e.competitions.map((c: any) => {
              return {
                date: c.date,
                venue: c.venue,
                conferenceCompetition: c.conferenceCompetition,
                note: c.note,
                competitors: c.competitors,
                odds: c.odds,
                details: c.details,
                airings: c.airings,
                id: c.id,
                neutralSite: c.neutralSite,
                recent: c.recent,
                attendance: c.attendance,
                situation: c.situation,
                startDate: c.startDate,
                status: c.status,
              };
            });
            return {
              date: e.date,
              uid: e.uid,
              leagueId: e.leagueId,
              name: e.name,
              season: e.season,
              isTopEvent: e.isTopEvent,
              id: e.id,
              shortName: e.shortName,
              status: e.status,
              links: e.links,
              competitions,
            };
          });
        }
        return {
          league: {
            uid: s.leagues[0].uid,
            midsizeName: s.leagues[0].midsizeName,
            name: s.leagues[0].name,
            season: s.leagues[0].season,
            id: s.leagues[0].id,
            abbreviation: s.leagues[0].abbreviation,
            slug: s.leagues[0].slug,
          },
          season: s.season,
          day: s.day,
          events: events,
        };
      });
    }
    return rtn;
  }
  async saveDataInDB(data: any): Promise<void> {
    if (data) {
      try {
        const date: string = formatDate();
        const find = await Datamodel.findOne({
          date: date,
        });
        if (!find) {
          const newScore = new Datamodel({
            id: new Date().getTime(),
            date: date,
            data: data,
          });
          await newScore.save();
          log.info("Saved to db");
        } else {
          Datamodel.findOneAndUpdate({ date: date }, { data: data });
          log.info("data updated");
        }
      } catch (error) {
        console.log(error);
        log.debug({
          source: "collector saving to db",
          message: "Failed while saving to db",
        });
      }
    }
  }
  async run(): Promise<void> {
    this.fetchHtml()
      .then((res: ReturnType | any) => {
        const { sucess, data } = res;
        if (sucess)
          this.parseData(data).then(async (data) => {
            this.saveDataInDB(data);
          });
      })
      .catch((error) => {
        log.debug({
          source: "collector",
          message: "there was an error with cheerio",
          error: `${error.message}`,
        });
      });
  }
}
