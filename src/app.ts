import * as SocketIo from 'socket.io-client';

import uuid = require('uuid');

let socket = SocketIo.connect('ws://localhost:8081?gameId=sicbo');
let roundId = "";

socket.on('connect', function (data: any) {
  console.log('connected')
  socket.on(EventType.CONNECT_GAME_RESPONSE, function (data: any) {
    console.log(data);
    const response = data as ConnectResponseMessage;
    if (response.isSuccess) {
      roundId = response.currentRound.tableInfo.roundinfo.roundId;

      socket.emit(EventType.INIT_SESSION_REQUEST, { authCode: '481984504195' }, (data: any) => {
        console.log(EventType.INIT_SESSION_REQUEST);
      });
    }
  });
  socket.on('disconnect', function (data: any) {
    console.log('disconnect');
    console.log(data);
    socket.disconnect();
  });

  socket.on(EventType.BETTING_START_MESSAGE, (data: any) => {
    console.log(EventType.BETTING_START_MESSAGE);

  });
  socket.on(EventType.ROUND_START_MESSAGE, (data: any) => {
    console.log(EventType.ROUND_START_MESSAGE);

  });

  socket.on(EventType.NEW_BET_MESSAGE, (data: any) => {
    console.log(EventType.NEW_BET_MESSAGE);
    console.log(data);

  });

  socket.on(EventType.BALANCE_MESSAGE, (data: any) => {
    console.log(EventType.BALANCE_MESSAGE);
    console.log(data);

  });
  socket.on(EventType.ROUND_RESULT_MESSAGE, (data: any) => {
    console.log(EventType.ROUND_RESULT_MESSAGE);
    console.log(data);
    console.log(JSON.stringify(data));

  });
  socket.on(EventType.INIT_SESSION_RESPONSE, (data: any) => {
    console.log(EventType.INIT_SESSION_RESPONSE);
    console.log(data);
    socket.emit(EventType.NEW_BET_REQUEST, {
      betInfo: {
        betId: uuid.v4(),
        playerId: '481984504195',
        gameId: 'sicbo',
        roundId: roundId,
        betChipTotalAmount: 1.6,
        betChipDetails: [
          {
            chipType: '0.1',
            chipAmount: 1,
          }, {
            chipType: '0.5',
            chipAmount: 1,
          }, {
            chipType: '1',
            chipAmount: 1,
          }, 
        ],
        currency: Currency.EOS,
        boxType: BoxType.BIG,
      }

    }, (data: any) => {
      console.log(data);
    });

  });
  socket.on(EventType.NEW_BET_RESPONSE, (data: any) => {
    console.log(EventType.NEW_BET_RESPONSE);
    console.log(data);

  });
});

// doWhile();

async function doWhile() {
  while (true) {
    await new Promise(resolve => {
      setTimeout(resolve, 1000)
    });
    console.log(socket.connected);
  }
}

interface ConnectResponse {
  currentRoundInfo: RoundInfo; // 지금 실행되고 있는 라운드의 정보
}

interface ConnectResponseMessage {
  isSuccess: boolean;
  responseMessage: string;
  currentRound: currentRound;
}

export interface currentRound {
  tableInfo: TableInfo
}

export interface TableInfo {
  roundinfo: RoundInfo;
  BetLimitChips: BetLimit[];
  bets: BetInfo[];
  betHistory: BetHistory[];
  roundHistory: RoundHistory[];
}

export interface RoundInfo {
  gameId: string;
  roundId: string;
  roundStatus: RoundStatus;
  roundStartDt: Date;
  statusUpdateDt: Date;
  usdExchangeRates: RateItem[];
  roundConfig: RoundConfig;
  roundResult: object;
  roundRNG: number;
}

export interface BetHistory {
  betId: string;
  playerId: string;
  playerVipLevel: string;
  betDt: Date;
  betChipAmount: number;
  betBox: string;
}
export interface BetLimit {
  currency: Currency;
  betLimit: object;
}

export interface BetInfo {
  betId: string;
  playerId: string;
  gameId: string;
  roundId: string;
  betChipTotalAmount: number;
  betChipDetails: ChipAmount[];
  currency: Currency;
  boxType: string;
}

export interface ChipAmount {
  chipType: string;
  chipAmount: number;
}

export interface RateItem {
  currencyName: string;
  usdPrice: number;
}

export interface RoundHistory {
  gameId: string;
  roundId: string;
  roundResultDt: Date;
  roundResult: object;
}

export enum RoundStatus {
  ROUND_STARTED = 'ROUND_STARTED',
  BETTING = 'BETTING',
  BETTED = 'BETTED',
  ROUND_RESULTED = 'ROUND_RESULTED',
}

interface RoundConfig {
  betTime: number;
  tableMax: CurrencyAmount;
  userMax: CurrencyAmount;
}

interface CurrencyAmount {
  strExpr: string;
  symbol: Currency;
  fraction: number;
  amount: number;
}

export enum BoxType {
  ODD = "odd",
  EVEN = "even",
  BIG = "big",
  SMALL = "small",
  ANY_TRIPLE = "anyTriple",
  SINGLE_DICE_1 = "singleDice1",
  SINGLE_DICE_2 = "singleDice2",
  SINGLE_DICE_3 = "singleDice3",
  SINGLE_DICE_4 = "singleDice4",
  SINGLE_DICE_5 = "singleDice5",
  SINGLE_DICE_6 = "singleDice6",
}


export enum Currency {
  EOS = 'EOS',
  TRON = 'TRX',
  BITCOIN = 'BIT',
  CHIP = 'CHIP',
}

export enum EventType {
  CONNECT_GAME_RESPONSE = 'ConnectGameResponse',
  INIT_SESSION_REQUEST = 'InitSessionRequest',
  INIT_SESSION_RESPONSE = 'InitSessionResponse',
  NEW_BET_REQUEST = 'NewBetRequest',
  NEW_BET_RESPONSE = 'NewBetResponse',
  ROUND_START_MESSAGE = 'RoundStartMessage',
  BETTING_START_MESSAGE = 'BettingStartMessage',
  COUNT_MESSAGE = 'CountMessage',
  ROUND_RESULT_MESSAGE = 'RoundResultMessage',
  NEW_BET_MESSAGE = 'NewBetMessage',
  BALANCE_MESSAGE = 'BalanceMessage',
}
