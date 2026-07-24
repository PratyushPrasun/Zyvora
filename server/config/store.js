/**
 * Centralized store configuration.
 *
 * All store-level information is sourced from environment variables
 * with sensible defaults. Update .env to customize.
 *
 * Future: Can be extended for GST/Tax registration, multi-store, etc.
 */
const storeConfig = {
    name: process.env.STORE_NAME || "Zyvora",
    email: process.env.STORE_EMAIL || "contact@zyvora.com",
    phone: process.env.STORE_PHONE || "+91 98765 43210",
    address: process.env.STORE_ADDRESS || "Mumbai, Maharashtra, India",
    supportEmail: process.env.STORE_SUPPORT_EMAIL || "support@zyvora.com",
    website: process.env.STORE_WEBSITE || "https://zyvora.com",
    logoUrl: process.env.STORE_LOGO_URL || "",
    currency: "INR",
    currencySymbol: "₹",
};

export default storeConfig;
