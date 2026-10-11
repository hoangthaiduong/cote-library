$ErrorActionPreference = 'Stop'
$Version = '6.4.299'
$ArchiveName = "pdfjs-$Version-dist.zip"
$DownloadUrl = "https://github.com/mozilla/pdf.js/releases/download/v$Version/$ArchiveName"
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$VendorRoot = Join-Path $ProjectRoot 'vendor\pdfjs'
$TempRoot = Join-Path ([System.IO.Path]::GetTempPath()) ("cote-pdfjs-" + [guid]::NewGuid().ToString('N'))
$ArchivePath = Join-Path $TempRoot $ArchiveName
$ExtractRoot = Join-Path $TempRoot 'unpacked'

try {
    New-Item -ItemType Directory -Force -Path $TempRoot, $ExtractRoot, $VendorRoot | Out-Null
    Write-Host "Downloading official Mozilla PDF.js v$Version release..." -ForegroundColor Cyan
    Invoke-WebRequest -Uri $DownloadUrl -OutFile $ArchivePath
    Expand-Archive -LiteralPath $ArchivePath -DestinationPath $ExtractRoot -Force

    $PdfModule = Get-ChildItem -LiteralPath $ExtractRoot -Recurse -File -Filter 'pdf.mjs' | Select-Object -First 1
    $WorkerModule = Get-ChildItem -LiteralPath $ExtractRoot -Recurse -File -Filter 'pdf.worker.mjs' | Select-Object -First 1
    if (-not $PdfModule -or -not $WorkerModule) {
        throw 'The downloaded archive did not contain pdf.mjs and pdf.worker.mjs. No runtime files were installed.'
    }

    Copy-Item -LiteralPath $PdfModule.FullName -Destination (Join-Path $VendorRoot 'pdf.mjs') -Force
    Copy-Item -LiteralPath $WorkerModule.FullName -Destination (Join-Path $VendorRoot 'pdf.worker.mjs') -Force

    foreach ($folderName in @('cmaps', 'standard_fonts', 'wasm')) {
        $source = Get-ChildItem -LiteralPath $ExtractRoot -Recurse -Directory -Filter $folderName | Select-Object -First 1
        if ($source) {
            $destination = Join-Path $VendorRoot $folderName
            if (Test-Path $destination) { Remove-Item -LiteralPath $destination -Recurse -Force }
            Copy-Item -LiteralPath $source.FullName -Destination $destination -Recurse -Force
        }
    }

    $license = Get-ChildItem -LiteralPath $ExtractRoot -Recurse -File -Filter 'LICENSE' | Select-Object -First 1
    if ($license) { Copy-Item -LiteralPath $license.FullName -Destination (Join-Path $VendorRoot 'LICENSE') -Force }
    Set-Content -LiteralPath (Join-Path $VendorRoot 'VERSION.txt') -Value "Mozilla PDF.js $Version`r`nOfficial release: $DownloadUrl`r`nThe pdf.mjs and pdf.worker.mjs files in this folder must be kept from the same release." -Encoding UTF8

    Write-Host "PDF.js v$Version is installed under vendor\pdfjs\." -ForegroundColor Green
    Write-Host 'Reload COTE Library through your local HTTP server, then open a configured PDF.'
} catch {
    Write-Error ("PDF.js installation failed: " + $_.Exception.Message)
    exit 1
} finally {
    if (Test-Path $TempRoot) { Remove-Item -LiteralPath $TempRoot -Recurse -Force -ErrorAction SilentlyContinue }
}
