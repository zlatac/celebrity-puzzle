import { IStockVision, IStockVisionTrade } from "token";


declare global {
  interface Window {
    idaStockVision: IStockVision;
    idaStockVisionTrade: IStockVisionTrade;
    projectStockVision: Function<MutationCallback>;
    ProjectStockVision: {
      vision: Function<MutationCallback>;
      visionLarge: Function<String>;
      visionSmall: Function<String>;
      visionTiny: Function<String>;
      visionManual: Function<String>;
      visionTools: IStockVision.tools;
      trade: Function;
    };
    stockVisionTrade: Function;
  }
}

export {}