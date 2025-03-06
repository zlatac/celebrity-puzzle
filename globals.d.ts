import { IStockVision } from "token";

export {}
declare global {
  interface Window {
    idaStockVision: IStockVision;
    projectStockVision: Function<MutationCallback>;
  }
}