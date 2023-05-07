import 'phaser';


export default class NumberChips extends Phaser.GameObjects.Image
{

    private numberText : Phaser.GameObjects.Text;

    constructor(scene : Phaser.Scene, x : number, y : number, texture: string | Phaser.Textures.Texture, frame? : string | number, numberText? : string)
    {
        super(scene, x, y, texture , frame);
        this.scale = 0.5;
        this.numberText = scene.add.text(x, y, numberText,  { fontFamily: 'Arial', fontSize: '26px', fontStyle: 'Bold'}).setOrigin(0.5).setDepth(1);
        this.numberText.setColor('#000');
    }

    SetNumberText(numberText : string)
    {
        this.numberText.setText(numberText);
    }

    destroy()
    {
        if(this.numberText != null)
            this.numberText.destroy();
    }
}
