import { GameObjects, Tweens } from "phaser";
import printJS from "print-js";
import { isMobile, SCENES, WheelOption } from "../config";
import NumberChips from "../GameObjects/NumberChip";
import APIManager from "../util/APIManager";
import { ChipDataHandler, IBarcode, IBarcodeList, IResultData, IResultList, IResultListData, ISalesDetails, ISalesReportRoot, IToken, IWhatsappObject } from "../util/DataObjects";
import GameEventEmitter, { GAME_EVENTS } from "../util/GameEvents";
import { ResizeManager } from "../util/util";

export default class GameScene extends Phaser.Scene {

    smallNumberWheel !: Phaser.GameObjects.Image;
    bigNumberWheel !: Phaser.GameObjects.Image;
    smallNumberWheelLines !: Phaser.GameObjects.Image;
    bigNumberWheelLines !: Phaser.GameObjects.Image;
    bonusWheel !: Phaser.GameObjects.Image;
    bonusWheelLines !: Phaser.GameObjects.Image;
    buyBtn !: Phaser.GameObjects.Image;
    clearBtn !: Phaser.GameObjects.Image;
    chipsHolder !: Phaser.GameObjects.Image;
    currentChipImage !: Phaser.GameObjects.Image;
    chip2 !: Phaser.GameObjects.Image;
    chip5 !: Phaser.GameObjects.Image;
    chip10 !: Phaser.GameObjects.Image;
    chip20 !: Phaser.GameObjects.Image;
    chip25 !: Phaser.GameObjects.Image;
    sliderBtn !: Phaser.GameObjects.Image;
    toggleShrink !: Phaser.GameObjects.Image;
    gameRulesBtn !: Phaser.GameObjects.Image;
    soundOnBtn !: Phaser.GameObjects.Image;
    soundOffBtn !: Phaser.GameObjects.Image;
    reportBtn !: Phaser.GameObjects.Image;
    findBetBtn !: Phaser.GameObjects.Image;
    homeBtn !: Phaser.GameObjects.Image;

    switches !: Phaser.GameObjects.Image;
    virtualUsers !: Phaser.GameObjects.Image;

    betContainer !: Phaser.GameObjects.Container;
    numberContainer !: Phaser.GameObjects.Container;
    menuContainer !: Phaser.GameObjects.Container;

    pointTxt !: Phaser.GameObjects.Text;
    playerID !: Phaser.GameObjects.Text;
    betsScore !: Phaser.GameObjects.Text;
    amtScore !: Phaser.GameObjects.Text;
    timeRemaining !: Phaser.GameObjects.Text;
    timeText !: Phaser.GameObjects.Text;

    historyTimeTextContainer !: Phaser.GameObjects.Container;
    historyBigNumberContainer !: Phaser.GameObjects.Container;
    historySmallNumberContainer !: Phaser.GameObjects.Container;
    historyBonusNumberContainer !: Phaser.GameObjects.Container;

    betAudio !: Phaser.Sound.BaseSound;
    bgAudio !: Phaser.Sound.BaseSound;
    bonusAudio !: Phaser.Sound.BaseSound;
    coinAudio !: Phaser.Sound.BaseSound;
    wheelAudio !: Phaser.Sound.BaseSound;
    zerobalanceAudio !: Phaser.Sound.BaseSound;

    nextDrawTimeStamp: number;
    nextDrawTimeUpdated: boolean = false;
    internalRemainingTime: number = 30;
    internalTime: number = 0;
    bCanSpinWheel: boolean = true;
    bIsChipHolderOpen: boolean = false;
    inactiveBG: GameObjects.Image;
    betsCount: number = 0;
    difference: number = 0;

    private tweenArray: Tweens.Tween[] = [];
    private menuTween: Tweens.Tween;
    private chipImageContainer: Phaser.GameObjects.Container;
    private currentChipType: number = 2;
    private chipBetsContainer: Phaser.GameObjects.Container;
    private chipData: ChipDataHandler[] = [];
    private currentChipKey: string;
    private GEventEmitter: GameEventEmitter;
    private dummyBetsContainer: Phaser.GameObjects.Container;
    private bdrawTimeFound: boolean = true;
    private soundOn: boolean = true;
    private balance: number;
    private currentBalance: number;
    private menuPanel: Phaser.GameObjects.Image;
    private bIsMenuOpen: boolean = false;
    gameGuide: GameObjects.Image;
    gameGuideContainer: GameObjects.Container;
    gameGuideCheckBox: GameObjects.Image;
    gameGuideCheckBoxTick: GameObjects.Image;
    gameGuideText: GameObjects.Text;
    gameGuideCross: GameObjects.Image;
    betminmax: GameObjects.Image;
    whatsapp: GameObjects.Image;
    whatsappCheckBox: GameObjects.Image;
    printPng: GameObjects.Image;
    connectionTime: number;
    betloading: GameObjects.Image;
    clickAudio: Phaser.Sound.BaseSound;
    autocoinAudio: Phaser.Sound.BaseSound;
    betInactiveBG: GameObjects.Image;
    BetDContainer: GameObjects.Container;
    BetDBG: GameObjects.Rectangle;
    BetDTopbar: GameObjects.Rectangle;
    BetDTopBarText: GameObjects.Text;
    BetDClose: GameObjects.Image;
    BetDTime: GameObjects.Text;
    BetDBarcode: GameObjects.Text;
    BetDPoints: GameObjects.Text;
    BetDWins: GameObjects.Text;
    BetDCancel: GameObjects.Text;
    BetDFromDate: GameObjects.DOMElement;
    BetDScrollablePanel: any;
    BetDGraphics: GameObjects.Graphics;
    BetDScrollBar: GameObjects.Graphics;
    BetDScrollBarPoint: GameObjects.Graphics;
    BetDZone: GameObjects.Zone;
    BetDElementContainer: GameObjects.Container;
    BetDValuesContainer: GameObjects.Container;
    BetDMask: Phaser.Display.Masks.GeometryMask;
    BetDPrint: GameObjects.Text;
    ReportContainer: GameObjects.Container;
    ReportBG: GameObjects.Rectangle;
    ReportTopBar: GameObjects.Rectangle;
    dateOneImage: GameObjects.Image;
    ReportDateOne: GameObjects.DOMElement;
    dateTwoImage: GameObjects.Image;
    ReportDateTwo: GameObjects.DOMElement;
    reportScreenButton: GameObjects.Image;
    reportScreenClose: GameObjects.Image;
    reportScreenElement: GameObjects.Container;
    whatsappOn: boolean = false;
    printOn: boolean = false;
    whatsappCheck: GameObjects.Image;
    printCheck: GameObjects.Image;
    bBetDetailsOpen: boolean = false;
    BetDTitleContainer: GameObjects.Container;
    connectionText: GameObjects.Image;
    connectionContinue: GameObjects.Image;
    connectionContainer: GameObjects.Container;
    connectionExit: GameObjects.Image;
    bCanChangeToken: boolean = true;

    constructor() {
        super(SCENES.GAMESCENE);
        this.GEventEmitter = GameEventEmitter.GetInstance();
    }

    init() {
        this.GEventEmitter.clearEvents();
        const gameEvents = [
            {
                name: GAME_EVENTS.NEXT_DRAW_TIMESTAMP.key,
                callback: this.OnNextDrawTimeUpdated
            },
            {
                name: GAME_EVENTS.ON_BALANCE_UPDATED.key,
                callback: this.OnBalanceUpdated
            },
            {
                name: GAME_EVENTS.ON_VALUE_UPDATED.key,
                callback: this.OnValueUpdated
            },
            {
                name: GAME_EVENTS.ON_RESULTLIST_UPDATED.key,
                callback: this.OnResultListDataUpdated
            },
            {
                name: GAME_EVENTS.ON_UPDATE_TOKEN.key,
                callback: this.OnTokenUpdated
            },
            {
                name: GAME_EVENTS.ON_BUY_COMPLETE.key,
                callback: this.OnBuyFinish
            },
            {
                name: GAME_EVENTS.ON_BARCODELIST_UPDATED.key,
                callback: this.FillBarcodeList
            },
            {
                name: GAME_EVENTS.ON_REPORT_GENERATED.key,
                callback: this.OnReportGenerated
            },
            {
                name: GAME_EVENTS.FETCH_RESULT.key,
                callback: this.FetchResult
            },
            {
                name: GAME_EVENTS.FETCH_NEXT_DRAWTIME.key,
                callback: this.NextDrawTime
            },
            {
                name: GAME_EVENTS.FETCH_RESULT_LIST.key,
                callback: this.FetchResultList
            },
            {
                name: GAME_EVENTS.ON_CONNECTION_LOST.key,
                callback: this.OnConnectionLost
            }
        ]

        gameEvents.forEach(
            (gameEvent: {
                name: string;
                callback: (...args: any[]) => void;
            }) => {
                this.GEventEmitter.addListener(
                    gameEvent.name,
                    gameEvent.callback,
                    this
                );
            }
        )

        this.connectionTime = 30;
    }

    preload() {
    }

