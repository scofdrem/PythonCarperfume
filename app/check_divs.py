content = open('app/frontend/src/pages/Admin.tsx', encoding='utf-8').read()
lines = content.split('\n')
open_div = 0
for i, line in enumerate(lines[1902:2548], start=1903):
    open_count = line.count('<div') - line.count('</div>')
    if open_count != 0:
        open_div += open_count
        print(f'Line {i}: delta={open_count}, total={open_div}: {line.strip()[:80]}')
print(f'Final open div count: {open_div}')