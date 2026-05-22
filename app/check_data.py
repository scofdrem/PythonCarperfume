import sqlite3
conn = sqlite3.connect('backend/app.db')
cursor = conn.execute("SELECT * FROM site_content")
rows = cursor.fetchall()
print(f"Rows in site_content: {len(rows)}")
for row in rows:
    print(row)
conn.close()