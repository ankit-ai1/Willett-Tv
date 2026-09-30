export const SITE = {
  brand: 'Willett',
  company: 'STB Technologies Pvt Ltd',
  tagline: 'Experience Reality Beyond Imagination',
  taglineHindi: 'भारत में निर्मित, भारत का अपना TV',
  phones: ['8285303030', '9318380083'],
  warrantyMonths: 36,
  socials: {
    facebook: 'https://www.facebook.com/willettofficial',
    twitter: 'https://twitter.com/willettcable',
    linkedin: 'https://www.linkedin.com/company/willett/',
    instagram: 'https://www.instagram.com/willett_ledtv/',
  },
  marketplaces: ['Amazon', 'Paytm', 'Snapdeal'],
} as const;

export const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/products', label: 'Products' },
  { to: '/support', label: 'Support' },
  { to: '/installation', label: 'Installation' },
  { to: '/contact', label: 'Contact' },
] as const;

export const telHref = (p: string) => `tel:+91${p}`;
export const formatPhone = (p: string) => `+91 ${p.slice(0, 5)} ${p.slice(5)}`;
