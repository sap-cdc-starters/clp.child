import { AnyRecord } from "dns";
import { IdToken } from "./user";

export interface Token{
    access_token?: string;
    refresh_token?: string;
    id_token?: IdToken;
    [key:string] :any
} 
