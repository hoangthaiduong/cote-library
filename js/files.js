(function () {
const { isConfigured, resolveProjectPath } = window.CoteVolumes;
/**
 * Verify a configured same-origin static PDF. Static hosts commonly support
 * HEAD; a range GET is used when HEAD is unsupported. Unknown means the browser
 * could not verify the file (for example, when opened using file://).
 */
async function checkPdfAvailability(volume) {
  if (!isConfigured(volume)) return "unconfigured";
  // Browsers deliberately block fetch(file://...) from JavaScript. The project
  // ships with these configured PDFs, so allow direct local reading/download.
  if (window.location.protocol === "file:") return "available";
  const url = resolveProjectPath(volume.pdfPath);
  if (!url) return "unknown";
  try {
    const response = await fetch(url, { method: "HEAD", cache: "no-store", signal: AbortSignal.timeout(8000) });
    if (response.status === 404 || response.status === 410) return "missing";
    if (response.ok) {
      const type = (response.headers.get("content-type") || "").toLowerCase();
      return type.includes("text/html") ? "missing" : "available";
    }
    if (![400, 403, 405, 501].includes(response.status)) return response.status >= 500 ? "unknown" : "missing";
  } catch { /* Try a tiny ranged request below. */ }
  try {
    const response = await fetch(url, { headers: { Range: "bytes=0-4" }, cache: "no-store", signal: AbortSignal.timeout(8000) });
    if (response.status === 404 || response.status === 410) return "missing";
    if (!response.ok) return "unknown";
    const type = (response.headers.get("content-type") || "").toLowerCase();
    if (type.includes("text/html")) return "missing";
    const reader = response.body?.getReader();
    if (!reader) return "unknown";
    const first = await reader.read();
    try { await reader.cancel(); } catch { /* response may already be closed */ }
    const head = first.value ? new TextDecoder().decode(first.value.slice(0, 5)) : "";
    return head.startsWith("%PDF-") ? "available" : "unknown";
  } catch { return "unknown"; }
}

/** Download the original, unmodified PDF under the configured filename. */
async function downloadOriginalPdf(volume, notify = () => {}) {
  if (!isConfigured(volume)) {
    notify("This volume has no configured PDF path yet.", "error");
    return false;
  }
  const url = resolveProjectPath(volume.pdfPath);
  if (!url) {
    notify("The PDF path is invalid. Check js/volumes.js.", "error");
    return false;
  }
  try {
    if (window.location.protocol === "file:") {
      const link = document.createElement("a");
      link.href = url;
      link.download = volume.fileName;
      link.target = "_blank";
      link.rel = "noopener";
      link.style.display = "none";
      document.body.append(link);
      link.click();
      link.remove();
      notify(`Opened the original file: ${volume.fileName}. If your browser displays it instead of saving it, use the PDF viewer's Download button.`, "info");
      return true;
    }
    notify("Preparing the original PDF download…", "info");
    const response = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(60000) });
    if (!response.ok) throw new Error(response.status === 404 ? "PDF file was not found at the configured path." : `The server returned HTTP ${response.status}.`);
    const blob = await response.blob();
    if ((blob.type || "").toLowerCase().includes("text/html") || !((await blob.slice(0, 5).text()).startsWith("%PDF-"))) {
      throw new Error("The response is not a PDF. Check the filename and path in js/volumes.js.");
    }
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = volume.fileName;
    link.hidden = true;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 30000);
    notify(`Download requested: ${volume.fileName}`, "success");
    return true;
  } catch (error) {
    const message = error?.name === "TimeoutError"
      ? "The download timed out. Check your connection and try again."
      : (error?.message || "The PDF could not be downloaded.");
    notify(message, "error");
    return false;
  }
}

window.CoteFiles = { checkPdfAvailability, downloadOriginalPdf };
})();
