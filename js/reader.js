(function () {
const { isConfigured, resolveProjectPath, volumePageLabel } = window.CoteVolumes;
const { checkPdfAvailability, downloadOriginalPdf } = window.CoteFiles;
const state = {
  root: null,
  volume: null,
  pdfjs: null,
  pdfDoc: null,
  loadingTask: null,
  nativeMode: false,
  nativeFrame: null,
  nativePageCount: 0,
  nativeFit: false,
  notify: () => {},
  onBack: () => {},
  generation: 0,
  zoom: 1,
  fitScale: 1,
  currentPage: 1,
  baseViewport: null,
  pageElements: [],
  pageObserver: null,
  nearPages: new Set(),
  renderTasks: new Map(),
  renderedPages: new Map(),
  resizeObserver: null,
  resizeWidth: 0,
  framePending: false,
  tocItems: [],
  fullscreenListenerAdded: false
};
let rootHandlersAdded = false;

const icon = {
  toc: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16M4 12h16M4 19h16"/><path d="M8 3v4m0 3v4m0 3v4"/></svg>',
  prev: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>',
  next: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>',
  zoomOut: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"/><path d="M16 16 21 21M7.5 10.8h6.6"/></svg>',
  zoomIn: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"/><path d="M16 16 21 21M7.5 10.8h6.6M10.8 7.5v6.6"/></svg>',
  fit: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4"/><path d="M8 12h8"/></svg>',
  fullscreen: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/></svg>',
  download: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4"/></svg>'
};

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);
}

function template(volume) {
  return `<div class="reader-page" data-reader-shell>
    <div class="reader-topline">
      <button class="reader-back" type="button" data-reader-action="back"><span aria-hidden="true">←</span> Back to Library</button>
      <span class="reader-context">ORIGINAL PDF READER</span>
    </div>
    <div class="reader-heading">
      <h1 class="reader-title">${escapeHTML(volume.title)}</h1>
      <p class="reader-subtitle">Original PDF · Continuous vertical reading</p>
    </div>
    <div class="reader-toolbar" role="toolbar" aria-label="PDF reader controls">
      <div class="reader-toolbar-group"><button type="button" class="reader-tool primary-tool label-tool" data-reader-action="toc" aria-controls="reader-toc" aria-expanded="true" title="Toggle table of contents">${icon.toc}<span class="tool-label">Contents</span></button></div>
      <span class="reader-toolbar-divider" aria-hidden="true"></span>
      <div class="reader-toolbar-group page-nav-group">
        <button type="button" class="reader-tool" data-reader-action="previous" title="Previous page" aria-label="Previous page" disabled>${icon.prev}</button>
        <label class="page-counter"><span class="sr-only">Current page</span><input data-page-input type="number" min="1" value="1" inputmode="numeric" aria-label="Go to page" disabled><span>/</span><span class="total-pages" data-total-pages>—</span></label>
        <button type="button" class="reader-tool" data-reader-action="next" title="Next page" aria-label="Next page" disabled>${icon.next}</button>
      </div>
      <span class="reader-toolbar-divider" aria-hidden="true"></span>
      <div class="reader-toolbar-group zoom-group">
        <button type="button" class="reader-tool" data-reader-action="zoom-out" title="Zoom out" aria-label="Zoom out" disabled>${icon.zoomOut}</button>
        <span class="zoom-label" data-zoom-label>100%</span>
        <button type="button" class="reader-tool" data-reader-action="zoom-in" title="Zoom in" aria-label="Zoom in" disabled>${icon.zoomIn}</button>
        <button type="button" class="reader-tool label-tool" data-reader-action="fit" title="Fit to width" aria-label="Fit to width" disabled>${icon.fit}<span class="tool-label">Fit</span></button>
      </div>
      <span class="reader-toolbar-divider" aria-hidden="true"></span>
      <button type="button" class="reader-tool label-tool" data-reader-action="fullscreen" title="Enter fullscreen" aria-label="Enter fullscreen" aria-pressed="false">${icon.fullscreen}<span class="tool-label">Fullscreen</span></button>
      <button type="button" class="reader-tool download-tool" data-reader-action="download" title="Download original PDF" aria-label="Download original PDF" ${isConfigured(volume) ? "" : "disabled"}>${icon.download}<span class="tool-label">Download PDF</span></button>
    </div>
    <div class="reader-layout" data-reader-layout>
      <aside class="reader-toc" id="reader-toc" aria-label="Table of contents">
        <div class="toc-header"><h2>Table of contents</h2><button class="toc-close" type="button" data-reader-action="toc-close" aria-label="Close contents">×</button></div>
        <nav class="toc-list" data-toc-list><p class="toc-empty">Loading table of contents…</p></nav>
      </aside>
      <button type="button" class="reader-shade" data-reader-action="toc-close" aria-label="Close table of contents"></button>
      <section class="reader-document-panel" aria-label="PDF pages">
        <div class="reader-document-header"><span>${escapeHTML(volumePageLabel(volume))}</span><span class="scroll-hint">Scroll to continue reading ↓</span></div>
        <div class="reader-document" data-reader-document tabindex="0" aria-label="Scrollable PDF pages">
          <div class="reader-pages" data-reader-pages><div class="reader-status"><span class="reader-spinner" aria-hidden="true"></span><p>Preparing your document…</p></div></div>
        </div>
      </section>
    </div>
    <div class="reader-footnote"><span>Pages are rendered from your original PDF.</span><span data-reader-progress>Preparing document…</span></div>
  </div>`;
}

