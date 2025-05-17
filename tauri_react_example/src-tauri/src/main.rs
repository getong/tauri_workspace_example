// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[tauri::command]
async fn fetch_webpage(url: String) -> Result<String, String> {
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

    let content = response
        .text()
        .await
        .map_err(|e| format!("Failed to read response body: {}", e))?;

    println!("Successfully fetched {} bytes from {}", content.len(), url);

    Ok(content)
}

fn main() {
    println!("Starting Tauri application");
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            fetch_webpage,
            // Include any other existing commands here
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
