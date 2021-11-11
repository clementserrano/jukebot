import { Readable } from "stream";
import Youtube from "youtube.ts";
import secrets from '../../secrets.json';
export class YoutubeClient {
    private youtube: Youtube;
    
    constructor() {
        this.youtube = new Youtube(secrets.youtube.key);
    }

    public async getTitle(url: string): Promise<string> {
        return this.youtube.util.getTitle(url);
    }

    public async streamMP3(url: string): Promise<Readable> {
        return this.youtube.util.streamMP3(url);
    }

    public isYoutubeLink(url: string){

    }
}