function rootElement() {
  return state.root || document.getElementById("reader-root");
}

function actionButton(action) {
  return rootElement()?.querySelector(`[data-reader-action="${action}"]`) || null;
}

function showLoading(message = "Opening the original PDF…") {
  const pages = rootElement()?.querySelector("[data-reader-pages]");
  if (pages) pages.innerHTML = `<div class="reader-status"><span class="reader-spinner" aria-hidden="true"></span><p>${escapeHTML(message)}</p></div>`;
  const progress = rootElement()?.querySelector("[data-reader-progress]");
  if (progress) progress.textContent = "Loading…";
}

function showError(title, message, detail = "", downloadAvailable = false) {
  const pages = rootElement()?.querySelector("[data-reader-pages]");
  if (pages) pages.innerHTML = `<div class="reader-status"><div class="status-symbol" aria-hidden="true">!</div><h3>${escapeHTML(title)}</h3><p>${escapeHTML(message)}</p>${detail ? `<p class="status-detail">${escapeHTML(detail)}</p>` : ""}<button class="button button-outline button-small" type="button" data-reader-action="back"><span aria-hidden="true">←</span> Back to Library</button></div>`;
  const progress = rootElement()?.querySelector("[data-reader-progress]");
  if (progress) progress.textContent = "Document unavailable";
  setControlsEnabled(false);
  const download = actionButton("download");
  if (download) download.disabled = !downloadAvailable;
  const toc = rootElement()?.querySelector("[data-toc-list]");
  if (toc) toc.innerHTML = `<p class="toc-empty">No table of contents available for this PDF.</p>`;
}

function setControlsEnabled(enabled) {
  const root = rootElement();
  if (!root) return;
  ["previous", "next", "zoom-out", "zoom-in", "fit"].forEach(action => {
    const button = actionButton(action);
    if (button) button.disabled = !enabled;
  });
  const input = root.querySelector("[data-page-input]");
  if (input) input.disabled = !enabled;
  if (enabled) updateToolbar();
}

function updateToolbar() {
  if (!state.pdfDoc && !state.nativeMode) return;
  const root = rootElement();
  if (!root) return;
  const totalPages = state.pdfDoc?.numPages || state.nativePageCount || 1;
  const previous = actionButton("previous");
  const next = actionButton("next");
  const input = root.querySelector("[data-page-input]");
  const total = root.querySelector("[data-total-pages]");
  const zoom = root.querySelector("[data-zoom-label]");
  if (previous) previous.disabled = state.currentPage <= 1;
  if (next) next.disabled = state.currentPage >= totalPages;
  if (input) { input.value = String(state.currentPage); input.max = String(totalPages); }
  if (total) total.textContent = String(totalPages);
  if (zoom) zoom.textContent = state.nativeMode && state.nativeFit ? "Fit" : `${Math.round(state.zoom * 100)}%`;
  const progress = root.querySelector("[data-reader-progress]");
  if (progress) progress.textContent = state.nativeMode
    ? `Browser PDF viewer · ${totalPages} pages`
    : `Page ${state.currentPage} of ${totalPages}`;
  root.querySelectorAll("[data-toc-page]").forEach(item => item.classList.toggle("active", Number(item.dataset.tocPage) === state.currentPage));
}

function scrollToPage(pageNumber, behavior = "smooth") {
  const root = rootElement();
  const scroller = root?.querySelector("[data-reader-document]");
  const page = state.pageElements[pageNumber - 1];
  if (!scroller || !page) return;
  const top = page.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop - 10;
  scroller.scrollTo({ top: Math.max(0, top), behavior });
  state.currentPage = pageNumber;
  updateToolbar();
  scheduleRender(pageNumber);
}

