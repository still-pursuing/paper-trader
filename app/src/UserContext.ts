import {createContext} from 'react';

interface UserContextInterface{
    username: string;
}

const UserContext = createContext<UserContextInterface | null>(null);

export default UserContext;