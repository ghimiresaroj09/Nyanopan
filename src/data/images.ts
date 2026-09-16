/**
 * Central image registry. Every photograph comes from Unsplash
 * (Unsplash License, free to use). IDs were verified against
 * images.unsplash.com at build time.
 */

export function unsplash(id: string, width = 1200, quality = 80): string {
  return `https://images.unsplash.com/photo-${id}?w=${width}&q=${quality}&auto=format&fit=crop`;
}

export const images = {
  /* Product photography: felt slippers on a white background. */
  slipperGreyLeather: unsplash("1746516355540-f12e60b69a8d"),
  slipperGrey: unsplash("1746516355553-bfd558f9d485"),
  slipperGreyBeige: unsplash("1746516355499-ae180c3e701e"),
  slipperBlue: unsplash("1746516355535-83592a6c53b3"),
  slipperGreen: unsplash("1746516355508-703108c72720"),
  slipperPink: unsplash("1746516355506-9cf831e45a82"),
  slipperMauve: unsplash("1746516355531-0ceb52b6ec1c"),

  /* Lifestyle. */
  feetInSlippers: unsplash("1650307535558-fa2b39ed16eb"),
  bedroomSlippers: unsplash("1543420629-5350879dd4cd"),
  slideSandals: unsplash("1603487742131-4160ec999306"),
  slipOnShoes: unsplash("1603218183500-7e1d62c3c679"),
  slippersOnChair: unsplash("1603218162086-fba879e8c17a"),
  sofaShoes: unsplash("1603218196423-da6ee214f4cc"),
  shoesOnGround: unsplash("1639401226901-362b0438d5b6"),
  pileOfSlippers: unsplash("1678581703612-f870dfa49229"),
  hangingSlippers: unsplash("1768701302712-d730fe0251d8"),
  embroideredSlippers: unsplash("1782304986390-a12d65b74d2f"),

  /* Kids and baby. */
  pinkKnitShoes: unsplash("1513091250092-b06c2b7981bc"),
  pinkShoesBench: unsplash("1497319892902-e0a47680bb6b"),
  blueShoesBed: unsplash("1678192569393-c7aff066e5bd"),
  babyWhiteKnit: unsplash("1617204360640-d4a2508c0243"),
  polkaFlipFlops: unsplash("1594150878496-a921e5af8907"),

  /* Wool, craft and production. */
  yarnTable: unsplash("1618574760337-2750f6251d20"),
  textilesColourful: unsplash("1550376026-7375b92bb318"),
  yarnWoodenTable: unsplash("1604095879468-03fd4a4afaf2"),
  yarnRedBlue: unsplash("1595341595379-cf1cb694ea1f"),

  /* Sheep and origin. */
  sheepGreenGrass: unsplash("1484557985045-edf25e08da73"),
  sheepGrasses: unsplash("1533415648777-407b626eb0fa"),
  sheepHerd: unsplash("1602027438676-ad64751bdbc1"),
  sheepMacro: unsplash("1570964251416-6ae7f9b8db47"),

  /* Nepal. */
  prayerFlags: unsplash("1544735716-392fe2489ffa"),

  /* Makers: craft portraits shown on the Our Story page. */
  makerKnitting: unsplash("1632649027900-389e810204e6"),
  makerKnittingBeige: unsplash("1541944743827-e04aa6427c33"),
  makerSewingPurple: unsplash("1519412849983-957822373d02"),
  makerKnittingGround: unsplash("1702534246793-42a5365369bc"),
  makerScissorsCloth: unsplash("1718995343476-73098cf9dfec"),
  makerSewingGrey: unsplash("1606501126768-b78d4569d3f9"),
  makerBallOfYarn: unsplash("1695883447569-80abcd3030c0"),
  makerNepalPortrait: unsplash("1533128361669-69c065857a13"),
} as const;

export type ImageKey = keyof typeof images;
