
#!/usr/bin/env python

import time
import threading
from grove.gpio import GPIO
from grove.display.jhd1802 import JHD1802, main as LCDMain

lock = threading.Lock()


class LCD:
    def __init__(self):
        self.lcd = JHD1802()
        self.lcd.clear()
        self.lcd.backlight(True)

    def display_message(self, message, row):
        threading.Thread(target=self.move_message, args=(message, row)).start()

    def move_message(self, message, row):
        while True:
            lock.acquire()
            length = len(message) - 15
            self.lcd.setCursor(row, 0)
            self.lcd.write(message)
            lock.release()
            if length > 0:
                for i in range(length + 1):
                    lock.acquire()
                    self.lcd.clear()
                    self.lcd.setCursor(row, 0)
                    self.lcd.write(message[i:])
                    lock.release()
                    time.sleep(0.4)
            else:
                time.sleep(2)  # Pause if the message fits the screen