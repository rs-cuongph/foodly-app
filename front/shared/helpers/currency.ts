function formatCurrency(num?: number, unit = "vnđ"): string {
  if (!num) return "0";

  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " " + unit;
}

export { formatCurrency };