function goToPage(pageNumber, behavior = "smooth") {
  if ((!state.pdfDoc && !state.nativeMode) || !Number.isFinite(Number(pageNumber))) return;
  const total = state.pdfDoc?.numPages || state.nativePageCount || 1;
  const target = Math.min(total, Math.max(1, Math.round(Number(pageNumber))));
  if (state.nativeMode) {
    state.currentPage = target;
    setNativeFrameLocation();
    updateToolbar();
    return;
  }
  scrollToPage(target, behavior);
}

function updateCurrentPage() {
  if (!state.pdfDoc) return;
  const scroller = rootElement()?.querySelector("[data-reader-document]");
  if (!scroller) return;
  const scrollerRect = scroller.getBoundingClientRect();
  const probe = scrollerRect.top + Math.min(100, scroller.clientHeight * 0.18);
  let selected = state.currentPage;
  let bestDistance = Infinity;
  state.nearPages.forEach(element => {
    const rect = element.getBoundingClientRect();
    if (rect.bottom <= scrollerRect.top || rect.top >= scrollerRect.bottom) return;
    if (rect.top <= probe && rect.bottom > probe) {
      const distance = Math.abs(rect.top - probe);
      if (distance < bestDistance) { bestDistance = distance; selected = Number(element.dataset.pageNumber); }
    } else if (bestDistance === Infinity) {
      const distance = Math.abs(rect.top - probe);
      if (distance < bestDistance) { bestDistance = distance; selected = Number(element.dataset.pageNumber); }
    }
  });
  if (selected >= 1 && selected <= state.pdfDoc.numPages && selected !== state.currentPage) {
    state.currentPage = selected;
    updateToolbar();
  }
}

function scheduleCurrentUpdate() {
  if (state.framePending) return;
  state.framePending = true;
  requestAnimationFrame(() => { state.framePending = false; updateCurrentPage(); trimRenderedPages(); });
}

function availableContentWidth(scroller) {
  const style = getComputedStyle(scroller);
  const padding = (parseFloat(style.paddingLeft) || 0) + (parseFloat(style.paddingRight) || 0);
  return Math.max(180, scroller.clientWidth - padding - 4);
}

function scaleForWidth() {
  const scroller = rootElement()?.querySelector("[data-reader-document]");
  if (!scroller || !state.baseViewport) return 1;
  return availableContentWidth(scroller) / state.baseViewport.width;
}

function setPageBox(element, width, height) {
  element.style.width = `${Math.max(1, width)}px`;
  element.style.height = `${Math.max(1, height)}px`;
}

function cancelRenderTasks() {
  state.renderTasks.forEach(task => { try { task.cancel(); } catch { /* already completed */ } });
  state.renderTasks.clear();
}

function clearRenderedCanvases() {
  cancelRenderTasks();
  state.renderedPages.clear();
  state.pageElements.forEach(element => {
    const canvas = element.querySelector("canvas");
    if (canvas) canvas.remove();
    element.classList.remove("rendered");
    const skeleton = element.querySelector(".page-skeleton");
    if (skeleton) skeleton.textContent = `Page ${element.dataset.pageNumber}`;
  });
}

function layoutPageBoxes() {
  if (!state.pdfDoc || !state.baseViewport) return;
  state.fitScale = scaleForWidth();
  const width = state.baseViewport.width * state.fitScale * state.zoom;
  const height = state.baseViewport.height * state.fitScale * state.zoom;
  const pagesRoot = rootElement()?.querySelector("[data-reader-pages]");
  if (pagesRoot) pagesRoot.style.alignItems = state.zoom > 1 ? "flex-start" : "center";
  state.pageElements.forEach(element => setPageBox(element, width, height));
  const root = rootElement();
  const zoomLabel = root?.querySelector("[data-zoom-label]");
  if (zoomLabel) zoomLabel.textContent = `${Math.round(state.zoom * 100)}%`;
}

function applyZoom(nextZoom) {
  if (state.nativeMode) {
    state.zoom = Math.min(2.5, Math.max(0.5, Math.round(nextZoom * 100) / 100));
    state.nativeFit = false;
    setNativeFrameLocation();
    updateToolbar();
    return;
  }
  if (!state.pdfDoc) return;
  const pageToKeep = state.currentPage;
  state.zoom = Math.min(2.5, Math.max(0.5, Math.round(nextZoom * 100) / 100));
  clearRenderedCanvases();
  layoutPageBoxes();
  scrollToPage(pageToKeep, "auto");
  state.nearPages.forEach(element => scheduleRender(Number(element.dataset.pageNumber)));
}

