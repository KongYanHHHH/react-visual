import { createContext } from 'react';

export const SetGlobalStateFnContext = createContext<Function | undefined>(
    undefined,
);
