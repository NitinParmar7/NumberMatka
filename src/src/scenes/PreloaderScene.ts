import { Game } from "phaser";
import { ASSET_PATH } from "../assetpath";
import { SCENES } from "../config";
import { game } from "../main";
import APIManager from "../util/APIManager";
import { IGameListData } from "../util/DataObjects";
import { ResizeManager } from "../util/util";


export default class PreloaderScene extends Phaser.Scene
{

    preloaderbg : Phaser.GameObjects.Image;
    preloaderbar : Phaser.GameObjects.Image;
    preloaderfill : Phaser.GameObjects.Image;

    splashbg : Phaser.GameObjects.Image;
    dice : Phaser.GameObjects.Image;
    infoTxt : Phaser.GameObjects.Text;
    timeTxt : Phaser.GameObjects.Text;
    
    timerEvent : Phaser.Time.TimerEvent;
    remainingtime : number;

    constructor()
    {
        super(SCENES.PRELOADERSCENE);
    }

    preload()
    {
        console.log("Preload");
        var width = ResizeManager.referenceScreeenSize.width;
        var height = ResizeManager.referenceScreeenSize.height;

        this.load.multiatlas('chips', ASSET_PATH.DATA.CHIPSDATA, ASSET_PATH.SPRITES.CHIPS);
        this.load.multiatlas('numbers', ASSET_PATH.DATA.NUMBERDATA, ASSET_PATH.SPRITES.NUMBERS);

        this.load.html('datepicker', ASSET_PATH.DATA.DATEPICKER);
        this.load.html('print', ASSET_PATH.DATA.PRINT);

        this.load.audio('bet', ASSET_PATH.SOUND.BET);
        this.load.audio('bg', ASSET_PATH.SOUND.BG);
        this.load.audio('bonus', ASSET_PATH.SOUND.BONUS);
        this.load.audio('coin', ASSET_PATH.SOUND.COIN);
        this.load.audio('wheel', ASSET_PATH.SOUND.WHEEL);
        this.load.audio('zerobalance', ASSET_PATH.SOUND.ZEROBALANCE);
        this.load.audio('click', ASSET_PATH.SOUND.CLICK);
        this.load.audio('autocoin', ASSET_PATH.SOUND.AUTOCOIN);

        this.preloaderbg = this.add.image(width * 0.5, height * 0.5, 'preloaderbg').setScale(2);
        this.preloaderbar = this.add.image(width * 0.5, height * 0.9, 'preloaderbar').setScale(2);
        this.preloaderfill = this.add.image(width* 0.5, height*0.9, 'preloaderfill').setScale(22,2);

        this.preloaderfill.on('progress', (value:number) => {
            this.preloaderfill.setScale(22*value, 2);
        })
    }

    create()
    {
        console.log("Create");
        var width = ResizeManager.referenceScreeenSize.width;
        var height = ResizeManager.referenceScreeenSize.height;
        var scale = 2;

        this.preloaderbg.setVisible(false);
        this.preloaderbar.setVisible(false);
        this.preloaderfill.setVisible(false);

        this.splashbg =  this.add.image(width *0.5, height*0.5, 'chips', 'splash.png').setScale(scale);
        this.dice = this.add.image(width*0.5, height * 0.4, 'chips', 'dice.png').setScale(scale);
        this.infoTxt = this.add.text(width*0.5, height*0.5, "Entering a secure room", {fontFamily: 'Arial', fontSize: '32px', fontStyle: 'bold'}).setOrigin(0.5);
        this.timeTxt = this.add.text(width*0.5, height*0.5, "Redirecting to homepage in 5", {fontFamily: 'Arial', fontSize: '32px', fontStyle: 'bold'}).setOrigin(0.5);
        this.timeTxt.setVisible(false);

        // let res = APIManager.GetInstance().GameListAPI();
        // res.then(this.OnGameListFilled, this.OnGameListRejected);
        game.scene.start(SCENES.GAMESCENE);

    }

    OnGameListFilled(value : JSON)
    {
        let GameList : IGameListData;
        GameList = value as unknown as IGameListData;
        let GameFound : boolean = false;
        if(GameList == undefined || GameList.GameList == undefined)
        {
            game.scene.start(SCENES.GAMESCENE);
            return;
        }
        for(let i = 0; i < GameList.GameList.length; ++i)
        {
            if(GameList.GameList[i].GameId == 8)
            {
                APIManager.GetInstance().SetGameID('8');
                GameFound = true;
                console.log("Game Scene");
                game.scene.start(SCENES.GAMESCENE);
            }
        }
        if(!GameFound)
        {
            this.OnGameListRejected(null);
        }
    }

    OnGameListRejected(reason : any)
    {
        console.log(reason);
        this.infoTxt.setText("Error while joining room. Please contact support");
        this.timerEvent = this.time.delayedCall(1000, this.OnTimerEventComplete, [], this);
        this.remainingtime = 5;
        this.infoTxt.setText('Redirecting to homepage in ' + this.remainingtime);
    }

    OnTimerEventComplete()
    {
        if(this.remainingtime == 0)
        {
            document.location.href="/";        
        }
        else
        {
            this.remainingtime--;
            this.infoTxt.setText('Redirecting to homepage in ' + this.remainingtime);
        }
    }

}