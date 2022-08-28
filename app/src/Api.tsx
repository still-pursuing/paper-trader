import axios from "axios";

import { BACKEND_BASE_URL } from "./config";

class PaperTraderApi {

    /**
     * Generates a random string of characters
     * 
     * Returns:
     *  a string of characters, e.g. e-[B~(v-l"N]Wx?9%2w(
     */
    static generateRandomString() {
        let randomString = '';
        const randomNumber = Math.floor(Math.random() * 10);

        for (let i = 0; i < 20 + randomNumber; i++) {
            randomString += String.fromCharCode(33 + Math.floor(Math.random() * 94));
        }
        return randomString;
    }


    /** Makes a request to server with Discord OAuth authorization code input
     * 
     * Returns: 
     *  "discord_username"
     */
    static async getDiscordUser(code: string) {
        const discordUserData = (await axios.get(`${BACKEND_BASE_URL}/login?code=${code}`)).data.user;
        return discordUserData;
    }
}

export default PaperTraderApi;