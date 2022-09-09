import {createContext} from 'react';

interface UserContextInterface{
    username: string;
}

const UserContext = createContext<UserContextInterface | undefined>(undefined);

export default UserContext;