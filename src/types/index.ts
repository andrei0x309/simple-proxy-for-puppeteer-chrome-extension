export type T_DEFAULT_OPTIONS = {
  activeProxy?: {
    type: string;
    host: string;
    port: string;
  };
  proxyDisconnectOnFailure?: boolean;
  proxyEnableOnBrowserStart?: boolean;
  proxyEnabled?: boolean;
  theme?: string;
};
