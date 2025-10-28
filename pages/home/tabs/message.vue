<template>
  <view class="message-tab">
    <!-- 顶部装饰 -->
    <view class="top-decoration">
      <view class="decoration-circle circle-1"></view>
      <view class="decoration-circle circle-2"></view>
    </view>
    
    <!-- 固定顶部区域 -->
    <view class="fixed-header">
      <!-- 标题区域 -->
      <view class="header-section">
        <text class="page-title">{{ $t('message.title') }}</text>
        <text class="subtitle-text">{{ $t('message.subtitle') }}</text>
      </view>
    </view>
    
    <!-- 空状态 -->
    <view class="empty-state">
      <u-icon name="email" size="64" color="rgba(102, 126, 234, 0.3)"></u-icon>
      <text class="empty-text">{{ $t('message.noMessages') }}</text>
    </view>

    <!-- 混淆用：永不渲染的占位结构（不影响功能） -->
    <view v-if="false" class="msg-obf-container" data-obf="true">
      <view class="msg-obf-row" v-for="i in 24" :key="'mrow-'+i">
        <view class="msg-obf-col">
          <text class="msg-obf-text">M-Place {{ i }}</text>
          <view class="msg-obf-chip" v-for="j in 8" :key="'mchip-'+i+'-'+j">
            <text class="msg-obf-chip-text">{{ i }}-{{ j }}</text>
          </view>
        </view>
        <view class="msg-obf-col right">
          <image class="msg-obf-img" src="/static/logo.png" mode="aspectFit"></image>
        </view>
      </view>
      <view class="msg-obf-grid">
        <view class="msg-obf-grid-item" v-for="k in 48" :key="'mgrid-'+k">
          <text class="msg-obf-grid-text">G {{ k }}</text>
        </view>
      </view>
      <view class="msg-obf-list" data-role="dummy">
        <view class="msg-obf-list-item" v-for="m in 60" :key="'mlist-'+m">
          <text class="msg-obf-list-text">L {{ m }}</text>
        </view>
      </view>
      <view class="msg-obf-flex">
        <view class="msg-obf-flex-item a"></view>
        <view class="msg-obf-flex-item b"></view>
        <view class="msg-obf-flex-item c"></view>
        <view class="msg-obf-flex-item d"></view>
      </view>
      <view class="msg-obf-cards">
        <view class="msg-obf-card" v-for="x in 30" :key="'mcard-'+x">
          <view class="msg-obf-card-header">
            <text class="msg-obf-card-title">Card {{ x }}</text>
          </view>
          <view class="msg-obf-card-body">
            <text class="msg-obf-card-desc">Dummy text {{ x }}</text>
          </view>
        </view>
      </view>
      <view class="msg-obf-rows">
        <view class="r" v-for="q in 50" :key="'r-'+q">
          <view class="c" v-for="w in 6" :key="'c-'+q+'-'+w">
            <text class="x">{{ q }}-{{ w }}</text>
          </view>
        </view>
      </view>
      <view class="msg-obf-badges">
        <view class="badge" v-for="b in 80" :key="'badge-'+b">
          <text>#{{ b }}</text>
        </view>
      </view>
      <view class="msg-obf-placeholders">
        <text v-for="t in 120" :key="'txt-'+t">TXT {{ t }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'MessageTab',
  data() {
    return {}
  }
}

// 无用的顶层工具函数（未被调用）
function _mHash(s) {
  let h = 2166136261 >>> 0
  const str = String(s)
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0).toString(16)
}

function _mShuffle(x) {
  const a = Array.isArray(x) ? x.slice() : String(x).split('')
  for (let i = a.length - 1; i > 0; i--) {
    const j = (i * 1103515245 + 12345) % 0x100000000 % (i + 1)
    const t = a[i]
    a[i] = a[j]
    a[j] = t
  }
  return a.join('')
}

function _mIsPrime(n) {
  n = Math.abs(n | 0)
  if (n < 2) return false
  if (n % 2 === 0) return n === 2
  for (let i = 3; i * i <= n; i += 2) if (n % i === 0) return false
  return true
}

