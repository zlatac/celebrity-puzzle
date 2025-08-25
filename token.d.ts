export type PEAK = 'peak'
export type VALLEY = 'valley'
export type INTERVAL_FLAGS = '1min' | '2min' | '3min' | '5min' | '7min' | '10min' | '15min' | '27min' | '30min' | '45min' | '1hour' | 'none'

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
      experiment: boolean;
    };
  };
  server: {[key:string]: string};
  cssSelectors: {[key:string]: {[key]: Function}};
  constants: {}
}

/** STOCK_VISION_TRADE */
export interface ICboeQuoteResponse {
    symbol_name: string;
    trade_time: string;
    book: string;
    last: string;
    prev_close: string;
    change: string;
    change_pct: string;
    symb_name: string;
    company_name: string;
    primary_listing_exchange: string;
    high: string;
    low: string;
    one_yr_high: string;
    one_yr_low: string;
    volume: string;
    name: string;
    state: string;
    open: string;
    ask_shares: number;
    bid_shares: number;
    ask_price: string;
    bid_price: string;
    ts: string;
    market_cap: number;
}
export interface IQuestradeOrder {
  security: {
      securityUuid: string;
      symbol: string;
      isQuotable: boolean;
      description: string;
      currency: string;
      type: string;
      displayName: string;
      option: null;
  };
  account: {
      accountUuid: string;
      number: string;
      name: string;
      detailType: string;
  };
  orderStatement: string;
  cancelledQuantity: number;
  openQuantity: number;
  isDefaultRouted: boolean;
  isConditional: boolean;
  isModifiable: boolean;
  isCancellable: boolean;
  isDollarValueBased: boolean;
  hasSpecialInstructions: boolean;
  action: string;
  goodTillDate: null | string;
  orderUuid: string;
  createdDateTime: string;
  status: string;
  clientSideAction: string;
  totalQuantity: number;
  dollarValue: null|number;
  limitPrice: number;
  stopPrice: number;
  duration: string;
  type: string;
  bracket: null;
  bracketGroupUuid: null|string;
  crossZeroGroupUuid: null|string;
  venue: null|string;
  exchangeOrderId: string;
  parentOrderUuid: string;
  strategyType: null|string;
  specialInstructions: {
      summary: null|string;
      isAnonymous: boolean;
      isAllOrNone: boolean;
      isPostOnly: boolean;
      minimumQuantity: number;
      icebergQuantity: number;
  };
  route: string;
  subRoute: string;
  note: null|string;
  totalFees: number;
  updatedDateTime: string; //ISO format 
  filledQuantity: number;
  averageFilledPrice: number;
  stopPriceType: null|string;
  limitPriceType: string;
  rejectionReason: null|string;
  triggerPrice: number;
  rootOrderUuid: string;
  legs: null;
}
export interface IQuestradeOrdersResponse {
  data: IQuestradeOrder[]
}
export interface IQuestradeSubmitResponse {
  orderUuid: string;
}
export interface IQuestradeSubmitErrorResponse {}
export interface ITradeCheckResponse extends ICboeQuoteResponse {
  code: string;
  primaryCode: string;
  confirmationLink: string;
  position: boolean;
}
export interface ITradeOrder extends ITradeCheckResponse {
  executed?: boolean;
  accepted?: boolean;
  orderId?: string | undefined;
  rootOrderId?: string | undefined;
  capital: number;
  quantity?: number;
  checkCount?: number;
  modify?: boolean;
  partialExecution?: boolean;
  openQuantity?: number;
  filledQuantity: number;
  timeSubmitted?: string;
  priceSubmitted?: string|number;
}

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
  };
  accountId: string;
  securities: {[key: string]: {
    securityId: string;
    capital: number
  }};
  orders: ITradeOrder[];
  orderHistory: {[key:string]: {
    quantity: number;
    orderId: string;
  }};
}