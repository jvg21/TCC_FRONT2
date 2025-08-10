export const light = {
  colors: {
    background: "#f6f8fb",
    surface: "#ffffff",
    primary: "#2563eb",
    danger: "#ef4444",
    text: "#0f172a",
    muted: "#64748b"
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px"
  },
  borderRadius: "8px"
};

export const dark = {
  colors: {
    background: "#0b1220",
    surface: "#0f1724",
    primary: "#4f46e5",
    danger: "#f97316",
    text: "#e6eef8",
    muted: "#9aa7bf"
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px"
  },
  borderRadius: "8px"
};

export type Theme = typeof light;