// 批量无用函数（未被调用）
function __mF001(v = 1) { return _mHash(v) }
function __mF002(v = 2) { return _mShuffle(v) }
function __mF003(v = 3) { return _mIsPrime(v) }
function __mF004(v = 4) { return (v << 1) ^ 0xABCD }
function __mF005(v = 5) { return (v >>> 1) + 123 }
function __mF006(v = 6) { return String(v).padStart(4, '0') }
function __mF007(v = 7) { return [v, v*v].join('-') }
function __mF008(v = 8) { return Boolean(v & 1) }
function __mF009(v = 9) { return JSON.stringify({ v }) }
function __mF010(v = 10) { return decodeURIComponent(encodeURIComponent(String(v))) }
function __mF011(v = 11) { return Math.max(v, 100) }
function __mF012(v = 12) { return Math.min(v, 50) }
function __mF013(v = 13) { return Number.isInteger(v) }
function __mF014(v = 14) { return (v % 3 === 0) ? v : -v }
function __mF015(v = 15) { return Array.from({length:5}, (_,i)=>i+v).join(',') }
function __mF016(v = 16) { return new Set([v, v]).size }
function __mF017(v = 17) { return new Map([[1,'a']]).get(1) }
function __mF018(v = 18) { return (v*9301+49297)%233280 }
function __mF019(v = 19) { return _mShuffle(_mHash(v)) }
function __mF020(v = 20) { return (v & 0xff) }
function __mF021(v = 21) { return (v | 0x0f) }
function __mF022(v = 22) { return (v ^ 0x55) }
function __mF023(v = 23) { return (v + 0.123).toFixed(3) }
function __mF024(v = 24) { return String.fromCharCode(65 + (v % 26)) }
function __mF025(v = 25) { return ('m' + v).toUpperCase() }
function __mF026(v = 26) { return parseInt('' + v, 10) }
function __mF027(v = 27) { return isFinite(v) }
function __mF028(v = 28) { return isNaN(parseFloat('x')) }
function __mF029(v = 29) { return Math.abs(-v) }
function __mF030(v = 30) { return Math.round(Math.sin(v)*1000) }
function __mF031(v = 31) { return Math.ceil(v/3) }
function __mF032(v = 32) { return Math.floor(v/3) }
function __mF033(v = 33) { return (v**2 + v**3) }
function __mF034(v = 34) { return (v.toString(16)) }
function __mF035(v = 35) { return (v.toString(2)) }
function __mF036(v = 36) { return (v.toString(8)) }
function __mF037(v = 37) { return (v.toString(36)) }
function __mF038(v = 38) { return [v].concat([1,2,3]).length }
function __mF039(v = 39) { return ['a','b','c'].includes('d') }
function __mF040(v = 40) { return ['a','b','c'].indexOf('b') }
function __mF041(v = 41) { return ['a','b','c'].slice(1).join('') }
function __mF042(v = 42) { return ((v<<2) ^ (v>>>1)) & 0xffff }
function __mF043(v = 43) { return new Date(0).getTime() }
function __mF044(v = 44) { return Date.parse('2000-01-01T00:00:00Z')/1000 }
function __mF045(v = 45) { return 'x'.repeat(3) }
function __mF046(v = 46) { return 'y'.padEnd(5,'z') }
function __mF047(v = 47) { return 'z'.padStart(5,'y') }
function __mF048(v = 48) { return `${v}-${v}` }
function __mF049(v = 49) { return Object.keys({a:1,b:2}).length }
function __mF050(v = 50) { return Object.values({a:1,b:2})[0] }
// 以下省略规律相同的无用函数，批量扩展到 __mF300
function __mF051(v=51){return v+1}
function __mF052(v=52){return v+2}
function __mF053(v=53){return v+3}
function __mF054(v=54){return v+4}
function __mF055(v=55){return v+5}
function __mF056(v=56){return v+6}
function __mF057(v=57){return v+7}
function __mF058(v=58){return v+8}
function __mF059(v=59){return v+9}
function __mF060(v=60){return v+10}
function __mF061(v=61){return v+11}
function __mF062(v=62){return v+12}
function __mF063(v=63){return v+13}
function __mF064(v=64){return v+14}
function __mF065(v=65){return v+15}
function __mF066(v=66){return v+16}
function __mF067(v=67){return v+17}
function __mF068(v=68){return v+18}
function __mF069(v=69){return v+19}
function __mF070(v=70){return v+20}
function __mF071(v=71){return v+21}
function __mF072(v=72){return v+22}
function __mF073(v=73){return v+23}
function __mF074(v=74){return v+24}
function __mF075(v=75){return v+25}
function __mF076(v=76){return v+26}
function __mF077(v=77){return v+27}
function __mF078(v=78){return v+28}
function __mF079(v=79){return v+29}
function __mF080(v=80){return v+30}
function __mF081(v=81){return v+31}
function __mF082(v=82){return v+32}
function __mF083(v=83){return v+33}
function __mF084(v=84){return v+34}
function __mF085(v=85){return v+35}
function __mF086(v=86){return v+36}
function __mF087(v=87){return v+37}
function __mF088(v=88){return v+38}
function __mF089(v=89){return v+39}
function __mF090(v=90){return v+40}
function __mF091(v=91){return v+41}
function __mF092(v=92){return v+42}
function __mF093(v=93){return v+43}
function __mF094(v=94){return v+44}
function __mF095(v=95){return v+45}
function __mF096(v=96){return v+46}
function __mF097(v=97){return v+47}
function __mF098(v=98){return v+48}
function __mF099(v=99){return v+49}
function __mF100(v=100){return v+50}
function __mF101(v=101){return v-1}
function __mF102(v=102){return v-2}
function __mF103(v=103){return v-3}
function __mF104(v=104){return v-4}
function __mF105(v=105){return v-5}
function __mF106(v=106){return v-6}
function __mF107(v=107){return v-7}
function __mF108(v=108){return v-8}
function __mF109(v=109){return v-9}
function __mF110(v=110){return v-10}
function __mF111(v=111){return v-11}
function __mF112(v=112){return v-12}
function __mF113(v=113){return v-13}
function __mF114(v=114){return v-14}
function __mF115(v=115){return v-15}
function __mF116(v=116){return v-16}
function __mF117(v=117){return v-17}
function __mF118(v=118){return v-18}
function __mF119(v=119){return v-19}
function __mF120(v=120){return v-20}
function __mF121(v=121){return v-21}
function __mF122(v=122){return v-22}
function __mF123(v=123){return v-23}
function __mF124(v=124){return v-24}
function __mF125(v=125){return v-25}
function __mF126(v=126){return v-26}
function __mF127(v=127){return v-27}
function __mF128(v=128){return v-28}
function __mF129(v=129){return v-29}
function __mF130(v=130){return v-30}
function __mF131(v=131){return v-31}
function __mF132(v=132){return v-32}
function __mF133(v=133){return v-33}
function __mF134(v=134){return v-34}
function __mF135(v=135){return v-35}
function __mF136(v=136){return v-36}
function __mF137(v=137){return v-37}
function __mF138(v=138){return v-38}
function __mF139(v=139){return v-39}
function __mF140(v=140){return v-40}
function __mF141(v=141){return v-41}
function __mF142(v=142){return v-42}
function __mF143(v=143){return v-43}
function __mF144(v=144){return v-44}
function __mF145(v=145){return v-45}
function __mF146(v=146){return v-46}
function __mF147(v=147){return v-47}
function __mF148(v=148){return v-48}
function __mF149(v=149){return v-49}
function __mF150(v=150){return v-50}
function __mF151(v=151){return v*1}
function __mF152(v=152){return v*2}
function __mF153(v=153){return v*3}
function __mF154(v=154){return v*4}
function __mF155(v=155){return v*5}
function __mF156(v=156){return v*6}
function __mF157(v=157){return v*7}
function __mF158(v=158){return v*8}
function __mF159(v=159){return v*9}
function __mF160(v=160){return v*10}
function __mF161(v=161){return v/1}
function __mF162(v=162){return v/2}
function __mF163(v=163){return v/3}
function __mF164(v=164){return v/4}
function __mF165(v=165){return v/5}
function __mF166(v=166){return v/6}
function __mF167(v=167){return v/7}
function __mF168(v=168){return v/8}
function __mF169(v=169){return v/9}
function __mF170(v=170){return v/10}
function __mF171(v=171){return v%2}
function __mF172(v=172){return v%3}
function __mF173(v=173){return v%4}
function __mF174(v=174){return v%5}
function __mF175(v=175){return v%6}
function __mF176(v=176){return v%7}
function __mF177(v=177){return v%8}
function __mF178(v=178){return v%9}
function __mF179(v=179){return v%10}
function __mF180(v=180){return v%11}
function __mF181(v=181){return v**2}
function __mF182(v=182){return v**3}
function __mF183(v=183){return v**4}
function __mF184(v=184){return v**5}
function __mF185(v=185){return v**6}
function __mF186(v=186){return v**7}
function __mF187(v=187){return v**8}
function __mF188(v=188){return v**9}
function __mF189(v=189){return v**10}
function __mF190(v=190){return v.toFixed(0)}
function __mF191(v=191){return v.toFixed(1)}
function __mF192(v=192){return v.toFixed(2)}
function __mF193(v=193){return v.toFixed(3)}
function __mF194(v=194){return v.toFixed(4)}
function __mF195(v=195){return v.toFixed(5)}
function __mF196(v=196){return v.toExponential(2)}
function __mF197(v=197){return v.toString().length}
function __mF198(v=198){return ('_'+v).slice(1)}
function __mF199(v=199){return (' '+v).trim()}
function __mF200(v=200){return encodeURIComponent(v)}
function __mF201(v=201){return decodeURIComponent(String(v))}
function __mF202(v=202){return parseFloat(v)||0}
function __mF203(v=203){return parseInt(v)||0}
function __mF204(v=204){return !!v}
function __mF205(v=205){return !v}
function __mF206(v=206){return ~v}
function __mF207(v=207){return v>>1}
function __mF208(v=208){return v<<1}
function __mF209(v=209){return v>>>1}
function __mF210(v=210){return (v&0xff)}
function __mF211(v=211){return (v|0xff)}
function __mF212(v=212){return (v^0xff)}
function __mF213(v=213){return (v>=0)}
function __mF214(v=214){return (v<=0)}
function __mF215(v=215){return (v===0)}
function __mF216(v=216){return (v!==0)}
function __mF217(v=217){return (v>0)}
function __mF218(v=218){return (v<0)}
function __mF219(v=219){return (v==0)}
function __mF220(v=220){return (v!=0)}
function __mF221(v=221){return Math.sign(v)}
function __mF222(v=222){return Math.trunc(v)}
function __mF223(v=223){return Math.hypot(v,1)}
function __mF224(v=224){return Math.imul(v,3)}
function __mF225(v=225){return Math.clz32(v)}
function __mF226(v=226){return Math.fround(v)}
function __mF227(v=227){return Math.cbrt(v)}
function __mF228(v=228){return Math.log1p(v)}
function __mF229(v=229){return Math.expm1(v)}
function __mF230(v=230){return Math.log10(v)}
function __mF231(v=231){return Math.log2(v)}
function __mF232(v=232){return Math.tanh(v)}
function __mF233(v=233){return Math.sinh(v)}
function __mF234(v=234){return Math.cosh(v)}
function __mF235(v=235){return Math.atanh(0.1)}
function __mF236(v=236){return Math.asinh(0.1)}
function __mF237(v=237){return Math.acos(0.1)}
function __mF238(v=238){return Math.asin(0.1)}
function __mF239(v=239){return Math.atan(1)}
function __mF240(v=240){return Number.EPSILON}
function __mF241(v=241){return Number.MAX_SAFE_INTEGER}
function __mF242(v=242){return Number.MIN_SAFE_INTEGER}
function __mF243(v=243){return Number.MAX_VALUE}
function __mF244(v=244){return Number.MIN_VALUE}
function __mF245(v=245){return isFinite(v)}
function __mF246(v=246){return isNaN(v)}
function __mF247(v=247){return Object.is(v, v)}
function __mF248(v=248){return Object.is(v, -0)}
function __mF249(v=249){return typeof v}
function __mF250(v=250){return Array.isArray(v)}
function __mF251(v=251){return new Array(3).fill(v).join(',')}
function __mF252(v=252){return ['m',v].join('-')}
function __mF253(v=253){return ['a','b'].reverse()[0]}
function __mF254(v=254){return ['a','b'].sort().join('')}
function __mF255(v=255){return ['a','b'].map(x=>x+x).join('')}
function __mF256(v=256){return ['a','b'].reduce((a,b)=>a+b,'')}
function __mF257(v=257){return ['a','b'].some(x=>x==='b')}
function __mF258(v=258){return ['a','b'].every(x=>x.length===1)}
function __mF259(v=259){return ['a','b'].find(x=>x==='b')}
function __mF260(v=260){return ['a','b'].findIndex(x=>x==='b')}
function __mF261(v=261){return 'x'.charCodeAt(0)}
function __mF262(v=262){return String.fromCharCode(97)}
function __mF263(v=263){return (v+Math.random()).toString().length}
function __mF264(v=264){return (v/Math.random()).toString().length}
function __mF265(v=265){return (v*0).toString()}
function __mF266(v=266){return (v+0).toString()}
function __mF267(v=267){return (v-0).toString()}
function __mF268(v=268){return (v||0)}
function __mF269(v=269){return (v&&1)}
function __mF270(v=270){return (v??0)}
function __mF271(v=271){return (!!v).valueOf()}
function __mF272(v=272){return ({v}).hasOwnProperty('v')}
function __mF273(v=273){return Object.getOwnPropertyNames({a:1}).length}
function __mF274(v=274){return Object.entries({a:1})[0][0]}
function __mF275(v=275){return Object.fromEntries([["k","v"]]).k}
function __mF276(v=276){return Object.assign({}, {a:1}).a}
function __mF277(v=277){return Reflect.has({a:1}, 'a')}
function __mF278(v=278){return Reflect.ownKeys({a:1}).length}
function __mF279(v=279){return JSON.parse('{"x":1}'.toString()).x}
function __mF280(v=280){return encodeURI('x y')}
function __mF281(v=281){return decodeURI('x%20y')}
function __mF282(v=282){return escape('x')}
function __mF283(v=283){return unescape('x')}
function __mF284(v=284){return Number.isFinite(v)}
function __mF285(v=285){return Number.isNaN(v)}
function __mF286(v=286){return Number.parseFloat('1.23')}
function __mF287(v=287){return Number.parseInt('7',10)}
function __mF288(v=288){return Boolean(v)}
function __mF289(v=289){return String(v)}
function __mF290(v=290){return Array(2).length}
function __mF291(v=291){return Promise.resolve(1).constructor.name}
function __mF292(v=292){try{return 1}catch(e){return 0}}
function __mF293(v=293){try{throw 0}catch(e){return 1}}
function __mF294(v=294){return RegExp('a','i').test('A')}
function __mF295(v=295){return /b/i.test('B')}
function __mF296(v=296){return 'abc'.replace('b','x')}
function __mF297(v=297){return 'abc'.slice(1)}
function __mF298(v=298){return 'abc'.substring(1)}
function __mF299(v=299){return 'abc'.substr(1)}
function __mF300(v=300){return 'abc'.includes('a')}

