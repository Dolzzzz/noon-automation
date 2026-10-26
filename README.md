# noon Egypt — Test Automation Task

End-to-end automation of eight user flows on [noon Egypt (Arabic)](https://www.noon.com/egypt-ar/),
built with **Playwright + TypeScript** using the Page Object Model.

| # | Flow | Spec |
|---|------|------|
| 1 | Sign in with email and password | `tests/01-sign-in.setup.ts` |
| 2 | Add a product to the wish list | `tests/02-add-to-wishlist.spec.ts` |
| 3 | Remove that product from the wish list | `tests/03-remove-from-wishlist.spec.ts` |
| 4 | Checkout up to adding a new card and filling its details | `tests/04-checkout-new-card.spec.ts` |
| 5 | Update the profile details | `tests/05-update-profile.spec.ts` |
| 6 | Update the delivery location | `tests/06-update-delivery-location.spec.ts` |
| 7 | Search using an Arabic search term | `tests/07-arabic-search.spec.ts` |
| 8 | Open a social media link from the site footer | `tests/08-footer-social-link.spec.ts` |

> **No purchase is ever made.** Flow 4 opens *Credit card → إضافة البطاقة*, types the dummy card
> (`4111 1111 1111 1111`, 12/30, CVV 123), unticks *تذكر هذه البطاقة* (remember this card), checks
> that the form's **تأكيد** button became enabled, and stops. It never clicks **تأكيد**, never
> saves the card, never confirms payment, and never places an order.

## Prerequisites

- **Node.js 18+** (developed on Node 24)
- **Google Chrome** installed. The tests run in real Chrome (`channel: 'chrome'`).
- A **noon Egypt test account** that signs in with email + password, prepared once by hand:
  - **Two saved delivery addresses.** Checkout needs one, and flow 6 switches between them.
  - **The mobile number on each address verified.** noon asks for a WhatsApp code
    ("تأكيد رقم الموبايل") the first time an address is used, and an automated run can't answer
    that. Open the header's location picker, click **التحقق الآن** on each address, and enter the code.

## Setup

```bash
git clone <this-repo-url>
cd noon-automation
npm install
npx playwright install chrome
```

Create your `.env` from the template and fill in the test account:

```bash
cp .env.example .env
```

```dotenv
NOON_EMAIL=your-test-account@example.com
NOON_PASSWORD=your-test-password
```

`.env` is gitignored and the credentials are only read from it.

## Running

```bash
npm test                 # all 8 flows, headed, in order
npm run test:demo        # same, slowed down (SLOW_MO=600) for screen recording
npm run report           # open the HTML report of the last run
npx playwright test tests/07-arabic-search.spec.ts   # a single flow (sign-in runs first)
```

| Variable | Default | Purpose |
|----------|---------|---------|
| `HEADLESS` | `false` | noon is much more reliable headed; keep it `false` |
| `SLOW_MO` | `250` | delay (ms) between actions |
| `VIDEO` | `off` | `on` also saves per-test `.webm` videos in `test-results/` (run `npx playwright install ffmpeg` first) |

## How it is built

```
fixtures/test.ts          page objects injected as Playwright fixtures
pages/                    one class per page or component (BasePage, Header, LoginPage, ProductPage,
                          WishlistPage, CartPage, CheckoutPage, ProfilePage, LocationPicker, FooterSection)
tests/                    one spec per flow, numbered in the task's order
test-data/data.ts         dummy card, Arabic search term, social network, profile values
utils/env.ts              reads credentials from .env
utils/shared-state.ts     passes the wish-listed product from flow 2 to flow 3
playwright.config.ts      Chrome, ar-EG locale, Cairo timezone, 1 worker, trace off
```

- **Sign-in runs once.** Flow 1 is a Playwright *setup project*. It signs in, saves the session
  to `.auth/user.json`, and every other flow starts from that signed-in session.
- **Flows run serially** (`workers: 1`) because they share one account, wish list and cart.
- **Selectors** use noon's own `data-qa` attributes and ARIA roles, not styling classes.
- **Hydration-safe clicks.** noon server-renders its pages and hydrates them seconds later,
  and clicks before that are silently dropped. `BasePage.clickUntilVisible` retries a click
  until the panel it opens appears. The wishlist heart is a toggle, so it is retried only until
  noon sends its save request, never past that.
- **Products are opened by link**, not by clicking the card. A card click can land on the sticky
  header's language toggle while the grid is still shifting. `BasePage.ensureArabic` also switches
  back if noon ever serves `/egypt-en/`.
- **Clear failures for account setup.** If noon asks for the address phone OTP, flows 4 and 6
  fail with a message that says so, instead of timing out.

## Keeping the password private

- The password is read from `.env` and typed into a `type="password"` field. It is masked on
  screen and in the videos.
- Playwright **tracing is off**, because traces record typed values. Nothing logs the password,
  and no step title contains it.
- When recording the demo, don't open `.env` on screen.

## Notes and known limitations

- This runs against the **live production site**, so prices, products and layout change.
  The product for flows 2 and 4 is the first search result for `سماعات`, not a fixed SKU.
- noon uses bot protection (reCAPTCHA v3) on sign-in. If sign-in is ever refused, run it again
  later from a normal network. The suite does not try to bypass any bot protection.
- The suite is meant to run headed on a desktop, not in CI.