async function renderPage(pageNumber) {
  if (!state.pdfDoc || pageNumber < 1 || pageNumber > state.pdfDoc.numPages) return;
  const generation = state.generation;
  const element = state.pageElements[pageNumber - 1];
  if (!element) return;
  const scaleKey = `${state.fitScale.toFixed(4)}-${state.zoom.toFixed(2)}`;
  if (state.renderedPages.get(pageNumber) === scaleKey || state.renderTasks.has(pageNumber)) return;
  let task = null;
  try {
    const page = await state.pdfDoc.getPage(pageNumber);
    if (generation !== state.generation || !state.pdfDoc) return;
    if (scaleKey !== `${state.fitScale.toFixed(4)}-${state.zoom.toFixed(2)}`) return;
    const viewport = page.getViewport({ scale: state.fitScale * state.zoom });
    setPageBox(element, viewport.width, viewport.height);
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-label", `PDF page ${pageNumber}`);
    canvas.setAttribute("role", "img");
    const pixelArea = Math.max(1, viewport.width * viewport.height);
    const pixelRatio = Math.max(0.5, Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(3500000 / pixelArea)));
    canvas.width = Math.max(1, Math.floor(viewport.width * pixelRatio));
    canvas.height = Math.max(1, Math.floor(viewport.height * pixelRatio));
    canvas.style.width = `${viewport.width}px`;
    canvas.style.height = `${viewport.height}px`;
    const oldCanvas = element.querySelector("canvas");
    if (oldCanvas) oldCanvas.remove();
    element.insertBefore(canvas, element.firstChild);
    const context = canvas.getContext("2d", { alpha: false });
    task = page.render({ canvasContext: context, viewport, transform: pixelRatio === 1 ? null : [pixelRatio, 0, 0, pixelRatio, 0, 0], background: "rgb(255,255,255)" });
    state.renderTasks.set(pageNumber, task);
    await task.promise;
    if (generation !== state.generation) return;
    if (scaleKey !== `${state.fitScale.toFixed(4)}-${state.zoom.toFixed(2)}`) { canvas.remove(); return; }
    state.renderedPages.set(pageNumber, scaleKey);
    element.classList.add("rendered");
    const skeleton = element.querySelector(".page-skeleton");
    if (skeleton) skeleton.textContent = `Page ${pageNumber}`;
    trimRenderedPages();
  } catch (error) {
    if (error?.name !== "RenderingCancelledException" && generation === state.generation) {
      const skeleton = element.querySelector(".page-skeleton");
      if (skeleton) skeleton.textContent = `Page ${pageNumber} could not be rendered`;
    }
  } finally {
    if (task && state.renderTasks.get(pageNumber) === task) state.renderTasks.delete(pageNumber);
  }
}

function scheduleRender(pageNumber) {
  if (state.pdfDoc) void renderPage(pageNumber);
}

function trimRenderedPages() {
  if (state.renderedPages.size <= 12) return;
  const keep = new Set();
  for (let n = Math.max(1, state.currentPage - 5); n <= Math.min(state.pdfDoc?.numPages || 1, state.currentPage + 6); n++) keep.add(n);
  state.nearPages.forEach(element => keep.add(Number(element.dataset.pageNumber)));
  for (const [number] of state.renderedPages) {
    if (keep.has(number)) continue;
    const element = state.pageElements[number - 1];
    const task = state.renderTasks.get(number);
    if (task) { try { task.cancel(); } catch { /* ignore */ } state.renderTasks.delete(number); }
    const canvas = element?.querySelector("canvas");
    if (canvas) canvas.remove();
    element?.classList.remove("rendered");
    state.renderedPages.delete(number);
  }
}

