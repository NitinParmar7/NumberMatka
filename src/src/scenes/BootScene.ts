import Phaser from "phaser";
import { ASSET_PATH } from "../assetpath";
import { SCENES } from "../config";
import APIManager from "../util/APIManager";
import GameEventEmitter, { GAME_EVENTS } from "../util/GameEvents";
import { IGameListData, IUserDetailsLifeTimeData, RootObject } from "../util/DataObjects";
import { ResizeManager } from "../util/util";

export default class BootScene extends Phaser.Scene {
  private GEventEmitter: GameEventEmitter;

  constructor() {
    super(SCENES.BOOTSCENE);
    this.GEventEmitter = GameEventEmitter.GetInstance();
  }

  gamelist: Object[];

  init() {
    this.scale.lockOrientation("potrait");
    // this.scale.on("resize", ResizeManager.resize);
    // ResizeManager.resize();

    this.GEventEmitter.clearEvents();
    const gameEvents = [
      {
        name: GAME_EVENTS.LOGOUT_SUCCESS.key,
        callback: this.TryLogin,
      },
      {
        name: GAME_EVENTS.LOGIN_SUCCESS.key,
        callback: this.TryLifeTimeLogin,
      },
      {
        name: GAME_EVENTS.LIFETIME_LOGIN_SUCCESS.key,
        callback: this.StartPreloader,
      },
    ];

    gameEvents.forEach((gameEvent: { name: string; callback: (...args: any[]) => void }) => {
      this.GEventEmitter.addListener(gameEvent.name, gameEvent.callback, this);
    });
  }

  preload() {
    this.load.image("preloaderbg", ASSET_PATH.SPRITES.LOADINGBG);
    this.load.image("preloaderbar", ASSET_PATH.SPRITES.LOADINGBARBG);
    this.load.image("preloaderfill", ASSET_PATH.SPRITES.LOADINGBARFILL);
  }

  create() {
    // var printText = this.add.rexBBCodeText(400, 300, 'abc', {
    //     color: 'yellow',
    //     fontSize: '24px',
    //     fixedWidth: 200,
    //     fixedHeight: 80,
    //     backgroundColor: '#333333',
    //     valign: 'center'
    // })
    //     .setOrigin(0.5)
    //     .setInteractive()
    //     .on('pointerdown', function () {
    //         var config = {
    //             onTextChanged: function (textObject, text) {
    //                 textObject.text = text;
    //             },
    //             selectAll: true
    //         }
    //         this.plugins.get('rextexteditplugin').edit(printText, config);
    //     }, this);

    // this.add.text(0, 580, 'Click text to start editing, press enter key to stop editing')

    // let logOutRes = APIManager.GetInstance().LogoutAPI("520002");
    // logOutRes.then(this.OnLogOutSucceed, this.OnLogOutFailed);
    // console.log("Logout");

    let lifetimetoken = window.sessionStorage.getItem("lifetimeToken");
    this.scene.start(SCENES.PRELOADERSCENE);

    // APIManager.GetInstance().SetLifeTimeToken(lifetimetoken);
    // this.TryLifeTimeLogin();
  }

  OnLogOutSucceed() {
    GameEventEmitter.GetInstance().emit(GAME_EVENTS.LOGOUT_SUCCESS.key);
  }

  OnLogOutFailed(reason: any) {
    console.log(reason);
  }

  OnLoginSuccess(value: RootObject) {
    console.log(value);
    let UserDetailData: RootObject;
    UserDetailData = value as unknown as RootObject;
    if (UserDetailData != undefined) {
      for (let index = 0; index < UserDetailData.UserDetails.length; index++) {
        const element = UserDetailData.UserDetails[index];
        APIManager.GetInstance().SetUserId(element.UserName);
        APIManager.GetInstance().SetLifeTimeToken(element.lifetime_token);
      }
      GameEventEmitter.GetInstance().emit(GAME_EVENTS.LOGIN_SUCCESS.key);
    }
  }

  OnLoginLifeTimeSuccess(value: JSON) {
    let userDetailLifeTimeData: IUserDetailsLifeTimeData;
    userDetailLifeTimeData = value as unknown as IUserDetailsLifeTimeData;
    if (userDetailLifeTimeData != undefined) {
      for (let index = 0; index < userDetailLifeTimeData.UserDetails.length; index++) {
        const element = userDetailLifeTimeData.UserDetails[index];
        APIManager.GetInstance().SetUserId(element.UserName);
        APIManager.GetInstance().SetBalance(element.Balance);
        APIManager.GetInstance().SetDeviceID(element.deviceID);
      }
      GameEventEmitter.GetInstance().emit(GAME_EVENTS.LIFETIME_LOGIN_SUCCESS.key);
    }
  }

  OnLoginLifeTimeFailed(reason: any) {
    console.log(reason);
  }

  OnLoginFailure(failureReason: any) {
    console.log(failureReason);
  }

  TryLogin() {
    let res = APIManager.GetInstance().LoginAPI("520002", "77777");
    res.then(this.OnLoginSuccess, this.OnLoginFailure);
  }

  TryLifeTimeLogin() {
    let res = APIManager.GetInstance().LoginAPILifeTime();
    res.then(this.OnLoginLifeTimeSuccess, this.OnLoginLifeTimeFailed);
  }

  StartPreloader() {
    console.log("Preloader");
    this.scene.start(SCENES.PRELOADERSCENE);
  }
}
