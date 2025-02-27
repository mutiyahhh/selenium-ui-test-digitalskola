// cartPage.js
import { By } from "selenium-webdriver";

export class CartPage {
  constructor(driver) {
    this.driver = driver;
    this.checkoutButton = By.id("checkout");
  }

  async proceedToCheckout() {
    await this.driver.findElement(this.checkoutButton).click();
  }
}