function setupPageObservers() {
  if (state.pageObserver) state.pageObserver.disconnect();
  state.nearPages.clear();
  const scroller = rootElement()?.querySelector("[data-reader-document]");
  if (!scroller || !("IntersectionObserver" in window)) {
    const updateFallback = () => {
      const box = scroller?.getBoundingClientRect();
      if (!box) return;
      const probe = box.top + Math.min(100, scroller.clientHeight * 0.18);
      let selected = 1;
      for (const element of state.pageElements) {
        const rect = element.getBoundingClientRect();
        if (rect.top <= probe) selected = Number(element.dataset.pageNumber);
        if (rect.top > probe) break;
      }
      state.currentPage = selected;
      for (let n = Math.max(1, selected - 2); n <= Math.min(state.pageElements.length, selected + 2); n++) {
        const element = state.pageElements[n - 1];
        state.nearPages.add(element);
        scheduleRender(n);
      }
      state.nearPages.forEach(element => {
        const n = Number(element.dataset.pageNumber);
        if (Math.abs(n - selected) > 4) state.nearPages.delete(element);
      });
      updateToolbar();
      trimRenderedPages();
    };
    if (scroller) scroller.addEventListener("scroll", updateFallback, { passive: true });
    updateFallback();
    return;
  }
  state.pageObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        state.nearPages.add(entry.target);
        scheduleRender(Number(entry.target.dataset.pageNumber));
      } else {
        state.nearPages.delete(entry.target);
      }
    });
    updateCurrentPage();
    trimRenderedPages();
  }, { root: scroller, rootMargin: "650px 0px 650px 0px", threshold: 0 });
  state.pageElements.forEach(element => state.pageObserver.observe(element));
}

function buildPageElements() {
  const root = rootElement();
  const pagesRoot = root?.querySelector("[data-reader-pages]");
  if (!pagesRoot || !state.pdfDoc || !state.baseViewport) return;
  state.pageElements = [];
  pagesRoot.innerHTML = "";
  const width = state.baseViewport.width * state.fitScale * state.zoom;
  const height = state.baseViewport.height * state.fitScale * state.zoom;
  const fragment = document.createDocumentFragment();
  for (let i = 1; i <= state.pdfDoc.numPages; i++) {
    const page = document.createElement("div");
    page.className = "pdf-page";
    page.dataset.pageNumber = String(i);
    page.id = `pdf-page-${i}`;
    page.setAttribute("aria-label", `PDF page ${i}`);
    setPageBox(page, width, height);
    const skeleton = document.createElement("div");
    skeleton.className = "page-skeleton";
    skeleton.textContent = `Page ${i}`;
    page.append(skeleton);
    state.pageElements.push(page);
    fragment.append(page);
  }
  pagesRoot.append(fragment);
  setupPageObservers();
}

async function resolveOutlinePage(destination) {
  if (!state.pdfDoc || destination == null) return null;
  try {
    let dest = destination;
    if (typeof dest === "string") dest = await state.pdfDoc.getDestination(dest);
    if (!Array.isArray(dest) || !dest.length) return null;
    if (Number.isInteger(dest[0])) return dest[0] + 1;
    return (await state.pdfDoc.getPageIndex(dest[0])) + 1;
  } catch { return null; }
}

async function flattenPdfOutline(items, depth = 0, output = []) {
  if (!Array.isArray(items)) return output;
  for (const item of items) {
    const page = await resolveOutlinePage(item.dest);
    output.push({ title: item.title || "Untitled bookmark", page, depth: Math.min(depth, 3) });
    if (Array.isArray(item.items) && item.items.length) await flattenPdfOutline(item.items, depth + 1, output);
  }
  return output;
}

function tocMarkup(items) {
  const list = rootElement()?.querySelector("[data-toc-list]");
  if (!list) return;
  const usable = items.filter(item => item.title && Number.isInteger(item.page) && item.page >= 1 && item.page <= (state.pdfDoc?.numPages || state.nativePageCount || Infinity));
  if (!usable.length) {
    list.innerHTML = `<p class="toc-empty">No table of contents available for this PDF.</p>`;
    return;
  }
  list.innerHTML = usable.map(item => `<button type="button" class="toc-item level-${item.depth || 0}" data-toc-page="${item.page}" title="Go to page ${item.page}"><span class="toc-page">${item.page}</span>${escapeHTML(item.title)}</button>`).join("");
  state.tocItems = usable;
}

async function loadTableOfContents() {
  let actualOutline = [];
  try { actualOutline = await state.pdfDoc.getOutline() || []; } catch { actualOutline = []; }
  if (actualOutline.length) {
    const flattened = await flattenPdfOutline(actualOutline);
    const usable = flattened.filter(item => Number.isInteger(item.page) && item.page >= 1 && item.page <= state.pdfDoc.numPages);
    if (usable.length) { tocMarkup(usable); return; }
  }
  const manual = Array.isArray(state.volume.toc) ? state.volume.toc : [];
  const valid = manual.filter(item => item && typeof item.title === "string" && item.title.trim() && Number.isInteger(Number(item.page)) && Number(item.page) >= 1 && Number(item.page) <= state.pdfDoc.numPages)
    .map(item => ({ title: item.title.trim(), page: Number(item.page), depth: Math.max(0, Math.min(3, Number(item.depth) || 0)) }));
  tocMarkup(valid);
}