    create() {
        var width = ResizeManager.referenceScreeenSize.width;
        var height = ResizeManager.referenceScreeenSize.height;
        var Scale = 2;

        console.log("Width : " + width + " Height: " + height);
        console.log(this.game.canvas.clientWidth + " " + this.game.canvas.clientHeight);

        console.log(window.sessionStorage);
        console.log(window.localStorage);

        this.add.image(width * 0.5, height * 0.625, 'chips', 'bg.png').setScale(5, 5);
        this.add.image(width * 0.5, height * 0.1, 'chips', 'topbg.png').setScale(2.5, 2.5);



        this.bigNumberWheelLines = this.add.image(width * 0.5, height * 0.225, 'chips', 'bigbluewheel.png').setScale(Scale);

        this.bigNumberWheel = this.add.image(width * 0.5, height * 0.225, 'chips', 'bigwheel.png').setScale(Scale);
        this.smallNumberWheelLines = this.add.image(width * 0.5, height * 0.225, 'chips', 'smallbluewheel.png').setScale(Scale);
        this.smallNumberWheel = this.add.image(width * 0.5, height * 0.225, 'chips', 'smallwheel.png').setScale(Scale);
        this.bonusWheelLines = this.add.image(width * 0.5, height * 0.225, 'chips', 'redwheellines.png').setScale(Scale);
        this.bonusWheel = this.add.image(width * 0.5, height * 0.225, 'chips', 'bonuswheel.png').setScale(Scale);
        this.add.image(width * 0.5, height * 0.225, 'chips', 'redwheel.png').setScale(Scale);
        this.add.image(width * 0.5, height * 0.1, 'chips', 'pointer.png').setScale(Scale);
        this.add.text(width * 0.5, height * 0.18, 'Place bet now').setOrigin(0.5);
        this.timeRemaining = this.add.text(width * 0.5, height * 0.20, '300', { fontFamily: 'Arial', fontSize: '64px', fontStyle: 'bold', color: '#fff200' }).setOrigin(0.5);
        //this.switches = this.add.image(width * 0.925, height * 0.13, 'chips', 'switches.png').setScale(Scale + 0.5);
        this.timeText = this.add.text(width * 0.96, height * 0.15, "00:00:00 AM", { fontFamily: 'Arial', fontSize: '28px', fontStyle: 'bold' }).setOrigin(1, 0.5);
        this.betminmax = this.add.image(width * 0.87, height * 0.19, 'chips', 'betlimit.png').setScale(1);

        this.add.image(width * 0.5, height * 0.625, 'chips', 'bg.png').setScale(Scale);
        this.add.image(width * 0.5, height * 0.275, 'chips', 'resultbg.png').setScale(2.15, Scale);

        let historyWidthOffset = 140;
        this.historyTimeTextContainer = this.add.container();
        this.historyBigNumberContainer = this.add.container();
        this.historySmallNumberContainer = this.add.container();
        this.historyBonusNumberContainer = this.add.container();
        for (let index = 0; index < 7; ++index) {
            var HistoryTime = this.add.text(width * 0.12 + historyWidthOffset * index, height * 0.24, "00:00", { fontFamily: 'Arial', fontSize: '20px', fontStyle: 'bold' }).setOrigin(0.5).setVisible(false);
            this.historyTimeTextContainer.add(HistoryTime);
            var historyBigNumber = this.add.text(width * 0.12 + historyWidthOffset * index, height * 0.2675, "0", { fontFamily: 'Arial', fontSize: '52px', fontStyle: 'bold' }).setOrigin(0.5).setVisible(false);
            this.historyBigNumberContainer.add(historyBigNumber);
            var historySmallNumber = this.add.text(width * 0.12 + historyWidthOffset * index, height * 0.305, "0", { fontFamily: 'Arial', fontSize: '52px', fontStyle: 'bold' }).setOrigin(0.5).setVisible(false);
            this.historySmallNumberContainer.add(historySmallNumber);
            var historyBonusNumber = this.add.image(width * 0.12 + historyWidthOffset * index, height * 0.285, 'chips', '2x.png').setVisible(false);;
            this.historyBonusNumberContainer.add(historyBonusNumber);
        }



        this.betContainer = this.add.container();
        this.numberContainer = this.add.container();

        let chipOffset = 90;
        for (let i = 0; i < 10; ++i) {
            let widthToSet = width * 0.15 + (chipOffset * i);
            let heightToSet = height * 0.35 + 80 + (chipOffset * i);
            let betH = this.add.image(widthToSet, height * 0.35, 'chips', 'bethorizontal.png').setScale(Scale).setInteractive().on('pointerdown', () => { this.OnLineBetClicked(i, true); }, this);
            let betV = this.add.image(width * 0.075, heightToSet, 'chips', 'betvertical.png').setScale(Scale).setInteractive().on('pointerdown', () => { this.OnLineBetClicked(i, false); }, this);
            this.betContainer.add(betH);
            this.betContainer.add(betV);
            let NumberOffset = 90;
            for (let j = 0; j < 10; ++j) {
                let number = (i) * 10 + (j);
                widthToSet = width * 0.15 + (NumberOffset * j);
                let numberImage = this.add.image(widthToSet, heightToSet, 'numbers', number + '-min.png').setScale(Scale).setInteractive().on('pointerdown', () => { this.OnChipNumberClicked(number, numberImage); }, this);
                this.numberContainer.add(numberImage);
            }
        }

        // Bottom Buttons
        this.buyBtn = this.add.image(width * 0.8, height * 0.94, 'chips', 'buybtn.png').setScale(Scale).setInteractive().on("pointerdown", this.OnBuyChipData, this);
        this.clearBtn = this.add.image(width * 0.2, height * 0.94, 'chips', 'clear.png').setScale(Scale).setInteractive().on('pointerdown', this.OnClearChipData, this);



        // Top Bar
        this.add.image(width * 0.5, height * 0.01, 'chips', 'betminmax.png').setScale(10, 1);
        this.add.text(width * 0.07, height * 0.015, 'Point:', { fontFamily: 'Arial', fontSize: '24px', fontStyle: 'bold' }).setOrigin(0.5);
        this.add.image(width * 0.12, height * 0.015, 'chips', 'pointslogo.png').setScale(Scale);
        this.pointTxt = this.add.text(width * 0.17, height * 0.015, '5', { fontFamily: 'Arial', fontSize: '24px', fontStyle: 'bold', align: 'left' }).setOrigin(0.5);
        this.add.text(width * 0.65, height * 0.015, 'ID:', { fontFamily: 'Arial', fontSize: '24px', fontStyle: 'bold' }).setOrigin(0.5);
        this.playerID = this.add.text(width * 0.7, height * 0.015, APIManager.GetInstance().GetUserID(), { fontFamily: 'Arial', fontSize: '24px', fontStyle: 'bold' }).setOrigin(0.5);

        // Bets Panel
        this.add.image(width * 0.105, height * 0.08, 'chips', 'betminmax.png').setScale(Scale);
        this.add.text(width * 0.07, height * 0.07, 'Bets:', { fontFamily: 'Arial', fontSize: '42px', fontStyle: 'normal' }).setOrigin(0.5);
        this.add.text(width * 0.07, height * 0.09, 'Amt:', { fontFamily: 'Arial', fontSize: '42px', fontStyle: 'normal' }).setOrigin(0.5);
        this.betsScore = this.add.text(width * 0.14, height * 0.07, '0', { fontFamily: 'Arial', fontSize: '42px', fontStyle: 'normal' }).setOrigin(0.5);
        this.amtScore = this.add.text(width * 0.14, height * 0.09, '0', { fontFamily: 'Arial', fontSize: '42px', fontStyle: 'normal' }).setOrigin(0.5);

        this.virtualUsers = this.add.image(width * 0.08, height * 0.14, 'chips', 'virtualuser.png').setScale(Scale);

        this.whatsapp = this.add.image(width * 0.065, height * 0.18, 'chips', 'whatsapp.png').setScale(1).setInteractive().on('pointerdown', this.ToggleWhatsapp, this);
        this.whatsappCheckBox = this.add.image(width * 0.12, height * 0.18, 'chips', 'rectangle.png').setScale(Scale).setInteractive().on('pointerdown', this.ToggleWhatsapp, this);
        this.whatsappCheck = this.add.image(width * 0.12, height * 0.18, 'chips', 'checkmark.png').setVisible(false).setInteractive().on('pointerdown', this.ToggleWhatsapp, this);;;
        this.printPng = this.add.image(width * 0.08, height * 0.2, 'chips', 'print.png').setScale(Scale).setInteractive().on('pointerdown', this.TogglePrint, this);
        this.printCheck = this.add.image(width * 0.12, height * 0.2, 'chips', 'checkmark.png').setVisible(false).setInteractive().on('pointerdown', this.TogglePrint, this);

        this.chipBetsContainer = this.add.container();
        this.dummyBetsContainer = this.add.container();
        let nextDrawTime = APIManager.GetInstance().NextDrawTimeStampAPI();
        nextDrawTime.then(this.OnNextDrawTimeFound, this.OnNextDrawTimeError);


        this.FetchResultList();
        // let res = APIManager.GetInstance().ResultAPI();
        // res.then(this.OnResultFetched, this.OnResultFailed);



        //Chips holders
        this.chipImageContainer = this.add.container();
        this.chipsHolder = this.add.image(width * 0.5, height * 0.95, 'chips', 'chipholder.png').setScale(Scale).setInteractive().on('pointerdown', this.OnChipsHolderClicked, this);
        this.chip25 = this.add.image(width * 0.5, height * 0.94, 'chips', 'chip25.png').setScale(1).setDepth(2);
        this.chip20 = this.add.image(width * 0.5, height * 0.94, 'chips', 'chip20.png').setScale(1).setDepth(2);
        this.chip10 = this.add.image(width * 0.5, height * 0.94, 'chips', 'chip10.png').setScale(1).setDepth(2);
        this.chip5 = this.add.image(width * 0.5, height * 0.94, 'chips', 'chip5.png').setScale(1).setDepth(2);
        this.chip2 = this.add.image(width * 0.5, height * 0.94, 'chips', 'chip2.png').setScale(1).setDepth(2);
        this.chipImageContainer.add([this.chip2, this.chip5, this.chip10, this.chip20, this.chip25]).setDepth(2);
        this.currentChipImage = this.add.image(width * 0.5, height * 0.94, 'chips', 'chip2.png').setScale(1).setDepth(2);
        this.currentChipKey = this.currentChipImage.texture.key;



        this.BetRandomCoins();

        this.bgAudio = this.AddAudio('bg', true);
        this.betAudio = this.AddAudio('bet', false);
        this.wheelAudio = this.AddAudio('wheel', true);
        this.zerobalanceAudio = this.AddAudio('zerobalance');
        this.clickAudio = this.AddAudio('click');
        this.autocoinAudio = this.AddAudio('autocoin');

        this.PlayAudio(this.bgAudio, true);
        this.soundOn = true;

        this.toggleShrink = this.add.image(width * 0.95, height * 0.1, 'chips', 'shrink.png').setScale(Scale).setInteractive().on('pointerup', this.ToggleFullScreen, this);

        this.menuContainer = this.add.container();
        this.menuPanel = this.add.image(width * 0.875, height * 0.025, 'chips', 'inactivebg.png').setOrigin(0).setScale(0.75, 2.5);
        this.sliderBtn = this.add.image(width * 0.95, height * 0.05, 'chips', 'slider.png').setScale(Scale).setInteractive().on('pointerdown', this.ToggleMenu, this);;
        this.gameRulesBtn = this.add.image(width * 0.95, height * 0.125, 'chips', 'gamerules.png').setScale(Scale).setInteractive().on('pointerdown', this.ShowGameRules, this);
        this.soundOnBtn = this.add.image(width * 0.95, height * 0.2, 'chips', 'soundon.png').setScale(Scale).setInteractive().on('pointerdown', this.ToggleSound, this);
        this.soundOffBtn = this.add.image(width * 0.95, height * 0.2, 'chips', 'soundoff.png').setScale(Scale).setInteractive().on('pointerdown', this.ToggleSound, this).setVisible(false);
        this.reportBtn = this.add.image(width * 0.95, height * 0.275, 'chips', 'reportmenu.png').setScale(Scale).setInteractive().on('pointerdown', this.Report, this);
        this.findBetBtn = this.add.image(width * 0.95, height * 0.35, 'chips', 'bet.png').setScale(Scale).setInteractive().on('pointerdown', this.findBet, this);
        this.homeBtn = this.add.image(width * 0.95, height * 0.425, 'chips', 'home.png').setScale(Scale).setInteractive().on('pointerdown', this.GotoHome, this);
        this.menuContainer.add([this.menuPanel, this.gameRulesBtn, this.soundOnBtn, this.soundOffBtn, this.reportBtn, this.findBetBtn, this.homeBtn]);

        this.menuContainer.x = width;

        // var editText= this.add.text(0, 0, "Edit Me", { fixedWidth: 150, fixedHeight: 36 }).setOrigin(0.5).setInteractive().on('pointerdown', ()=>{
        //     this.rexUI.edit(editText);
        // });
        let guideValue = localStorage.getItem('guidePopup');
        this.gameGuideContainer = this.add.container().setDepth(5);
        this.gameGuide = this.add.image(width * 0.5, height * 0.5, 'chips', 'gameguide.png').setScale(Scale).setDepth(5);
        this.gameGuideCheckBox = this.add.image(width * 0.08, height * 0.925, 'chips', 'checkbox.png').setScale(Scale).setDepth(5).setInteractive().on('pointerdown', this.TickGuide, this);
        this.gameGuideCheckBoxTick = this.add.image(width * 0.08, height * 0.925, 'chips', 'checkboxtick.png').setScale(Scale).setDepth(5).setVisible(false).setInteractive().on('pointerdown', this.TickGuide, this);;
        this.gameGuideText = this.add.text(width * 0.125, height * 0.925, 'Do not show at startup', { fontFamily: 'Arial', fontSize: '42px', fontStyle: 'normal' }).setDepth(5).setOrigin(0, 0.5).setInteractive().on('pointerdown', this.TickGuide, this);
        this.gameGuideCross = this.add.image(width * 0.925, height * 0.055, 'chips', 'cross.png').setScale(Scale).setInteractive().on('pointerdown', this.CloseGuide, this);
        this.gameGuideContainer.add([this.gameGuide, this.gameGuideCheckBox, this.gameGuideCheckBoxTick, this.gameGuideText, this.gameGuideCross]);

        if (guideValue == '' || guideValue == undefined || guideValue == '0' || guideValue == null) {
            this.gameGuideContainer.setVisible(true);
        }
        else if (guideValue == '1') {
            this.gameGuideContainer.setVisible(false);
        }

        this.betloading = this.add.image(width * 0.5, height * 0.5, 'chips', 'betloading.png').setScale(Scale).setVisible(false).setDepth(10);
        this.betInactiveBG = this.add.image(width * 0.5, height * 0.5, 'chips', 'inactivebg.png').setScale(Scale +0.5, Scale + 0.5).setInteractive().setVisible(false).setDepth(9);

        this.inactiveBG = this.add.image(width * 0.5, height * 0.5, 'chips', 'inactivebg.png').setScale(Scale + 0.5, Scale + 0.5).setInteractive().setVisible(false).setDepth(9);

        this.connectionContainer = this.add.container();
        this.connectionText = this.add.image(width * 0.5, height * 0.5, 'chips', 'bgpopup.png').setScale(Scale).setDepth(10);
        this.connectionContinue = this.add.image(this.connectionText.x - 250, this.connectionText.y + 100, 'chips', 'contionue.png').setScale(1).setDepth(10).setInteractive().on('pointerdown', ()=> {window.location.reload()});
        this.connectionExit = this.add.image(this.connectionText.x + 250, this.connectionText.y + 100, 'chips', 'Exit.png').setScale(1).setDepth(10).setInteractive().on('pointerdown', ()=> { this.connectionContainer.setVisible(false); this.inactiveBG.setVisible(false);}, this);
        this.connectionContainer.add([this.connectionText, this.connectionContinue, this.connectionExit]);
        this.connectionContainer.setVisible(false);

        this.time.addEvent({
            delay: 30000,
            loop: true,
            callback: this.CheckConnection,
            callbackScope: this,
        })

        this.OnBalanceUpdated(APIManager.GetInstance().GetBalance());

        this.BetDContainer = this.add.container().setDepth(10);
        this.BetDBG = this.add.rectangle(width * 0.5, height * 0.5, width, height, 0x101010, 0.99).setDepth(10).setInteractive(new Phaser.Geom.Rectangle(0,0, width, height), Phaser.Geom.Rectangle.Contains);
        this.BetDTopbar = this.add.rectangle(width * 0.5, height * 0.025, width, height * 0.055, 0x000, 1).setDepth(10);
        this.BetDTopBarText = this.add.text(width * 0.5, height * 0.025, 'Bet History', { fontFamily: 'Arial', fontSize: '42px', fontStyle: 'normal', color: '#ffae00' }).setOrigin(0.5).setDepth(10);
        this.BetDClose = this.add.image(width * 0.955, height * 0.025, 'chips', 'Close.png').setDepth(10).setInteractive().setScale(1).on('pointerdown', this.CloseBarcodeMenu, this);


        // var style = this.BetDFromDate.node.style;
        // style.width = width + 'px';
        // style.height = height + 'px';
        // style.display= 'block';
        // style.margin= 0;
        // style.position= 'absolute';
        // style.left='50%';
        // style.transform = 'translate(-50%, -50%)';

        this.BetDTitleContainer = this.add.container().setDepth(10);
        this.BetDTime = this.add.text(width * 0.075, height * 0.075, 'Time', { fontFamily: 'Arial', fontSize: '24px', fontStyle: 'normal', color: '#ffae00' }).setOrigin(0.5).setDepth(10);
        this.BetDBarcode = this.add.text(width * 0.3, height * 0.075, 'Barcode', { fontFamily: 'Arial', fontSize: '24px', fontStyle: 'normal', color: '#ffae00' }).setOrigin(0.5).setDepth(10);
        this.BetDPoints = this.add.text(width * 0.55, height * 0.075, 'Points', { fontFamily: 'Arial', fontSize: '24px', fontStyle: 'normal', color: '#ffae00' }).setOrigin(0.5).setDepth(10);
        this.BetDWins = this.add.text(width * 0.65, height * 0.075, 'Wins', { fontFamily: 'Arial', fontSize: '24px', fontStyle: 'normal', color: '#ffae00' }).setOrigin(0.5).setDepth(10);
        this.BetDPrint = this.add.text(width * 0.75, height * 0.075, 'Print', { fontFamily: 'Arial', fontSize: '24px', fontStyle: 'normal', color: '#ffae00' }).setOrigin(0.5).setDepth(10);
        this.BetDCancel = this.add.text(width * 0.85, height * 0.075, 'Cancel', { fontFamily: 'Arial', fontSize: '24px', fontStyle: 'normal', color: '#ffae00' }).setOrigin(0.5).setDepth(10);

        this.BetDTitleContainer.add([this.BetDTime, this.BetDBarcode, this.BetDPoints, this.BetDWins, this.BetDPrint, this.BetDCancel]);

        this.BetDGraphics = this.add.graphics().setDepth(10);
        this.BetDGraphics.fillStyle(0x202020).setAlpha(0);
        this.BetDGraphics.fillRect(width * 0.025, height * 0.085, width * 0.95, height * 0.9);

        this.BetDScrollBar = this.add.graphics().setDepth(10);
        this.BetDScrollBar.fillStyle(0x303030);
        this.BetDScrollBar.fillRect(width * 0.925, height * 0.1, width * 0.02, height * 0.835);

        this.BetDScrollBarPoint = this.add.graphics().setDepth(10);
        this.BetDScrollBarPoint.fillStyle(0x202020);
        this.BetDScrollBarPoint.fillCircle(width * 0.937, height * 0.1, 15);

        this.BetDMask = new Phaser.Display.Masks.GeometryMask(this, this.BetDGraphics);

        // this.BetDZone = this.add.zone(width * 0.025, height * 0.125, width * 0.95, height * 0.85).setDepth(10);
        // this.BetDZone.on('pointermove', this.OnBetDZoneScroll, this);

        this.BetDElementContainer = this.add.container().setDepth(10);
        this.BetDElementContainer.setMask(this.BetDMask);
        this.BetDValuesContainer = this.add.container().setDepth(10);
        this.BetDValuesContainer.setMask(this.BetDMask);


        this.BetDContainer.add([this.BetDBG, this.BetDTopbar, this.BetDTopBarText, this.BetDClose, this.BetDGraphics, this.BetDScrollBar, this.BetDScrollBarPoint, this.BetDElementContainer, this.BetDValuesContainer, this.BetDTitleContainer]);

        this.BetDContainer.setVisible(false);

        this.ReportContainer = this.add.container().setDepth(10);
        this.ReportBG = this.add.rectangle(width * 0.5, height * 0.5, width, height, 0x101010, 0.99).setDepth(10).setInteractive(new Phaser.Geom.Rectangle(0, 0, width, height), Phaser.Geom.Rectangle.Contains);
        this.ReportTopBar = this.add.rectangle(width * 0.5, height * 0.025, width, height * 0.055, 0x000, 1).setDepth(10);

        this.dateOneImage = this.add.image(width * 0.03, height * 0.025, 'chips', 'calander.png').setScale(1).setDepth(10);
        this.ReportDateOne = this.add.dom(width * 0.2, height * 0.025).createFromCache('datepicker').setOrigin(0.5).setScale(Scale);
        this.ReportDateOne.setPerspective(1000).setDepth(10);
        this.ReportDateOne.getChildByID('datePicker').value = new Date().toISOString().substr(0, 10);
        //this.ReportDateOne.addListener('click');
        // this.ReportDateOne.on('click', function(event){
        //    let datepicker = this.getChildByName('datePicker');
        //    console.log(datepicker.value);
        // })

        this.dateTwoImage = this.add.image(width * 0.35, height * 0.025, 'chips', 'calander.png').setScale(1).setDepth(10);
        this.ReportDateTwo = this.add.dom(width * 0.51, height * 0.025).createFromCache('datepicker').setOrigin(0.5).setScale(Scale);
        this.ReportDateTwo.setPerspective(1000).setDepth(10);
        this.ReportDateTwo.getChildByID('datePicker').value = new Date().toISOString().substr(0, 10);

        this.reportScreenButton = this.add.image(width * 0.775, height * 0.025, 'chips', 'report.png').setScale(1).setDepth(10).setInteractive().on('pointerdown', this.ShowReport, this);
        this.reportScreenClose = this.add.image(width * 0.955, height * 0.025, 'chips', 'Close.png').setDepth(10).setInteractive().setScale(1).on('pointerdown', this.CloseReportMenu, this);

        this.reportScreenElement = this.add.container().setDepth(10);

        this.ReportContainer.add([this.ReportBG, this.ReportTopBar, this.dateOneImage, this.ReportDateOne, this.dateTwoImage, this.ReportDateTwo, this.reportScreenButton, this.reportScreenClose, this.reportScreenElement]);

        this.ReportContainer.setVisible(false);


        if (isMobile) {
            this.scale.startFullscreen();
        }

    }

