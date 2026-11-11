var U=Object.defineProperty;var z=(t,a,s)=>a in t?U(t,a,{enumerable:!0,configurable:!0,writable:!0,value:s}):t[a]=s;var R=(t,a,s)=>z(t,typeof a!="symbol"?a+"":a,s);import{g as l,s as G}from"./index-DvNSArQD.js";import{f as e,d as f,a as p,c as L,b as D}from"./formatters-DZFqxeCc.js";const H=[{min:0,max:1412,rate:.075},{min:1412,max:2666.68,rate:.09},{min:2666.68,max:4000.03,rate:.12},{min:4000.03,max:7786.02,rate:.14}],W=7786.02,J=908.86;function K(t){if(t<=0)return{inssDiscount:0,inssEffectiveRate:0};const a=Math.min(t,W);let s=0;for(const d of H)if(a>d.min){const c=Math.min(a,d.max)-d.min;s+=c*d.rate}const r=+Math.min(s,J).toFixed(2),u=+(t>0?r/t*100:0).toFixed(2);return{inssDiscount:r,inssEffectiveRate:u}}const _=189.59,S=[{faixaIndex:1,label:"Até R$ 2.428,80",min:0,max:2428.8,aliquota:0,deducao:0},{faixaIndex:2,label:"De R$ 2.428,81 até R$ 2.826,65",min:2428.8,max:2826.65,aliquota:7.5,deducao:182.16},{faixaIndex:3,label:"De R$ 2.826,66 até R$ 3.751,05",min:2826.65,max:3751.05,aliquota:15,deducao:394.16},{faixaIndex:4,label:"De R$ 3.751,06 até R$ 4.664,68",min:3751.05,max:4664.68,aliquota:22.5,deducao:675.49},{faixaIndex:5,label:"Acima de R$ 4.664,68",min:4664.68,max:1/0,aliquota:27.5,deducao:908.73}];function Q(t){return t<=2428.8?S[0]:t<=2826.65?S[1]:t<=3751.05?S[2]:t<=4664.68?S[3]:S[4]}function X(t){const a=Math.max(0,t.grossSalary),s=Math.max(0,Math.floor(t.dependentsCount||0)),r=Math.max(0,t.educationExpenses||0),u=Math.max(0,t.alimonyExpenses||0),d=Math.max(0,t.medicalExpenses||0),{inssDiscount:c,inssEffectiveRate:E}=K(a),h=+(s*_).toFixed(2),v=+(c+h+u+d+r).toFixed(2),m=Math.max(0,+(a-v).toFixed(2)),g=Q(m),x=g.aliquota,y=g.deducao;let i=0;x>0&&m>0&&(i=m*(x/100)-y,i=Math.max(0,+i.toFixed(2)));const n=a>0&&i>0?+(i/a*100).toFixed(2):0,O=+(c+i).toFixed(2),j=Math.max(0,+(a-O).toFixed(2));return{input:t,grossSalary:a,inssDiscount:c,inssEffectiveRate:E,dependentsCount:s,dependentsDeduction:h,alimonyExpenses:u,medicalExpenses:d,educationExpenses:r,totalDeductions:v,taxableBase:m,faixa:g,aliquotaNominal:x,deductionParcel:y,taxDue:i,effectiveRate:n,totalMandatoryDiscounts:O,netSalary:j,isExempt:i===0}}class Y{constructor(){R(this,"ctx",null);R(this,"currentTweens",{});R(this,"previousValues",{taxDue:0,grossSalary:0,inssDiscount:0,totalDeductions:0,taxableBase:0,effectiveRate:0,netSalary:0})}initEntranceAnimations(){this.ctx=l.context(()=>{l.from(".hero-badge, .hero-title, .hero-subtitle",{y:20,opacity:0,duration:.8,stagger:.12,ease:"power3.out"}),l.from(".calculator-form-card",{y:30,opacity:0,duration:.9,delay:.25,ease:"power3.out"})})}animateCounters(a,s,r,u,d,c,E){const h=document.getElementById("kpi-tax-due"),v=document.getElementById("kpi-gross"),m=document.getElementById("kpi-inss"),g=document.getElementById("kpi-deductions"),x=document.getElementById("kpi-base"),y=document.getElementById("kpi-effective"),i=document.getElementById("kpi-net");if(Object.values(this.currentTweens).forEach(n=>n==null?void 0:n.kill()),h){const n={val:this.previousValues.taxDue};this.currentTweens.taxDue=l.to(n,{val:a,duration:1.1,ease:"power2.out",onUpdate:()=>{h.textContent=e(n.val)},onComplete:()=>{this.previousValues.taxDue=a,h.textContent=e(a)}})}if(v){const n={val:this.previousValues.grossSalary};this.currentTweens.grossSalary=l.to(n,{val:s,duration:1,ease:"power2.out",onUpdate:()=>{v.textContent=e(n.val)},onComplete:()=>{this.previousValues.grossSalary=s,v.textContent=e(s)}})}if(m){const n={val:this.previousValues.inssDiscount};this.currentTweens.inssDiscount=l.to(n,{val:r,duration:1,ease:"power2.out",onUpdate:()=>{m.textContent=e(n.val)},onComplete:()=>{this.previousValues.inssDiscount=r,m.textContent=e(r)}})}if(g){const n={val:this.previousValues.totalDeductions};this.currentTweens.totalDeductions=l.to(n,{val:u,duration:1,ease:"power2.out",onUpdate:()=>{g.textContent=e(n.val)},onComplete:()=>{this.previousValues.totalDeductions=u,g.textContent=e(u)}})}if(x){const n={val:this.previousValues.taxableBase};this.currentTweens.taxableBase=l.to(n,{val:d,duration:1,ease:"power2.out",onUpdate:()=>{x.textContent=e(n.val)},onComplete:()=>{this.previousValues.taxableBase=d,x.textContent=e(d)}})}if(y){const n={val:this.previousValues.effectiveRate};this.currentTweens.effectiveRate=l.to(n,{val:c,duration:1,ease:"power2.out",onUpdate:()=>{y.textContent=f(n.val,2)},onComplete:()=>{this.previousValues.effectiveRate=c,y.textContent=f(c,2)}})}if(i){const n={val:this.previousValues.netSalary};this.currentTweens.netSalary=l.to(n,{val:E,duration:1,ease:"power2.out",onUpdate:()=>{i.textContent=e(n.val)},onComplete:()=>{this.previousValues.netSalary=E,i.textContent=e(E)}})}}animateResultsReveal(){const a=document.getElementById("results-section");a&&l.fromTo(a,{opacity:0,y:30},{opacity:1,y:0,duration:.7,ease:"power2.out"})}destroy(){var a;(a=this.ctx)==null||a.revert()}}const T=new Y,$=document.getElementById("ir-form"),F=document.getElementById("gross-salary"),I=document.getElementById("dependents-count"),M=document.getElementById("education-expenses"),N=document.getElementById("alimony-expenses"),A=document.getElementById("medical-expenses"),B=document.getElementById("btn-clear"),V=document.getElementById("table-entradas-body"),k=document.getElementById("table-deducoes-body"),q=document.getElementById("table-calculo-body"),b=document.getElementById("kpi-faixa-badge"),C=document.getElementById("kpi-summary-text");let o=null;function Z(){return{grossSalary:D(F.value),dependentsCount:L(I.value),educationExpenses:D(M.value),alimonyExpenses:D(N.value),medicalExpenses:D(A.value)}}function tt(t){if(V&&(V.innerHTML=`
      <tr>
        <td><strong>Renda Mensal Bruta (Salário)</strong></td>
        <td>Rendimento formalizado antes dos descontos</td>
        <td class="col-highlight-total">${e(t.grossSalary)}</td>
      </tr>
      <tr class="table-row-total">
        <td><strong>Total de Entradas Brutas</strong></td>
        <td>Base inicial para apuração tributária</td>
        <td class="col-highlight-total"><strong>${e(t.grossSalary)}</strong></td>
      </tr>
    `),k){const a=t.dependentsCount>0?`${t.dependentsCount} dependente(s) × ${e(_)}/mês`:"Nenhum dependente informado";k.innerHTML=`
      <tr class="table-row-highlight">
        <td><strong>Previdência Oficial (INSS)</strong></td>
        <td>Desconto progressivo automático (${f(t.inssEffectiveRate,2)} efetivo)</td>
        <td class="col-highlight-profit"><strong>${e(t.inssDiscount)}</strong></td>
      </tr>
      <tr>
        <td><strong>Dedução por Dependentes</strong></td>
        <td>${a}</td>
        <td>${e(t.dependentsDeduction)}</td>
      </tr>
      <tr>
        <td><strong>Pensão Alimentícia</strong></td>
        <td>Valor mensal fixado judicialmente</td>
        <td>${e(t.alimonyExpenses)}</td>
      </tr>
      <tr>
        <td><strong>Despesas Médicas</strong></td>
        <td>Gastos com saúde, planos e consultas</td>
        <td>${e(t.medicalExpenses)}</td>
      </tr>
      <tr>
        <td><strong>Despesas com Ensino</strong></td>
        <td>Instrução, escolas, faculdades e cursos</td>
        <td>${e(t.educationExpenses)}</td>
      </tr>
      <tr class="table-row-total">
        <td><strong>Total Geral de Deduções</strong></td>
        <td>Soma do INSS e demais deduções legais</td>
        <td class="col-highlight-profit"><strong>${e(t.totalDeductions)}</strong></td>
      </tr>
    `}if(q){const a=t.isExempt?'<span style="color: var(--positive); font-weight: 700;">Isento de IRRF</span>':`<span style="color: var(--ink); font-weight: 700;">${t.faixa.label}</span>`,s=t.deductionParcel>0?e(t.deductionParcel):"R$ 0,00 (Faixa Isenta)";q.innerHTML=`
      <tr>
        <td><strong>Base de Cálculo do Imposto</strong></td>
        <td>Salário Bruto (${e(t.grossSalary)}) – Deduções Totais (${e(t.totalDeductions)})</td>
        <td class="col-highlight-total"><strong>${e(t.taxableBase)}</strong></td>
      </tr>
      <tr>
        <td><strong>Faixa da Tabela Progressiva</strong></td>
        <td>Enquadramento pela base de cálculo</td>
        <td>${a}</td>
      </tr>
      <tr>
        <td><strong>Alíquota Nominal da Faixa</strong></td>
        <td>Percentual aplicado sobre a base de cálculo</td>
        <td><strong>${f(t.aliquotaNominal,1)}</strong></td>
      </tr>
      <tr>
        <td><strong>Parcela a Deduzir</strong></td>
        <td>Abatimento legal correspondente à faixa</td>
        <td>${s}</td>
      </tr>
      <tr class="table-row-highlight">
        <td><strong>Imposto Retido na Fonte (IRRF)</strong></td>
        <td>(Base de Cálculo × Alíquota) – Parcela a Deduzir</td>
        <td class="col-highlight-profit" style="font-size: 16px;"><strong>${e(t.taxDue)}</strong></td>
      </tr>
      <tr>
        <td><strong>Alíquota Efetiva do IRRF</strong></td>
        <td>Percentual do imposto retido sobre o salário bruto total</td>
        <td><strong>${f(t.effectiveRate,2)}</strong></td>
      </tr>
      <tr>
        <td><strong>Total Descontado em Folha</strong></td>
        <td>Desconto do INSS (${e(t.inssDiscount)}) + IRRF (${e(t.taxDue)})</td>
        <td class="col-highlight-profit"><strong>${e(t.totalMandatoryDiscounts)}</strong></td>
      </tr>
      <tr class="table-row-total">
        <td><strong>Salário Líquido Estimado</strong></td>
        <td>Renda bruta mensal menos os descontos obrigatórios (INSS + IRRF)</td>
        <td class="col-highlight-total" style="font-size: 16px;"><strong>${e(t.netSalary)}</strong></td>
      </tr>
    `}}function w(t=!1){const a=Z();o=X(a),b&&(o.isExempt?(b.textContent="Isento de IRRF",b.className="lime-chip"):(b.textContent=`Faixa ${o.faixa.faixaIndex} (${f(o.aliquotaNominal,1)})`,b.className="lime-chip")),C&&(o.grossSalary===0?C.textContent="Informe sua renda mensal para calcular a retenção.":o.isExempt?C.textContent=`Base de ${e(o.taxableBase)} isenta de IRRF (INSS de ${e(o.inssDiscount)} deduzido).`:C.textContent=`Alíquota efetiva de ${f(o.effectiveRate,2)} sobre a renda bruta de ${e(o.grossSalary)} (INSS: ${e(o.inssDiscount)}).`),T.animateCounters(o.taxDue,o.grossSalary,o.inssDiscount,o.totalDeductions,o.taxableBase,o.effectiveRate,o.netSalary),tt(o),t&&T.animateResultsReveal()}function et(){p(F,0),I.value="0",p(M,0),p(N,0),p(A,0),w(!1)}function P(){G(),p(F,0),I.value="0",p(M,0),p(N,0),p(A,0),I.addEventListener("input",()=>{const t=L(I.value);I.value=String(Math.max(0,t))}),$==null||$.addEventListener("submit",t=>{t.preventDefault(),w(!0)}),B==null||B.addEventListener("click",et),T.initEntranceAnimations(),w(!1)}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",P):P();
