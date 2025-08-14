#!/usr/bin/env python3
"""
Simple static file server for the spooky GitHub issues template.
Serves files with proper CORS headers for local development.
"""

import os
import mimetypes
from pathlib import Path
from typing import Dict, Any

import uvicorn
from uvicorn.protocols.http.auto import AutoHTTPProtocol


class StaticFileServer:
    """Simple static file server with CORS support"""
    
    def __init__(self, directory: str = "."):
        self.directory = Path(directory).resolve()
        
        # Set up MIME types
        mimetypes.add_type('application/json', '.json')
        mimetypes.add_type('text/css', '.css')
        mimetypes.add_type('application/javascript', '.js')
        mimetypes.add_type('text/html', '.html')
    
    async def __call__(self, scope: Dict[str, Any], receive, send) -> None:
        """ASGI application handler"""
        if scope["type"] != "http":
            return
            
        path = scope["path"]
        method = scope["method"]
        
        # Handle CORS preflight
        if method == "OPTIONS":
            await self._send_cors_response(send)
            return
            
        # Serve files
        if method in ("GET", "HEAD"):
            await self._serve_file(path, send, method == "HEAD")
            return
            
        # Method not allowed
        await self._send_error(send, 405, "Method Not Allowed")
    
    async def _serve_file(self, path: str, send, head_only: bool = False) -> None:
        """Serve a static file"""
        # Default to index.html for root
        if path == "/" or path == "":
            path = "/index.html"
            
        # Remove leading slash and resolve file path
        file_path = self.directory / path.lstrip("/")
        
        try:
            # Security check - ensure file is within served directory
            file_path.resolve().relative_to(self.directory)
            
            if not file_path.exists():
                await self._send_error(send, 404, "Not Found")
                return
                
            if file_path.is_dir():
                # Try to serve index.html from directory
                index_path = file_path / "index.html"
                if index_path.exists():
                    file_path = index_path
                else:
                    await self._send_error(send, 404, "Not Found")
                    return
            
            # Read and serve file
            content = file_path.read_bytes()
            content_type, _ = mimetypes.guess_type(str(file_path))
            
            if content_type is None:
                content_type = "application/octet-stream"
                
            headers = [
                (b"content-type", content_type.encode()),
                (b"content-length", str(len(content)).encode()),
                (b"access-control-allow-origin", b"*"),
                (b"access-control-allow-methods", b"GET, POST, OPTIONS"),
                (b"access-control-allow-headers", b"*"),
                (b"cache-control", b"no-cache"),
            ]
            
            await send({
                "type": "http.response.start",
                "status": 200,
                "headers": headers,
            })
            
            await send({
                "type": "http.response.body",
                "body": b"" if head_only else content,
            })
            
        except ValueError:
            # File is outside served directory
            await self._send_error(send, 403, "Forbidden")
        except Exception as e:
            print(f"Error serving {path}: {e}")
            await self._send_error(send, 500, "Internal Server Error")
    
    async def _send_cors_response(self, send) -> None:
        """Send CORS preflight response"""
        headers = [
            (b"access-control-allow-origin", b"*"),
            (b"access-control-allow-methods", b"GET, POST, OPTIONS"),
            (b"access-control-allow-headers", b"*"),
            (b"content-length", b"0"),
        ]
        
        await send({
            "type": "http.response.start",
            "status": 200,
            "headers": headers,
        })
        
        await send({
            "type": "http.response.body",
            "body": b"",
        })
    
    async def _send_error(self, send, status: int, message: str) -> None:
        """Send an error response"""
        content = f"<h1>{status} {message}</h1>".encode()
        
        headers = [
            (b"content-type", b"text/html"),
            (b"content-length", str(len(content)).encode()),
            (b"access-control-allow-origin", b"*"),
        ]
        
        await send({
            "type": "http.response.start",
            "status": status,
            "headers": headers,
        })
        
        await send({
            "type": "http.response.body",
            "body": content,
        })


def main():
    """Run the development server"""
    app = StaticFileServer(".")
    
    print("🎃 Starting spooky GitHub issues server...")
    print("📂 Serving files from current directory")
    print("🌐 Server will be available at: http://localhost:8000")
    print("👻 Try: http://localhost:8000?issue=uuid-issue.json")
    print("🔥 Press Ctrl+C to stop")
    
    uvicorn.run(
        app,
        host="127.0.0.1",
        port=8000,
        log_level="info",
        access_log=True,
        reload=False,
    )


if __name__ == "__main__":
    main()