#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage, registerFont } = require('canvas');

// Configuration for social media images
const CONFIG = {
  // Twitter/X Card (1200x630)
  twitter: {
    width: 1200,
    height: 630,
    output: 'public/twitter-image.png',
    title: 'AI CRE Tools',
    subtitle: 'Commercial Real Estate AI Directory',
    tagline: 'Find & Compare the Best AI Solutions'
  },

  // Open Graph (1200x630)
  og: {
    width: 1200,
    height: 630,
    output: 'public/og-image.png',
    title: 'AI CRE Tools',
    subtitle: 'The Leading Directory for',
    tagline: 'Commercial Real Estate AI Tools'
  },

  // LinkedIn (1200x630)
  linkedin: {
    width: 1200,
    height: 630,
    output: 'public/linkedin-image.png',
    title: 'AI CRE Tools',
    subtitle: 'Discover AI Solutions for',
    tagline: 'Commercial Real Estate'
  },

  // Instagram Story (1080x1920)
  instagramStory: {
    width: 1080,
    height: 1920,
    output: 'public/instagram-story.png',
    title: 'AI CRE Tools',
    subtitle: 'CRE AI Directory',
    tagline: 'Find Your Next AI Solution'
  },

  // Instagram Post (1080x1080)
  instagramPost: {
    width: 1080,
    height: 1080,
    output: 'public/instagram-post.png',
    title: 'AI CRE Tools',
    subtitle: 'Commercial Real Estate',
    tagline: 'AI Solutions Directory'
  }
};

// Color palette
const COLORS = {
  primary: '#3b82f6',      // Blue
  secondary: '#1e40af',    // Darker blue
  accent: '#60a5fa',       // Light blue
  background: '#ffffff',   // White
  text: '#1f2937',         // Dark gray
  textLight: '#6b7280',    // Light gray
  gradient: ['#3b82f6', '#1e40af']
};

// Font settings
const FONTS = {
  title: 'bold 72px Arial',
  subtitle: 'normal 48px Arial',
  tagline: 'normal 36px Arial',
  small: 'normal 24px Arial'
};

function createGradientBackground(canvas, ctx, colors) {
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, colors[0]);
  gradient.addColorStop(1, colors[1]);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  return gradient;
}

function drawTextCentered(ctx, text, x, y, font, color = COLORS.text, maxWidth = null) {
  ctx.fillStyle = color;
  ctx.font = font;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if (maxWidth) {
    // Word wrap if needed
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const metrics = ctx.measureText(testLine);

      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    lines.push(currentLine);

    const lineHeight = parseInt(font) * 1.2;
    const totalHeight = lines.length * lineHeight;
    const startY = y - totalHeight / 2 + lineHeight / 2;

    lines.forEach((line, index) => {
      ctx.fillText(line, x, startY + index * lineHeight);
    });
  } else {
    ctx.fillText(text, x, y);
  }
}

function addDecorativeElements(ctx, canvas) {
  // Add some subtle geometric shapes
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';

  // Top right circle
  ctx.beginPath();
  ctx.arc(canvas.width - 100, 100, 80, 0, Math.PI * 2);
  ctx.fill();

  // Bottom left triangle
  ctx.beginPath();
  ctx.moveTo(50, canvas.height - 50);
  ctx.lineTo(150, canvas.height - 50);
  ctx.lineTo(100, canvas.height - 150);
  ctx.closePath();
  ctx.fill();

  // Add some AI-themed icons (simplified)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';

  // Circuit pattern dots
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 3; j++) {
      const x = 200 + i * 150;
      const y = 200 + j * 100;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function generateImage(config) {
  const canvas = createCanvas(config.width, config.height);
  const ctx = canvas.getContext('2d');

  // Create gradient background
  createGradientBackground(canvas, ctx, COLORS.gradient);

  // Add decorative elements
  addDecorativeElements(ctx, canvas);

  // Add a subtle overlay for better text readability
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  // Draw title
  drawTextCentered(ctx, config.title, centerX, centerY - 80, FONTS.title, COLORS.background);

  // Draw subtitle
  drawTextCentered(ctx, config.subtitle, centerX, centerY - 20, FONTS.subtitle, COLORS.background);

  // Draw tagline
  drawTextCentered(ctx, config.tagline, centerX, centerY + 40, FONTS.tagline, 'rgba(255, 255, 255, 0.9)');

  // Add website URL at bottom
  drawTextCentered(ctx, 'aicretools.com', centerX, canvas.height - 60, FONTS.small, 'rgba(255, 255, 255, 0.7)');

  return canvas;
}

async function generateAllImages() {
  console.log('🚀 Generating social media images for AI CRE Tools...\n');

  // Ensure public directory exists
  const publicDir = path.join(__dirname, '..', 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const results = [];

  for (const [key, config] of Object.entries(CONFIG)) {
    try {
      console.log(`📸 Generating ${key} image (${config.width}x${config.height})...`);

      const canvas = generateImage(config);
      const outputPath = path.join(__dirname, '..', config.output);

      // Save as PNG
      const buffer = canvas.toBuffer('image/png');
      fs.writeFileSync(outputPath, buffer);

      results.push({
        type: key,
        path: config.output,
        size: `${config.width}x${config.height}`,
        success: true
      });

      console.log(`✅ ${key} image saved to ${config.output}`);

    } catch (error) {
      console.error(`❌ Error generating ${key} image:`, error.message);
      results.push({
        type: key,
        path: config.output,
        error: error.message,
        success: false
      });
    }
  }

  // Generate summary
  console.log('\n📊 Generation Summary:');
  console.log('='.repeat(50));

  results.forEach(result => {
    if (result.success) {
      console.log(`✅ ${result.type}: ${result.path} (${result.size})`);
    } else {
      console.log(`❌ ${result.type}: ${result.error}`);
    }
  });

  const successCount = results.filter(r => r.success).length;
  console.log(`\n🎉 Generated ${successCount}/${results.length} images successfully!`);

  if (successCount === results.length) {
    console.log('\n🔗 Next steps:');
    console.log('1. Review the generated images in the public/ directory');
    console.log('2. Test social media sharing with tools like opengraph.xyz');
    console.log('3. Update your social media profiles with the new images');
  }
}

// Run the generator
generateAllImages().catch(console.error);
