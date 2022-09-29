import { KubeConfig, CoreV1Api, AppsV1Api } from '@kubernetes/client-node';

const kc = new KubeConfig();
kc.loadFromDefault();

export const coreApi = kc.makeApiClient(CoreV1Api);
export const appApi = kc.makeApiClient(AppsV1Api);

