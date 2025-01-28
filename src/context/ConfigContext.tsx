import React, { createContext, ReactNode, useContext } from 'react';
import { AppConfig } from '../@types';
import config from '../app.config.json';


type ConfigProviderProps = {
  children: ReactNode;
};

const ConfigContext = createContext<AppConfig>(config as AppConfig);

export const useConfig = (): AppConfig => useContext(ConfigContext);


// Export the provider component
export const ConfigProvider: React.FC<ConfigProviderProps> = ({ children }) => {
  return (
    <ConfigContext.Provider value={config}>
      {children}
    </ConfigContext.Provider>
  );
};