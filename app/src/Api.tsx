import axios from "axios";

const BACKEND_BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8080";

class PaperTraderApi {

    /** Makes a request to server with Discord OAuth authorization code
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