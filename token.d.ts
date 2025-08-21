export type PEAK = 'peak'
export type VALLEY = 'valley'
export type INTERVAL_FLAGS = '1min' | '2min' | '3min' | '5min' | '7min' | '10min' | '15min' | '30min' | '45min' | '1hour' | 'none'

export interface IPrice {
  price: number;
  date: string;
  epochDate?: number;
}

export interface IPriceHistory extends IPrice {
  type: PEAK | VALLEY;
  flags: INTERVAL_FLAGS[]; 
}

export interface ICurrentPrice extends IPrice {
  flags: INTERVAL_FLAGS[]; 
}

export interface IPosition extends IPrice {
  position: boolean;
  positionAnchor?: number;
}

export interface IIntervalInspection {
   peakCaptured: boolean;
   valleyCaptured: boolean;
   currentPriceExecuted: boolean;
   epochDate: number;
   inspectionEpochDate: number;
   index: number;
   hourMinute: string;
   peakPrice: number;
   valleyPrice: number;
   currentPrice: number;
}

export interface PriceAnalysis {
  constructor(history: IPriceHistory[], currentPrice: ICurrentPrice, currentPosition: IPosition, isCrypto: boolean, entryThreshold: number, exitThreshold: number, priceTradingInterval: string)
  _peakValleyHistory: IPriceHistory;
  _currentPrice: ICurrentPrice;
  _currentPosition: IPosition;
  _isCrypto: boolean;
  _priceTradingInterval: string;
  _twentyFourHoursInMiliSeconds: number
  get peakValleyProgressionOrder(): IPriceHistory[]
  get todaysDateMidnight(): number
  get dateExistsForCurrrentPosition(): boolean
  get peakOnlyProgressionOrder(): IPriceHistory[]
  get valleyOnlyProgressionOrder(): IPriceHistory[]
  get highestPeakToday(): IPriceHistory | undefined
  get lowestValleyToday(): IPriceHistory | undefined
  get highestPeakAndLowestValleyToday(): IPriceHistory[]
  get closestPeakToToday(): IPriceHistory | undefined
  get closestHighestPeak(): IPriceHistory | undefined
  get peakValleyBeforeToday(): IPriceHistory[]
  get peakValleyToday(): IPriceHistory[]
  get todaysPeakValleySnapshot(): IPriceHistory[]
  get peakValleySizeManagement(): undefined
  get isCurrentPositionStuck(): boolean
  findAnchorPeak(): IPriceHistory | undefined
  findAnchorValley(): IPriceHistory | undefined
  findAnchor(): IPriceHistory | undefined
  findOptimalClosestHighestPeak(): IPriceHistory | undefined
  priceSlope(): {value: number; positive: boolean; negative: boolean;} | undefined
  dayTradingAveragePrice(): number
}

export interface IPriceStore {
  lastPrice: IPrice | undefined;
  previousLastPrice: IPrice | undefined;
  marketHighLowRange: {
      low: undefined | number;
      high: undefined | number;
  };
  peakValleyHistory: IPriceHistory[];
  highestPeakAndLowestValleyToday: {[key: string]: IPriceHistory[]};
  todaysPeakValleySnapshot: {[key: string]: IPriceHistory[]};
  currentPosition: {[key: string]: IPosition};
  analysis: {[key: string]: InstanceType<PriceAnalysis>};
  priceTimeIntervalsToday: {[key: string]: Map<string, IIntervalInspection>;};
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
  intervalInspectorInstance: {
    [key: string]: undefined | number;
  };
  timeoutInspectorInstance: {
    [key: string]: undefined | number;
  };
  statusCounter: number;
  serverUrl: string;
  notificationServerUrl: string;
  tradingStartTime: number[];
  tradingEndTime: number[];
  priceStore: IPriceStore
  tools: {[key:string]: Function};
  settings: {
    [key:string]: {
      tradingInterval: INTERVAL_FLAGS;
    };
  };
  server: {[key:string]: string};
  cssSelectors: {[key:string]: {[key]: Function}};
  constants: {}
}

/** STOCK_VISION_TRADE */
export interface IStockVisionTrade {
  pollServerInProgress: boolean;
  pollServerInstance: undefined | number;
  pollServerErrorCount: number;
  processOrderQueueInProgress: boolean;
  investigateOrderQueueInProgress: boolean;
  modifyOrderQueueInProgress: boolean;
  newOrdersReceived: boolean;
  keepAwakeInstances: number[];
  tools: {[key:string]: Function};
  brokerage: {
    name: 'questrade' | 'ibkr';
  },
  accountId: string;
  securities: {[key: string]: {
    securityId: string;
    capital: number
  }};
  orders: {
    code: string;
    primaryCode: string;
    executed?: boolean;
    accepted?: boolean;
    orderId?: string | undefined;
    rootOrderId?: string | undefined;
    last: string;
    ask_price: string;
    bid_price: string;
    capital: number;
    confirmationLink: string;
    quantity?: number;
    position: boolean;
    checkCount?: number;
    modify?: boolean;
    partialExecution?: boolean;
    openQuantity?: number;
    filledQuantity: number;
    timeSubmitted?: string;
    priceSubmitted?: string|number;
  }[];
  orderHistory: {[key:string]: {
    quantity: number;
    orderId: string;
  }};
}