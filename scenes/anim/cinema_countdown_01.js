//https://labs.phaser.io/3.55/edit.html?src=src/display\shaders\shader%20test%205.js


class CinemaCountdown extends Phaser.Scene {
 
 frag1 = `
    #ifdef GL_ES
    precision mediump float;
    #endif

    uniform float time;
    uniform vec2 resolution;

    void main( void ) {
        vec2 pos1=gl_FragCoord.xy/resolution.x-vec2(0.50,resolution.y/resolution.x/2.0);
        float l1=length(pos1);
        float l2=step(0.5,fract(1.0/l1+time/1.8));
        float a=step(0.5,fract(0.1*sin(20.*l1+time*1.)/l1+atan(pos1.x,pos1.y)*3.));
        if(a!=l2 && l1>0.05){
            gl_FragColor=vec4(1.0,1.0,1.0,1.0);
        }
    }
    `;

frag2=`
 precision mediump float;

  uniform sampler2D uMainTexture;
  uniform float uRadius;
  uniform vec2 resolution;
  
  varying vec2 outTexCoord;
  void main() {
      vec2 center = vec2(0.5);
      float aspectRatio = resolution.x / resolution.y;
      vec2 aspectCorrectedCoord = vec2(outTexCoord.x, outTexCoord.y / aspectRatio);
      float distance = distance(aspectCorrectedCoord, center);
      
      vec4 texColor = texture2D(uMainTexture, outTexCoord);
      
      float alpha = 1.0 - step(uRadius, distance);
      gl_FragColor = vec4(texColor.rgb, texColor.a * alpha);
  }
`

vert3 = `
    precision mediump float;

    attribute vec2 aVertexPosition;
    attribute vec2 aTextureCoord;

    uniform mat3 uProjectionMatrix;

    varying vec2 outTexCoord;

    void main() {
        gl_Position = vec4((uProjectionMatrix * vec3(aVertexPosition, 1)).xy, 0.0, 1.0);
        outTexCoord = aTextureCoord;
    }
`
frag3 = `
    precision mediump float;

    uniform sampler2D uTexture; // textury
    uniform float uProgress;    // 0.0 až 1.0, kolik odhalit (0=krátce, 1=celé odhalené)
    varying vec2 outTexCoord;

    void main() {
        // Střed textury (0.5, 0.5)
        vec2 center = vec2(0.5, 0.5);
        // Vzdálenost od středu
        float dist = distance(outTexCoord, center);
        // Maximální poloměr (kolem textury), od 0 do 0.5
        float radius = 0.5;
        // Výsledek masky: od 0 do 1 podle vzdálenosti a progressu
        float mask = smoothstep(uProgress * radius, (uProgress + 0.05) * radius, dist);

        vec4 color = texture2D(uTexture, outTexCoord);
        // Výstupní barva s maskou, kde části mimo kruh jsou průhledné
        gl_FragColor = vec4(color.rgb, color.a * (1.0 - mask));
    }
`

preload(){
    this.load.setBaseURL('https://raw.githubusercontent.com/MerlinEl/Phaser-3-Lab-Examples/main/assets');
    this.load.image('myImage',  "/images/timer_bg_01.png");
      this.load.image('checker', '/textures/checker.png');
    this.load.glsl('radialReveal',  '/shaders/cinema_countdown_01.glsl.js'); // Load shader
    this.load.glsl('torus', '/shaders/torus_progress.glsl.js');
    this.load.glsl('wave', '/shaders/shader1.frag.js');
}
simpleMaskTest(){
    this.circle = this.add.image(400, 300, 'myImage');
    var g = this.make.graphics({ add: false });  
    g.fillStyle(0xFF00FF, 1);
    g.fillCircle(0,0,100)
    this.circle.setMask(g.createGeometryMask());
    this.input.on('pointermove', function (pointer) {
        g.x = pointer.x;
        g.y = pointer.y;
    });
}

shaderMaskTest(){
    const customPipeline = this.renderer.pipelines.add("cinemaCountdown", new CinemaCountdown(this));
    console.log("customPipeline",customPipeline);

    // const circle = this.add.image(400, 300, 'myImage');
    // circle.setPipeline(customPipeline);
    // customPipeline.size = {width:this.sys.game.config.width, height:this.sys.game.config.height}; 
    // customPipeline.radius = 1;
}
shaderMaskTest2(){


    // 1. Shader code
    // const shader = this.cache.shader.get('radialReveal');
    var shader = this.make.shader({
        key: 'radialReveal',
        x: 400,
        y: 300,
        width: 800,
        height: 600,
        add: false
    });
    console.log("shader",shader)


    const image = this.add.image(400, 300, 'myImage');



    //  Make a Bitmap Mask from it
    var mask = shader.createBitmapMask();

    //  Apply the mask to this image
    image.setMask(mask);

    this.input.on('pointerdown', function (pointer) {
        console.log("pointerdown > image", image, "pipeline:",  image.pipeline);
        this.tweens.add({
            targets:  image.pipeline,
            props: {
                uRadius: 1,
            },
            duration: 3000,
        })
    }, this);


return;
    // // 2. Create a Phaser.GameObjects.Shader
    // const pipeline = new Phaser.Renderer.WebGL.Pipelines.SinglePipeline({
    //     game: this.game,
    //     fragSource:shader
    // });
    // // this.renderer.addPipeline('Custom', pipeline);
    // this.game.renderer.pipelines.add('Custom', pipeline);

    // console.log("pipeline",pipeline);

    // const image = this.add.image(400, 300, 'myImage');
    // image.setPipeline('Custom');
    // image.setPipelineData('uRadius', 0.5);
    // image.setPipelineData('uResolution', [image.width,image.height]);

    // // 4. Set Animation
    // this.input.on('pointerdown', function (pointer) {
    //     console.log("pointerdown > image", image, "pipeline:",  image.pipeline);
    //     this.tweens.add({
    //         targets:  image.pipeline,
    //         props: {
    //             pipelineData: {
    //                     uRadius: 0,
    //             }
    //         },
    //         duration: 3000,
    //     })
    // }, this);
}


shaderMaskTest3(){
    
    var circle = this.add.image(400, 300, 'myImage').setOrigin(0.5, 1);
    
    var shader = this.add.shader('marble', 400, 300, 800, 600);
    console.log("shader", shader);
        
    this.input.once('pointerdown', function () {

        this.tweens.add({
            targets: shader,
            props: {
                scaleX: { value: 0.2, duration: 4000 },
                scaleY: { value: 0.2, duration: 4000 },
                angle: { value: 360, duration: 2000 },
                y: { value: 100, duration: 1000 }
            },
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });

    }, this);
}
shaderMaskTest4(){
    
        //const base = new Phaser.Display.BaseShader('simpleTexture', this.frag2);
        //const shader = this.add.shader(base, 400, 300, 800, 600, [ 'checker' ]);
        //  Or, set the texture like this:
        // shader.setChannel0('checker');
        //const shader = this.add.shader(base , 400, 300, 326, 326, [ 'myImage' ]);

    const base = new Phaser.Display.BaseShader('simpleTexture', this.frag3);
    const shader = this.add.shader(base , 400, 300, 800, 600);
    
    console.log("shader",shader)

    //shader.setUniform('uProgress', 0.5);
    shader.uniforms.uProgress = 0.1;
    //shader.set1f('uProgress', 0.1);

        //  Make a Bitmap Mask from it
    var mask = shader.createBitmapMask();

    //  Apply the mask to this image
    this.add.image(400, 300, 'myImage').setMask(mask);

    this.tweens.add({
    targets: shader.uniforms,
    uProgress: 1.0 , // nebo určitá jiná hodnota postupně
    duration: 2000,
    ease: 'Linear',
    onUpdate: () => {
            // Pokud je potřeba, můžeš kontrolovat aktuální hodnotu
        }
    });


// shader.shader.uniforms = {'uRadius': 0.2}
//shader.uniforms.uRadius= 0.2

    /*var shader = this.make.shader({
        key: 'radialReveal',
        x: 400,
        y: 300,
        width: 800,
        height: 600,
        add: false
    });

    //  Make a Bitmap Mask from it
    var mask = shader.createBitmapMask();

    //  Apply the mask to this image
    this.add.image(400, 300, 'myImage').setMask(mask);

    this.tweens.add({
        targets: shader,
        props: {
            uRadius: { value: 0.2, duration: 4000 },
        },
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1
    });*/
}
shaderMaskTest5(){
        const image = this.add.image(400, 300, 'myImage');

        // 1. Shader code
        const shader = this.cache.shader.get('radialReveal');

        // 2. Create a Phaser.GameObjects.Shader
        const customPipeline = new Phaser.Renderer.WebGL.Pipelines.SinglePipeline({
                game: this.game,
                fragSource: shader,
                uniforms: {
                    uRadius: { value: 0.3 },
                }
            });
            
        this.game.renderer.pipelines.add('Custom', customPipeline);

        image.setPipeline('Custom');

        console.log("image pipeline:", image.pipeline);

        //Setting value uRadius
        //image.pipeline.set1f('uRadius',0.5);

        // 4. Set Animation
        /*this.input.on('pointerdown', function (pointer) {
            this.tweens.add({
                targets:   image.pipeline,
                props: {
                 uRadius: 1
                },
                duration: 3000,
                onUpdate: function () {
                    //When is Tween Updatet Set Values!
                  image.pipeline.set1f('uRadius',this.target.uRadius);
                }
            })
        }, this);*/

        this.circle = image;
    }
shaderMaskTest6(){
      //https://www.shadertoy.com/view/XsfGzd
    let fragShaderAlpha = `
        #ifdef GL_FRAGMENT_PRECISION_HIGH
        precision highp float;
        #else
        precision mediump float;
        #endif
        
        uniform sampler2D uMainTexture;
        uniform float uRadius;
        uniform vec2 uResolution;
        
        varying vec2 outTexCoord;
        
        void main() {
            vec2 center = vec2(0.5);
            float aspectRatio = uResolution.x / uResolution.y;
            vec2 aspectCorrectedCoord = vec2(outTexCoord.x, outTexCoord.y / aspectRatio);
            float distance = distance(aspectCorrectedCoord, center);
            
            vec4 texColor = texture2D(uMainTexture, outTexCoord);
            
            float alpha = 1.0 - step(uRadius, distance);
            gl_FragColor = vec4(texColor.rgb, texColor.a * alpha);
        }
        `
    // 2. Create a Phaser.GameObjects.Shader
    const base = new Phaser.Display.BaseShader('bufferShader', this.frag2);
    const shader = this.add.shader(base, 400, 300, 800, 600, [ 'myImage' ]);
 //shader.setUniform("uResolution", 800, 600);
  shader.setUniform("uRadius", 0.2);
     console.log("shader:",shader)

    this.input.on('pointerdown', function (pointer) {
            this.tweens.add({
                targets:   shader,
                props: {
                   radius: 1
                },
                duration: 3000,
            })
        }, this);
      
       

     // 3.  Update
         this.input.on('pointermove', function (pointer) {

            //image.setPostPipeline(customPipeline);
        });
}
shaderMaskTest7(){

        /* OK
        var shader = this.make.shader({
            key: 'wave',
            x: 400,
            y: 300,
            width: 800,
            height: 600,
            add: false
        });

        //  Make a Bitmap Mask from it
        var mask = shader.createBitmapMask();

        //  Apply the mask to this image
        this.add.image(400, 300, 'myImage').setMask(mask);*/
        
        const base = new Phaser.Display.BaseShader('wave', this.frag1);
        const shader = this.make.shader(base, 400, 300, 800, 600);


        //, null, {uniforms:{ "type": "1f", "value": 0.2 }}
         //var mask = shader.createBitmapMask();
        
        //const shader = this.add.shader('radialReveal', 400, 300, 800, 600);
        //const shader =  this.cache.shader.get('radialReveal');
            // .setVisible(false);
        //shader.setUniform('uRadius', 0.2);

        //const mask = shader.createBitmapMask();
        //const pic = this.add.image(400, 300, 'myImage').setMask(mask);

        // this.tweens.add({
        //     targets: shader.uniforms.uRadius,
        //     value: 1,
        //     duration: 2000,
        //     ease: 'Sine.easeInOut',
        //     yoyo: true,
        //     repeat: -1
        // });
}
shaderMaskTest8(){

    const shader = this.cache.shader.get('torus');
    const customPipeline = new Phaser.Renderer.WebGL.Pipelines.SinglePipeline({
        game: this.game,
        fragSource:shader,
        uniforms: {
            uFrac: { value: 0.5 },
            uAlphaTex: { value: this.textures.get('myImage').getSourceImage() }, // nebo správný odkaz
            uFillColor: { value: new Float32Array([1, 1, 1, 1]) },
            uBackColor: { value: new Float32Array([0, 0, 0, 1]) },
            uNoAntiAliasing: { value: false }
        }
    });
    
    customPipeline.setUniform('uFrac', 0.5);
    customPipeline.setUniform('uFillColor', { x: 1, y: 1, z: 1, w: 1 });
    customPipeline.setUniform('uBackColor', { x: 0, y: 0, z: 0, w: 1 })
    customPipeline.setUniform('uNoAntiAliasing', true);

    this.game.renderer.pipelines.add('Custom', customPipeline);

    const circle = this.add.image(400, 300, 'myImage');
    circle.setPipeline('Custom');
}
create() {

    // this.tweens.add({
    //     targets: customPipeline,
    //     radius:1,
    //     duration: 3000
    // })

    // Works ok
    // this.simpleMaskTest();
    // return;

    // nope
    // this.shaderMaskTest();

    this.shaderMaskTest4();
    return;
  // 1. Shader code
        const shader = this.cache.shader.get('radialReveal');

        // 2. Create a Phaser.GameObjects.Shader
         const customPipeline = new Phaser.Renderer.WebGL.Pipelines.SinglePipeline({
            game: this.game,
            fragSource:shader
        });
    
        console.log("customPipeline",customPipeline)

        this.game.renderer.pipelines.add('Custom', customPipeline);

        this.circle = this.add.image(400, 300, 'myImage');
  console.log("circle",this.circle)

        this.circle.setPipeline('Custom');

        console.log("circle.pipeline",this.circle.pipeline) //currentShader.uniforms

       this.circle.pipeline.set2f('uResolution', this.sys.game.config.width, this.sys.game.config.height);
       this.circle.pipeline.set1f('uRadius', 0.1);

        // 4. Set Animation
        this.input.on('pointerdown', function (pointer) {
            console.log("circle.pipeline",this.circle.pipeline, "uRadius:",  this.circle.pipeline.uRadius);
            /*this.tweens.add({
                targets: this.circle.pipeline,
                props: {
                    uRadius: 1
                },
                duration: 3000
            })*/
        }, this);
    }
    update(time, delta) {
      // this.circle.setPipelineData('uTime', time)
   }
}


const config = {
    width: 800,
    height: 600,
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    scene: CinemaCountdown,
    backgroundColor: '#3498db'
};

const game = new Phaser.Game(config);
