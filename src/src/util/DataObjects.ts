import NumberChips from "../GameObjects/NumberChip";

export interface IGameDetail {
  GameId: number;
  GameName: string;
}

export interface IGameListData {
  GameList: IGameDetail[];
}

// export interface IUserDetailsData
// {
//     UserDetails : IUserDetails[]
// }

// export interface IUserDetailDataObject
// {
//     UserDetailData : IUserDetailsData;
// }

// export interface IUserDetails
// {
//     UserName : string,
//     Balance : string,
//     timestamp : number,
//     lifetime_token : string
// }
export interface UserDetail {
  UserName: string;
  Balance: string;
  timestamp: number;
  lifetime_token: string;
}

export interface RootObject {
  UserDetails: UserDetail[];
}

export interface IUserDetailsLifeTime {
  UserName: string;
  Balance: string;
  timestamp: number;
  deviceID: string;
}

export interface IUserDetailsLifeTimeData {
  UserDetails: IUserDetailsLifeTime[];
}

export interface IResult {
  Amount: number;
  Balance: string;
  DrawTimeStamp: number;
  NextDrawTimeStamp: number;
  Prize: number;
  bouns: number;
  ServerTimeStamp: number;
  Value: number;
}

export interface IResultData {
  ResultDetails: IResult[];
}

export interface IResultList {
  TimeStamp: string;
  GameValue: string;
  GameTime: string;
  bonus: string;
}

export interface IResultListData {
  ResultList: IResultList[];
}

export interface IToken {
  TokenDetails?: ITokenDetailsEntity[] | null;
}
export interface ITokenDetailsEntity {
  LifeToken: string;
}

export interface IBarcode {
  barcode?: string[] | null;
  tot_amount?: string[] | null;
  rate?: string[] | null;
  saleid?: string[] | null;
  date?: string[] | null;
  digit?: string[] | null;
  qty?: string[] | null;
}

export interface ISalesDetails {
  SalesDetails?: ISalesDetailsEntity[] | null;
}
export interface ISalesDetailsEntity {
  Barcode: number;
  Balance: number;
  drawTimeStamp: number;
}

export interface IBarcodeList {
  Values: string[];
  barcode: string;
  drawTimeStamp: number;
  Amount: string;
  Prize: number;
  Status: string;
}

export interface IBarcodeListArray {
  BarcodeArray: IBarcodeList[];
}

export interface ISalesReport {
  netplaypoints: number;
  claimpoints: number;
  Commission: number;
  NetToPay: number;
  calcelpoints: string;
  playpoints: number;
  grosspoints: number;
  OperatorBalance: string;
}

export interface ISalesReportRoot {
  SalesReport: ISalesReport[];
}

export interface IWhatsappObject {
  barcode: string[];
  tot_amount: string[];
  rate: string[];
  saleid: string[];
  date: string[];
  drawTime: string[];
  digit: string[];
  qty: string[];
}

export type ChipData = { key: number; chip2: number; chip5: number; chip10: number; chip20: number; chip25: number; total: number };

export class ChipDataHandler {
  private chipData: ChipData;

  private chipImage: NumberChips;

  constructor(numberToUse: number) {
    this.chipData = { key: numberToUse, chip2: 0, chip5: 0, chip10: 0, chip20: 0, chip25: 0, total: 0 };
  }

  GetChipData(): ChipData {
    return this.chipData;
  }

  GetTotalValue(): number {
    return this.chipData.chip2 * 2 + this.chipData.chip5 * 5 + this.chipData.chip10 * 10 + this.chipData.chip20 * 20 + this.chipData.chip25 * 25;
  }

  IncreamentChipValue(chipType: number) {
    switch (chipType) {
      case 2:
        ++this.chipData.chip2;
        break;
      case 5:
        ++this.chipData.chip5;
        break;
      case 10:
        ++this.chipData.chip10;
        break;
      case 20:
        ++this.chipData.chip20;
        break;
      case 25:
        ++this.chipData.chip25;
        break;
    }
  }

  GetChipImage(): NumberChips {
    return this.chipImage;
  }

  SetChipImage(image: NumberChips) {
    this.chipImage = image;
  }
}
