// Edit this file to update clinic details everywhere on the site.

export const clinic = {
  name: "Jeevak Clinic",
  hindiName: "जीवक क्लीनिक",
  tagline: "Quality Healthcare & In-Clinic Specialists Since 2003",
  currency: "INR",
  upiId: "jeevak.clinic03@upi",
  payeeName: "Jeevak Clinic",
  branches: [
    {
      id: "main",
      label: "Main Clinic - Meethapur",
      address: "C-04, Shakti Vihar, Gali No.-6, off School Road, Meethapur, Badarpur, New Delhi-110044",
      phone: "011 45680306",
      email: "jeevak.clinic03@gmail.com",
      emergency: "",
      empanelment: "On Panel: LIC & Cabinet Secretariat",
      hours: [
        { days: "Mon - Thu & Sat", time: "11:30 AM - 2:00 PM & 6:30 PM - 8:30 PM" },
        { days: "Friday", time: "11:30 AM - 2:00 PM (Evening Closed)" },
        { days: "Sunday", time: "Closed" }
      ],
      mapQuery: "Jeevak Clinic, C-04, Shakti Vihar, Meethapur, Badarpur, New Delhi-110044"
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
    pn: isPlaceholder(name) ? 'Jeevak Clinic' : name,
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
