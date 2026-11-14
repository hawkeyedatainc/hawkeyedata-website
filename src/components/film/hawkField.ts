// The hero's WebGL scene: the hawk as a field of gold points that assembles on load,
// then opens into a tunnel the camera flies through as the page scrolls.
// Plain WebGL on purpose: one draw call, no 3D library to download.

const HAWK_POINTS = 15000;
const DUST_POINTS = 3500;
const COUNT = HAWK_POINTS + DUST_POINTS;
const FOV = (40 * Math.PI) / 180;
const CAMERA_START = 7.5;
const CAMERA_TRAVEL = 44;

const VERT = `
attribute vec3 aHawk;
attribute vec3 aScatter;
attribute vec3 aTunnel;
attribute vec4 aSeed; // x: random, y: edge (1) / fill (0) / dust (-1), z: size, w: random
uniform mat4 uProj;
uniform float uTime, uAssemble, uFly, uScale, uCamZ, uHawkScale, uOffsetX;
uniform vec2 uTilt;
varying vec3 vColor;
varying float vAlpha;

mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }

void main() {
  float r = aSeed.x;
  float dust = step(aSeed.y, -0.5);

  // The hawk, breathing a little, turned toward the pointer.
  vec3 hawk = aHawk * mix(uHawkScale, 1.0, dust);
  hawk += 0.014 * vec3(sin(uTime * 1.3 + r * 40.0), cos(uTime * 1.1 + r * 31.0), sin(uTime * 0.9 + r * 17.0));
  float settle = 1.0 - smoothstep(0.0, 0.1, uFly);
  vec2 tilt = uTilt * (1.0 - dust) + vec2(sin(uTime * 0.35) * 0.08, 0.0) * (1.0 - dust);
  hawk.xz = rot(tilt.x) * hawk.xz;
  hawk.yz = rot(tilt.y) * hawk.yz;
  hawk.x += uOffsetX * settle * (1.0 - dust);

  // Assemble from scattered points, each on its own delay.
  float a = clamp(uAssemble * 1.7 - r * 0.7, 0.0, 1.0);
  a = 1.0 - pow(1.0 - a, 4.0);
  vec3 p = mix(aScatter, hawk, a);

  // Scroll: the points leave for the tunnel, outer ones first.
  float f = clamp(uFly * 2.2 - r * 0.6, 0.0, 1.0);
  f = f * f * (3.0 - 2.0 * f);
  vec3 tunnel = aTunnel;
  tunnel.xy = rot(uTime * 0.03 + tunnel.z * 0.02) * tunnel.xy;
  p = mix(p, tunnel, f);

  vec4 mv = vec4(p.x, p.y, p.z - uCamZ, 1.0);
  gl_Position = uProj * mv;
  float depth = max(0.1, -mv.z);
  gl_PointSize = min(aSeed.z * uScale / depth, uScale * 1.1);

  // A scan line crosses the hawk every few seconds.
  float sweep = mod(uTime * 0.8, 9.0) - 4.0;
  float band = exp(-pow((aHawk.x * uHawkScale - sweep) * 2.2, 2.0)) * (1.0 - f) * (1.0 - dust) * a;

  vec3 gold = vec3(1.0, 0.85, 0.23);
  vec3 lilac = vec3(0.72, 0.6, 0.95);
  vec3 base = mix(gold, vec3(1.0, 0.96, 0.8), max(aSeed.y, 0.0) * 0.45 + band * 0.7);
  vColor = mix(base, lilac, max(dust, f * step(0.55, aSeed.w)));
  float near = smoothstep(0.15, 1.6, depth);
  float far = 1.0 - smoothstep(16.0, 34.0, depth);
  vAlpha = near * far * mix(0.7, 0.3, dust) * (1.0 + band * 1.6) * mix(0.25, 1.0, max(a, dust));
}`;

const FRAG = `
precision mediump float;
varying vec3 vColor;
varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d);
  a *= a * vAlpha;
  gl_FragColor = vec4(vColor * a, a);
}`;

/** Points inside the logo's filled shape, in a box about 1 unit wide, with edge points flagged. */
function sampleHawk(paths: string[], viewBox: string) {
  const [vx, vy, vw, vh] = viewBox.split(" ").map(Number);
  const w = 732;
  const h = Math.round((w * vh) / vw);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.scale(w / vw, h / vh);
  ctx.translate(-vx, -vy);
  ctx.fill(new Path2D(paths.join(" ")), "evenodd");
  const { data } = ctx.getImageData(0, 0, w, h);
  const filled = (x: number, y: number) => x >= 0 && y >= 0 && x < w && y < h && data[(y * w + x) * 4 + 3] > 127;

  const fill: number[] = [];
  const edge: number[] = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (!filled(x, y)) continue;
      const onEdge = !filled(x - 1, y) || !filled(x + 1, y) || !filled(x, y - 1) || !filled(x, y + 1);
      (onEdge ? edge : fill).push(x, y);
    }
  }
  return { fill, edge, w, h };
}

export type HawkField = {
  /** 0 at the top of the hero, 1 when the camera has flown through. */
  setScroll(progress: number): void;
  /** Pointer position across the viewport, -1..1 on both axes. */
  setPointer(x: number, y: number): void;
  setRunning(running: boolean): void;
  destroy(): void;
};

