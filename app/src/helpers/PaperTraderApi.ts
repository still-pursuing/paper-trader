import axios from "axios";

import { BACKEND_BASE_URL } from "../config";

class PaperTraderApi {
    static token : string;
    /** 
     * Makes a request to server with Discord OAuth authorization code input
     * 
     * Returns: 
     *  "discord_username"
     */
    static async getDiscordUser(code: string) {
        const userToken = (await axios.get(`${BACKEND_BASE_URL}/login?code=${code}`)).data.token;
        return userToken;
    }

    /** 
     * Makes a request to server with JWT token from localStorage
     * 
     * Returns: 
     *  "username"
     */
    static async getUserProfile() {
        const config = {
            headers: {
                'Authorization': `Bearer ${PaperTraderApi.token}`
            }
        }

        const result = (await axios.get(
            `${BACKEND_BASE_URL}/profile`,
            config
            )).data.userPortfilio;
        return result;
    }

}

export default PaperTraderApi;