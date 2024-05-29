bind = "127.0.0.1:8000"  # 服務綁定的地址和端口
workers = 2  # 工作進程數量，通常是 CPU 核心數的兩倍加一
threads = 2  # 每個工作進程的線程數
timeout = 30  # 超時時間（秒）
keepalive = 2  # 保持活動時間（秒）
errorlog = '-'
accesslog = '-'
loglevel = 'info'