
import { Pane, Heading, Spinner, Paragraph } from "evergreen-ui";
import { useSearchParams } from 'react-router-dom'
import axios from 'axios';
import { useEffect, useState } from "react";
/**
 * Props:
 * - None
 * 
 * State:
 * - csrfToken: string to append to Discord OAuth URL
 * 
 * Events:
 * - None
 * 
 * App --> Login
 */

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8080";

function DiscordRedirect() {
    // pull url params, then make an axios call to backend
    // needed when redirecting back from Discord
    const [searchParams, setSearchParams] = useSearchParams();
    const [user, setUser] = useState('');


    console.log('code:', searchParams.get('code'), 'state:', searchParams.get('state'));
    console.log('does state param = csrf string?', searchParams.get('state'), localStorage['token'], searchParams.get('state') === localStorage['token'])

    useEffect(function callBackend() {
        async function accessBackend() {
            try {
                const userInfo = (await axios.get(`${BASE_URL}/login?code=${searchParams.get('code')}`)).data.user;

                console.log('effect', userInfo)
                setUser(userInfo);
            } catch (err) {
                console.error(err)
            }
        }
        accessBackend();
    }, [user, searchParams])

    // console.log(`The current user is: ${user}`)

    return (
        <Pane display="flex" flexDirection="column" alignItems="center">
            <Heading is="h1" size={900}>
                Discord Redirect Page
            </Heading>
            {user.length === 0
                ? <Spinner />
                : <Paragraph> Hi {user}</Paragraph>
            }
        </Pane >
    )
}

export default DiscordRedirect;