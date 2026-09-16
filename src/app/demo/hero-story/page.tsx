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
  ShoppingBag,
  Sparkles,
  Check,
  Compass,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/format";
import { products } from "@/data/products";

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
    name: "Himalayan Forest Green",
    image: "/brand/slipper_green.png",
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

export default function HeroStoryDemoPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Stage state
  const [activeStage, setActiveStage] = useState(0);
  const [activeColorway, setActiveColorway] = useState(0);
  const [rotationIndex, setRotationIndex] = useState(0);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  // References to animated elements
  const stage1Ref = useRef<HTMLDivElement>(null);
  const stage2Ref = useRef<HTMLDivElement>(null);
  const stage3Ref = useRef<HTMLDivElement>(null);
  const stage4Ref = useRef<HTMLDivElement>(null);
  const stage5Ref = useRef<HTMLDivElement>(null);
  const stage6Ref = useRef<HTMLDivElement>(null);

  // Exploded layer refs
  const layerUpperRef = useRef<HTMLDivElement>(null);
  const layerFootbedRef = useRef<HTMLDivElement>(null);
  const layerSoleRef = useRef<HTMLDivElement>(null);
  const assembledShoeRef = useRef<HTMLDivElement>(null);
  const explodedStackRef = useRef<HTMLDivElement>(null);

  // Shadow ref
  const shadowRef = useRef<HTMLDivElement>(null);

  const heroProduct = products[0];

  const handleAddToCart = () => {
    cart.add(
      heroProduct,
      COLORWAYS[activeColorway].name,
      COLORWAYS[activeColorway].image,
      41,
      1
    );
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 2400);
  };

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
        stage6Ref.current,
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
          end: "+=5000",
          scrub: 0.8,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;
            const curStage = Math.min(5, Math.floor(p * 6));
            setActiveStage(curStage);

            // In Stage 2 (Axial Rotation: 0.16 to 0.33)
            if (p >= 0.16 && p < 0.33) {
              const rotProgress = (p - 0.16) / (0.33 - 0.16);
              const viewIdx = Math.min(
                ROTATION_VIEWS.length - 1,
                Math.floor(rotProgress * ROTATION_VIEWS.length)
              );
              setRotationIndex(viewIdx);
            }
          },
        },
      });

      // Stage 1 -> Stage 2 (360 Rotation)
      masterTl
        .to(stage1Ref.current, { autoAlpha: 0, y: -40, duration: 0.5 }, 0.5)
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

      // Stage 5 -> Stage 6 (Reassembly & Buy Now CTA)
      masterTl
        .to(stage5Ref.current, { autoAlpha: 0, duration: 0.5 }, 6.2)
        .fromTo(
          stage6Ref.current,
          { autoAlpha: 0, scale: 0.96 },
          { autoAlpha: 1, scale: 1, duration: 0.5 },
          6.5
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative min-h-screen bg-[#fbf9f5] text-[#2c2724] font-sans selection:bg-[#ebd9c3] selection:text-[#3d2f21]">
      {/* Editorial Top Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5 bg-[#fbf9f5]/85 backdrop-blur-md border-b border-[#e7decb]">
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-[#e9dec9] shadow-sm flex items-center justify-center p-1">
            <Image
              src="/brand/logo-cloud.png?v=2"
              alt="Nyanopan Emblem"
              width={28}
              height={28}
              className="object-contain"
            />
          </div>
          <span className="font-serif text-xl tracking-tight text-[#2b241e]">
            Nyanopan
          </span>
          <span className="text-xs uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#eee5d3] text-[#786b59] font-medium ml-1">
            Story Demo
          </span>
        </Link>

        {/* Stage Progress Indicator */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-[#7d7263]">
          {["Entrance", "360° Axial", "Colorways", "Craft Layers", "Anatomy", "Purchase"].map(
            (label, idx) => (
              <div
                key={label}
                className={`flex items-center gap-2 px-3 py-1 rounded-full transition-all duration-300 ${
                  activeStage === idx
                    ? "bg-[#2c2724] text-[#fbf9f5] font-medium shadow-sm"
                    : "text-[#8a7f72] hover:text-[#2c2724]"
                }`}
              >
                <span className="text-[10px] opacity-75">{idx + 1}</span>
                <span>{label}</span>
              </div>
            )
          )}
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-xs text-[#706454] hover:text-[#2c2724] transition-colors font-medium underline underline-offset-4"
          >
            ← Return to Store
          </Link>
          <Button
            onClick={handleAddToCart}
            size="sm"
            className="bg-[#2c2724] text-[#fbf9f5] hover:bg-[#3d3732] rounded-full px-5 h-9 text-xs font-medium tracking-wide shadow-sm"
          >
            {isAddedToCart ? (
              <span className="flex items-center gap-1.5 text-emerald-300">
                <Check className="w-3.5 h-3.5" /> Added to Bag
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5" /> Order Now
              </span>
            )}
          </Button>
        </div>
      </header>

      {/* Background Three.js Ambient Particle Layer */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-0 opacity-60"
      />

      {/* Main Scrollytelling Pinned Stage Container */}
      <div
        ref={containerRef}
        className="relative h-screen w-full overflow-hidden flex items-center justify-center pt-16"
      >
        {/* Soft Organic Background Radial Glow */}
        <div
          className="pointer-events-none absolute inset-0 transition-colors duration-1000 ease-out z-0"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${COLORWAYS[activeColorway].bgTint} 0%, rgba(251, 249, 245, 0) 70%)`,
          }}
        />

        {/* ========================================================
            STAGE 1: PRODUCT ENTRANCE & EDITORIAL HERO INTRO
        ======================================================== */}
        <div
          ref={stage1Ref}
          className="absolute inset-0 flex flex-col items-center justify-center px-6 z-10 pointer-events-auto opacity-100"
        >
          <div className="max-w-4xl text-center space-y-4 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0e8d9] border border-[#e4d7bf] text-[#6d5e4b] text-xs uppercase tracking-widest font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#b07b46]" />
              Handcrafted in Nepal · 100% Tibetan Highland Wool
            </div>
            <h1 className="font-serif text-5xl md:text-7xl tracking-tight text-[#2b241e] font-normal leading-[1.08]">
              The Slipper Made of Mountain Air & Wool.
            </h1>
            <p className="max-w-2xl mx-auto text-[#685c4e] text-base md:text-lg leading-relaxed">
              Seamlessly sculpted around an anatomical foot last using water,
              natural soap, and mountain wool. Scroll slowly to inspect every
              artisan detail.
            </p>
          </div>

          {/* Slipper Hero Display */}
          <div className="relative group cursor-pointer flex flex-col items-center">
            <div className="relative w-[580px] h-[240px] md:w-[680px] md:h-[280px] transition-transform duration-700 ease-out hover:scale-105">
              <Image
                src="/brand/slipper_side.png"
                alt="Nyanopan Wool Slipper Reference"
                fill
                priority
                className="object-contain drop-shadow-[0_20px_25px_rgba(50,40,30,0.14)]"
              />
            </div>
            {/* Ground Contact Shadow */}
            <div className="w-[460px] h-6 -mt-2 bg-radial from-[#3c3022]/25 via-[#3c3022]/10 to-transparent rounded-full blur-[7px]" />
          </div>

          <div className="mt-8 flex items-center gap-2 text-xs uppercase tracking-widest text-[#8c7f6e] animate-bounce">
            <ChevronDown className="w-4 h-4" />
            Scroll down to rotate in 3D
          </div>
        </div>

        {/* ========================================================
            STAGE 2: 360° AXIAL ROTATION INSPECTION
        ======================================================== */}
        <div
          ref={stage2Ref}
          className="absolute inset-0 flex flex-col items-center justify-center px-6 z-10 pointer-events-none opacity-0 invisible"
        >
          <div className="text-center space-y-2 mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f0e8d9] border border-[#e4d7bf] text-[#6d5e4b] text-xs uppercase tracking-widest font-medium">
              <RotateCw className="w-3.5 h-3.5 text-[#9e5d26]" /> 360° Axial
              Inspection
            </div>
            <h2 className="font-serif text-4xl md:text-5xl text-[#2b241e]">
              Seamless Form & Profile
            </h2>
            <p className="text-sm text-[#736657]">
              Current Perspective:{" "}
              <span className="font-medium text-[#2c2724]">
                {ROTATION_VIEWS[rotationIndex].angle}
              </span>
            </p>
          </div>

          {/* Dynamic 360 Image View */}
          <div className="relative flex flex-col items-center justify-center min-h-[380px]">
            <div
              className={`relative ${ROTATION_VIEWS[rotationIndex].aspect} transition-all duration-300 ease-out`}
            >
              <Image
                src={ROTATION_VIEWS[rotationIndex].image}
                alt="3D View Angle"
                fill
                priority
                className="object-contain drop-shadow-[0_25px_30px_rgba(50,40,30,0.18)]"
              />
            </div>
            {/* Synchronized floor shadow */}
            <div className="w-[420px] h-6 -mt-2 bg-radial from-[#3c3022]/25 via-[#3c3022]/08 to-transparent rounded-full blur-[8px]" />
          </div>

          {/* Angle Thumbnails */}
          <div className="mt-6 flex items-center gap-3 bg-[#f3ede1]/90 backdrop-blur-sm p-1.5 rounded-full border border-[#ded4bf]">
            {ROTATION_VIEWS.map((v, i) => (
              <button
                key={v.angle}
                onClick={() => setRotationIndex(i)}
                className={`px-3 py-1 text-xs rounded-full transition-all ${
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
          className="absolute inset-0 flex flex-col items-center justify-center px-6 z-10 pointer-events-none opacity-0 invisible"
        >
          <div className="text-center space-y-2 mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f0e8d9] border border-[#e4d7bf] text-[#6d5e4b] text-xs uppercase tracking-widest font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#b07b46]" /> Botanical &
              Mineral Dyes
            </div>
            <h2 className="font-serif text-4xl md:text-5xl text-[#2b241e]">
              Four Earthbound Hues
            </h2>
            <p className="max-w-md mx-auto text-sm text-[#736657]">
              {COLORWAYS[activeColorway].description}
            </p>
          </div>

          {/* Slipper with Colorway applied */}
          <div className="relative flex flex-col items-center">
            <div className="relative w-[580px] h-[240px] md:w-[680px] md:h-[280px]">
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
                    className="object-contain drop-shadow-[0_25px_30px_rgba(50,40,30,0.16)]"
                  />
                </div>
              ))}
            </div>
            <div className="w-[460px] h-6 -mt-2 bg-radial from-[#3c3022]/25 via-[#3c3022]/10 to-transparent rounded-full blur-[7px]" />
          </div>

          {/* Interactive Color Swatches */}
          <div className="mt-8 flex items-center gap-4 bg-[#f3ede1]/90 backdrop-blur-sm px-5 py-3 rounded-full border border-[#ded4bf] shadow-sm z-30 pointer-events-auto">
            {COLORWAYS.map((c, i) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setActiveColorway(i)}
                className={`group flex items-center gap-2.5 px-4 py-2 rounded-full cursor-pointer transition-all ${
                  activeColorway === i
                    ? "bg-[#2c2724] text-[#fbf9f5] shadow-sm scale-105"
                    : "hover:bg-[#e9dfcc] text-[#6e6150] hover:scale-102"
                }`}
              >
                <span
                  className="w-4 h-4 rounded-full border border-black/15 shadow-inner"
                  style={{ backgroundColor: c.cssCode }}
                />
                <span className="text-xs font-medium tracking-wide">
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
          className="absolute inset-0 flex flex-col items-center justify-center px-6 z-10 pointer-events-none opacity-0 invisible"
        >
          <div className="text-center space-y-2 mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f0e8d9] border border-[#e4d7bf] text-[#6d5e4b] text-xs uppercase tracking-widest font-medium">
              <Layers className="w-3.5 h-3.5 text-[#a85f26]" /> Structural
              Anatomy
            </div>
            <h2 className="font-serif text-4xl md:text-5xl text-[#2b241e]">
              Exploded Master Craftsmanship
            </h2>
            <p className="text-sm text-[#736657]">
              Three authentic layers seamlessly engineered without chemical glues.
            </p>
          </div>

          {/* Craft Stage Container */}
          <div className="relative w-[680px] h-[480px] flex items-center justify-center">
            
            {/* Fully Assembled Slipper (Shown when closed before explosion & after shrinking) */}
            <div
              ref={assembledShoeRef}
              className="absolute w-[560px] h-[240px] md:w-[620px] md:h-[260px] flex items-center justify-center z-40 transition-transform"
            >
              <Image
                src="/brand/slipper_side.png"
                alt="Seamless Hand-Felted Wool Slipper"
                fill
                priority
                className="object-contain drop-shadow-[0_20px_25px_rgba(50,40,30,0.16)]"
              />
            </div>

            {/* Exploded Stack (Active during open inspection) */}
            <div
              ref={explodedStackRef}
              className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 invisible"
            >
              {/* Layer 1: Wool Upper (Top) */}
              <div
                ref={layerUpperRef}
                className="absolute top-4 w-[620px] h-[200px] flex flex-col items-center justify-center transition-transform z-30"
              >
                <div className="relative w-full h-full">
                  <Image
                    src="/brand/crafted_upper.png"
                    alt="Seamless Wool Upper"
                    fill
                    className="object-contain drop-shadow-[0_15px_20px_rgba(40,30,20,0.15)]"
                  />
                </div>
                <div className="absolute right-2 -top-1 bg-[#2c2724] text-white text-[11px] px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1.5 z-20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d2a36d]" />
                  1. Seamless Wet-Felted Wool Upper
                </div>
              </div>

              {/* Layer 2: Ergonomic Midsole Footbed (Middle) */}
              <div
                ref={layerFootbedRef}
                className="absolute top-[175px] w-[600px] h-[120px] flex flex-col items-center justify-center transition-transform z-20"
              >
                <div className="relative w-full h-full">
                  <Image
                    src="/brand/crafted_insole.png"
                    alt="Cushioned Wool Insole Footbed"
                    fill
                    className="object-contain drop-shadow-[0_12px_18px_rgba(40,30,20,0.14)]"
                  />
                </div>
                <div className="absolute left-2 top-1/2 -translate-y-1/2 bg-[#2c2724] text-white text-[11px] px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1.5 z-20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9bb08e]" />
                  2. Cushioned Wool Insole Footbed
                </div>
              </div>

              {/* Layer 3: Crepe Rubber Outsole (Bottom) */}
              <div
                ref={layerSoleRef}
                className="absolute bottom-12 w-[620px] h-[140px] flex flex-col items-center justify-center transition-transform z-10"
              >
                <div className="relative w-full h-full">
                  <Image
                    src="/brand/crafted_sole.png"
                    alt="Honey Crepe Rubber Sole"
                    fill
                    className="object-contain drop-shadow-[0_20px_25px_rgba(40,30,20,0.2)]"
                  />
                </div>
                <div className="absolute right-2 -bottom-2 bg-[#2c2724] text-white text-[11px] px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1.5 z-20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f3bc6f]" />
                  3. Heavy-Duty Honey Crepe Rubber Outsole
                </div>
              </div>
            </div>

            {/* Dynamic Ground Shadow */}
            <div
              ref={shadowRef}
              className="absolute bottom-4 w-[480px] h-8 bg-radial from-[#3c3022]/30 via-[#3c3022]/10 to-transparent rounded-full blur-[9px]"
            />
          </div>
        </div>

        {/* ========================================================
            STAGE 5: ANATOMICAL FEATURE FOCUS
        ======================================================== */}
        <div
          ref={stage5Ref}
          className="absolute inset-0 flex flex-col items-center justify-center px-6 z-10 pointer-events-none opacity-0 invisible"
        >
          <div className="max-w-4xl grid md:grid-cols-2 gap-12 items-center">
            {/* Slipper Upright & Profile Angle */}
            <div className="relative flex flex-col items-center">
              <div className="relative w-[380px] h-[340px] md:w-[460px] md:h-[400px]">
                <Image
                  src="/brand/slipper_profile.png"
                  alt="Artisan Detail Perspective"
                  fill
                  className="object-contain drop-shadow-[0_25px_35px_rgba(50,40,30,0.18)]"
                />
              </div>
              <div className="w-[360px] h-6 -mt-2 bg-radial from-[#3c3022]/25 via-[#3c3022]/10 to-transparent rounded-full blur-[8px]" />
            </div>

            {/* Feature Cards */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f0e8d9] border border-[#e4d7bf] text-[#6d5e4b] text-xs uppercase tracking-widest font-medium">
                <Compass className="w-3.5 h-3.5 text-[#9e5d26]" /> Designed for
                Everyday Life
              </div>
              <h2 className="font-serif text-4xl text-[#2b241e]">
                Temperature Regulating, Odor-Resistant Comfort
              </h2>

              <div className="space-y-4 text-sm">
                <div className="p-4 rounded-xl bg-[#f4ede0] border border-[#e5d9c2]">
                  <div className="font-medium text-[#2c2724] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#9e5d26]" />
                    Zero Friction Rolled Collar
                  </div>
                  <p className="text-xs text-[#736657] mt-1 leading-relaxed">
                    A gently rolled felt ankle opening allows effortless slip-on
                    convenience while cradling your heel securely.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#f4ede0] border border-[#e5d9c2]">
                  <div className="font-medium text-[#2c2724] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#9e5d26]" />
                    Natural Crepe Rubber Grip
                  </div>
                  <p className="text-xs text-[#736657] mt-1 leading-relaxed">
                    Sourced from sustainably tapped Hevea trees. Silent, flexible,
                    and safe on polished wood, stone, and morning patio tiles.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#f4ede0] border border-[#e5d9c2]">
                  <div className="font-medium text-[#2c2724] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#9e5d26]" />
                    Naturally Breathable Lanolin
                  </div>
                  <p className="text-xs text-[#736657] mt-1 leading-relaxed">
                    Tibetan sheep wool wicks perspiration away instantaneously,
                    keeping your feet warm in winter and cool in spring.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            STAGE 6: REASSEMBLY & DIRECT PURCHASE CTA
        ======================================================== */}
        <div
          ref={stage6Ref}
          className="absolute inset-0 flex flex-col items-center justify-center px-6 z-10 pointer-events-none opacity-0 invisible"
        >
          <div className="max-w-xl text-center space-y-4 mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f0e8d9] border border-[#e4d7bf] text-[#6d5e4b] text-xs uppercase tracking-widest font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#9e5d26]" /> Ready for Your
              Home
            </div>
            <h2 className="font-serif text-4xl md:text-5xl text-[#2b241e]">
              Step Into Pure Himalayan Warmth
            </h2>
            <p className="text-sm text-[#736657]">
              Every pair is numbered and certified by our women artisan cooperative
              in Nepal.
            </p>
          </div>

          {/* Slipper Reassembled Display */}
          <div className="relative flex flex-col items-center mb-6">
            <div className="relative w-[540px] h-[220px] md:w-[620px] md:h-[260px] transition-transform duration-500 hover:scale-105">
              <Image
                src={COLORWAYS[activeColorway].image}
                alt="Finished Slipper"
                fill
                priority
                className="object-contain drop-shadow-[0_25px_30px_rgba(50,40,30,0.18)]"
              />
            </div>
            <div className="w-[440px] h-6 -mt-2 bg-radial from-[#3c3022]/25 via-[#3c3022]/10 to-transparent rounded-full blur-[8px]" />
          </div>

          {/* Direct CTA card */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#f3ede1]/95 backdrop-blur-md p-3 px-6 rounded-2xl border border-[#ded4bf] shadow-lg">
            <div className="text-center sm:text-left">
              <div className="font-serif text-lg text-[#2b241e]">
                {heroProduct.name}
              </div>
              <div className="text-xs text-[#706454]">
                {COLORWAYS[activeColorway].name} · Size EU 41
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-serif text-xl font-medium text-[#2b241e]">
                {formatPrice(heroProduct.price)}
              </span>
              <Button
                onClick={handleAddToCart}
                className="bg-[#2c2724] text-[#fbf9f5] hover:bg-[#3d3732] rounded-full px-6 h-11 text-sm font-medium tracking-wide shadow-md"
              >
                {isAddedToCart ? (
                  <span className="flex items-center gap-2 text-emerald-300">
                    <Check className="w-4 h-4" /> Added to Cart!
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4" /> Add to Cart
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
