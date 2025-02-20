const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome"); // ⬅️ Tambahkan ini!

async function runTest() {
    //melakukan pencarian di google
    let driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(new chrome.Options().addArguments("--ignore-certificate-errors")) // ✅ Perbaikan di sini
        .build();
    

try {
        // Login
        await driver.get("https://www.saucedemo.com/");
        //simulate user behaviour
        await driver.findElement(By.id("user-name")).sendKeys("standard_user");
        await driver.findElement(By.id("password")).sendKeys("secret_sauce", Key.RETURN);
        await driver.wait(until.urlContains("inventory"), 10000);
        console.log("✅ Login berhasil, berada di dashboard.");

        // Validate Dashboard
        let title = await driver.findElement(By.className("title")).getText();
        if (title === "Products") {
            console.log("✅ Berhasil masuk ke dashboard.");
        } else {
            console.log("❌ Gagal masuk ke dashboard.");
        }

        // Add Item to Cart
        await driver.findElement(By.className("btn_inventory")).click();
        await driver.findElement(By.className("shopping_cart_link")).click();
        console.log("✅ Item berhasil ditambahkan ke cart.");

        // Validate Item di Cart
        let cartItem = await driver.findElement(By.className("inventory_item_name")).getText();
        if (cartItem) {
            console.log("✅ Item ada di cart.");
        } else {
            console.log("❌ Item tidak ada di cart.");
        }

    } catch (error) {
        console.error("🚨 Error:", error);
    } finally {
        // Tutup browser
        await driver.quit();
    }
}

// Jalankan test
runTest();