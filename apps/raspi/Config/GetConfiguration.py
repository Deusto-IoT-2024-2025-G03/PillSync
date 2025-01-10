#!/usr/bin/env python3.en

import os
import requests
from dotenv import load_dotenv

def fetch(EndPoint):
	load_dotenv()

	api_url = os.getenv('API_URL')

	r = requests.get("https://" + api_url + EndPoint, verify=False)
	print(r.status_code)
	print(r.json())

