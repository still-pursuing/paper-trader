import axios from "axios";

import { BACKEND_BASE_URL } from "./config";

class PaperTraderApi {

    /** Makes a request to server with Discord OAuth authorization code input
     * 
     * Returns: 
     *  "discord_username"
     */
    static async getDiscordUser(code: string) {
        const discordUserData = await (await axios.get(`${BACKEND_BASE_URL}/login?code=${code}`)).data.user;
        return discordUserData;
    }
}

export default PaperTraderApi;