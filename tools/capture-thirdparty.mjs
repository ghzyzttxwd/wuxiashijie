import fs from 'node:fs/promises';
import puppeteer from 'puppeteer-core';

const browserPath=process.env.BROWSER_PATH;
if(!browserPath)throw new Error('BROWSER_PATH_required');
const url=process.env.CAPTURE_URL||'http://127.0.0.1:4173/tools/visual-combat.html?freeze=impact&art=metrixel&assetBase=/.visual-assets';
const out=process.env.CAPTURE_OUT||'artifacts/combat-thirdparty.png';
const domOut=process.env.CAPTURE_DOM||'artifacts/combat-thirdparty-dom.html';

const browser=await puppeteer.launch({
  executablePath:browserPath,
  headless:true,
  args:['--no-sandbox','--disable-dev-shm-usage','--enable-unsafe-swiftshader','--use-angle=swiftshader','--window-size=1440,900']
});
try{
  const page=await browser.newPage();
  await page.setViewport({width:1440,height:900,deviceScaleFactor:1});
  page.on('console',msg=>console.log(`[browser:${msg.type()}] ${msg.text()}`));
  page.on('pageerror',err=>console.error('[browser:pageerror]',err));
  page.on('requestfailed',req=>console.error('[browser:requestfailed]',req.url(),req.failure()?.errorText||''));
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:30000});
  await page.waitForFunction(()=>document.body.dataset.thirdPartyArt==='ready'||document.body.dataset.thirdPartyArt==='failed',{timeout:120000});
  const artState=await page.evaluate(()=>document.body.dataset.thirdPartyArt);
  if(artState!=='ready')throw new Error(`third_party_art_${artState}`);
  await page.waitForFunction(()=>document.body.dataset.visualReady==='impact'||document.body.dataset.visualReady==='failed',{timeout:30000});
  const visualState=await page.evaluate(()=>document.body.dataset.visualReady);
  if(visualState!=='impact')throw new Error(`visual_state_${visualState}`);
  await fs.writeFile(domOut,await page.content(),'utf8');
  await page.screenshot({path:out,fullPage:true});
  console.log('third-party fighter capture ready');
}finally{
  await browser.close();
}
