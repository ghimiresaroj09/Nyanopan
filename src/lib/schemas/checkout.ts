import { z } from "zod";

export const NEPAL_CITIES_AND_DISTRICTS = [
  "Kathmandu Inside Ring Road",
  "Kathmandu Outside Ring Road",
  "Lalitpur",
  "Bhaktapur",
  "Pokhara",
  "Biratnagar",
  "Dharan",
  "Itahari",
  "Butwal",
  "Birtamode",
  "Birganj",
  "Hetauda",
  "Narayanghat Bharatpur",
  "Achham",
  "Arghakhanchi",
  "Baglung",
  "Baitadi",
  "Bajhang",
  "Bajura",
  "Banke",
  "Bara",
  "Bardiya",
  "Bhojpur",
  "Chitwan",
  "Dadeldhura",
  "Dailekh",
  "Dang",
  "Darchula",
  "Dhading",
  "Dhankuta",
  "Dhanusha",
  "Dolakha",
  "Dolpa",
  "Doti",
  "Gorkha",
  "Gulmi",
  "Humla",
  "Ilam",
  "Jajarkot",
  "Jhapa",
  "Jumla",
  "Kailali",
  "Kalikot",
  "Kanchanpur",
  "Kapilvastu",
  "Kaski",
  "Kavrepalanchok",
  "Khotang",
  "Lamjung",
  "Mahottari",
  "Makwanpur",
  "Manang",
  "Morang",
  "Mugu",
  "Mustang",
  "Myagdi",
  "Nawalpur",
  "Nuwakot",
  "Okhaldhunga",
  "Palpa",
  "Panchthar",
  "Parasi",
  "Parbat",
  "Parsa",
  "Pyuthan",
  "Ramechhap",
  "Rasuwa",
  "Rautahat",
  "Rolpa",
  "Rukum East",
  "Rukum West",
  "Rupandehi",
  "Salyan",
  "Sankhuwasabha",
  "Saptari",
  "Sarlahi",
  "Sindhuli",
  "Sindhupalchok",
  "Siraha",
  "Solukhumbu",
  "Sunsari",
  "Surkhet",
  "Syangja",
  "Tanahun",
  "Taplejung",
  "Terhathum",
  "Udayapur",
  "Other",
] as const;

export type NepalCityOrDistrict = (typeof NEPAL_CITIES_AND_DISTRICTS)[number];

export const checkoutSchema = z.object({
  /* 1. General Information */
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters.")
    .max(80, "Full name cannot exceed 80 characters."),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .max(100, "Email cannot exceed 100 characters."),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number.")
    .max(20, "Phone number cannot exceed 20 characters."),
  alternatePhone: z
    .string()
    .trim()
    .max(20, "Alternate phone number cannot exceed 20 characters.")
    .optional()
    .or(z.literal("")),
  orderNote: z
    .string()
    .trim()
    .max(500, "Order note cannot exceed 500 characters.")
    .optional()
    .or(z.literal("")),

  /* 2. Company Information */
  companyName: z
    .string()
    .trim()
    .max(100, "Company name cannot exceed 100 characters.")
    .optional()
    .or(z.literal("")),
  panVatNumber: z
    .string()
    .trim()
    .max(30, "PAN/VAT number cannot exceed 30 characters.")
    .optional()
    .or(z.literal("")),

  /* 3. Delivery Address */
  cityOrDistrict: z.enum(NEPAL_CITIES_AND_DISTRICTS, {
    message: "Please select your city or district.",
  }),
  address: z
    .string()
    .trim()
    .min(5, "Address must be at least 5 characters.")
    .max(150, "Address cannot exceed 150 characters."),
  landmark: z
    .string()
    .trim()
    .max(100, "Landmark cannot exceed 100 characters.")
    .optional()
    .or(z.literal("")),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
