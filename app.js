/* ============================================================
   MERIDIAN FRONTIER, Trade Climate & Development
   A research instrument by Ayodele Idowu.
   Live client-side fetch from World Bank Open Data. No backend.
   Five domains: Trade · Environment · Agriculture · Development · Macro
   ============================================================ */

const WB = 'https://api.worldbank.org/v2';
const SERIES_COLORS = ['#4cc9b0','#e9c46a','#e07a5f','#8d99ae','#81b29a','#6699cc'];

const DOMAINS = {
  trade: {label:'Trade',       color:'#6699cc'},
  env:   {label:'Environment', color:'#81b29a'},
  agri:  {label:'Agriculture', color:'#e9c46a'},
  dev:   {label:'Development',  color:'#e07a5f'},
  macro: {label:'Macro',       color:'#4cc9b0'}
};

const INDICATORS = {
  // TRADE
  'NE.TRD.GNFS.ZS':       {d:'trade', label:'Trade openness (% of GDP)', short:'Trade/GDP', fmt:'pct', hint:'Exports plus imports as a share of GDP. The standard openness measure.'},
  'TX.VAL.MRCH.CD.WT':    {d:'trade', label:'Merchandise exports (current US$)', short:'Goods exports', fmt:'usdbig', hint:'Total value of goods exported, current US dollars.'},
  'BX.KLT.DINV.WD.GD.ZS': {d:'trade', label:'FDI net inflows (% of GDP)', short:'FDI inflows', fmt:'pct', hint:'Foreign direct investment flowing in, relative to economy size.'},
  'TX.VAL.TECH.MF.ZS':    {d:'trade', label:'High-tech exports (% of manufactured)', short:'High-tech exports', fmt:'pct', hint:'Share of manufactured exports that are high-technology.'},
  // ENVIRONMENT
  'EN.GHG.CO2.PC.CE.AR5': {d:'env', label:'CO\u2082 emissions per capita (t)', short:'CO\u2082/capita', fmt:'num', hint:'Carbon dioxide emissions per person, tonnes (AR5 basis).'},
  'AG.LND.FRST.ZS':       {d:'env', label:'Forest area (% of land)', short:'Forest cover', fmt:'pct', hint:'Land under forest. Central to EUDR and deforestation debates.'},
  'EG.FEC.RNEW.ZS':       {d:'env', label:'Renewable energy (% of consumption)', short:'Renewables', fmt:'pct', hint:'Renewable energy as a share of total final consumption.'},
  'EN.ATM.PM25.MC.M3':    {d:'env', label:'PM2.5 air pollution (\u00b5g/m\u00b3)', short:'PM2.5', fmt:'num', hint:'Mean population exposure to fine particulate pollution.'},
  'ER.PTD.TOTL.ZS':       {d:'env', label:'Protected land & marine areas (%)', short:'Protected areas', fmt:'pct', hint:'Share of territory under formal environmental protection.'},
  // AGRICULTURE
  'NV.AGR.TOTL.ZS':       {d:'agri', label:'Agriculture value added (% of GDP)', short:'Agri/GDP', fmt:'pct', hint:'How much of the economy comes from agriculture.'},
  'SL.AGR.EMPL.ZS':       {d:'agri', label:'Employment in agriculture (% of total)', short:'Agri employment', fmt:'pct', hint:'Share of the workforce employed in agriculture.'},
  'AG.LND.AGRI.ZS':       {d:'agri', label:'Agricultural land (% of land)', short:'Agri land', fmt:'pct', hint:'Arable land, permanent crops and pasture as share of area.'},
  'AG.YLD.CREL.KG':       {d:'agri', label:'Cereal yield (kg per hectare)', short:'Cereal yield', fmt:'numbig', hint:'Output per hectare, a core agricultural productivity measure.'},
  'AG.CON.FERT.ZS':       {d:'agri', label:'Fertilizer use (kg per hectare)', short:'Fertilizer', fmt:'num', hint:'Fertilizer consumption per hectare of arable land.'},
  // DEVELOPMENT
  'SI.POV.DDAY':          {d:'dev', label:'Extreme poverty at $2.15/day (%)', short:'Extreme poverty', fmt:'pct', hint:'Share of population below the international poverty line.'},
  'SP.DYN.LE00.IN':       {d:'dev', label:'Life expectancy at birth (years)', short:'Life expectancy', fmt:'num', hint:'Years a newborn would live under current mortality.'},
  'SH.DYN.MORT':          {d:'dev', label:'Under-5 mortality (per 1,000)', short:'Child mortality', fmt:'num', hint:'Deaths before age five per 1,000 live births.'},
  'EG.ELC.ACCS.ZS':       {d:'dev', label:'Access to electricity (% of pop.)', short:'Electricity access', fmt:'pct', hint:'Population with access to electricity.'},
  'IT.NET.USER.ZS':       {d:'dev', label:'Internet users (% of pop.)', short:'Internet use', fmt:'pct', hint:'Share of population using the internet.'},
  // MACRO
  'NY.GDP.MKTP.KD.ZG':    {d:'macro', label:'GDP growth (annual %)', short:'GDP growth', fmt:'pct', hint:'Annual growth of GDP at constant prices.'},
  'NY.GDP.PCAP.CD':       {d:'macro', label:'GDP per capita (current US$)', short:'GDP/capita', fmt:'usd', hint:'GDP divided by midyear population.'},
  'FP.CPI.TOTL.ZG':       {d:'macro', label:'Inflation, consumer prices (annual %)', short:'Inflation', fmt:'pct', hint:'Annual change in the consumer price index.'},
  'SI.POV.GINI':          {d:'macro', label:'Gini index (inequality)', short:'Gini', fmt:'num', hint:'0 = perfect equality, 100 = perfect inequality.'},
  'SL.UEM.TOTL.ZS':       {d:'macro', label:'Unemployment (% of labour force)', short:'Unemployment', fmt:'pct', hint:'Share of the labour force without work but seeking it.'},
  'NY.GDP.MKTP.CD':       {d:'macro', label:'GDP (current US$)', short:'GDP total', fmt:'usdbig', hint:'Gross domestic product in current US dollars.'},
  'BN.CAB.XOKA.GD.ZS':    {d:'macro', label:'Current account balance (% of GDP)', short:'Current account', fmt:'pct', hint:'Net trade, income and transfers as a share of GDP.'},
  'SP.POP.GROW':          {d:'dev', label:'Population growth (annual %)', short:'Population growth', fmt:'pct', hint:'Annual population growth rate.'},
  'SP.URB.TOTL.IN.ZS':    {d:'dev', label:'Urban population (% of total)', short:'Urbanisation', fmt:'pct', hint:'Share of population living in urban areas.'},
  'SE.SEC.ENRR':          {d:'dev', label:'Secondary school enrollment (% gross)', short:'Secondary enrollment', fmt:'pct', hint:'Gross enrollment ratio in secondary education.'},
  'SH.STA.MMRT':          {d:'dev', label:'Maternal mortality (per 100,000 births)', short:'Maternal mortality', fmt:'numbig', hint:'Maternal deaths per 100,000 live births.'},
  'SH.XPD.CHEX.GD.ZS':    {d:'dev', label:'Health expenditure (% of GDP)', short:'Health spend', fmt:'pct', hint:'Current health expenditure as a share of GDP.'},
  'SL.TLF.CACT.FE.ZS':    {d:'dev', label:'Female labour force participation (%)', short:'Female labour force', fmt:'pct', hint:'Share of working-age women in the labour force.'},
  'SI.POV.NAHC':          {d:'macro', label:'Poverty headcount, national line (%)', short:'National poverty', fmt:'pct', hint:'Share below the national poverty line.'},
  'SI.DST.10TH.10':       {d:'macro', label:'Income share of richest 10%', short:'Top 10% share', fmt:'pct', hint:'Share of national income held by the highest decile.'},
  'SI.DST.FRST.20':       {d:'macro', label:'Income share of poorest 20%', short:'Bottom 20% share', fmt:'pct', hint:'Share of national income held by the lowest quintile.'},
  'AG.LND.ARBL.ZS':       {d:'agri', label:'Arable land (% of land area)', short:'Arable land', fmt:'pct', hint:'Land under temporary crops, meadows or fallow.'},
  'BX.TRF.PWKR.DT.GD.ZS': {d:'trade', label:'Personal remittances received (% of GDP)', short:'Remittances', fmt:'pct', hint:'Money sent home by workers abroad, as a share of GDP.'}
};

