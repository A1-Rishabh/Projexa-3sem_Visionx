// Edit this file to update clinic details everywhere on the site.

export const clinic = {
  name: "Jivaka Clinic",
  tagline: "Holistic Medical Care & Trusted In-Clinic Specialists",
  currency: "INR",
  upiId: "[clinic UPI ID, e.g. name@bank]",
  payeeName: "[Payee name]",
  branches: [
    {
      id: "main",
      label: "[Main branch]",
      address: "[Street address, City, State, PIN]",
      phone: "[Phone number]",
      email: "[Email]",
      emergency: "[Emergency number]",
      hours: [
        { days: "[Mon-Sat]", time: "[9:00 AM - 6:00 PM]" },
        { days: "[Sunday]", time: "[Closed]" }
      ],
      mapQuery: "[Address or clinic name for Google Maps]"
    }
  ]
};

/**
 * Checks whether a configured clinic value is still a placeholder like "[Phone number]".
 */
export const isPlaceholder = (val) => {
  if (!val || typeof val !== 'string') return true;
  const trimmed = val.trim();
  return trimmed.startsWith('[') && trimmed.endsWith(']');
};

/**
 * Single source of truth for Indian Rupee formatting.
 * Formats a number to ₹ with Indian grouping and no decimal places.
 */
export const formatINR = (amount) => {
  const numericAmount = Number(amount) || 0;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: clinic.currency || "INR",
    maximumFractionDigits: 0
  }).format(numericAmount);
};

/**
 * Generates Google Maps embed URL from mapQuery
 */
export const getMapEmbedUrl = (query) => {
  if (!query || isPlaceholder(query)) return null;
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
};

/**
 * Generates Google Maps directions link for external navigation
 */
export const getDirectionsUrl = (query) => {
  if (!query || isPlaceholder(query)) return '#';
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
};

/**
 * Builds standard UPI payment deep-link
 */
export const buildUpiDeepLink = ({ upiId, payeeName, amount, note = 'Clinic Consultation', txnId = '' }) => {
  const vpa = upiId || clinic.upiId;
  const name = payeeName || clinic.payeeName;
  if (!vpa || isPlaceholder(vpa)) return null;

  const params = new URLSearchParams({
    pa: vpa,
    pn: isPlaceholder(name) ? 'Jivaka Clinic' : name,
    am: String(amount || 0),
    cu: 'INR',
    tn: note
  });

  if (txnId) {
    params.set('tr', txnId);
  }

  return `upi://pay?${params.toString()}`;
};

export default clinic;

