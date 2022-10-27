import { createContext } from 'react';

const UserContext = createContext<string | undefined>(undefined);

export default UserContext;