const ECONOMIES = [
// Featured economies (most-plotted, shown first)
  {c:'WLD',n:'World'},
  {c:'NGA',n:'Nigeria'},
  {c:'GHA',n:'Ghana'},
  {c:'CIV',n:'Cote d\'Ivoire'},
  {c:'KEN',n:'Kenya'},
  {c:'ETH',n:'Ethiopia'},
  {c:'RWA',n:'Rwanda'},
  {c:'TZA',n:'Tanzania'},
  {c:'UGA',n:'Uganda'},
  {c:'SEN',n:'Senegal'},
  {c:'ZAF',n:'South Africa'},
  {c:'EGY',n:'Egypt, Arab Rep.'},
  {c:'MAR',n:'Morocco'},
  {c:'BRA',n:'Brazil'},
  {c:'IDN',n:'Indonesia'},
  {c:'IND',n:'India'},
  {c:'VNM',n:'Viet Nam'},
  {c:'BGD',n:'Bangladesh'},
  {c:'PAK',n:'Pakistan'},
  {c:'MEX',n:'Mexico'},
  {c:'ARG',n:'Argentina'},
  {c:'COL',n:'Colombia'},
  {c:'CHL',n:'Chile'},
  {c:'CHN',n:'China'},
  {c:'DEU',n:'Germany'},
  {c:'GBR',n:'United Kingdom'},
  {c:'FRA',n:'France'},
  {c:'NLD',n:'Netherlands'},
  {c:'IRL',n:'Ireland'},
  {c:'USA',n:'United States'},
  {c:'JPN',n:'Japan'},
  {c:'KOR',n:'Korea, Rep.'},
  {c:'THA',n:'Thailand'},
  {c:'PHL',n:'Philippines'},
  {c:'TUR',n:'Turkiye'},
  {c:'POL',n:'Poland'},
  // All other economies, alphabetical
  {c:'AFG',n:'Afghanistan'},
  {c:'ALB',n:'Albania'},
  {c:'DZA',n:'Algeria'},
  {c:'ASM',n:'American Samoa'},
  {c:'AND',n:'Andorra'},
  {c:'AGO',n:'Angola'},
  {c:'ATG',n:'Antigua and Barbuda'},
  {c:'ARM',n:'Armenia'},
  {c:'ABW',n:'Aruba'},
  {c:'AUS',n:'Australia'},
  {c:'AUT',n:'Austria'},
  {c:'AZE',n:'Azerbaijan'},
  {c:'BHS',n:'Bahamas, The'},
  {c:'BHR',n:'Bahrain'},
  {c:'BRB',n:'Barbados'},
  {c:'BLR',n:'Belarus'},
  {c:'BEL',n:'Belgium'},
  {c:'BLZ',n:'Belize'},
  {c:'BEN',n:'Benin'},
  {c:'BMU',n:'Bermuda'},
  {c:'BTN',n:'Bhutan'},
  {c:'BOL',n:'Bolivia'},
  {c:'BIH',n:'Bosnia and Herzegovina'},
  {c:'BWA',n:'Botswana'},
  {c:'VGB',n:'British Virgin Islands'},
  {c:'BRN',n:'Brunei Darussalam'},
  {c:'BGR',n:'Bulgaria'},
  {c:'BFA',n:'Burkina Faso'},
  {c:'BDI',n:'Burundi'},
  {c:'CPV',n:'Cabo Verde'},
  {c:'KHM',n:'Cambodia'},
  {c:'CMR',n:'Cameroon'},
  {c:'CAN',n:'Canada'},
  {c:'CYM',n:'Cayman Islands'},
  {c:'CAF',n:'Central African Republic'},
  {c:'TCD',n:'Chad'},
  {c:'CHI',n:'Channel Islands'},
  {c:'COM',n:'Comoros'},
  {c:'COD',n:'Congo, Dem. Rep.'},
  {c:'COG',n:'Congo, Rep.'},
  {c:'CRI',n:'Costa Rica'},
  {c:'HRV',n:'Croatia'},
  {c:'CUB',n:'Cuba'},
  {c:'CUW',n:'Curacao'},
  {c:'CYP',n:'Cyprus'},
  {c:'CZE',n:'Czechia'},
  {c:'DNK',n:'Denmark'},
  {c:'DJI',n:'Djibouti'},
  {c:'DMA',n:'Dominica'},
  {c:'DOM',n:'Dominican Republic'},
  {c:'ECU',n:'Ecuador'},
  {c:'SLV',n:'El Salvador'},
  {c:'GNQ',n:'Equatorial Guinea'},
  {c:'ERI',n:'Eritrea'},
  {c:'EST',n:'Estonia'},
  {c:'SWZ',n:'Eswatini'},
  {c:'FRO',n:'Faroe Islands'},
  {c:'FJI',n:'Fiji'},
  {c:'FIN',n:'Finland'},
  {c:'PYF',n:'French Polynesia'},
  {c:'GAB',n:'Gabon'},
  {c:'GMB',n:'Gambia, The'},
  {c:'GEO',n:'Georgia'},
  {c:'GIB',n:'Gibraltar'},
  {c:'GRC',n:'Greece'},
  {c:'GRL',n:'Greenland'},
  {c:'GRD',n:'Grenada'},
  {c:'GUM',n:'Guam'},
  {c:'GTM',n:'Guatemala'},
  {c:'GIN',n:'Guinea'},
  {c:'GNB',n:'Guinea-Bissau'},
  {c:'GUY',n:'Guyana'},
  {c:'HTI',n:'Haiti'},
  {c:'HND',n:'Honduras'},
  {c:'HKG',n:'Hong Kong SAR, China'},
  {c:'HUN',n:'Hungary'},
  {c:'ISL',n:'Iceland'},
  {c:'IRN',n:'Iran, Islamic Rep.'},
  {c:'IRQ',n:'Iraq'},
  {c:'IMN',n:'Isle of Man'},
  {c:'ISR',n:'Israel'},
  {c:'ITA',n:'Italy'},
  {c:'JAM',n:'Jamaica'},
  {c:'JOR',n:'Jordan'},
  {c:'KAZ',n:'Kazakhstan'},
  {c:'KIR',n:'Kiribati'},
  {c:'PRK',n:'Korea, Dem. People\'s Rep.'},
  {c:'XKX',n:'Kosovo'},
  {c:'KWT',n:'Kuwait'},
  {c:'KGZ',n:'Kyrgyz Republic'},
  {c:'LAO',n:'Lao PDR'},
  {c:'LVA',n:'Latvia'},
  {c:'LBN',n:'Lebanon'},
  {c:'LSO',n:'Lesotho'},
  {c:'LBR',n:'Liberia'},
  {c:'LBY',n:'Libya'},
  {c:'LIE',n:'Liechtenstein'},
  {c:'LTU',n:'Lithuania'},
  {c:'LUX',n:'Luxembourg'},
  {c:'MAC',n:'Macao SAR, China'},
  {c:'MDG',n:'Madagascar'},
  {c:'MWI',n:'Malawi'},
  {c:'MYS',n:'Malaysia'},
  {c:'MDV',n:'Maldives'},
  {c:'MLI',n:'Mali'},
  {c:'MLT',n:'Malta'},
  {c:'MHL',n:'Marshall Islands'},
  {c:'MRT',n:'Mauritania'},
  {c:'MUS',n:'Mauritius'},
  {c:'FSM',n:'Micronesia, Fed. Sts.'},
  {c:'MDA',n:'Moldova'},
  {c:'MCO',n:'Monaco'},
  {c:'MNG',n:'Mongolia'},
  {c:'MNE',n:'Montenegro'},
  {c:'MOZ',n:'Mozambique'},
  {c:'MMR',n:'Myanmar'},
  {c:'NAM',n:'Namibia'},
  {c:'NRU',n:'Nauru'},
  {c:'NPL',n:'Nepal'},
  {c:'NCL',n:'New Caledonia'},
  {c:'NZL',n:'New Zealand'},
  {c:'NIC',n:'Nicaragua'},
  {c:'NER',n:'Niger'},
  {c:'MKD',n:'North Macedonia'},
  {c:'MNP',n:'Northern Mariana Islands'},
  {c:'NOR',n:'Norway'},
  {c:'OMN',n:'Oman'},
  {c:'PLW',n:'Palau'},
  {c:'PAN',n:'Panama'},
  {c:'PNG',n:'Papua New Guinea'},
  {c:'PRY',n:'Paraguay'},
  {c:'PER',n:'Peru'},
  {c:'PRT',n:'Portugal'},
  {c:'PRI',n:'Puerto Rico (US)'},
  {c:'QAT',n:'Qatar'},
  {c:'ROU',n:'Romania'},
  {c:'RUS',n:'Russian Federation'},
  {c:'WSM',n:'Samoa'},
  {c:'SMR',n:'San Marino'},
  {c:'STP',n:'Sao Tome and Principe'},
  {c:'SAU',n:'Saudi Arabia'},
  {c:'SRB',n:'Serbia'},
  {c:'SYC',n:'Seychelles'},
  {c:'SLE',n:'Sierra Leone'},
  {c:'SGP',n:'Singapore'},
  {c:'SXM',n:'Sint Maarten (Dutch part)'},
  {c:'SVK',n:'Slovak Republic'},
  {c:'SVN',n:'Slovenia'},
  {c:'SLB',n:'Solomon Islands'},
  {c:'SOM',n:'Somalia, Fed. Rep.'},
  {c:'SSD',n:'South Sudan'},
  {c:'ESP',n:'Spain'},
  {c:'LKA',n:'Sri Lanka'},
  {c:'KNA',n:'St. Kitts and Nevis'},
  {c:'LCA',n:'St. Lucia'},
  {c:'MAF',n:'St. Martin (French part)'},
  {c:'VCT',n:'St. Vincent and the Grenadines'},
  {c:'SDN',n:'Sudan'},
  {c:'SUR',n:'Suriname'},
  {c:'SWE',n:'Sweden'},
  {c:'CHE',n:'Switzerland'},
  {c:'SYR',n:'Syrian Arab Republic'},
  {c:'TJK',n:'Tajikistan'},
  {c:'TLS',n:'Timor-Leste'},
  {c:'TGO',n:'Togo'},
  {c:'TON',n:'Tonga'},
  {c:'TTO',n:'Trinidad and Tobago'},
  {c:'TUN',n:'Tunisia'},
  {c:'TKM',n:'Turkmenistan'},
  {c:'TCA',n:'Turks and Caicos Islands'},
  {c:'TUV',n:'Tuvalu'},
  {c:'UKR',n:'Ukraine'},
  {c:'ARE',n:'United Arab Emirates'},
  {c:'URY',n:'Uruguay'},
  {c:'UZB',n:'Uzbekistan'},
  {c:'VUT',n:'Vanuatu'},
  {c:'VEN',n:'Venezuela, RB'},
  {c:'VIR',n:'Virgin Islands (U.S.)'},
  {c:'PSE',n:'West Bank and Gaza'},
  {c:'YEM',n:'Yemen, Rep.'},
  {c:'ZMB',n:'Zambia'},
  {c:'ZWE',n:'Zimbabwe'},
  // Regional & income aggregates
  {c:'SSF',n:'Sub-Saharan Africa '},
  {c:'EAS',n:'East Asia & Pacific'},
  {c:'ECS',n:'Europe & Central Asia'},
  {c:'LCN',n:'Latin America & Caribbean '},
  {c:'MEA',n:'Middle East, North Africa, Afghanistan & Pakistan'},
  {c:'NAC',n:'North America'},
  {c:'SAS',n:'South Asia'},
  {c:'EUU',n:'European Union'},
  {c:'OED',n:'OECD members'},
  {c:'LIC',n:'Low income'},
  {c:'LMC',n:'Lower middle income'},
  {c:'UMC',n:'Upper middle income'},
  {c:'HIC',n:'High income'},
  {c:'LMY',n:'Low & middle income'},
  {c:'EMU',n:'Euro area'},
  {c:'ARB',n:'Arab World'},
];
const ECON_MAP = Object.fromEntries(ECONOMIES.map(e=>[e.c,e.n]));

