
import { Builder, By, Key, until } from "selenium-webdriver";
import * as chrome from 'selenium-webdriver/chrome.js';
import * as firefox from 'selenium-webdriver/firefox.js';

const BROWSER = process.env.BROWSER || "chrome";

let options;
if (BROWSER === "chrome") {
  options = new chrome.Options().addArguments("--headless");
} else if (BROWSER === "firefox") {
  options = new firefox.Options().addArguments("-headless");
} else {
  throw new Error("Browser yang dipilih tidak didukung.");
}

async function runSimplifiedTest() {
  let driver;
  try {
    console.log(`Starting test on ${BROWSER}`);
    driver = await new Builder()
      .forBrowser(BROWSER)
      .setChromeOptions(options)
      .setFirefoxOptions(options)
      .build();

    console.log("Opening website");
    await driver.get("https://www.saucedemo.com/");

    console.log("Logging in");
    await driver.findElement(By.id("user-name")).sendKeys("standard_user");
    await driver.findElement(By.id("password")).sendKeys("secret_sauce", Key.RETURN);

    console.log("Waiting for inventory page");
    await driver.wait(until.urlContains("inventory"), 5000);

    console.log("Validating dashboard");
    let title = await driver.findElement(By.className("title")).getText();
    console.log(`Dashboard title: ${title}`);

    console.log("Test completed successfully");
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    if (driver) {
      console.log("Closing browser");
      await driver.quit();
    }
  }
}

runSimplifiedTest();