    update(t: number, dt: number) {
        this.timeText.setText(this.GetCurrentTime());
        if (this.nextDrawTimeUpdated) {
            this.UpdateDrawTime(dt);
        }
    }

    FetchResultList()
    {
        let resList = APIManager.GetInstance().ResultListAPI();
        resList.then(this.OnResultListUpdated, this.OnResulListFailed);
    }

    GetCurrentTime(): string {
        let currentTime = new Date();
        let time = currentTime.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric', second: 'numeric' });
        return time;
    }

    OnNextDrawTimeFound(value: JSON) {
        if (value != undefined) {
            if (value.nextDrawTimeStamp != undefined) {
                GameEventEmitter.GetInstance().emit(GAME_EVENTS.NEXT_DRAW_TIMESTAMP.key, value.nextDrawTimeStamp);
            }
        }
    }

    OnNextDrawTimeError(reason: any) {
        console.log(reason);
    }

    OnNextDrawTimeUpdated(drawtime: number) {
        this.bdrawTimeFound = true;
        this.nextDrawTimeStamp = drawtime;
        this.nextDrawTimeUpdated = true;
    }

    UpdateDrawTime(deltaTime: number) {
        let currentTimeStampDate = Math.round(Date.now() / 1000);
        let difference = (this.nextDrawTimeStamp - currentTimeStampDate);
        this.difference = difference;
        if (difference > 0) {
            if (difference < 10) {
                this.inactiveBG.setVisible(true);
            }
            else {
                this.inactiveBG.setVisible(false);
            }
            let hours = Phaser.Math.RoundTo(difference / 3600);
            if (hours > 0) {
                this.timeRemaining.setText(new Date(difference * 1000).toISOString().substr(11, 8));
            }
            else {
                this.timeRemaining.setText(new Date(difference * 1000).toISOString().substr(14, 5));
            }
        }
        if (difference <= 0 && this.bCanSpinWheel && this.bdrawTimeFound) {
            this.bdrawTimeFound = false;
            this.internalTime = 0;
            this.FetchResult();
            this.NextDrawTime();
        }
    }

