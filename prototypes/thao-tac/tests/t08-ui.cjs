/* Run with Node and Playwright installed externally; no dependencies in the prototype. */
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const root = path.resolve(__dirname, '..');
const evidence = path.join(root, 'screenshots');
const entry = pathToFileURL(path.join(root, 'index.html')).href;
const baseline = process.env.T08_BASELINE;
const measurements = [];
const diagnostics = [];
const check = (value, message) => assert.ok(value, message);
async function open(browser, url, viewport = { width: 1180, height: 820 }, touch = false) {
  const context = await browser.newContext({ viewport, hasTouch: touch, reducedMotion: 'reduce' });
  const page = await context.newPage();
  page.on('pageerror', error => diagnostics.push(error.message));
  page.on('console', msg => { if (['error', 'warning'].includes(msg.type())) diagnostics.push(msg.text()); });
  page.on('request', request => { if (/^https?:/.test(request.url())) diagnostics.push('Network: ' + request.url()); });
  await page.goto(url);
  return page;
}
async function drag(page, item, target, touch = false) {
  const from = await page.locator(item).boundingBox();
  const to = await page.locator(target).boundingBox();
  const x = from.x + from.width / 2, y = from.y + from.height / 2;
  const endX = to.x + to.width / 2, endY = to.y + to.height / 2;
  if (touch) {
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
    for (let i = 1; i <= 8; i++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x + (endX-x)*i/8, y: y + (endY-y)*i/8 }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await cdp.detach();
  } else {
    await page.mouse.move(x, y); await page.mouse.down();
    await page.mouse.move(endX, endY, { steps: 8 }); await page.mouse.up();
  }
}
async function contrast(page) {
  const failures = await page.evaluate(() => {
    const rgb = value => (value.match(/[\d.]+/g) || []).map(Number);
    const luminance = c => c.slice(0,3).map(v=>{v/=255; return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0);
    const failures = [];
    for (const el of document.querySelectorAll('body *')) {
      if (!el.getClientRects().length || ![...el.childNodes].some(n=>n.nodeType===3 && n.textContent.trim())) continue;
      let ancestor=el, background;
      while(ancestor) { const c=rgb(getComputedStyle(ancestor).backgroundColor); if(c.length===3||c[3]===1){background=c;break;} ancestor=ancestor.parentElement; }
      const style=getComputedStyle(el), foreground=rgb(style.color);
      if(!background)background=[255,255,255];
      const a=luminance(foreground), b=luminance(background), ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);
      if(ratio<4.5)failures.push({text:el.textContent.trim().slice(0,40),ratio});
    }
    return failures;
  });
  check(!failures.length, 'Text contrast >=4.5:1: '+JSON.stringify(failures));
}
async function logs(page) {
  return page.evaluate(() => mathLogger.getAll().slice().reverse().map(({mode, type, detail}) => {
    const normalized = JSON.parse(JSON.stringify(detail));
    if (normalized.newTenId) normalized.newTenId = '<generated-id>';
    return {mode, type, detail: normalized};
  }));
}
async function workflow(browser, base, touch = false) {
  const page = await open(browser, base + '?mode=mode1', undefined, touch);
  await drag(page, '#unit-27-1', '#zone-board-tens', touch);
  check(await page.locator('#holder-num27 #unit-27-1').count(), 'Wrong drop returns item');
  await drag(page, '#unit-27-1', '#zone-board-units', touch);
  check(await page.locator('#items-board-units #unit-27-1').count(), 'Valid drop moves item');
  await page.locator('#ten-27-1').focus(); await page.keyboard.press('Enter');
  check(await page.locator('#items-board-tens #ten-27-1').count(), 'Keyboard moves item');
  await page.locator('[data-action="move-all-num27"]').click();
  await page.locator('[data-action="move-all-num15"]').click();
  await page.locator('#btn-group-tens').click();
  check(await page.locator('#items-board-tens .draggable-item').count() === 4, 'Four tens after grouping');
  check(await page.locator('#items-board-units .draggable-item').count() === 2, 'Two units after grouping');
  await page.locator('#tab-btn-2').click();
  await page.locator('[data-field="units"]').focus();
  await page.keyboard.type('213');
  await page.locator('#btn-mode2-check').click();
  if (base === entry) await contrast(page);
  check((await page.locator('#mode2-feedback').getAttribute('class')).includes('warning'), 'Carry hint');
  await page.locator('[data-field="tens"]').click(); await page.locator('[data-key="4"]').click();
  await page.locator('#btn-mode2-check').click();
  if (base === entry) await contrast(page);
  check((await page.locator('#mode2-feedback').getAttribute('class')).includes('success'), 'Column success');
  check((await logs(page)).findLast(e=>e.type==='KIEM_TRA_DUNG_TOAN_DIEN').detail.afterFeedback, 'Assistance preserved');
  await page.locator('#tab-btn-3').click();
  await page.locator('[data-option-id="A"]').focus(); await page.keyboard.press('Space');
  await page.locator('#btn-mode3-check').click();
  await page.locator('[data-option-id="B"]').click(); await page.locator('#btn-mode3-check').click();
  check((await logs(page)).findLast(e=>e.type==='KIEM_TRA_DAP_AN_DUNG').detail.afterFeedback, 'Choice assistance preserved');
  if (base === entry) await contrast(page);
  const events = await logs(page);
  await page.context().close(); return events;
}
(async () => {
  const browser = await chromium.launch({ channel: process.env.T08_BROWSER || 'chrome', headless: true });
  const css = fs.readFileSync(path.join(root, 'css/style.css'), 'utf8').split(/^}/m).slice(1).join('}');
  check(!/#[\da-f]{3,8}\b|rgba?\(|hsla?\(|\b\d+(?:\.\d+)?px\b/i.test(css), 'Only root contains raw colors/px');
  for (const [width,height] of [[768,820],[1024,768],[1180,820],[1280,800],[1440,900]]) {
    for (let mode=1; mode<=3; mode++) {
      const page = await open(browser, entry+'?mode=mode'+mode, {width,height});
      const metrics = await page.evaluate(() => {
        const controls = [...document.querySelectorAll('.nav-tab-btn,.panel-active button,.panel-active [tabindex]')].filter(e=>e.getClientRects().length);
        const rects = controls.map(e=>e.getBoundingClientRect());
        const gaps = rects.flatMap((a,i)=>rects.slice(i+1).map(b=>Math.hypot(Math.max(0,a.left-b.right,b.left-a.right),Math.max(0,a.top-b.bottom,b.top-a.bottom))));
        const headings = [...document.querySelectorAll('h1,.panel-active h2,.panel-active h3')].map(e=>+e.tagName[1]);
        const focusables = [...document.querySelectorAll('button,[tabindex="0"]')].filter(e=>e.getClientRects().length && !e.disabled);
        return { minWidth:Math.min(...rects.map(r=>r.width)), minHeight:Math.min(...rects.map(r=>r.height)), minGap:Math.min(...gaps), overflow:document.documentElement.scrollWidth>innerWidth,
          columnsBottom:document.querySelector('.board-columns').getBoundingClientRect().bottom,
          materialsBottom:document.querySelector('.materials-area').getBoundingClientRect().bottom,
          debug:getComputedStyle(document.querySelector('.debug-section')).display,
          feedback:document.querySelector('.panel-active .feedback-banner').getAttribute('aria-live'),
          headings, focusCount:focusables.length,
          motion:[...document.querySelectorAll('*')].some(e=>getComputedStyle(e).animationName!=='none'||parseFloat(getComputedStyle(e).transitionDuration)>0)
        };
      });
      check(!metrics.overflow, `Overflow ${width} mode${mode}`);
      check(metrics.minWidth>=48 && metrics.minHeight>=48 && metrics.minGap>=7.99, `Touch size/gap ${width} mode${mode}: ${JSON.stringify(metrics)}`);
      check(metrics.debug==='none' && metrics.feedback==='polite' && !metrics.motion, 'Debug/live/reduced motion');
      check(metrics.headings.every((h,i)=>i===0?h===1:h<=metrics.headings[i-1]+1), 'Heading hierarchy');
      if(mode===1 && width>=1024) check(Math.max(metrics.materialsBottom,metrics.columnsBottom)<=height, `Drag workspace fits ${width}`);
      // Real Tab presses: focus must be visible, never enter a hidden mode/debug.
      for(let i=0;i<metrics.focusCount;i++) {
        await page.keyboard.press('Tab');
        check(await page.evaluate(()=>{const e=document.activeElement;const s=getComputedStyle(e);return !!e.getClientRects().length && s.outlineStyle!=='none' && !e.closest('.debug-section');}), 'Visible keyboard focus');
      }
      await contrast(page);
      measurements.push({width,height,mode,...metrics});
      if([1180,1440].includes(width)) await page.screenshot({path:path.join(evidence,`t08-after-${width}-mode${mode}.png`),fullPage:true});
      await page.context().close();
    }
  }
  // No correct option preselected and no auto-total exposed before children finish.
  const initial = await open(browser, entry);
  check(!(await initial.locator('.summary-line').isVisible()), 'Auto-total hidden');
  await initial.locator('[data-action="move-all-num27"]').click();
  await initial.locator('[data-action="move-all-num15"]').click();
  check(!(await initial.locator('.summary-line').isVisible()), 'Auto-total hidden before grouping');
  await initial.locator('#btn-group-tens').click();
  await initial.screenshot({path:path.join(evidence,'t08-grouped-1180.png'),fullPage:true});
  await initial.locator('#tab-btn-3').click();
  check(await initial.locator('[aria-checked="true"]').count()===0, 'No correct choice revealed');
  await initial.locator('[data-option-id="A"]').click();
  await initial.locator('#btn-mode3-check').click();
  await contrast(initial);
  await initial.screenshot({path:path.join(evidence,'t08-hint-1180.png'),fullPage:true});
  await initial.context().close();
  const mouseEvents = await workflow(browser, entry);
  const touchEvents = await workflow(browser, entry, true);
  assert.deepEqual(touchEvents, mouseEvents, 'Touch and mouse event contracts');
  if (baseline) assert.deepEqual(mouseEvents, await workflow(browser, pathToFileURL(path.resolve(baseline)).href), 'Unchanged baseline event contract');
  const debug = await open(browser, entry+'?debug=1');
  await contrast(debug);
  check(await debug.locator('.debug-section').isVisible(), 'Debug opt in');
  check(await debug.locator('#debug-log-tbody tr').count()>0, 'Logger populated');
  await debug.screenshot({path:path.join(evidence,'t08-debug-1180.png'),fullPage:true});
  await debug.context().close();
  check(diagnostics.length===0, JSON.stringify(diagnostics));
  fs.writeFileSync(path.join(root,'tests/t08-results.json'), JSON.stringify({browser:await browser.version(),measurements,events:mouseEvents,diagnostics},null,2)+'\n');
  console.log('PASS: 15 viewport/mode cases; keyboard focus/numeric input, contrast >=4.5:1, touch targets/gaps, reduced motion, debug, mouse/touch workflows, baseline event parity, zero console/network errors.');
  await browser.close();
})().catch(error=>{console.error(error);process.exit(1)});
