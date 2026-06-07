# -*- coding: utf-8 -*-
"""Honest charts (variant A) for the rebuilt deck."""
import os
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Patch

OUT = os.path.join(os.path.dirname(__file__), "assets")
GREEN="#8DC63F"; GREEN_D="#6F8C1E"; INK="#1B1F1A"; GRAY="#C2C9BA"; GRAY_D="#9AA38C"; WHITE="#FFFFFF"
plt.rcParams.update({"font.family":"DejaVu Sans","font.size":14,
    "axes.edgecolor":"#D9DED1","axes.linewidth":0.8,"figure.dpi":200})
def style(ax):
    ax.spines["top"].set_visible(False); ax.spines["right"].set_visible(False); ax.tick_params(length=0)

# ---- Chart A: language tier with 95% CI (recent, n=95) ----
labels=["Java","Python","JS / TS","C# / .NET","Kotlin"]
vals=[36,34,29,14,11]; ci=[10,10,9,7,6]
colors=[GREEN,GREEN,GREEN,GRAY_D,GRAY_D]
fig,ax=plt.subplots(figsize=(9.4,5.2))
x=np.arange(len(labels))
bars=ax.bar(x,vals,yerr=ci,color=colors,width=0.6,
            error_kw=dict(ecolor=INK,elinewidth=1.6,capsize=7,capthick=1.6))
for xi,v,c in zip(x,vals,ci):
    ax.text(xi,v+c+1.2,f"{v}%",ha="center",fontsize=14,fontweight="bold",color=INK)
ax.set_xticks(x); ax.set_xticklabels(labels,fontsize=14)
ax.set_ylim(0,52); ax.set_yticks([]); style(ax)
ax.set_ylabel("Доля запросов, где язык назван (n=95)",fontsize=12,color="#555")
# bracket over top-3
ax.annotate("",xy=(-0.3,49),xytext=(2.3,49),arrowprops=dict(arrowstyle="-",color=GREEN_D,lw=1.6))
ax.text(1.0,50.0,"статистически неразличимы",ha="center",fontsize=12.5,color=GREEN_D,fontstyle="italic")
plt.tight_layout(); plt.savefig(os.path.join(OUT,"chart_langtier.png"),bbox_inches="tight",facecolor=WHITE); plt.close()

# ---- Chart B: 79% language-agnostic (donut) ----
fig,ax=plt.subplots(figsize=(6.2,5.2))
sizes=[79,21]; cols=[GRAY,GREEN]
w,_=ax.pie(sizes,colors=cols,startangle=90,counterclock=False,
           wedgeprops=dict(width=0.42,edgecolor=WHITE,linewidth=3))
ax.text(0,0.12,"79%",ha="center",va="center",fontsize=46,fontweight="bold",color=INK)
ax.text(0,-0.28,"без указания\nязыка",ha="center",va="center",fontsize=14,color="#555")
ax.legend(handles=[Patch(color=GRAY,label="Язык-агностичные (Automation/Manual QA) — 79%"),
                   Patch(color=GREEN,label="Явно называют язык — 21%")],
          loc="lower center",bbox_to_anchor=(0.5,-0.16),frameon=False,fontsize=12)
ax.set_aspect("equal")
plt.tight_layout(); plt.savefig(os.path.join(OUT,"chart_agnostic.png"),bbox_inches="tight",facecolor=WHITE); plt.close()

# ---- Chart C: testing types — normalized composition by year ----
years=[2024,2025,2026]
series={
 "Automation":([37,24,31],GRAY,1.8,False),
 "Manual":([22,16,19],GRAY,1.8,False),
 "API":([13,31,21],GRAY,1.8,False),
 "Mobile":([28,20,15],GRAY_D,1.8,False),
 "Performance":([0,6,8],GREEN,3.2,True),
 "Security":([0,2,7],GREEN_D,3.2,True),
}
fig,ax=plt.subplots(figsize=(9.6,5.4))
# small vertical offsets to keep right-edge labels from colliding
yoff={"Performance":1.6,"Security":-1.6}
for name,(ys,col,lw,hi) in series.items():
    ax.plot(years,ys,marker="o",ms=6 if hi else 4,lw=lw,color=col,zorder=5 if hi else 2)
    ax.text(2026+0.05,ys[-1]+yoff.get(name,0),f" {name} {ys[-1]}%",va="center",fontsize=12 if hi else 11,
            color=(INK if hi else "#8A9282"),fontweight="bold" if hi else "normal")
ax.set_xticks(years); ax.set_xticklabels(years,fontsize=13)
ax.set_xlim(2023.9,2027.0); ax.set_ylim(-1,40); ax.set_yticks([])
style(ax)
ax.set_ylabel("Доля среди упоминаний видов тестирования, %",fontsize=11.5,color="#555")
plt.tight_layout(); plt.savefig(os.path.join(OUT,"chart_testtypes.png"),bbox_inches="tight",facecolor=WHITE); plt.close()

# ---- Chart D: supply weighted to working level (High+Medium) ----
sk=["JS / TS","Java","Python","C#","Kotlin"]; sv=[58,46,25,14,5]
fig,ax=plt.subplots(figsize=(8.2,4.8))
bars=ax.bar(sk,sv,color=[GREEN,INK,GREEN_D,GRAY,GRAY_D],width=0.6)
for b,v in zip(bars,sv):
    ax.text(b.get_x()+b.get_width()/2,v+1,str(v),ha="center",fontsize=14,fontweight="bold",color=INK)
ax.set_ylim(0,68); ax.set_yticks([]); style(ax)
ax.set_ylabel("Инженеров, рабочий уровень (High+Medium)",fontsize=11,color="#555")
plt.tight_layout(); plt.savefig(os.path.join(OUT,"chart_supply.png"),bbox_inches="tight",facecolor=WHITE); plt.close()

print("done")
for f in ["chart_langtier.png","chart_agnostic.png","chart_testtypes.png","chart_supply.png"]:
    print("  ",f, os.path.exists(os.path.join(OUT,f)))
