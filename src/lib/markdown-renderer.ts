import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import Prism from 'prismjs';

// Import specific languages for syntax highlighting
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-markdown';

// Configure marked with syntax highlighting
marked.use(markedHighlight({
  langPrefix: 'hljs language-',
  highlight(code, lang) {
    if (lang && Prism.languages[lang]) {
      try {
        return Prism.highlight(code, Prism.languages[lang], lang);
      } catch (e) {
        console.warn(`Syntax highlighting failed for language ${lang}:`, e);
      }
    }
    return code;
  }
}));

// Configure marked options
marked.setOptions({
  gfm: true, // GitHub Flavored Markdown
  breaks: false, // Don't add <br> for single line breaks
  pedantic: false,
  silent: false,
});

/**
 * Converts markdown to HTML with syntax highlighting and custom styling
 * @param markdown - The markdown string to convert
 * @returns HTML string with proper styling classes
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  if (!markdown) return '';
  
  try {
    let html = marked.parse(markdown) as string;
    
    // Ensure headings have deterministic IDs that match our TOC slugging
    const slugify = (text: string) =>
      text
        .toLowerCase()
        .replace(/<[^>]*>/g, '')
        .replace(/["'`]/g, '')
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');

    html = html.replace(/<h([1-6])(\s[^>]*)?>([\s\S]*?)<\/h\1>/g, (_m, level, attrs = '', inner) => {
      const hasId = attrs && /\sid=\"[^\"]+\"/.test(attrs);
      const id = slugify(inner);
      const newAttrs = hasId ? attrs : `${attrs || ''} id="${id}"`;
      return `<h${level}${newAttrs}>${inner}</h${level}>`;
    });
    
    // Post-process the HTML to add our custom classes
    html = html
      // Headers
      .replace(/<h1([^>]*)>/g, '<h1$1 class="text-3xl font-bold mt-8 mb-4">')
      .replace(/<h2([^>]*)>/g, '<h2$1 class="text-2xl font-semibold mt-6 mb-3">')
      .replace(/<h3([^>]*)>/g, '<h3$1 class="text-xl font-semibold mt-5 mb-2">')
      .replace(/<h4([^>]*)>/g, '<h4$1 class="text-lg font-semibold mt-4 mb-2">')
      .replace(/<h5([^>]*)>/g, '<h5$1 class="text-base font-semibold mt-3 mb-2">')
      .replace(/<h6([^>]*)>/g, '<h6$1 class="text-sm font-semibold mt-2 mb-1">')
      
      // Paragraphs
      .replace(/<p>/g, '<p class="mb-4 leading-7">')
      
      // Lists
      .replace(/<ul>/g, '<ul class="list-disc list-inside mb-4 pl-6 space-y-1">')
      .replace(/<ol>/g, '<ol class="list-decimal list-inside mb-4 pl-6 space-y-1">')
      .replace(/<li>/g, '<li class="leading-7">')
      .replace(/<input type="checkbox"/g, '<input type="checkbox" class="mr-2 align-middle"')
      
      // Links
      .replace(/<a href="([^"]*)"([^>]*)>/g, '<a href="$1"$2 class="text-primary hover:underline font-medium" target="_blank" rel="noopener noreferrer">')
      
      // Code blocks
      .replace(/<pre><code class="hljs language-([^"]*)">/g, '<div class="mb-4"><pre class="bg-muted rounded-md p-4 overflow-x-auto"><code class="hljs language-$1">')
      .replace(/<\/code><\/pre>/g, '</code></pre></div>')
      
      // Inline code
      .replace(/<code>/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">')
      
      // Blockquotes
      .replace(/<blockquote>/g, '<blockquote class="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground">')
      
      // Tables
      .replace(/<table>/g, '<div class="overflow-x-auto my-4"><table class="min-w-full border">')
      .replace(/<\/table>/g, '</table></div>')
      .replace(/<thead>/g, '<thead class="bg-muted">')
      .replace(/<tr>/g, '<tr class="border-b border">')
      .replace(/<th>/g, '<th class="px-4 py-2 text-left font-semibold">')
      .replace(/<td>/g, '<td class="px-4 py-2">')
      
      // Images
      .replace(/<img src="([^"]*)" alt="([^"]*)"([^>]*)>/g, '<div class="my-6"><img src="$1" alt="$2"$3 class="rounded-md shadow-md max-w-full h-auto mx-auto" /></div>')
      
      // Horizontal rules
      .replace(/<hr>/g, '<hr class="my-8 border">');
    
    return html;
  } catch (error) {
    console.error('Error rendering markdown:', error);
    // Fallback to basic text rendering
    return `<p class="text-red-500">Error rendering markdown content</p>`;
  }
}

/**
 * Extracts plain text from markdown for use in excerpts or search
 * @param markdown - The markdown string to convert
 * @returns Plain text string
 */
export function markdownToPlainText(markdown: string): string {
  if (!markdown) return '';
  
  try {
    // First convert to HTML, then strip HTML tags
    const html = marked.parse(markdown) as string;
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  } catch (error) {
    console.error('Error converting markdown to plain text:', error);
    return markdown;
  }
}

/**
 * Generates a table of contents from markdown headings
 * @param markdown - The markdown string to analyze
 * @returns Array of heading objects with text, id, and level
 */
export function generateTableOfContents(markdown: string): Array<{
  text: string;
  id: string;
  level: number;
}> {
  if (!markdown) return [];
  
  const headings: Array<{ text: string; id: string; level: number }> = [];
  const lines = markdown.split('\n');
  
  for (const line of lines) {
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
      headings.push({ text, id, level });
    }
  }
  
  return headings;
} 