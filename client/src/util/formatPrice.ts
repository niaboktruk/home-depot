function formatPrice(priceInCents: number | undefined): string {
    if (!priceInCents) {
      return "-";
    }
  
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(priceInCents / 100);
  }
  
  export default formatPrice;