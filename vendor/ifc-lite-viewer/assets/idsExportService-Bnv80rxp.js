import{f as e,h as t}from"./ids-CfJyTjvY.js";import{l as n,n as r}from"./analytics-DTV34XCK.js";import{s as i}from"./download-CeoHegq-.js";function a(e){let n=new Map;for(let t of e)for(let e of t.requirementResults){let r=e.requirement.id,i=n.get(r);i||(i={key:r,requirement:e.requirement,facetType:e.facetType,checkedDescription:e.checkedDescription,passedCount:0,failedCount:0,notApplicableCount:0,passRate:0,failingEntities:[]},n.set(r,i)),e.status===`pass`?i.passedCount++:e.status===`fail`?(i.failedCount++,i.failingEntities.push({modelId:t.modelId,expressId:t.expressId,entityType:t.entityType,entityName:t.entityName,globalId:t.globalId,failureReason:e.failureReason,actualValue:e.actualValue,expectedValue:e.expectedValue})):i.notApplicableCount++}for(let e of n.values()){let n=e.passedCount+e.failedCount;e.passRate=n>0?t(e.passedCount,n):100}return Array.from(n.values())}function o(e){let n=0,r=0,i=0;for(let t of e)for(let e of t.requirementResults)e.status===`pass`?n++:e.status===`fail`?r++:i++;let a=n+r,o=a>0?t(n,a):100;return{totalChecks:n+r+i,passedChecks:n,failedChecks:r,notApplicableChecks:i,checkPassRate:o}}function s(n){if(!e(n))return null;let r=0,i=0,a=0,s=0;for(let e of n.specificationResults){let t=e.specification,n=e.entityResults.filter(e=>!e.passed).length;if(e.error||n!==e.failedCount)return null;let c=e.entityResults.length-n,l=e.passedCount-c;if(l<0||e.passedCount+e.failedCount!==e.applicableCount)return null;let u=o(e.entityResults);r+=u.passedChecks+l*t.requirements.length,i+=u.failedChecks;let d=new Set;for(let t of e.entityResults)for(let e of t.requirementResults)e.status===`fail`&&d.add(e.requirement.id);a+=t.requirements.length,(e.applicableCount!==0||e.cardinalityResult?.passed!==!1)&&(s+=t.requirements.filter(e=>!d.has(e.id)).length)}return{passed:r,failed:i,checked:r+i,passRate:t(r,r+i),requirements:a,passedRequirements:s}}function c(e){return{...e,timestamp:e.timestamp.toISOString()}}function l(e){let t=c(e);i(JSON.stringify(t,null,2),`ids-report-${new Date().toISOString().split(`T`)[0]}.json`,`application/json`),n({format:`json`,surface:`ids_panel`}),r.capture(`ids_report_exported`,{format:`json`,total_specifications:e.summary.totalSpecifications})}function u(e){return e==null?``:String(e).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#39;`)}function d(e){let t=new Map;for(let n of e.entityResults)for(let e of n.requirementResults){let r=e.requirement.id,i=t.get(r);i||(i={id:r,facetType:e.facetType,checkedDescription:e.checkedDescription,passed:0,failed:0,notApplicable:0,failingElements:[]},t.set(r,i)),e.status===`pass`?i.passed++:e.status===`fail`?(i.failed++,i.failingElements.push({entityType:n.entityType,entityName:n.entityName,globalId:n.globalId,expressId:n.expressId,failureReason:e.failureReason})):i.notApplicable++}return Array.from(t.values())}var f=100,p=5,m=100,h=160;function g(e,t,n=h){if(e==null)return``;let r=String(e),i=Array.from(r);return i.length<=n?t(r):`<span class="truncated" title="${t(r)}">${t(i.slice(0,n).join(``))}&hellip;</span>`}function _(e,t){if(e.length===0)return``;let n=new Map;for(let t of e){let e=n.get(t.entityType);e?e.push(t):n.set(t.entityType,[t])}let r=[],i=[],a=0;for(let[e,o]of n){if(a>=f)break;let n=f-a,s=Math.min(p,o.length,n);for(let e=0;e<s;e++){let n=o[e];r.push(`<tr class="entity-row" data-status="fail" data-type="${t(n.entityType)}" data-name="${t(n.entityName??``)}">
            <td class="col-type">${t(n.entityType)}</td>
            <td class="col-name">${g(n.entityName,t)||`<em>unnamed</em>`}</td>
            <td class="col-globalid"><code class="globalid" title="Click to copy">${t(n.globalId)||`—`}</code></td>
            <td class="col-expressid">${n.expressId}</td>
            <td class="col-failure">${g(n.failureReason,t)||`—`}</td>
          </tr>`)}a+=s,o.length>s&&i.push(`Showing ${s} of ${o.length} ${t(e)} failures`)}let o=e.length-a;return`<table class="req-fail-table">
        <thead>
          <tr>
            <th class="col-type">IFC Class</th>
            <th class="col-name">Name</th>
            <th class="col-globalid">GlobalId</th>
            <th class="col-expressid">ID</th>
            <th class="col-failure">Reason</th>
          </tr>
        </thead>
        <tbody>${r.join(``)}</tbody>
      </table>
      ${i.length>0?`<div class="truncation-note">${i.map(e=>`<div>${e}</div>`).join(``)}</div>`:``}
      ${o>0?`<div class="truncation-note truncation-total">Showing ${a} of ${e.length} failing elements for this requirement (${o} hidden). See the JSON export for complete results.</div>`:``}`}function v(e,n){let r=e.passed+e.failed,i=r>0?t(e.passed,r):100,a=e.failed>0?`fail`:`pass`;return`<div class="req-group req-group-${a}">
        <div class="req-group-header">
          <span class="badge ${a===`pass`?`badge-pass`:`badge-fail`}">${a===`pass`?`PASS`:`FAIL`}</span>
          <span class="req-facet">${n(e.facetType)}</span>
          <span class="req-desc">${g(e.checkedDescription,n)}</span>
        </div>
        <div class="req-group-stats">
          <span class="pass-count">${e.passed}</span>/<span class="total-count">${r}</span> checks passed (${i}%)
          ${e.notApplicable>0?`<span class="req-na">&middot; ${e.notApplicable} not applicable</span>`:``}
        </div>
        ${e.failed>0?`<div class="req-group-failures">${_(e.failingElements,n)}</div>`:``}
      </div>`}function y(e,t){return[...e.entityResults.filter(e=>!e.passed),...e.entityResults.filter(e=>e.passed)].slice(0,m).map(e=>{let n=e.requirementResults.filter(e=>e.status===`fail`),r=e.requirementResults.filter(e=>e.status===`pass`),i=e.requirementResults.filter(e=>e.status!==`not_applicable`),a=n.length>0?n.map(e=>`<div class="req-detail">
            <span class="req-facet">${t(e.facetType)}</span>
            <span class="req-desc">${g(e.checkedDescription,t)}</span>
            ${e.failureReason?`<div class="req-failure">${g(e.failureReason,t)}</div>`:``}
            ${e.expectedValue||e.actualValue?`<div class="req-values">${e.expectedValue?`<span>Expected: <code>${g(e.expectedValue,t)}</code></span>`:``}${e.actualValue?`<span>Actual: <code>${g(e.actualValue,t)}</code></span>`:``}</div>`:``}
          </div>`).join(``):`<span class="all-pass">All requirements passed</span>`;return`<tr class="entity-row" data-status="${e.passed?`pass`:`fail`}" data-type="${t(e.entityType)}" data-name="${t(e.entityName??``)}">
        <td class="col-status"><span class="badge ${e.passed?`badge-pass`:`badge-fail`}">${e.passed?`PASS`:`FAIL`}</span></td>
        <td class="col-type">${t(e.entityType)}</td>
        <td class="col-name">${g(e.entityName,t)||`<em>unnamed</em>`}</td>
        <td class="col-globalid"><code class="globalid" title="Click to copy">${t(e.globalId)||`—`}</code></td>
        <td class="col-expressid">${e.expressId}</td>
        <td class="col-reqs"><span class="pass-count">${r.length}</span>/<span class="total-count">${i.length}</span></td>
        <td class="col-details"><details><summary>${n.length>0?`${n.length} failure${n.length>1?`s`:``}`:`Details`}</summary><div class="req-list">${a}</div></details></td>
      </tr>`}).join(``)}function b(e,n){let r=u,i=e.source.kind===`ids`?e.source.document.info.title:e.source.ruleSet.name,a=e.source.kind===`ids`?e.source.document.info.description:e.source.ruleSet.description,o=e.source.kind===`ids`?e.source.document.info.author:void 0,c=e.modelInfo.map(e=>e.schemaVersion).join(`, `),l=e.summary.totalEntitiesChecked,f=e.specificationResults.reduce((e,t)=>e+t.passedCount,0),p=e.specificationResults.reduce((e,t)=>e+t.failedCount,0),g=e.specificationResults.map(e=>d(e)),_=s(e),b=e.source.kind===`rules`||_!==null,x=_?.passed??0,S=_?.failed??0;if(e.source.kind===`rules`)for(let e of g)for(let t of e)x+=t.passed,S+=t.failed;let C=x+S,w=C>0?t(x,C):100,T=e.source.kind===`rules`||b&&C>0,E=e.summary.overallPassRate,D=e.summary.totalSpecifications>0?t(e.summary.passedSpecifications,e.summary.totalSpecifications):100;return`<!DOCTYPE html>
<html lang="${r(n)}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>IDS Validation Report - ${r(i)}</title>
  <style>
    :root {
      --pass: #22c55e; --pass-bg: #dcfce7; --pass-border: #86efac;
      --fail: #ef4444; --fail-bg: #fef2f2; --fail-border: #fca5a5;
      --warn: #eab308; --muted: #6b7280; --border: #e5e7eb;
      --bg: #f8fafc; --card: #fff; --hover: #f1f5f9;
    }
    * { box-sizing: border-box; margin: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 1400px; margin: 0 auto; padding: 20px; background: var(--bg); color: #1e293b; line-height: 1.5; }
    h1 { font-size: 1.5rem; margin-bottom: 4px; }
    h2 { font-size: 1.25rem; margin-bottom: 8px; }
    h3 { font-size: 1rem; }
    .card { background: var(--card); border-radius: 8px; padding: 20px; margin-bottom: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04); }
    .meta { color: var(--muted); font-size: 0.875rem; margin-top: 4px; }
    .meta span { margin-right: 16px; }

    /* Summary grid */
    .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin-top: 12px; }
    .stat { text-align: center; padding: 12px; background: var(--bg); border-radius: 8px; border: 1px solid var(--border); }
    .stat .value { font-size: 1.75rem; font-weight: 700; }
    .stat .label { color: var(--muted); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; }
    .stat.pass .value { color: var(--pass); }
    .stat.fail .value { color: var(--fail); }

    /* Progress bar */
    .progress { height: 8px; background: var(--fail-bg); border-radius: 4px; overflow: hidden; margin: 8px 0; }
    .progress-fill { height: 100%; background: var(--pass); border-radius: 4px; transition: width 0.3s; }

    /* Filter toolbar */
    .toolbar { display: flex; gap: 8px; align-items: center; margin-bottom: 12px; flex-wrap: wrap; }
    .toolbar input[type="text"] { padding: 6px 12px; border: 1px solid var(--border); border-radius: 6px; font-size: 0.875rem; min-width: 200px; }
    .toolbar input[type="text"]:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.2); }
    .filter-btn { padding: 5px 12px; border: 1px solid var(--border); border-radius: 6px; background: var(--card); cursor: pointer; font-size: 0.8rem; font-weight: 500; }
    .filter-btn:hover { background: var(--hover); }
    .filter-btn.active { background: #1e293b; color: white; border-color: #1e293b; }
    .result-count { color: var(--muted); font-size: 0.8rem; margin-left: auto; }

    /* Specification sections */
    .spec { border: 1px solid var(--border); border-radius: 8px; margin-bottom: 12px; overflow: hidden; }
    .spec-header { padding: 16px; cursor: pointer; display: flex; align-items: flex-start; gap: 12px; }
    .spec-header:hover { background: var(--hover); }
    .spec-indicator { font-size: 1.25rem; margin-top: 2px; transition: transform 0.2s; }
    .spec.open .spec-indicator { transform: rotate(90deg); }
    .spec-info { flex: 1; }
    .spec-info h3 { display: flex; align-items: center; gap: 8px; }
    .spec-desc { color: var(--muted); font-size: 0.875rem; margin-top: 4px; }
    .spec-stats { display: flex; gap: 16px; font-size: 0.8rem; color: var(--muted); margin-top: 8px; }
    .spec-body { display: none; border-top: 1px solid var(--border); }
    .spec.open .spec-body { display: block; }

    /* Entity table */
    table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
    th { padding: 8px 12px; text-align: left; background: var(--bg); font-weight: 600; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted); cursor: pointer; user-select: none; white-space: nowrap; border-bottom: 2px solid var(--border); }
    th:hover { background: #e2e8f0; }
    th .sort-icon { margin-left: 4px; opacity: 0.3; }
    th.sorted .sort-icon { opacity: 1; }
    td { padding: 8px 12px; border-bottom: 1px solid #f1f5f9; vertical-align: top; }
    tr.entity-row:hover { background: var(--hover); }
    tr.entity-row[data-status="fail"] { background: #fefce8; }
    tr.entity-row[data-status="fail"]:hover { background: #fef9c3; }

    /* Badges */
    .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.05em; }
    .badge-pass { background: var(--pass-bg); color: #166534; border: 1px solid var(--pass-border); }
    .badge-fail { background: var(--fail-bg); color: #991b1b; border: 1px solid var(--fail-border); }
    .badge-spec { font-size: 0.7rem; padding: 2px 6px; }

    /* Columns */
    .col-status { width: 60px; }
    .col-type { width: 140px; font-family: monospace; font-size: 0.8rem; }
    .col-name { min-width: 120px; }
    .col-globalid { width: 200px; }
    .col-expressid { width: 70px; text-align: right; font-family: monospace; }
    .col-reqs { width: 60px; text-align: center; }
    .col-details { min-width: 200px; }

    /* GlobalId */
    code.globalid { font-size: 0.75rem; background: #f1f5f9; padding: 2px 6px; border-radius: 3px; cursor: pointer; word-break: break-all; }
    code.globalid:hover { background: #e2e8f0; }
    code.globalid.copied { background: var(--pass-bg); }

    /* Requirement details */
    details summary { cursor: pointer; color: var(--fail); font-size: 0.8rem; }
    details summary:hover { text-decoration: underline; }
    .req-list { padding: 8px 0; }
    .req-detail { padding: 6px 0; border-bottom: 1px solid #f1f5f9; }
    .req-detail:last-child { border-bottom: none; }
    .req-facet { display: inline-block; background: #f1f5f9; padding: 1px 6px; border-radius: 3px; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; color: var(--muted); margin-right: 6px; }
    .req-desc { font-size: 0.8rem; }
    .req-failure { color: var(--fail); font-size: 0.8rem; margin-top: 2px; }
    .req-values { display: flex; gap: 16px; font-size: 0.75rem; color: var(--muted); margin-top: 2px; }
    .req-values code { background: #fef3c7; padding: 1px 4px; border-radius: 2px; color: #92400e; }
    .all-pass { color: var(--pass); font-size: 0.8rem; }
    .pass-count { color: var(--pass); font-weight: 600; }
    .total-count { color: var(--muted); }

    /* Two-rates (check level vs specification level) */
    .two-rates { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-top: 16px; }
    .rate-block { padding: 12px; background: var(--bg); border-radius: 8px; border: 1px solid var(--border); }
    .rate-block-header { display: flex; align-items: baseline; gap: 8px; margin-bottom: 6px; }
    .rate-value { font-size: 1.5rem; font-weight: 700; }
    .rate-label { color: var(--muted); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; }
    .rate-detail { color: var(--muted); font-size: 0.8rem; margin-top: 4px; }
    .rate-explainer { font-size: 0.8rem; color: var(--muted); margin-top: 12px; line-height: 1.6; }
    .export-note { font-size: 0.8rem; color: var(--muted); margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--border); }

    /* Requirement groups */
    .req-groups { padding: 16px; }
    .req-groups h4 { margin-bottom: 10px; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted); }
    .req-group { border: 1px solid var(--border); border-radius: 6px; padding: 10px 12px; margin-bottom: 8px; }
    .req-group-pass { background: var(--pass-bg); border-color: var(--pass-border); }
    .req-group-fail { background: #fffbeb; border-color: var(--warn); }
    .req-group-header { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .req-group-stats { font-size: 0.8rem; color: var(--muted); margin-top: 4px; }
    .req-na { color: var(--muted); }
    .req-group-failures { margin-top: 10px; }
    .req-fail-table { width: 100%; border-collapse: collapse; font-size: 0.8rem; background: var(--card); }
    .req-fail-table th { padding: 6px 10px; text-align: left; background: var(--bg); font-weight: 600; font-size: 0.7rem; text-transform: uppercase; color: var(--muted); border-bottom: 2px solid var(--border); }
    .req-fail-table td { padding: 6px 10px; border-bottom: 1px solid #f1f5f9; vertical-align: top; }
    .col-failure { min-width: 200px; color: var(--fail); }
    .truncation-note { font-size: 0.75rem; color: var(--muted); font-style: italic; margin-top: 6px; padding: 0 10px; }
    /* A truncated field keeps its full text in a title attribute; cue that it is hoverable. */
    .truncated { border-bottom: 1px dotted var(--muted); cursor: help; }
    .truncation-total { font-weight: 600; }

    /* Secondary per-entity table */
    .entity-table-details { padding: 0 16px 16px; }
    .entity-table-details summary { cursor: pointer; font-size: 0.85rem; color: var(--muted); padding: 8px 0; }
    .entity-table-details summary:hover { color: #1e293b; }
    .entity-table-details table { border-top: 1px solid var(--border); }

    /* Responsive */
    @media (max-width: 768px) {
      .col-globalid, .col-expressid { display: none; }
      .toolbar { flex-direction: column; }
      .toolbar input[type="text"] { width: 100%; min-width: unset; }
    }

    /* Print */
    @media print {
      body { background: white; max-width: none; }
      .card { box-shadow: none; border: 1px solid #ddd; }
      .toolbar { display: none; }
      .spec.open .spec-body { display: block; }
      details { open; }
      details[open] summary { display: none; }
    }

    .hidden { display: none !important; }
  </style>
</head>
<body>
  <!-- Header -->
  <div class="card">
    <h1>${r(i)}</h1>
    ${e.targetScope?`<p>Filtered population: ${r(e.targetScope.entityCount.toLocaleString(n))} candidates. This is not a whole-model validation.</p>`:``}
    ${a?`<p style="color: var(--muted); margin-top: 4px;">${r(a)}</p>`:``}
    <div class="meta">
      ${o?`<span>Author: ${r(o)}</span>`:``}
      <span>Generated: ${r(e.timestamp.toLocaleString())}</span>
      <span>Schema: ${r(c)}</span>
    </div>
  </div>

  <!-- Summary -->
  <div class="card">
    <h2>Summary</h2>
    <div class="summary">
      <div class="stat">
        <div class="value">${e.summary.totalSpecifications}</div>
        <div class="label">Specifications</div>
      </div>
      <div class="stat pass">
        <div class="value">${e.summary.passedSpecifications}</div>
        <div class="label">Specs Passed</div>
      </div>
      <div class="stat fail">
        <div class="value">${e.summary.failedSpecifications}</div>
        <div class="label">Specs Failed</div>
      </div>
      <div class="stat">
        <div class="value">${l}</div>
        <div class="label">Entities Checked</div>
      </div>
      <div class="stat pass">
        <div class="value">${f}</div>
        <div class="label">Passed</div>
      </div>
      <div class="stat fail">
        <div class="value">${p}</div>
        <div class="label">Failed</div>
      </div>
    </div>

    <!-- The three rates below measure different things and are EXPECTED to
         disagree; see the explanation text. -->
    <div class="two-rates">
      <div class="rate-block">
        <div class="rate-block-header">
          <span class="rate-value">${T?`${w}%`:`&mdash;`}</span>
          <span class="rate-label">Check pass rate</span>
        </div>
        ${T?`<div class="progress"><div class="progress-fill" style="width: ${w}%;"></div></div>`:``}
        <div class="rate-detail">${b?e.source.kind===`ids`&&C===0?`No requirement checks evaluated`:`${x} of ${C} element&ndash;requirement checks passed`:`Requirement check totals unavailable for this incomplete report`}</div>
      </div>
      <div class="rate-block">
        <div class="rate-block-header">
          <span class="rate-value">${E}%</span>
          <span class="rate-label">Entity pass rate</span>
        </div>
        <div class="progress"><div class="progress-fill" style="width: ${E}%;"></div></div>
        <div class="rate-detail">${f} of ${l} applicable entities passed every requirement</div>
      </div>
      <div class="rate-block">
        <div class="rate-block-header">
          <span class="rate-value">${D}%</span>
          <span class="rate-label">Specification pass rate</span>
        </div>
        <div class="progress"><div class="progress-fill" style="width: ${D}%;"></div></div>
        <div class="rate-detail">${e.summary.passedSpecifications} of ${e.summary.totalSpecifications} specifications fully passed</div>
      </div>
    </div>
    <p class="rate-explainer">
      These three numbers can legitimately differ &mdash; each answers a different question. <strong>Check
      pass rate</strong> is how much of the model is compliant, check by check (one element measured against
      one requirement). <strong>Entity pass rate</strong> requires an entity to pass every requirement of its
      specification to count as passing at all. <strong>Specification pass rate</strong> goes one step further:
      a specification passes only if every applicable entity passes it &mdash; one failing element fails the
      whole specification, the way one missing handrail fails a safety inspection. For a compliance
      deliverable, the specification pass rate is the number that matters: &ldquo;we passed
      ${e.summary.passedSpecifications} of ${e.summary.totalSpecifications} specifications&rdquo; is
      the honest statement, not the higher check-level or entity-level percentage.
    </p>
    <p class="export-note">
      This HTML report is a <strong>summary</strong>, not a data source: long failing-element lists are
      truncated below (always with the hidden count stated), and individual long text fields are shortened
      to ${h} characters with an ellipsis &mdash; hover such a field to read it in full.
      For complete, untruncated results, use the JSON export.
    </p>
  </div>

  <!-- Filter toolbar -->
  <div class="card">
    <div class="toolbar">
      <input type="text" id="search" placeholder="Search by name, type, or GlobalId..." oninput="filterAll()">
      <button class="filter-btn active" data-filter="all" onclick="setFilter('all')">All</button>
      <button class="filter-btn" data-filter="fail" onclick="setFilter('fail')">Failed Only</button>
      <button class="filter-btn" data-filter="pass" onclick="setFilter('pass')">Passed Only</button>
      <span class="result-count" id="result-count"></span>
    </div>

    <h2>Specifications</h2>

    ${e.specificationResults.map((e,n)=>{let i=g[n],a=i.reduce((e,t)=>e+t.passed,0),o=i.reduce((e,t)=>e+t.passed+t.failed,0),s=o>0?t(a,o):100;return`
    <div class="spec ${e.status===`fail`?`open`:``}" id="spec-${n}">
      <div class="spec-header" onclick="toggleSpec(${n})">
        <span class="spec-indicator">&#9654;</span>
        <div class="spec-info">
          <h3>
            <span class="badge badge-spec ${e.status===`pass`?`badge-pass`:e.status===`fail`?`badge-fail`:``}">${e.status.toUpperCase()}</span>
            ${r(e.specification.name)}
          </h3>
          ${e.specification.description?`<div class="spec-desc">${r(e.specification.description)}</div>`:``}
          <div class="spec-stats">
            <span>${e.applicableCount} applicable</span>
            <span style="color: var(--pass);">${e.passedCount} entities passed</span>
            <span style="color: var(--fail);">${e.failedCount} entities failed</span>
            <span>${e.passRate}% of entities passed</span>
            <span>${a}/${o} checks passed (${s}%)</span>
          </div>
          <div class="progress" style="margin-top: 6px;">
            <div class="progress-fill" style="width: ${e.passRate}%;"></div>
          </div>
        </div>
      </div>
      <div class="spec-body">
        <div class="req-groups">
          <h4>Requirements</h4>
          ${i.map(e=>v(e,r)).join(``)}
        </div>
        <details class="entity-table-details">
          <summary>Per-entity results (${e.entityResults.length} ${e.entityResults.length===1?`entity`:`entities`})</summary>
          <table>
            <thead>
              <tr>
                <th class="col-status" onclick="sortTable(${n}, 0)">Status <span class="sort-icon">&#x25B4;&#x25BE;</span></th>
                <th class="col-type" onclick="sortTable(${n}, 1)">IFC Class <span class="sort-icon">&#x25B4;&#x25BE;</span></th>
                <th class="col-name" onclick="sortTable(${n}, 2)">Name <span class="sort-icon">&#x25B4;&#x25BE;</span></th>
                <th class="col-globalid" onclick="sortTable(${n}, 3)">GlobalId <span class="sort-icon">&#x25B4;&#x25BE;</span></th>
                <th class="col-expressid" onclick="sortTable(${n}, 4)">ID <span class="sort-icon">&#x25B4;&#x25BE;</span></th>
                <th class="col-reqs">Reqs</th>
                <th class="col-details">Details</th>
              </tr>
            </thead>
            <tbody id="tbody-${n}">
              ${y(e,r)}
            </tbody>
          </table>
          ${e.entityResults.length>m?`<div class="truncation-note truncation-total">Showing ${m} of ${e.entityResults.length} entities (${e.entityResults.length-m} hidden, failing entities listed first). See the JSON export for complete results.</div>`:``}
        </details>
      </div>
    </div>
    `}).join(``)}
  </div>

  <footer style="text-align: center; color: var(--muted); padding: 20px; font-size: 0.8rem;">
    Generated by <strong>IFC-Lite</strong> IDS Validator &middot; ${r(new Date().toISOString().split(`T`)[0])}
  </footer>

  <script>
    let currentFilter = 'all';
    // Snapshot of the per-entity <details> open/closed state taken the moment
    // a search/filter starts, so clearing it restores what the reader had
    // rather than leaving every group forced open. Null while unfiltered.
    let detailsRestore = null;
    // Same snapshot for the outer .spec accordions, which ship collapsed
    // unless the specification failed. Taken and released together with
    // detailsRestore, so the two can never disagree about what "unfiltered"
    // looked like.
    let specRestore = null;

    function toggleSpec(i) {
      document.getElementById('spec-' + i).classList.toggle('open');
    }

    function setFilter(filter) {
      currentFilter = filter;
      document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
      });
      filterAll();
    }

    function filterAll() {
      const search = document.getElementById('search').value.toLowerCase();
      let visible = 0, total = 0;

      document.querySelectorAll('.entity-row').forEach(row => {
        total++;
        const status = row.dataset.status;
        // Visible cell text is truncated to a character budget, so also match
        // against the full values kept in data-* attributes and in the title
        // attributes that carry the untruncated text. Only the spans emitted by
        // truncateField do — a bare [title] sweep would also pick up the
        // GlobalId cell's static "Click to copy" hint, and every row would then
        // match a search for "to".
        const titles = Array.from(row.querySelectorAll('.truncated[title]'))
          .map(el => el.getAttribute('title'))
          .join(' ');
        const text = (row.textContent + ' ' + (row.dataset.name || '') + ' ' + (row.dataset.type || '') + ' ' + titles).toLowerCase();
        const matchesFilter = currentFilter === 'all' || status === currentFilter;
        const matchesSearch = !search || text.includes(search);
        const show = matchesFilter && matchesSearch;
        row.classList.toggle('hidden', !show);
        if (show) visible++;
      });

      // The per-entity table lives inside a collapsed <details>, so un-hiding
      // a row there is not enough to SHOW it: the counter would read
      // "1 of 3 rows shown" while the reader sees an empty page and no cue
      // that the match is behind a disclosure. Open any group that holds a
      // surviving row while a search/filter is active, and put the reader's
      // own open/closed state back when the search is cleared.
      //
      // The <details> is itself inside a .spec accordion whose .spec-body is
      // display:none unless the spec carries the "open" class — and only a
      // FAILING spec ships with it. So for an all-passing specification,
      // opening the disclosure alone still leaves the match invisible; the
      // spec has to be opened too, on the same rule and with the same restore.
      const groups = document.querySelectorAll('details.entity-table-details');
      const specs = document.querySelectorAll('.spec');
      if (search || currentFilter !== 'all') {
        if (detailsRestore === null) {
          detailsRestore = Array.prototype.map.call(groups, function (d) { return d.open; });
          specRestore = Array.prototype.map.call(specs, function (s) { return s.classList.contains('open'); });
        }
        groups.forEach(d => {
          if (d.querySelector('.entity-row:not(.hidden)')) d.open = true;
        });
        specs.forEach(s => {
          if (s.querySelector('.entity-row:not(.hidden)')) s.classList.add('open');
        });
      } else if (detailsRestore !== null) {
        groups.forEach((d, i) => { d.open = detailsRestore[i]; });
        specs.forEach((s, i) => { s.classList.toggle('open', specRestore[i]); });
        detailsRestore = null;
        specRestore = null;
      }

      document.getElementById('result-count').textContent =
        search || currentFilter !== 'all'
          ? visible + ' of ' + total + ' rows shown'
          : total + ' rows';
    }

    function sortTable(specIndex, colIndex) {
      const tbody = document.getElementById('tbody-' + specIndex);
      const rows = Array.from(tbody.querySelectorAll('tr.entity-row'));

      const th = tbody.parentElement.querySelectorAll('th')[colIndex];
      const asc = !th.classList.contains('sorted-asc');

      tbody.parentElement.querySelectorAll('th').forEach(h => {
        h.classList.remove('sorted', 'sorted-asc', 'sorted-desc');
      });
      th.classList.add('sorted', asc ? 'sorted-asc' : 'sorted-desc');

      rows.sort((a, b) => {
        let aVal = a.cells[colIndex].textContent.trim();
        let bVal = b.cells[colIndex].textContent.trim();

        if (colIndex === 4) {
          return asc ? Number(aVal) - Number(bVal) : Number(bVal) - Number(aVal);
        }

        return asc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      });

      rows.forEach(row => tbody.appendChild(row));
    }

    document.addEventListener('click', function(e) {
      if (e.target.classList.contains('globalid') && e.target.textContent !== '\\u2014') {
        navigator.clipboard.writeText(e.target.textContent).then(() => {
          e.target.classList.add('copied');
          setTimeout(() => e.target.classList.remove('copied'), 1000);
        });
      }
    });
    filterAll();
  <\/script>
</body>
</html>`}function x(e,t){let a=b(e,t);i(a,`ids-report-${new Date().toISOString().split(`T`)[0]}.html`,`text/html`),n({format:`html`,surface:`ids_panel`}),r.capture(`ids_report_exported`,{format:`html`,locale:t,total_specifications:e.summary.totalSpecifications})}export{s as a,l as i,c as n,o,x as r,a as s,b as t};