import re

with open('src/App.jsx', 'r') as f:
    content = f.read()

# Replace hardcoded colors with CSS variables to reduce contrast and fix dark mode
replacements = [
    (r"background:\s*'white'", r"background: 'var(--surface)'"),
    (r"background:\s*'#F9FAFB'", r"background: 'var(--bg)'"),
    (r"background:\s*'#F3F4F6'", r"background: 'var(--bg)'"),
    (r"color:\s*'#4B5563'", r"color: 'var(--text)'"),
    (r"color:\s*'#6B7280'", r"color: 'var(--text-muted)'"),
    (r"color:\s*'#9CA3AF'", r"color: 'var(--text-muted)'"),
    (r"color:\s*'#1F2937'", r"color: 'var(--text)'"),
    (r"background:\s*'rgba\(255, 255, 255, 0.9\)'", r"background: 'var(--surface)'"),
    (r"background:\s*'rgba\(255, 255, 255, 0.8\)'", r"background: 'var(--surface-transparent)'"),
]

for old, new in replacements:
    content = re.sub(old, new, content)

with open('src/App.jsx', 'w') as f:
    f.write(content)