    FetchResult()
    {
            this.bCanChangeToken = false;
            let res = APIManager.GetInstance().ResultAPI();
            res.then(this.OnResultFetched, this.OnResultFailed);        
    }

    NextDrawTime()
    {
        let nextDrawTime = APIManager.GetInstance().NextDrawTimeStampAPI();
        nextDrawTime.then(this.OnNextDrawTimeFound, this.OnNextDrawTimeError);
    }

    OnResultFetched(value: JSON) {
        console.log(JSON.stringify(value));
        let ResultData: IResultData;
        ResultData = value as unknown as IResultData;
        if (ResultData != undefined) {
            if (ResultData.ResultDetails != undefined) {
                for (let index = 0; index < ResultData.ResultDetails.length; index++) {
                    const element = ResultData.ResultDetails[index];
                    if (element.Value) {
                        GameEventEmitter.GetInstance().emit(GAME_EVENTS.ON_BALANCE_UPDATED.key, element.Balance);
                        GameEventEmitter.GetInstance().emit(GAME_EVENTS.ON_VALUE_UPDATED.key, element.Value, element.bouns);
                        GameEventEmitter.GetInstance().emit(GAME_EVENTS.NEXT_DRAW_TIMESTAMP.key, element.NextDrawTimeStamp);
                        GameEventEmitter.GetInstance().emit(GAME_EVENTS.FETCH_NEXT_DRAWTIME.key);
                        GameEventEmitter.GetInstance().emit(GAME_EVENTS.FETCH_RESULT_LIST.key);
                    } else {
                        GameEventEmitter.GetInstance().emit(GAME_EVENTS.FETCH_RESULT.key);
                    }
                }
            }
            else {
                console.log("Result Detail not found");
            }
        } else {
            console.log("Result Data Missing");
        }
    }

    OnResultFailed(reason: any) {
        console.log(reason);
    }

    SpinWheel(smallNumber: number, bigNumber: number, bonusNumber: number) {
        this.bCanSpinWheel = false;
        console.log("Spin Wheel" +  this.bCanSpinWheel);
        this.PlayAudio(this.wheelAudio, true);
        let Rounds = 5;
        let DegreePerSlice = 36;
        let DegreePerNumber = (10 - bigNumber - 1) * DegreePerSlice;
        this.tweens.add({
            targets: [this.bigNumberWheel, this.bigNumberWheelLines],
            angle: 360 * Rounds + DegreePerNumber,
            duration: WheelOption.bigWheelRotationTime,
            ease: 'Cubic.easeOut',
        });

        DegreePerNumber = (10 - smallNumber - 1) * DegreePerSlice;
        this.tweens.add({
            targets: [this.smallNumberWheel, this.smallNumberWheelLines],
            angle: -360 * Rounds + DegreePerNumber,
            duration: WheelOption.smallWheelRotationTime,
            ease: 'Cubic.easeOut',
        });


        DegreePerNumber = (10 - bonusNumber) * DegreePerSlice;
        this.tweens.add({
            targets: [this.bonusWheel, this.bonusWheelLines],
            angle: 360 * Rounds + DegreePerNumber,
            duration: WheelOption.bonusWheelRotationTime,
            ease: 'Cubic.easeOut',
            callbackScope: this,
            onComplete: this.OnSpinComplete
        });
    }


