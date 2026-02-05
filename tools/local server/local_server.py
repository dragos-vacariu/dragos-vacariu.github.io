from http.server import HTTPServer, SimpleHTTPRequestHandler
import socketserver

class StableHandler(SimpleHTTPRequestHandler):

    def handle(self):
        try:
            super().handle()
        except ConnectionResetError:
            pass
        except BrokenPipeError:
            pass

    def finish(self):
        try:
            super().finish()
        except ConnectionResetError:
            pass
        except BrokenPipeError:
            pass

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET")
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
        super().end_headers()


class ThreadedHTTPServer(socketserver.ThreadingMixIn, HTTPServer):
    daemon_threads = True
    allow_reuse_address = True


if __name__ == "__main__":
    server = ThreadedHTTPServer(("localhost", 8003), StableHandler)
    print("Server running at http://localhost:8003")
    server.serve_forever()
