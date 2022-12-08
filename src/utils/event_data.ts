import { omit } from "lodash";
import { never } from "rxjs";
import { AnyEventObject, DoneEvent, DoneInvokeEvent } from "xstate";

export type DoneDataEvent<T> =DoneInvokeEvent<T>;
export type InlineEvent<T> = T & AnyEventObject;
export type DoneOrInlineEvent<T> =DoneInvokeEvent<T> | InlineEvent<T>;
// type fromEvent<T, TEvent extends DoneDataEvent<T> | InlineEvent<T> = DoneDataEvent<T> | InlineEvent<T>> = T extends DoneDataEvent<T>
//     ? <TEvent extends DoneDataEvent<any>>(event: DoneDataEvent<any>) => DoneDataEvent<any>["data"]
//     : <TEvent extends InlineEvent<any>> (event: InlineEvent<any>) => Omit<T, "type">;

// function eventOrData<T>(eventData: DoneDataEvent<T>): T;
// function eventOrData<T>(event: InlineEvent<T>): T;


// function eventOrData<T, TEvent extends T | {data:T } =T | {data:T } >(event:TEvent):T {
//     return typeof event === typeof {data: T} ? event.data : event;
// }

// type InferExtractor<TPayload, TEvent extends DoneOrInlineEvent<TPayload>  = DoneOrInlineEvent<TPayload> > = TEvent extends DoneDataEvent<TPayload>
//     ? <TEvent extends DoneDataEvent<TPayload>>(event: DoneDataEvent<TPayload>) => DoneDataEvent<TPayload>["data"]
//     : <TEvent extends InlineEvent<any>> (event: InlineEvent<TPayload>) => Omit<TPayload, "type">;

 type DataFrom< TEvent extends DoneOrInlineEvent<any>  = DoneOrInlineEvent<any> > =
     TEvent extends DoneDataEvent<infer TPayload>? DoneDataEvent< TPayload>["data"]
    : TEvent extends InlineEvent<infer TPayload>? Omit<TPayload, "type">:
    never;

type InferExtractor<TEvent extends DoneOrInlineEvent<any>  = DoneOrInlineEvent<any>, TData= DataFrom<TEvent>> = 
      TEvent extends DoneDataEvent<TData> ? (event: DoneDataEvent<TData>) => TData
    : TEvent extends InlineEvent< TData> ? (event: InlineEvent<TData>) => TData:
    never;

 
const extractorMap={
  [typeof fromData]:fromData,
  [typeof payload]:payload,

};

export declare function eventOrDataExtractor<TPayload, TEvent extends DoneOrInlineEvent<TPayload> = DoneOrInlineEvent<TPayload>, TExtractor = InferExtractor<TEvent> >(eventOrData: TEvent):TPayload;

export type extractor<T extends DoneOrInlineEvent<any>> = typeof fromData<T> | typeof payload<T>;
export type extractorForPayload<TPayload, T extends DoneOrInlineEvent<TPayload> = DoneOrInlineEvent<TPayload> > = typeof fromData<T> | typeof payload<T>;

export const  anyEventOrData:  extractor<DoneOrInlineEvent<any>>= <T>(e:T)=> {
    return e as DoneInvokeEvent<any> ? fromData(e as DoneInvokeEvent<any>):
            e as  InlineEvent<any> ?payload(e as  InlineEvent<any>):
            never;
}

export const  eventOrData= <TPayload>(e: DoneOrInlineEvent<TPayload>)=> {
    return e.data? fromData(e as DoneInvokeEvent<TPayload>):
          payload(e as  InlineEvent<TPayload>)
} 


// export function eventOrData<TPayload, TEvent extends DoneOrInlineEvent<TPayload> =DoneOrInlineEvent<any>, TExtractor = InferExtractor<TEvent> >(eventOrData: TEvent):TPayload{
//     return fromData as TExtractor ? fromData(eventOrData as DoneInvokeEvent<DataFrom<TEvent>>) : payload(eventOrData);
// }

function fromData<T>(eventData: DoneDataEvent<T>): DoneDataEvent<T>["data"] {
    return eventData.data;
}

function payload<T>(eventData: InlineEvent<T>): Omit<T, "type"> {
    return omit(eventData, "type");
}