function toggleTOC(force) {
  const root = rootElement();
  const toc = root?.querySelector(".reader-toc");
  const layout = root?.querySelector("[data-reader-layout]");
  const shade = root?.querySelector(".reader-shade");
  const button = actionButton("toc");
  if (!toc || !layout) return;
  const mobile = window.matchMedia("(max-width: 680px)").matches;
  const currentlyOpen = mobile ? toc.classList.contains("is-open") : !toc.hidden;
  const open = typeof force === "boolean" ? force : !currentlyOpen;
  if (mobile) {
    toc.classList.toggle("is-open", open);
    if (shade) shade.classList.toggle("is-visible", open);
    toc.hidden = false;
  } else {
    toc.classList.remove("is-open");
    if (shade) shade.classList.remove("is-visible");
    toc.hidden = !open;
    layout.classList.toggle("toc-hidden", !open);
  }
  button?.setAttribute("aria-expanded", String(open));
}

function syncFullscreenButton() {
  const root = rootElement();
  const shell = root?.querySelector("[data-reader-shell]");
  const fullscreen = Boolean(shell && document.fullscreenElement === shell);
  const button = actionButton("fullscreen");
  if (!button) return;
  button.setAttribute("aria-pressed", String(fullscreen));
  button.title = fullscreen ? "Exit fullscreen" : "Enter fullscreen";
  button.setAttribute("aria-label", fullscreen ? "Exit fullscreen" : "Enter fullscreen");
  const label = button.querySelector(".tool-label");
  if (label) label.textContent = fullscreen ? "Exit fullscreen" : "Fullscreen";
}

async function toggleFullscreen() {
  const shell = rootElement()?.querySelector("[data-reader-shell]");
  if (!shell) return;
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else if (shell.requestFullscreen) {
      await shell.requestFullscreen();
    } else {
      state.notify("Fullscreen is not supported by this browser.", "error");
    }
  } catch {
    state.notify("The browser could not change fullscreen mode. Check browser permissions.", "error");
  }
  syncFullscreenButton();
}

function handleRootClick(event) {
  const target = event.target.closest("[data-reader-action], [data-toc-page]");
  if (!target) return;
  if (target.hasAttribute("data-toc-page")) {
    const page = Number(target.dataset.tocPage);
    if (Number.isInteger(page)) {
      goToPage(page);
      if (window.matchMedia("(max-width: 680px)").matches) toggleTOC(false);
    }
    return;
  }
  switch (target.dataset.readerAction) {
    case "back": state.onBack(); break;
    case "toc": toggleTOC(); break;
    case "toc-close": toggleTOC(false); break;
    case "previous": goToPage(state.currentPage - 1); break;
    case "next": goToPage(state.currentPage + 1); break;
    case "zoom-out": applyZoom(state.zoom - 0.15); break;
    case "zoom-in": applyZoom(state.zoom + 0.15); break;
    case "fit":
      if (state.nativeMode) { state.nativeFit = true; setNativeFrameLocation(); updateToolbar(); }
      else applyZoom(1);
      break;
    case "fullscreen": void toggleFullscreen(); break;
    case "download": if (state.volume) void downloadOriginalPdf(state.volume, state.notify); break;
  }
}

function setupRootHandlers() {
  const root = document.getElementById("reader-root");
  if (!root || rootHandlersAdded) return;
  rootHandlersAdded = true;
  root.addEventListener("click", handleRootClick);
  root.addEventListener("change", event => {
    const input = event.target.closest("[data-page-input]");
    if (input) goToPage(Number(input.value));
  });
  root.addEventListener("keydown", event => {
    const input = event.target.closest("[data-page-input]");
    if (input && event.key === "Enter") { goToPage(Number(input.value)); input.blur(); }
  });
  root.addEventListener("scroll", event => {
    if (event.target.matches("[data-reader-document]")) scheduleCurrentUpdate();
  }, true);
  if (!state.fullscreenListenerAdded) {
    document.addEventListener("fullscreenchange", syncFullscreenButton);
    state.fullscreenListenerAdded = true;
  }
}

function cleanupDocument() {
  state.generation++;
  if (state.pageObserver) { state.pageObserver.disconnect(); state.pageObserver = null; }
  if (state.resizeObserver) { state.resizeObserver.disconnect(); state.resizeObserver = null; }
  cancelRenderTasks();
  state.renderedPages.clear();
  state.nearPages.clear();
  state.pageElements = [];
  state.tocItems = [];
  state.nativeMode = false;
  state.nativeFrame = null;
  state.nativePageCount = 0;
  state.nativeFit = false;
  if (state.loadingTask) {
    try { state.loadingTask.destroy(); } catch { /* already destroyed */ }
    state.loadingTask = null;
  }
  if (state.pdfDoc) {
    try { state.pdfDoc.destroy(); } catch { /* already destroyed */ }
    state.pdfDoc = null;
  }
}

