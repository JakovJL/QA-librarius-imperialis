# -*- coding: utf-8 -*-
"""Generate charts for the Innowise QA-stack deck from the source xlsx.
Numbers are recomputed from the workbook so they stay reproducible."""
import os, re
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib import font_manager

SRC = r"C:/Users/Yakau/Downloads/Bench and QA stack.xlsx"
OUT = os.path.join(os.path.dirname(__file__), "assets")
os.makedirs(OUT, exist_ok=True)

# ---- Innowise theme palette ----
GREEN   = "#8DC63F"   # brand lime
GREEN_D = "#6F8C1E"   # darker olive-green
INK     = "#1B1F1A"   # charcoal
GRAY    = "#C2C9BA"   # muted sage gray
LIME_L  = "#C6E27A"   # light lime
WHITE   = "#FFFFFF"

plt.rcParams.update({
    "font.family": "DejaVu Sans",
    "font.size": 14,
    "axes.edgecolor": "#D9DED1",
    "axes.linewidth": 0.8,
    "figure.dpi": 200,
})

def style_ax(ax):
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    ax.tick_params(length=0)

# ============ load demand sheet ============
df = pd.read_excel(SRC, sheet_name="Актуальные запросы", header=0)
df = df.dropna(how="all")
title = df[df.columns[4]].fillna("").astype(str)
must  = df["Must-have skills"].fillna("").astype(str)
opt   = df["Optional skills"].fillna("").astype(str)
blob  = (title + " " + must + " " + opt)
df["d"] = pd.to_datetime(df["Дата создания тикета"], errors="coerce")
N = len(blob)

terms = {
 "SQL / БД":[r"\bsql\b",r"postgres",r"\bmysql\b",r"\bmongo",r"\boracle\b"],
 "Python":[r"\bpython\b",r"\bpytest\b"],
 "Java":[r"\bjava\b"],
 "JavaScript / TS":[r"\bjavascript\b",r"\btypescript\b",r"\bnode\.?js\b",r"(?<![a-z])ts(?![a-z])",r"(?<![a-z])js(?![a-z])"],
 "REST / API":[r"\brest\b",r"\bapi\b"],
 "Mobile":[r"\bandroid\b",r"\bios\b",r"\bappium\b",r"\bmobile\b"],
 "Selenium":[r"\bselenium\b"],
 "CI/CD":[r"\bjenkins\b",r"\bci/cd\b",r"\bgitlab ci\b",r"\bteamcity\b"],
 "DevOps":[r"\bdevops\b"],
 "Playwright":[r"\bplaywright\b"],
 "Docker":[r"\bdocker\b"],
 "Postman":[r"\bpostman\b"],
 "C# / .NET":[r"\bc#\b",r"\.net\b"],
 "Kubernetes":[r"\bkubernetes\b",r"\bk8s\b"],
}
def has(s, pats): return bool(re.compile("|".join(pats), re.I).search(s))
counts = {k: sum(has(s,p) for s in blob) for k,p in terms.items()}

# ---- Chart 1: top demand skills (horizontal) ----
items = sorted(counts.items(), key=lambda x:x[1])
labels = [k for k,_ in items]
vals   = [round(100*v/N,1) for _,v in items]
langs  = {"Java","Python","JavaScript / TS","C# / .NET"}
colors = [INK if k in langs else GREEN for k in labels]
fig, ax = plt.subplots(figsize=(9.6,6.2))
bars = ax.barh(labels, vals, color=colors, height=0.66)
for b,v in zip(bars,vals):
    ax.text(v+0.15, b.get_y()+b.get_height()/2, f"{v:.1f}%", va="center", ha="left",
            fontsize=12.5, color=INK, fontweight="bold")
ax.set_xlim(0, max(vals)+2.2)
ax.set_xlabel("Доля тикетов, упоминающих навык, %", fontsize=12.5, color="#555")
style_ax(ax)
ax.set_xticks([])
# legend proxy
from matplotlib.patches import Patch
ax.legend(handles=[Patch(color=INK,label="Языки программирования"),
                   Patch(color=GREEN,label="Инструменты / практики")],
          loc="lower right", frameon=False, fontsize=11)
plt.tight_layout()
plt.savefig(os.path.join(OUT,"chart_demand.png"), bbox_inches="tight", facecolor=WHITE)
plt.close()