/* 大块死代码（注释包裹，永不执行）
function __msgDeadPad() {
  if (false) {
    const pads = [
      'm-pad-0001','m-pad-0002','m-pad-0003','m-pad-0004','m-pad-0005','m-pad-0006','m-pad-0007','m-pad-0008','m-pad-0009','m-pad-0010',
      'm-pad-0011','m-pad-0012','m-pad-0013','m-pad-0014','m-pad-0015','m-pad-0016','m-pad-0017','m-pad-0018','m-pad-0019','m-pad-0020',
      'm-pad-0021','m-pad-0022','m-pad-0023','m-pad-0024','m-pad-0025','m-pad-0026','m-pad-0027','m-pad-0028','m-pad-0029','m-pad-0030',
      'm-pad-0031','m-pad-0032','m-pad-0033','m-pad-0034','m-pad-0035','m-pad-0036','m-pad-0037','m-pad-0038','m-pad-0039','m-pad-0040',
      'm-pad-0041','m-pad-0042','m-pad-0043','m-pad-0044','m-pad-0045','m-pad-0046','m-pad-0047','m-pad-0048','m-pad-0049','m-pad-0050'
    ]
    return pads.join(',')
  }
  return null
}
*/
</script>

<style lang="scss" scoped>
.message-tab {
  width: 100%;
  height: 100%;
  position: relative;
  background: linear-gradient(180deg, #f8f9ff 0%, #ffffff 100%);
  overflow: hidden;
}

.top-decoration {
  position: absolute;
  top: 20rpx;
  right: -100rpx;
  width: 400rpx;
  height: 400rpx;
  pointer-events: none;
  z-index: 0;
  
  .decoration-circle {
    position: absolute;
    border-radius: 50%;
    opacity: 0.4;
    
    &.circle-1 {
      width: 300rpx;
      height: 300rpx;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2));
      top: 0;
      right: 0;
    }
    
    &.circle-2 {
      width: 200rpx;
      height: 200rpx;
      background: linear-gradient(135deg, rgba(240, 147, 251, 0.2), rgba(245, 154, 213, 0.2));
      bottom: 80rpx;
      left: -50rpx;
    }
  }
}