export function createHawkField(canvas: HTMLCanvasElement, paths: string[], viewBox: string): HawkField | null {
  const gl = canvas.getContext("webgl", { alpha: true, antialias: false, premultipliedAlpha: true });
  if (!gl) return null;

  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const program = gl.createProgram()!;
  gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT));
  gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);

  // Per-point data: 3 formations + 4 seeds, interleaved.
  const STRIDE = 13;
  const buf = new Float32Array(COUNT * STRIDE);
  const { fill, edge, w, h } = sampleHawk(paths, viewBox);
  const rand = Math.random;
  for (let i = 0; i < COUNT; i++) {
    const o = i * STRIDE;
    const isDust = i >= HAWK_POINTS;
    const isEdge = !isDust && rand() < 0.38 && edge.length > 0;
    let kind = -1;
    if (isDust) {
      buf[o] = (rand() - 0.5) * 22;
      buf[o + 1] = (rand() - 0.5) * 12;
      buf[o + 2] = -2 - rand() * 14;
    } else {
      const src = isEdge ? edge : fill;
      const k = Math.floor(rand() * (src.length / 2)) * 2;
      buf[o] = (src[k] + rand()) / w - 0.5;
      buf[o + 1] = -((src[k + 1] + rand()) / h - 0.5) * (h / w);
      buf[o + 2] = (rand() - 0.5) * (isEdge ? 0.012 : 0.035);
      kind = isEdge ? 1 : 0;
    }
    // Scatter: a wide shell around the scene.
    const t = rand() * Math.PI * 2;
    const u = rand() * 2 - 1;
    const rad = 6 + rand() * 9;
    const s = Math.sqrt(1 - u * u);
    buf[o + 3] = isDust ? buf[o] : rad * s * Math.cos(t);
    buf[o + 4] = isDust ? buf[o + 1] : rad * s * Math.sin(t) * 0.7;
    buf[o + 5] = isDust ? buf[o + 2] : rad * u - 2;
    // Tunnel: a long tube along the camera's path.
    const ta = rand() * Math.PI * 2;
    const tr = 1.5 + Math.pow(rand(), 0.7) * 6.5;
    buf[o + 6] = Math.cos(ta) * tr;
    buf[o + 7] = Math.sin(ta) * tr;
    buf[o + 8] = 5 - rand() * (CAMERA_TRAVEL + 28);
    buf[o + 9] = rand();
    buf[o + 10] = kind;
    buf[o + 11] = isDust ? 1 + rand() * 2 : isEdge ? 1.9 + rand() * 1.3 : 1.1 + rand() * 1.5;
    buf[o + 12] = rand();
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, buf, gl.STATIC_DRAW);
  const attr = (name: string, size: number, offset: number) => {
    const loc = gl.getAttribLocation(program, name);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, size, gl.FLOAT, false, STRIDE * 4, offset * 4);
  };
  attr("aHawk", 3, 0);
  attr("aScatter", 3, 3);
  attr("aTunnel", 3, 6);
  attr("aSeed", 4, 9);

  const uni = (name: string) => gl.getUniformLocation(program, name);
  const U = {
    proj: uni("uProj"),
    time: uni("uTime"),
    assemble: uni("uAssemble"),
    fly: uni("uFly"),
    scale: uni("uScale"),
    camZ: uni("uCamZ"),
    hawkScale: uni("uHawkScale"),
    offsetX: uni("uOffsetX"),
    tilt: uni("uTilt"),
  };

  gl.disable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE);
  gl.clearColor(0, 0, 0, 0);

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cw = canvas.clientWidth;
    const ch = canvas.clientHeight;
    canvas.width = Math.round(cw * dpr);
    canvas.height = Math.round(ch * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
    const aspect = cw / ch;
    const f = 1 / Math.tan(FOV / 2);
    const near = 0.1;
    const far = 80;
    // prettier-ignore
    gl.uniformMatrix4fv(U.proj, false, new Float32Array([
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (far + near) / (near - far), -1,
      0, 0, (2 * far * near) / (near - far), 0,
    ]));
    const visibleWidth = 2 * CAMERA_START * Math.tan(FOV / 2) * aspect;
    gl.uniform1f(U.hawkScale, visibleWidth * 0.4);
    gl.uniform1f(U.offsetX, visibleWidth * 0.23);
    gl.uniform1f(U.scale, canvas.height * 0.021);
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  let scroll = 0;
  let fly = 0;
  const pointer = { x: 0, y: 0 };
  const tilt = { x: 0, y: 0 };
  let frame = 0;
  let running = false;
  let last = 0;
  let clock = 0;

  const draw = (now: number) => {
    frame = requestAnimationFrame(draw);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    clock += dt;
    fly += (scroll - fly) * Math.min(1, dt * 8);
    tilt.x += (pointer.x * 0.35 - tilt.x) * Math.min(1, dt * 3);
    tilt.y += (pointer.y * 0.2 - tilt.y) * Math.min(1, dt * 3);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(U.time, clock);
    gl.uniform1f(U.assemble, Math.min(1, clock / 2.6));
    gl.uniform1f(U.fly, fly);
    gl.uniform1f(U.camZ, CAMERA_START - Math.pow(fly, 1.35) * CAMERA_TRAVEL);
    gl.uniform2f(U.tilt, tilt.x, tilt.y);
    gl.drawArrays(gl.POINTS, 0, COUNT);
  };

  return {
    setScroll: (p) => (scroll = Math.max(0, Math.min(1, p))),
    setPointer: (x, y) => {
      pointer.x = x;
      pointer.y = y;
    },
    setRunning(next) {
      if (next === running) return;
      running = next;
      cancelAnimationFrame(frame);
      if (running) {
        last = performance.now();
        frame = requestAnimationFrame(draw);
      }
    },
    destroy() {
      cancelAnimationFrame(frame);
      ro.disconnect();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
