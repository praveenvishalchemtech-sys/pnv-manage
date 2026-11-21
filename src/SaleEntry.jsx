import React,{useMemo,useState} from 'react';
const today=()=>new Date().toLocaleDateString('en-CA');
const id=()=>globalThis.crypto?.randomUUID?.()||String(Date.now()+Math.random());
export default function SaleEntry({data,setData,shop}){
 const [search,setSearch]=useState(''),[quantities,setQuantities]=useState({}),[date,setDate]=useState(today()),[message,setMessage]=useState('');
 const balance=useMemo(()=>{const m=new Map(data.products.map(p=>[p.id,Number(p.opening||0)]));for(const t of data.movements){if(m.has(t.productId))m.set(t.productId,m.get(t.productId)+(t.type==='IN'?1:-1)*Number(t.qty||0))}return m},[data]);
 const products=data.products.filter(p=>(shop==='All shops'||p.shop===shop)&&p.name.toLowerCase().includes(search.toLowerCase())).sort((a,b)=>a.name.localeCompare(b.name));
 const record=p=>{const q=Number(quantities[p.id]);const available=balance.get(p.id)||0;if(!Number.isInteger(q)||q<=0){setMessage('Enter a positive whole-number quantity for '+p.name);return}if(q>available){setMessage('Only '+available+' available for '+p.name);return}const row={id:id(),productId:p.id,productName:p.name,shop:p.shop,date,qty:q,type:'OUT',reason:'Manual sales count',createdAt:new Date().toISOString(),note:'Quick sale entry'};setData(d=>({...d,movements:[...d.movements,row]}));setQuantities(v=>({...v,[p.id]:''}));setMessage('Saved: '+p.name+' −'+q+' | Remaining '+(available-q))};
 const todaySales=data.movements.filter(m=>m.reason==='Manual sales count'&&m.date===date&&(shop==='All shops'||m.shop===shop));
 return <section className="panel"><h2>Update Sales</h2><p className="muted">Find a product, enter the quantity sold and tap Save sale. Available stock decreases immediately. These are stock quantities, not cash billing entries.</p>
 <div className="entry"><label>Sale date<input type="date" value={date} onChange={e=>setDate(e.target.value)}/></label><label>Search products<input placeholder="Type product name" value={search} onChange={e=>setSearch(e.target.value)}/></label></div>
 {shop==='All shops'&&<p className="muted">Both shops are shown. Select a shop in the top-right filter to make daily entry easier.</p>}
 {message&&<p role="status" className="notice">{message}</p>}
 <div className="tablewrap"><table><thead><tr><th>Product name</th><th>Shop</th><th>Available stock</th><th>Sale quantity</th><th>Action</th></tr></thead><tbody>{products.map(p=><tr key={p.id}><td><b>{p.name}</b></td><td>{p.shop}</td><td><b className={(balance.get(p.id)||0)<=Number(p.reorder||0)?'warning':''}>{balance.get(p.id)||0} {p.unit||'pcs'}</b></td><td><input aria-label={'Quantity sold for '+p.name} style={{width:90,maxWidth:'100%'}} type="number" min="1" step="1" placeholder="Qty" value={quantities[p.id]??''} onChange={e=>setQuantities(v=>({...v,[p.id]:e.target.value}))}/></td><td><button className="primary" disabled={(balance.get(p.id)||0)<=0} onClick={()=>record(p)}>Save sale</button></td></tr>)}</tbody></table></div>
 {!products.length&&<p className="muted">No products found. Add or import products in the Products section.</p>}
 <h2>Sales recorded for {date}</h2><p className="muted">{todaySales.length} sale entries · {todaySales.reduce((n,m)=>n+Number(m.qty||0),0)} units sold</p>
 <div className="tablewrap"><table><thead><tr><th>Product</th><th>Shop</th><th>Quantity</th></tr></thead><tbody>{todaySales.slice().reverse().map(m=><tr key={m.id}><td>{m.productName}</td><td>{m.shop}</td><td>{m.qty}</td></tr>)}</tbody></table></div>
 </section>
}