const THEMES = [
  {id:'eudr', domain:'env', title:'Forests & the EUDR frontier',
   q:'Where is forest cover under pressure, in the commodity origins the EU deforestation regulation targets?',
   indicator:'AG.LND.FRST.ZS', countries:['BRA','IDN','CIV','GHA','NGA']},
  {id:'co2dev', domain:'env', title:'The carbon\u2013development tension',
   q:'How does per-capita CO\u2082 track income? The equity core of climate policy.',
   indicator:'EN.GHG.CO2.PC.CE.AR5', countries:['WLD','USA','CHN','IND','NGA','DEU']},
  {id:'openness', domain:'trade', title:'Trade openness, compared',
   q:'How exposed are economies to global trade, and how has it shifted?',
   indicator:'NE.TRD.GNFS.ZS', countries:['DEU','VNM','CHN','NGA','IRL']},
  {id:'fdi', domain:'trade', title:'Where capital flows',
   q:'FDI inflows as a share of GDP across emerging economies.',
   indicator:'BX.KLT.DINV.WD.GD.ZS', countries:['VNM','NGA','IDN','GHA','IND']},
  {id:'agtransform', domain:'agri', title:'Structural transformation',
   q:'As economies develop, agriculture shrinks as a share of GDP. Watch it happen.',
   indicator:'NV.AGR.TOTL.ZS', countries:['NGA','IND','VNM','ETH','CHN']},
  {id:'yield', domain:'agri', title:'The productivity gap',
   q:'Cereal yields per hectare, the green-revolution divide between regions.',
   indicator:'AG.YLD.CREL.KG', countries:['CHN','IND','NGA','ETH','DEU']},
  {id:'poverty', domain:'dev', title:'The retreat of extreme poverty',
   q:'Share of population under $2.15/day, where the data exists to track it.',
   indicator:'SI.POV.DDAY', countries:['IND','BGD','ETH','NGA','BRA']},
  {id:'electrify', domain:'dev', title:'The electrification frontier',
   q:'Access to electricity across low-income economies, infrastructure as development.',
   indicator:'EG.ELC.ACCS.ZS', countries:['NGA','ETH','UGA','TZA','IND']},
  {id:'inflation', domain:'macro', title:'Inflation, where it bites',
   q:'Consumer price inflation across economies under macro stress.',
   indicator:'FP.CPI.TOTL.ZG', countries:['NGA','TUR','ARG','GHA','DEU']},
  {id:'inequality', domain:'macro', title:'How unequal, and where',
   q:'The Gini index across regions, inequality as the politics of distribution.',
   indicator:'SI.POV.GINI', countries:['ZAF','BRA','NGA','DEU','VNM']},
  {id:'renew', domain:'env', title:'The renewables transition',
   q:'Renewable energy as a share of consumption, uneven across the income spectrum.',
   indicator:'EG.FEC.RNEW.ZS', countries:['WLD','ETH','BRA','DEU','NGA']},
  {id:'air', domain:'env', title:'The air people breathe',
   q:'PM2.5 exposure, where growth and pollution still move together.',
   indicator:'EN.ATM.PM25.MC.M3', countries:['IND','CHN','NGA','BGD','DEU']}
];

