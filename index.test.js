const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const { expect } = require('chai');
const { describe, it } = require('mocha');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

describe('HTML page', () => {
    it('should have a button that fetches a message', (done) => {
        const dom = new JSDOM(html, { runScripts: "dangerously" });

        // Replace the API URL placeholder for testing
        dom.window.document.querySelector('script').text = dom.window.document.querySelector('script').text.replace('%%API_URL%%', 'http://localhost:8080/api/hello');

        const button = dom.window.document.getElementById('fetchButton');
        expect(button).to.not.be.null;

        // Mock fetch function
        global.fetch = (url) => {
            return Promise.resolve({
                ok: true,
                text: () => Promise.resolve('Hello World')
            });
        };

        button.click();

        setTimeout(() => {
            const message = dom.window.document.getElementById('message').textContent;
            expect(message).to.equal('Hello World');
            done();
        }, 100);
    });
});
