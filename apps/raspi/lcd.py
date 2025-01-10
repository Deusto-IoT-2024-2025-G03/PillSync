
#!/usr/bin/env python

import time
import threading
from grove.gpio import GPIO
from grove.display.jhd1802 import JHD1802, main as LCDMain

pers = 0
message = 0

lock = threading.Lock()

def main():
	lcd = JHD1802()
	lcd.clear()
	rows, cols = lcd.size()
	d1 = {'Abuela': ['Me he caido por las escaleras', 'mikel chupa pitos']}
	keys = list(d1.keys())
	time.sleep(1)
	lcd.backlight(True)
	move(d1['Abuela'][message], lcd, rows, 0)
	hilo1 = threading.Thread(target=move, args=(d1['Abuela'][message], lcd, rows, 0))
	hilo2 = threading.Thread(target=move, args=('mensaje de ' + keys[pers], lcd, rows, 1))
	time.sleep(3)
	lcd.clear()

def move(str, lcd, rows, cols):
	while (True):
		lock.acquire()
		length = len(str) - 15
		lcd.setCursor(0, cols)
		lcd.write(str)
		lock.release()
		if (length > 0):
			for i in range(1, length):
				lock.acquire()
				lcd.clear()
				lcd.setCursor(0, cols)
				lcd.write(str)
				str = str[1:]
				lock.release()
				time.sleep(0.4)
		else:
			lock.acquire()
			lcd.write(str)
			lock.release()
if __name__ == '__main__':
	main()