    OnSpinComplete() {
        this.OnClearChipData();
        this.bCanSpinWheel = true;
        this.dummyBetsContainer.removeAll(true);
        this.wheelAudio.stop();
    }

    OnChipsHolderClicked() {
        let chipDuration = 250;
        var width = ResizeManager.referenceScreeenSize.width;
        var height = ResizeManager.referenceScreeenSize.height;
        if (!this.bIsChipHolderOpen) {
            this.bIsChipHolderOpen = true;

            let widthArray: number[] = [width * 0.3, width * 0.375, width * 0.5, width * 0.625, width * 0.7];
            let heightArray: number[] = [height * 0.925, height * 0.85, height * 0.8, height * 0.85, height * 0.925];

            for (let i = 0; i < this.tweenArray.length; ++i) {
                this.tweenArray[i].stop();
            }

            this.tweenArray.length = 0;

            this.tweenArray.push(this.tweens.add({
                targets: this.chipsHolder,
                y: height * 0.95,
                duration: chipDuration
            }))

            this.tweenArray.push(this.tweens.add({
                targets: this.chip2,
                x: widthArray[0],
                y: heightArray[0],
                duration: chipDuration,
                angle: 360
            }));

            this.tweenArray.push(this.tweens.add({
                targets: this.chip5,
                x: widthArray[1],
                y: heightArray[1],
                duration: chipDuration,
                angle: 360
            }))

            this.tweenArray.push(this.tweens.add({
                targets: this.chip10,
                x: widthArray[2],
                y: heightArray[2],
                duration: chipDuration,
                angle: 360
            }));

            this.tweenArray.push(this.tweens.add({
                targets: this.chip20,
                x: widthArray[3],
                y: heightArray[3],
                duration: chipDuration,
                angle: 360
            }));

            this.tweenArray.push(this.tweens.add({
                targets: this.chip25,
                x: widthArray[4],
                y: heightArray[4],
                duration: chipDuration,
                angle: 360,
                onComplete: this.OnChipsHolderTweenFinish,
                callbackScope: this
            }));

        }
        else {
            this.bIsChipHolderOpen = false;

            for (let i = 0; i < this.tweenArray.length; ++i) {
                this.tweenArray[i].stop();
            }

            this.tweenArray.length = 0;

            this.tweenArray.push(this.tweens.add({
                targets: this.chipsHolder,
                y: height * 0.95,
                duration: chipDuration
            }))

            this.tweenArray.push(this.tweens.add({
                targets: [this.chip2, this.chip5, this.chip10, this.chip20, this.chip25],
                x: width * 0.5,
                y: height * 0.94,
                angle: 360,
                duration: chipDuration,
                callbackScope: this,
                onComplete: this.OnChipHolderBackToOriginal
            }));
        }
        this.PlayAudio(this.clickAudio);
    }


    OnChipsHolderTweenFinish() {
        for (let i = 0; i < this.chipImageContainer.length; ++i) {
            let chipImage = this.chipImageContainer.getAt(i) as typeof(Image);

            chipImage.setInteractive().on("pointerdown", () => { this.OnChipImageClicked(chipImage) }, this);
        }
    }

    OnChipHolderBackToOriginal() {
        for (let i = 0; i < this.chipImageContainer.length; ++i) {
            let chipImage = this.chipImageContainer.getAt(i) as typeof(Image);

            chipImage.removeInteractive().removeAllListeners();
        }
    }

    OnChipImageClicked(chipImage: GameObjects.Image) {
        this.currentChipImage.setTexture(chipImage.texture.key, chipImage.frame.name);
        this.currentChipKey = chipImage.texture.key;
        switch (chipImage.frame.name) {
            case 'chip2.png':
                this.currentChipType = 2;
                break;
            case 'chip5.png':
                this.currentChipType = 5;
                break;
            case 'chip10.png':
                this.currentChipType = 10;
                break;
            case 'chip20.png':
                this.currentChipType = 20;
                break;
            case 'chip25.png':
                this.currentChipType = 25;
                break;
        }
        this.OnChipsHolderClicked();
    }

    OnChipNumberClicked(numberClicked: number, numberImage: GameObjects.Image) {
        if (this.bIsChipHolderOpen) {
            this.OnChipsHolderClicked();
            return;
        }
        if (this.balance <= 0) {
            this.balance = 0;
            this.PlayAudio(this.zerobalanceAudio)
        }


        let currentChipData = new ChipDataHandler(numberClicked);

        this.PlayAudio(this.betAudio, false);

        this.chipData.push(currentChipData);

        let foundchipData = this.chipData.find(currentChipData => currentChipData.GetChipData().key == numberClicked);
        if ((foundchipData.GetTotalValue() + this.currentChipType) <= 99) {
            foundchipData.IncreamentChipValue(this.currentChipType);
            ++this.betsCount;
            this.betsScore.setText(this.betsCount.toString());
            this.amtScore.setText(this.GetTotalAmount().toString());
            if (foundchipData.GetChipImage() == null) {
                let betChip = new NumberChips(this, numberImage.x, numberImage.y, this.currentChipKey, this.GetFrameName(foundchipData.GetTotalValue()), foundchipData.GetTotalValue().toString());
                this.add.existing(betChip);
                foundchipData.SetChipImage(betChip);
                this.chipBetsContainer.add(betChip);
            } else {
                foundchipData.GetChipImage().setFrame(this.GetFrameName(foundchipData.GetTotalValue()));
                foundchipData.GetChipImage().SetNumberText(foundchipData.GetTotalValue().toString());
            }

        }
    }

    GetFrameName(amount: number): string {
        let FrameName = "";
        if (amount < 5) {
            FrameName = "coin2.png";
        } else if (amount >= 5 && amount < 10) {
            FrameName = "coin5.png";
        } else if (amount >= 10 && amount < 20) {
            FrameName = "coin10.png";
        } else if (amount >= 20 && amount < 25) {
            FrameName = "coin20.png";
        } else {
            FrameName = "coin25.png";
        }

        return FrameName;
    }

    GetTotalAmount(): number {
        let Amount = 0;
        for (let index = 0; index < this.chipData.length; index++) {
            const element = this.chipData[index];
            Amount += element.GetTotalValue();
        }
        return Amount;
    }

    OnClearChipData() {
        this.chipData.length = 0;
        this.betsCount = 0;
        this.betsScore.setText(this.betsCount.toString());
        this.amtScore.setText('0');
        this.chipBetsContainer.removeAll(true);
        this.PlayAudio(this.clickAudio);
    }

    OnLineBetClicked(line: number, bIsHorizontal: boolean) {
        let count = 0;
        while (count < 10) {
            let index = -1;
            if (bIsHorizontal) {
                index = line + (10 * count);
            } else {
                index = (line * 10) + count;
            }
            let chipImage = this.numberContainer.getAt(index) as typeof(Image);
            this.OnChipNumberClicked(index, chipImage);
            ++count;
        }
    }

    OnBuyChipData() {
        if (this.chipData.length > 0) {
            let buyValue: string = "";
            let total = 0;
            for (let index = 0; index < this.chipData.length; ++index) {
                const element = this.chipData[index];
                buyValue += element.GetChipData().key + "-" + element.GetTotalValue() + ";";
                total += element.GetTotalValue();
            }
            if(total > parseInt(APIManager.GetInstance().GetBalance()))
            {
                alert("Insufficient Balance");
                return;
            }
            let res = APIManager.GetInstance().SaleAPI(buyValue);
            this.betloading.setVisible(true);
            this.betInactiveBG.setVisible(true);
            res.then(this.OnBuyComplete, this.OnBuyfailed);
            this.OnClearChipData();
            this.PlayAudio(this.clickAudio);
        }
    }

    OnBuyComplete(Response: JSON) {
        GameEventEmitter.GetInstance().emit(GAME_EVENTS.ON_BUY_COMPLETE.key, false, <ISalesDetails>Response);
        // this.betloading.setVisible(false);
        // this.betInactiveBG.setVisible(false);
    }

    OnBuyfailed(Reason: any) {
        GameEventEmitter.GetInstance().emit(GAME_EVENTS.ON_BUY_COMPLETE.key, true, null);
        // this.betloading.setVisible(false);
        // this.betInactiveBG.setVisible(false);
    }

    OnBuyFinish(failed: boolean, SalesDetails: ISalesDetails) {
        this.betloading.setVisible(false);
        this.betInactiveBG.setVisible(false);
        if (!failed && SalesDetails != null) {
            APIManager.GetInstance().SetBarcode(SalesDetails.SalesDetails[0].Barcode.toString());
            this.OnBalanceUpdated(SalesDetails.SalesDetails[0].Balance.toString());
        
            if (this.whatsappOn) {
                this.Whatsapp();
            }
            if (this.printOn) {
                this.Print(SalesDetails.SalesDetails[0].Barcode.toString());
            }
        }
    }

    OnBalanceUpdated(balance: string) {
        this.pointTxt.setText(balance);
    }

    OnValueUpdated(value: number, bonus: number) {
        console.log("Value " + value);
        this.bCanChangeToken =true;
        let BNumber = value / 10;
        let BigNumber = Math.trunc(BNumber);
        let SmallNumber = 0;
        if (BigNumber == 0) {
            SmallNumber = value;
        } else {
            SmallNumber = (value % (BigNumber * 10));
        }
        let Bonus = bonus;
        if(this.bCanSpinWheel)
        this.SpinWheel(SmallNumber, BigNumber, Bonus);
    }

