import subprocess

try:
    result = subprocess.run(['npx', 'tsc', '--noEmit'], capture_output=True, text=True, shell=True)
    with open('type_errors_utf8.txt', 'w', encoding='utf-8') as f:
        f.write(result.stdout)
        f.write(result.stderr)
except Exception as e:
    print(e)
