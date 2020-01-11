# file gunicorn.conf.py
# coding=utf-8
# Reference: https://github.com/benoitc/gunicorn/blob/master/examples/example_config.py
import os
import multiprocessing
import subprocess
from dotenv import load_dotenv

if os.path.exists('./.env') and os.path.isfile('./.env'):
    load_dotenv()

# _ROOT = os.path.dirname(__file__)
_ROOT = os.path.abspath(os.path.join(
    os.path.dirname(__file__), '..'))

loglevel = 'info'
# errorlog = os.path.join(_VAR, 'log/api-error.log')
# accesslog = os.path.join(_VAR, 'log/api-access.log')
errorlog = "-"
accesslog = "-"

# bind = 'unix:%s' % os.path.join(_VAR, 'run/gunicorn.sock')
bind = '0.0.0.0:5000'
workers = 3
# workers = multiprocessing.cpu_count() * 2 + 1

timeout = 3 * 60  # 3 minutes
keepalive = 24 * 60 * 60  # 1 day

capture_output = True
forwarded_allow_ips = '*'
subprocess.Popen(['npm', 'start'])
