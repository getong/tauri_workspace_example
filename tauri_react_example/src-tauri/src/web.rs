use tauri_plugin_http::reqwest::Client;

#[tauri::command]
pub async fn fetch_webpage(url: String) -> Result<String, String> {
    println!("Fetching webpage: {}", url);

    // No automatic URL validation in request builder, so validate manually
    if !url.starts_with("https://www.baidu.com") && !url.starts_with("https://api.example.com") {
        return Err("URL not in allowed domains".into());
    }

    // Use reqwest client from tauri_plugin_http
    let client = Client::new();

    let response = client
        .get(&url)
        .send()
        .await
        .map_err(|e| format!("Failed to send request: {}", e))?;

    let status = response.status();
    if !status.is_success() {
        println!("HTTP error: {}", status);
        return Err(format!("HTTP error: {}", status));
    }

    let text = response
        .text()
        .await
        .map_err(|e| format!("Failed to read response body: {}", e))?;

    println!("Successfully fetched {} bytes", text.len());
    Ok(text)
}
