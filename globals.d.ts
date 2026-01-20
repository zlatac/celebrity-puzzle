import { IStockVision, IStockVisionTrade } from "token";


declare global {
  interface Window {
    idaStockVision: IStockVision;
    idaStockVisionTrade: IStockVisionTrade;
    ProjectStockVision: class;
    StockVisionTrade: class;
  }
}

export {}