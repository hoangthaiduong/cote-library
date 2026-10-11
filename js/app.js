(function () {
const { findVolume } = window.CoteVolumes;
const { renderHome, initLibrary, renderLibraryView, setLibraryFilter } = window.CoteLibrary;
const { openReader, closeReader } = window.CoteReader;
const views = {
  home: document.getElementById("home-view"),
  library: document.getElementById("library-view"),
  reader: document.getElementById("reader-view")
};
let currentView = "home";
let currentVolumeId = "";
let toastSequence = 0;

function notify(message, kind = "info") {
  const region = document.getElementById("toast-region");
  if (!region || !message) return;
  const toast = document.createElement("div");
  toast.className = `toast ${kind === "error" ? "error" : kind === "success" ? "success" : ""}`;
  toast.setAttribute("role", kind === "error" ? "alert" : "status");
  toast.textContent = message;
  const id = ++toastSequence;
  toast.dataset.toastId = String(id);
  region.append(toast);
  window.setTimeout(() => toast.remove(), kind === "error" ? 6000 : 3800);
}

function updateNav() {
  document.querySelectorAll(".nav-link[data-action]").forEach(link => {
    link.classList.toggle("active", link.dataset.action === (currentView === "reader" ? "library" : currentView));
  });
}

function setLocation(view, data = {}, push = true) {
  const url = new URL("./index.html", window.location.href);
  if (view !== "home") url.searchParams.set("view", view);
  if (data.filter && data.filter !== "ALL") url.searchParams.set("filter", data.filter);
  if (data.volumeId) url.searchParams.set("id", data.volumeId);
  const state = { view, filter: data.filter || "ALL", volumeId: data.volumeId || "" };
  try {
    if (push) window.history.pushState(state, "", url);
    else window.history.replaceState(state, "", url);
  } catch {
    // Direct file launch works even if this browser disallows History API updates.
  }
}

function navigate(view, data = {}, options = {}) {
  const push = options.push !== false;
  if (!views[view]) view = "home";
  if (view !== "reader" && currentView === "reader") closeReader();
  if (view === "reader") {
    const volume = findVolume(data.volumeId || currentVolumeId);
    if (!volume) {
      notify("That volume is not configured in js/volumes.js.", "error");
      view = "library";
    } else {
      currentVolumeId = volume.id;
    }
  }
  currentView = view;
  Object.entries(views).forEach(([name, element]) => { element.hidden = name !== view; });
  document.querySelector(".primary-nav")?.classList.remove("is-open");
  document.querySelector(".menu-toggle")?.setAttribute("aria-expanded", "false");
  updateNav();

  if (view === "home") renderHome();
  if (view === "library") {
    const filter = data.filter || (options.keepFilter ? undefined : "ALL");
    if (filter) setLibraryFilter(filter);
    else renderLibraryView();
  }
  if (view === "reader") {
    const volume = findVolume(currentVolumeId);
    if (volume) openReader(volume, notify, () => navigate("library", { filter: "ALL" }));
  }
  if (push) setLocation(view, { filter: data.filter || "ALL", volumeId: currentVolumeId }, true);
  if (!options.preserveScroll) window.scrollTo({ top: 0, behavior: "auto" });
}

function applyTheme(theme) {
  const selected = theme === "dark" ? "dark" : "light";
  document.documentElement.dataset.theme = selected;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", selected === "dark" ? "#171719" : "#f4f4f2");
  const button = document.querySelector("[data-action='theme']");
  if (button) {
    button.setAttribute("aria-label", selected === "dark" ? "Switch to light theme" : "Switch to dark theme");
    const label = button.querySelector(".theme-label");
    if (label) label.textContent = selected === "dark" ? "Light mode" : "Dark mode";
    button.title = selected === "dark" ? "Switch to light theme" : "Switch to dark theme";
  }
  try { localStorage.setItem("cote-library-theme", selected); } catch { /* Storage may be disabled. */ }
}

function toggleTheme() {
  applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
}

function readInitialState() {
  const url = new URL(window.location.href);
  const view = url.searchParams.get("view") || "home";
  const filter = url.searchParams.get("filter") || "ALL";
  const volumeId = url.searchParams.get("id") || "";
  return { view: ["home", "library", "reader"].includes(view) ? view : "home", filter, volumeId };
}

function init() {
  let savedTheme = "light";
  try { savedTheme = localStorage.getItem("cote-library-theme") || "light"; } catch { /* no storage */ }
  applyTheme(savedTheme);

  initLibrary({
    openVolume: volume => navigate("reader", { volumeId: volume.id }),
    notify
  });

  document.addEventListener("click", event => {
    const actionButton = event.target.closest("[data-action]");
    if (!actionButton) return;
    const action = actionButton.dataset.action;
    if (action === "home") {
      event.preventDefault();
      navigate("home");
    } else if (action === "library") {
      event.preventDefault();
      navigate("library", { filter: "ALL" });
    } else if (action === "browse-year") {
      event.preventDefault();
      navigate("library", { filter: actionButton.dataset.year || "ALL" });
    } else if (action === "theme") {
      event.preventDefault();
      toggleTheme();
    } else if (action === "mobile-menu") {
      const nav = document.getElementById("primary-nav");
      const open = !nav?.classList.contains("is-open");
      nav?.classList.toggle("is-open", open);
      actionButton.setAttribute("aria-expanded", String(open));
    }
  });

  window.addEventListener("popstate", event => {
    const state = event.state || readInitialState();
    navigate(state.view || "home", { filter: state.filter || "ALL", volumeId: state.volumeId || "" }, { push: false, preserveScroll: false });
  });

  const initial = readInitialState();
  navigate(initial.view, { filter: initial.filter, volumeId: initial.volumeId }, { push: false, preserveScroll: true });
}

init();
})();
