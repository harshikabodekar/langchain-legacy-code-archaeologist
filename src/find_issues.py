import os
import time
import difflib
from pydantic import BaseModel
from langchain_google_genai import ChatGoogleGenerativeAI

PROJECT = "target_project"
EXTENSIONS = (".js", ".jsx", ".ts", ".tsx")
SKIP = ("node_modules", ".git", ".next", "__pycache__", ".history")
FRAMEWORK_FILES = ("page.js", "layout.js", "route.js", "middleware.js")
NOTE = "Note: this is a Next.js app. Folders in brackets like (dashboard) are route groups and do not change the URL."


class Finding(BaseModel):
    issue: str
    risk: str
    suggestion: str


llm = ChatGoogleGenerativeAI(model="gemini-3.5-flash-lite")
judge = llm.with_structured_output(Finding)


def short(path):
    return path.replace(PROJECT + "/", "")


# 1. read all code files
files = {}
for folder, dirs, names in os.walk(PROJECT):
    dirs[:] = [d for d in dirs if d not in SKIP]
    for name in names:
        if name.endswith(EXTENSIONS):
            path = os.path.join(folder, name)
            files[path] = open(path, encoding="utf-8").read()

# 2. files that no other file imports
unused = []
for path in files:
    name = os.path.basename(path)
    if name in FRAMEWORK_FILES:
        continue
    stem = os.path.splitext(name)[0]
    used = False
    for other, code in files.items():
        if other != path and ("/" + stem + "'" in code or "/" + stem + '"' in code):
            used = True
    if not used:
        unused.append(path)

# 3. pairs of files that are very similar
similar = []
paths = list(files)
for i in range(len(paths)):
    for j in range(i + 1, len(paths)):
        score = difflib.SequenceMatcher(None, files[paths[i]], files[paths[j]]).ratio()
        if score > 0.6:
            similar.append((paths[i], paths[j], round(score, 2)))

print("unused files:", len(unused), "| similar pairs:", len(similar))

# 4. ask the model to judge each candidate
section = "## Stage 2: Cleanup candidates\n\n"

section += "### Files nobody imports\n\n"
if not unused:
    section += "None found.\n\n"
for path in unused:
    prompt = (
        NOTE + "\nNo other file imports this file. Is it dead code?\n"
        "Give the issue, the risk of deleting it (low, medium or high) and what to do.\n\n"
        "File: " + short(path) + "\n" + files[path][:3000]
    )
    f = judge.invoke(prompt)
    section += f"**`{short(path)}`**\n- Issue: {f.issue}\n- Risk: {f.risk}\n- Suggestion: {f.suggestion}\n\n"
    print("judged:", short(path))
    time.sleep(1)

section += "### Very similar files\n\n"
if not similar:
    section += "None found.\n\n"
for a, b, score in similar:
    prompt = (
        NOTE + f"\nThese two files are {int(score * 100)}% similar. Is one a leftover copy?\n"
        "Give the issue, the risk of deleting one (low, medium or high) and what to do.\n\n"
        "File A: " + short(a) + "\n" + files[a][:6000] + "\n\n"
        "File B: " + short(b) + "\n" + files[b][:6000]
    )
    f = judge.invoke(prompt)
    section += f"**`{short(a)}` and `{short(b)}` ({int(score * 100)}% similar)**\n- Issue: {f.issue}\n- Risk: {f.risk}\n- Suggestion: {f.suggestion}\n\n"
    print("judged pair:", short(a), "|", short(b))
    time.sleep(1)

# 5. add the section to report.md (replaces an older stage 2 section if it exists)
report = open("report.md", encoding="utf-8").read().split("## Stage 2")[0]
with open("report.md", "w", encoding="utf-8") as out:
    out.write(report.rstrip() + "\n\n" + section)

print("report.md updated")