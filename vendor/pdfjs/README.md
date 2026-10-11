# PDF.js runtime dependency

The build environment used to package this project could not connect to GitHub, so the official PDF.js JavaScript runtime and worker are **not bundled in this ZIP**. No fake placeholder library files are included.

On Windows with Internet, run `tools/Install-PDFjs.bat` (which invokes `Install-PDFjs.ps1`). On macOS/Linux, run `sh tools/Install-PDFjs.sh`. The installer retrieves the official Mozilla PDF.js v6.4.299 distribution and copies `pdf.mjs`, its matching `pdf.worker.mjs`, available support assets, and license into this folder.

The website attempts to use these local files. Until they are installed, it uses the browser's built-in PDF viewer as a fallback for reading the original PDF. No external CDN is requested by the website at runtime.

Keep the module and worker from the same release. Official sources: https://github.com/mozilla/pdf.js/releases and https://github.com/mozilla/pdf.js/wiki/Setup-pdf.js-in-a-website
