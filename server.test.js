const request = require('supertest');
const { expect } = require('chai');
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const apiUrl = 'http://localhost:8050/api/v1/greeting';

app.get('/', (req, res) => {
    fs.readFile(path.join(__dirname, 'index.html'), 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading index.html');
            return;
        }
        const result = data.replace('%%API_URL%%', apiUrl);
        res.send(result);
    });
});

describe('GET /', () => {
    it('should return the HTML file with the API URL replaced', (done) => {
        request(app)
            .get('/')
            .expect('Content-Type', /html/)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.text).to.include(apiUrl);
                done();
            });
    });
});