    OnResultListUpdated(value: JSON) {
        let result: IResultListData;
        result = value as unknown as IResultListData;
        GameEventEmitter.GetInstance().emit(GAME_EVENTS.ON_RESULTLIST_UPDATED.key, result.ResultList);
    }

    OnResulListFailed(reason: any) {
        console.log(reason);
    }

    OnResultListDataUpdated(Data: IResultList[]) {
        if (Data != null || Data != undefined) {
            let maxNumber = 7;
            let count = 0;
            var width = ResizeManager.referenceScreeenSize.width;
            var height = ResizeManager.referenceScreeenSize.height;
            var widthOffset = 0.1;
            for (let index = 0; index < Data.length; index++) {
                const element = Data[index];
                let gamevalue = parseInt(element.GameValue);
                if (gamevalue > 0) {
                    let BNumber = gamevalue / 10;
                    let BigNumber = Math.trunc(BNumber);
                    let SmallNumber = 0;
                    if (BigNumber == 0) {
                        SmallNumber = gamevalue;
                    } else {
                        SmallNumber = (gamevalue % (BigNumber * 10));
                    }

                    if (count == 0) {
                        this.SpinWheel(SmallNumber, BigNumber, 0);
                    }
                    let text = this.historyTimeTextContainer.getAt(count) as GameObjects.Text;
                    text.setText(element.GameTime).setVisible(true);
                    let bigNumberText = this.historyBigNumberContainer.getAt(count) as GameObjects.Text;
                    bigNumberText.setText(BigNumber.toString()).setVisible(true);
                    let smallNumberText = this.historySmallNumberContainer.getAt(count) as GameObjects.Text;
                    smallNumberText.setText(SmallNumber.toString()).setVisible(true);
                    if (parseInt(element.bonus) > 1) {
                        let Image = this.historyBonusNumberContainer.getAt(count) as GameObjects.Image;
                        Image.setVisible(true);
                    }
                    count++;
                    if (count >= 7) {
                        break;
                    }
                }

            }
        }
    }

    BetRandomCoins() {
        let timeDelay = 30000;

        let TimerEventConfig: Phaser.Types.Time.TimerEventConfig = {
            loop: false,
            delay: timeDelay,
            callbackScope: this,
            callback: this.BetRandomCoinsNow
        }

        this.time.addEvent(TimerEventConfig);

    }

    BetRandomCoinsNow() {
        if (this.difference < 20 || !this.bCanSpinWheel) {
            this.BetRandomCoins();
        }
        else {

            for (let i = 0; i < 5; i++) {


                let numbersOfBet = Phaser.Math.Between(10, 20);
                let amountChip = [2, 5, 10, 20, 25];
                for (let index = 0; index < numbersOfBet; index++) {

                    let betAmount = amountChip[Phaser.Math.Between(0, amountChip.length - 1)];
                    let image = this.add.image(this.virtualUsers.x, this.virtualUsers.y, 'chips', 'coin' + betAmount + '.png').setScale(0.5);
                    let number = this.numberContainer.getAt(Phaser.Math.Between(0, this.numberContainer.length - 1)) as GameObjects.Image;
                    this.tweens.add({
                        targets: image,
                        duration: 250,
                        x: number.x,
                        y: number.y,
                        ease: 'cubic',
                        delay: i * 1000,
                        callbackScope: this,
                        onCompleteParams: image,
                        onComplete: this.OnDummyChipReached,
                    })
                }
            }

            this.BetRandomCoins();
        }
    }

    OnDummyChipReached(Tween: Phaser.Tweens.Tween, image: Phaser.GameObjects.Image[]) {
        this.tweens.add({
            targets: image,
            delay: 500,
            duration: 1000,
            alpha: { value: 0, ease: 'Power1' },
            callbackScope: this,
            onCompleteParams: image,
            onComplete: this.DestroyDummyChip,

        });
    }

    DestroyDummyChip(Tween: Phaser.Tweens.Tween, img: Phaser.GameObjects.Image[]) {
        for (let index = 0; index < img.length; index++) {
            const element = img[index];
            element.destroy();
        }
    }

    ToggleFullScreen() {
        if (this.scale.isFullscreen) {
            this.scale.toggleFullscreen();
        } else {
            this.scale.startFullscreen(null);
        }
    }


    AddAudio(key: string, loop: boolean = false): Phaser.Sound.BaseSound {
        return this.sound.add(key, { loop: loop, volume: 1 });
    }

    PlayAudio(audio: Phaser.Sound.BaseSound, loop: boolean = false) {
            audio.play({ loop: loop });
    }

    ToggleMenu() {
        var width = ResizeManager.referenceScreeenSize.width;
        var height = ResizeManager.referenceScreeenSize.height;
        this.bIsMenuOpen = !this.bIsMenuOpen;
        if (this.menuTween != null)
            this.menuTween.stop();
        if (this.bIsMenuOpen) {

            this.menuTween = this.tweens.add({
                targets: this.menuContainer,
                x: width * 0,
                duration: 250,
                loop: false
            });

        } else {
            this.menuTween = this.tweens.add({
                targets: this.menuContainer,
                x: width * 1,
                duration: 250,
                loop: false
            });
        }
    }

    ShowGameRules() {
        this.gameGuideContainer.setVisible(true);
    }


    ToggleSound() {
        //this.sound.mute = this.soundOn;
        if (this.soundOn) {
            this.soundOnBtn.setVisible(false);
            this.soundOffBtn.setVisible(true);
            this.bgAudio.pause();
        } else {
            this.soundOnBtn.setVisible(true);
            this.soundOffBtn.setVisible(false);
            this.bgAudio.play();
        }
        this.soundOn = !this.soundOn;
    }

    Report() {
        this.ReportContainer.setVisible(true);
    }

    findBet() {
        let dateTwo = new Date();
        let dateOne = new Date();
        dateOne.setHours(0);
        dateOne.setMinutes(0);
        dateOne.setSeconds(0);
        let res = APIManager.GetInstance().BarcodeAPI((dateOne.getTime() / 1000).toString(), (dateTwo.getTime() / 1000).toString());
        res.then(this.BarcodeListUpdated, this.BarcodeListFailed);
        this.BetDContainer.setVisible(true);
    }

    GotoHome() {
        document.location.href = "/";
    }

    TickGuide() {
        var value = localStorage.getItem('guidePopup');
        if (value == undefined || value == '' || value == '0' || value == null) {
            value = '1';
            this.gameGuideCheckBox.setVisible(false).removeInteractive();
            this.gameGuideCheckBoxTick.setVisible(true).setInteractive();
        }
        else if (value == '1') {
            value = '0';
            this.gameGuideCheckBox.setVisible(true).setInteractive();
            this.gameGuideCheckBoxTick.setVisible(false).removeInteractive();
        }

        localStorage.setItem('guidePopup', value);
    }

    CloseGuide() {
        this.gameGuideContainer.setVisible(false);
    }

    CheckConnection() {
        if(this.bCanChangeToken)
        {
        let res = APIManager.GetInstance().UpdateTokenAPI();
        res.then(this.OnTokenUpdateSucceeded, this.OnTokenUpdatedFailed);
        }
    }

    OnTokenUpdateSucceeded(value: JSON) {
        //APIManager.GetInstance().SetLifeTimeToken()   
        let token: IToken = null;
        token = <IToken>value;
        if (token != null) {
            if(token.TokenDetails != null)
            {
                for (let i = 0; i < token.TokenDetails.length; i++) {
                    APIManager.GetInstance().SetLifeTimeToken(token.TokenDetails[i].LifeToken);
                }
            }  else{
                console.log("Token: " + JSON.stringify(value));
                //GameEventEmitter.GetInstance().emit(GAME_EVENTS.ON_CONNECTION_LOST.key);
            }
        }
        else {
            console.error("token is null");
            //GameEventEmitter.GetInstance().emit(GAME_EVENTS.ON_CONNECTION_LOST.key);
        }
    }

    OnTokenUpdatedFailed(reason: any) {
        console.log("Token error: " + reason);
       // GameEventEmitter.GetInstance().emit(GAME_EVENTS.ON_CONNECTION_LOST.key);
    }

    OnConnectionLost()
    {
        this.inactiveBG.setVisible(true);
        this.connectionContainer.setVisible(true);
    }

    OnTokenUpdated(newToken: string) {
        APIManager.GetInstance().SetLifeTimeToken(newToken);
    }

    Print(barcode: string = '') {
        let res = APIManager.GetInstance().GenerateBill();
        res.then(this.BillGenerated, this.BillFailed);

    }

