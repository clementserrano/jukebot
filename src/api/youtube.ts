import { Readable } from "stream";
import ytdl from "ytdl-core";
import secrets from "../../secrets.json";
export class YoutubeClient {    
    constructor() {
    }

    public async getTitle(url: string): Promise<string> {
        return (await ytdl.getInfo(url)).videoDetails.title;
    }

    public async streamMP3(url: string): Promise<Readable> {
        return ytdl(url, {filter: "audioonly", quality: 'lowestaudio', requestOptions: {
            headers: {
              cookie: secrets.youtube,
            },
          }, highWaterMark: 1 << 25});
    }

    public isYoutubeLink(url: string){

    }
}