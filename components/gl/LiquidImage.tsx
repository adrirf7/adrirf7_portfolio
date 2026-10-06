"use client";

import { useEffect, useRef, useState } from "react";
import { Mesh, Program, Renderer, Texture, Triangle } from "ogl";
import { getScrollVelocity } from "@/lib/scrollVelocity";

const VERT = /* glsl */ `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const FRAG = /* glsl */ `
precision highp float;
uniform sampler2D uTex;
uniform vec2 uRes;     // element size in px
uniform vec2 uImg;     // image size in px
uniform vec2 uFocus;   // object-position, in uv space
uniform vec2 uMouse;   // cursor, in uv space
uniform float uHover;  // 0..1
uniform vec2 uBend;    // paper bend driven by scroll velocity
uniform float uTime;
uniform float uRadius; // corner radius in px
uniform float uDuo;    // 1 = duotone with a colour reveal under the cursor
uniform vec3 uDark;
uniform vec3 uLight;
varying vec2 vUv;

vec2 cover(vec2 uv) {
  float rs = uRes.x / uRes.y;
  float ri = uImg.x / uImg.y;
  vec2 s = rs < ri ? vec2(rs / ri, 1.0) : vec2(1.0, ri / rs);
  return uv * s + (1.0 - s) * uFocus;
}

float sdRoundBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
  vec2 uv = vUv;

  // Paper bend: the middle of the sheet lags behind its edges while it travels
  uv.x += sin(vUv.y * 3.14159) * uBend.x;
  uv.y += sin(vUv.x * 3.14159) * uBend.y;

  // Rounded mask evaluated on the bent coordinates, so the outline curves as well
  float d = sdRoundBox((uv - 0.5) * uRes, uRes * 0.5, uRadius);
  float alpha = 1.0 - smoothstep(-1.0, 0.5, d);
  if (alpha <= 0.0) discard;

  // Liquid rings radiating from the cursor
  vec2 aspect = vec2(uRes.x / uRes.y, 1.0);
  vec2 toMouse = (uv - uMouse) * aspect;
  float dist = length(toMouse);
  float wave = sin(dist * 34.0 - uTime * 5.0) * exp(-dist * 5.0) * uHover;
  vec2 dir = dist > 0.0001 ? toMouse / dist : vec2(0.0);
  uv += dir / aspect * wave * 0.012;

  // Gentle push-in while hovered
  uv = (uv - 0.5) * (1.0 - uHover * 0.05) + 0.5;

  // Chromatic fringe: confined to the area around the cursor, plus a faint trail while moving
  float halo = exp(-dist * 6.0) * uHover;
  vec2 shift = dir / aspect * halo * 0.007 + uBend * 0.1;
  float r = texture2D(uTex, cover(uv + shift)).r;
  float g = texture2D(uTex, cover(uv)).g;
  float b = texture2D(uTex, cover(uv - shift)).b;
  vec3 col = vec3(r, g, b);

  if (uDuo > 0.5) {
    // Two-ink print: luminance mapped from deep blue to paper
    float l = smoothstep(0.04, 0.92, dot(col, vec3(0.299, 0.587, 0.114)));
    vec3 duo = mix(uDark, uLight, l);
    // A wobbling disc under the cursor lets the real colours through
    float ang = atan(toMouse.y, toMouse.x);
    float edge = 0.21 + sin(ang * 5.0 + uTime * 2.0) * 0.016 + sin(ang * 3.0 - uTime * 1.3) * 0.012;
    float reveal = (1.0 - smoothstep(edge - 0.05, edge, dist)) * uHover;
    col = mix(duo, col, reveal);
  }

  gl_FragColor = vec4(col * alpha, alpha);
}`;

/** Route through the Next image optimizer (default quality 75) so the GPU never receives a 4000px original. */
function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

/** Widths the Next image optimizer serves (its default device sizes) */
const SIZES = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];

/** Route through the Next image optimizer so the GPU never receives a 4000px original. */
export function optimized(src: string, width = 1200, quality = 75) {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;
}

/**
 * Smallest served width that still covers the element on this screen. `cover` crops,
 * so a tall frame needs an image as wide as its height times the image's aspect.
 */
function widthFor(el: HTMLElement, aspect: number) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const needed = Math.max(el.clientWidth, el.clientHeight * aspect) * dpr;
  return SIZES.find((s) => s >= needed) ?? SIZES[SIZES.length - 1];
}

type Props = {
  src: string;
  alt: string;
  /** Direction the element travels on screen (decides which way it bends) */
  axis?: "x" | "y";
  radius?: number;
  /** object-position in percent, e.g. [28, 30] */
  focus?: [number, number];
  /** Width used before layout is known (first paint); the real one is measured */
  width?: number;
  /** Width / height of the source image, used to size the request for cover-cropping */
  aspect?: number;
  /** Encoder quality (must be listed in next.config images.qualities) */
  quality?: number;
  priority?: boolean;
  /** Print the image in two inks ([dark, light] hex) and reveal true colour under the cursor */
  duotone?: [string, string];
  /** Must give the wrapper a size and a positioning context (e.g. "absolute inset-0") */
  className?: string;
};

/**
 * An image rendered through a WebGL shader: bends like paper with scroll velocity and
 * ripples from the cursor on hover. A plain <img> is painted first (LCP, no-JS, no-WebGL,
 * reduced motion) and the canvas only replaces it once its texture is ready.
 */
export default function LiquidImage({
  src,
  alt,
  axis = "x",
  radius = 0,
  focus = [50, 50],
  width = 1200,
  aspect = 1.6,
  quality = 75,
  priority,
  duotone,
  className = "relative",
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [w, setW] = useState(width);
  const url = optimized(src, w, quality);

  // Size the request to the element as laid out on this screen, and again if it grows
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const update = () => {
      if (!wrap.clientWidth) return;
      const next = widthFor(wrap, aspect);
      setW((cur) => (next > cur ? next : cur)); // never downgrade an image already loaded
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [aspect]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let renderer: Renderer;
    try {
      renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio, 2), alpha: true, premultipliedAlpha: true });
    } catch {
      return; // no WebGL: the <img> stays
    }
    const gl = renderer.gl;
    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText =
      "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;opacity:0;transition:opacity 400ms ease";
    wrap.appendChild(canvas);

    // Mipmaps keep detail clean when the image is drawn smaller than its pixels
    const texture = new Texture(gl, { generateMipmaps: true, minFilter: gl.LINEAR_MIPMAP_LINEAR });
    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      transparent: true,
      uniforms: {
        uTex: { value: texture },
        uRes: { value: [1, 1] },
        uImg: { value: [1, 1] },
        uFocus: { value: [focus[0] / 100, 1 - focus[1] / 100] },
        uMouse: { value: [0.5, 0.5] },
        uHover: { value: 0 },
        uBend: { value: [0, 0] },
        uTime: { value: 0 },
        uRadius: { value: radius },
        uDuo: { value: duotone ? 1 : 0 },
        uDark: { value: hexToRgb(duotone?.[0] ?? "#000000") },
        uLight: { value: hexToRgb(duotone?.[1] ?? "#ffffff") },
      },
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    let loaded = false;
    let dirty = true;
    let visible = true;
    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    let hover = 0;
    let hoverTarget = 0;
    let bend = 0;

    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      texture.image = img;
      program.uniforms.uImg.value = [img.naturalWidth, img.naturalHeight];
      loaded = true;
      dirty = true;
      requestAnimationFrame(() => {
        canvas.style.opacity = "1";
        setReady(true);
      });
    };
    img.src = url;

    // clientWidth ignores ancestor transforms (tilt, scale), unlike getBoundingClientRect
    const resize = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      program.uniforms.uRes.value = [w, h];
      dirty = true;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: "100px" });
    io.observe(wrap);

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = wrap.getBoundingClientRect();
      mouse.tx = (e.clientX - r.left) / r.width;
      mouse.ty = 1 - (e.clientY - r.top) / r.height;
    };
    const onEnter = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      onMove(e);
      mouse.x = mouse.tx;
      mouse.y = mouse.ty;
      hoverTarget = 1;
    };
    const onLeave = () => (hoverTarget = 0);
    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerenter", onEnter);
    wrap.addEventListener("pointerleave", onLeave);

    let raf = 0;
    let last = performance.now();
    let time = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!visible || !loaded) return;

      // Frame-rate independent easing toward each target
      const k = (rate: number) => 1 - Math.exp(-rate * dt);
      const bendTarget = Math.max(-0.055, Math.min(0.055, -getScrollVelocity() * 0.0013));
      bend += (bendTarget - bend) * k(8);
      hover += (hoverTarget - hover) * k(7);
      mouse.x += (mouse.tx - mouse.x) * k(10);
      mouse.y += (mouse.ty - mouse.y) * k(10);

      // Idle and settled: skip the draw entirely
      const busy = dirty || hoverTarget > 0 || hover > 0.002 || Math.abs(bend) > 0.0004;
      if (!busy) return;

      time += dt;
      const u = program.uniforms;
      u.uTime.value = time;
      u.uHover.value = hover;
      u.uMouse.value = [mouse.x, mouse.y];
      u.uBend.value = axis === "x" ? [bend, 0] : [0, bend];
      renderer.render({ scene: mesh });
      dirty = false;
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerenter", onEnter);
      wrap.removeEventListener("pointerleave", onLeave);
      img.onload = null;
      canvas.remove();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      setReady(false);
    };
    // focus is a fresh array each render; its values are what matter
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, axis, radius, focus[0], focus[1], duotone?.[0], duotone?.[1]]);

  return (
    <div ref={wrapRef} className={className}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        style={{ borderRadius: radius, objectPosition: `${focus[0]}% ${focus[1]}%` }}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${duotone ? "grayscale contrast-125" : ""} ${ready ? "opacity-0" : "opacity-100"}`}
      />
      {/* CSS approximation of the duotone for the no-WebGL / reduced-motion path */}
      {duotone && (
        <span
          aria-hidden
          className={`pointer-events-none absolute inset-0 mix-blend-screen transition-opacity duration-300 ${ready ? "opacity-0" : "opacity-100"}`}
          style={{ background: duotone[0], borderRadius: radius }}
        />
      )}
    </div>
  );
}
