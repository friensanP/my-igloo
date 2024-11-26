import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

// Igloo brick texture
const brickTexture = textureLoader.load('/textures/bricks/diamondWhite.jpg') // Replace with the correct path to your texture
brickTexture.wrapS = THREE.RepeatWrapping
brickTexture.wrapT = THREE.RepeatWrapping
brickTexture.repeat.set(4, 4)

// Floor texture
const floorTexture = textureLoader.load('/textures/grass/snow2.jpg') // Replace with the correct path to your texture
floorTexture.wrapS = THREE.RepeatWrapping
floorTexture.wrapT = THREE.RepeatWrapping
floorTexture.repeat.set(10, 10)

/**
 * House (Igloo)
 */
// Dome (Main body of the igloo)
const dome = new THREE.Mesh(
    new THREE.SphereGeometry(1.5, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2), // Half-sphere
    new THREE.MeshStandardMaterial({ map: brickTexture, roughness: 0.7 })
)
dome.castShadow = true; // Cast shadow
dome.position.y = 0
scene.add(dome)

// Entrance (Tunnel-like structure)
const entrance = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.5, 1, 32),
    new THREE.MeshStandardMaterial({ map: brickTexture, roughness: 0.7 })
)
entrance.castShadow = true; // Cast shadow
entrance.rotation.z = Math.PI / 2
entrance.position.set(1.5, 0, 0)
scene.add(entrance)

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ map: floorTexture, roughness: 0.8 })
)
floor.rotation.x = -Math.PI * 0.5
floor.receiveShadow = true; // Receive shadow
floor.position.y = 0
scene.add(floor)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#dfefff', 0.5) // Cool, snowy light
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light (moonlight)
const moonLight = new THREE.DirectionalLight('#dfefff', 0.8)
moonLight.castShadow = true; // Cast shadow
moonLight.position.set(4, 5, -2)
moonLight.shadow.bias = -0.005;  // Adjust to reduce shadow artifacts
moonLight.shadow.mapSize.width = 2048;  // Higher resolution for shadows
moonLight.shadow.mapSize.height = 2048; // Higher resolution for shadows
moonLight.shadow.camera.near = 0.5;
moonLight.shadow.camera.far = 6;
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(-5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(-5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(-5).max(5).step(0.001)
scene.add(moonLight)


/**
 * Snow Container (group to hold all snow particles)
 */
const snowContainer = new THREE.Group();
scene.add(snowContainer);

// Snow Parameters
const snowGeometry = new THREE.SphereGeometry(0.15, 8, 8); // Larger spheres for snowflakes
const snowMaterial = new THREE.MeshStandardMaterial({
    color: '#FFFFFF', // White snowflakes
    roughness: 0.9, // Snowflakes are rough and matte
    metalness: 0.1, // Snowflakes are not metallic, slightly reflective
    emissive: new THREE.Color(0.9, 0.9, 0.9), // Slightly glowing to mimic light reflection
});

// Number of snowflakes to generate
const numberOfSnowflakes = 200; // Increased number of snowflakes for a fuller effect

// Generate snowflakes around the house
for (let i = 0; i < numberOfSnowflakes; i++) {
    // Generate random angle between 0 and 2π (full revolution)
    const angle = Math.random() * Math.PI * 2;

    // Generate random radius (distance from the center of the igloo)
    const radius = Math.random() * 2.5 + 1.5; // Random radius between 1.5 and 4.0

    // Position the snowflake using sin and cos for random placement around the circle
    const x = Math.cos(angle) * radius; // x = cos(angle) * radius
    const z = Math.sin(angle) * radius; // z = sin(angle) * radius

    // Create the snowflake mesh
    const snowflake = new THREE.Mesh(snowGeometry, snowMaterial);

    // Randomize the size of each snowflake for a more realistic look
    const randomSize = Math.random() * 0.25 + 0.15; // Random size between 0.15 and 0.4
    snowflake.scale.set(randomSize, randomSize, randomSize); // Scale the snowflake

    // Set the snowflake's position slightly above the ground
    snowflake.position.set(x, 0.1, z);

    // Add snowflake to the container
    snowContainer.add(snowflake);
}

/**
 * Pine Trees
 */
const createPineTree = (x, z) => {
    // Tree trunk
    const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 0.5, 16),
        new THREE.MeshStandardMaterial({ color: '#8B5A2B' }) // Brown color for trunk
    );
    trunk.castShadow = true; // Cast shadow
    trunk.position.set(x, 0.25, z);

    // Tree foliage (3 cones stacked)
    const foliage1 = new THREE.Mesh(
        new THREE.ConeGeometry(0.5, 1, 16),
        new THREE.MeshStandardMaterial({ color: '#2E8B57' }) // Green color for foliage
    );
    foliage1.castShadow = true; // Cast shadow
    foliage1.position.set(x, 0.75, z);

    const foliage2 = new THREE.Mesh(
        new THREE.ConeGeometry(0.4, 0.8, 16),
        new THREE.MeshStandardMaterial({ color: '#2E8B57' })
    );
    foliage2.castShadow = true; // Cast shadow
    foliage2.position.set(x, 1.25, z);

    const foliage3 = new THREE.Mesh(
        new THREE.ConeGeometry(0.3, 0.6, 16),
        new THREE.MeshStandardMaterial({ color: '#2E8B57' })
    );
    foliage3.castShadow = true; // Cast shadow
    foliage3.position.set(x, 1.55, z);

    // Add all parts to the scene
    scene.add(trunk, foliage1, foliage2, foliage3);
}

