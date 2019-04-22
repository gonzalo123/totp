from flask import Flask, jsonify, abort, render_template, request
import os
from dotenv import load_dotenv
from functools import wraps
import pyotp
from flask_qrcode import QRcode

current_dir = os.path.dirname(os.path.abspath(__file__))
load_dotenv(dotenv_path="{}/.env".format(current_dir))

totp = pyotp.TOTP(os.getenv('TOTP_BASE32_SECRET'))

app = Flask(__name__)
QRcode(app)


def verify(key):
    return totp.verify(key)


def authorize(f):
    @wraps(f)
    def decorated_function(*args, **kws):
        if not 'Authorization' in request.headers:
            abort(401)

        data = request.headers['Authorization']
        token = str.replace(str(data), 'Bearer ', '')

        if token != os.getenv('BEARER'):
            abort(401)

        return f(*args, **kws)

    return decorated_function


@app.route('/')
def index():
    return render_template('index.html', totp=pyotp.totp.TOTP(os.getenv('TOTP_BASE32_SECRET')).provisioning_uri("gonzalo123.com", issuer_name="TOTP Example"))


@app.route('/check/<key>', methods=['GET'])
@authorize
def alert(key):
    status = verify(key)
    return jsonify({'status': status})


if __name__ == "__main__":
    app.run(host='0.0.0.0')
