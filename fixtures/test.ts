import { test as base } from '@playwright/test';
import { Header } from '../pages/Header';
import { LoginPage } from '../pages/LoginPage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { ProductPage } from '../pages/ProductPage';
import { WishlistPage } from '../pages/WishlistPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { ProfilePage } from '../pages/ProfilePage';
import { LocationPicker } from '../pages/LocationPicker';
import { FooterSection } from '../pages/FooterSection';

type Pages = {
  header: Header;
  loginPage: LoginPage;
  searchResults: SearchResultsPage;
  productPage: ProductPage;
  wishlistPage: WishlistPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  profilePage: ProfilePage;
  locationPicker: LocationPicker;
  footer: FooterSection;
};

export const test = base.extend<Pages>({
  header: async ({ page }, use) => use(new Header(page)),
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  searchResults: async ({ page }, use) => use(new SearchResultsPage(page)),
  productPage: async ({ page }, use) => use(new ProductPage(page)),
  wishlistPage: async ({ page }, use) => use(new WishlistPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  checkoutPage: async ({ page }, use) => use(new CheckoutPage(page)),
  profilePage: async ({ page }, use) => use(new ProfilePage(page)),
  locationPicker: async ({ page }, use) => use(new LocationPicker(page)),
  footer: async ({ page }, use) => use(new FooterSection(page)),
});

export { expect } from '@playwright/test';
