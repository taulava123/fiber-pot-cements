// ============================================================
// SITE SETTINGS — edit this file to change your business info.
// After editing, redeploy to Vercel (or ask me to re-save).
// ============================================================

export const siteConfig = {
  brandName: "Fiber Pot Cements",
  tagline: "Handcrafted fiber cement pots, built to last",

  // Currency symbol shown next to all prices
  currency: "₱",

  // Contact — used for the inquiry buttons and the contact section.
  // WhatsApp: country code + number, digits only (e.g. 639171234567)
  whatsappNumber: "639171234567",
  // Facebook page username for Messenger (facebook.com/yourpage → "yourpage")
  messengerPage: "yourpage",
  phoneDisplay: "+63 917 123 4567",
  email: "hello@example.com",
  address: "Your shop address here",

  // Social / map links (optional — leave "" to hide)
  facebookUrl: "https://facebook.com/yourpage",
  instagramUrl: "",
  googleMapsUrl: "",

  // SECURITY: list the email addresses allowed into the admin panel, e.g.
  // adminEmails: ["you@gmail.com"],
  // Leave empty to allow any logged-in user (then make sure sign-ups are
  // disabled in Supabase → Authentication → Sign In / Providers).
  adminEmails: [] as string[],
};

export function whatsappLink(message: string) {
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function messengerLink(message: string) {
  return `https://m.me/${siteConfig.messengerPage}?text=${encodeURIComponent(message)}`;
}

export function formatPrice(value: number) {
  return `${siteConfig.currency}${value.toLocaleString("en-PH", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}
