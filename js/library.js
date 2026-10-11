(function () {
const { volumes, yearInfo, isConfigured, volumePageLabel } = window.CoteVolumes;
const { checkPdfAvailability, downloadOriginalPdf } = window.CoteFiles;
const availability = new Map();
const availabilityJobs = new Map();
let activeFilter = "ALL";
let activeQuery = "";
let onOpenVolume = () => {};
let onNotify = () => {};
let initialized = false;

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);
}

function coverMarkup(volume, extraClass = "") {
  const info = yearInfo[volume.year] || yearInfo.SPECIAL;
  const coverPath = volume.coverPath || "";
  return `<div class="cover-art ${info.coverClass} ${extraClass}">
    <div class="cover-mark"><span class="cover-overline">${escapeHTML(info.short)}</span><strong>${escapeHTML(volume.volumeLabel.replace(/^Vol\s*/i, ""))}</strong><small>COTE LIBRARY</small></div>
    ${coverPath ? `<img src="${escapeHTML(coverPath)}" alt="" loading="lazy" data-cover-image>` : ""}
  </div>`;
}

function setCoverFallbacks(root) {
  root.querySelectorAll("[data-cover-image]").forEach(img => {
    img.addEventListener("error", () => { img.hidden = true; }, { once: true });
    if (img.complete && img.naturalWidth === 0) img.hidden = true;
  });
}

function homeVolumeForYear(year) {
  const yearVolumes = volumes.filter(volume => volume.year === year);
  const configured = yearVolumes.filter(isConfigured).length;
  return { total: yearVolumes.length, configured };
}

function renderHome() {
  const grid = document.getElementById("home-year-grid");
  if (!grid) return;
  const cards = ["Y1", "Y2", "Y3", "SPECIAL"].map(year => {
    const info = yearInfo[year];
    const all = volumes.filter(volume => volume.year === year);
    const count = homeVolumeForYear(year);
    const sample = all[0] || { volumeLabel: year === "SPECIAL" ? "Vol 0" : "Vol 1", year, coverPath: "", title: info.label };
    const title = info.label;
    let quantity = `${count.total} ${count.total === 1 ? "entry" : "entries"}`;
    if (count.configured) quantity += ` · ${count.configured} path set`;
    if (year === "SPECIAL") quantity = "Separate special volume";
    return `<article class="year-card">
      <button type="button" class="year-card-button" data-action="browse-year" data-year="${year}" aria-label="Browse ${escapeHTML(title)}">
        ${coverMarkup(sample)}
        <div class="year-card-body"><span class="year-card-kicker">${escapeHTML(info.short)}</span><h3>${escapeHTML(title)}</h3><p>${escapeHTML(info.description)}</p><div class="year-card-bottom"><span>${escapeHTML(quantity)}</span><span aria-hidden="true">→</span></div></div>
      </button>
    </article>`;
  });
  grid.innerHTML = cards.join("");
  setCoverFallbacks(grid);
}

function statusText(volume, status) {
  if (!isConfigured(volume) || status === "unconfigured") return { text: "PDF not added yet · not configured", className: "is-error" };
  if (status === "checking" || !status) return { text: "Checking PDF file…", className: "" };
  if (status === "available") return { text: "PDF available", className: "is-available" };
  if (status === "missing") return { text: "PDF not added yet · file missing", className: "is-error" };
  return { text: "Could not verify · use a local HTTP server", className: "is-error" };
}

function cardMarkup(volume) {
  const status = isConfigured(volume) ? (availability.get(volume.id) || "checking") : "unconfigured";
  const meta = statusText(volume, status);
  const canAct = status === "available";
  return `<article class="volume-card" data-volume-card="${escapeHTML(volume.id)}">
    ${coverMarkup(volume)}
    <div class="volume-card-body">
      <span class="volume-meta">${escapeHTML(volumePageLabel(volume))}</span>
      <h3>${escapeHTML(volume.title)}</h3>
      <p class="volume-file-status ${meta.className}" data-file-status><span class="status-dot" aria-hidden="true"></span><span>${escapeHTML(meta.text)}</span></p>
      <div class="volume-actions">
        <button class="button button-read" type="button" data-read-volume="${escapeHTML(volume.id)}" ${canAct ? "" : "disabled"} aria-label="Read ${escapeHTML(volume.title)}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4.5A2.5 2.5 0 0 1 7.5 2H20v17H7.5A2.5 2.5 0 0 0 5 21.5z"/><path d="M5 4.5v17M8.5 6H16"/></svg>Read
        </button>
        <button class="button button-download" type="button" data-download-volume="${escapeHTML(volume.id)}" ${canAct ? "" : "disabled"} aria-label="Download original PDF for ${escapeHTML(volume.title)}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4"/></svg>Download
        </button>
      </div>
    </div>
  </article>`;
}

