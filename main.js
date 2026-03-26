import * as THREE from 'three';

const canvas = document.getElementById('bg-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 50;

const mouse = new THREE.Vector2(0, 0);
const target = new THREE.Vector2(0, 0);
let scrollY = 0;

// ── Particle System ──

const PARTICLE_COUNT = 3000;
const SPREAD = 60;

const positions = new Float32Array(PARTICLE_COUNT * 3);
const velocities = new Float32Array(PARTICLE_COUNT * 3);
const sizes = new Float32Array(PARTICLE_COUNT);
const colors = new Float32Array(PARTICLE_COUNT * 3);

const palette = [
  new THREE.Color(0x6c63ff),
  new THREE.Color(0x48bfe3),
  new THREE.Color(0x7209b7),
  new THREE.Color(0xf72585),
  new THREE.Color(0x4361ee),
];

for (let i = 0; i < PARTICLE_COUNT; i++) {
  const i3 = i * 3;
  positions[i3]     = (Math.random() - 0.5) * SPREAD;
  positions[i3 + 1] = (Math.random() - 0.5) * SPREAD;
  positions[i3 + 2] = (Math.random() - 0.5) * SPREAD;

  velocities[i3]     = (Math.random() - 0.5) * 0.015;
  velocities[i3 + 1] = (Math.random() - 0.5) * 0.015;
  velocities[i3 + 2] = (Math.random() - 0.5) * 0.015;

  sizes[i] = Math.random() * 4.0 + 1.0;

  const color = palette[Math.floor(Math.random() * palette.length)];
  colors[i3]     = color.r;
  colors[i3 + 1] = color.g;
  colors[i3 + 2] = color.b;
}

const particleGeometry = new THREE.BufferGeometry();
particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const particleMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uPixelRatio: { value: renderer.getPixelRatio() },
  },
  vertexShader: `
    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uPixelRatio;
    attribute float size;
    attribute vec3 color;
    varying vec3 vColor;
    varying float vAlpha;

    void main() {
      vColor = color;

      vec3 pos = position;
      pos.x += sin(uTime * 0.4 + position.y * 0.12) * 2.5;
      pos.y += cos(uTime * 0.3 + position.x * 0.12) * 2.5;
      pos.z += sin(uTime * 0.2 + position.z * 0.08) * 3.0;

      vec2 mouseOffset = uMouse * 12.0;
      float mouseDist = length(pos.xy - mouseOffset * 5.0);
      float mouseInfluence = smoothstep(40.0, 0.0, mouseDist);
      pos.xy += normalize(pos.xy - mouseOffset * 5.0 + 0.001) * mouseInfluence * 5.0;

      vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPos;
      gl_PointSize = size * uPixelRatio * (60.0 / -mvPos.z);

      float depth = smoothstep(-60.0, 10.0, mvPos.z);
      vAlpha = depth * (0.7 + mouseInfluence * 0.5);
    }
  `,
  fragmentShader: `
    varying vec3 vColor;
    varying float vAlpha;

    void main() {
      float d = length(gl_PointCoord - 0.5);
      if (d > 0.5) discard;
      float strength = 1.0 - smoothstep(0.0, 0.5, d);
      strength = pow(strength, 1.5);
      gl_FragColor = vec4(vColor, strength * vAlpha);
    }
  `,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
});

const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

// ── Connection Lines ──

const LINE_MAX = 5000;
const linePositions = new Float32Array(LINE_MAX * 6);
const lineColors = new Float32Array(LINE_MAX * 6);
const lineGeometry = new THREE.BufferGeometry();
lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));
lineGeometry.setDrawRange(0, 0);

const lineMaterial = new THREE.LineBasicMaterial({
  vertexColors: true,
  transparent: true,
  opacity: 0.35,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});

const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
scene.add(lines);

// ── Floating Icosahedrons ──

const icoGroup = new THREE.Group();
scene.add(icoGroup);

const icoColors = [0x6c63ff, 0x48bfe3, 0x7209b7, 0xf72585, 0x4361ee];

