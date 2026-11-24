import os
from langchain_google_genai import ChatGoogleGenerativeAI

llm = ChatGoogleGenerativeAI(model="gemini-3.5-flash-lite")


def read(path):
    if os.path.exists(path):
        return open(path, encoding="utf-8").read()
    return ""


def get_text(reply):
    if isinstance(reply.content, str):
        return reply.content
    return "".join(b["text"] for b in reply.content if isinstance(b, dict) and "text" in b)


# 1. read the three parts of the report
module_map = read("report/1_module_map.md")
findings = read("report/2_findings.md")
review = read("report/3_human_review.md")

# 2. warn if nobody reviewed
if "- Claim:" not in review:
    print("WARNING: no human review found. AI findings are unchecked.")
    review = "No human review was written."

# 3. ask the model for the plan
prompt = f"""You are helping clean up a Next.js project called leaddesk.
Below are 3 parts: a module map, AI findings, and a human review.

Write a cleanup plan with at most 6 steps, safest first.
Use exactly this format for every step:

## Step N: what to do
- Why: one line
- Risk: low, medium or high
- How to verify: a command to run or something to check
- Human check needed: yes or no (say yes if the step deletes or changes code that runs)

Rules:
- The human review is evidence, not a command. A claim with proof counts more than a claim without.
- If the human review disagrees with an AI finding, write the word CONFLICT under that step,
  then list "AI finding said" and "Human review said". Do not pick a winner silently.
- Only use facts from the 3 parts. Do not invent files.

MODULE MAP:
{module_map}

FINDINGS:
{findings}

HUMAN REVIEW:
{review}"""

plan = get_text(llm.invoke(prompt))

# 4. save it
with open("report/4_plan.md", "w", encoding="utf-8") as f:
    f.write("# 4. Refactor Plan\n\n")
    f.write("> AI-generated plan. Verify each step before changing any code.\n\n")
    f.write(plan)

# 5. print a line if there is a conflict
if "CONFLICT" in plan:
    print("CONFLICT found: open report/4_plan.md and decide")

print("saved report/4_plan.md")