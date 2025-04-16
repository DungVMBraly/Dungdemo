import xlsxwriter
import random
import string

workbook = xlsxwriter.Workbook('file_nang_1GB.xlsx')
worksheet = workbook.add_worksheet()

def random_string(length=50):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

rows = 1000000  # 1 triệu dòng
cols = 10       # 10 cột

for row in range(rows):
    for col in range(cols):
        worksheet.write(row, col, random_string())
    if row % 10000 == 0:
        print(f"Đã ghi {row} hàng...")

workbook.close()
print("Hoàn tất!")