for (let i = 0; i < 8; i++) {
  const detail = Math.random() > 0.5 ? 2 : 1;
  const geo = new THREE.IcosahedronGeometry(Math.random() * 6 + 3, detail);
  const mat = new THREE.MeshBasicMaterial({
    color: icoColors[i % icoColors.length],
    wireframe: true,
    transparent: true,
    opacity: 0.15 + Math.random() * 0.1,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(
    (Math.random() - 0.5) * 70,
    (Math.random() - 0.5) * 70,
    (Math.random() - 0.5) * 30 - 5,
  );
  mesh.userData.speed = Math.random() * 0.4 + 0.15;
  mesh.userData.axis = new THREE.Vector3(
    Math.random() - 0.5,
    Math.random() - 0.5,
    Math.random() - 0.5,
  ).normalize();
  icoGroup.add(mesh);
}

// ── Central Toroidal Knot ──

const knotGeo = new THREE.TorusKnotGeometry(10, 0.4, 200, 12, 3, 5);
const knotMat = new THREE.MeshBasicMaterial({
  color: 0x6c63ff,
  wireframe: true,
  transparent: true,
  opacity: 0.12,
});
const knot = new THREE.Mesh(knotGeo, knotMat);
knot.position.set(15, 0, -15);
scene.add(knot);

// ── Orbiting Ring ──

const ringGeo = new THREE.TorusGeometry(18, 0.15, 16, 120);
const ringMat = new THREE.MeshBasicMaterial({
  color: 0x48bfe3,
  transparent: true,
  opacity: 0.2,
});
const ring = new THREE.Mesh(ringGeo, ringMat);
ring.position.set(15, 0, -15);
ring.rotation.x = Math.PI * 0.45;
scene.add(ring);

// ── Scroll Reveal ──

function initReveal() {
  const elements = document.querySelectorAll(
    '.section-grid, .project-card, .contact-content, blockquote'
  );
  elements.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}

// ── Events ──

window.addEventListener('mousemove', (e) => {
  target.x = (e.clientX / window.innerWidth) * 2 - 1;
  target.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

window.addEventListener('scroll', () => {
  scrollY = window.scrollY;
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  particleMaterial.uniforms.uPixelRatio.value = renderer.getPixelRatio();
});

// ── Connection Lines Update ──

function updateLines() {
  const posAttr = particleGeometry.attributes.position.array;
  const colAttr = particleGeometry.attributes.color.array;
  const CONNECTION_DIST = 10;
  let lineIdx = 0;

  const step = 5;
  for (let i = 0; i < PARTICLE_COUNT && lineIdx < LINE_MAX; i += step) {
    for (let j = i + step; j < PARTICLE_COUNT && lineIdx < LINE_MAX; j += step) {
      const i3 = i * 3;
      const j3 = j * 3;
      const dx = posAttr[i3] - posAttr[j3];
      const dy = posAttr[i3 + 1] - posAttr[j3 + 1];
      const dz = posAttr[i3 + 2] - posAttr[j3 + 2];
      const dist = dx * dx + dy * dy + dz * dz;

      if (dist < CONNECTION_DIST * CONNECTION_DIST) {
        const li = lineIdx * 6;
        linePositions[li]     = posAttr[i3];
        linePositions[li + 1] = posAttr[i3 + 1];
        linePositions[li + 2] = posAttr[i3 + 2];
        linePositions[li + 3] = posAttr[j3];
        linePositions[li + 4] = posAttr[j3 + 1];
        linePositions[li + 5] = posAttr[j3 + 2];

        const fade = 1.0 - Math.sqrt(dist) / CONNECTION_DIST;
        lineColors[li]     = colAttr[i3] * fade;
        lineColors[li + 1] = colAttr[i3 + 1] * fade;
        lineColors[li + 2] = colAttr[i3 + 2] * fade;
        lineColors[li + 3] = colAttr[j3] * fade;
        lineColors[li + 4] = colAttr[j3 + 1] * fade;
        lineColors[li + 5] = colAttr[j3 + 2] * fade;

        lineIdx++;
      }
    }
  }

  lineGeometry.setDrawRange(0, lineIdx * 2);
  lineGeometry.attributes.position.needsUpdate = true;
  lineGeometry.attributes.color.needsUpdate = true;
}

// ── Animate ──

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const elapsed = clock.getElapsedTime();

  mouse.x += (target.x - mouse.x) * 0.05;
  mouse.y += (target.y - mouse.y) * 0.05;

  particleMaterial.uniforms.uTime.value = elapsed;
  particleMaterial.uniforms.uMouse.value.set(mouse.x, mouse.y);

  const posArray = particleGeometry.attributes.position.array;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    posArray[i3]     += velocities[i3];
    posArray[i3 + 1] += velocities[i3 + 1];
    posArray[i3 + 2] += velocities[i3 + 2];

    const halfSpread = SPREAD / 2;
    if (Math.abs(posArray[i3]) > halfSpread) velocities[i3] *= -1;
    if (Math.abs(posArray[i3 + 1]) > halfSpread) velocities[i3 + 1] *= -1;
    if (Math.abs(posArray[i3 + 2]) > halfSpread) velocities[i3 + 2] *= -1;
  }
  particleGeometry.attributes.position.needsUpdate = true;

  updateLines();

  icoGroup.children.forEach((mesh) => {
    mesh.rotation.x += mesh.userData.speed * 0.007;
    mesh.rotation.y += mesh.userData.speed * 0.01;
    mesh.position.y += Math.sin(elapsed * mesh.userData.speed) * 0.03;
  });

  knot.rotation.x = elapsed * 0.12;
  knot.rotation.y = elapsed * 0.08;
  knot.rotation.z = elapsed * 0.05;
  knotMat.opacity = 0.1 + Math.sin(elapsed * 0.5) * 0.05;

  ring.rotation.z = elapsed * 0.15;
  ring.rotation.x = Math.PI * 0.45 + Math.sin(elapsed * 0.3) * 0.1;

  const scrollFactor = scrollY * 0.0003;
  camera.position.y = -scrollY * 0.008;
  camera.rotation.x = scrollFactor * 0.2;

  particles.rotation.y = elapsed * 0.02 + mouse.x * 0.1;
  particles.rotation.x = mouse.y * 0.05;

  renderer.render(scene, camera);
}

initReveal();
animate();
