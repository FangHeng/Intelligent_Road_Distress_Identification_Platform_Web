# -*- coding: utf-8 -*-
# @Time    : 2023/12/15 03:05
# @Author  : Fang Heng
# @File    : wait_for_db.py
# @Software: PyCharm 
# @Comment : 检查数据库状态，等待数据库启动完成后再启动后端服务


import os
from dotenv import load_dotenv
load_dotenv()
import time
import MySQLdb
from MySQLdb import OperationalError

def wait_for_db():
    db_host = os.environ.get("DB_HOST", "db")
    db_user = os.environ.get("MYSQL_USER")
    db_password = os.environ.get("MYSQL_PASSWORD")
    max_retries = 10
    retries = 0

    while retries < max_retries:
        try:
            print(f"Trying to connect to MySQL at {db_host}...")
            conn = MySQLdb.connect(host=db_host, user=db_user, passwd=db_password)
            print("MySQL is up and running!")
            conn.close()
            return
        except OperationalError:
            retries += 1
            print("MySQL is not ready yet. Waiting...")
            time.sleep(5)

    print("Failed to connect to MySQL within the time limit.")
    exit(1)

if __name__ == "__main__":
    wait_for_db()
