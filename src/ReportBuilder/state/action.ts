// #region -------------- Interfaces -------------------------------------------------------------------

export interface IAction<TPayload = any> {
  /**
   * Fully qualified name of action
   */
  type: string;

  /**
   * Action payload (data)
   */
  payload?: TPayload;
}

export interface IAsyncState<DataType, ErrorType = string> {
  data?: DataType;
  isFetching: boolean;
  error: ErrorType;
  errorTimestamp: Date;
  timestamp?: Date;
}

// #endregion

export class AsyncState<DataType> implements IAsyncState<DataType> {
  public data = null;
  public isFetching = false;
  public error = null;
  public errorTimestamp = null;
  public timestamp = null;

  constructor(initialData?: DataType) {
    this.data = initialData;
  }
}
