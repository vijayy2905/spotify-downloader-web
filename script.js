const BACKEND_URL = "https://downloader-backend-qakj.onrender.com";

async function handleDownload() {
    const urlInput = document.getElementById('playlistUrl').value.trim();
    const status = document.getElementById('status');
    const btn = document.getElementById('dlBtn');

    if (!urlInput) {
        status.innerText = "Please paste a Spotify link first!";
        status.style.color = "#ff4d4d";
        return;
    }

    btn.disabled = true;
    status.innerText = "Processing audio... (Playlists may take 1-2 mins)";
    status.style.color = "#1DB954";

    try {
        const response = await fetch(`${BACKEND_URL}/download`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: urlInput })
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error || "Download failed");
        }

        const contentType = response.headers.get("content-type");
        const isZip = contentType && contentType.includes("zip");

        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = isZip ? "playlist.zip" : "song.mp3";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(downloadUrl);

        status.innerText = isZip ? "Downloaded playlist.zip!" : "Downloaded song.mp3!";
        status.style.color = "#1DB954";
    } catch (err) {
        status.innerText = "Error: " + err.message;
        status.style.color = "#ff4d4d";
    } finally {
        btn.disabled = false;
    }
}
