"use client";

const SAMPLE_PALETTE = [
  { name: "Deep Navy", hex: "#1B2A4A" },
  { name: "Warm Ivory", hex: "#F5F0E8" },
  { name: "Sage Green", hex: "#8B9E7F" },
  { name: "Terracotta", hex: "#C17A5A" },
  { name: "Charcoal", hex: "#3D3D3D" },
  { name: "Dusty Rose", hex: "#C9A0A0" },
];

const SAMPLE_CAPSULE = [
  { category: "Tops", items: ["White crew-neck tee", "Navy linen button-down", "Heather gray crewneck sweater", "Olive bomber jacket"] },
  { category: "Bottoms", items: ["Slim dark wash jeans", "Navy chinos", "Black joggers", "Tan shorts"] },
  { category: "Outerwear", items: ["Camel overcoat", "Black leather jacket", "Navy rain jacket"] },
  { category: "Shoes", items: ["White leather sneakers", "Brown Chelsea boots", "Navy loafers"] },
  { category: "Accessories", items: ["Silver watch", "Brown leather belt", "Navy weekender bag"] },
];

export default function StylePage() {
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold text-surface-900 mb-2">Fashion System</h1>
      <p className="text-surface-300 mb-8">Your personalized style archetype, color palette, and wardrobe guide.</p>

      <div className="rounded-xl bg-white p-6 shadow-sm mb-6">
        <h2 className="text-lg font-semibold mb-3">Style Archetype</h2>
        <div className="flex gap-3 mb-4">
          <span className="rounded-full bg-brand-100 px-3 py-1 text-sm font-medium text-brand-700">Minimalist (60%)</span>
          <span className="rounded-full bg-cosmic-100 px-3 py-1 text-sm font-medium text-cosmic-700">Classic (30%)</span>
          <span className="rounded-full bg-surface-100 px-3 py-1 text-sm font-medium text-surface-700">Streetwear (10%)</span>
        </div>
        <p className="text-sm text-surface-700">
          Your style leans heavily minimalist with clean lines and neutral tones, grounded by classic tailoring sensibilities.
          A touch of streetwear influence keeps things modern and approachable.
        </p>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm mb-6">
        <h2 className="text-lg font-semibold mb-4">Your Color Palette</h2>
        <p className="text-sm text-surface-300 mb-1">Recommended metal: Silver</p>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-4">
          {SAMPLE_PALETTE.map((color) => (
            <div key={color.hex} className="text-center">
              <div
                className="h-16 w-full rounded-lg shadow-inner mb-2"
                style={{ backgroundColor: color.hex }}
              />
              <div className="text-xs font-medium text-surface-700">{color.name}</div>
              <div className="text-xs text-surface-300">{color.hex}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm mb-6">
        <h2 className="text-lg font-semibold mb-4">Capsule Wardrobe</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SAMPLE_CAPSULE.map((cat) => (
            <div key={cat.category} className="rounded-lg bg-surface-50 p-4">
              <h3 className="text-sm font-semibold text-surface-900 mb-2">{cat.category}</h3>
              <ul className="space-y-1">
                {cat.items.map((item) => (
                  <li key={item} className="text-sm text-surface-700 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Outfit Pairings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { occasion: "Casual", outfit: "White tee + dark wash jeans + white sneakers + silver watch" },
            { occasion: "Date Night", outfit: "Navy button-down + black joggers (tapered) + brown Chelsea boots + leather belt" },
            { occasion: "Work", outfit: "Gray sweater + navy chinos + navy loafers + silver watch" },
            { occasion: "Event", outfit: "Black leather jacket + white tee + slim jeans + Chelsea boots" },
          ].map((o) => (
            <div key={o.occasion} className="rounded-lg border border-surface-200 p-4">
              <div className="text-sm font-semibold text-brand-600 mb-1">{o.occasion}</div>
              <p className="text-sm text-surface-700">{o.outfit}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
