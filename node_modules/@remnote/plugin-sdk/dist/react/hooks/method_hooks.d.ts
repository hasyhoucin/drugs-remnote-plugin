import { AppEvent, AppEventListerKey } from '../../events';
export declare function useAPIEventListener(appEvent: AppEvent, listenerKey: AppEventListerKey, callback: (args: any) => void): void;
