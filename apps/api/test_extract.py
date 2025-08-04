import json
import pytest
from unittest.mock import Mock, patch
from extract import handler


class MockRequest:
    def __init__(self, data):
        self.rfile = Mock()
        self.rfile.read = Mock(return_value=json.dumps(data).encode())
        

class MockHandler(handler):
    def __init__(self, request_data):
        self.request = MockRequest(request_data)
        self.rfile = Mock()
        self.rfile.read = Mock(return_value=json.dumps(request_data).encode())
        self.headers = {'Content-Length': str(len(json.dumps(request_data)))}
        self.wfile = Mock()
        self.response_code = None
        self.response_headers = {}
        
    def send_response(self, code):
        self.response_code = code
        
    def send_header(self, key, value):
        self.response_headers[key] = value
        
    def end_headers(self):
        pass
        
    def send_error(self, code, message):
        self.response_code = code
        self.error_message = message


def test_extract_endpoint_success():
    """Test successful POST request to extract endpoint"""
    request_data = {
        "pageUrl": "https://example.com",
        "webhookUrl": "https://webhook.example.com",
        "schema": {"title": "string", "description": "string"},
        "prompt": "Extract article information"
    }
    
    mock_handler = MockHandler(request_data)
    mock_handler.do_POST()
    
    assert mock_handler.response_code == 202
    assert 'application/json' in mock_handler.response_headers.get('Content-type', '')
    
    # Check response body
    response_data = json.loads(mock_handler.wfile.write.call_args[0][0].decode())
    assert 'jobId' in response_data
    assert len(response_data['jobId']) == 36  # UUID4 length


def test_extract_endpoint_missing_field():
    """Test POST request with missing required field"""
    request_data = {
        "pageUrl": "https://example.com",
        "webhookUrl": "https://webhook.example.com",
        # Missing schema and prompt
    }
    
    mock_handler = MockHandler(request_data)
    mock_handler.do_POST()
    
    assert mock_handler.response_code == 400
    assert hasattr(mock_handler, 'error_message')


def test_extract_endpoint_invalid_json():
    """Test POST request with invalid JSON"""
    mock_handler = MockHandler({})
    mock_handler.rfile.read = Mock(return_value=b'invalid json')
    mock_handler.do_POST()
    
    assert mock_handler.response_code == 400


def test_extract_endpoint_invalid_page_url():
    """Test POST request with invalid pageUrl"""
    request_data = {
        "pageUrl": "not-a-valid-url",
        "webhookUrl": "https://webhook.example.com",
        "schema": {"title": "string"},
        "prompt": "Extract data"
    }
    
    mock_handler = MockHandler(request_data)
    mock_handler.do_POST()
    
    assert mock_handler.response_code == 400
    assert hasattr(mock_handler, 'error_message')


def test_extract_endpoint_invalid_webhook_url():
    """Test POST request with invalid webhookUrl"""
    request_data = {
        "pageUrl": "https://example.com",
        "webhookUrl": "invalid-webhook-url",
        "schema": {"title": "string"},
        "prompt": "Extract data"
    }
    
    mock_handler = MockHandler(request_data)
    mock_handler.do_POST()
    
    assert mock_handler.response_code == 400
    assert hasattr(mock_handler, 'error_message')


def test_options_request():
    """Test OPTIONS request for CORS"""
    mock_handler = MockHandler({})
    mock_handler.do_OPTIONS()
    
    assert mock_handler.response_code == 200
    assert mock_handler.response_headers.get('Access-Control-Allow-Origin') == '*'
    assert 'POST' in mock_handler.response_headers.get('Access-Control-Allow-Methods', '')