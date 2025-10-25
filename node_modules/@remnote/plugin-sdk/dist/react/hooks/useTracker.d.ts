import { RNPlugin } from '../..';
import { PluginReactiveDep, Awaited } from '../../reactivity';
export interface SubscriptionInfo {
    methodName: string;
    args: any;
    reactiveDeps: PluginReactiveDep[];
}
export declare const createReactiveApi: <Func extends (plugin: RNPlugin) => Promise<any>>(plugin: RNPlugin, userFunc: Func, rerun: () => void, setState: (result: Awaited<ReturnType<Func>>) => void, previousSubscriptions: SubscriptionInfo[]) => Promise<SubscriptionInfo[]>;
export declare function useTracker<T extends any>(userFunc: (plugin: RNPlugin) => Promise<T>, deps?: any[]): T | undefined;
