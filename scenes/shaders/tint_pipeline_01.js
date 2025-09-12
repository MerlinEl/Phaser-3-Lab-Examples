class TintImageShader extends Phaser.Scene {

    preload() {
        this.load.setBaseURL("https://raw.githubusercontent.com/MerlinEl/Phaser-3-Lab-Examples/main/assets");
        this.load.script("tint_pp_01", "/pipelines/TintPipeline.js");
        this.load.image("timer_bg_01", "/images/timer_bg_01.png");
    }

    create() {
        // create new pipeline from script class
        var pipeline = new TintPipeline(this);
        if (!pipeline) return false;
        // add pipeline into collection
        this.renderer.pipelines.add("TintPipeline", pipeline);

        // get pipeline by name
        const pp = this.renderer.pipelines.get("TintPipeline");
        console.log("TintPipeline:", TintPipeline)
        console.log("pipeline:",pp)

        // add image 
        const img = this.add.image(400, 300, "timer_bg_01");
        // apply pipeline on image
        img.setPipeline(pp);
        // change pipeline parameters
        img.pipelineData = {color: 0xff0000, power: 0.5};
    }

    update(time, delta) {}
}


const config = {
    width: 800,
    height: 600,
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    scene: TintImageShader,
    backgroundColor: '#3498db'
};

const game = new Phaser.Game(config);


/*
* Phaser Scene Template
class TintImageShader extends Phaser.Scene {
    preload(){}
    create(){}
    update(time, delta) {}
}

const config = {
    width: 800,
    height: 600,
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    scene: TintImageShader,
    backgroundColor: '#3498db'
};

const game = new Phaser.Game(config);
*/
