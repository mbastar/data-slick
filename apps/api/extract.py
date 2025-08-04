from http.server import BaseHTTPRequestHandler
import json
import uuid
import re

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        # Set CORS headers
        self.send_response(202)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        
        # Parse request body
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        try:
            request_body = json.loads(post_data)
            
            # Validate required fields
            required_fields = ['pageUrl', 'webhookUrl', 'schema', 'prompt']
            for field in required_fields:
                if field not in request_body:
                    self.send_error(400, f"Missing required field: {field}")
                    return
            
            # Validate URL formats
            url_pattern = re.compile(
                r'^https?://'  # http:// or https://
                r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|'  # domain...
                r'localhost|'  # localhost...
                r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'  # ...or ip
                r'(?::\d+)?'  # optional port
                r'(?:/?|[/?]\S+)$', re.IGNORECASE)
            
            if not url_pattern.match(request_body['pageUrl']):
                self.send_error(400, "Invalid pageUrl format")
                return
                
            if not url_pattern.match(request_body['webhookUrl']):
                self.send_error(400, "Invalid webhookUrl format")
                return
            
            # Mock job ID generation
            job_id = str(uuid.uuid4())
            
            # Return mock response
            response = {
                "jobId": job_id
            }
            
            self.wfile.write(json.dumps(response).encode())
            
        except json.JSONDecodeError:
            self.send_error(400, "Invalid JSON in request body")
        except Exception as e:
            self.send_error(500, str(e))
    
    def do_OPTIONS(self):
        # Handle preflight CORS requests
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()