let state = {
  indicator:'AG.LND.FRST.ZS',
  countries:['BRA','IDN','CIV','GHA','NGA'],
  yearFrom:2000, yearTo:2024, view:'line', lastData:null
};
let mainChart=null, scatterChart=null;

/* FORMATTING */
function fmtVal(v,kind){
  if(v==null||isNaN(v))return 'n/a';
  if(kind==='usd')    return Math.abs(v)>=1000?'$'+Math.round(v).toLocaleString():'$'+v.toFixed(0);
  if(kind==='usdbig'){
    if(Math.abs(v)>=1e12)return '$'+(v/1e12).toFixed(2)+'T';
    if(Math.abs(v)>=1e9) return '$'+(v/1e9).toFixed(1)+'B';
    if(Math.abs(v)>=1e6) return '$'+(v/1e6).toFixed(0)+'M';
    return '$'+Math.round(v).toLocaleString();
  }
  if(kind==='numbig')return Math.round(v).toLocaleString();
  if(kind==='pct')   return v.toFixed(1)+'%';
  return v.toFixed(1);
}
function axisFmt(v,kind){
  if(kind==='usd')    return Math.abs(v)>=1000?'$'+(v/1000).toFixed(0)+'k':'$'+v;
  if(kind==='usdbig'){
    if(Math.abs(v)>=1e12)return '$'+(v/1e12).toFixed(1)+'T';
    if(Math.abs(v)>=1e9) return '$'+(v/1e9).toFixed(0)+'B';
    if(Math.abs(v)>=1e6) return '$'+(v/1e6).toFixed(0)+'M';
    return v;
  }
  if(kind==='numbig')return v>=1000?(v/1000).toFixed(0)+'k':v;
  if(kind==='pct')   return v+'%';
  return v;
}

