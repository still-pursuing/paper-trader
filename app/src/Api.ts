import axios from "axios";

import { BACKEND_BASE_URL } from "./config";

class PaperTraderApi {
    static token : string;

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
    static async getCurrentUser(username: string) {
        const config = {
            headers: {
                'Authorization': `Bearer ${PaperTraderApi.token}`
            }
        }

        const result = (await axios.get(
            `${BACKEND_BASE_URL}/users/${username}`,
            config
            )).data.user;
        console.log({result})
        return result;
    }

}

export default PaperTraderApi;