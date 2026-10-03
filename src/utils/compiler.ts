import { CdnLibrary, ThemeSyncMode } from '../types';

interface CompileOptions {
  html: string;
  css: string;
  js: string;
  libraries: CdnLibrary[];
  themeMode: ThemeSyncMode;
  isParentDark: boolean;
  enableInteractivePointers?: boolean;
}

export function compilePreviewDocument({
  html,
  css,
  js,
  libraries,
  themeMode,
  isParentDark,
  enableInteractivePointers = true,
}: CompileOptions): string {
  // Determine if dark mode should be applied in preview
  const isDark = themeMode === 'sync' ? isParentDark : themeMode === 'dark';

  // Build external stylesheets and scripts
  const externalStylesheets = libraries
    .filter((lib) => lib.enabled && lib.type === 'css')
    .map((lib) => `<link rel="stylesheet" href="${lib.url}">`)
    .join('\n    ');

  const externalScripts = libraries
    .filter((lib) => lib.enabled && lib.type === 'js')
    .map((lib) => `<script src="${lib.url}"></script>`)
    .join('\n    ');

  // Sandbox bridge script to capture errors, console logs, and ready status
  const bridgeScript = `
    <script>
      (function() {
        const _post = function(payload) {
          try {
            window.parent.postMessage(payload, '*');
          } catch (e) {}
        };

        // Serialize console arguments cleanly
        function serialize(arg) {
          if (arg === null) return 'null';
          if (arg === undefined) return 'undefined';
          if (typeof arg === 'function') return arg.toString();
          if (arg instanceof Error) return arg.name + ': ' + arg.message + (arg.stack ? '\\n' + arg.stack : '');
          if (typeof arg === 'object') {
            try {
              return JSON.stringify(arg, null, 2);
            } catch (err) {
              return Object.prototype.toString.call(arg);
            }
          }
          return String(arg);
        }

        // Intercept console functions
        ['log', 'info', 'warn', 'error'].forEach(function(level) {
          const original = console[level] || console.log;
          console[level] = function() {
            const args = Array.prototype.slice.call(arguments);
            const formatted = args.map(serialize).join(' ');
            _post({
              type: 'LIVE_PREVIEW_CONSOLE',
              logType: level,
              content: formatted,
              timestamp: new Date().toLocaleTimeString()
            });
            if (original) original.apply(console, arguments);
          };
        });

        // Global Error Handling
        window.onerror = function(message, source, lineno, colno, error) {
          _post({
            type: 'LIVE_PREVIEW_ERROR',
            message: String(message),
            source: source || 'user-script.js',
            line: lineno,
            col: colno,
            stack: error ? error.stack : undefined,
            timestamp: new Date().toLocaleTimeString()
          });
          return false;
        };

        // Unhandled Promise Rejections
        window.addEventListener('unhandledrejection', function(event) {
          const reason = event.reason;
          _post({
            type: 'LIVE_PREVIEW_ERROR',
            message: reason ? (reason.message || String(reason)) : 'Unhandled Promise Rejection',
            stack: reason && reason.stack ? reason.stack : undefined,
            timestamp: new Date().toLocaleTimeString()
          });
        });

        // Report Ready
        document.addEventListener('DOMContentLoaded', function() {
          _post({ type: 'LIVE_PREVIEW_READY' });
        });

        ${
          enableInteractivePointers
            ? `
        // Click feedback ripple simulator for live interactive feel
        window.addEventListener('pointerdown', function(e) {
          _post({
            type: 'LIVE_PREVIEW_CLICK',
            x: e.clientX,
            y: e.clientY
          });
        });
        `
            : ''
        }
      })();
    </script>
  `;

  // Safe wrapper for user JS so runtime errors are caught without failing document load
  const userScriptTag = `
    <script>
      (function() {
        try {
          ${js}
        } catch (err) {
          console.error(err);
          window.parent.postMessage({
            type: 'LIVE_PREVIEW_ERROR',
            message: err.message || String(err),
            stack: err.stack,
            timestamp: new Date().toLocaleTimeString()
          }, '*');
        }
      })();
    </script>
  `;

  return `<!DOCTYPE html>
<html lang="en" class="${isDark ? 'dark' : ''}">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="${isDark ? 'dark light' : 'light dark'}">
    <!-- Injected CDN Libraries -->
    ${externalStylesheets}
    ${externalScripts}

    <!-- Sandbox Communication Bridge -->
    ${bridgeScript}

    <style>
      /* Base Sandbox Defaults */
      html {
        color-scheme: ${isDark ? 'dark' : 'light'};
      }
      body {
        margin: 0;
        padding: 0;
        min-height: 100vh;
        background-color: ${isDark ? '#0f172a' : '#ffffff'};
        color: ${isDark ? '#f8fafc' : '#0f172a'};
      }
      /* User Custom CSS */
      ${css}
    </style>
  </head>
  <body>
    <!-- User HTML Content -->
    ${html}

    <!-- User Custom JS Execution -->
    ${userScriptTag}
  </body>
</html>`;
}

/**
 * Builds a standalone, clean exportable HTML file without debug bridges
 */
export function buildStandaloneHtml({
  html,
  css,
  js,
  libraries,
  title = 'Exported Page - HTML View + Live',
}: {
  html: string;
  css: string;
  js: string;
  libraries: CdnLibrary[];
  title?: string;
}): string {
  const externalStylesheets = libraries
    .filter((lib) => lib.enabled && lib.type === 'css')
    .map((lib) => `    <link rel="stylesheet" href="${lib.url}">`)
    .join('\n');

  const externalScripts = libraries
    .filter((lib) => lib.enabled && lib.type === 'js')
    .map((lib) => `    <script src="${lib.url}"></script>`)
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
${externalStylesheets}
${externalScripts}
    <style>
${css}
    </style>
  </head>
  <body>
${html}

    <script>
${js}
    </script>
  </body>
</html>`;
}