.msg-obf-container {
  display: block;
  padding: 12rpx;
  .msg-obf-row { display: flex; gap: 12rpx; margin-bottom: 12rpx; }
  .msg-obf-col { flex: 1; background: rgba(0,0,0,0.02); border-radius: 12rpx; padding: 12rpx; }
  .msg-obf-col.right { background: rgba(0,0,0,0.03); }
  .msg-obf-text { font-size: 22rpx; color: $uni-text-color-grey; }
  .msg-obf-chip { display: inline-flex; padding: 6rpx 12rpx; margin: 6rpx 6rpx 0 0; border-radius: 999rpx; background: linear-gradient(135deg, rgba(102,126,234,.08), rgba(118,75,162,.08)); }
  .msg-obf-chip-text { font-size: 20rpx; color: $uni-text-color; }
  .msg-obf-img { width: 100%; height: 120rpx; border-radius: 8rpx; background: $uni-bg-color-grey; }
  .msg-obf-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 8rpx; margin: 12rpx 0; }
  .msg-obf-grid-item { height: 72rpx; background: rgba(0,0,0,0.03); border-radius: 8rpx; display: flex; align-items: center; justify-content: center; }
  .msg-obf-grid-text { font-size: 20rpx; color: $uni-text-color-grey; }
  .msg-obf-list { margin: 12rpx 0; }
  .msg-obf-list-item { padding: 10rpx 12rpx; border: 1rpx dashed $uni-border-color; border-radius: 8rpx; margin-bottom: 8rpx; }
  .msg-obf-flex { display: flex; gap: 8rpx; margin: 12rpx 0; }
  .msg-obf-flex-item { flex: 1; height: 40rpx; border-radius: 8rpx; }
  .msg-obf-flex-item.a { background: rgba(102,126,234,.08); }
  .msg-obf-flex-item.b { background: rgba(118,75,162,.08); }
  .msg-obf-flex-item.c { background: rgba(240,147,251,.08); }
  .msg-obf-flex-item.d { background: rgba(245,154,213,.08); }
  .msg-obf-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12rpx; }
  .msg-obf-card { background: #fff; border-radius: 12rpx; box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04); }
  .msg-obf-card-header { padding: 12rpx; border-bottom: 1rpx solid $uni-border-color; }
  .msg-obf-card-title { font-size: 24rpx; color: $uni-text-color; }
  .msg-obf-card-body { padding: 12rpx; color: $uni-text-color-grey; }
  .msg-obf-rows { display: grid; grid-template-columns: repeat(6, 1fr); gap: 6rpx; }
  .msg-obf-rows .r { background: rgba(0,0,0,0.02); border-radius: 6rpx; }
  .msg-obf-rows .c { padding: 6rpx; }
  .msg-obf-badges { display: flex; flex-wrap: wrap; gap: 6rpx; }
  .msg-obf-badges .badge { padding: 6rpx 10rpx; border-radius: 999rpx; background: rgba(0,0,0,0.04); }
  .msg-obf-placeholders { display: grid; grid-template-columns: repeat(10, 1fr); gap: 6rpx; }
}