createPineTree(-4, -6); 
createPineTree(-2, -6);  
createPineTree(0, -6);   
createPineTree(2, -6);  
createPineTree(4, -6);   

// Add Fog to the scene
const fogColor = new THREE.Color(0xffffff); // White fog, typical for snowy scenes
const near = 1;  // Fog starts close to the camera
const far = 10;  // Fog becomes fully opaque further from the camera
scene.fog = new THREE.Fog(fogColor, near, far);

// Optional: You can adjust the scene background to blend better with the fog
scene.background = new THREE.Color(0x9ec3d0); // Light blue background to match winter tones

/**
 * Lights
 */
const light1 = new THREE.PointLight('#ff00ff', 2, 3);
light1.castShadow = true; // Cast shadow
scene.add(light1);

const light2 = new THREE.PointLight('#00ffff', 2, 3);
light2.castShadow = true; // Cast shadow
scene.add(light2);

const light3 = new THREE.PointLight('#ffff00', 2, 3);
light3.castShadow = true; // Cast shadow
scene.add(light3);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 3, 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.dampingFactor = 0.25
controls.screenSpacePanning = false
controls.maxPolarAngle = Math.PI / 2

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true // Enable shadow map
renderer.shadowMap.type = THREE.PCFSoftShadowMap // Softer shadows

/**
 * Animate
 */
const clock = new THREE.Clock();
const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Light 1 animation (moves in a circular path and bobs up and down)
    const light1Angle = elapsedTime * 0.5;
    light1.position.x = Math.cos(light1Angle) * 4;
    light1.position.z = Math.sin(light1Angle) * 4;
    light1.position.y = Math.sin(elapsedTime * 3); // Vertical movement

    // Light 2 animation (moves in a circular path with slower speed and bobbing)
    const light2Angle = -elapsedTime * 0.32;
    light2.position.x = Math.cos(light2Angle) * 5;
    light2.position.z = Math.sin(light2Angle) * 5;
    light2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5); // Complex vertical movement

    // Light 3 animation (moves in a larger circular path and bobbing)
    const light3Angle = -elapsedTime * 0.18;
    light3.position.x = Math.cos(light3Angle) * (7 + Math.sin(elapsedTime * 0.32)); // Vary radius
    light3.position.z = Math.sin(light3Angle) * (7 + Math.sin(elapsedTime * 0.5)); // Vary radius
    light3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5); // Vertical movement

    // Render the scene
    renderer.render(scene, camera);

    // Call the next frame
    window.requestAnimationFrame(tick);
};

tick()