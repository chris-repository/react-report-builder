import { PeekdataApi } from 'peekdata-datagateway-api-sdk';

export let peekdataApi: PeekdataApi = null;

export function setPeekdataApi(api: PeekdataApi) {
  peekdataApi = api;
}
