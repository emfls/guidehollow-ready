// Shared browser/client rules for the GuideHollow Ready household stock manager.
// Pure functions: do not access localStorage, DOM, network, or the system clock except via the optional date argument.
export type Kind = 'food' | 'bottled' | 'filled' | 'other';
export type Unit = '개' | '팩' | '인분' | 'L';
export type StockItem = {
 id:string; kind:Kind; name:string; quantity:number; unit:Unit; place:string; date:string;
};
export const STOCK_KINDS = ['food','bottled','filled','other'] as const;
export const STOCK_UNITS = ['개','팩','인분','L'] as const;
export const STOCK_CAPACITY = 60;

const DAY_MS=86400000;
function dateSerial(y:number,m:number,d:number):number {
 // setUTCFullYear handles years 0001-0099 correctly, unlike Date.UTC(y, ...).
 const date=new Date(0);
 date.setUTCFullYear(y,m-1,d);
 date.setUTCHours(0,0,0,0);
 return date.getTime();
}
export function isStockDate(s:string):boolean {
 if(!/^\d{4}-\d{2}-\d{2}$/.test(s))return false;
 const [y,m,d]=s.split('-').map(Number);
 if(y<1)return false;
 const candidate=new Date(dateSerial(y,m,d));
 return candidate.getUTCFullYear()===y&&candidate.getUTCMonth()===m-1&&candidate.getUTCDate()===d;
}
export function localDaySerial(now:Date=new Date()):number {
 return dateSerial(now.getFullYear(),now.getMonth()+1,now.getDate());
}
export function localDateLabel(now:Date=new Date()):string {
 return [String(now.getFullYear()).padStart(4,'0'),String(now.getMonth()+1).padStart(2,'0'),String(now.getDate()).padStart(2,'0')].join('-');
}
export function daysUntilStockDate(date:string,now:Date=new Date()):number {
 if(!isStockDate(date))throw Error('Invalid stock date');
 const [y,m,d]=date.split('-').map(Number);
 return Math.round((dateSerial(y,m,d)-localDaySerial(now))/DAY_MS);
}
export function validStockItem(value:unknown):value is StockItem {
 if(!value||typeof value!=='object'||Array.isArray(value))return false;
 const x=value as Partial<StockItem>;
 return typeof x.id==='string'&&x.id.length>0&&x.id.length<90
  &&STOCK_KINDS.includes(x.kind as Kind)
  &&typeof x.name==='string'&&x.name.trim().length>0&&x.name.length<=48
  &&typeof x.quantity==='number'&&Number.isFinite(x.quantity)&&x.quantity>=0.1&&x.quantity<=9999
  &&STOCK_UNITS.includes(x.unit as Unit)
  &&(x.kind!=='bottled'&&x.kind!=='filled'||x.unit==='L')
  &&typeof x.place==='string'&&x.place.length<=32
  &&typeof x.date==='string'&&(!x.date||isStockDate(x.date));
}
export function validStockList(value:unknown):value is StockItem[] {
 return Array.isArray(value)&&value.length<=STOCK_CAPACITY
  &&value.every(validStockItem)
  &&new Set(value.map((item:StockItem)=>item.id)).size===value.length;
}
export function stockDateStatus(item:StockItem,now:Date=new Date()):number|null {
 return item.date?daysUntilStockDate(item.date,now):null;
}
export function waterCoverage(items:readonly StockItem[],now:Date=new Date()) {
 let litres=0,missing=0,expired=0,within72=0,covered=0;
 for(const item of items){
  if((item.kind!=='bottled'&&item.kind!=='filled')||item.unit!=='L')continue;
  const remaining=stockDateStatus(item,now);
  if(remaining===null)missing++;
  else if(remaining<0)expired++;
  else if(remaining<3)within72++;
  else{covered++;litres+=item.quantity;}
 }
 return {litres:Math.round(litres*10)/10,missing,expired,within72,covered};
}
export function requiredWaterLitres(people:number):number|null {
 if(!Number.isInteger(people)||people<1||people>30)return null;
 return Math.round(people*3.8*3*10)/10;
}
export function waterGapLitres(required:number,stored:number):number {
 return Math.max(0,Math.round((required-stored)*10)/10);
}