function setNativeFrameLocation() {
  if (!state.nativeMode || !state.nativeFrame || !state.volume) return;
  const path = resolveProjectPath(state.volume.pdfPath);
  if (!path) return;
  const url = new URL(path);
  const zoom = state.nativeFit ? "page-width" : String(Math.round(state.zoom * 100));
  url.hash = `page=${Math.min(state.nativePageCount || 1, Math.max(1, state.currentPage))}&zoom=${zoom}`;
  state.nativeFrame.src = url.href;
}

function activateNativeFallback(volume, reason, generation) {
  if (generation !== state.generation) return;
  // Invalidate any in-flight PDF.js rendering and release its resources before switching renderers.
  cleanupDocument();
  state.nativeMode = true;
  state.nativePageCount = Math.max(1, Number(volume.pageCount) || 1);
  state.currentPage = 1;
  state.zoom = 1;
  state.nativeFit = true;
  state.volume = volume;
  const root = rootElement();
  const scroller = root?.querySelector("[data-reader-document]");
  if (!root || !scroller) return;
  scroller.classList.add("native-mode");
  const path = resolveProjectPath(volume.pdfPath);
  let nativeUrl = path;
  try { const u = new URL(path); u.hash = "page=1&zoom=page-width"; nativeUrl = u.href; } catch { /* path verification already ran */ }
  scroller.innerHTML = `
    <div class="native-reader-note" role="status">
      <span><strong>Original PDF reader</strong> · This mode works when you double-click index.html. The PDF itself remains original; use the controls above to jump to pages and zoom.</span>
      <a href="${escapeHTML(path)}" target="_blank" rel="noopener noreferrer">Open in new tab ↗</a>
    </div>
    <iframe class="native-pdf-frame" data-native-pdf title="${escapeHTML(volume.title)} PDF" src="${escapeHTML(nativeUrl)}"></iframe>`;
  state.nativeFrame = scroller.querySelector("[data-native-pdf]");
  const tocList = root.querySelector("[data-toc-list]");
  const manual = Array.isArray(volume.toc) ? volume.toc.filter(item => item && typeof item.title === "string" && item.title.trim() && Number.isInteger(Number(item.page)) && Number(item.page) >= 1 && Number(item.page) <= state.nativePageCount).map(item => ({ title: item.title.trim(), page: Number(item.page), depth: Math.max(0, Math.min(3, Number(item.depth) || 0)) })) : [];
  if (manual.length) tocMarkup(manual);
  else if (tocList) tocList.innerHTML = `<p class="toc-empty">No usable bookmarks were found in this PDF. The rest of the reader still works; the PDF's built-in viewer may offer its own outline if one exists.</p>`;
  setControlsEnabled(true);
  updateToolbar();
  const progress = root.querySelector("[data-reader-progress]");
  if (progress) progress.textContent = `Browser PDF viewer · ${state.nativePageCount} pages`;
  if (reason && reason !== "direct-file-mode") state.notify("The original PDF has been opened in the browser's built-in viewer.", "info");
}

