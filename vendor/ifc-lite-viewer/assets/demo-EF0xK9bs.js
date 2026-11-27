function e(e){return[...e.getState().models.values()].some(e=>!!e.ifcDataStore)}async function t(e,t=`Here is an overview of the walls. Every number below is computed live from the loaded model.

<a2ui>
root = Column([stats, table, chart, legend, actions])
stats = StatGroup([{label: "Walls", query: {types: ["IfcWall"]}}, {label: "External walls", query: {types: ["IfcWall"], where: [{path: "Pset_WallCommon.IsExternal", op: "eq", value: true}]}, tone: "info"}, {label: "Wall volume", query: {types: ["IfcWall"]}, aggregate: "sum", path: "Qto_WallBaseQuantities.NetVolume", unit: "m³"}, {label: "Slabs", query: {types: ["IfcSlab"]}}])
table = EntityTable([{path: "name", label: "Wall"}, {path: "Pset_WallCommon.IsExternal", label: "External"}, {path: "Qto_WallBaseQuantities.NetVolume", label: "Net volume (m³)"}, {path: "material", label: "Material"}], {types: ["IfcWall"]}, title="Walls", sort={path: "Qto_WallBaseQuantities.NetVolume", dir: "desc"})
chart = GroupChart("type", {types: ["IfcWall", "IfcSlab", "IfcSpace", "IfcRoof"]}, kind="bar", title="Elements by type")
legend = ColorLegend("Pset_WallCommon.IsExternal", {types: ["IfcWall"]}, title="Colour walls by IsExternal")
actions = ActionBar(["isolate", "colorize", "flyTo", "exportCsv"], {types: ["IfcWall"]}, color="#e5484d", followUps=[{label: "Which walls are load-bearing?", prompt: "Which walls are load-bearing?"}])
</a2ui>

Click a row to select that wall in 3D, or use the buttons to isolate, colour or export all of them.`,n=`Give me an overview of the walls in this model.`){let r=e.getState();if(r.chatStatus!==`streaming`&&r.chatStatus!==`sending`){r.setScriptPanelVisible(!0),r.setChatPanelVisible(!0),r.addChatMessage({id:crypto.randomUUID(),role:`user`,content:n,createdAt:Date.now()}),r.setChatStatus(`streaming`);for(let n=32;n<t.length;n+=32)e.getState().updateLastAssistantMessage(t.slice(0,n)),await new Promise(e=>setTimeout(e,25));e.getState().finalizeAssistantMessage(t)}}function n(n){if(e(n)){t(n);return}let r=n.subscribe(()=>{e(n)&&(r(),t(n))})}export{n as armA2uiDemo};