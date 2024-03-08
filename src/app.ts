import express from 'express';
import startBrowser from './browser';
import {Browser, Page} from "puppeteer";

const app = express();
const port = 3000;

app.get('/health', (req, res) => {
    res.send('{status: "UP"}');
});

app.get('/screenshots', (req, res) => {
    startBrowser().then(async browser => {
        const page = await browser.newPage();
        await page.goto('https://promoklocki.pl');
        await page.screenshot({path: 'example.png'});
        await browser.close();
    })
    res.send('Done!');
});

app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});


const browser: Promise<Browser> = startBrowser();

const scraperController = (browser: Promise<Browser>) => {
    browser.then(async browser => {
        const page: Page = await browser.newPage();
        await page.goto('https://promoklocki.pl/?p=1');
        // wait for DOM to load
        await page.waitForSelector('.main');
        await page.$$eval('.row.product', (products) => {
            // console.log('Products: {}', products);
            products.map((product) => {
                const imageUrl = product.querySelector('div > a > img')?.getAttribute('src');
                const title = product.querySelector('div > a > h2')?.textContent;
                const price = product.querySelector('div > a > strong')?.textContent;
                console.log('Image URL: ', imageUrl, " Title: ", title, " Price: ", price);
            });
        });

        // page.click(".pagination .page-item.active");
        await page.goto('https://promoklocki.pl/?p=2');
        await page.waitForSelector('.main');
        await page.$$eval('.row.product', (products) => {
            // console.log('Products: {}', products);
            products.map((product) => {
                const imageUrl = product.querySelector('div > a > img')?.getAttribute('src');
                const title = product.querySelector('div > a > h2')?.textContent;
                const price = product.querySelector('div > a > strong')?.textContent;
                console.log('Image URL: ', imageUrl, " Title: ", title, " Price: ", price);
            });
        });
    });
};

scraperController(browser);
