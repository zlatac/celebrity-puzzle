export type PEAK = 'peak'
export type VALLEY = 'valley'
export type INTERVAL_FLAGS = '1min' | '2min' | '5min' | '10min' | '15min' | '30min' | '45min' | '1hour' | 'none'

export interface IPrice {
  price: number;
  date: string;
  epochDate?: number;
}

export interface IPriceHistory extends IPrice {
  type: PEAK | VALLEY;
  flags?: INTERVAL_FLAGS[]; 
}

export interface ICurrentPrice extends IPrice {
  flags: INTERVAL_FLAGS[]; 
}

export interface IPosition extends IPrice {
  position: boolean;
  positionAnchor?: number;
}

export interface IPriceStore {
  lastPrice: IPrice | undefined;
  previousLastPrice: IPrice | undefined;
  marketHighLowRange: {
      low: undefined | number;
      high: undefined | number;
  };
  peakValleyHistory: IPriceHistory[];
  highestPeakAndLowestValleyToday: IPriceHistory[];
  todaysPeakValleySnapshot: IPriceHistory[];
  currentPosition: IPosition;
  analysis: {[key]: Function};
  priceTimeIntervalsToday: {[key]: number[]};
  uploadTodaysPriceTime: undefined | number;
}

export interface IStockVision {
  positionIn: {[key:string]: boolean};
  notificationInProgress: {[key:string]: boolean};
  lastNotificationSent: {
    [key:string]: {
      tokenOrStockCode: string;
      message: string;
      currentPrice: number;
      action: string;
      anchorPrice: number | string;
    } | {}
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
  priceStore: IPriceStore
  tools: {[key:string]: Function};
  server: {[key:string]: string};
  cssSelectors: {[key:string]: {[key]: Function}};
  constants: {
    tradingStartTime: {
      [key:string]: number[];
    };
    tradingEndTime: {
      [key:string]: number[];
    };
  }
}