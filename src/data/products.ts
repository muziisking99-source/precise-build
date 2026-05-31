import type { ComponentType } from "react";
import { SupaDupa, GingerMan, LuvALotGirl, AllStarFootballer, JokerHat } from "../components/Characters";

export type Product = { name: string; desc: string; color: string };

export type ProductRange = {
  key: string;
  name: string;
  accent: string;
  desc: string;
  Mascot?: ComponentType<{ size?: number }>;
  products: Product[];
};

export const SINGLE_RANGES: ProductRange[] = [
  {
    key: "glucose", name: "Glucose Energy", accent: "#FFF200",
    desc: "South Africa's lunchbox legend. Pure, honest energy in every pack.",
    products: [
      { name: "Glucose Energy", desc: "Classic yellow box. Super Energy Glucose Biscuits, Milk & Honey variant. 48 pkts.", color: "#FFF200" },
      { name: "Super Energy Glucose", desc: "Red box. Super Energy Glucose Biscuits.", color: "#ED1C24" },
      { name: "Supa Dupa Glucose", desc: "Red sunburst box. Glucose Energy Biscuits, 48's.", color: "#F04449" },
    ],
  },
  {
    key: "ginger", name: "Just Ginger", accent: "#1A4B8C", Mascot: GingerMan,
    desc: "Warm, spicy ginger biscuits with real heritage. Hawker line favourite.",
    products: [
      { name: "Just Ginger", desc: "Blue hawker line box (48 × 5pcs). Orange bag variant. Enriched Energy Biscuits.", color: "#8C6239" },
    ],
  },
  {
    key: "luvalot", name: "Luv-A-Lot", accent: "#D4237A", Mascot: LuvALotGirl,
    desc: "High Energy Biscuits. Super Energy for School. A schoolbag essential.",
    products: [
      { name: "Luv-A-Lot", desc: "Pink hawker line box (48 × 5pcs). Pink bag variant. High Energy Biscuits.", color: "#D4237A" },
    ],
  },
  {
    key: "trio", name: "Trio", accent: "#6B3A2A",
    desc: "Three flavours, one cream-filled bite. Triple-stacked indulgence.",
    products: [
      { name: "Trio Chocolate", desc: "Brown box. Chocolate Cream Biscuits.", color: "#6B3A2A" },
      { name: "Trio Peanut Butter", desc: "Gold/orange box. Peanut Butter Cream Biscuits.", color: "#C59B6D" },
      { name: "Trio Strawberry", desc: "Pink/red box. Strawberry Cream Biscuits.", color: "#F04449" },
      { name: "Trio Choc & Vanilla", desc: "Purple box. Chocolate and Vanilla Cream Biscuits.", color: "#5B3A8C" },
    ],
  },
  {
    key: "allstar", name: "All-Star", accent: "#ED1C24", Mascot: AllStarFootballer,
    desc: "Cream-filled goals. The MVP of cream biscuits across South Africa.",
    products: [
      { name: "All-Star Vanilla", desc: "Blue box. Vanilla Cream Biscuits.", color: "#1A4B8C" },
      { name: "All-Star Chocolate", desc: "Brown/terracotta box. Chocolate Cream Biscuits.", color: "#6B3A2A" },
      { name: "All-Star Choc Vanilla", desc: "Purple box. Choc Vanilla Cream Biscuits.", color: "#5B3A8C" },
      { name: "All-Star Choc Mint", desc: "Green box. Choc Mint Cream Biscuits.", color: "#00A651" },
      { name: "All-Star Strawberry", desc: "Pink box. Strawberry Cream Biscuits.", color: "#D4237A" },
    ],
  },
  {
    key: "joker", name: "Joker", accent: "#00A651", Mascot: JokerHat,
    desc: "Three colours, one cheeky grin. Cream biscuits with playful flair.",
    products: [
      { name: "Joker Chocolate", desc: "Chocolate Flavoured Cream Biscuits.", color: "#6B3A2A" },
      { name: "Joker Strawberry", desc: "Pink box. Strawberry Flavoured Cream Biscuits. 48 × 30g.", color: "#D4237A" },
      { name: "Joker Mint", desc: "Green box. Chocolate Mint Flavoured. 48 × 30g.", color: "#00A651" },
    ],
  },
  {
    key: "marie", name: "Marie", accent: "#1A4B8C",
    desc: "The classic. The original. The biscuit that started a tea-time tradition.",
    products: [
      { name: "Marie Biscuit", desc: "Blue box. The Original Marie Biscuit. 12 × 150g.", color: "#1A4B8C" },
    ],
  },
  {
    key: "cream", name: "Cream Biscuits", accent: "#C59B6D",
    desc: "Single packs, fully loaded with cream. Everyday flavour, everyday lekker.",
    products: [
      { name: "Lemon Cream Biscuit", desc: "Red/yellow pack. Original Lemon Cream Biscuits. 150g.", color: "#FFF200" },
      { name: "Vanilla Cream Biscuit", desc: "Blue/yellow pack. Original Vanilla Cream Biscuits. 150g.", color: "#1A4B8C" },
      { name: "Chocmint Cream Biscuit", desc: "Green/red pack. Original Chocmint Cream Biscuits. 140g.", color: "#00A651" },
      { name: "Chocolate Cream", desc: "Brown bag. Chocolate Cream Filled Flavoured Biscuits.", color: "#6B3A2A" },
      { name: "Lemon Cream Bag", desc: "Yellow/blue bag. Lemon Cream Filled Flavoured Biscuits.", color: "#FFF766" },
      { name: "Choc Chip Biscuits", desc: "Loaded with real chocolate chips.", color: "#5C2F1B" },
    ],
  },
  {
    key: "supadupa", name: "Supa Dupa", accent: "#ED1C24", Mascot: SupaDupa,
    desc: "Caped crusader of energy. Sunburst pack, superhero power.",
    products: [
      { name: "Supa Dupa Glucose", desc: "Red sunburst hawker line box. 48's. Glucose Energy Biscuits.", color: "#ED1C24" },
    ],
  },
];

export type BulkProduct = {
  name: string;
  color: string;
  Mascot?: ComponentType<{ size?: number }>;
};

export const BULK_PRODUCTS: BulkProduct[] = [
  { name: "Short bread", color: "#C59B6D" },
  { name: "Choc chip biscuits", color: "#5C2F1B" },
  { name: "Vanilla creams", color: "#1A4B8C" },
  { name: "Lemon creams", color: "#FFF200" },
  { name: "Chocolate creams", color: "#6B3A2A" },
  { name: "Just ginger", color: "#8C6239", Mascot: GingerMan },
  { name: "Luv-a-lot", color: "#D4237A", Mascot: LuvALotGirl },
];
