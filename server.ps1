$port = 3000
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
try {
    $listener.Prefixes.Add("http://127.0.0.1:$port/")
} catch {}

$listener.Start()
Write-Host "Server running at http://localhost:$port/"

$mime = @{
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".gif"  = "image/gif"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        try {
            $path = $request.Url.LocalPath.TrimStart('/')
            if ([string]::IsNullOrWhiteSpace($path) -or $path -eq "/") {
                $path = "index.html"
            }
            $path = $path.Replace('/', [System.IO.Path]::DirectorySeparatorChar)
            $filePath = Join-Path $PSScriptRoot $path

            if (Test-Path $filePath -PathType Leaf) {
                $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
                $contentType = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { "application/octet-stream" }
                $bytes = [System.IO.File]::ReadAllBytes($filePath)
                
                $response.ContentType = $contentType
                $response.ContentLength64 = $bytes.Length
                $response.StatusCode = 200
                $response.AddHeader("Access-Control-Allow-Origin", "*")
                
                if ($request.HttpMethod -ne "HEAD") {
                    $response.OutputStream.Write($bytes, 0, $bytes.Length)
                }
            } else {
                $notFound = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
                $response.StatusCode = 404
                $response.ContentType = "text/plain; charset=utf-8"
                $response.ContentLength64 = $notFound.Length
                if ($request.HttpMethod -ne "HEAD") {
                    $response.OutputStream.Write($notFound, 0, $notFound.Length)
                }
            }
        } catch {
            Write-Host "Error processing request: $_"
        } finally {
            try {
                $response.OutputStream.Close()
            } catch {}
        }
    }
} finally {
    $listener.Stop()
    $listener.Close()
}
