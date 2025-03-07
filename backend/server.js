const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");
const puppeteer = require("puppeteer");

const app = express();
app.use(cors());

const scrapePopulation = async () => {
  try {
    console.log("Launching Puppeteer...");
    const browser = await puppeteer.launch({ headless: "new" }); // Headless mode
    const page = await browser.newPage();

    console.log("Navigating to Worldometers...");
    await page.goto("https://www.worldometers.info/world-population/", {
      waitUntil: "networkidle2",
    });

    // Wait for the population number to appear
    await page.waitForSelector("#maincounter-wrap span");

    // Extract the population number
    const populationText = await page.evaluate(() => {
      return document.querySelector("#maincounter-wrap span").innerText;
    });

    console.log("✅ Scraped Population:", populationText);

    await browser.close();
    return { population: populationText };
  } catch (error) {
    console.error("❌ Scraping failed:", error);
    return { population: "Error fetching data" };
  }
};

// API Endpoint
app.get("/data", async (req, res) => {
  const populationData = await scrapePopulation();
  res.json(populationData);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});