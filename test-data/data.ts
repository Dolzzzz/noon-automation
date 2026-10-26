// Dummy card only — Visa's public test number. Never put a real card here.
export const dummyCard = {
  number: '4111111111111111',
  expiryMonth: '12',
  expiryYear: '30', // noon's year box takes two digits
  cvv: '123',
  holderName: 'Test Automation',
};

// Arabic search term used by flow 07 ("headphones").
export const arabicSearchTerm = 'سماعات';

// Search used to pick a product for the wishlist and checkout flows.
export const productSearchTerm = 'سماعات';

// Footer social network opened by flow 08.
export const socialNetwork = { linkName: 'footer_fb_color', expectedHost: /facebook\.com/ };

// noon rejects digits in names, so the profile flow rotates through letters-only names
// and picks one that differs from what is saved, keeping each update a real change.
const PROFILE_NAMES = [
  { firstName: 'Adel', lastName: 'Attiah' },
  { firstName: 'Omar', lastName: 'Hassan' },
  { firstName: 'Karim', lastName: 'Mostafa' },
];

export function nextProfileName(currentFirstName: string) {
  return PROFILE_NAMES.find(n => n.firstName !== currentFirstName.trim()) ?? PROFILE_NAMES[0];
}