/* FETCH */
async function fetchSeries(indicator, country, from, to){
  const url = `${WB}/country/${country}/indicator/${indicator}?format=json&date=${from}:${to}&per_page=500`;
  const res = await fetch(url);
  if(!res.ok) throw new Error('HTTP '+res.status);
  const json = await res.json();
  const rows = (json && json[1]) ? json[1] : [];
  const map = {}; let lastUpdated = json[0] ? json[0].lastupdated : null;
  rows.forEach(r=>{ if(r.value!=null) map[+r.date]=r.value; });
  return {map, lastUpdated};
}
async function fetchAll(indicator, countries, from, to){
  const results = await Promise.allSettled(countries.map(c=>fetchSeries(indicator,c,from,to)));
  const out={}; let lastUpdated=null; const failed=[];
  results.forEach((r,i)=>{
    const c=countries[i];
    if(r.status==='fulfilled'){ out[c]=r.value.map; lastUpdated=r.value.lastUpdated||lastUpdated; }
    else { out[c]={}; failed.push(c); }
  });
  return {out,lastUpdated,failed};
}

/* MAIN CHART */
const gridColor='rgba(40,52,62,0.55)', tickColor='#6b7a85', fontMono="'IBM Plex Mono', monospace";

async function renderMain(){
  const loading=document.getElementById('plotLoading'); loading.classList.remove('hidden');
  const meta=INDICATORS[state.indicator];
  document.getElementById('chartTitle').textContent=meta.label;
  const dtag=document.getElementById('chartDomain');
  dtag.textContent=DOMAINS[meta.d].label; dtag.style.color=DOMAINS[meta.d].color; dtag.style.borderColor=DOMAINS[meta.d].color;
  document.getElementById('canvasFoot').textContent='';
  let data;
  try{ data=await fetchAll(state.indicator,state.countries,state.yearFrom,state.yearTo); }
  catch(e){ loading.innerHTML=`<span style="color:var(--coral)">Couldn't reach the source. Retry shortly.</span>`; return; }
  state.lastData=data;
  document.getElementById('chartSource').textContent=
    data.lastUpdated?`World Bank Open Data \u00b7 refreshed ${data.lastUpdated}`:'World Bank Open Data';
  if(data.failed.length) document.getElementById('canvasFoot').textContent=
    `No series returned for: ${data.failed.map(c=>ECON_MAP[c]||c).join(', ')} on this indicator.`;
  const years=[]; for(let y=state.yearFrom;y<=state.yearTo;y++)years.push(y);
  if(state.view==='line') drawLine(years,data.out,meta); else drawBar(data.out,meta);
  loading.classList.add('hidden');
}
function destroyMain(){ if(mainChart){mainChart.destroy();mainChart=null;} }
function drawLine(years,dataOut,meta){
  destroyMain();
  const datasets=state.countries.map((c,i)=>{
    const col=SERIES_COLORS[i%SERIES_COLORS.length];
    return {label:ECON_MAP[c]||c,data:years.map(y=>dataOut[c]&&dataOut[c][y]!=null?dataOut[c][y]:null),
      borderColor:col,backgroundColor:col,borderWidth:2,pointRadius:0,pointHoverRadius:4,tension:.25,spanGaps:true};
  });
  mainChart=new Chart(document.getElementById('mainChart'),{type:'line',data:{labels:years,datasets},options:baseOpts(meta)});
}
function drawBar(dataOut,meta){
  destroyMain();
  const labels=[],vals=[],cols=[];
  state.countries.forEach((c,i)=>{
    const m=dataOut[c]||{};const yrs=Object.keys(m).map(Number).sort((a,b)=>b-a);
    labels.push(ECON_MAP[c]||c);vals.push(yrs.length?m[yrs[0]]:null);cols.push(SERIES_COLORS[i%SERIES_COLORS.length]);
  });
  mainChart=new Chart(document.getElementById('mainChart'),{type:'bar',
    data:{labels,datasets:[{data:vals,backgroundColor:cols,borderRadius:3}]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:tooltipCfg(meta)},
      scales:{x:{grid:{display:false},ticks:{color:tickColor,font:{family:fontMono,size:11}}},
        y:{grid:{color:gridColor},ticks:{color:tickColor,font:{family:fontMono,size:11},callback:v=>axisFmt(v,meta.fmt)},border:{display:false}}}}});
}
function baseOpts(meta){
  return {responsive:true,maintainAspectRatio:false,interaction:{mode:'index',intersect:false},
    plugins:{legend:{position:'top',align:'start',
      labels:{color:'#9fb0bb',font:{family:fontMono,size:11},boxWidth:10,boxHeight:10,usePointStyle:true,pointStyle:'rectRounded',padding:16}},
      tooltip:tooltipCfg(meta)},
    scales:{x:{grid:{color:gridColor},ticks:{color:tickColor,font:{family:fontMono,size:10},maxTicksLimit:12},border:{display:false}},
      y:{grid:{color:gridColor},ticks:{color:tickColor,font:{family:fontMono,size:10},callback:v=>axisFmt(v,meta.fmt)},border:{display:false}}}};
}
function tooltipCfg(meta){
  return {backgroundColor:'#0e1419',borderColor:'#28343e',borderWidth:1,titleColor:'#e8edf0',bodyColor:'#9fb0bb',
    titleFont:{family:fontMono,size:11},bodyFont:{family:fontMono,size:11},padding:10,boxPadding:5,usePointStyle:true,
    callbacks:{label:c=>`  ${c.dataset.label||''}: ${fmtVal(c.parsed.y,meta.fmt)}`}};
}

