import { Builder, By, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import firefox from "selenium-webdriver/firefox.js";
import assert from "assert";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';  // Make sure to import path
import fs from 'fs';  // Make sure to import fs

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import page objects
import { LoginPage } from "./loginPage.js";
import { ProductsPage } from "./productsPage.js";
import { CartPage } from "./cartPage.js";
import { CheckoutPage } from "./checkoutPage.js";

// Ensure the screenshots directory exists
function ensureScreenshotDirectory() {
  const dir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log("Created 'screenshots' directory.");
  }
}

const BROWSER = process.env.BROWSER || "chrome"; // First browser
const SECOND_BROWSER = BROWSER === "chrome" ? "firefox" : "chrome"; // Second browser (opposite of the first)

// Setup options for the first browser (chrome or firefox)
let options;
if (BROWSER === "chrome") {
  options = new chrome.Options();
} else if (BROWSER === "firefox") {
  options = new firefox.Options();
  options.addArguments('--headless'); // Set headless for Firefox
}

// Setup options for the second browser (opposite of the first)
let secondOptions;
if (SECOND_BROWSER === "chrome") {
  secondOptions = new chrome.Options();
} else if (SECOND_BROWSER === "firefox") {
  secondOptions = new firefox.Options();
  secondOptions.addArguments('--headless'); // Set headless for Firefox
}

async function takeScreenshot(driver, fileName, browser) {
  ensureScreenshotDirectory(); // Ensure the 'screenshots' folder exists before taking a screenshot
  const image = await driver.takeScreenshot();
  const filePath = path.join(__dirname, "screenshots", `${fileName}_${browser}.png`); // Use browser name in screenshot file
  fs.writeFileSync(filePath, image, "base64");
  console.log(`Screenshot saved: ${filePath}`);
}

async function runTest() {
  // Run test for the first browser
  let driver = await new Builder()
    .forBrowser(BROWSER)
    .setChromeOptions(options)
    .setFirefoxOptions(options)
    .build();

  try {
    console.log(`🚀 Starting test on ${BROWSER}`);

    const loginPage = new LoginPage(driver);
    const productsPage = new ProductsPage(driver);
    const cartPage = new CartPage(driver);
    const checkoutPage = new CheckoutPage(driver);

    // Login
    await driver.get("https://www.saucedemo.com/");
    await loginPage.login("standard_user", "secret_sauce");
    await driver.wait(until.urlContains("inventory"), 5000);
    await takeScreenshot(driver, "after_login", BROWSER); // Pass correct browser to takeScreenshot
    console.log("✅ Login successful");

    // Add item to cart
    await productsPage.addItemToCart();
    await productsPage.goToCart();
    await takeScreenshot(driver, "cart", BROWSER);
    console.log("✅ Item added to cart");

    // Proceed to checkout
    await cartPage.proceedToCheckout();
    await takeScreenshot(driver, "checkout_step_one", BROWSER);
    console.log("✅ Proceeded to checkout");

    // Complete checkout
    await checkoutPage.fillShippingInfo("John", "Doe", "12345");
    await takeScreenshot(driver, "checkout_step_two", BROWSER);
    await checkoutPage.completeCheckout();
    await takeScreenshot(driver, "order_complete", BROWSER);
    console.log("✅ Checkout completed");

    // Verify successful checkout
    const thankYouHeader = await driver.findElement(By.className("complete-header")).getText();
    assert.strictEqual(thankYouHeader, "Thank you for your order!", "Checkout was not successful");
    console.log("✅ Order confirmed");

  } catch (error) {
    console.error("🚨 Test failed:", error);
    await takeScreenshot(driver, "error", BROWSER);
  } finally {
    await driver.quit();
  }

  // Run the second test with the second browser (opposite browser)
  let secondDriver = await new Builder()
    .forBrowser(SECOND_BROWSER)
    .setChromeOptions(secondOptions)
    .setFirefoxOptions(secondOptions)
    .build();

  try {
    console.log(`🚀 Starting test on second browser: ${SECOND_BROWSER}`);

    const loginPage = new LoginPage(secondDriver);
    const productsPage = new ProductsPage(secondDriver);
    const cartPage = new CartPage(secondDriver);
    const checkoutPage = new CheckoutPage(secondDriver);

    // Login
    await secondDriver.get("https://www.saucedemo.com/");
    await loginPage.login("standard_user", "secret_sauce");
    await secondDriver.wait(until.urlContains("inventory"), 5000);
    await takeScreenshot(secondDriver, "after_login", SECOND_BROWSER); // Pass correct browser to takeScreenshot
    console.log("✅ Login successful");

    // Add item to cart
    await productsPage.addItemToCart();
    await productsPage.goToCart();
    await takeScreenshot(secondDriver, "cart", SECOND_BROWSER);
    console.log("✅ Item added to cart");

    // Proceed to checkout
    await cartPage.proceedToCheckout();
    await takeScreenshot(secondDriver, "checkout_step_one", SECOND_BROWSER);
    console.log("✅ Proceeded to checkout");

    // Complete checkout
    await checkoutPage.fillShippingInfo("John", "Doe", "12345");
    await takeScreenshot(secondDriver, "checkout_step_two", SECOND_BROWSER);
    await checkoutPage.completeCheckout();
    await takeScreenshot(secondDriver, "order_complete", SECOND_BROWSER);
    console.log("✅ Checkout completed");

    // Verify successful checkout
    const thankYouHeader = await secondDriver.findElement(By.className("complete-header")).getText();
    assert.strictEqual(thankYouHeader, "Thank you for your order!", "Checkout was not successful");
    console.log("✅ Order confirmed");

  } catch (error) {
    console.error("🚨 Test failed:", error);
    await takeScreenshot(secondDriver, "error", SECOND_BROWSER);
  } finally {
    await secondDriver.quit();
  }
}

runTest();
