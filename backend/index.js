const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const https = require('https');
const urlLib = require('url');
const sslChecker = require('ssl-checker');

const app = express();
app.use(cors());
app.use(express.json());

// Helper: Analyze SEO tags
function analyzeSeoTags(html) {
  const $ = cheerio.load(html);
  const results = {};

  // Title
  const title = $('title').text();
  results.title = {
    value: title,
    present: !!title,
    length: title.length,
    bestPractice: title.length >= 30 && title.length <= 60,
    tip: 'Title should be 30-60 characters.'
  };

  // Meta Description
  const description = $('meta[name="description"]').attr('content') || '';
  results.description = {
    value: description,
    present: !!description,
    length: description.length,
    bestPractice: description.length >= 70 && description.length <= 160,
    tip: 'Description should be 70-160 characters.'
  };

  // Canonical
  const canonical = $('link[rel="canonical"]').attr('href') || '';
  results.canonical = {
    value: canonical,
    present: !!canonical,
    tip: 'Canonical tag helps prevent duplicate content.'
  };

  // Robots
  const robots = $('meta[name="robots"]').attr('content') || '';
  results.robots = {
    value: robots,
    present: !!robots,
    tip: 'Robots meta tag controls crawling and indexing.'
  };

  // Open Graph
  const ogTags = {};
  $('meta[property^="og:"]').each((_, el) => {
    const property = $(el).attr('property');
    ogTags[property] = $(el).attr('content');
  });
  results.openGraph = ogTags;

  // Twitter Cards
  const twitterTags = {};
  $('meta[name^="twitter:"]').each((_, el) => {
    const name = $(el).attr('name');
    twitterTags[name] = $(el).attr('content');
  });
  results.twitter = twitterTags;

  return results;
}

app.post('/analyze', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });
  let start = Date.now();
  let sslValid = null;
  let httpStatus = null;
  try {
    // Check SSL certificate validity using ssl-checker
    const parsedUrl = urlLib.parse(url);
    if (parsedUrl.protocol === 'https:') {
      try {
        const ssl = await sslChecker(parsedUrl.hostname);
        sslValid = ssl.valid;
      } catch (e) {
        sslValid = false;
      }
    }
    // Fetch page
    const response = await axios.get(url, { headers: { 'User-Agent': 'SEO-Analyzer-Bot' }, responseType: 'text', validateStatus: null });
    httpStatus = response.status;
    const html = response.data;
    const analysis = analyzeSeoTags(html);
    const $ = cheerio.load(html);
    // Technical details
    const responseTime = Date.now() - start;
    const pageSize = Buffer.byteLength(html, 'utf8');
    const imagesFound = $('img').length;
    const linksFound = $('a').length;
    res.json({
      success: true,
      analysis,
      technical: {
        responseTime,
        pageSize,
        imagesFound,
        linksFound,
        httpStatus,
        sslValid
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch or analyze the URL.' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`SEO Analyzer backend running on port ${PORT}`);
}); 