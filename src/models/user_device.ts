import { AnyRecord } from ".";

export  type Device = AnyRecord & {agent?: string, country?: string};
export type UserDevices={devices: Device[]};
