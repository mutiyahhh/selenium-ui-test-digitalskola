import { Builder, By, Key, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import firefox from "selenium-webdriver/firefox.js";
import assert from "assert";

// Pilihan browser (Chrome atau Firefox)
const BROWSER = "chrome"; // Ganti sesuai kebutuhan

// Deklarasi options
let options;

// Konfigurasi browser options
if (BROWSER === "chrome") {
  options = new chrome.Options(); // Menggunakan Chrome
} else if (BROWSER === "firefox") {
  options = new firefox.Options();
  options.addArguments('--headless'); // Menambahkan opsi headless untuk Firefox
}

async function runTest() {
  let driver = await new Builder()
    .forBrowser(BROWSER)
    .setChromeOptions(options)
    .setFirefoxOptions(options)
    .build();

  try {
    console.log("🚀 Memulai pengujian pada " + BROWSER);

    // Test Hooks: Before Test
    console.log("🔹 Before Test: Buka halaman login");
    await driver.get("https://www.saucedemo.com/");

    // Step 1: Login
    console.log("🔹 Step 1: User melakukan login");
    await driver.findElement(By.id("user-name")).sendKeys("standard_user");
    await driver.findElement(By.id("password")).sendKeys("secret_sauce", Key.RETURN);
    await driver.wait(until.urlContains("inventory"), 5000);
    console.log("✅ Login sukses, berada di dashboard");

    // Step 2: Validate Dashboard
    let title = await driver.findElement(By.className("title")).getText();
    assert.strictEqual(title, "Products", "Gagal masuk ke dashboard");
    console.log("✅ Validasi dashboard sukses");

    // Step 3: Tambah Item ke Cart
    console.log("🔹 Step 3: Menambahkan item ke cart");
    await driver.findElement(By.className("btn_inventory")).click();
    await driver.findElement(By.className("shopping_cart_link")).click();
    console.log("✅ Item berhasil ditambahkan ke cart");

    // Step 4: Validasi Item di Cart
    console.log("🔹 Step 4: Validasi item di cart");
    let cartItem = await driver.findElement(By.className("inventory_item_name")).getText();
    assert.ok(cartItem, "Item tidak ditemukan di cart");
    console.log("✅ Item ada di cart");
  } catch (error) {
    console.error("🚨 Terjadi kesalahan:", error);
  } finally {
    // Test Hooks: After Test
    console.log("🔹 After Test: Menutup browser");
    await driver.quit();
  }
}

// Jalankan test
const desc = "Test Login dan Tambah Item ke Cart di SauceDemo";
console.log("\n==============================");
console.log(`📌 ${desc}`);
console.log("==============================\n");
runTest();
