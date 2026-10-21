use std::path::{Path, PathBuf};
use std::sync::atomic::{AtomicUsize, Ordering};

use tauri::ipc::Response;
use tauri::webview::NewWindowResponse;
use tauri::{WebviewUrl, WebviewWindowBuilder};

/// Injected into every page: local-file fetch shim and Full/Lite mode switching.
const SHELL_SCRIPT: &str = include_str!("shell.js");

fn is_ifc(path: &Path) -> bool {
    path.extension()
        .map(|ext| ext.eq_ignore_ascii_case("ifc"))
        .unwrap_or(false)
}

/// Read an .ifc file from disk and return its bytes as a raw binary IPC
/// response (arrives in JS as an ArrayBuffer, without JSON encoding).
#[tauri::command]
async fn read_ifc_file(path: String) -> Result<Response, String> {
    let path = PathBuf::from(path);
    if !is_ifc(&path) {
        return Err(format!("Not an IFC file: {}", path.display()));
    }
    tauri::async_runtime::spawn_blocking(move || std::fs::read(&path))
        .await
        .map_err(|e| e.to_string())?
        .map(Response::new)
        .map_err(|e| format!("Could not read file: {e}"))
}

/// The .ifc path passed on the command line, e.g. when the app is launched by
/// double-clicking a file associated with it.
#[tauri::command]
fn startup_file() -> Option<String> {
    std::env::args_os()
        .skip(1)
        .map(PathBuf::from)
        .find(|p| is_ifc(p) && p.is_file())
        .map(|p| p.to_string_lossy().into_owned())
}

/// Print a diagnostic line from the frontend to the terminal running the app.
#[tauri::command]
fn diag_log(message: String) {
    println!("[webview] {message}");
}

/// Percent-encode everything except RFC 3986 unreserved characters.
fn url_encode(s: &str) -> String {
    let mut out = String::with_capacity(s.len() * 3);
    for b in s.bytes() {
        match b {
            b'A'..=b'Z' | b'a'..=b'z' | b'0'..=b'9' | b'-' | b'_' | b'.' | b'~' => out.push(b as char),
            _ => out.push_str(&format!("%{b:02X}")),
        }
    }
    out
}

/// Start page: the full viewer, with `?model=` pointing at a command-line file.
/// The path is encoded twice: once for the `/__local_file/` URL path segment,
/// once more as the `model` query value.
fn start_url() -> String {
    match startup_file() {
        Some(path) => {
            let name = Path::new(&path)
                .file_name()
                .map(|n| n.to_string_lossy().into_owned())
                .unwrap_or_else(|| "model.ifc".into());
            let model = format!("/__local_file/{}/{}", url_encode(&path), url_encode(&name));
            format!("index.html?model={}", url_encode(&model))
        }
        None => "index.html".into(),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![read_ifc_file, startup_file, diag_log])
        .setup(|app| {
            let handle = app.handle().clone();
            let popups = AtomicUsize::new(0);
            WebviewWindowBuilder::new(app, "main", WebviewUrl::App(start_url().into()))
                .title("IFClite Desktop")
                .inner_size(1400.0, 900.0)
                .min_inner_size(800.0, 500.0)
                // HTML5 drag-and-drop, so the full viewer's own drop zone works.
                .disable_drag_drop_handler()
                .initialization_script(SHELL_SCRIPT)
                // Without a handler every window.open is silently dropped, which
                // breaks the viewer's OAuth sign-ins (BCF servers, cloud sources):
                // they open a popup on about:blank, navigate it to the login page,
                // and the provider redirects back to /oauth/<name>/callback on this
                // app's origin. The popup must be a Tauri window: only those serve
                // the app's origin (http://tauri.localhost in the packaged app; a
                // plain WebView2 popup cannot load it). Built from the opener's
                // features, it shares this webview's environment, so the callback
                // page's BroadcastChannel reaches the viewer.
                .on_new_window(move |url, features| {
                    if !matches!(url.scheme(), "https" | "about") {
                        return NewWindowResponse::Deny;
                    }
                    let label = format!("popup-{}", popups.fetch_add(1, Ordering::Relaxed));
                    let popup = WebviewWindowBuilder::new(
                        &handle,
                        label,
                        WebviewUrl::External("about:blank".parse().expect("valid URL")),
                    )
                    .title("Sign in")
                    .window_features(features)
                    .on_document_title_changed(|window, title| {
                        let _ = window.set_title(&title);
                    })
                    .build();
                    match popup {
                        Ok(window) => NewWindowResponse::Create { window },
                        Err(_) => NewWindowResponse::Deny,
                    }
                })
                .build()?;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running IFClite Desktop");
}