function startAvailabilityChecks(targetVolumes) {
  targetVolumes.forEach(volume => {
    if (!isConfigured(volume) || availability.has(volume.id) || availabilityJobs.has(volume.id)) return;
    availability.set(volume.id, "checking");
    const job = checkPdfAvailability(volume).then(status => {
      availability.set(volume.id, status);
      updateCardStatus(volume);
    }).finally(() => availabilityJobs.delete(volume.id));
    availabilityJobs.set(volume.id, job);
  });
}

function updateCardStatus(volume) {
  const card = document.querySelector(`[data-volume-card="${CSS.escape(volume.id)}"]`);
  if (!card) return;
  const status = availability.get(volume.id) || "checking";
  const meta = statusText(volume, status);
  const statusEl = card.querySelector("[data-file-status]");
  if (statusEl) {
    statusEl.className = `volume-file-status ${meta.className}`;
    const text = statusEl.querySelector("span:last-child");
    if (text) text.textContent = meta.text;
  }
  card.querySelectorAll("[data-read-volume], [data-download-volume]").forEach(button => { button.disabled = status !== "available"; });
}

function getVisibleVolumes() {
  return volumes.filter(volume => {
    const filterMatch = activeFilter === "ALL" || volume.year === activeFilter;
    const query = activeQuery.trim().toLocaleLowerCase();
    const queryMatch = !query || `${volume.title} ${volume.volumeLabel} ${volume.year}`.toLocaleLowerCase().includes(query);
    return filterMatch && queryMatch;
  });
}

function setLibraryFilter(filter = "ALL") {
  activeFilter = ["ALL", "Y1", "Y2", "Y3", "SPECIAL"].includes(filter) ? filter : "ALL";
  renderLibraryView();
}

function renderLibraryView() {
  const grid = document.getElementById("volume-grid");
  const tabs = document.getElementById("library-tabs");
  const summary = document.getElementById("results-summary");
  if (!grid || !tabs || !summary) return;
  tabs.querySelectorAll("[data-filter]").forEach(tab => {
    const active = tab.dataset.filter === activeFilter;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-pressed", String(active));
  });
  const visible = getVisibleVolumes();
  const configuredCount = visible.filter(isConfigured).length;
  summary.textContent = `${visible.length} ${visible.length === 1 ? "entry" : "entries"} · ${configuredCount} with configured PDF paths`;
  if (!visible.length) {
    grid.innerHTML = `<div class="library-empty"><div class="empty-symbol" aria-hidden="true">⌕</div><h3>No volumes found</h3><p>No configured entry matches “${escapeHTML(activeQuery)}”. Clear the search or choose another collection filter.</p><button class="button button-outline button-small" type="button" data-clear-search>Clear search</button></div>`;
  } else {
    grid.innerHTML = visible.map(cardMarkup).join("");
    setCoverFallbacks(grid);
    startAvailabilityChecks(visible);
  }
}

function initLibrary({ openVolume, notify }) {
  onOpenVolume = openVolume;
  onNotify = notify;
  if (initialized) return;
  initialized = true;
  document.getElementById("library-tabs")?.addEventListener("click", event => {
    const tab = event.target.closest("[data-filter]");
    if (!tab) return;
    activeFilter = tab.dataset.filter || "ALL";
    renderLibraryView();
  });
  document.getElementById("volume-search")?.addEventListener("input", event => {
    activeQuery = event.target.value || "";
    renderLibraryView();
  });
  document.getElementById("volume-grid")?.addEventListener("click", async event => {
    const clearButton = event.target.closest("[data-clear-search]");
    if (clearButton) {
      activeQuery = "";
      const input = document.getElementById("volume-search");
      if (input) input.value = "";
      renderLibraryView();
      return;
    }
    const readButton = event.target.closest("[data-read-volume]");
    const downloadButton = event.target.closest("[data-download-volume]");
    if (!readButton && !downloadButton) return;
    const id = (readButton || downloadButton).dataset.readVolume || (readButton || downloadButton).dataset.downloadVolume;
    const volume = volumes.find(item => item.id === id);
    if (!volume) return;
    if (readButton) {
      if (readButton.disabled) return;
      onOpenVolume(volume);
    } else {
      if (downloadButton.disabled) return;
      await downloadOriginalPdf(volume, onNotify);
    }
  });
  renderHome();
  renderLibraryView();
}

window.CoteLibrary = { renderHome, setLibraryFilter, renderLibraryView, initLibrary };
})();
