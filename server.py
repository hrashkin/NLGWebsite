#!/usr/bin/env python3

from http.server import BaseHTTPRequestHandler, HTTPServer, SimpleHTTPRequestHandler
from urllib.parse import parse_qs, parse_qsl, urlparse
import os
from IPython import embed
#import SocketServer

class MyModel():
  def getOutput(inputStr):
    return "This is a server output!"

class MyServer(SimpleHTTPRequestHandler):
  def _set_headers(self):
    self.send_response(200)
    self.send_header('Access-Control-Allow-Origin', '*')
    self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    self.send_header('Content-type', 'text/html')
    self.end_headers()

  def do_GET(self):
    self.path = self.server.wd+self.path
    print(self.path)
    super(MyServer,self).do_GET()
    
  def do_POST(self):
    params = parse_qs(urlparse(self.path).query)
    # it's a list in case there's duplicates
    inputText = params["inputText"][0] 
    inputText = inputText.replace("|||","\n").strip()
    print([inputText])
    response = self.server.nlgModel.getOutput(inputText)
    self._set_headers()
    self.wfile.write(response.encode())
    
def run(nlg, serverClass=HTTPServer, handlerClass=MyServer):
  serverAddress = ('0.0.0.0', 8001)
  httpd = serverClass(serverAddress, handlerClass)
  
  httpd.nlgModel = nlg
  httpd.wd = os.path.dirname(__file__)
  
  print("Listening at",serverAddress)
  print(httpd.wd)
  httpd.serve_forever()

if __name__ == '__main__':
  run(nlg=MyModel())
