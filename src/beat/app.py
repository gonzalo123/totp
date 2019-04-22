import pyotp
import time
import os
from dotenv import load_dotenv
import logging

logging.basicConfig(level=logging.INFO)

current_dir = os.path.dirname(os.path.abspath(__file__))
load_dotenv(dotenv_path="{}/.env".format(current_dir))

totp = pyotp.TOTP(os.getenv('TOTP_BASE32_SECRET'))

mem = None
while True:
    now = totp.now()
    if mem != now:
        logging.info(now)
        mem = now
        time.sleep(1)
