// productsPage.js
import { By } from "selenium-webdriver";

export class ProductsPage {
  constructor(driver) {
    this.driver = driver;
    this.addToCartButton = By.css(".btn_inventory");
    this.cartLink = By.className("shopping_cart_link");
  }

  async addItemToCart() {
    await this.driver.findElement(this.addToCartButton).click();
  }

  async goToCart() {
    await this.driver.findElement(this.cartLink).click();
  }
}