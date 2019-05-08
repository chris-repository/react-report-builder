import { IRequestOptions, PeekdataApi } from 'peekdata-datagateway-api-sdk';

export let peekdataApi: PeekdataApi = null;

export function initPeekdataApi(requestOptions: IRequestOptions) {
  peekdataApi = new PeekdataApi(requestOptions);
}
