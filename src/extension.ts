import { ExtensionContext, LanguageClient } from 'coc.nvim';

import { getConfig } from './config';
import { getPLSClient } from './p_ls';
import { getNavigatorClient } from './navigator';
import { getPlsClient } from './pls';
import { installNavigator, installPLS } from './installer';
import { isPlsInstalled, installPls } from './pls-installer';

const PLSVersion = '2.6.2';
const NavigatorVersion = '0.8.15';
const PlsVersion = '0.1.0';

export async function activate(context: ExtensionContext) {
  let client: LanguageClient;
  const config = getConfig();

  const enabledServers = [
    config.pls.enable,
    config.navigator.enable,
    config.plsNew.enable
  ].filter(Boolean).length;

  if (enabledServers === 0) {
    console.error('coc-perl activated, but no server enabled');
    return;
  } else if (enabledServers > 1) {
    console.error('coc-perl activated, but more than one server enabled');
    return;
  }

  if (config.navigator.enable) {
    const [installed, newConfig] = await installNavigator(
      context,
      config.navigator,
      NavigatorVersion
    );
    if (!installed) return;

    config.navigator = newConfig;
    client = getNavigatorClient(config.navigator.serverPath);
    console.log(`server Perl Navigator ${NavigatorVersion} enabled`);
  } else if (config.pls.enable) {
    const installed = await installPLS(config.pls, PLSVersion);
    if (!installed) return;
    client = await getPLSClient(config.pls, PLSVersion);
    console.log(`server Perl::LanguageServer ${PLSVersion} enabled`);
  } else if (config.plsNew.enable) {
    // Custom PLS server (pls)
    if (!isPlsInstalled()) {
      const installed = await installPls(context);
      if (!installed) return;
    }

    // Use custom server path if provided, otherwise use bundled pls
    const pl极sPath = config.plsNew.serverPath
      ? config.plsNew.serverPath
      : path.join(__dirname, '../../pls/server/bin/pls');

    client = getPlsClient(plsPath, config.plsNew);
    console.log(`server PLS ${PlsVersion} enabled`);
  }

  context.subscriptions.push(client.start());
}
