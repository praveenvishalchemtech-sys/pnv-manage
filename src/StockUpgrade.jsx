import React,{useMemo,useState} from 'react';
import * as XLSX from 'xlsx';

const SHOPS=['Dharga','Muneeshwar Nagar'];
const id=()=>globalThis.crypto?.randomUUID?.()||String(Date.now()+Math.random());
const date=()=>new Date().toLocaleDateString('en-CA');
const number=v=>Number(v||0);
const norm=v=>String(v||'').trim().replace(/\s+/g,' ').toUpperCase();
const csv=(rows,filename)=>{const keys=Object.keys(rows[0]||{});if(!keys.length)return alert('No records to export');const text=[keys,...rows.map(r=>keys.map(k=>r[k]??''))].map(row=>row.map(x=>'"'+String(x).replace(/"/g,'""')+'"').join(',')).join('\r\n');const url=URL.createObjectURL(new Blob(['\ufeff'+text],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
function totals(data){const map=new Map();for(const p of data.products)map.set(p.id,number(p.opening));for(const m of data.movements){if(map.has(m.productId))map.set(m.productId,map.get(m.productId)+(m.type==='IN'?1:-1)*number(m.qty))}return map}
const stamp=()=>new Date().toISOString();
export default function StockUpgrade({data,setData,shop,tab}){
 const [product,setProduct]=useState(''),[qty,setQty]=useState(''),[when,setWhen]=useState(date()),[mode,setMode]=useState('Sale'),[to,setTo]=useState(''),[note,setNote]=useState('');
 const [newName,setNewName]=useState(''),[sku,setSku]=useState(''),[opening,setOpening]=useState(''),[threshold,setThreshold]=useState('5'),[newShop,setNewShop]=useState(shop==='All shops'?SHOPS[0]:shop);
 const [importShop,setImportShop]=useState(SHOPS[0]),[sheetName,setSheetName]=useState('NOV'),[preview,setPreview]=useState(null),[importError,setImportError]=useState('');
 const balances=useMemo(()=>totals(data),[data]);
 const products=data.products.filter(p=>shop==='All shops'||p.shop===shop);
 const chosen=data.products.find(p=>p.id===product);
 const productRows=products.map(p=>({...p,balance:balances.get(p.id)||0}));
 const movements=data.movements.filter(m=>shop==='All shops'||m.shop===shop);
 const write=(kind,record)=>setData(d=>({...d,[kind]:[...d[kind],record]}));
 const transact=e=>{e.preventDefault();const n=Number(qty);if(!chosen||!Number.isInteger(n)||n<=0)return alert('Choose a product and enter a positive whole quantity');
 const balance=balances.get(chosen.id)||0;if(mode!=='Purchase'&&mode!=='Return'&&n>balance)return alert('Insufficient stock: '+balance);
 if(mode==='Transfer'&&(!to||to===chosen.shop))return alert('Choose the destination shop');
 const other=mode==='Transfer'?data.products.find(p=>p.shop===to&&norm(p.name)===norm(chosen.name)):null;
 if(mode==='Transfer'&&!other&&!confirm('Product does not exist at '+to+'. Create matching product automatically?'))return;
 const transferId=id(),createdAt=stamp();
 const out={id:id(),productId:chosen.id,productName:chosen.name,shop:chosen.shop,date:when,qty:n,type:mode==='Purchase'||mode==='Return'?'IN':'OUT',reason:mode==='Sale'?'Manual sales count':mode,transferId:mode==='Transfer'?transferId:'',note,createdAt};
 setData(d=>{let products=d.products,movements=[...d.movements,out];if(mode==='Transfer'){let destination=other;if(!destination){destination={...chosen,id:id(),shop:to,opening:0};products=[...products,destination]}movements.push({id:id(),productId:destination.id,productName:destination.name,shop:to,date:when,qty:n,type:'IN',reason:'Transfer',transferId,note,createdAt})}return {...d,products,movements}});
 setQty('');setNote('');alert(mode+' saved');
 };
 const addProduct=e=>{e.preventDefault();const n=Number(opening);if(!newName.trim()||!Number.isInteger(n)||n<0)return alert('Enter a product and valid opening quantity');if(data.products.some(p=>p.shop===newShop&&norm(p.name)===norm(newName)))return alert('Product already exists in this shop');
 write('products',{id:id(),name:newName.trim(),sku:sku.trim()||norm(newName).replace(/[^A-Z0-9]+/g,'-'),shop:newShop,unit:'pcs',opening:n,reorder:Math.max(0,Number(threshold)||0),cost:0,price:0});setNewName('');setSku('');setOpening('');alert('Product added')};
 const readFile=async e=>{const file=e.target.files?.[0];if(!file)return;setImportError('');setPreview(null);try{
 const book=XLSX.read(await file.arrayBuffer(),{type:'array'});const actual=book.SheetNames.find(x=>x.toUpperCase()===sheetName.toUpperCase());if(!actual)throw Error('Sheet '+sheetName+' not found. Available: '+book.SheetNames.join(', '));
 const rows=XLSX.utils.sheet_to_json(book.Sheets[actual],{header:1,defval:''});
 const headerIndex=rows.findIndex(row=>row.some(x=>norm(x)==='ITEM NAME'));if(headerIndex<0)throw Error('ITEM NAME header not found');
 const headers=rows[headerIndex].map(norm),nameIndex=headers.indexOf('ITEM NAME'),balanceIndex=headers.indexOf('BALANCE STOCK SHOP');
 if(balanceIndex<0)throw Error('BALANCE STOCK SHOP column not found');
 const list=rows.slice(headerIndex+1).filter(r=>String(r[nameIndex]||'').trim()).map(r=>({name:String(r[nameIndex]).trim(),balance:Number(r[balanceIndex]),raw:r[balanceIndex]}));
 const invalid=list.filter(x=>!Number.isInteger(x.balance)||x.balance<0||x.raw==='');
 const seen=new Set(),duplicates=[];for(const p of list){const k=norm(p.name);if(seen.has(k))duplicates.push(p.name);seen.add(k)}
 setPreview({list,invalid,duplicates,sheet:actual});
 }catch(err){setImportError(err.message)}e.target.value=''};
 const importProducts=()=>{if(!preview||preview.invalid.length||preview.duplicates.length)return;const existing=preview.list.filter(p=>data.products.some(x=>x.shop===importShop&&norm(x.name)===norm(p.name)));if(existing.length)return alert(existing.length+' products already exist in '+importShop+'. Import stopped to prevent overwriting or double-counting. Use a clean shop or import only missing products.');
 if(!confirm('Import '+preview.list.length+' products into '+importShop+' using BALANCE STOCK SHOP as opening quantities? This is a snapshot, not a transaction replay.'))return;
 setData(d=>({...d,products:[...d.products,...preview.list.map(p=>({id:id(),name:p.name,sku:norm(p.name).replace(/[^A-Z0-9]+/g,'-'),shop:importShop,unit:'pcs',opening:p.balance,reorder:5,cost:0,price:0}))]}));setPreview(null);alert('Products imported successfully')};
 const report=()=>{const rows=productRows.map(p=>{const ms=data.movements.filter(m=>m.productId===p.id);const amount=(reason,type)=>ms.filter(m=>m.reason===reason&&m.type===type).reduce((s,m)=>s+number(m.qty),0);const purchased=amount('Purchase','IN'),received=amount('Transfer','IN'),sold=amount('Manual sales count','OUT'),sent=amount('Transfer','OUT'),returns=amount('Return','IN'),damage=amount('Damage','OUT');return {'SHOP':p.shop,'ITEM NAME':p.name,'OLD STOCK':p.opening,'TRANSFER IN':received,'LOCAL PURCHASE':purchased,'RETURNS':returns,'SALES PRODUCT':sold,'TRANSFER OUT':sent,'DAMAGE':damage,'BALANCE STOCK SHOP':p.balance}});csv(rows,'pnv-stock-report-'+date()+'.csv')};
 return <section className="panel">
 <h2>{tab==='Products'?'Product catalogue & Excel import':'Stock transactions & reports'}</h2>
 <p className="muted">All entries are stored on this browser only. Stock changes immediately when a sale, purchase or transfer is saved. Download a backup daily.</p>
 {tab==='Products'&&<><h2>Add a product</h2><form className="entry" onSubmit={addProduct}>
 <label>Shop<select value={newShop} onChange={e=>setNewShop(e.target.value)}>{SHOPS.map(s=><option key={s}>{s}</option>)}</select></label>
 <label>Product name<input required value={newName} onChange={e=>setNewName(e.target.value)}/></label>
 <label>Code (optional)<input value={sku} onChange={e=>setSku(e.target.value)}/></label>
 <label>Opening stock<input type="number" min="0" step="1" required value={opening} onChange={e=>setOpening(e.target.value)}/></label>
 <label>Low-stock threshold<input type="number" min="0" step="1" value={threshold} onChange={e=>setThreshold(e.target.value)}/></label>
 <button className="primary" type="submit">Add product</button></form>
 <h2>Import your KM1 Excel</h2><p className="muted">Choose OCT or NOV. The import reads ITEM NAME and BALANCE STOCK SHOP. Existing shop products are never overwritten.</p>
 <div className="entry"><label>Destination shop<select value={importShop} onChange={e=>setImportShop(e.target.value)}>{SHOPS.map(s=><option key={s}>{s}</option>)}</select></label><label>Excel sheet<select value={sheetName} onChange={e=>{setSheetName(e.target.value);setPreview(null)}}><option>NOV</option><option>OCT</option></select></label><label>Choose Excel workbook<input type="file" accept=".xlsx,.xls" onChange={readFile}/></label></div>
 {importError&&<p role="alert" className="warning">{importError}</p>}
 {preview&&<div className="notice"><div><b>{preview.list.length} products found in {preview.sheet}</b><p>{preview.invalid.length} invalid balances; {preview.duplicates.length} duplicate product names.</p><p>Sample: {preview.list.slice(0,5).map(x=>x.name+' ('+x.balance+')').join(', ')}</p><button className="primary" disabled={!!(preview.invalid.length||preview.duplicates.length)} onClick={importProducts}>Confirm product import</button></div></div>}
 </>}
 {tab==='Stock'&&<><h2>Record a transaction</h2><form className="entry" onSubmit={transact}>
 <label>Product<select required value={product} onChange={e=>{setProduct(e.target.value);setTo('')}}><option value="">Select product</option>{products.map(p=><option key={p.id} value={p.id}>{p.shop} · {p.name} · {balances.get(p.id)||0} available</option>)}</select></label>
 <label>Action<select value={mode} onChange={e=>setMode(e.target.value)}>{['Sale','Purchase','Transfer','Damage','Return'].map(x=><option key={x}>{x}</option>)}</select></label>
 <label>Quantity<input type="number" min="1" step="1" required value={qty} onChange={e=>setQty(e.target.value)}/></label>
 <label>Date<input type="date" value={when} onChange={e=>setWhen(e.target.value)} required/></label>
 {mode==='Transfer'&&<label>Destination shop<select required value={to} onChange={e=>setTo(e.target.value)}><option value="">Select shop</option>{SHOPS.filter(s=>s!==chosen?.shop).map(s=><option key={s}>{s}</option>)}</select></label>}
 <label>Notes<input value={note} onChange={e=>setNote(e.target.value)}/></label>
 <button className="primary" type="submit">Save {mode.toLowerCase()}</button></form>
 <h2>Transaction history</h2><div className="tablewrap"><table><thead><tr><th>Date</th><th>Shop</th><th>Product</th><th>Action</th><th>Qty</th></tr></thead><tbody>{movements.slice().reverse().slice(0,100).map(m=><tr key={m.id}><td>{m.date}</td><td>{m.shop}</td><td>{m.productName}</td><td>{m.reason}</td><td>{m.type==='IN'?'+':'−'}{m.qty}</td></tr>)}</tbody></table></div>
 <button className="secondary" onClick={()=>csv(movements,'pnv-stock-transactions-'+date()+'.csv')}>Export transaction history CSV</button></>}
 <h2>Current stock & Excel-style report</h2><button className="secondary" onClick={report}>Download stock report CSV</button>
 <div className="tablewrap"><table><thead><tr><th>Shop</th><th>Product</th><th>Opening</th><th>Balance</th><th>Status</th></tr></thead><tbody>{productRows.map(p=><tr key={p.id}><td>{p.shop}</td><td>{p.name}</td><td>{p.opening}</td><td>{p.balance}</td><td>{p.balance<=number(p.reorder)?'Low stock':'OK'}</td></tr>)}</tbody></table></div>
 </section>
}
