
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GlyphGeometry, GlyphShader } from '../../src/index.js'
import font from './Love.json'

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10000);
camera.position.z = 500;

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({ antialias: true });

const controls = new OrbitControls(camera, renderer.domElement);

renderer.setAnimationLoop(animate);
handleResize()
window.addEventListener('resize', handleResize, false);
document.body.appendChild(renderer.domElement);

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load( "/Love.png" );
const uni = new THREE.Uniform(texture);

GlyphShader.uniforms.map = uni;
const material = new THREE.RawShaderMaterial(GlyphShader);
const geometry = new GlyphGeometry({
  text: 'LOVE',
  font,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
// mesh.geometry.computeBoundingBox();
mesh.position.x = -geometry.layout.width / 2;
mesh.position.y = -geometry.layout.height / 2 + 10;
mesh.rotation.x = Math.PI

function handleResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
function animate() {
  controls.update();
  render();
}

function render() {
  renderer.render(scene, camera);
}