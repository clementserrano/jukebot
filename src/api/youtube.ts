import { Readable } from "stream";
import ytdl from "ytdl-core";
export class YoutubeClient {    
    constructor() {
    }

    public async getTitle(url: string): Promise<string> {
        return (await ytdl.getInfo(url)).videoDetails.title;
    }

    public async streamMP3(url: string): Promise<Readable> {
        return ytdl(url, {filter: "audioonly", highWaterMark: 1 << 25});
    }

    public isYoutubeLink(url: string){

    }
}