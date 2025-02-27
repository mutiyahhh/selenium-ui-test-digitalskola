// checkoutPage.js
import { By } from "selenium-webdriver";

export class CheckoutPage {
  constructor(driver) {
    this.driver = driver;
    this.firstNameInput = By.id("first-name");
    this.lastNameInput = By.id("last-name");
    this.postalCodeInput = By.id("postal-code");
    this.continueButton = By.id("continue");
    this.finishButton = By.id("finish");
  }

  async fillShippingInfo(firstName, lastName, postalCode) {
    await this.driver.findElement(this.firstNameInput).sendKeys(firstName);
    await this.driver.findElement(this.lastNameInput).sendKeys(lastName);
    await this.driver.findElement(this.postalCodeInput).sendKeys(postalCode);
    await this.driver.findElement(this.continueButton).click();
  }

  async completeCheckout() {
    await this.driver.findElement(this.finishButton).click();
  }
}