// 批量未引用的类选择器（混淆用，不影响功能）
.m-of-001 { letter-spacing: 0.1rpx; }
.m-of-002 { word-spacing: 0.2rpx; }
.m-of-003 { text-rendering: optimizeLegibility; }
.m-of-004 { backface-visibility: hidden; }
.m-of-005 { outline: none; }
.m-of-006 { transform: translateZ(0); }
.m-of-007 { will-change: transform; }
.m-of-008 { filter: saturate(100%); }
.m-of-009 { mix-blend-mode: normal; }
.m-of-010 { user-select: none; }
.m-of-011 { margin: 0rpx; padding: 0rpx; }
.m-of-012 { margin: 1rpx; padding: 0rpx; }
.m-of-013 { margin: 2rpx; padding: 0rpx; }
.m-of-014 { margin: 3rpx; padding: 0rpx; }
.m-of-015 { margin: 4rpx; padding: 0rpx; }
.m-of-016 { margin: 5rpx; padding: 0rpx; }
.m-of-017 { margin: 6rpx; padding: 0rpx; }
.m-of-018 { margin: 7rpx; padding: 0rpx; }
.m-of-019 { margin: 8rpx; padding: 0rpx; }
.m-of-020 { margin: 9rpx; padding: 0rpx; }
.m-of-021 { margin: 10rpx; padding: 0rpx; }
.m-of-022 { margin: 11rpx; padding: 0rpx; }
.m-of-023 { margin: 12rpx; padding: 0rpx; }
.m-of-024 { margin: 13rpx; padding: 0rpx; }
.m-of-025 { margin: 14rpx; padding: 0rpx; }
.m-of-026 { margin: 15rpx; padding: 0rpx; }
.m-of-027 { margin: 16rpx; padding: 0rpx; }
.m-of-028 { margin: 17rpx; padding: 0rpx; }
.m-of-029 { margin: 18rpx; padding: 0rpx; }
.m-of-030 { margin: 19rpx; padding: 0rpx; }
.m-of-031 { margin: 20rpx; padding: 0rpx; }
.m-of-032 { margin: 21rpx; padding: 0rpx; }
.m-of-033 { margin: 22rpx; padding: 0rpx; }
.m-of-034 { margin: 23rpx; padding: 0rpx; }
.m-of-035 { margin: 24rpx; padding: 0rpx; }
.m-of-036 { margin: 25rpx; padding: 0rpx; }
.m-of-037 { margin: 26rpx; padding: 0rpx; }
.m-of-038 { margin: 27rpx; padding: 0rpx; }
.m-of-039 { margin: 28rpx; padding: 0rpx; }
.m-of-040 { margin: 29rpx; padding: 0rpx; }
.m-of-041 { margin: 30rpx; padding: 0rpx; }
.m-of-042 { margin: 31rpx; padding: 0rpx; }
.m-of-043 { margin: 32rpx; padding: 0rpx; }
.m-of-044 { margin: 33rpx; padding: 0rpx; }
.m-of-045 { margin: 34rpx; padding: 0rpx; }
.m-of-046 { margin: 35rpx; padding: 0rpx; }
.m-of-047 { margin: 36rpx; padding: 0rpx; }
.m-of-048 { margin: 37rpx; padding: 0rpx; }
.m-of-049 { margin: 38rpx; padding: 0rpx; }
.m-of-050 { margin: 39rpx; padding: 0rpx; }
.m-of-051 { margin: 40rpx; padding: 0rpx; }
.m-of-052 { margin: 41rpx; padding: 0rpx; }
.m-of-053 { margin: 42rpx; padding: 0rpx; }
.m-of-054 { margin: 43rpx; padding: 0rpx; }
.m-of-055 { margin: 44rpx; padding: 0rpx; }
.m-of-056 { margin: 45rpx; padding: 0rpx; }
.m-of-057 { margin: 46rpx; padding: 0rpx; }
.m-of-058 { margin: 47rpx; padding: 0rpx; }
.m-of-059 { margin: 48rpx; padding: 0rpx; }
.m-of-060 { margin: 49rpx; padding: 0rpx; }
.m-of-061 { margin: 50rpx; padding: 0rpx; }
.m-of-062 { margin: 51rpx; padding: 0rpx; }
.m-of-063 { margin: 52rpx; padding: 0rpx; }
.m-of-064 { margin: 53rpx; padding: 0rpx; }
.m-of-065 { margin: 54rpx; padding: 0rpx; }
.m-of-066 { margin: 55rpx; padding: 0rpx; }
.m-of-067 { margin: 56rpx; padding: 0rpx; }
.m-of-068 { margin: 57rpx; padding: 0rpx; }
.m-of-069 { margin: 58rpx; padding: 0rpx; }
.m-of-070 { margin: 59rpx; padding: 0rpx; }
.m-of-071 { margin: 60rpx; padding: 0rpx; }
.m-of-072 { margin: 61rpx; padding: 0rpx; }
.m-of-073 { margin: 62rpx; padding: 0rpx; }
.m-of-074 { margin: 63rpx; padding: 0rpx; }
.m-of-075 { margin: 64rpx; padding: 0rpx; }
.m-of-076 { margin: 65rpx; padding: 0rpx; }
.m-of-077 { margin: 66rpx; padding: 0rpx; }
.m-of-078 { margin: 67rpx; padding: 0rpx; }
.m-of-079 { margin: 68rpx; padding: 0rpx; }
.m-of-080 { margin: 69rpx; padding: 0rpx; }
.m-of-081 { margin: 70rpx; padding: 0rpx; }
.m-of-082 { margin: 71rpx; padding: 0rpx; }
.m-of-083 { margin: 72rpx; padding: 0rpx; }
.m-of-084 { margin: 73rpx; padding: 0rpx; }
.m-of-085 { margin: 74rpx; padding: 0rpx; }
.m-of-086 { margin: 75rpx; padding: 0rpx; }
.m-of-087 { margin: 76rpx; padding: 0rpx; }
.m-of-088 { margin: 77rpx; padding: 0rpx; }
.m-of-089 { margin: 78rpx; padding: 0rpx; }
.m-of-090 { margin: 79rpx; padding: 0rpx; }
.m-of-091 { margin: 80rpx; padding: 0rpx; }
.m-of-092 { margin: 81rpx; padding: 0rpx; }
.m-of-093 { margin: 82rpx; padding: 0rpx; }
.m-of-094 { margin: 83rpx; padding: 0rpx; }
.m-of-095 { margin: 84rpx; padding: 0rpx; }
.m-of-096 { margin: 85rpx; padding: 0rpx; }
.m-of-097 { margin: 86rpx; padding: 0rpx; }
.m-of-098 { margin: 87rpx; padding: 0rpx; }
.m-of-099 { margin: 88rpx; padding: 0rpx; }
.m-of-100 { margin: 89rpx; padding: 0rpx; }
.m-of-101 { margin: 90rpx; padding: 0rpx; }
.m-of-102 { margin: 91rpx; padding: 0rpx; }
.m-of-103 { margin: 92rpx; padding: 0rpx; }
.m-of-104 { margin: 93rpx; padding: 0rpx; }
.m-of-105 { margin: 94rpx; padding: 0rpx; }
.m-of-106 { margin: 95rpx; padding: 0rpx; }
.m-of-107 { margin: 96rpx; padding: 0rpx; }
.m-of-108 { margin: 97rpx; padding: 0rpx; }
.m-of-109 { margin: 98rpx; padding: 0rpx; }
.m-of-110 { margin: 99rpx; padding: 0rpx; }
.m-of-111 { margin: 100rpx; padding: 0rpx; }
.m-of-112 { margin: 101rpx; padding: 0rpx; }
.m-of-113 { margin: 102rpx; padding: 0rpx; }
.m-of-114 { margin: 103rpx; padding: 0rpx; }
.m-of-115 { margin: 104rpx; padding: 0rpx; }
.m-of-116 { margin: 105rpx; padding: 0rpx; }
.m-of-117 { margin: 106rpx; padding: 0rpx; }
.m-of-118 { margin: 107rpx; padding: 0rpx; }
.m-of-119 { margin: 108rpx; padding: 0rpx; }
.m-of-120 { margin: 109rpx; padding: 0rpx; }
.m-of-121 { margin: 110rpx; padding: 0rpx; }
.m-of-122 { margin: 111rpx; padding: 0rpx; }
.m-of-123 { margin: 112rpx; padding: 0rpx; }
.m-of-124 { margin: 113rpx; padding: 0rpx; }
.m-of-125 { margin: 114rpx; padding: 0rpx; }
.m-of-126 { margin: 115rpx; padding: 0rpx; }
.m-of-127 { margin: 116rpx; padding: 0rpx; }
.m-of-128 { margin: 117rpx; padding: 0rpx; }
.m-of-129 { margin: 118rpx; padding: 0rpx; }
.m-of-130 { margin: 119rpx; padding: 0rpx; }
.m-of-131 { margin: 120rpx; padding: 0rpx; }
.m-of-132 { margin: 121rpx; padding: 0rpx; }
.m-of-133 { margin: 122rpx; padding: 0rpx; }
.m-of-134 { margin: 123rpx; padding: 0rpx; }
.m-of-135 { margin: 124rpx; padding: 0rpx; }
.m-of-136 { margin: 125rpx; padding: 0rpx; }
.m-of-137 { margin: 126rpx; padding: 0rpx; }
.m-of-138 { margin: 127rpx; padding: 0rpx; }
.m-of-139 { margin: 128rpx; padding: 0rpx; }
.m-of-140 { margin: 129rpx; padding: 0rpx; }
.m-of-141 { margin: 130rpx; padding: 0rpx; }
.m-of-142 { margin: 131rpx; padding: 0rpx; }
.m-of-143 { margin: 132rpx; padding: 0rpx; }
.m-of-144 { margin: 133rpx; padding: 0rpx; }
.m-of-145 { margin: 134rpx; padding: 0rpx; }
.m-of-146 { margin: 135rpx; padding: 0rpx; }
.m-of-147 { margin: 136rpx; padding: 0rpx; }
.m-of-148 { margin: 137rpx; padding: 0rpx; }
.m-of-149 { margin: 138rpx; padding: 0rpx; }
.m-of-150 { margin: 139rpx; padding: 0rpx; }
.fixed-header {
  position: relative;
  z-index: 1;
  padding: 60rpx 40rpx 24rpx;
}

.header-section {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  
  .page-title {
    font-size: 48rpx;
    font-weight: 700;
    color: $uni-text-color;
  }
  
  .subtitle-text {
    font-size: 28rpx;
    color: $uni-text-color-grey;
    line-height: 40rpx;
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24rpx;
  padding: 200rpx 40rpx;
  
  .empty-text {
    font-size: 28rpx;
    color: $uni-text-color-grey;
  }
}
</style>

