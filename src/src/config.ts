import 'phaser';
import BootScene from './scenes/BootScene';
import GameScene from './scenes/GameScene';
import PreloaderScene from './scenes/PreloaderScene';
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin';
import Mobile from 'is-mobile';
import { ResizeManager } from './util/util';


export var globalParams = {
    calculatedWidth: 1080,
    calculatedHeight: 1920
}


/**
 * GAME CONFIG
 */
export var config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	backgroundColor: 0x000000,
    parent: 'game',
    dom:{
        createContainer: true,
    },
	scale: {
        width: globalParams.calculatedWidth,
        height: globalParams.calculatedHeight,
        mode: Phaser.Scale.FIT,
        fullscreenTarget: 'game'
    },
	scene: [
		BootScene,
		PreloaderScene,
        GameScene
	],
    audio: {
        disableWebAudio: true
    }
};

export const SCENES = {
    BOOTSCENE: 'BootScene',
	PRELOADERSCENE: 'PreloaderScene',
    GAMESCENE: 'GameScene'
}

export const WheelOption= {
    wheelSlice : 10,
    wheelNo : [0,1,2,3,4,5,6,7,8,9],
    bonusNo : ['X', '2X', 'X', '3X', 'X', '4X', 'X', '5X', 'X', '2X'],
    bigWheelRotationTime: 4000,
    smallWheelRotationTime: 6000,
    bonusWheelRotationTime: 8000
}

export const isMobile = Mobile();