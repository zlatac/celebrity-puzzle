import { IStockVision } from "token";


declare global {
  interface Window {
    idaStockVision: IStockVision;
    projectStockVision: Function<MutationCallback>;
  }
}

export {}