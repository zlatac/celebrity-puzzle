export type PEAK = 'peak'
export type VALLEY = 'valley'

export interface IPrice {
  price: number;
  date: string;
  epochDate?: number;
}

export interface IPriceHistory extends IPrice {
  type: PEAK | VALLEY;
}

export interface IPosition extends IPrice {
  position: boolean;
}

export interface IStockVision {
  positionIn: {[key:string]: boolean};
  notificationInProgress: {[key:string]: boolean};
  lastNotificationSent: {
    [key]: {
      tokenOrStockCode: string;
      message: string;
      currentPrice: number;
      action: string;
      anchorPrice: number | string;
    }
  };
  mutationObservers: {[key:string]: MutationObserver};
  consoleClearInstance: number;
  windowCloseEventListener: EventListener;
  code: string;
  statusTimeoutList: number[];
  statusTimeoutInstance: undefined | number;
  statusCounter: number;
  serverUrl: string;
  notificationServerUrl: string;
  priceStore: {
    lastPrice: undefined | number;
    previousLastPrice: undefined | number;
    marketHighLowRange: {
        low: undefined | number;
        high: undefined | number;
    };
    peakValleyHistory: IPriceHistory[];
    highestPeakAndLowestValleyToday: IPriceHistory[];
    currentPosition: IPosition;
    analysis: {[key]: Function};
    uploadTodaysPriceTime: undefined | number;
  }
  tools: {[key:string]: Function}
  server: {[key:string]: string}
  cssSelectors: {[key:string]: {[key]: Function}}
}