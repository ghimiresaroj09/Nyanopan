"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ChevronDown,
  Layers,
  RotateCw,
  Sparkles,
  Compass,
} from "lucide-react";

import { Button } from "@/components/ui/button";

gsap.registerPlugin(ScrollTrigger);

// Authentic colorways generated directly from the newly uploaded reference shoe
const COLORWAYS = [
  {
    name: "Marbled Mountain Grey",
    image: "/brand/slipper_side.png",
    cssCode: "#8e8880",
    bgTint: "rgba(142, 136, 128, 0.08)",
    description: "Original natural undyed Tibetan highland wool felt with pure lanolin.",
  },
  {
    name: "Himalayan",
    image: "/brand/slipper_brown.png",
    cssCode: "#3e5243",
    bgTint: "rgba(62, 82, 67, 0.08)",
    description: "Steeped slowly with wild Himalayan nettle and walnut rind botanicals.",
  },
  {
    name: "Indigo Dusk Navy",
    image: "/brand/slipper_navy.png",
    cssCode: "#273646",
    bgTint: "rgba(39, 54, 70, 0.08)",
    description: "Fermented high-altitude mountain indigo steeped in copper kettles.",
  },
  {
    name: "Terracotta Earth",
    image: "/brand/slipper_terracotta.png",
    cssCode: "#9e4c35",
    bgTint: "rgba(158, 76, 53, 0.08)",
    description: "Kathmandu Valley red clay mineral wash sun-dried in the courtyards.",
  },
];

