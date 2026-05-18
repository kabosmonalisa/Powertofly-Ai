import os, socketserver, http.server

os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
PORT = 3456
http.server.SimpleHTTPRequestHandler.extensions_map.update({'.avif': 'image/avif', '.svg': 'image/svg+xml'})
with socketserver.TCPServer(("", PORT), http.server.SimpleHTTPRequestHandler) as httpd:
    httpd.serve_forever()
