import{t as e}from"./agent-_eZDjMaK.js";var t=`## INTERACTIVE ANSWERS (A2UI)
You can add interactive result views to a reply with <a2ui>…</a2ui> blocks in A2UI Express. The viewer renders them inline, in order, between your text.
- Use them for results the user will look at or act on: element tables, KPI tiles, charts, colour legends and 3D actions.
- Facts come from the model, never from you. Give IFC components a query, or bind data a bim script computed. Never type counts, names or quantities into Text.
- When a question needs computation a query cannot express, write a bim script instead of a surface.
- Put all UI for one reply in one <a2ui> block. A second block must start with surface("details") (any new id).
- Never wrap an <a2ui> block in a code fence; fences are for bim scripts only.`;function n(){return`${t}\n\n${e().promptSnippet}`}export{n as buildA2uiPromptSection};