# ---- Chart 2: grades demand ----
grades = {"Senior":115,"Middle":62,"Lead":8,"Junior":4}
fig, ax = plt.subplots(figsize=(7.6,4.6))
gk=list(grades); gv=list(grades.values())
gcolors=[GREEN, GREEN_D, GRAY, "#E0857A"]
bars=ax.bar(gk, gv, color=gcolors, width=0.6)
for b,v in zip(bars,gv):
    ax.text(b.get_x()+b.get_width()/2, v+2, str(v), ha="center", va="bottom",
            fontsize=15, fontweight="bold", color=INK)
ax.set_ylim(0, max(gv)+18)
style_ax(ax); ax.set_yticks([])
ax.set_ylabel("Кол-во запросов", fontsize=12, color="#555")
plt.tight_layout()
plt.savefig(os.path.join(OUT,"chart_grades.png"), bbox_inches="tight", facecolor=WHITE)
plt.close()

# ---- Chart 3: trend old vs new ----
cut = pd.Timestamp("2025-09-01")
old = blob[df["d"]<cut]; new = blob[df["d"]>=cut]
tt = {
 "Java":[r"\bjava\b"],
 "Python":[r"\bpython\b",r"\bpytest\b"],
 "JS / TS":[r"\bjavascript\b",r"\btypescript\b",r"\bnode\.?js\b",r"(?<![a-z])ts(?![a-z])",r"(?<![a-z])js(?![a-z])"],
 "Selenium":[r"\bselenium\b"],
 "Playwright":[r"\bplaywright\b"],
 "SQL":[r"\bsql\b",r"postgres",r"\bmysql\b"],
 "DevOps / Docker":[r"\bdocker\b",r"\bkubernetes\b",r"\bdevops\b",r"\bjenkins\b"],
 "Mobile":[r"\bandroid\b",r"\bios\b",r"\bappium\b"],
}
ok=len(old); nk=len(new)
old_p=[round(100*sum(has(s,p) for s in old)/ok,1) for p in tt.values()]
new_p=[round(100*sum(has(s,p) for s in new)/nk,1) for p in tt.values()]
import numpy as np
x=np.arange(len(tt)); w=0.38
fig, ax = plt.subplots(figsize=(10.2,5.0))
b1=ax.bar(x-w/2, old_p, w, label="до 09.2025", color=GRAY)
b2=ax.bar(x+w/2, new_p, w, label="с 09.2025", color=GREEN)
for bars in (b1,b2):
    for b in bars:
        ax.text(b.get_x()+b.get_width()/2, b.get_height()+0.15, f"{b.get_height():.0f}",
                ha="center", va="bottom", fontsize=10.5, color=INK)
ax.set_xticks(x); ax.set_xticklabels(list(tt), fontsize=11.5)
ax.set_ylim(0, max(new_p+old_p)+3)
style_ax(ax); ax.set_yticks([])
ax.set_ylabel("Доля тикетов, %", fontsize=12, color="#555")
ax.legend(frameon=False, fontsize=12, loc="upper left")
plt.tight_layout()
plt.savefig(os.path.join(OUT,"chart_trend.png"), bbox_inches="tight", facecolor=WHITE)
plt.close()

# ---- Chart 4: bench supply by language ----
supply = {"JS / TS":75,"Java":55,"Python":37,"C#":27,"Kotlin":9,"Groovy":8}
fig, ax = plt.subplots(figsize=(8.4,4.8))
sk=list(supply); sv=list(supply.values())
scolors=[GREEN, INK, GREEN_D, GRAY, LIME_L, "#A8B596"]
bars=ax.bar(sk, sv, color=scolors, width=0.62)
for b,v in zip(bars,sv):
    ax.text(b.get_x()+b.get_width()/2, v+1.2, str(v), ha="center", va="bottom",
            fontsize=14, fontweight="bold", color=INK)
ax.set_ylim(0, max(sv)+12)
style_ax(ax); ax.set_yticks([])
ax.set_ylabel("Инженеров на бенче (из 104)", fontsize=11.5, color="#555")
plt.tight_layout()
plt.savefig(os.path.join(OUT,"chart_supply.png"), bbox_inches="tight", facecolor=WHITE)
plt.close()

print("charts written to", OUT)
for f in sorted(os.listdir(OUT)):
    print("  ", f)
