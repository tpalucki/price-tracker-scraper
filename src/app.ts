import express from 'express';
import startBrowser from './browser';
import {Browser, Page} from "puppeteer";

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});


const browser: Promise<Browser> = startBrowser();

const scraperController = (browser: Promise<Browser>) => {
    browser.then(async browser => {
        const page: Page = await browser.newPage();
        await page.goto('https://promoklocki.pl');
        // wait for DOM to load
        await page.waitForSelector('.main');
        // wait for link to required legos
        // await page.$$eval('.product', (products) => {
        //     products.map((product) => {
        //         console.log('Product: {}', product);
        //         const title = product.querySelector('.product > h2').textContent;
        //         const price = product.querySelector('.product > strong').textContent;
        //         console.log(title, price);
        //     });
        // });
        await page.$$eval('.product', (products) => {
            console.log('Products: {}', products);
        });

        await page.screenshot({path: 'example.png'});
        // await page.close();
        await browser.close();
    });
};

scraperController(browser);