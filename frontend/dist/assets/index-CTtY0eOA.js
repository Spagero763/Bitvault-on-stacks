const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/add-Dxve9lAn.js","assets/index-DVeHhRcY.js","assets/index-PEFpkD52.js","assets/index-BHZiwPUu.css","assets/all-wallets-Dh1KtFjE.js","assets/arrow-bottom-circle-Cj9aWafK.js","assets/app-store-CLmOxT_7.js","assets/apple-D8YwP3ZP.js","assets/arrow-bottom-Cy-9jhVW.js","assets/arrow-left-wzaD9JZU.js","assets/arrow-right-AJr0KEql.js","assets/arrow-top-DWWdInUA.js","assets/bank-D6yZLbFE.js","assets/browser-gFvXKtGV.js","assets/bin-BkMGvmOm.js","assets/bitcoin-Cf9nZmjj.js","assets/card-DtuxsD_T.js","assets/checkmark-DIJQILpt.js","assets/checkmark-bold-OWjbLQmg.js","assets/chevron-bottom-CBjkQVeb.js","assets/chevron-left-WfYKEAYS.js","assets/chevron-right-DS3VVNaD.js","assets/chevron-top-BBrNcbmS.js","assets/chrome-store-DFJdR4mg.js","assets/clock-Cb5wum0W.js","assets/close-qc_hjPfb.js","assets/compass-DY_sfw6p.js","assets/coinPlaceholder-Bd9SOhs3.js","assets/copy-DnLuKleD.js","assets/cursor-DWV_c43y.js","assets/cursor-transparent-D6DK0Hqx.js","assets/circle-DYY5Kkoq.js","assets/desktop-CPXSpM8E.js","assets/disconnect-CV5GLUTt.js","assets/discord-CeXLoBUs.js","assets/ethereum-BM0RZkMw.js","assets/etherscan-D3ZTYXqp.js","assets/extension-BEDzbZ51.js","assets/external-link-CcG0IGia.js","assets/facebook-D9cl75Uu.js","assets/farcaster-BM9Bs9mc.js","assets/filters-DcxGUGbE.js","assets/github-Bov3gUG-.js","assets/google-DmBlVq5y.js","assets/help-circle-C8Zj2zLN.js","assets/image-Dk5yx8ID.js","assets/id-CI2MAdWk.js","assets/info-circle-CbejsC1v.js","assets/lightbulb-DsNJ4sa0.js","assets/mail-BCnhFkf3.js","assets/mobile-6BSjjoWu.js","assets/more-DwLxlUhw.js","assets/network-placeholder-DBsYj5RV.js","assets/nftPlaceholder-DUGoUJnI.js","assets/off-BZLTVIzb.js","assets/play-store-BMDW3Yth.js","assets/plus-DPvRsAlX.js","assets/qr-code-B8jCOwjf.js","assets/recycle-horizontal-B7Z5jw6C.js","assets/refresh-C78PX0C8.js","assets/search-Bnd1EEEO.js","assets/send-CoLITu4c.js","assets/swapHorizontal-DaV1kRlV.js","assets/swapHorizontalMedium-cz9OX5b7.js","assets/swapHorizontalBold-DElFYOUH.js","assets/swapHorizontalRoundedBold-BSfw-wx9.js","assets/swapVertical-BcqpU3NO.js","assets/solana-DJWM0AdU.js","assets/telegram-CzKci4qL.js","assets/three-dots-5oI-MrUn.js","assets/twitch-Dofogz7y.js","assets/x-q7Tw57op.js","assets/twitterIcon-DKQQfw_I.js","assets/user-DHQaLuAd.js","assets/verify-D31brB7g.js","assets/verify-filled-CuLAI77R.js","assets/wallet-Do74BKjE.js","assets/walletconnect-vUY1f-Oj.js","assets/wallet-placeholder-BSwg117_.js","assets/warning-circle-D_qrjLT1.js","assets/info-BISiaIcR.js","assets/exclamation-triangle-NlyvZ9s5.js","assets/reown-logo-CIlog7Cl.js","assets/x-mark-CbwEurHp.js"])))=>i.map(i=>d[i]);
import{D as N,F as q,i as b,r as E,a as $,b as f,o as Y,G as V,p as F,e as X}from"./index-DVeHhRcY.js";import{_ as o}from"./index-PEFpkD52.js";const w={getSpacingStyles(t,e){if(Array.isArray(t))return t[e]?`var(--wui-spacing-${t[e]})`:void 0;if(typeof t=="string")return`var(--wui-spacing-${t})`},getFormattedDate(t){return new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric"}).format(t)},getHostName(t){try{return new URL(t).hostname}catch{return""}},getTruncateString({string:t,charsStart:e,charsEnd:i,truncate:r}){return t.length<=e+i?t:r==="end"?`${t.substring(0,e)}...`:r==="start"?`...${t.substring(t.length-i)}`:`${t.substring(0,Math.floor(e))}...${t.substring(t.length-Math.floor(i))}`},generateAvatarColors(t){const i=t.toLowerCase().replace(/^0x/iu,"").replace(/[^a-f0-9]/gu,"").substring(0,6).padEnd(6,"0"),r=this.hexToRgb(i),n=getComputedStyle(document.documentElement).getPropertyValue("--w3m-border-radius-master"),c=100-3*Number(n?.replace("px","")),s=`${c}% ${c}% at 65% 40%`,u=[];for(let h=0;h<5;h+=1){const v=this.tintColor(r,.15*h);u.push(`rgb(${v[0]}, ${v[1]}, ${v[2]})`)}return`
    --local-color-1: ${u[0]};
    --local-color-2: ${u[1]};
    --local-color-3: ${u[2]};
    --local-color-4: ${u[3]};
    --local-color-5: ${u[4]};
    --local-radial-circle: ${s}
   `},hexToRgb(t){const e=parseInt(t,16),i=e>>16&255,r=e>>8&255,n=e&255;return[i,r,n]},tintColor(t,e){const[i,r,n]=t,a=Math.round(i+(255-i)*e),c=Math.round(r+(255-r)*e),s=Math.round(n+(255-n)*e);return[a,c,s]},isNumber(t){return{number:/^[0-9]+$/u}.number.test(t)},getColorTheme(t){return t||(typeof window<"u"&&window.matchMedia&&typeof window.matchMedia=="function"?window.matchMedia("(prefers-color-scheme: dark)")?.matches?"dark":"light":"dark")},splitBalance(t){const e=t.split(".");return e.length===2?[e[0],e[1]]:["0","00"]},roundNumber(t,e,i){return t.toString().length>=e?Number(t).toFixed(i):t},formatNumberToLocalString(t,e=2){return t===void 0?"0.00":typeof t=="number"?t.toLocaleString("en-US",{maximumFractionDigits:e,minimumFractionDigits:e}):parseFloat(t).toLocaleString("en-US",{maximumFractionDigits:e,minimumFractionDigits:e})}};function K(t,e){const{kind:i,elements:r}=e;return{kind:i,elements:r,finisher(n){customElements.get(t)||customElements.define(t,n)}}}function Z(t,e){return customElements.get(t)||customElements.define(t,e),e}function x(t){return function(i){return typeof i=="function"?Z(t,i):K(t,i)}}const Q={attribute:!0,type:String,converter:q,reflect:!1,hasChanged:N},J=(t=Q,e,i)=>{const{kind:r,metadata:n}=i;let a=globalThis.litPropertyMetadata.get(n);if(a===void 0&&globalThis.litPropertyMetadata.set(n,a=new Map),r==="setter"&&((t=Object.create(t)).wrapped=!0),a.set(i.name,t),r==="accessor"){const{name:c}=i;return{set(s){const u=e.get.call(this);e.set.call(this,s),this.requestUpdate(c,u,t,!0,s)},init(s){return s!==void 0&&this.C(c,void 0,t,s),s}}}if(r==="setter"){const{name:c}=i;return function(s){const u=this[c];e.call(this,s),this.requestUpdate(c,u,t,!0,s)}}throw Error("Unsupported decorator location: "+r)};function l(t){return(e,i)=>typeof i=="object"?J(t,e,i):((r,n,a)=>{const c=n.hasOwnProperty(a);return n.constructor.createProperty(a,r),c?Object.getOwnPropertyDescriptor(n,a):void 0})(t,e,i)}function bt(t){return l({...t,state:!0,attribute:!1})}const tt=b`
  :host {
    display: flex;
    width: inherit;
    height: inherit;
  }
`;var _=function(t,e,i,r){var n=arguments.length,a=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,c;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")a=Reflect.decorate(t,e,i,r);else for(var s=t.length-1;s>=0;s--)(c=t[s])&&(a=(n<3?c(a):n>3?c(e,i,a):c(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let d=class extends ${render(){return this.style.cssText=`
      flex-direction: ${this.flexDirection};
      flex-wrap: ${this.flexWrap};
      flex-basis: ${this.flexBasis};
      flex-grow: ${this.flexGrow};
      flex-shrink: ${this.flexShrink};
      align-items: ${this.alignItems};
      justify-content: ${this.justifyContent};
      column-gap: ${this.columnGap&&`var(--wui-spacing-${this.columnGap})`};
      row-gap: ${this.rowGap&&`var(--wui-spacing-${this.rowGap})`};
      gap: ${this.gap&&`var(--wui-spacing-${this.gap})`};
      padding-top: ${this.padding&&w.getSpacingStyles(this.padding,0)};
      padding-right: ${this.padding&&w.getSpacingStyles(this.padding,1)};
      padding-bottom: ${this.padding&&w.getSpacingStyles(this.padding,2)};
      padding-left: ${this.padding&&w.getSpacingStyles(this.padding,3)};
      margin-top: ${this.margin&&w.getSpacingStyles(this.margin,0)};
      margin-right: ${this.margin&&w.getSpacingStyles(this.margin,1)};
      margin-bottom: ${this.margin&&w.getSpacingStyles(this.margin,2)};
      margin-left: ${this.margin&&w.getSpacingStyles(this.margin,3)};
    `,f`<slot></slot>`}};d.styles=[E,tt];_([l()],d.prototype,"flexDirection",void 0);_([l()],d.prototype,"flexWrap",void 0);_([l()],d.prototype,"flexBasis",void 0);_([l()],d.prototype,"flexGrow",void 0);_([l()],d.prototype,"flexShrink",void 0);_([l()],d.prototype,"alignItems",void 0);_([l()],d.prototype,"justifyContent",void 0);_([l()],d.prototype,"columnGap",void 0);_([l()],d.prototype,"rowGap",void 0);_([l()],d.prototype,"gap",void 0);_([l()],d.prototype,"padding",void 0);_([l()],d.prototype,"margin",void 0);d=_([x("wui-flex")],d);const $t=t=>t??Y;const et=t=>t===null||typeof t!="object"&&typeof t!="function",it=t=>t.strings===void 0;const H={ATTRIBUTE:1,CHILD:2},W=t=>(...e)=>({_$litDirective$:t,values:e});let U=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,i,r){this._$Ct=e,this._$AM=i,this._$Ci=r}_$AS(e,i){return this.update(e,i)}update(e,i){return this.render(...i)}};const R=(t,e)=>{const i=t._$AN;if(i===void 0)return!1;for(const r of i)r._$AO?.(e,!1),R(r,e);return!0},L=t=>{let e,i;do{if((e=t._$AM)===void 0)break;i=e._$AN,i.delete(t),t=e}while(i?.size===0)},G=t=>{for(let e;e=t._$AM;t=e){let i=e._$AN;if(i===void 0)e._$AN=i=new Set;else if(i.has(t))break;i.add(t),at(e)}};function rt(t){this._$AN!==void 0?(L(this),this._$AM=t,G(this)):this._$AM=t}function ot(t,e=!1,i=0){const r=this._$AH,n=this._$AN;if(n!==void 0&&n.size!==0)if(e)if(Array.isArray(r))for(let a=i;a<r.length;a++)R(r[a],!1),L(r[a]);else r!=null&&(R(r,!1),L(r));else R(this,t)}const at=t=>{t.type==H.CHILD&&(t._$AP??=ot,t._$AQ??=rt)};class nt extends U{constructor(){super(...arguments),this._$AN=void 0}_$AT(e,i,r){super._$AT(e,i,r),G(this),this.isConnected=e._$AU}_$AO(e,i=!0){e!==this.isConnected&&(this.isConnected=e,e?this.reconnected?.():this.disconnected?.()),i&&(R(this,e),L(this))}setValue(e){if(it(this._$Ct))this._$Ct._$AI(e,this);else{const i=[...this._$Ct._$AH];i[this._$Ci]=e,this._$Ct._$AI(i,this,0)}}disconnected(){}reconnected(){}}class st{constructor(e){this.G=e}disconnect(){this.G=void 0}reconnect(e){this.G=e}deref(){return this.G}}class ct{constructor(){this.Y=void 0,this.Z=void 0}get(){return this.Y}pause(){this.Y??=new Promise(e=>this.Z=e)}resume(){this.Z?.(),this.Y=this.Z=void 0}}const j=t=>!et(t)&&typeof t.then=="function",B=1073741823;class lt extends nt{constructor(){super(...arguments),this._$Cwt=B,this._$Cbt=[],this._$CK=new st(this),this._$CX=new ct}render(...e){return e.find(i=>!j(i))??V}update(e,i){const r=this._$Cbt;let n=r.length;this._$Cbt=i;const a=this._$CK,c=this._$CX;this.isConnected||this.disconnected();for(let s=0;s<i.length&&!(s>this._$Cwt);s++){const u=i[s];if(!j(u))return this._$Cwt=s,u;s<n&&u===r[s]||(this._$Cwt=B,n=0,Promise.resolve(u).then(async h=>{for(;c.get();)await c.get();const v=a.deref();if(v!==void 0){const D=v._$Cbt.indexOf(u);D>-1&&D<v._$Cwt&&(v._$Cwt=D,v.setValue(h))}}))}return V}disconnected(){this._$CK.disconnect(),this._$CX.pause()}reconnected(){this._$CK.reconnect(this),this._$CX.resume()}}const ut=W(lt);class dt{constructor(){this.cache=new Map}set(e,i){this.cache.set(e,i)}get(e){return this.cache.get(e)}has(e){return this.cache.has(e)}delete(e){this.cache.delete(e)}clear(){this.cache.clear()}}const C=new dt,_t=b`
  :host {
    display: flex;
    aspect-ratio: var(--local-aspect-ratio);
    color: var(--local-color);
    width: var(--local-width);
  }

  svg {
    width: inherit;
    height: inherit;
    object-fit: contain;
    object-position: center;
  }

  .fallback {
    width: var(--local-width);
    height: var(--local-height);
  }
`;var A=function(t,e,i,r){var n=arguments.length,a=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,c;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")a=Reflect.decorate(t,e,i,r);else for(var s=t.length-1;s>=0;s--)(c=t[s])&&(a=(n<3?c(a):n>3?c(e,i,a):c(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};const M={add:async()=>(await o(async()=>{const{addSvg:t}=await import("./add-Dxve9lAn.js");return{addSvg:t}},__vite__mapDeps([0,1,2,3]))).addSvg,allWallets:async()=>(await o(async()=>{const{allWalletsSvg:t}=await import("./all-wallets-Dh1KtFjE.js");return{allWalletsSvg:t}},__vite__mapDeps([4,1,2,3]))).allWalletsSvg,arrowBottomCircle:async()=>(await o(async()=>{const{arrowBottomCircleSvg:t}=await import("./arrow-bottom-circle-Cj9aWafK.js");return{arrowBottomCircleSvg:t}},__vite__mapDeps([5,1,2,3]))).arrowBottomCircleSvg,appStore:async()=>(await o(async()=>{const{appStoreSvg:t}=await import("./app-store-CLmOxT_7.js");return{appStoreSvg:t}},__vite__mapDeps([6,1,2,3]))).appStoreSvg,apple:async()=>(await o(async()=>{const{appleSvg:t}=await import("./apple-D8YwP3ZP.js");return{appleSvg:t}},__vite__mapDeps([7,1,2,3]))).appleSvg,arrowBottom:async()=>(await o(async()=>{const{arrowBottomSvg:t}=await import("./arrow-bottom-Cy-9jhVW.js");return{arrowBottomSvg:t}},__vite__mapDeps([8,1,2,3]))).arrowBottomSvg,arrowLeft:async()=>(await o(async()=>{const{arrowLeftSvg:t}=await import("./arrow-left-wzaD9JZU.js");return{arrowLeftSvg:t}},__vite__mapDeps([9,1,2,3]))).arrowLeftSvg,arrowRight:async()=>(await o(async()=>{const{arrowRightSvg:t}=await import("./arrow-right-AJr0KEql.js");return{arrowRightSvg:t}},__vite__mapDeps([10,1,2,3]))).arrowRightSvg,arrowTop:async()=>(await o(async()=>{const{arrowTopSvg:t}=await import("./arrow-top-DWWdInUA.js");return{arrowTopSvg:t}},__vite__mapDeps([11,1,2,3]))).arrowTopSvg,bank:async()=>(await o(async()=>{const{bankSvg:t}=await import("./bank-D6yZLbFE.js");return{bankSvg:t}},__vite__mapDeps([12,1,2,3]))).bankSvg,browser:async()=>(await o(async()=>{const{browserSvg:t}=await import("./browser-gFvXKtGV.js");return{browserSvg:t}},__vite__mapDeps([13,1,2,3]))).browserSvg,bin:async()=>(await o(async()=>{const{binSvg:t}=await import("./bin-BkMGvmOm.js");return{binSvg:t}},__vite__mapDeps([14,1,2,3]))).binSvg,bitcoin:async()=>(await o(async()=>{const{bitcoinSvg:t}=await import("./bitcoin-Cf9nZmjj.js");return{bitcoinSvg:t}},__vite__mapDeps([15,1,2,3]))).bitcoinSvg,card:async()=>(await o(async()=>{const{cardSvg:t}=await import("./card-DtuxsD_T.js");return{cardSvg:t}},__vite__mapDeps([16,1,2,3]))).cardSvg,checkmark:async()=>(await o(async()=>{const{checkmarkSvg:t}=await import("./checkmark-DIJQILpt.js");return{checkmarkSvg:t}},__vite__mapDeps([17,1,2,3]))).checkmarkSvg,checkmarkBold:async()=>(await o(async()=>{const{checkmarkBoldSvg:t}=await import("./checkmark-bold-OWjbLQmg.js");return{checkmarkBoldSvg:t}},__vite__mapDeps([18,1,2,3]))).checkmarkBoldSvg,chevronBottom:async()=>(await o(async()=>{const{chevronBottomSvg:t}=await import("./chevron-bottom-CBjkQVeb.js");return{chevronBottomSvg:t}},__vite__mapDeps([19,1,2,3]))).chevronBottomSvg,chevronLeft:async()=>(await o(async()=>{const{chevronLeftSvg:t}=await import("./chevron-left-WfYKEAYS.js");return{chevronLeftSvg:t}},__vite__mapDeps([20,1,2,3]))).chevronLeftSvg,chevronRight:async()=>(await o(async()=>{const{chevronRightSvg:t}=await import("./chevron-right-DS3VVNaD.js");return{chevronRightSvg:t}},__vite__mapDeps([21,1,2,3]))).chevronRightSvg,chevronTop:async()=>(await o(async()=>{const{chevronTopSvg:t}=await import("./chevron-top-BBrNcbmS.js");return{chevronTopSvg:t}},__vite__mapDeps([22,1,2,3]))).chevronTopSvg,chromeStore:async()=>(await o(async()=>{const{chromeStoreSvg:t}=await import("./chrome-store-DFJdR4mg.js");return{chromeStoreSvg:t}},__vite__mapDeps([23,1,2,3]))).chromeStoreSvg,clock:async()=>(await o(async()=>{const{clockSvg:t}=await import("./clock-Cb5wum0W.js");return{clockSvg:t}},__vite__mapDeps([24,1,2,3]))).clockSvg,close:async()=>(await o(async()=>{const{closeSvg:t}=await import("./close-qc_hjPfb.js");return{closeSvg:t}},__vite__mapDeps([25,1,2,3]))).closeSvg,compass:async()=>(await o(async()=>{const{compassSvg:t}=await import("./compass-DY_sfw6p.js");return{compassSvg:t}},__vite__mapDeps([26,1,2,3]))).compassSvg,coinPlaceholder:async()=>(await o(async()=>{const{coinPlaceholderSvg:t}=await import("./coinPlaceholder-Bd9SOhs3.js");return{coinPlaceholderSvg:t}},__vite__mapDeps([27,1,2,3]))).coinPlaceholderSvg,copy:async()=>(await o(async()=>{const{copySvg:t}=await import("./copy-DnLuKleD.js");return{copySvg:t}},__vite__mapDeps([28,1,2,3]))).copySvg,cursor:async()=>(await o(async()=>{const{cursorSvg:t}=await import("./cursor-DWV_c43y.js");return{cursorSvg:t}},__vite__mapDeps([29,1,2,3]))).cursorSvg,cursorTransparent:async()=>(await o(async()=>{const{cursorTransparentSvg:t}=await import("./cursor-transparent-D6DK0Hqx.js");return{cursorTransparentSvg:t}},__vite__mapDeps([30,1,2,3]))).cursorTransparentSvg,circle:async()=>(await o(async()=>{const{circleSvg:t}=await import("./circle-DYY5Kkoq.js");return{circleSvg:t}},__vite__mapDeps([31,1,2,3]))).circleSvg,desktop:async()=>(await o(async()=>{const{desktopSvg:t}=await import("./desktop-CPXSpM8E.js");return{desktopSvg:t}},__vite__mapDeps([32,1,2,3]))).desktopSvg,disconnect:async()=>(await o(async()=>{const{disconnectSvg:t}=await import("./disconnect-CV5GLUTt.js");return{disconnectSvg:t}},__vite__mapDeps([33,1,2,3]))).disconnectSvg,discord:async()=>(await o(async()=>{const{discordSvg:t}=await import("./discord-CeXLoBUs.js");return{discordSvg:t}},__vite__mapDeps([34,1,2,3]))).discordSvg,ethereum:async()=>(await o(async()=>{const{ethereumSvg:t}=await import("./ethereum-BM0RZkMw.js");return{ethereumSvg:t}},__vite__mapDeps([35,1,2,3]))).ethereumSvg,etherscan:async()=>(await o(async()=>{const{etherscanSvg:t}=await import("./etherscan-D3ZTYXqp.js");return{etherscanSvg:t}},__vite__mapDeps([36,1,2,3]))).etherscanSvg,extension:async()=>(await o(async()=>{const{extensionSvg:t}=await import("./extension-BEDzbZ51.js");return{extensionSvg:t}},__vite__mapDeps([37,1,2,3]))).extensionSvg,externalLink:async()=>(await o(async()=>{const{externalLinkSvg:t}=await import("./external-link-CcG0IGia.js");return{externalLinkSvg:t}},__vite__mapDeps([38,1,2,3]))).externalLinkSvg,facebook:async()=>(await o(async()=>{const{facebookSvg:t}=await import("./facebook-D9cl75Uu.js");return{facebookSvg:t}},__vite__mapDeps([39,1,2,3]))).facebookSvg,farcaster:async()=>(await o(async()=>{const{farcasterSvg:t}=await import("./farcaster-BM9Bs9mc.js");return{farcasterSvg:t}},__vite__mapDeps([40,1,2,3]))).farcasterSvg,filters:async()=>(await o(async()=>{const{filtersSvg:t}=await import("./filters-DcxGUGbE.js");return{filtersSvg:t}},__vite__mapDeps([41,1,2,3]))).filtersSvg,github:async()=>(await o(async()=>{const{githubSvg:t}=await import("./github-Bov3gUG-.js");return{githubSvg:t}},__vite__mapDeps([42,1,2,3]))).githubSvg,google:async()=>(await o(async()=>{const{googleSvg:t}=await import("./google-DmBlVq5y.js");return{googleSvg:t}},__vite__mapDeps([43,1,2,3]))).googleSvg,helpCircle:async()=>(await o(async()=>{const{helpCircleSvg:t}=await import("./help-circle-C8Zj2zLN.js");return{helpCircleSvg:t}},__vite__mapDeps([44,1,2,3]))).helpCircleSvg,image:async()=>(await o(async()=>{const{imageSvg:t}=await import("./image-Dk5yx8ID.js");return{imageSvg:t}},__vite__mapDeps([45,1,2,3]))).imageSvg,id:async()=>(await o(async()=>{const{idSvg:t}=await import("./id-CI2MAdWk.js");return{idSvg:t}},__vite__mapDeps([46,1,2,3]))).idSvg,infoCircle:async()=>(await o(async()=>{const{infoCircleSvg:t}=await import("./info-circle-CbejsC1v.js");return{infoCircleSvg:t}},__vite__mapDeps([47,1,2,3]))).infoCircleSvg,lightbulb:async()=>(await o(async()=>{const{lightbulbSvg:t}=await import("./lightbulb-DsNJ4sa0.js");return{lightbulbSvg:t}},__vite__mapDeps([48,1,2,3]))).lightbulbSvg,mail:async()=>(await o(async()=>{const{mailSvg:t}=await import("./mail-BCnhFkf3.js");return{mailSvg:t}},__vite__mapDeps([49,1,2,3]))).mailSvg,mobile:async()=>(await o(async()=>{const{mobileSvg:t}=await import("./mobile-6BSjjoWu.js");return{mobileSvg:t}},__vite__mapDeps([50,1,2,3]))).mobileSvg,more:async()=>(await o(async()=>{const{moreSvg:t}=await import("./more-DwLxlUhw.js");return{moreSvg:t}},__vite__mapDeps([51,1,2,3]))).moreSvg,networkPlaceholder:async()=>(await o(async()=>{const{networkPlaceholderSvg:t}=await import("./network-placeholder-DBsYj5RV.js");return{networkPlaceholderSvg:t}},__vite__mapDeps([52,1,2,3]))).networkPlaceholderSvg,nftPlaceholder:async()=>(await o(async()=>{const{nftPlaceholderSvg:t}=await import("./nftPlaceholder-DUGoUJnI.js");return{nftPlaceholderSvg:t}},__vite__mapDeps([53,1,2,3]))).nftPlaceholderSvg,off:async()=>(await o(async()=>{const{offSvg:t}=await import("./off-BZLTVIzb.js");return{offSvg:t}},__vite__mapDeps([54,1,2,3]))).offSvg,playStore:async()=>(await o(async()=>{const{playStoreSvg:t}=await import("./play-store-BMDW3Yth.js");return{playStoreSvg:t}},__vite__mapDeps([55,1,2,3]))).playStoreSvg,plus:async()=>(await o(async()=>{const{plusSvg:t}=await import("./plus-DPvRsAlX.js");return{plusSvg:t}},__vite__mapDeps([56,1,2,3]))).plusSvg,qrCode:async()=>(await o(async()=>{const{qrCodeIcon:t}=await import("./qr-code-B8jCOwjf.js");return{qrCodeIcon:t}},__vite__mapDeps([57,1,2,3]))).qrCodeIcon,recycleHorizontal:async()=>(await o(async()=>{const{recycleHorizontalSvg:t}=await import("./recycle-horizontal-B7Z5jw6C.js");return{recycleHorizontalSvg:t}},__vite__mapDeps([58,1,2,3]))).recycleHorizontalSvg,refresh:async()=>(await o(async()=>{const{refreshSvg:t}=await import("./refresh-C78PX0C8.js");return{refreshSvg:t}},__vite__mapDeps([59,1,2,3]))).refreshSvg,search:async()=>(await o(async()=>{const{searchSvg:t}=await import("./search-Bnd1EEEO.js");return{searchSvg:t}},__vite__mapDeps([60,1,2,3]))).searchSvg,send:async()=>(await o(async()=>{const{sendSvg:t}=await import("./send-CoLITu4c.js");return{sendSvg:t}},__vite__mapDeps([61,1,2,3]))).sendSvg,swapHorizontal:async()=>(await o(async()=>{const{swapHorizontalSvg:t}=await import("./swapHorizontal-DaV1kRlV.js");return{swapHorizontalSvg:t}},__vite__mapDeps([62,1,2,3]))).swapHorizontalSvg,swapHorizontalMedium:async()=>(await o(async()=>{const{swapHorizontalMediumSvg:t}=await import("./swapHorizontalMedium-cz9OX5b7.js");return{swapHorizontalMediumSvg:t}},__vite__mapDeps([63,1,2,3]))).swapHorizontalMediumSvg,swapHorizontalBold:async()=>(await o(async()=>{const{swapHorizontalBoldSvg:t}=await import("./swapHorizontalBold-DElFYOUH.js");return{swapHorizontalBoldSvg:t}},__vite__mapDeps([64,1,2,3]))).swapHorizontalBoldSvg,swapHorizontalRoundedBold:async()=>(await o(async()=>{const{swapHorizontalRoundedBoldSvg:t}=await import("./swapHorizontalRoundedBold-BSfw-wx9.js");return{swapHorizontalRoundedBoldSvg:t}},__vite__mapDeps([65,1,2,3]))).swapHorizontalRoundedBoldSvg,swapVertical:async()=>(await o(async()=>{const{swapVerticalSvg:t}=await import("./swapVertical-BcqpU3NO.js");return{swapVerticalSvg:t}},__vite__mapDeps([66,1,2,3]))).swapVerticalSvg,solana:async()=>(await o(async()=>{const{solanaSvg:t}=await import("./solana-DJWM0AdU.js");return{solanaSvg:t}},__vite__mapDeps([67,1,2,3]))).solanaSvg,telegram:async()=>(await o(async()=>{const{telegramSvg:t}=await import("./telegram-CzKci4qL.js");return{telegramSvg:t}},__vite__mapDeps([68,1,2,3]))).telegramSvg,threeDots:async()=>(await o(async()=>{const{threeDotsSvg:t}=await import("./three-dots-5oI-MrUn.js");return{threeDotsSvg:t}},__vite__mapDeps([69,1,2,3]))).threeDotsSvg,twitch:async()=>(await o(async()=>{const{twitchSvg:t}=await import("./twitch-Dofogz7y.js");return{twitchSvg:t}},__vite__mapDeps([70,1,2,3]))).twitchSvg,twitter:async()=>(await o(async()=>{const{xSvg:t}=await import("./x-q7Tw57op.js");return{xSvg:t}},__vite__mapDeps([71,1,2,3]))).xSvg,twitterIcon:async()=>(await o(async()=>{const{twitterIconSvg:t}=await import("./twitterIcon-DKQQfw_I.js");return{twitterIconSvg:t}},__vite__mapDeps([72,1,2,3]))).twitterIconSvg,user:async()=>(await o(async()=>{const{userSvg:t}=await import("./user-DHQaLuAd.js");return{userSvg:t}},__vite__mapDeps([73,1,2,3]))).userSvg,verify:async()=>(await o(async()=>{const{verifySvg:t}=await import("./verify-D31brB7g.js");return{verifySvg:t}},__vite__mapDeps([74,1,2,3]))).verifySvg,verifyFilled:async()=>(await o(async()=>{const{verifyFilledSvg:t}=await import("./verify-filled-CuLAI77R.js");return{verifyFilledSvg:t}},__vite__mapDeps([75,1,2,3]))).verifyFilledSvg,wallet:async()=>(await o(async()=>{const{walletSvg:t}=await import("./wallet-Do74BKjE.js");return{walletSvg:t}},__vite__mapDeps([76,1,2,3]))).walletSvg,walletConnect:async()=>(await o(async()=>{const{walletConnectSvg:t}=await import("./walletconnect-vUY1f-Oj.js");return{walletConnectSvg:t}},__vite__mapDeps([77,1,2,3]))).walletConnectSvg,walletConnectLightBrown:async()=>(await o(async()=>{const{walletConnectLightBrownSvg:t}=await import("./walletconnect-vUY1f-Oj.js");return{walletConnectLightBrownSvg:t}},__vite__mapDeps([77,1,2,3]))).walletConnectLightBrownSvg,walletConnectBrown:async()=>(await o(async()=>{const{walletConnectBrownSvg:t}=await import("./walletconnect-vUY1f-Oj.js");return{walletConnectBrownSvg:t}},__vite__mapDeps([77,1,2,3]))).walletConnectBrownSvg,walletPlaceholder:async()=>(await o(async()=>{const{walletPlaceholderSvg:t}=await import("./wallet-placeholder-BSwg117_.js");return{walletPlaceholderSvg:t}},__vite__mapDeps([78,1,2,3]))).walletPlaceholderSvg,warningCircle:async()=>(await o(async()=>{const{warningCircleSvg:t}=await import("./warning-circle-D_qrjLT1.js");return{warningCircleSvg:t}},__vite__mapDeps([79,1,2,3]))).warningCircleSvg,x:async()=>(await o(async()=>{const{xSvg:t}=await import("./x-q7Tw57op.js");return{xSvg:t}},__vite__mapDeps([71,1,2,3]))).xSvg,info:async()=>(await o(async()=>{const{infoSvg:t}=await import("./info-BISiaIcR.js");return{infoSvg:t}},__vite__mapDeps([80,1,2,3]))).infoSvg,exclamationTriangle:async()=>(await o(async()=>{const{exclamationTriangleSvg:t}=await import("./exclamation-triangle-NlyvZ9s5.js");return{exclamationTriangleSvg:t}},__vite__mapDeps([81,1,2,3]))).exclamationTriangleSvg,reown:async()=>(await o(async()=>{const{reownSvg:t}=await import("./reown-logo-CIlog7Cl.js");return{reownSvg:t}},__vite__mapDeps([82,1,2,3]))).reownSvg,"x-mark":async()=>(await o(async()=>{const{xMarkSvg:t}=await import("./x-mark-CbwEurHp.js");return{xMarkSvg:t}},__vite__mapDeps([83,1,2,3]))).xMarkSvg};async function gt(t){if(C.has(t))return C.get(t);const i=(M[t]??M.copy)();return C.set(t,i),i}let m=class extends ${constructor(){super(...arguments),this.size="md",this.name="copy",this.color="fg-300",this.aspectRatio="1 / 1"}render(){return this.style.cssText=`
      --local-color: ${`var(--wui-color-${this.color});`}
      --local-width: ${`var(--wui-icon-size-${this.size});`}
      --local-aspect-ratio: ${this.aspectRatio}
    `,f`${ut(gt(this.name),f`<div class="fallback"></div>`)}`}};m.styles=[E,F,_t];A([l()],m.prototype,"size",void 0);A([l()],m.prototype,"name",void 0);A([l()],m.prototype,"color",void 0);A([l()],m.prototype,"aspectRatio",void 0);m=A([x("wui-icon")],m);const ht=W(class extends U{constructor(t){if(super(t),t.type!==H.ATTRIBUTE||t.name!=="class"||t.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter(e=>t[e]).join(" ")+" "}update(t,[e]){if(this.st===void 0){this.st=new Set,t.strings!==void 0&&(this.nt=new Set(t.strings.join(" ").split(/\s/).filter(r=>r!=="")));for(const r in e)e[r]&&!this.nt?.has(r)&&this.st.add(r);return this.render(e)}const i=t.element.classList;for(const r of this.st)r in e||(i.remove(r),this.st.delete(r));for(const r in e){const n=!!e[r];n===this.st.has(r)||this.nt?.has(r)||(n?(i.add(r),this.st.add(r)):(i.remove(r),this.st.delete(r)))}return V}}),vt=b`
  :host {
    display: inline-flex !important;
  }

  slot {
    width: 100%;
    display: inline-block;
    font-style: normal;
    font-family: var(--wui-font-family);
    font-feature-settings:
      'tnum' on,
      'lnum' on,
      'case' on;
    line-height: 130%;
    font-weight: var(--wui-font-weight-regular);
    overflow: inherit;
    text-overflow: inherit;
    text-align: var(--local-align);
    color: var(--local-color);
  }

  .wui-line-clamp-1 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }

  .wui-line-clamp-2 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .wui-font-medium-400 {
    font-size: var(--wui-font-size-medium);
    font-weight: var(--wui-font-weight-light);
    letter-spacing: var(--wui-letter-spacing-medium);
  }

  .wui-font-medium-600 {
    font-size: var(--wui-font-size-medium);
    letter-spacing: var(--wui-letter-spacing-medium);
  }

  .wui-font-title-600 {
    font-size: var(--wui-font-size-title);
    letter-spacing: var(--wui-letter-spacing-title);
  }

  .wui-font-title-6-600 {
    font-size: var(--wui-font-size-title-6);
    letter-spacing: var(--wui-letter-spacing-title-6);
  }

  .wui-font-mini-700 {
    font-size: var(--wui-font-size-mini);
    letter-spacing: var(--wui-letter-spacing-mini);
    text-transform: uppercase;
  }

  .wui-font-large-500,
  .wui-font-large-600,
  .wui-font-large-700 {
    font-size: var(--wui-font-size-large);
    letter-spacing: var(--wui-letter-spacing-large);
  }

  .wui-font-2xl-500,
  .wui-font-2xl-600,
  .wui-font-2xl-700 {
    font-size: var(--wui-font-size-2xl);
    letter-spacing: var(--wui-letter-spacing-2xl);
  }

  .wui-font-paragraph-400,
  .wui-font-paragraph-500,
  .wui-font-paragraph-600,
  .wui-font-paragraph-700 {
    font-size: var(--wui-font-size-paragraph);
    letter-spacing: var(--wui-letter-spacing-paragraph);
  }

  .wui-font-small-400,
  .wui-font-small-500,
  .wui-font-small-600 {
    font-size: var(--wui-font-size-small);
    letter-spacing: var(--wui-letter-spacing-small);
  }

  .wui-font-tiny-400,
  .wui-font-tiny-500,
  .wui-font-tiny-600 {
    font-size: var(--wui-font-size-tiny);
    letter-spacing: var(--wui-letter-spacing-tiny);
  }

  .wui-font-micro-700,
  .wui-font-micro-600,
  .wui-font-micro-500 {
    font-size: var(--wui-font-size-micro);
    letter-spacing: var(--wui-letter-spacing-micro);
    text-transform: uppercase;
  }

  .wui-font-tiny-400,
  .wui-font-small-400,
  .wui-font-medium-400,
  .wui-font-paragraph-400 {
    font-weight: var(--wui-font-weight-light);
  }

  .wui-font-large-700,
  .wui-font-paragraph-700,
  .wui-font-micro-700,
  .wui-font-mini-700 {
    font-weight: var(--wui-font-weight-bold);
  }

  .wui-font-medium-600,
  .wui-font-medium-title-600,
  .wui-font-title-6-600,
  .wui-font-large-600,
  .wui-font-paragraph-600,
  .wui-font-small-600,
  .wui-font-tiny-600,
  .wui-font-micro-600 {
    font-weight: var(--wui-font-weight-medium);
  }

  :host([disabled]) {
    opacity: 0.4;
  }
`;var O=function(t,e,i,r){var n=arguments.length,a=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,c;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")a=Reflect.decorate(t,e,i,r);else for(var s=t.length-1;s>=0;s--)(c=t[s])&&(a=(n<3?c(a):n>3?c(e,i,a):c(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let y=class extends ${constructor(){super(...arguments),this.variant="paragraph-500",this.color="fg-300",this.align="left",this.lineClamp=void 0}render(){const e={[`wui-font-${this.variant}`]:!0,[`wui-color-${this.color}`]:!0,[`wui-line-clamp-${this.lineClamp}`]:!!this.lineClamp};return this.style.cssText=`
      --local-align: ${this.align};
      --local-color: var(--wui-color-${this.color});
    `,f`<slot class=${ht(e)}></slot>`}};y.styles=[E,vt];O([l()],y.prototype,"variant",void 0);O([l()],y.prototype,"color",void 0);O([l()],y.prototype,"align",void 0);O([l()],y.prototype,"lineClamp",void 0);y=O([x("wui-text")],y);const pt=b`
  :host {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;
    background-color: var(--wui-color-gray-glass-020);
    border-radius: var(--local-border-radius);
    border: var(--local-border);
    box-sizing: content-box;
    width: var(--local-size);
    height: var(--local-size);
    min-height: var(--local-size);
    min-width: var(--local-size);
  }

  @supports (background: color-mix(in srgb, white 50%, black)) {
    :host {
      background-color: color-mix(in srgb, var(--local-bg-value) var(--local-bg-mix), transparent);
    }
  }
`;var p=function(t,e,i,r){var n=arguments.length,a=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,c;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")a=Reflect.decorate(t,e,i,r);else for(var s=t.length-1;s>=0;s--)(c=t[s])&&(a=(n<3?c(a):n>3?c(e,i,a):c(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let g=class extends ${constructor(){super(...arguments),this.size="md",this.backgroundColor="accent-100",this.iconColor="accent-100",this.background="transparent",this.border=!1,this.borderColor="wui-color-bg-125",this.icon="copy"}render(){const e=this.iconSize||this.size,i=this.size==="lg",r=this.size==="xl",n=i?"12%":"16%",a=i?"xxs":r?"s":"3xl",c=this.background==="gray",s=this.background==="opaque",u=this.backgroundColor==="accent-100"&&s||this.backgroundColor==="success-100"&&s||this.backgroundColor==="error-100"&&s||this.backgroundColor==="inverse-100"&&s;let h=`var(--wui-color-${this.backgroundColor})`;return u?h=`var(--wui-icon-box-bg-${this.backgroundColor})`:c&&(h=`var(--wui-color-gray-${this.backgroundColor})`),this.style.cssText=`
       --local-bg-value: ${h};
       --local-bg-mix: ${u||c?"100%":n};
       --local-border-radius: var(--wui-border-radius-${a});
       --local-size: var(--wui-icon-box-size-${this.size});
       --local-border: ${this.borderColor==="wui-color-bg-125"?"2px":"1px"} solid ${this.border?`var(--${this.borderColor})`:"transparent"}
   `,f` <wui-icon color=${this.iconColor} size=${e} name=${this.icon}></wui-icon> `}};g.styles=[E,X,pt];p([l()],g.prototype,"size",void 0);p([l()],g.prototype,"backgroundColor",void 0);p([l()],g.prototype,"iconColor",void 0);p([l()],g.prototype,"iconSize",void 0);p([l()],g.prototype,"background",void 0);p([l({type:Boolean})],g.prototype,"border",void 0);p([l()],g.prototype,"borderColor",void 0);p([l()],g.prototype,"icon",void 0);g=p([x("wui-icon-box")],g);const wt=b`
  :host {
    display: block;
    width: var(--local-width);
    height: var(--local-height);
  }

  :host([data-object-fit='cover']) img {
    object-fit: cover;
    object-position: center center;
  }

  :host([data-object-fit='contain']) img {
    object-fit: contain;
    object-position: center center;
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: inherit;
  }
`;var I=function(t,e,i,r){var n=arguments.length,a=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,c;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")a=Reflect.decorate(t,e,i,r);else for(var s=t.length-1;s>=0;s--)(c=t[s])&&(a=(n<3?c(a):n>3?c(e,i,a):c(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let S=class extends ${constructor(){super(...arguments),this.src="./path/to/image.jpg",this.alt="Image",this.size=void 0,this.objectFit="cover"}render(){return this.objectFit&&(this.dataset.objectFit=this.objectFit),this.style.cssText=`
      --local-width: ${this.size?`var(--wui-icon-size-${this.size});`:"100%"};
      --local-height: ${this.size?`var(--wui-icon-size-${this.size});`:"100%"};
      `,f`<img src=${this.src} alt=${this.alt} @error=${this.handleImageError} />`}handleImageError(){this.dispatchEvent(new CustomEvent("onLoadError",{bubbles:!0,composed:!0}))}};S.styles=[E,F,wt];I([l()],S.prototype,"src",void 0);I([l()],S.prototype,"alt",void 0);I([l()],S.prototype,"size",void 0);I([l()],S.prototype,"objectFit",void 0);S=I([x("wui-image")],S);const ft=b`
  :host {
    display: flex;
    justify-content: center;
    align-items: center;
    height: var(--wui-spacing-m);
    padding: 0 var(--wui-spacing-3xs) !important;
    border-radius: var(--wui-border-radius-5xs);
    transition:
      border-radius var(--wui-duration-lg) var(--wui-ease-out-power-1),
      background-color var(--wui-duration-lg) var(--wui-ease-out-power-1);
    will-change: border-radius, background-color;
  }

  :host > wui-text {
    transform: translateY(5%);
  }

  :host([data-variant='main']) {
    background-color: var(--wui-color-accent-glass-015);
    color: var(--wui-color-accent-100);
  }

  :host([data-variant='shade']) {
    background-color: var(--wui-color-gray-glass-010);
    color: var(--wui-color-fg-200);
  }

  :host([data-variant='success']) {
    background-color: var(--wui-icon-box-bg-success-100);
    color: var(--wui-color-success-100);
  }

  :host([data-variant='error']) {
    background-color: var(--wui-icon-box-bg-error-100);
    color: var(--wui-color-error-100);
  }

  :host([data-size='lg']) {
    padding: 11px 5px !important;
  }

  :host([data-size='lg']) > wui-text {
    transform: translateY(2%);
  }

  :host([data-size='xs']) {
    height: var(--wui-spacing-2l);
    padding: 0 var(--wui-spacing-3xs) !important;
  }

  :host([data-size='xs']) > wui-text {
    transform: translateY(2%);
  }
`;var z=function(t,e,i,r){var n=arguments.length,a=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,c;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")a=Reflect.decorate(t,e,i,r);else for(var s=t.length-1;s>=0;s--)(c=t[s])&&(a=(n<3?c(a):n>3?c(e,i,a):c(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let T=class extends ${constructor(){super(...arguments),this.variant="main",this.size="lg"}render(){this.dataset.variant=this.variant,this.dataset.size=this.size;const e=this.size==="md"||this.size==="xs"?"mini-700":"micro-700";return f`
      <wui-text data-variant=${this.variant} variant=${e} color="inherit">
        <slot></slot>
      </wui-text>
    `}};T.styles=[E,ft];z([l()],T.prototype,"variant",void 0);z([l()],T.prototype,"size",void 0);T=z([x("wui-tag")],T);const mt=b`
  :host {
    display: flex;
  }

  :host([data-size='sm']) > svg {
    width: 12px;
    height: 12px;
  }

  :host([data-size='md']) > svg {
    width: 16px;
    height: 16px;
  }

  :host([data-size='lg']) > svg {
    width: 24px;
    height: 24px;
  }

  :host([data-size='xl']) > svg {
    width: 32px;
    height: 32px;
  }

  svg {
    animation: rotate 2s linear infinite;
  }

  circle {
    fill: none;
    stroke: var(--local-color);
    stroke-width: 4px;
    stroke-dasharray: 1, 124;
    stroke-dashoffset: 0;
    stroke-linecap: round;
    animation: dash 1.5s ease-in-out infinite;
  }

  :host([data-size='md']) > svg > circle {
    stroke-width: 6px;
  }

  :host([data-size='sm']) > svg > circle {
    stroke-width: 8px;
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes dash {
    0% {
      stroke-dasharray: 1, 124;
      stroke-dashoffset: 0;
    }

    50% {
      stroke-dasharray: 90, 124;
      stroke-dashoffset: -35;
    }

    100% {
      stroke-dashoffset: -125;
    }
  }
`;var k=function(t,e,i,r){var n=arguments.length,a=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,c;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")a=Reflect.decorate(t,e,i,r);else for(var s=t.length-1;s>=0;s--)(c=t[s])&&(a=(n<3?c(a):n>3?c(e,i,a):c(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a};let P=class extends ${constructor(){super(...arguments),this.color="accent-100",this.size="lg"}render(){return this.style.cssText=`--local-color: ${this.color==="inherit"?"inherit":`var(--wui-color-${this.color})`}`,this.dataset.size=this.size,f`<svg viewBox="25 25 50 50">
      <circle r="20" cy="50" cx="50"></circle>
    </svg>`}};P.styles=[E,mt];k([l()],P.prototype,"color",void 0);k([l()],P.prototype,"size",void 0);P=k([x("wui-loading-spinner")],P);export{w as U,ht as a,x as c,W as e,nt as f,l as n,$t as o,bt as r};