    BillGenerated(value: JSON) {
        let Barcode !: IBarcode = <IBarcode>value;
        
        let printHtml = '<p>Jackpot: ' + APIManager.GetInstance().GetUserID() + ' </p>';
        printHtml = '<p>' + Barcode.barcode + '</p>';
        printHtml += '<p>' + '2 Digit' + '</p>';
        printHtml += '<p>' + 'Date: ' + Barcode.date + '</p>';
        let message = '';
        let total = 0;
            for (let i = 0; i < Barcode.digit.length; i++)
            {
                if (i % 4 == 0 && i != 0)
                {
                    message += "<br><br>";
                }
                message += Barcode.digit[i] + " - " + Barcode.qty[i] + "&nbsp;&nbsp;&nbsp;&nbsp;";
                total += parseInt(Barcode.qty[i]);
                
            }
        printHtml += '<p>' + message + '</p>';
        printHtml += '<p>' + 'QTY: ' + total + ' Rs. ' + Barcode.tot_amount + ' Total: ' + Barcode.tot_amount + '</p>';
        printHtml += '<p></p>';
        printHtml += '<p>more info on pubgtime.com</p>';
        printJS({ type: 'raw-html', printable: printHtml, documentTitle: '2 Digit'});
        // printJs({
        //     printable: [
        //         {
        //             'Barcode': Barcode.barcode.toString(),
        //             'Date': Barcode.date.toString(),
        //             'TotalAmount': Barcode.tot_amount.toString(),
        //             'Rate': Barcode.rate.toString(),
        //             'SaleId': Barcode.saleid.toString(),
        //             'Digit': Barcode.digit.toString(),
        //             'Qty': Barcode.qty.toString()
        //         }
        //     ],
        //     type: "json",
        //     style: 'td { text-align: center; }',
        //     documentTitle: '2Digit',
        //     properties: [{ field: 'Barcode', displayName: 'Barcode' },
        //     { field: 'Date', displayName: 'Date' },
        //     { field: 'TotalAmount', displayName: 'Total Amount' },
        //     { field: 'Rate', displayName: 'Rate' },
        //     { field: 'SaleId', displayName: 'SaleId' },
        //     { field: 'Digit', displayName: 'Digit' },
        //     { field: 'Qty', displayName: 'Qty' }],

        // });

    }

    BillFailed(reason: any) {
        console.log(reason);
    }

    Whatsapp() {
        let res = APIManager.GetInstance().GenerateBill();
        res.then(this.WhatsappSuccess, this.WhatsappFailed);
    }

    WhatsappSuccess(value: JSON) {
        console.log(JSON.stringify(value));
        let whatsappObj: IWhatsappObject = <IWhatsappObject><unknown>value;
        if (whatsappObj != null) {
            console.log(whatsappObj);
            let hours = Phaser.Math.RoundTo(parseInt(whatsappObj.drawTime[0]) / 3600);
            let time: string = "00:00";
            // if (hours > 0) {
                time = (new Date(parseInt(whatsappObj.drawTime[0]) * 1000).toLocaleTimeString())
            // }
            // else {
            //     time = (new Date(parseInt(whatsappObj.drawTime[0]) * 1000).toLocaleString().substr(14, 5));
            // }
            let message = " Jackpot :" + APIManager.GetInstance().GetUserID();
            message += "%0A Barcode : " + whatsappObj.barcode;
            message += "%0A 2Digit Draw Time %0A" + whatsappObj.date + " " + time;
            message += "%0A ";
            let total = 0;
            for (let i = 0; i < whatsappObj.digit.length; i++)
            {
                message += whatsappObj.digit[i] + " = " + whatsappObj.qty[i] + "  ";
                total += parseInt(whatsappObj.qty[i]);
                if (i % 5 == 0 && i != 0)
                {
                    message += "%0A ";
                }
            }

            message += "%0A MRP " + whatsappObj.rate + " QTY " + total + " Total " + whatsappObj.tot_amount;
            //             Jackpot :520002 
            //              Barcode : 82718646 
            //              American Roulette  Draw Time 10-04-2021 11:48 am
            //              3 - 16- 19- 112- 115- 118- 121- 124- 127- 130- 133- 136- 1
            //              MRP 2  QTY 12 Total 24
            let str = "https://api.whatsapp.com/send?text=" + message;
            window.open(str, '_blank');
        }
    }

    WhatsappFailed(reason: any) {
        console.log(reason);
    }

    OnBetDZoneScroll(pointer: Phaser.Input.Pointer) {
        // if(pointer.isDown && this.BetDContainer.length >= 30)
        // {
        //     this.BetDContainer.y = (pointer.velocity.y / 10);

        // }
    }

    CloseBarcodeMenu() {
        if (!this.bBetDetailsOpen)
        {
            this.BetDContainer.setVisible(false);
        }
        else
        {
            this.BetDElementContainer.setVisible(true);
            this.BetDTitleContainer.setVisible(true);
            this.BetDTopBarText.setText('Bet History');
            this.BetDValuesContainer.setVisible(false);
            this.bBetDetailsOpen = false;
        }
    }

    BarcodeListUpdated(value: JSON) {
        console.log(JSON.stringify(value));
        let BarcodeArray = <IBarcodeList[]><unknown>value;
        GameEventEmitter.GetInstance().emit(GAME_EVENTS.ON_BARCODELIST_UPDATED.key, BarcodeArray);
    }

    BarcodeListFailed(reason: any) {
        console.log(reason);
    }

    FillBarcodeList(barcodeList: IBarcodeList[]) {

        // this.BetDTime = this.add.text(width * 0.05, height * 0.1, 'Time', { fontFamily: 'Arial', fontSize: '20px', fontStyle: 'normal', color: '#ffae00' }).setOrigin(0.5).setDepth(10);
        // this.BetDBarcode = this.add.text(width * 0.25, height * 0.1, 'Barcode', { fontFamily: 'Arial', fontSize: '20px', fontStyle: 'normal', color: '#ffae00' }).setOrigin(0.5).setDepth(10);
        // this.BetDPoints = this.add.text(width * 0.55, height * 0.1, 'Points', { fontFamily: 'Arial', fontSize: '20px', fontStyle: 'normal', color: '#ffae00' }).setOrigin(0.5).setDepth(10);
        // this.BetDWins = this.add.text(width * 0.65, height * 0.1, 'Wins', { fontFamily: 'Arial', fontSize: '20px', fontStyle: 'normal', color: '#ffae00' }).setOrigin(0.5).setDepth(10);
        // this.BetDPoints = this.add.text(width * 0.75, height * 0.1, 'Print', { fontFamily: 'Arial', fontSize: '20px', fontStyle: 'normal', color: '#ffae00' }).setOrigin(0.5).setDepth(10);
        // this.BetDCancel = this.add.text(width * 0.85, height * 0.1, 'Cancel', { fontFamily: 'Arial', fontSize: '20px', fontStyle: 'normal', color: '#ffae00' }).setOrigin(0.5).setDepth(10);
        var width = ResizeManager.referenceScreeenSize.width;
        var height = ResizeManager.referenceScreeenSize.height;
        var Scale = 2;
        this.BetDElementContainer.removeAll(true);

        let offsetY = height * 0.05;
        for (let index = 0; index < barcodeList.length; ++index) {
            const barcode = barcodeList[index];
            let elementContainer = this.add.container();

            let date = new Date(barcode.drawTimeStamp * 1000);
            let heightOffset = 0.1;
            let datetext = this.add.text(width * 0.1, height * heightOffset + offsetY * index, date.toLocaleTimeString('en-IN'), { fontFamily: 'Arial', fontSize: '24px', fontStyle: 'normal', color: '#FFF' }).setDepth(10).setOrigin(0.5);

            let barcodeText = this.add.text(width * 0.29, height * heightOffset + offsetY * index, barcode.barcode, { fontFamily: 'Arial', fontSize: '52px', fontStyle: 'normal', color: '#FFF' }).setDepth(10).setOrigin(0.5).setInteractive().on('pointerdown', ()=> this.ShowBetDetailsValues(barcode), this);

            let pointsText = this.add.text(width * 0.555, height * heightOffset + offsetY * index, barcode.Amount, { fontFamily: 'Arial', fontSize: '24px', fontStyle: 'normal', color: '#FFF' }).setDepth(10).setOrigin(0.5);

            let claimText = this.add.text(width * 0.65, height * heightOffset + offsetY * index, barcode.Status == "Claimed" ? 'Y' : 'N', { fontFamily: 'Arial', fontSize: '24px', fontStyle: 'normal', color: '#FFF' }).setDepth(10).setOrigin(0.5);

            let printcircle = this.add.image(width * 0.75, height * heightOffset + offsetY * index, 'chips', 'reprint.png').setDepth(10).setOrigin(0.5).setInteractive().on('pointerdown', () => this.Print(barcode.barcode), this).setOrigin(0.5);

            let cancelCircle = this.add.image(width * 0.85, height * heightOffset + offsetY * index, 'chips', 'CloseIcon.png').setDepth(10).setOrigin(0.5).setInteractive().on('pointerdown', () => this.CancelTicket(barcode.barcode), this).setOrigin(0.5);

            elementContainer.add([datetext, barcodeText, pointsText, claimText, printcircle, cancelCircle]);
            this.BetDElementContainer.add(elementContainer);

        }



    }

