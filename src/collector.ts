import axios, { AxiosResponse } from "axios";
import cheerio, { load } from "cheerio";
import { IScore, IData } from "./inerfaces";
import { Server } from "socket.io";
import { Logger } from "tslog";
import dotenv from "dotenv";
import Datamodel from "../models/data";
import { formatDate } from "../utils/date";
import fs from "fs";

type CheerioRoot = ReturnType<typeof load>;

const log = new Logger({ name: "Server roots logs" });
dotenv.config();

export default class Collector {
  url: string = process.env.SOCCER_DATA_URL || "";
  async fetchHtml(): Promise<string | null> {
    try {
      log.info(`Fetching html from ${this.url}`);
      if (this.url !== "") {
        const res: AxiosResponse = await axios.get(this.url);
        return res.data;
      } else {
        return null;
      }
    } catch (err) {
      log.debug({
        source: "collector",
        message: "There was an error while fetching html",
        error: `${err}`,
      });
      return null;
    }
  }
  async parseData(res: string | null): Promise<IScore[] | null> {
    if (!res) return null;
    const $: CheerioRoot = cheerio.load(res);
    const scripts: Array<any> = $("script").toArray();
    const soccerDataScript = scripts.find((script) => {
      return (
        script.children[0] &&
        script.children[0].data.includes("window.espn.scoreboardData")
      );
    })?.children[0].data;
    const parsedData = soccerDataScript
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
      rtn = scores.map((s: any) => {
        let events = [];
        if (s.events) {
          events = s.events.map((e: any) => {
            const competitions = e.competitions.map((c: any) => {
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
  async saveDataInDB(res: IScore[] | null): Promise<IData | null> {
    const date: string = formatDate();
    if (res) {
      try {
        let data = await Datamodel.findOne({ date: date });
        if (data) {
          data = await Datamodel.findOneAndUpdate(
            { date: date },
            { $set: res },
            { new: true }
          );
          log.info("Data are updated");
        } else {
          data = new Datamodel({
            id: new Date().getTime(),
            date: date,
            data: res,
          });
          await data.save();
          log.info("Data saved to db");
        }
      } catch (error) {
        log.debug(error);
      }
      return { id: new Date().getTime(), date: date, data: res };
    }
    return null;
  }
  async run(io: Server): Promise<void> {
    this.fetchHtml()
      .then((res) => this.parseData(res))
      .then((res) => this.saveDataInDB(res))
      .then((res) => {
        res && io.emit("dataUpdated", res);
      })
      .catch((err) => {
        log.debug("An Error occured while trying to update or fectch data");
        log.debug(`${err}`);
      });
  }
}