async function loadReaderDocument(volume, generation) {
  if (!isConfigured(volume)) {
    showError("PDF not added yet", "This volume does not have a configured PDF filename. Add the real filename and relative path in js/volumes.js.");
    return;
  }
  // file:// cannot fetch local resources through JavaScript. Open the unchanged
  // original PDF in the browser's native viewer; no server or install is needed.
  if (window.location.protocol === "file:") {
    activateNativeFallback(volume, "direct-file-mode", generation);
    return;
  }
  const availability = await checkPdfAvailability(volume);
  if (generation !== state.generation) return;
  if (availability === "missing") {
    showError("PDF not added yet", "The configured PDF file could not be found. Place your original file at the path below, or correct the path in js/volumes.js.", volume.pdfPath);
    return;
  }
  if (availability !== "available") {
    showError("Unable to verify the PDF file", "Open this project through a local HTTP server (not by double-clicking index.html), then check the configured path and try again.", volume.pdfPath);
    return;
  }

  let pdfjs;
  try {
    pdfjs = await import(new URL("./vendor/pdfjs/pdf.mjs", document.baseURI).href);
  } catch (error) {
    activateNativeFallback(volume, "pdfjs-missing", generation);
    return;
  }
  if (generation !== state.generation) return;
  state.pdfjs = pdfjs;
  const workerUrl = new URL("./vendor/pdfjs/pdf.worker.mjs", document.baseURI).href;
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
  const pdfUrl = resolveProjectPath(volume.pdfPath);
  const assetRoot = new URL("./vendor/pdfjs/", document.baseURI).href;
  showLoading("Opening PDF and reading its page information…");
  try {
    state.loadingTask = pdfjs.getDocument({
      url: pdfUrl,
      cMapUrl: `${assetRoot}cmaps/`,
      cMapPacked: true,
      standardFontDataUrl: `${assetRoot}standard_fonts/`,
      wasmUrl: `${assetRoot}wasm/`,
      isEvalSupported: false
    });
    state.loadingTask.onProgress = progress => {
      if (generation !== state.generation) return;
      const progressText = progress?.total ? `Loading PDF · ${Math.min(99, Math.round(progress.loaded / progress.total * 100))}%` : "Loading PDF…";
      const status = rootElement()?.querySelector(".reader-status p");
      if (status) status.textContent = progressText;
    };
    const doc = await state.loadingTask.promise;
    if (generation !== state.generation) { try { await doc.destroy(); } catch {} return; }
    state.pdfDoc = doc;
    state.loadingTask = null;
    state.currentPage = 1;
    state.zoom = 1;
    const firstPage = await doc.getPage(1);
    if (generation !== state.generation) return;
    state.baseViewport = firstPage.getViewport({ scale: 1 });
    state.fitScale = scaleForWidth();
    buildPageElements();
    setControlsEnabled(true);
    updateToolbar();
    const tocButton = actionButton("toc");
    tocButton?.setAttribute("aria-expanded", "true");
    const tocList = rootElement()?.querySelector("[data-toc-list]");
    if (tocList) tocList.innerHTML = `<p class="toc-empty">Reading PDF bookmarks…</p>`;
    await loadTableOfContents();
    if (generation !== state.generation) return;
    const firstElement = state.pageElements[0];
    if (firstElement) {
      state.nearPages.add(firstElement);
      scheduleRender(1);
    }
    const scroller = rootElement()?.querySelector("[data-reader-document]");
    if (scroller && "ResizeObserver" in window) {
      state.resizeWidth = scroller.clientWidth;
      state.resizeObserver = new ResizeObserver(() => {
        const newWidth = scroller.clientWidth;
        if (Math.abs(newWidth - state.resizeWidth) > 5 && state.pdfDoc) {
          state.resizeWidth = newWidth;
          const page = state.currentPage;
          clearRenderedCanvases();
          layoutPageBoxes();
          scrollToPage(page, "auto");
          state.nearPages.forEach(element => scheduleRender(Number(element.dataset.pageNumber)));
        }
      });
      state.resizeObserver.observe(scroller);
    }
    const progress = rootElement()?.querySelector("[data-reader-progress]");
    if (progress) progress.textContent = `${doc.numPages} pages · PDF ready`;
  } catch (error) {
    if (generation !== state.generation) return;
    const raw = String(error?.message || error || "Unknown PDF.js error");
    if (/worker|module script|failed to fetch dynamically imported/i.test(raw)) {
      activateNativeFallback(volume, raw, generation);
    } else if (/Invalid PDF|PDF header|parsing/i.test(raw)) {
      showError("This file is not a readable PDF", "Check that the original PDF is valid and that the configured path points to the PDF itself, not an HTML page.", raw, true);
    } else {
      showError("Could not open this PDF", "The reader could not load the document. Check the file path, worker files, browser console, and local server logs.", raw, true);
    }
  }
}

function openReader(volume, notify = () => {}, onBack = () => {}) {
  setupRootHandlers();
  cleanupDocument();
  state.root = document.getElementById("reader-root");
  state.volume = volume;
  state.notify = notify;
  state.onBack = onBack;
  state.zoom = 1;
  state.currentPage = 1;
  state.baseViewport = null;
  if (!state.root) return;
  state.root.innerHTML = template(volume);
  state.root.querySelector("[data-reader-document]")?.addEventListener("scroll", scheduleCurrentUpdate, { passive: true });
  toggleTOC(true);
  const generation = state.generation;
  void loadReaderDocument(volume, generation);
}

function closeReader() {
  cleanupDocument();
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  state.volume = null;
  state.baseViewport = null;
  state.root = document.getElementById("reader-root");
  if (state.root) state.root.innerHTML = "";
}

window.CoteReader = { openReader, closeReader };
})();
