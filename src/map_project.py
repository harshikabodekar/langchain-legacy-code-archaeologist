import os
import time
from langchain_google_genai import ChatGoogleGenerativeAI

llm = ChatGoogleGenerativeAI(model="gemini-3.5-flash-lite")

PROJECT = "target_project"
EXTENSIONS = (".py", ".js", ".jsx", ".ts", ".tsx", ".sql")
SKIP = ("node_modules", ".git", ".next", "__pycache__", ".history")
MAX_FILES = 40


def get_text(reply):
    # the model can return a list of blocks, so we pull out only the text
    if isinstance(reply.content, str):
        return reply.content
    return "".join(b["text"] for b in reply.content if isinstance(b, dict) and "text" in b)


rows = []

for folder, dirs, files in os.walk(PROJECT):
    dirs[:] = [d for d in dirs if d not in SKIP]
    for name in sorted(files):
        if name.endswith(EXTENSIONS) and len(rows) < MAX_FILES:
            path = os.path.join(folder, name)
            code = open(path, encoding="utf-8").read()
            reply = llm.invoke(f"In 1 sentence, what does this file do?\n\n{code[:3000]}")
            summary = get_text(reply).strip().replace("|", "/")
            short_path = path.replace(PROJECT + "/", "")
            rows.append((short_path, len(code.splitlines()), summary))
            print("done:", short_path)
            time.sleep(1)

# write the report
with open("report.md", "w", encoding="utf-8") as f:
    f.write("# Module Map: leaddesk\n\n")
    f.write(f"Files analysed: {len(rows)}\n\n")
    f.write("| File | Lines | What it does |\n")
    f.write("|------|-------|--------------|\n")
    for path, lines, summary in rows:
        f.write(f"| `{path}` | {lines} | {summary} |\n")

    f.write("\n## Findings\n\n")
    f.write("- `.history/` (editor backup copies) was committed into the repo. It should be in `.gitignore`.\n")

print(f"\nreport saved to report.md ({len(rows)} files)")