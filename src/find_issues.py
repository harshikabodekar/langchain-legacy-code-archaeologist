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

# 4. simple checks done by code, no AI
other_checks = ""
if os.path.isdir(os.path.join(PROJECT, ".history")):
    other_checks += "- `.history/` (editor backup copies) is in the repo. Add it to `.gitignore`.\n"
for folder, dirs, names in os.walk(PROJECT):
    dirs[:] = [d for d in dirs if d not in ("node_modules", ".git", ".next")]
    for name in names:
        if name.startswith(".env"):
            other_checks += f"- `{short(os.path.join(folder, name))}` looks like an env file. Make sure it holds no secrets in the repo.\n"
if other_checks == "":
    other_checks = "None found.\n"

print("unused files:", len(unused), "| similar pairs:", len(similar))

# 5. ask the model to judge each candidate
text = "# 2. Cleanup Candidates\n\n"
text += "> Items under the first two headings are AI-generated judgments. Verify before acting.\n\n"

text += "## Files nobody imports\n\n"
if not unused:
    text += "None found.\n\n"
for path in unused:
    prompt = (
        NOTE + "\nNo other file imports this file. Is it dead code?\n"
        "Give the issue, the risk of deleting it (low, medium or high) and what to do.\n\n"
        "File: " + short(path) + "\n" + files[path][:6000]
    )
    f = judge.invoke(prompt)
    text += f"### `{short(path)}`\n- Issue: {f.issue}\n- Risk: {f.risk}\n- Suggestion: {f.suggestion}\n\n"
    print("judged:", short(path))
    time.sleep(1)

text += "## Very similar files\n\n"
if not similar:
    text += "None found.\n\n"
for a, b, score in similar:
    prompt = (
        NOTE + f"\nThese two files are {int(score * 100)}% similar. Is one a leftover copy?\n"
        "Give the issue, the risk of deleting one (low, medium or high) and what to do.\n\n"
        "File A: " + short(a) + "\n" + files[a][:6000] + "\n\n"
        "File B: " + short(b) + "\n" + files[b][:6000]
    )
    f = judge.invoke(prompt)
    text += f"### `{short(a)}` and `{short(b)}` ({int(score * 100)}% similar)\n- Issue: {f.issue}\n- Risk: {f.risk}\n- Suggestion: {f.suggestion}\n\n"
    print("judged pair:", short(a), "|", short(b))
    time.sleep(1)

text += "## Other checks (done by code, not AI)\n\n" + other_checks

os.makedirs("report", exist_ok=True)
with open("report/2_findings.md", "w", encoding="utf-8") as out:
    out.write(text)

print("saved report/2_findings.md")