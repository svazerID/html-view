import Prism from 'prismjs';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';

export function highlightCode(code: string, language: 'html' | 'css' | 'javascript' | 'markup'): string {
  try {
    const grammar = Prism.languages[language] || Prism.languages.markup;
    return Prism.highlight(code, grammar, language);
  } catch (err) {
    return code;
  }
}

/**
 * Basic HTML/CSS/JS beautifier to indent cleanly
 */
export function simpleFormatCode(code: string, type: 'html' | 'css' | 'js'): string {
  if (!code.trim()) return '';

  if (type === 'css') {
    return code
      .replace(/\s*\{\s*/g, ' {\n  ')
      .replace(/;\s*/g, ';\n  ')
      .replace(/\s*\}\s*/g, '\n}\n\n')
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .trim();
  }

  if (type === 'html') {
    let formatted = '';
    const reg = /(>)(<)(\/*)/g;
    let xml = code.replace(reg, '$1\r\n$2$3');
    let pad = 0;
    xml.split('\r\n').forEach((node) => {
      let indent = 0;
      if (node.match(/.+<\/\w[^>]*>$/)) {
        indent = 0;
      } else if (node.match(/^<\/\w/)) {
        if (pad !== 0) {
          pad -= 1;
        }
      } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
        indent = 1;
      } else {
        indent = 0;
      }

      let padding = '';
      for (let i = 0; i < pad; i++) {
        padding += '  ';
      }

      formatted += padding + node + '\n';
      pad += indent;
    });
    return formatted.trim();
  }

  // Vanilla JS basic spacing
  return code.trim();
}
