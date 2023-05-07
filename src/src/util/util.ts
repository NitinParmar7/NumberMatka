import { globalParams } from "../config";
import { game } from "../main";


type point = {x:number; y:number};

export class ResizeManager {
    public static offsetX: boolean = true;
    public static offsetY: boolean = true;
    public static scalingRatio: number = 1;

    public static readonly referenceScreeenSize = {
        width: 1080,
        height: 1920,
    };
    public static centeringOffsets = {
        x: 0,
        y: 0,
    };
    public static resize() {
        // Get Pixel Width and Height of the available space
	var w_w = window.innerWidth * window.devicePixelRatio;
    var w_h = window.innerHeight * window.devicePixelRatio;
    var g_w = w_w;
	
    var originalAspectRatio = 1.77;
	// Get the actual device aspect ratio
    var currentAspectRatio = g_w / w_h;
    if (currentAspectRatio > originalAspectRatio) {
		// If actual aspect ratio is greater than the game aspect ratio, then we have horizontal padding 
		// In order to get the correct resolution of the asset we need to look at the height here
		if(w_h > 960){
			globalParams.calculatedHeight = 1920;
			globalParams.calculatedWidth = w_w * (1920 / w_h); 
		} else {
			globalParams.calculatedHeight = 960;
			globalParams.calculatedWidth = w_w * (960 / w_h); 
		}
    } else {
		// If actual aspect ratio is less than the game aspect ratio, then we have vertical padding 
		// In order to get the correct resolution of the asset we need to look at the width here
		if(w_w > 720){
			globalParams.calculatedWidth = 1080;
			globalParams.calculatedHeight = w_h * (1080 / w_w);			
		} else {
			globalParams.calculatedWidth = 720;
			globalParams.calculatedHeight = w_h * (720 / w_w);			
		}
    }
    }

    
	public static getX(value): number {
		var newX = value * this.scalingRatio;
		if (ResizeManager.offsetX) newX += ResizeManager.centeringOffsets.x;

		return newX;
	}

	public static getY(value): number {
		var newY = value * this.scalingRatio;
		if (ResizeManager.offsetY) newY += ResizeManager.centeringOffsets.y;

		return newY;
	}

	public static getXY(value: point): point {
		return { x: this.getX(value.x), y: this.getY(value.y) };
	}

	public static getFontSize(value: number): number {
		return Math.round(value * ResizeManager.scalingRatio);
	}

	// Width and Height Functions
	public static getScaledProperty(value: number): number {
		return value * ResizeManager.scalingRatio;
	}
}
