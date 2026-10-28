import assert from 'node:assert/strict';
import {
 isStockDate, localDaySerial, localDateLabel, daysUntilStockDate, validStockItem, validStockList,
 stockDateStatus, waterCoverage, requiredWaterLitres, waterGapLitres, STOCK_CAPACITY
} from '../src/lib/preparedness-stock.ts';

// These assertions test the exact pure rules used by the browser stock manager.
const before=new Date(2026,9,28,12);
const after=new Date(2026,9,29,12);
assert.equal(localDateLabel(before),'2026-10-28');
assert.equal(localDaySerial(after)-localDaySerial(before),86400000);
assert.equal(daysUntilStockDate('2026-10-31',before),3);
assert.equal(daysUntilStockDate('2026-10-31',after),2);
assert.equal(daysUntilStockDate('2026-10-27',before),-1);
assert.equal(daysUntilStockDate('2026-10-28',before),0);
assert.equal(daysUntilStockDate('2026-11-28',before),31);
assert.equal(daysUntilStockDate('2026-11-28',after),30);
assert.equal(isStockDate('2024-02-29'),true);
assert.equal(isStockDate('2026-02-29'),false);
assert.equal(isStockDate('2026-13-01'),false);
assert.equal(isStockDate('2026-00-01'),false);
assert.equal(isStockDate('2026-01-00'),false);
assert.equal(isStockDate('2026-01-01x'),false);
assert.equal(isStockDate('0099-12-31'),true);
assert.equal(isStockDate('0000-01-01'),false);
assert.throws(()=>daysUntilStockDate('not-a-date',before));

const item=(id,date,quantity=1,kind='bottled',unit='L')=>({
 id,kind,name:id,quantity,unit,place:'현관',date
});
const stocks=[
 item('three-day','2026-10-31',12),
 item('four-day','2026-11-01',5),
 item('today','2026-10-28',1),
 item('two-day','2026-10-30',2),
 item('expired','2026-10-27',3),
 item('undated','',9,'filled'),
 item('non-water','2026-11-29',6,'food','개')
];
assert.equal(validStockList(stocks),true);
assert.deepEqual(waterCoverage(stocks,before),{
 litres:17,missing:1,expired:1,within72:2,covered:2
});
assert.deepEqual(waterCoverage(stocks,after),{
 litres:5,missing:1,expired:2,within72:2,covered:1
});
assert.equal(stockDateStatus(stocks[5],before),null);
assert.equal(stockDateStatus(stocks[0],before),3);
assert.equal(requiredWaterLitres(1),11.4);
assert.equal(requiredWaterLitres(3),34.2);
for(const bad of [0,31,1.5,-3,Number.NaN,Number.POSITIVE_INFINITY])
 assert.equal(requiredWaterLitres(bad),null);
assert.equal(waterGapLitres(11.4,10),1.4);
assert.equal(waterGapLitres(11.4,17),0);
assert.equal(validStockItem(item('ok','2026-11-28')),true);
assert.equal(validStockItem(item('bad-year','2026-02-29')),false);
assert.equal(validStockItem(item('wrong-unit','2026-11-28',2,'filled','개')),false);
assert.equal(validStockItem(item('no-units','2026-11-28',Number.NaN)),false);
assert.equal(validStockItem(item('too-much','2026-11-28',10000)),false);
assert.equal(validStockItem(item('zero-qty','2026-11-28',0)),false);
assert.equal(validStockItem({...item('long-name','2026-11-28'),name:'x'.repeat(49)}),false);
assert.equal(validStockItem({...item('long-place','2026-11-28'),place:'x'.repeat(33)}),false);
assert.equal(validStockItem({...item('bad-id','2026-11-28'),id:''}),false);
assert.equal(validStockItem({...item('no-date','2026-11-28'),date:null}),false);
assert.equal(validStockItem(null),false);
assert.equal(validStockItem([]),false);
assert.equal(validStockList([stocks[0],stocks[0]]),false);
assert.equal(validStockList(Array.from({length:STOCK_CAPACITY+1},(_,i)=>item('id-'+i,'2026-11-28'))),false);
const stored=JSON.parse(JSON.stringify(stocks));
assert.equal(validStockList(stored),true);
assert.deepEqual(waterCoverage(stored,before),waterCoverage(stocks,before));

// Verify that the local calendar basis stays correct across DST transitions.
const originalTimezone=process.env.TZ;
try{
 process.env.TZ='America/New_York';
 const beforeDST=new Date(2026,2,7,12);
 const afterDST=new Date(2026,2,9,12);
 assert.equal(daysUntilStockDate('2026-03-09',beforeDST),2);
 assert.equal(daysUntilStockDate('2026-03-09',afterDST),0);
 assert.equal(localDaySerial(afterDST)-localDaySerial(beforeDST),2*86400000);
}finally{
 if(originalTimezone===undefined)delete process.env.TZ;
 else process.env.TZ=originalTimezone;
}
console.log('GuideHollow Ready preparedness stock regressions passed: date boundaries, 72-hour water, invalid backup records, local midnight and DST.');
