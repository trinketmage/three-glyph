import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { Glyph, GlyphGeometry, GlyphMaterial } from '../../src/index.js'

import { Pane } from 'tweakpane';

class App {
  glyph = null;
  PARAMS = {
    text: 'LOVERS',
    // text: 'LOVERS\nPOTION\nWITCH',
    color: 0xece9e3,

    anchor: {
      x: 0.5,
      y: 0.5
    },
    align: 'left',
    // width: null,
    letterSpacing: 0,
    opacity: 1,
    lineHeight: 1,

    progress: 0.5,
    duration: 1,
    stagger: 0.1,
  };
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer({ antialias: false, depth: false });
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 3000);
  controls = new OrbitControls(this.camera, this.renderer.domElement);
  pane = new Pane();
  manager = new THREE.LoadingManager();
  fontLoader = new FontLoader(this.manager);
  textureLoader = new THREE.TextureLoader(this.manager);
  
  constructor() {
    this.fontLoader.load(
      'https://raw.githubusercontent.com/trinketmage/three-glyph/main/examples/simple/Love.json',
      ( raw ) => {
        this.font = raw.data;
      },
    );

    this.texture = this.textureLoader.load( "https://raw.githubusercontent.com/trinketmage/three-glyph/main/examples/simple/public/Love.png");
    
    this.manager.onLoad = () => {
      this.init();
      this.setComponents();
    };
  }
  
  init() {
    this.camera.position.z = 500;

    this.renderer.setAnimationLoop(this.animate.bind(this));
    this.handleResize()
    window.addEventListener('resize', this.handleResize.bind(this), false);
    document.body.appendChild(this.renderer.domElement);
    
  }
  
  setComponents() {
    const { PARAMS, texture, font, scene } = this;

    const glyph = new Glyph({
      text: PARAMS.text,
      font,
      map: texture,
      color: new THREE.Color(PARAMS.color),
      addons: {
        progress: true,
        shaderChunks: {
          'position_pars_vertex': `
            // https://github.com/glslify/glsl-easings/
            float quadraticOut(float t) {
              return -t * (t - 2.0);
            }
            float cubicOut(float t) {
              float f = t - 1.0;
              return f * f * f + 1.0;
            }
          `,
          'transformed_vertex': `
            transformed.x += 260.0 * 0.5 * (1.0 - quadraticOut(vProgress));
            transformed.z -= 260.0 * 0.5 * (1.0 - cubicOut(vProgress));
          `,
          'color_fragment':  `
            diffuseColor = vec3(
              color.x,
              color.y * vProgress,
              color.z * vProgress
            );
          `,
          'alpha_fragment':  `alpha *= vProgress * opacity;`,
        }
      }
    });

    glyph.mesh.frustumCulled = false;

    glyph.center();
    scene.add(glyph);
    
    this.glyph = glyph;
    this.setDebug()
  }

  handleResize() {
    const { camera, renderer } = this;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
  
  setDebug() {
    const { pane, PARAMS, glyph } = this;
    pane
      .addBinding(PARAMS, 'text')
      .on('change', () => {
        glyph.update({ text: PARAMS.text })
      });

    const basic = pane.addFolder({
      title: 'Basic',
      expanded: true
    });
    
    basic
      .addBinding(
        PARAMS,
        'color',
        {
          label: 'color',
          view: 'color'
        }
      )
      .on('change', () => {
        glyph.material.uniforms.color.value = new THREE.Color(PARAMS.color)
      });

    basic
      .addBinding(
        PARAMS,
        'opacity',
        {
          step: 0.01,
          min: 0,
          max: 1,
        }
      )
      .on('change', () => {
        glyph.material.uniforms.opacity.value = PARAMS.opacity
      });

    basic
      .addBinding(
        PARAMS,
        'letterSpacing',
        {
          step: 1
        }
      )
      .on('change', () => {
        glyph.update({ letterSpacing: PARAMS.letterSpacing })
      });

    if (PARAMS.lineHeight) {
      basic
        .addBinding(
          PARAMS,
          'lineHeight',
          {
            step: 1
          }
        )
        .on('change', () => {
          glyph.update({ lineHeight: PARAMS.lineHeight })
        });
    }
    // pane
    //   .addBinding(PARAMS, 'align', {
    //     label: 'textAlign',
    //     options: {
    //       left: 'left',
    //       center: 'center',
    //       right: 'right'
    //     },
    //   })
    //   .on('change', () => {
    //     glyph.update({ align: PARAMS.align })
    //   });
    basic
      .addBinding(PARAMS, 'anchor', {
        x: { step: 0.01, min: 0, max: 1 },
        y: { step: 0.01, min: 0, max: 1, inverted: true },
      })
      .on('change', () => {
        const { x, y } = PARAMS.anchor
        glyph.anchor.set(x, y)
        glyph.update();
      });
    const folder = basic.addFolder({
      title: "Glyph presets",
      expanded: false
    });
    ['center', 'alignTop', 'alignRight', 'alignBottom', 'alignLeft'].forEach((property) => {
      folder
        .addButton({
          title: property
        })
        .on('click', () => {
          glyph[property]()
          PARAMS.anchor.x = glyph.anchor.x;
          PARAMS.anchor.y = glyph.anchor.y;
          pane.refresh();
        });
    });

    const progress = pane.addFolder({
      title: 'Progress',
      expanded: false
    });

    progress
      .addBinding(
        PARAMS,
        'duration',
        {
          step: 0.01,
          min: 0.1,
        }
      )
      .on('change', () => {
        glyph.material.uniforms.duration.value = PARAMS.duration
      });
    progress
      .addBinding(
        PARAMS,
        'stagger',
        {
          step: 0.01,
          min: 0,
        }
      )
      .on('change', () => {
        glyph.material.uniforms.stagger.value = PARAMS.stagger
      });

    glyph.material.uniforms.progress.value = PARAMS.progress;
    progress
      .addBinding(
        PARAMS,
        'progress',
        {
          step: 0.01,
          min: 0,
          max: 1,
        }
      )
      .on('change', () => {
        glyph.material.uniforms.progress.value = PARAMS.progress
      });
  }
}

new App();
