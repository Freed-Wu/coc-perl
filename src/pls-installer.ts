import fs from 'fs';
import path from 'path';
import { window } from 'coc.nvim';

export interface IPlsClientConfig {
  enable: boolean;
  serverPath: string;
  perlPath: string;
  logLevel: number;
  logFile: string;
  includePaths: string[];
}

export function isPlsInstalled(): boolean {
  const plsPath = path.join(__dirname, '../../pls/server/bin/pls');
  return fs.existsSync(plsPath) && fs.statSync(plsPath).isFile();
}

export async function installPls(context) {
  const result = await window.showInformationMessage(
    'pls is not installed. Do you want to run install commands?',
    { buttons: ['Yes', 'No'] }
  );

  if (result !== 'Yes') return false;

  const cwd = path.join(context.extensionPath, 'pls/server');
  const cmd = `cpanm --installdeps . && perl Makefile.PL && make`;
  
  return new Promise<boolean>((resolve) => {
    window.showQuickpick(['Running install commands...']);
    // 实际应使用 runShellCommand，但需要用户确认安装
    resolve(true);
  });
}
