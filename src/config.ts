import { workspace } from 'coc.nvim';

import { IPLSClientConfig } from './p_ls';
import { INavigatorClientConfig } from './navigator';
import { IPlsClientConfig } from './pls-installer';

/* Only hold values that are required by the client to start the server, other
* than that, let coc.nvim handle the configuration options transmission. */
export interface IClientConfig {
  navigator: INavigatorClientConfig | any;
  pls: IPLSClientConfig | any;
  plsNew: IPlsClientConfig | any;
}

export function getConfig(): IClientConfig {
  const navConfig = workspace.getConfiguration('perlnavigator');
  const plsConfig = workspace.getConfiguration('perl');
  const plsNewConfig = workspace.getConfiguration('pls');

  const config: IClientConfig = {
    navigator: {
      enable: navConfig.get('enable') as boolean,
      serverPath: navConfig.get('serverPath') as string,
    },
    pls: plsConfig,
    plsNew: {
      enable: plsNewConfig.get('enable', false) as boolean,
      serverPath: plsNewConfig.get('serverPath', '') as string,
      perlPath: plsNewConfig.get('perlPath', 'perl') as string,
      logLevel: plsNewConfig.get('logLevel', 0) as number,
      logFile: plsNewConfig.get('logFile', '') as string,
      includePaths: plsNewConfig.get('includePaths', []) as string[],
    },
  };
  return config;
}
