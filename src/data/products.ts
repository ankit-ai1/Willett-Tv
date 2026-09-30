export type ScreenArt =
  | 'aurora'
  | 'sunset'
  | 'ocean'
  | 'rose'
  | 'forest'
  | 'nebula'
  | 'dunes'
  | 'glacier'
  | 'lagoon'
  | 'ember';

export type Series = 'Willett' | 'Eagle';

export interface Product {
  slug: string;
  name: string;
  series: Series;
  size: number; // inches
  smart: boolean;
  price: number | null; // null = price on request
  art: ScreenArt;
  headline: string;
}

export const PRODUCTS: Product[] = [
  { slug: 'willett-24', name: 'Willett 24"', series: 'Willett', size: 24, smart: false, price: 11999, art: 'forest', headline: 'Compact brilliance for bedrooms and kitchens.' },
  { slug: 'willett-32', name: 'Willett 32"', series: 'Willett', size: 32, smart: false, price: 19500, art: 'glacier', headline: 'The everyday screen, engineered to last.' },
  { slug: 'willett-32-smart', name: 'Willett 32" Smart', series: 'Willett', size: 32, smart: true, price: 22999, art: 'aurora', headline: 'Smart streaming with dual-band Wi-Fi.' },
  { slug: 'willett-38-5', name: 'Willett 38.5"', series: 'Willett', size: 38.5, smart: false, price: 34000, art: 'dunes', headline: 'A little bigger. A lot more immersive.' },
  { slug: 'willett-43', name: 'Willett 43"', series: 'Willett', size: 43, smart: false, price: 39990, art: 'lagoon', headline: 'Living-room cinema with Pro-Audio sound.' },
  { slug: 'willett-50', name: 'Willett 50"', series: 'Willett', size: 50, smart: false, price: 49990, art: 'sunset', headline: 'Big-screen drama for the whole family.' },
  { slug: 'willett-55', name: 'Willett 55"', series: 'Willett', size: 55, smart: false, price: 59990, art: 'rose', headline: 'Our flagship. Colour that stops you mid-scroll.' },
  { slug: 'eagle-24', name: 'Eagle 24"', series: 'Eagle', size: 24, smart: false, price: null, art: 'ember', headline: 'Eagle series — sharp, simple, dependable.' },
  { slug: 'eagle-32', name: 'Eagle 32"', series: 'Eagle', size: 32, smart: false, price: null, art: 'glacier', headline: 'Eagle series in the most-loved size.' },
  { slug: 'eagle-32-smart', name: 'Eagle 32" Smart', series: 'Eagle', size: 32, smart: true, price: null, art: 'nebula', headline: 'Eagle goes smart — apps, Wi-Fi, Bluetooth.' },
  { slug: 'eagle-38-5', name: 'Eagle 38.5"', series: 'Eagle', size: 38.5, smart: false, price: null, art: 'forest', headline: 'Room-filling picture from the Eagle line.' },
  { slug: 'eagle-smart-38-5', name: 'Eagle Smart 38.5"', series: 'Eagle', size: 38.5, smart: true, price: null, art: 'ocean', headline: 'The biggest smart Eagle yet.' },
];

export const formatINR = (n: number) => '₹' + n.toLocaleString('en-IN');

export const priceLabel = (p: Product) => (p.price === null ? 'Price on request' : formatINR(p.price));

export const getProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug);

/** Features taken from the current willett.in site. Smart-only items flagged. */
export const specsFor = (p: Product) => {
  const base = [
    { label: 'Screen size', value: `${p.size} inches` },
    { label: 'Type', value: p.smart ? 'Smart LED TV' : 'LED TV' },
    { label: 'Audio', value: 'Pro-Audio high power speakers' },
    { label: 'Picture', value: 'Active Image enhancement' },
    { label: 'Ports', value: 'HDMI (ARC) + 2× HDMI, USB 3.0, USB 2.0, AV in, S/PDIF, Antenna' },
    { label: 'Mounting', value: 'Table top & wall mount' },
    { label: 'Warranty', value: '36 months' },
  ];
  if (p.smart) {
    base.splice(2, 0,
      { label: 'Wi-Fi', value: 'Dual band 2.4 GHz / 5 GHz' },
      { label: 'Bluetooth', value: '4.2 Low Energy' },
      { label: 'Network', value: 'LAN port' },
    );
  }
  return base;
};