// Multi-angle 3D rotational perspectives from the newly attached photos
const ROTATION_VIEWS = [
  {
    angle: "Lateral Elevation (0°)",
    image: "/brand/slipper_side.png",
    aspect: "w-[680px] h-[280px]",
  },
  {
    angle: "3/4 Angled Pair (45°)",
    image: "/brand/slipper_pair.png",
    aspect: "w-[580px] h-[310px]",
  },
  {
    angle: "Upright & Profile (120°)",
    image: "/brand/slipper_profile.png",
    aspect: "w-[580px] h-[380px]",
  },
  {
    angle: "Sole Tread & Side (210°)",
    image: "/brand/slipper_sole.png",
    aspect: "w-[400px] h-[480px]",
  },
  {
    angle: "Top Collar Pair (300°)",
    image: "/brand/slipper_top.png",
    aspect: "w-[400px] h-[480px]",
  },
];

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Stage state
  const [activeStage, setActiveStage] = useState(0);
  const [activeColorway, setActiveColorway] = useState(0);
  const [rotationIndex, setRotationIndex] = useState(0);

  // References to animated elements
  const persistentHeaderRef = useRef<HTMLDivElement>(null);
  const stage1Ref = useRef<HTMLDivElement>(null);
  const stage2Ref = useRef<HTMLDivElement>(null);
  const stage3Ref = useRef<HTMLDivElement>(null);
  const stage4Ref = useRef<HTMLDivElement>(null);
  const stage5Ref = useRef<HTMLDivElement>(null);

  // Exploded layer refs
  const layerUpperRef = useRef<HTMLDivElement>(null);
  const layerFootbedRef = useRef<HTMLDivElement>(null);
  const layerSoleRef = useRef<HTMLDivElement>(null);
  const assembledShoeRef = useRef<HTMLDivElement>(null);
  const explodedStackRef = useRef<HTMLDivElement>(null);

  // Shadow ref
  const shadowRef = useRef<HTMLDivElement>(null);

  // Stage 5 shoe ref for floating animation
  const stage5ShoeRef = useRef<HTMLDivElement>(null);

  // Three.js Ambient Particle & Studio Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 10);

    // Subtle drifting wool dust particles in warm golden hour light
    const particleCount = 60;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 16;
      positions[i + 1] = (Math.random() - 0.5) * 10;
      positions[i + 2] = (Math.random() - 0.5) * 8;
    }
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xc8b59e,
      size: 0.04,
      transparent: true,
      opacity: 0.35,
    });
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    let animationFrameId: number;
    const animate = () => {
      particles.rotation.y += 0.0004;
      particles.rotation.x += 0.0002;
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  // GSAP Scrollytelling Setup
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const stages = [
        stage1Ref.current,
        stage2Ref.current,
        stage3Ref.current,
        stage4Ref.current,
        stage5Ref.current,
      ];

      // Hide all except first
      stages.forEach((st, idx) => {
        if (st && idx !== 0) {
          gsap.set(st, { autoAlpha: 0, pointerEvents: "none" });
        }
      });

      // Master ScrollTrigger Timeline
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "+=4200",
          scrub: 0.8,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;
            const curStage = Math.min(4, Math.floor(p * 5));
            setActiveStage(curStage);

            // In Stage 2 (Axial Rotation: 0.18 to 0.38)
            if (p >= 0.18 && p < 0.38) {
              const rotProgress = (p - 0.18) / (0.38 - 0.18);
              const viewIdx = Math.min(
                ROTATION_VIEWS.length - 1,
                Math.floor(rotProgress * ROTATION_VIEWS.length)
              );
              setRotationIndex(viewIdx);
            }
          },
        },
      });

      // Stage 1 Entrance: Main headline fades out once scrolling starts
      if (persistentHeaderRef.current) {
        masterTl.to(
          persistentHeaderRef.current,
          {
            autoAlpha: 0,
            y: -30,
            scale: 0.8,
            duration: 0.3,
            ease: "power2.out",
          },
          0.15
        );
      }

      // Stage 1 -> Stage 2 (360 Rotation)
      masterTl
        .to(stage1Ref.current, { autoAlpha: 0, y: -30, duration: 0.5 }, 0.5)
        .fromTo(
          stage2Ref.current,
          { autoAlpha: 0, scale: 0.94 },
          { autoAlpha: 1, scale: 1, duration: 0.5 },
          0.8
        );

      // Stage 2 -> Stage 3 (Colorways)
      masterTl
        .to(stage2Ref.current, { autoAlpha: 0, scale: 0.94, duration: 0.5 }, 1.8)
        .fromTo(
          stage3Ref.current,
          { autoAlpha: 0, y: 30 },
          { autoAlpha: 1, y: 0, duration: 0.5 },
          2.1
        );

      // Stage 3 -> Stage 4 (Exploded Separation)
      masterTl
        .to(stage3Ref.current, { autoAlpha: 0, duration: 0.5 }, 3.0)
        .fromTo(
          stage4Ref.current,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.5 },
          3.3
        );

      // Exploded Layer Animation in Stage 4:
      // 1. Starts fully closed using the authentic unified slipper (slipper_side.png)
      // 2. Explodes outward into the 3 distinct crafted layers (Upper, Insole, Sole) with callouts
      // 3. Holds open for inspection
      // 4. Compresses back together and cleanly transitions into the seamlessly closed shoe!
      if (
        layerUpperRef.current &&
        layerFootbedRef.current &&
        layerSoleRef.current &&
        assembledShoeRef.current &&
        explodedStackRef.current
      ) {
        masterTl
          // Step 1: Closed shoe opens -> cross-fades into exploded layers separating
          .fromTo(
            assembledShoeRef.current,
            { autoAlpha: 1, scale: 1 },
            { autoAlpha: 0, scale: 0.98, duration: 0.4, ease: "power1.out" },
            3.3
          )
          .fromTo(
            explodedStackRef.current,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.4, ease: "power1.out" },
            3.3
          )
          .fromTo(
            layerUpperRef.current,
            { y: 70, scale: 0.97 },
            { y: -35, scale: 1.0, duration: 0.7, ease: "power2.out" },
            3.3
          )
          .fromTo(
            layerFootbedRef.current,
            { y: 25, scale: 0.97 },
            { y: 0, scale: 1.02, duration: 0.7, ease: "power2.out" },
            3.3
          )
          .fromTo(
            layerSoleRef.current,
            { y: -20, scale: 0.97 },
            { y: 35, scale: 1.0, duration: 0.7, ease: "power2.out" },
            3.3
          );

        // Ground shadow spreads out when open
        if (shadowRef.current) {
          masterTl.fromTo(
            shadowRef.current,
            { scaleX: 0.95, scaleY: 0.9, opacity: 0.6 },
            { scaleX: 1.15, scaleY: 1.1, opacity: 0.85, duration: 0.7 },
            3.3
          );
        }

        // Step 2: Layers come back down and SHRINK / CLOSE together
        masterTl
          .to(
            layerUpperRef.current,
            { y: 70, scale: 0.97, duration: 0.7, ease: "power2.inOut" },
            4.2
          )
          .to(
            layerFootbedRef.current,
            { y: 25, scale: 0.97, duration: 0.7, ease: "power2.inOut" },
            4.2
          )
          .to(
            layerSoleRef.current,
            { y: -20, scale: 0.97, duration: 0.7, ease: "power2.inOut" },
            4.2
          )
          // When fully shrunk, cross-fade back into the perfectly closed original shoe!
          .to(
            explodedStackRef.current,
            { autoAlpha: 0, duration: 0.35, ease: "power1.in" },
            4.55
          )
          .to(
            assembledShoeRef.current,
            { autoAlpha: 1, scale: 1, duration: 0.35, ease: "power1.out" },
            4.55
          );

        if (shadowRef.current) {
          masterTl.to(
            shadowRef.current,
            { scaleX: 0.95, scaleY: 0.9, opacity: 0.6, duration: 0.7 },
            4.2
          );
        }
      }

      // Stage 4 -> Stage 5 (Anatomical Features)
      masterTl
        .to(stage4Ref.current, { autoAlpha: 0, duration: 0.5 }, 5.0)
        .fromTo(
          stage5Ref.current,
          { autoAlpha: 0, y: 30 },
          { autoAlpha: 1, y: 0, duration: 0.5 },
          5.3
        );

      // Stage 5: Subtle floating animation for the shoe
      if (stage5ShoeRef.current) {
        gsap.to(stage5ShoeRef.current, {
          y: -15,
          duration: 2.5,
          ease: "power1.inOut",
          repeat: -1,
          yoyo: true,
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-[#fbf9f5] text-[#2c2724] font-sans border-b border-[#ece4d5]">
      {/* Background Three.js Ambient Particle Layer */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-0 opacity-60"
      />

      {/* Main Scrollytelling Pinned Stage Container */}
      <div
        ref={containerRef}
        className="relative h-screen w-full overflow-hidden flex items-center justify-center pt-8"
      >
        {/* Soft Organic Background Radial Glow */}
        <div
          className="pointer-events-none absolute inset-0 transition-colors duration-1000 ease-out z-0"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${COLORWAYS[activeColorway].bgTint} 0%, rgba(251, 249, 245, 0) 70%)`,
          }}
        />

        {/* Persistent Editorial Headline - Visible across the entire scroll sequence */}
        <div
          ref={persistentHeaderRef}
          className="absolute top-3 sm:top-4 md:top-8 left-0 right-0 z-50 hidden sm:flex flex-col items-center justify-center text-center px-3 sm:px-4 pointer-events-auto transition-transform origin-top"
        >
          <div className="inline-flex items-center gap-1 sm:gap-2 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#f2eada]/90 backdrop-blur-sm border border-[#e2d6bf] text-[#6d5e4b] text-[10px] sm:text-[11px] uppercase tracking-widest font-medium mb-0.5 sm:mb-1.5 shadow-xs">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#a4642d]" />
            Nepal High-Altitude Craft · 100% Mountain Wool
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.12] sm:leading-[1.08] tracking-tight text-[#28221c] font-normal max-w-4xl px-2 sm:px-4">
            The Slipper Made of Mountain Air & Wool.
          </h1>
        </div>

        {/* ========================================================
            STAGE 1: PRODUCT ENTRANCE & EDITORIAL HERO INTRO
        ======================================================== */}
        <div
          ref={stage1Ref}
          className="absolute inset-0 flex flex-col items-center justify-center sm:justify-start px-4 sm:px-6 pb-20 sm:pb-0 pt-0 sm:pt-32 md:pt-36 z-10 pointer-events-auto opacity-100"
        >
          {/* Mobile-only centered header */}
          <div className="sm:hidden flex flex-col items-center justify-center text-center mb-6">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#f2eada]/90 backdrop-blur-sm border border-[#e2d6bf] text-[#6d5e4b] text-[10px] uppercase tracking-widest font-medium mb-1 shadow-xs">
              <Sparkles className="w-3 h-3 text-[#a4642d]" />
              Nepal High-Altitude Craft · 100% Mountain Wool
            </div>
            <h1 className="font-serif text-2xl leading-[1.12] tracking-tight text-[#28221c] font-normal px-2">
              The Slipper Made of Mountain Air & Wool.
            </h1>
          </div>

          <div className="max-w-2xl text-center space-y-2 sm:space-y-3 mb-4 sm:mb-6 mt-8 sm:mt-10">
            <p className="text-[#675c4e] text-xs sm:text-sm md:text-base leading-relaxed px-2">
              Seamlessly wet-felted around an ergonomic foot last using pure
              spring water, mild soap, and raw mountain wool. Scroll slowly to inspect
              every artisan detail.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-1">
              <Button
                asChild
                size="sm"
                className="bg-[#28221c] text-[#fbf9f5] hover:bg-[#3d362e] shadow-sm rounded-full h-9 sm:h-10 px-4 sm:px-6 text-[11px] sm:text-xs font-medium tracking-wide transition-all"
              >
                <Link href="/collections/all" className="inline-flex items-center gap-1.5 sm:gap-2">
                  Shop collection
                  <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="border-[#d8ccb6] bg-transparent text-[#42372c] hover:bg-[#f1ebde] hover:text-[#28221c] rounded-full h-9 sm:h-10 px-4 sm:px-5 text-[11px] sm:text-xs transition-all"
              >
                <Link href="/our-story">Discover our makers</Link>
              </Button>
            </div>
          </div>

          {/* Slipper Hero Display */}
          <div className="relative group cursor-pointer flex flex-col items-center">
            <div className="relative w-[320px] h-[130px] sm:w-[500px] sm:h-[200px] md:w-[600px] md:h-[240px] lg:w-[660px] lg:h-[270px] transition-transform duration-700 ease-out hover:scale-105">
              <Image
                src="/brand/slipper_side.png"
                alt="Nyanopan Wool Slipper Reference"
                fill
                priority
                className="object-contain drop-shadow-[0_15px_20px_rgba(50,40,30,0.12)] sm:drop-shadow-[0_20px_25px_rgba(50,40,30,0.14)]"
              />
            </div>
            {/* Ground Contact Shadow */}
            <div className="w-[280px] sm:w-[440px] h-4 sm:h-6 -mt-1 sm:-mt-2 bg-radial from-[#3c3022]/20 sm:from-[#3c3022]/25 via-[#3c3022]/08 sm:via-[#3c3022]/10 to-transparent rounded-full blur-[5px] sm:blur-[7px]" />
          </div>

          <div className="mt-4 sm:mt-6 flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs uppercase tracking-widest text-[#8c7f6e] animate-bounce">
            <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Scroll down to inspect form & layers
          </div>
        </div>

        {/* ========================================================
            STAGE 2: 360° AXIAL ROTATION INSPECTION
        ======================================================== */}
        <div
          ref={stage2Ref}
          className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 pt-20 sm:pt-24 z-10 pointer-events-none opacity-0 invisible"
        >
          <div className="text-center space-y-1 sm:space-y-1.5 mb-4 sm:mb-5">
            <div className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#f0e8d9] border border-[#e4d7bf] text-[#6d5e4b] text-[10px] sm:text-xs uppercase tracking-widest font-medium">
              <RotateCw className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#9e5d26]" /> 360° Axial
              Inspection
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#2b241e] px-2">
              Seamless Form & Profile
            </h2>
            <p className="text-[10px] sm:text-xs md:text-sm text-[#736657] px-2">
              Current Perspective:{" "}
              <span className="font-medium text-[#2c2724]">
                {ROTATION_VIEWS[rotationIndex].angle}
              </span>
            </p>
          </div>

          {/* Dynamic 360 Image View */}
          <div className="relative flex flex-col items-center justify-center min-h-[240px] sm:min-h-[340px]">
            <div
              className={`relative transition-all duration-300 ease-out ${
                rotationIndex === 0 ? 'w-[420px] h-[170px] sm:w-[680px] sm:h-[280px]' :
                rotationIndex === 1 ? 'w-[360px] h-[190px] sm:w-[580px] sm:h-[310px]' :
                rotationIndex === 2 ? 'w-[360px] h-[230px] sm:w-[580px] sm:h-[380px]' :
                rotationIndex === 3 ? 'w-[250px] h-[290px] sm:w-[400px] sm:h-[480px]' :
                'w-[250px] h-[290px] sm:w-[400px] sm:h-[480px]'
              }`}
            >
              <Image
                src={ROTATION_VIEWS[rotationIndex].image}
                alt="3D View Angle"
                fill
                priority
                className="object-contain drop-shadow-[0_20px_25px_rgba(50,40,30,0.16)] sm:drop-shadow-[0_25px_30px_rgba(50,40,30,0.18)]"
              />
            </div>
            {/* Synchronized floor shadow */}
            <div className="w-[300px] sm:w-[420px] h-4 sm:h-6 -mt-1 sm:-mt-2 bg-radial from-[#3c3022]/20 sm:from-[#3c3022]/25 via-[#3c3022]/06 sm:via-[#3c3022]/08 to-transparent rounded-full blur-[6px] sm:blur-[8px]" />
          </div>

          {/* Angle Thumbnails */}
          <div className="mt-4 sm:mt-5 flex items-center gap-2 sm:gap-3 bg-[#f3ede1]/90 backdrop-blur-sm p-1 sm:p-1.5 rounded-full border border-[#ded4bf]">
            {ROTATION_VIEWS.map((v, i) => (
              <button
                key={v.angle}
                onClick={() => setRotationIndex(i)}
                className={`px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs rounded-full transition-all ${
                  rotationIndex === i
                    ? "bg-[#2c2724] text-white shadow-sm font-medium"
                    : "text-[#706454] hover:text-[#2c2724]"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* ========================================================
            STAGE 3: NATURAL DYE COLORWAY TRANSFORMATION
        ======================================================== */}
        <div
          ref={stage3Ref}
          className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 pt-20 sm:pt-24 z-10 pointer-events-none opacity-0 invisible"
        >
          <div className="text-center space-y-1 sm:space-y-1.5 mb-4 sm:mb-5">
            <div className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#f0e8d9] border border-[#e4d7bf] text-[#6d5e4b] text-[10px] sm:text-xs uppercase tracking-widest font-medium">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#b07b46]" /> Botanical &
              Mineral Dyes
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#2b241e] px-2">
              Four Earthbound Hues
            </h2>
            <p className="max-w-md mx-auto text-[10px] sm:text-xs md:text-sm text-[#736657] px-3">
              {COLORWAYS[activeColorway].description}
            </p>
          </div>

          {/* Slipper with Colorway applied */}
          <div className="relative flex flex-col items-center">
            <div className="relative w-[320px] h-[130px] sm:w-[500px] sm:h-[200px] md:w-[600px] md:h-[240px] lg:w-[660px] lg:h-[270px]">
              {COLORWAYS.map((c, i) => (
                <div
                  key={c.name}
                  className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                    activeColorway === i ? "opacity-100 z-10" : "opacity-0 pointer-events-none"
                  }`}
                >
                  <Image
                    src={c.image}
                    alt={c.name}
                    fill
                    priority={i === 0}
                    className="object-contain drop-shadow-[0_20px_25px_rgba(50,40,30,0.14)] sm:drop-shadow-[0_25px_30px_rgba(50,40,30,0.16)]"
                  />
                </div>
              ))}
            </div>
            <div className="w-[280px] sm:w-[440px] h-4 sm:h-6 -mt-1 sm:-mt-2 bg-radial from-[#3c3022]/20 sm:from-[#3c3022]/25 via-[#3c3022]/08 sm:via-[#3c3022]/10 to-transparent rounded-full blur-[5px] sm:blur-[7px]" />
          </div>

          {/* Interactive Color Swatches */}
          <div className="mt-4 sm:mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-4 bg-[#f3ede1]/90 backdrop-blur-sm px-3 sm:px-5 py-2 sm:py-2.5 rounded-full border border-[#ded4bf] shadow-sm z-30 pointer-events-auto max-w-[95vw]">
            {COLORWAYS.map((c, i) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setActiveColorway(i)}
                className={`group flex items-center gap-1.5 sm:gap-2.5 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full cursor-pointer transition-all ${
                  activeColorway === i
                    ? "bg-[#2c2724] text-[#fbf9f5] shadow-sm scale-105"
                    : "hover:bg-[#e9dfcc] text-[#6e6150] hover:scale-102"
                }`}
              >
                <span
                  className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-black/15 shadow-inner flex-shrink-0"
                  style={{ backgroundColor: c.cssCode }}
                />
                <span className="text-[10px] sm:text-xs font-medium tracking-wide whitespace-nowrap">
                  {c.name.split(" ")[0]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ========================================================
            STAGE 4: EXPLODED PHYSICAL LAYER SEPARATION
        ======================================================== */}
        <div
          ref={stage4Ref}
          className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 pt-20 sm:pt-24 z-10 pointer-events-none opacity-0 invisible"
        >
          <div className="text-center space-y-1 sm:space-y-1.5 mb-4 sm:mb-6">
            <div className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#f0e8d9] border border-[#e4d7bf] text-[#6d5e4b] text-[10px] sm:text-xs uppercase tracking-widest font-medium">
              <Layers className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#a85f26]" /> Structural
              Anatomy
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#2b241e] px-2">
              Exploded Master Craftsmanship
            </h2>
            <p className="text-[10px] sm:text-xs md:text-sm text-[#736657] px-3">
              Three authentic layers seamlessly engineered without chemical glues.
            </p>
          </div>

          {/* Craft Stage Container */}
          <div className="relative w-full max-w-[95vw] sm:max-w-[680px] h-[360px] sm:h-[440px] flex items-center justify-center">
            
            {/* Fully Assembled Slipper (Shown when closed before explosion & after shrinking) */}
            <div
              ref={assembledShoeRef}
              className="absolute w-[320px] h-[130px] sm:w-[500px] sm:h-[200px] md:w-[600px] md:h-[240px] flex items-center justify-center z-40 transition-transform"
            >
              <Image
                src="/brand/slipper_side.png"
                alt="Seamless Hand-Felted Wool Slipper"
                fill
                priority
                className="object-contain drop-shadow-[0_15px_20px_rgba(50,40,30,0.14)] sm:drop-shadow-[0_20px_25px_rgba(50,40,30,0.16)]"
              />
            </div>

            {/* Exploded Stack (Active during open inspection) */}
            <div
              ref={explodedStackRef}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              {/* Layer 1: Wool Upper (Top) */}
              <div
                ref={layerUpperRef}
                className="absolute top-2 w-[90%] sm:w-[580px] h-[140px] sm:h-[180px] flex flex-col items-center justify-center transition-transform z-30"
              >
                <div className="relative w-full h-full">
                  <Image
                    src="/brand/crafted_upper.png"
                    alt="Seamless Wool Upper"
                    fill
                    className="object-contain drop-shadow-[0_12px_16px_rgba(40,30,20,0.13)] sm:drop-shadow-[0_15px_20px_rgba(40,30,20,0.15)]"
                  />
                </div>
                <div className="absolute right-1 sm:right-2 -top-1 bg-[#2c2724] text-white text-[9px] sm:text-[11px] px-2 sm:px-3.5 py-1 sm:py-1.5 rounded-full shadow-md flex items-center gap-1 sm:gap-1.5 z-20 max-w-[85%] sm:max-w-none">
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#d2a36d] flex-shrink-0" />
                  <span className="hidden sm:inline">1. Seamless Wet-Felted Wool Upper</span>
                  <span className="sm:hidden">1. Wool Upper</span>
                </div>
              </div>

              {/* Layer 2: Ergonomic Midsole Footbed (Middle) */}
              <div
                ref={layerFootbedRef}
                className="absolute top-[120px] sm:top-[150px] w-[88%] sm:w-[560px] h-[90px] sm:h-[110px] flex flex-col items-center justify-center transition-transform z-20"
              >
                <div className="relative w-full h-full">
                  <Image
                    src="/brand/crafted_insole.png"
                    alt="Cushioned Wool Insole Footbed"
                    fill
                    className="object-contain drop-shadow-[0_10px_15px_rgba(40,30,20,0.12)] sm:drop-shadow-[0_12px_18px_rgba(40,30,20,0.14)]"
                  />
                </div>
                <div className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 bg-[#2c2724] text-white text-[9px] sm:text-[11px] px-2 sm:px-3.5 py-1 sm:py-1.5 rounded-full shadow-md flex items-center gap-1 sm:gap-1.5 z-20 max-w-[85%] sm:max-w-none">
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#9bb08e] flex-shrink-0" />
                  <span className="hidden sm:inline">2. Cushioned Wool Insole Footbed</span>
                  <span className="sm:hidden">2. Insole</span>
                </div>
              </div>

              {/* Layer 3: Crepe Rubber Outsole (Bottom) */}
              <div
                ref={layerSoleRef}
                className="absolute bottom-8 sm:bottom-10 w-[90%] sm:w-[580px] h-[100px] sm:h-[130px] flex flex-col items-center justify-center transition-transform z-10"
              >
                <div className="relative w-full h-full">
                  <Image
                    src="/brand/crafted_sole.png"
                    alt="Honey Crepe Rubber Sole"
                    fill
                    className="object-contain drop-shadow-[0_15px_20px_rgba(40,30,20,0.18)] sm:drop-shadow-[0_20px_25px_rgba(40,30,20,0.2)]"
                  />
                </div>
                <div className="absolute right-1 sm:right-2 -bottom-1 sm:-bottom-2 bg-[#2c2724] text-white text-[9px] sm:text-[11px] px-2 sm:px-3.5 py-1 sm:py-1.5 rounded-full shadow-md flex items-center gap-1 sm:gap-1.5 z-20 max-w-[85%] sm:max-w-none">
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#f3bc6f] flex-shrink-0" />
                  <span className="hidden sm:inline">3. Heavy-Duty Honey Crepe Rubber Outsole</span>
                  <span className="sm:hidden">3. Rubber Sole</span>
                </div>
              </div>
            </div>

            {/* Dynamic Ground Shadow */}
            <div
              ref={shadowRef}
              className="absolute bottom-3 sm:bottom-4 w-[300px] sm:w-[460px] h-6 sm:h-8 bg-radial from-[#3c3022]/25 sm:from-[#3c3022]/30 via-[#3c3022]/08 sm:via-[#3c3022]/10 to-transparent rounded-full blur-[7px] sm:blur-[9px]"
            />
          </div>
        </div>

        {/* ========================================================
            STAGE 5: ANATOMICAL FEATURE FOCUS
        ======================================================== */}
        <div
          ref={stage5Ref}
          className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 pt-20 sm:pt-24 z-10 pointer-events-none opacity-0 invisible"
        >
          <div className="max-w-4xl grid md:grid-cols-2 gap-6 sm:gap-10 items-center">
            {/* Slipper Upright & Profile Angle */}
            <div className="relative flex flex-col items-center order-2 md:order-1">
              <div 
                ref={stage5ShoeRef}
                className="relative w-[280px] h-[250px] sm:w-[340px] sm:h-[300px] md:w-[420px] md:h-[360px]"
              >
                <Image
                  src="/brand/slipper_profile.png"
                  alt="Artisan Detail Perspective"
                  fill
                  className="object-contain drop-shadow-[0_20px_28px_rgba(50,40,30,0.16)] sm:drop-shadow-[0_25px_35px_rgba(50,40,30,0.18)]"
                />
              </div>
              <div className="w-[240px] sm:w-[340px] h-4 sm:h-6 -mt-1 sm:-mt-2 bg-radial from-[#3c3022]/20 sm:from-[#3c3022]/25 via-[#3c3022]/08 sm:via-[#3c3022]/10 to-transparent rounded-full blur-[6px] sm:blur-[8px]" />
            </div>

            {/* Feature Cards */}
            <div className="space-y-3 sm:space-y-4 order-1 md:order-2">
              <div className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#f0e8d9] border border-[#e4d7bf] text-[#6d5e4b] text-[10px] sm:text-xs uppercase tracking-widest font-medium">
                <Compass className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#9e5d26]" /> Designed for
                Everyday Life
              </div>
              <h2 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl text-[#2b241e]">
                Temperature Regulating, Odor-Resistant Comfort
              </h2>

              <div className="space-y-2 sm:space-y-3 text-[11px] sm:text-xs md:text-sm">
                <div className="p-2.5 sm:p-3.5 rounded-xl bg-[#f4ede0] border border-[#e5d9c2]">
                  <div className="font-medium text-[#2c2724] flex items-center gap-1.5 sm:gap-2">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#9e5d26] flex-shrink-0" />
                    Zero Friction Rolled Collar
                  </div>
                  <p className="text-[10px] sm:text-xs text-[#736657] mt-0.5 sm:mt-1 leading-relaxed">
                    A gently rolled felt ankle opening allows effortless slip-on
                    convenience while cradling your heel securely.
                  </p>
                </div>

                <div className="p-2.5 sm:p-3.5 rounded-xl bg-[#f4ede0] border border-[#e5d9c2]">
                  <div className="font-medium text-[#2c2724] flex items-center gap-1.5 sm:gap-2">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#9e5d26] flex-shrink-0" />
                    Natural Crepe Rubber Grip
                  </div>
                  <p className="text-[10px] sm:text-xs text-[#736657] mt-0.5 sm:mt-1 leading-relaxed">
                    Sourced from sustainably tapped Hevea trees. Silent, flexible,
                    and safe on polished wood, stone, and morning patio tiles.
                  </p>
                </div>

                <div className="p-2.5 sm:p-3.5 rounded-xl bg-[#f4ede0] border border-[#e5d9c2]">
                  <div className="font-medium text-[#2c2724] flex items-center gap-1.5 sm:gap-2">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#9e5d26] flex-shrink-0" />
                    Naturally Breathable Lanolin
                  </div>
                  <p className="text-[10px] sm:text-xs text-[#736657] mt-0.5 sm:mt-1 leading-relaxed">
                    Tibetan sheep wool wicks perspiration away instantaneously,
                    keeping your feet warm in winter and cool in spring.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