    ShowBetDetailsValues(barcode: IBarcodeList) {
        this.BetDElementContainer.setVisible(false);
        this.BetDTitleContainer.setVisible(false);
        this.bBetDetailsOpen = true;
        this.BetDValuesContainer.removeAll(true);
        var width = ResizeManager.referenceScreeenSize.width;
        var height = ResizeManager.referenceScreeenSize.height;
        var Scale = 2;
        let date = new Date(barcode.drawTimeStamp * 1000);

        this.BetDTopBarText.setText('Details');

        let time = this.add.text(width * 0.1, height * 0.1, date.toLocaleTimeString('en-IN'), { fontFamily: 'Arial', fontSize: '32px', fontStyle: 'normal', color: '#FFF' }).setDepth(10).setOrigin(0.5);
        let datetext = this.add.text(width * 0.4, height * 0.1, date.toLocaleDateString('en-IN'), { fontFamily: 'Arial', fontSize: '32px', fontStyle: 'normal', color: '#FFF' }).setDepth(10).setOrigin(0.5);

        let widthOffset = 0.25;
        let heightOffset = 0.025;
        let heightIndex = 0, widthIndex = 0;
        for (let index = 0; index < barcode.Values.length; index++) {
            let string = barcode.Values[index];
            if(string.length < 4)
            {
                string = "0" + string;
            }
            let values = this.add.text(width * ( 0.1 + widthOffset * widthIndex), height *  (0.13 +heightIndex * heightOffset), string, { fontFamily: 'Arial', fontSize: '48px', fontStyle: 'normal', color: '#ffae00' }).setDepth(10).setOrigin(0.5).setWordWrapWidth(width * 0.8, true);
            widthIndex++;
            if(index % 4 == 0 && index != 0)
            {
                widthIndex = 0;
                heightIndex++;
            }
            this.BetDValuesContainer.add(values);
        }

       // values.getBounds()

        // let rect = values.getBounds();
        heightIndex++;
        let total = this.add.text(width * 0.1, (height * (0.13 + heightIndex * heightOffset)), 'Total: ' + barcode.Amount,{ fontFamily: 'Arial', fontSize: '32px', fontStyle: 'normal', color: '#FFF' }).setDepth(10).setOrigin(0.5);

        this.BetDValuesContainer.add([datetext, time, total]);
        this.BetDValuesContainer.setVisible(true);
    }


    CancelTicket(barcode: string) {
        let res = APIManager.GetInstance().CancelAPI(barcode);
        res.then(this.CancelTicketSucceed, this.CancelTicketFailed)
    }

    CancelTicketSucceed(value: JSON) {
        console.log(value);
        if(value != null)
        {
            if(value.warning != null)
            {
            alert(value.warning);
            }else if(value.terminalBal != null)
            {
                APIManager.GetInstance().SetBalance(parseInt(value.terminalBal));
                GameEventEmitter.GetInstance().emit(GAME_EVENTS.ON_BALANCE_UPDATED.key, (parseInt(value.terminalBal)));
                alert("Balance Updated: " + parseInt(value.terminalBal));
            }
        }
    }

    CancelTicketFailed(error: any) {
        console.log(error);
    }

    CloseReportMenu() {
        this.ReportContainer.setVisible(false);
    }

    ShowReport() {
        let dateOne = new Date(this.ReportDateOne.getChildByID('datePicker').value);
        let dateTwo = new Date(this.ReportDateTwo.getChildByID('datePicker').value);
        let res = APIManager.GetInstance().ReportAPI((dateOne.getTime() / 1000).toString(), (dateTwo.getTime() / 1000).toString());
        res.then(this.ReportFetched, this.ReportFailed);
    }

    ReportFetched(value: JSON) {
        let SalesReport: ISalesReportRoot = <ISalesReportRoot><unknown>value;
        GameEventEmitter.GetInstance().emit(GAME_EVENTS.ON_REPORT_GENERATED.key, SalesReport);
    }

    ReportFailed(value: any) {
        console.log("Report Error " + value);
    }

    OnReportGenerated(SalesReport: ISalesReportRoot) {
        this.reportScreenElement.removeAll(true);
        var width = ResizeManager.referenceScreeenSize.width;
        var height = ResizeManager.referenceScreeenSize.height;

        if (SalesReport != null) {

            let foundSaleReport = SalesReport.SalesReport[0];

            let dateOne = new Date(this.ReportDateOne.getChildByID('datePicker').value);
            let dateTwo = new Date(this.ReportDateTwo.getChildByID('datePicker').value);
            let cDate = new Date();

            let style = { fontFamily: 'Arial', fontSize: '48px', fontStyle: 'normal', color: '#ffae00' };
            let GameName = this.add.text(width * 0.05, height * 0.075, '2Digit', style).setDepth(10);
            let UserId = this.add.text(width * 0.05, height * 0.1, 'ID: ' + APIManager.GetInstance().GetUserID(), style).setDepth(10);


            let fromDate = this.add.text(width * 0.05, height * 0.145, 'From: ' + dateOne.toLocaleDateString(), style).setDepth(10);
            let toDate = this.add.text(width * 0.95, height * 0.145, 'To: ' + dateTwo.toLocaleDateString(), style).setDepth(10).setOrigin(1, 0);
            let lineOne = this.add.graphics().setDepth(10).lineStyle(10, 0xffae00).beginPath().moveTo(width * 0.05, height * 0.175).lineTo(width * 0.95, height * 0.175).closePath().strokePath();


            let currentDate = this.add.text(width * 0.05, height * 0.195, 'Date: ' + cDate.toLocaleDateString(), style).setDepth(10);
            let currentTime = this.add.text(width * 0.95, height * 0.195, 'Time: ' + cDate.toLocaleTimeString(), style).setDepth(10).setOrigin(1, 0);

            let lineTwo = this.add.graphics().setDepth(10).lineStyle(10, 0xffae00).beginPath().moveTo(width * 0.05, height * 0.225).lineTo(width * 0.95, height * 0.225).closePath().strokePath();



            let playPoints = this.add.text(width * 0.05, height * 0.245, 'Play Points', style).setDepth(10);
            let playPointsValue = this.add.text(width * 0.95, height * 0.245, foundSaleReport.playpoints + ' PTs', style).setDepth(10).setOrigin(1, 0);

            let cancelPoints = this.add.text(width * 0.05, height * 0.275, 'Cancel Pts', style).setDepth(10);
            let cancelPointsValue = this.add.text(width * 0.95, height * 0.275, foundSaleReport.calcelpoints + ' PTs', style).setDepth(10).setOrigin(1, 0);

            let lineThree = this.add.graphics().setDepth(10).lineStyle(10, 0xffae00).beginPath().moveTo(width * 0.05, height * 0.305).lineTo(width * 0.95, height * 0.305).closePath().strokePath();


            let netPlayPoints = this.add.text(width * 0.05, height * 0.325, 'Net Play Pts', style).setDepth(10);
            let netPlayPointsValue = this.add.text(width * 0.95, height * 0.325, foundSaleReport.netplaypoints + ' PTs', style).setDepth(10).setOrigin(1, 0);

            let claimPoints = this.add.text(width * 0.05, height * 0.355, 'Claim Points', style).setDepth(10);
            let claimPointsValue = this.add.text(width * 0.95, height * 0.355, foundSaleReport.claimpoints + ' PTs', style).setDepth(10).setOrigin(1, 0);

            let lineFour = this.add.graphics().setDepth(10).lineStyle(10, 0xffae00).beginPath().moveTo(width * 0.05, height * 0.385).lineTo(width * 0.95, height * 0.385).closePath().strokePath();

            let grossPoints = this.add.text(width * 0.05, height * 0.415, 'Gross Points', style).setDepth(10);
            let grossPointsValue = this.add.text(width * 0.95, height * 0.415, foundSaleReport.grosspoints + 'PTs', style).setDepth(10).setOrigin(1, 0);

            let lineFive = this.add.graphics().setDepth(10).lineStyle(10, 0xffae00).beginPath().moveTo(width * 0.05, height * 0.445).lineTo(width * 0.95, height * 0.445).closePath().strokePath();

            let discountPoints = this.add.text(width * 0.05, height * 0.475, 'Retailer Pts', style).setDepth(10);
            let discountPointsValue = this.add.text(width * 0.95, height * 0.475, foundSaleReport.Commission + ' PTs', style).setDepth(10).setOrigin(1, 0);

            let lineSix = this.add.graphics().setDepth(10).lineStyle(10, 0xffae00).beginPath().moveTo(width * 0.05, height * 0.505).lineTo(width * 0.95, height * 0.505).closePath().strokePath();

            let netPayPoints = this.add.text(width * 0.05, height * 0.535, 'Net Pay Pts', style).setDepth(10);
            let netPayPointsValue = this.add.text(width * 0.95, height * 0.535, foundSaleReport.NetToPay + ' PTs', style).setDepth(10).setOrigin(1, 0);
            let lineSeven = this.add.graphics().setDepth(10).lineStyle(10, 0xffae00).beginPath().moveTo(width * 0.05, height * 0.565).lineTo(width * 0.95, height * 0.565).closePath().strokePath();

            this.reportScreenElement.add([GameName, UserId, fromDate, toDate, lineOne, currentDate, currentTime, lineTwo, playPoints, playPointsValue, cancelPoints, cancelPointsValue, lineThree, netPlayPoints, netPlayPointsValue, claimPoints, claimPointsValue, lineFour, grossPoints, grossPointsValue, lineFive, discountPoints, discountPointsValue, lineSix, netPayPoints, netPayPointsValue, lineSeven]);

        }
    }

    ToggleWhatsapp() {
        this.whatsappOn = !this.whatsappOn;
        this.whatsappCheck.setVisible(this.whatsappOn);
        if (this.printOn) {
            this.printOn = !this.printOn;
            this.printCheck.setVisible(this.printOn);
        }
    }

    TogglePrint() {
        this.printOn = !this.printOn;
        this.printCheck.setVisible(this.printOn);
        if (this.whatsappOn) {
            this.whatsappOn = !this.whatsappOn;
            this.whatsappCheck.setVisible(this.whatsappOn);
        }
    }
}