/* CSV */
function exportCSV(){
  if(!state.lastData)return;
  const years=[]; for(let y=state.yearFrom;y<=state.yearTo;y++)years.push(y);
  const head=['year',...state.countries.map(c=>ECON_MAP[c]||c)];
  const lines=[head.join(',')];
  years.forEach(y=>lines.push([y,...state.countries.map(c=>{const v=state.lastData.out[c]&&state.lastData.out[c][y];return v!=null?v:'';})].join(',')));
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([lines.join('\n')],{type:'text/csv'}));
  a.download=`meridian-frontier_${state.indicator}.csv`;a.click();
}

/* CONTROLS */
function buildControls(){
  const isel=document.getElementById('indicatorSelect');
  Object.entries(DOMAINS).forEach(([dk,dv])=>{
    const og=document.createElement('optgroup');og.label=dv.label;
    Object.entries(INDICATORS).filter(([,m])=>m.d===dk).forEach(([code,m])=>{
      const o=document.createElement('option');o.value=code;o.textContent=m.short;og.appendChild(o);});
    isel.appendChild(og);
  });
  isel.value=state.indicator;
  document.getElementById('indicatorHint').textContent=INDICATORS[state.indicator].hint;
  isel.addEventListener('change',()=>{
    state.indicator=isel.value;
    document.getElementById('indicatorHint').textContent=INDICATORS[state.indicator].hint;renderMain();});
  const cadd=document.getElementById('countryAdd');
  ECONOMIES.forEach(e=>{const o=document.createElement('option');o.value=e.c;o.textContent=e.n;cadd.appendChild(o);});
  cadd.addEventListener('change',()=>{
    const c=cadd.value;
    if(c&&!state.countries.includes(c)&&state.countries.length<6){state.countries.push(c);renderChips();renderMain();}
    cadd.value='';});
  renderChips();
  const yf=document.getElementById('yearFrom'),yt=document.getElementById('yearTo');
  yf.value=state.yearFrom;yt.value=state.yearTo;
  let t;
  function onRange(){clearTimeout(t);t=setTimeout(()=>{
    state.yearFrom=Math.max(1960,+yf.value||2000);state.yearTo=Math.min(2025,+yt.value||2024);renderMain();},500);}
  yf.addEventListener('input',onRange);yt.addEventListener('input',onRange);
  document.querySelectorAll('#viewSeg .seg-btn').forEach(b=>b.addEventListener('click',()=>{
    document.querySelectorAll('#viewSeg .seg-btn').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');state.view=b.dataset.view;renderMain();}));
  document.getElementById('exportBtn').addEventListener('click',exportCSV);
}
function renderChips(){
  const box=document.getElementById('countryChips');box.innerHTML='';
  state.countries.forEach((c,i)=>{
    const col=SERIES_COLORS[i%SERIES_COLORS.length];
    const chip=document.createElement('span');chip.className='chip';
    chip.innerHTML=`<span class="swatch" style="background:${col}"></span>${ECON_MAP[c]||c}<span class="x" data-c="${c}">\u00d7</span>`;
    box.appendChild(chip);
  });
  box.querySelectorAll('.x').forEach(x=>x.addEventListener('click',()=>{
    if(state.countries.length<=1)return;
    state.countries=state.countries.filter(c=>c!==x.dataset.c);renderChips();renderMain();}));
}

/* THEMES */
function buildThemes(){
  const grid=document.getElementById('themeGrid');
  THEMES.forEach(th=>{
    const dom=DOMAINS[th.domain];
    const card=document.createElement('button');card.className='theme-card';
    card.style.setProperty('--tc',dom.color);
    card.innerHTML=`<span class="tc-domain">${dom.label}</span><span class="tc-title">${th.title}</span><span class="tc-q">${th.q}</span><span class="tc-go">open in explorer \u2192</span>`;
    card.addEventListener('click',()=>{
      state.indicator=th.indicator;state.countries=th.countries.slice(0,6);state.view='line';
      document.getElementById('indicatorSelect').value=th.indicator;
      document.getElementById('indicatorHint').textContent=INDICATORS[th.indicator].hint;
      document.querySelectorAll('#viewSeg .seg-btn').forEach(x=>x.classList.toggle('active',x.dataset.view==='line'));
      renderChips();renderMain();
      document.getElementById('explore').scrollIntoView({behavior:'smooth'});});
    grid.appendChild(card);
  });
}

/* RELATIONSHIP BUILDER */
function buildScatter(){
  const xs=document.getElementById('xIndicator'),ys=document.getElementById('yIndicator'),cs=document.getElementById('scatterCountry');
  Object.entries(DOMAINS).forEach(([dk,dv])=>{
    [xs,ys].forEach(sel=>{
      const og=document.createElement('optgroup');og.label=dv.label;
      Object.entries(INDICATORS).filter(([,m])=>m.d===dk).forEach(([code,m])=>{
        const o=document.createElement('option');o.value=code;o.textContent=m.short;og.appendChild(o);});
      sel.appendChild(og);});
  });
  xs.value='NY.GDP.PCAP.CD'; ys.value='EN.GHG.CO2.PC.CE.AR5';
  ECONOMIES.forEach(e=>{const o=document.createElement('option');o.value=e.c;o.textContent=e.n;cs.appendChild(o);});
  cs.value='NGA';
  document.getElementById('plotScatter').addEventListener('click',renderScatter);
  renderScatter();
}
async function renderScatter(){
  const loading=document.getElementById('scatterLoading');loading.classList.remove('hidden');
  const xCode=document.getElementById('xIndicator').value,yCode=document.getElementById('yIndicator').value;
  const c=document.getElementById('scatterCountry').value;
  const xm=INDICATORS[xCode],ym=INDICATORS[yCode];
  let xData,yData;
  try{[xData,yData]=await Promise.all([fetchSeries(xCode,c,1990,2024),fetchSeries(yCode,c,1990,2024)]);}
  catch(e){loading.innerHTML=`<span style="color:var(--coral)">Source unreachable.</span>`;return;}
  const pts=[];
  Object.keys(xData.map).forEach(y=>{if(yData.map[y]!=null)pts.push({x:xData.map[y],y:yData.map[y],year:+y});});
  pts.sort((a,b)=>a.year-b.year);
  const note=document.getElementById('scatterNote');
  if(pts.length>=3){
    const r=pearson(pts.map(p=>p.x),pts.map(p=>p.y));
    note.textContent=`${ECON_MAP[c]||c}: ${pts.length} yearly observations \u00b7 correlation r = ${r.toFixed(2)}. Descriptive only, not an identification strategy.`;
  }else note.textContent=`Not enough overlapping data for ${ECON_MAP[c]||c} on these two series.`;
  if(scatterChart)scatterChart.destroy();
  scatterChart=new Chart(document.getElementById('scatterChart'),{type:'scatter',
    data:{datasets:[{data:pts,backgroundColor:'#4cc9b0',borderColor:'#4cc9b0',pointRadius:5,pointHoverRadius:7,showLine:true,borderWidth:1,segment:{borderColor:'rgba(76,201,176,0.22)'}}]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},
      tooltip:{backgroundColor:'#0e1419',borderColor:'#28343e',borderWidth:1,titleColor:'#e8edf0',bodyColor:'#9fb0bb',
        titleFont:{family:fontMono,size:11},bodyFont:{family:fontMono,size:11},padding:10,
        callbacks:{title:i=>'Year '+i[0].raw.year,label:i=>[`  ${xm.short}: ${fmtVal(i.raw.x,xm.fmt)}`,`  ${ym.short}: ${fmtVal(i.raw.y,ym.fmt)}`]}}},
      scales:{x:{title:{display:true,text:xm.short,color:'#9fb0bb',font:{family:fontMono,size:11}},
          grid:{color:gridColor},ticks:{color:tickColor,font:{family:fontMono,size:10},callback:v=>axisFmt(v,xm.fmt)},border:{display:false}},
        y:{title:{display:true,text:ym.short,color:'#9fb0bb',font:{family:fontMono,size:11}},
          grid:{color:gridColor},ticks:{color:tickColor,font:{family:fontMono,size:10},callback:v=>axisFmt(v,ym.fmt)},border:{display:false}}}}});
  loading.classList.add('hidden');
}
function pearson(x,y){const n=x.length,mx=avg(x),my=avg(y);let num=0,dx=0,dy=0;
  for(let i=0;i<n;i++){const a=x[i]-mx,b=y[i]-my;num+=a*b;dx+=a*a;dy+=b*b;}return(dx&&dy)?num/Math.sqrt(dx*dy):0;}
const avg=a=>a.reduce((s,v)=>s+v,0)/a.length;

/* PULSE */
async function buildPulse(){
  const items=[
    {ind:'AG.LND.FRST.ZS',c:'WLD',lab:'World forest cover'},
    {ind:'EN.GHG.CO2.PC.CE.AR5',c:'WLD',lab:'CO\u2082 per capita'},
    {ind:'NE.TRD.GNFS.ZS',c:'WLD',lab:'Trade openness'},
    {ind:'SI.POV.DDAY',c:'WLD',lab:'Extreme poverty'},
    {ind:'NV.AGR.TOTL.ZS',c:'WLD',lab:'Agriculture % GDP'},
    {ind:'EG.FEC.RNEW.ZS',c:'WLD',lab:'Renewable energy'},
    {ind:'SP.DYN.LE00.IN',c:'WLD',lab:'Life expectancy'},
    {ind:'NY.GDP.MKTP.KD.ZG',c:'WLD',lab:'World GDP growth'}
  ];
  const results=await Promise.allSettled(items.map(p=>fetchSeries(p.ind,p.c,2010,2024)));
  const built=[];let latestUpd=null;
  results.forEach((r,i)=>{
    if(r.status!=='fulfilled')return;
    const p=items[i],m=r.value.map;latestUpd=r.value.lastUpdated||latestUpd;
    const yrs=Object.keys(m).map(Number).sort((a,b)=>b-a);if(!yrs.length)return;
    const latest=m[yrs[0]],prev=yrs[1]?m[yrs[1]]:null,meta=INDICATORS[p.ind];
    let delta='';
    if(prev!=null){const d=latest-prev,dir=d>=0?'up':'down';
      delta=`<span class="pdelta ${dir}">${d>=0?'\u25b2':'\u25bc'} ${Math.abs(d).toFixed(1)}</span>`;}
    built.push(`<span class="pulse-item"><b>${p.lab}</b> <span class="pv">${fmtVal(latest,meta.fmt)}</span> ${delta} <span class="pyr">'${String(yrs[0]).slice(2)}</span></span>`);
  });
  const track=document.getElementById('pulseTrack');
  track.innerHTML=built.length?built.join('')+built.join(''):`<span class="pulse-loading">live figures unavailable right now</span>`;
  if(latestUpd) document.getElementById('hmUpdated').textContent=latestUpd;
}

/* BOOT */
function init(){
  document.getElementById('footYear').textContent='\u00a9 '+new Date().getFullYear();
  buildControls();buildThemes();buildScatter();renderMain();buildPulse();
}
document.addEventListener('DOMContentLoaded',init);
