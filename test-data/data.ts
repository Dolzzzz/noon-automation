// Dummy card only — Visa's public test number. Never put a real card here.
export const dummyCard = {
  number: '4111111111111111',
  expiryMonth: '12',
  expiryYear: '30',
  cvv: '123',
  holderName: 'Test Automation',
};

// Arabic search term used by flow 07 ("headphones").
export const arabicSearchTerm = 'سماعات';

// Search used to pick a product for the wishlist and checkout flows.
export const productSearchTerm = 'سماعات';

// Footer social network opened by flow 08.
export const socialNetwork = { linkName: 'footer_fb_color', expectedHost: /facebook\.com/ };

// Unique per run so the profile update is visibly different every time.
export function uniqueProfileName() {
  const stamp = new Date().toISOString().slice(5, 16).replace(/[-T:]/g, '');
  return { firstName: 'Tester', lastName: `QA${stamp}` };
}
