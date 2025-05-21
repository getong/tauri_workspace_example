// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_geolocation::init())
        .invoke_handler(tauri::generate_handler![greet])
        .setup(|_app| {
            #[cfg(target_os = "android")]
            {
                use log::LevelFilter;
                let logger = android_logger::Config::default()
                    .with_max_level(LevelFilter::Debug)
                    .with_tag("tauri_gps");
                android_logger::init_once(logger);
                log::info!("Initialized Android logger");
                log::debug!("Geolocation plugin setup");
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
