#[tauri::command]
pub async fn fetch_webpage(url: String) -> Result<String, String> {
    println!("Fetching webpage: {}", url);

    let client = reqwest::Client::builder()
        .user_agent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
        .build()
        .map_err(|e| format!("Failed to create HTTP client: {}", e))?;

    let response = client
        .get(&url)
        .send()
        .await
        .map_err(|e| format!("Failed to send request: {}", e))?;

    if !response.status().is_success() {
        println!("HTTP error: {}", response.status());
        return Err(format!("HTTP error: {}", response.status()));
    }

    // Try to read the response body as bytes first for better error diagnostics
    let bytes = response
        .bytes()
        .await
        .map_err(|e| format!("Failed to read response body as bytes: {}", e))?;

    // Try to decode as UTF-8, report error with a snippet of the raw bytes if it fails
    let content = match String::from_utf8(bytes.to_vec()) {
        Ok(text) => text,
        Err(e) => {
            let snippet = String::from_utf8_lossy(&bytes[..bytes.len().min(128)]);
            return Err(format!(
                "Failed to decode response body as UTF-8: {}. Snippet: {}",
                e, snippet
            ));
        }
    };

    println!("Successfully fetched {} bytes from {}", content.len(), url);

    Ok(content)
}
