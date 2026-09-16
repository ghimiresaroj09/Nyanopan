import type { Maker } from "@/types/story";
import { images } from "@/data/images";

/**
 * The workshop team shown on the Our Story page.
 * Portraits are illustrative Unsplash photography.
 */
export const makers: Maker[] = [
  {
    name: "Gita Thapa",
    role: "Workshop lead",
    description:
      "Keeps the workshop running, from wool deliveries to final inspection.",
    image: images.makerNepalPortrait,
  },
  {
    name: "Sunita Gurung",
    role: "Felting",
    description:
      "Felted her first slipper at fourteen and has worked the felting table ever since.",
    image: images.makerKnitting,
  },
  {
    name: "Kamala Shrestha",
    role: "Wool preparation",
    description:
      "Washes and cards the raw wool before it reaches the felting table.",
    image: images.makerBallOfYarn,
  },
  {
    name: "Bina Tamang",
    role: "Felting",
    description:
      "Shapes wool into slippers using soap, water and steady hands.",
    image: images.makerKnittingBeige,
  },
  {
    name: "Anita Rai",
    role: "Stitching",
    description:
      "Stitches the maker's signature into every pair before it leaves the workshop.",
    image: images.makerSewingPurple,
  },
  {
    name: "Maya Magar",
    role: "Sole finishing",
    description:
      "Cuts and presses the leather and rubber soles onto the finished felt.",
    image: images.makerSewingGrey,
  },
  {
    name: "Puja Lama",
    role: "Shaping",
    description:
      "Works the wooden lasts, keeping every slipper true to its size.",
    image: images.makerKnittingGround,
  },
  {
    name: "Sita Adhikari",
    role: "Inspection",
    description:
      "Checks each pair for fit and finish before it is packed for shipping.",
    image: images.makerScissorsCloth,
  },
];
