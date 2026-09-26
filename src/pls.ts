import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} from 'coc.nvim';

export function getPlsClient(plsPath: string, config: any): LanguageClient {
  const serverOptions: ServerOptions = {
    run: { command: plsPath, transport: TransportKind.stdio },
    debug: { command: plsPath, transport: TransportKind.stdio },
  };

  const clientOptions: LanguageClientOptions = {
    documentSelector: [{ language: 'perl' }],
  };

  return new LanguageClient(
    'pls',
    'Perl Language Server',
    serverOptions,
    clientOptions
  );
}