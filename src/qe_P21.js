// P21: prøveeksamen ISTx100y oktober 2021 (source: ISTx100yProveEksamenH21.pdf + ISTx100yProveLFH21.pdf)
(function(){
const STU_NO = "La oss anta at en tilfeldig valgt student som jobber med et spørsmål på en eksamen har sannsynlighet 0,75 for å kunne teorien og klare utregningene, som gir korrekt svar på spørsmålet (studenten trenger da ikke å tippe). Hvis studenten ikke finner fram til korrekt svar ved teori og utregning, så tipper studenten. Hvis studenten tipper, er sannsynligheten for å velge riktig svar 0,2.";
const STU_EN = "Assume that a randomly chosen student working on an exam question has probability 0.75 of knowing the theory and managing the calculations, which gives the correct answer (the student then does not need to guess). If the student does not reach the correct answer through theory and calculation, the student guesses. When guessing, the probability of choosing the right answer is 0.2.";
const STU_FIG = {k:"ptree", root:[{l:["Kan","Knows"], p:"0,75", kids:[{l:["Rett","Correct"], p:"1"}]},{l:["Tipper","Guesses"], p:"0,25", kids:[{l:["Rett","Correct"], p:"0,2"},{l:["Feil","Wrong"], p:"0,8"}]}]};
const GEO_NO = "La $X$ være geometrisk fordelt med parameter $p=0{,}1$, det vil si $P(X=x)=p(1-p)^{x-1}$ for $x=1,2,\\dots$";
const GEO_EN = "Let $X$ be geometrically distributed with parameter $p=0.1$, i.e. $P(X=x)=p(1-p)^{x-1}$ for $x=1,2,\\dots$";
const PIPE_NO = "En bedrift produserer rør som settes sammen til gassrørledninger. Vi antar at lengden til et rør er normalfordelt med forventningsverdi 12 meter og standardavvik 0,1 meter, og at lengdene til rørene er uavhengige av hverandre.";
const PIPE_EN = "A company produces pipes that are joined into gas pipelines. Assume the length of a pipe is normally distributed with mean 12 metres and standard deviation 0.1 metres, and that pipe lengths are independent.";
const LINE_NO = " Bedriften har fått i oppdrag å produsere en 10 800 meter lang rørledning, og planlegger å produsere 900 rør til denne. Totallengden på rørledningen er summen av lengdene til de 900 rørene.";
const LINE_EN = " The company has been commissioned to build a 10 800 metre pipeline and plans to produce 900 pipes for it. The total length of the pipeline is the sum of the lengths of the 900 pipes.";
const Z_NO = "La $X_1$ og $X_2$ være to stokastiske variabler med $E(X_1)=0$, $E(X_2)=-1$, $\\text{Var}(X_1)=3$, $\\text{Var}(X_2)=2$ og $\\text{Cov}(X_1,X_2)=1$. La $Y$ være uavhengig av $X_1$ og $X_2$ med $E(Y)=3$ og $\\text{Var}(Y)=2$. La $Z_1=3X_1+Y$ og $Z_2=X_1-4X_2$.";
const Z_EN = "Let $X_1$ and $X_2$ be random variables with $E(X_1)=0$, $E(X_2)=-1$, $\\text{Var}(X_1)=3$, $\\text{Var}(X_2)=2$ and $\\text{Cov}(X_1,X_2)=1$. Let $Y$ be independent of $X_1$ and $X_2$ with $E(Y)=3$ and $\\text{Var}(Y)=2$. Let $Z_1=3X_1+Y$ and $Z_2=X_1-4X_2$.";
const CI_NO = "En bedrift produserer rør til gassrørledninger. Lengden til et rør er normalfordelt med ukjent forventningsverdi $\\mu$ og kjent standardavvik $\\sigma=0{,}1$ meter, og lengdene er uavhengige.";
const CI_EN = "A company produces pipes for gas pipelines. The length of a pipe is normally distributed with unknown mean $\\mu$ and known standard deviation $\\sigma=0.1$ metres, and lengths are independent.";
const P_NO = "Et kommunalt kloakkrenseanlegg har tatt i bruk nytt utstyr og fått oppgitt at mengdene fosfor i like store prøver tatt på ulike dager vil være uavhengige og normalfordelte med forventningsverdi $\\mu$ mg/l som ikke overskrider 0,15 mg/l, og standardavvik $\\sigma=0{,}02$ mg/l.";
const P_EN = "A municipal sewage treatment plant has installed new equipment and been told that the amounts of phosphorus in equal-sized samples taken on different days are independent and normally distributed with mean $\\mu$ mg/l not exceeding 0.15 mg/l, and standard deviation $\\sigma=0.02$ mg/l.";
const PT_NO = " Vi tester $H_0:\\mu=0{,}15$ mot $H_1:\\mu>0{,}15$ på signifikansnivå 5 %, basert på 12 uavhengige prøver.";
const PT_EN = " We test $H_0:\\mu=0.15$ against $H_1:\\mu>0.15$ at the 5% significance level, based on 12 independent samples.";
const BC_PTS = [[149.2,4.09],[149.2,4.42],[156.2,4.21],[157.0,4.53],[158.1,4.66],[158.9,4.19],[162.5,4.38],[164.9,4.13],[165.5,5.18],[166.8,4.99],[167.9,4.00],[168.7,4.52],[168.7,4.99],[169.0,5.60],[169.8,4.32],[170.1,4.07],[170.1,4.36],[170.4,4.51],[171.7,4.03],[171.7,5.28],[172.2,4.41],[172.5,4.08],[172.6,4.15],[172.8,5.13],[173.2,4.23],[173.3,4.39],[173.5,4.43],[173.6,3.96],[173.9,4.25],[173.9,4.46],[174.2,3.80],[174.4,4.02],[175.0,4.31],[175.0,5.16],[175.3,3.95],[176.0,4.16],[176.1,4.46],[176.1,4.50],[176.6,4.83],[176.9,4.56],[177.4,4.17],[177.4,4.40],[177.4,4.63],[177.4,4.90],[177.7,4.26],[178.3,4.12],[178.4,4.45],[178.5,4.97],[178.8,4.27],[179.0,4.47],[179.5,4.24],[179.5,4.44],[179.6,3.95],[179.6,4.36],[179.6,4.51],[179.6,4.58],[180.1,4.46],[180.2,5.03],[180.4,4.17],[180.4,4.23],[181.0,4.38],[181.0,4.87],[181.2,3.91],[181.7,5.05],[182.1,4.41],[182.6,4.83],[182.8,5.32],[182.9,4.06],[182.9,5.09],[183.2,3.90],[183.2,5.02],[183.4,5.66],[184.0,4.75],[184.0,5.34],[184.8,4.26],[185.1,4.37],[185.6,5.09],[185.6,5.22],[185.6,5.40],[185.9,4.78],[186.0,4.87],[187.2,4.87],[188.0,4.71],[188.3,4.40],[188.8,4.93],[188.8,5.22],[190.2,4.32],[190.8,4.87],[190.8,5.38],[191.9,4.81],[191.9,5.21],[192.7,5.34],[193.2,5.11],[193.2,5.24],[194.3,5.17],[194.6,4.83],[195.4,5.41],[197.8,4.96],[207.1,5.44],[209.8,5.49],[212.0,5.20],[215.0,5.19]];  // digitised from the exam scatter plot (102 of 105 points visible; 3 hidden by overlap)
const BC_FIG = {k:"xy", pts:BC_PTS, xLabel:["Hoeyde [cm]","Height [cm]"], yLabel:["Blodceller [tera per liter]","Blood cells [tera per litre]"]};
const BC_NO = "Vi studerer antall røde blodceller (per liter blod) hos 105 idrettsutøvere, og hvordan antallet varierer med høyde. Variabler: <i>Blodceller</i> (antall/$10^{12}$ per liter) og <i>Hoeyde</i> (cm).";
const BC_EN = "We study the number of red blood cells (per litre of blood) in 105 athletes, and how it varies with height. Variables: <i>Blodceller</i> (count/$10^{12}$ per litre) and <i>Hoeyde</i> (height, cm).";
const BC_TAB = '<table class="cm"><tr><th></th><th>coef</th><th>std err</th><th>t</th><th>P&gt;|t|</th><th>[0.025</th><th>0.975]</th></tr><tr><th>Intercept</th><td>1.0669</td><td>0.630</td><td>1.692</td><td>0.094</td><td>-0.183</td><td>2.317</td></tr><tr><th>Hoeyde</th><td>0.0199</td><td>0.004</td><td>5.669</td><td>0.000</td><td>0.013</td><td>0.027</td></tr></table>';
const BCR_NO = BC_NO + " En lineær regresjonsmodell $Y=\\beta_0+\\beta_1x+\\varepsilon$ er tilpasset i Python, med respons $Y$ = Blodceller og kovariat $x$ = Hoeyde. Deler av utskriften (<i>modell.summary()</i>):<br>" + BC_TAB;
const BCR_EN = BC_EN + " A linear regression model $Y=\\beta_0+\\beta_1x+\\varepsilon$ was fitted in Python, with response $Y$ = Blodceller and covariate $x$ = Hoeyde. Part of the output (<i>modell.summary()</i>):<br>" + BC_TAB;
const LAB_NO = "En laborant skal bestemme den ukjente konsentrasjonen $\\mu$ av et stoff i en prøve. To måleinstrumenter gir normalfordelte målinger med forventning $\\mu$. Instrument A har standardavvik $\\sigma_x=2{,}4$; laboranten gjør 9 uavhengige målinger $X_1,\\dots,X_9$ og $\\bar{X}=\\frac{1}{9}\\sum_{i=1}^{9}X_i$. Instrument B har standardavvik $\\sigma_y=0{,}6$; laboranten tar én måling $Y$, uavhengig av $X$-ene. Laboranten vurderer to estimatorer: $\\hat{\\mu}_1=\\frac{1}{2}(\\bar{X}+Y)$ og $\\hat{\\mu}_2=0{,}36\\bar{X}+0{,}64Y$.";
const LAB_EN = "A lab technician must determine the unknown concentration $\\mu$ of a substance in a sample. Two instruments give normally distributed measurements with mean $\\mu$. Instrument A has standard deviation $\\sigma_x=2.4$; the technician makes 9 independent measurements $X_1,\\dots,X_9$ and $\\bar{X}=\\frac{1}{9}\\sum_{i=1}^{9}X_i$. Instrument B has standard deviation $\\sigma_y=0.6$; the technician makes one measurement $Y$, independent of the $X$'s. Two estimators are considered: $\\hat{\\mu}_1=\\frac{1}{2}(\\bar{X}+Y)$ and $\\hat{\\mu}_2=0.36\\bar{X}+0.64Y$.";
const LED_NO = "Levetiden $T$ til en bestemt type LED-lys er eksponentialfordelt med forventning 10 år, og levetidene til ulike LED-lys er uavhengige.";
const LED_EN = "The lifetime $T$ of a certain type of LED light is exponentially distributed with mean 10 years, and lifetimes of different LED lights are independent.";

QB.push(
{id:"P21-1a", t:2, s:"P21",
 q:[STU_NO+" Hva er sannsynligheten for at en tilfeldig valgt student svarer rett på eksamensspørsmålet?", STU_EN+" What is the probability that a randomly chosen student answers the exam question correctly?"],
 o:[["0,05","0.05"],["0,20","0.20"],["0,50","0.50"],["0,75","0.75"],["0,80","0.80"]],
 a:4,
 f:["$P(B)=P(B\\mid A)P(A)+P(B\\mid A^c)P(A^c)$", "$P(B)=P(B\\mid A)P(A)+P(B\\mid A^c)P(A^c)$"],
 fig:STU_FIG,
 w:["La $A$ = studenten kan teorien (trenger ikke tippe) og $B$ = studenten svarer rett. $P(A)=0{,}75$, $P(B\\mid A)=1$, $P(A^c)=0{,}25$, $P(B\\mid A^c)=0{,}2$. Total sannsynlighet: $P(B)=1\\cdot 0{,}75+0{,}2\\cdot 0{,}25=0{,}75+0{,}05=0{,}80$.",
    "Let $A$ = the student knows the theory (no guessing) and $B$ = the student answers correctly. $P(A)=0.75$, $P(B\\mid A)=1$, $P(A^c)=0.25$, $P(B\\mid A^c)=0.2$. Total probability: $P(B)=1\\cdot 0.75+0.2\\cdot 0.25=0.75+0.05=0.80$."],
 x:[["$0{,}2\\cdot 0{,}25=0{,}05$ er bare grenen «tipper og treffer»; glemte studentene som kan stoffet.","$0.2\\cdot 0.25=0.05$ is only the “guesses and hits” branch; forgot the students who know the material."],
    ["0,2 er sannsynligheten for rett svar <i>gitt</i> at studenten tipper, ikke totalt.","0.2 is the probability of a correct answer <i>given</i> that the student guesses, not overall."],
    ["0,50 svarer ikke til noen grein i treet; den totale sannsynligheten må være minst 0,75.","0.50 matches no branch of the tree; the total probability must be at least 0.75."],
    ["0,75 er bare studentene som kan stoffet; glemte at noen av de som tipper også svarer rett.","0.75 counts only the students who know the material; forgot that some guessers also answer correctly."],
    null]},

{id:"P21-1b", t:2, s:"P21", kind:"num",
 q:[STU_NO+" Gitt at studenten svarer korrekt på spørsmålet, hva er sannsynligheten for at studenten <i>ikke</i> tippet? Oppgi svaret med 4 desimaler.", STU_EN+" Given that the student answers correctly, what is the probability that the student did <i>not</i> guess? Give the answer with 4 decimals."],
 ans:0.9375, tol:0.00015,
 f:["$P(A\\mid B)=\\dfrac{P(B\\mid A)P(A)}{P(B)}$", "$P(A\\mid B)=\\dfrac{P(B\\mid A)P(A)}{P(B)}$"],
 fig:STU_FIG,
 w:["Bayes' regel med $A$ = kan stoffet, $B$ = svarer rett. Først $P(B)=1\\cdot 0{,}75+0{,}2\\cdot 0{,}25=0{,}80$. Så $P(A\\mid B)=\\frac{1\\cdot 0{,}75}{0{,}80}=0{,}9375$.",
    "Bayes' rule with $A$ = knows the material, $B$ = answers correctly. First $P(B)=1\\cdot 0.75+0.2\\cdot 0.25=0.80$. Then $P(A\\mid B)=\\frac{1\\cdot 0.75}{0.80}=0.9375$."]},

{id:"P21-2a", t:4, s:"P21", kind:"num",
 q:[GEO_NO+" Finn $P(X=5)$. Oppgi svaret med 2 desimaler.", GEO_EN+" Find $P(X=5)$. Give the answer with 2 decimals."],
 ans:0.0656, tol:0.005,
 f:["$P(X=x)=p(1-p)^{x-1}$", "$P(X=x)=p(1-p)^{x-1}$"],
 w:["$P(X=5)=0{,}1\\cdot 0{,}9^{4}=0{,}1\\cdot 0{,}6561=0{,}0656\\approx 0{,}07$.", "$P(X=5)=0.1\\cdot 0.9^{4}=0.1\\cdot 0.6561=0.0656\\approx 0.07$."]},

{id:"P21-2b", t:4, s:"P21", kind:"num",
 q:[GEO_NO+" Finn $P(X\\geq 20)$. Oppgi svaret med 2 desimaler.", GEO_EN+" Find $P(X\\geq 20)$. Give the answer with 2 decimals."],
 ans:0.1351, tol:0.005,
 f:["$F(x)=P(X\\leq x)=1-(1-p)^{x}$", "$F(x)=P(X\\leq x)=1-(1-p)^{x}$"],
 w:["$P(X\\geq 20)=1-P(X\\leq 19)=(1-p)^{19}=0{,}9^{19}=0{,}1351\\approx 0{,}14$. Intuitivt: de 19 første forsøkene må alle være fiaskoer. Vanlig feil: $0{,}9^{20}=0{,}12$, som er $P(X>20)$.",
    "$P(X\\geq 20)=1-P(X\\leq 19)=(1-p)^{19}=0.9^{19}=0.1351\\approx 0.14$. Intuitively: the first 19 trials must all fail. Common mistake: $0.9^{20}=0.12$, which is $P(X>20)$."]},

{id:"P21-2c", t:4, s:"P21", kind:"num",
 q:[GEO_NO+" Finn $P(X<5\\mid X\\geq 3)$. Oppgi svaret med 2 desimaler.", GEO_EN+" Find $P(X<5\\mid X\\geq 3)$. Give the answer with 2 decimals."],
 ans:0.19, tol:0.005,
 f:["$P(A\\mid B)=\\dfrac{P(A\\cap B)}{P(B)}$, $\\;P(X\\geq k)=(1-p)^{k-1}$", "$P(A\\mid B)=\\dfrac{P(A\\cap B)}{P(B)}$, $\\;P(X\\geq k)=(1-p)^{k-1}$"],
 w:["$P(X\\geq 3)=(1-p)^2=0{,}81$. $P(3\\leq X<5)=P(X=3)+P(X=4)=0{,}1\\cdot 0{,}9^2+0{,}1\\cdot 0{,}9^3=0{,}081+0{,}0729=0{,}1539$. Dermed $P(X<5\\mid X\\geq 3)=\\frac{0{,}1539}{0{,}81}=0{,}19$. (Hukommelsesløshet: dette er lik $P(X\\leq 2)=0{,}1+0{,}09=0{,}19$.)",
    "$P(X\\geq 3)=(1-p)^2=0.81$. $P(3\\leq X<5)=P(X=3)+P(X=4)=0.1\\cdot 0.9^2+0.1\\cdot 0.9^3=0.081+0.0729=0.1539$. Hence $P(X<5\\mid X\\geq 3)=\\frac{0.1539}{0.81}=0.19$. (Memorylessness: this equals $P(X\\leq 2)=0.1+0.09=0.19$.)"]},

{id:"P21-3a", t:6, s:"P21", kind:"num",
 q:[PIPE_NO+" Hva er sannsynligheten for at et tilfeldig valgt rør er lengre enn 12,2 meter? Oppgi svaret med 4 desimaler.", PIPE_EN+" What is the probability that a randomly chosen pipe is longer than 12.2 metres? Give the answer with 4 decimals."],
 ans:0.0228, tol:0.00015,
 f:["$P(X>x)=1-\\Phi\\left(\\frac{x-\\mu}{\\sigma}\\right)$", "$P(X>x)=1-\\Phi\\left(\\frac{x-\\mu}{\\sigma}\\right)$"],
 fig:{k:"pdf", curves:[{dist:"norm", mu:12, sigma:0.1}], range:[11.6,12.4], shade:[[12.2,null]], marks:[12.2], xLabel:["lengde (m)","length (m)"]},
 w:["$P(X>12{,}2)=1-P\\left(Z\\leq\\frac{12{,}2-12}{0{,}1}\\right)=1-\\Phi(2{,}00)=1-0{,}9772=0{,}0228$.", "$P(X>12.2)=1-P\\left(Z\\leq\\frac{12.2-12}{0.1}\\right)=1-\\Phi(2.00)=1-0.9772=0.0228$."]},

{id:"P21-3b", t:6, s:"P21",
 q:[PIPE_NO+" Dersom standardavviket til lengdene kunne justeres til en annen verdi (forventningen er fortsatt 12 meter), hvilken verdi måtte det justeres til for at sannsynligheten skal være 0,95 for at lengden til et tilfeldig valgt rør er mellom 11,90 og 12,10 meter?", PIPE_EN+" If the standard deviation of the lengths could be adjusted to another value (the mean is still 12 metres), what value would make the probability 0.95 that a randomly chosen pipe is between 11.90 and 12.10 metres long?"],
 o:[["0,01","0.01"],["0,02","0.02"],["0,05","0.05"],["0,10","0.10"],["0,12","0.12"],["0,15","0.15"]],
 a:2,
 f:["$P(\\mu-c<X<\\mu+c)=2\\Phi(c/\\sigma)-1$, $\\;z_{0{,}025}=1{,}96$", "$P(\\mu-c<X<\\mu+c)=2\\Phi(c/\\sigma)-1$, $\\;z_{0.025}=1.96$"],
 w:["Intervallet er symmetrisk om $\\mu=12$, så $P(11{,}90<X<12{,}10)=1-2P\\left(Z\\geq\\frac{0{,}10}{\\sigma}\\right)=0{,}95$, dvs. $P\\left(Z\\geq\\frac{0{,}10}{\\sigma}\\right)=0{,}025$. Da er $\\frac{0{,}10}{\\sigma}=z_{0{,}025}=1{,}96$, og $\\sigma=\\frac{0{,}10}{1{,}96}=0{,}051\\approx 0{,}05$.",
    "The interval is symmetric about $\\mu=12$, so $P(11.90<X<12.10)=1-2P\\left(Z\\geq\\frac{0.10}{\\sigma}\\right)=0.95$, i.e. $P\\left(Z\\geq\\frac{0.10}{\\sigma}\\right)=0.025$. So $\\frac{0.10}{\\sigma}=z_{0.025}=1.96$, and $\\sigma=\\frac{0.10}{1.96}=0.051\\approx 0.05$."],
 x:[["Med $\\sigma=0{,}01$ er intervallet $\\pm 10\\sigma$, og sannsynligheten blir praktisk talt 1, ikke 0,95.","With $\\sigma=0.01$ the interval is $\\pm 10\\sigma$, and the probability is practically 1, not 0.95."],
    ["Med $\\sigma=0{,}02$ er intervallet $\\pm 5\\sigma$; sannsynligheten blir ca. 0,999999, for høy.","With $\\sigma=0.02$ the interval is $\\pm 5\\sigma$; the probability is about 0.999999, too high."],
    null,
    ["0,10 er dagens standardavvik; da er intervallet bare $\\pm 1\\sigma$, som gir ca. 0,68.","0.10 is the current standard deviation; the interval is then only $\\pm 1\\sigma$, giving about 0.68."],
    ["Et større standardavvik gir lavere sannsynlighet (ca. 0,60), mens vi trenger høyere.","A larger standard deviation gives a lower probability (about 0.60), while we need a higher one."],
    ["Et større standardavvik gir lavere sannsynlighet (ca. 0,50), mens vi trenger høyere.","A larger standard deviation gives a lower probability (about 0.50), while we need a higher one."]]},

{id:"P21-3ci", t:6, s:"P21", kind:"num",
 q:[PIPE_NO+LINE_NO+" Hva er forventningsverdien til totallengden av rørledningen (i meter)? Oppgi svaret som et heltall.", PIPE_EN+LINE_EN+" What is the expected total length of the pipeline (in metres)? Give the answer as an integer."],
 ans:10800, tol:0.5, unit:["meter","metres"],
 f:["$E(X_1+\\dots+X_n)=E(X_1)+\\dots+E(X_n)$", "$E(X_1+\\dots+X_n)=E(X_1)+\\dots+E(X_n)$"],
 w:["La $T=X_1+X_2+\\dots+X_{900}$. $E(T)=E(X_1)+\\dots+E(X_{900})=900\\cdot 12=10\\,800$ meter.", "Let $T=X_1+X_2+\\dots+X_{900}$. $E(T)=E(X_1)+\\dots+E(X_{900})=900\\cdot 12=10\\,800$ metres."]},

{id:"P21-3cii", t:6, s:"P21", kind:"num",
 q:[PIPE_NO+LINE_NO+" Hva er variansen til totallengden av rørledningen (i m²)? Oppgi svaret som et heltall.", PIPE_EN+LINE_EN+" What is the variance of the total length of the pipeline (in m²)? Give the answer as an integer."],
 ans:9, tol:0.5,
 f:["$\\text{Var}(X_1+\\dots+X_n)=\\text{Var}(X_1)+\\dots+\\text{Var}(X_n)$ (uavhengige)", "$\\text{Var}(X_1+\\dots+X_n)=\\text{Var}(X_1)+\\dots+\\text{Var}(X_n)$ (independent)"],
 w:["$T=X_1+\\dots+X_{900}$ med uavhengige $X_i$: $\\text{Var}(T)=900\\cdot 0{,}1^2=9$. Merk: $T$ er <i>ikke</i> $900X$ (det ville gitt $900^2\\cdot 0{,}01=8100$), for rørene er ikke identisk like lange.",
    "$T=X_1+\\dots+X_{900}$ with independent $X_i$: $\\text{Var}(T)=900\\cdot 0.1^2=9$. Note: $T$ is <i>not</i> $900X$ (that would give $900^2\\cdot 0.01=8100$), since the pipes are not all identical."]},

{id:"P21-3d", t:6, s:"P21", kind:"num",
 q:[PIPE_NO+LINE_NO+" Totallengden $T$ har forventning 10 800 m og varians 9 m². Hvis rørledningen er kortere enn 10 795 meter eller lengre enn 10 805 meter, vil kunden klage. Hvor sannsynlig er det at kunden klager? Oppgi svaret med 3 desimaler.", PIPE_EN+LINE_EN+" The total length $T$ has mean 10 800 m and variance 9 m². If the pipeline is shorter than 10 795 metres or longer than 10 805 metres, the customer will complain. What is the probability that the customer complains? Give the answer with 3 decimals."],
 ans:0.095, tol:0.0015,
 f:["$P(|T-\\mu|>c)=1-\\left[\\Phi\\left(\\frac{c}{\\sigma}\\right)-\\Phi\\left(-\\frac{c}{\\sigma}\\right)\\right]$", "$P(|T-\\mu|>c)=1-\\left[\\Phi\\left(\\frac{c}{\\sigma}\\right)-\\Phi\\left(-\\frac{c}{\\sigma}\\right)\\right]$"],
 fig:{k:"pdf", curves:[{dist:"norm", mu:10800, sigma:3}], range:[10788,10812], shade:[[null,10795],[10805,null]], marks:[10795,10805], xLabel:["totallengde (m)","total length (m)"]},
 w:["$T$ er en sum av uavhengige normalfordelte variabler, så $T\\sim N(10\\,800,\\,9)$ med $SD(T)=3$. $P(\\text{klage})=1-P(10\\,795\\leq T\\leq 10\\,805)=1-[\\Phi(1{,}67)-\\Phi(-1{,}67)]=1-[0{,}9525-0{,}0475]=0{,}095$. (Uten avrunding av $z=5/3$ blir det 0,096.)",
    "$T$ is a sum of independent normal variables, so $T\\sim N(10\\,800,\\,9)$ with $SD(T)=3$. $P(\\text{complaint})=1-P(10\\,795\\leq T\\leq 10\\,805)=1-[\\Phi(1.67)-\\Phi(-1.67)]=1-[0.9525-0.0475]=0.095$. (Without rounding $z=5/3$ it is 0.096.)"]},

{id:"P21-4a", t:3, s:"P21", kind:"num",
 q:[Z_NO+" Finn $E(Z_1)$. Oppgi svaret som et heltall.", Z_EN+" Find $E(Z_1)$. Give the answer as an integer."],
 ans:3, tol:0.5,
 f:["$E(aX+bY)=aE(X)+bE(Y)$", "$E(aX+bY)=aE(X)+bE(Y)$"],
 w:["$E(Z_1)=E(3X_1+Y)=3E(X_1)+E(Y)=3\\cdot 0+3=3$.", "$E(Z_1)=E(3X_1+Y)=3E(X_1)+E(Y)=3\\cdot 0+3=3$."]},

{id:"P21-4b", t:3, s:"P21", kind:"num",
 q:[Z_NO+" Finn $\\text{Var}(Z_1)$. Oppgi svaret som et heltall.", Z_EN+" Find $\\text{Var}(Z_1)$. Give the answer as an integer."],
 ans:29, tol:0.5,
 f:["$\\text{Var}(aX+bY)=a^2\\text{Var}(X)+b^2\\text{Var}(Y)+2ab\\,\\text{Cov}(X,Y)$", "$\\text{Var}(aX+bY)=a^2\\text{Var}(X)+b^2\\text{Var}(Y)+2ab\\,\\text{Cov}(X,Y)$"],
 w:["$Y$ er uavhengig av $X_1$, så $\\text{Cov}(X_1,Y)=0$. $\\text{Var}(Z_1)=3^2\\text{Var}(X_1)+\\text{Var}(Y)+2\\cdot 3\\cdot 1\\cdot 0=9\\cdot 3+2=29$.", "$Y$ is independent of $X_1$, so $\\text{Cov}(X_1,Y)=0$. $\\text{Var}(Z_1)=3^2\\text{Var}(X_1)+\\text{Var}(Y)+2\\cdot 3\\cdot 1\\cdot 0=9\\cdot 3+2=29$."]},

{id:"P21-4c", t:3, s:"P21", kind:"num",
 q:[Z_NO+" Finn $E(Z_2)$. Oppgi svaret som et heltall.", Z_EN+" Find $E(Z_2)$. Give the answer as an integer."],
 ans:4, tol:0.5,
 f:["$E(aX+bY)=aE(X)+bE(Y)$", "$E(aX+bY)=aE(X)+bE(Y)$"],
 w:["$E(Z_2)=E(X_1-4X_2)=E(X_1)-4E(X_2)=0-4\\cdot(-1)=4$.", "$E(Z_2)=E(X_1-4X_2)=E(X_1)-4E(X_2)=0-4\\cdot(-1)=4$."]},

{id:"P21-4d", t:3, s:"P21", kind:"num",
 q:[Z_NO+" Finn $\\text{Var}(Z_2)$. Oppgi svaret som et heltall.", Z_EN+" Find $\\text{Var}(Z_2)$. Give the answer as an integer."],
 ans:27, tol:0.5,
 f:["$\\text{Var}(aX+bY)=a^2\\text{Var}(X)+b^2\\text{Var}(Y)+2ab\\,\\text{Cov}(X,Y)$", "$\\text{Var}(aX+bY)=a^2\\text{Var}(X)+b^2\\text{Var}(Y)+2ab\\,\\text{Cov}(X,Y)$"],
 w:["$\\text{Var}(Z_2)=\\text{Var}(X_1)+(-4)^2\\text{Var}(X_2)+2\\cdot 1\\cdot(-4)\\,\\text{Cov}(X_1,X_2)=3+16\\cdot 2-8\\cdot 1=27$. Kovariansleddet trekker fra fordi koeffisientene har ulikt fortegn.",
    "$\\text{Var}(Z_2)=\\text{Var}(X_1)+(-4)^2\\text{Var}(X_2)+2\\cdot 1\\cdot(-4)\\,\\text{Cov}(X_1,X_2)=3+16\\cdot 2-8\\cdot 1=27$. The covariance term is subtracted because the coefficients have opposite signs."]},

{id:"P21-5ai", t:7, s:"P21", kind:"num",
 q:[CI_NO+" Bedriften produserer $n=12$ rør og måler lengden; gjennomsnittlig lengde ble 11,97 meter. Regn ut et 95 % konfidensintervall for $\\mu$. Hva er <b>nedre</b> grense? Oppgi svaret med to desimaler.", CI_EN+" The company produces $n=12$ pipes and measures them; the mean length was 11.97 metres. Compute a 95% confidence interval for $\\mu$. What is the <b>lower</b> limit? Give the answer with two decimals."],
 ans:11.91, tol:0.006,
 f:["$\\bar{x}\\pm z_{\\alpha/2}\\dfrac{\\sigma}{\\sqrt{n}}$", "$\\bar{x}\\pm z_{\\alpha/2}\\dfrac{\\sigma}{\\sqrt{n}}$"],
 w:["$\\sigma$ er kjent, så vi bruker z: $z_{0{,}025}=1{,}96$. Halv bredde: $1{,}96\\cdot\\frac{0{,}1}{\\sqrt{12}}=0{,}0566$. Nedre grense: $11{,}97-0{,}0566=11{,}91$.", "$\\sigma$ is known, so we use z: $z_{0.025}=1.96$. Half-width: $1.96\\cdot\\frac{0.1}{\\sqrt{12}}=0.0566$. Lower limit: $11.97-0.0566=11.91$."]},

{id:"P21-5aii", t:7, s:"P21", kind:"num",
 q:[CI_NO+" Bedriften produserer $n=12$ rør og måler lengden; gjennomsnittlig lengde ble 11,97 meter. Regn ut et 95 % konfidensintervall for $\\mu$. Hva er <b>øvre</b> grense? Oppgi svaret med to desimaler.", CI_EN+" The company produces $n=12$ pipes and measures them; the mean length was 11.97 metres. Compute a 95% confidence interval for $\\mu$. What is the <b>upper</b> limit? Give the answer with two decimals."],
 ans:12.03, tol:0.006,
 f:["$\\bar{x}\\pm z_{\\alpha/2}\\dfrac{\\sigma}{\\sqrt{n}}$", "$\\bar{x}\\pm z_{\\alpha/2}\\dfrac{\\sigma}{\\sqrt{n}}$"],
 w:["$z_{0{,}025}=1{,}96$, halv bredde $1{,}96\\cdot\\frac{0{,}1}{\\sqrt{12}}=0{,}0566$. Øvre grense: $11{,}97+0{,}0566=12{,}03$.", "$z_{0.025}=1.96$, half-width $1.96\\cdot\\frac{0.1}{\\sqrt{12}}=0.0566$. Upper limit: $11.97+0.0566=12.03$."]},

{id:"P21-5b", t:7, s:"P21",
 q:[CI_NO+" Hvor mange målinger må man minst gjøre dersom man ønsker et 95 % konfidensintervall for $\\mu$ med lengde (bredde) maksimalt 0,02 meter?", CI_EN+" How many measurements are needed at least to get a 95% confidence interval for $\\mu$ with length (width) at most 0.02 metres?"],
 o:[["20","20"],["192","192"],["193","193"],["271","271"],["385","385"]],
 a:4,
 f:["$L=2z_{\\alpha/2}\\dfrac{\\sigma}{\\sqrt{n}}\\leq L_0\\;\\Rightarrow\\; n\\geq\\left(\\dfrac{2z_{\\alpha/2}\\sigma}{L_0}\\right)^2$", "$L=2z_{\\alpha/2}\\dfrac{\\sigma}{\\sqrt{n}}\\leq L_0\\;\\Rightarrow\\; n\\geq\\left(\\dfrac{2z_{\\alpha/2}\\sigma}{L_0}\\right)^2$"],
 w:["Lengden er $L=2\\cdot 1{,}96\\cdot\\frac{0{,}1}{\\sqrt{n}}\\leq 0{,}02$. Det gir $\\sqrt{n}\\geq\\frac{2\\cdot 1{,}96\\cdot 0{,}1}{0{,}02}=19{,}6$, så $n\\geq 19{,}6^2=384{,}16$. Vi runder opp: $n=385$.", "The length is $L=2\\cdot 1.96\\cdot\\frac{0.1}{\\sqrt{n}}\\leq 0.02$. This gives $\\sqrt{n}\\geq\\frac{2\\cdot 1.96\\cdot 0.1}{0.02}=19.6$, so $n\\geq 19.6^2=384.16$. Round up: $n=385$."],
 x:[["$19{,}6\\approx 20$ er $\\sqrt{n}$; glemte å kvadrere.","$19.6\\approx 20$ is $\\sqrt{n}$; forgot to square."],
    ["$2\\cdot(1{,}96\\cdot 0{,}1/0{,}02)^2=192{,}08$: faktoren 2 ble ikke kvadrert, og i tillegg rundet ned.","$2\\cdot(1.96\\cdot 0.1/0.02)^2=192.08$: the factor 2 was not squared, and rounded down as well."],
    ["$2\\cdot(1{,}96\\cdot 0{,}1/0{,}02)^2=192{,}08$ rundet opp: faktoren 2 ble ikke kvadrert.","$2\\cdot(1.96\\cdot 0.1/0.02)^2=192.08$ rounded up: the factor 2 was not squared."],
    ["$(2\\cdot 1{,}645\\cdot 0{,}1/0{,}02)^2=270{,}6$: brukte $z_{0{,}05}=1{,}645$ (90 %) i stedet for $z_{0{,}025}=1{,}96$.","$(2\\cdot 1.645\\cdot 0.1/0.02)^2=270.6$: used $z_{0.05}=1.645$ (90%) instead of $z_{0.025}=1.96$."],
    null]},

{id:"P21-6a", t:8, s:"P21",
 q:[P_NO+" Vi vil bruke målinger av fosforinnhold i utslippsvannet til å utføre en hypotesetest der vi tester om vi har grunnlag for å konkludere at gjennomsnittlig mengde fosfor i det lange løp er større enn 0,15 mg/l, slik at tiltak må iverksettes. Hvilken alternativ hypotese setter vi opp?", P_EN+" We will use measurements of phosphorus in the discharge water to test whether there is evidence that the long-run mean amount of phosphorus is greater than 0.15 mg/l, so that action must be taken. Which alternative hypothesis do we set up?"],
 o:[["$\\mu<0{,}15$","$\\mu<0.15$"],["$\\mu\\neq 0{,}15$","$\\mu\\neq 0.15$"],["$\\mu>0{,}15$","$\\mu>0.15$"],["$\\mu=0{,}15$","$\\mu=0.15$"]],
 a:2,
 w:["Alternativhypotesen er det vi ønsker å finne bevis for: $H_1:\\mu>0{,}15$. Nullhypotesen er $\\mu=0{,}15$ (eller $\\mu\\leq 0{,}15$); begge gir samme forkastningsområde.", "The alternative hypothesis is what we want to find evidence for: $H_1:\\mu>0.15$. The null is $\\mu=0.15$ (or $\\mu\\leq 0.15$); both give the same rejection region."],
 x:[["Feil retning: vi vil påvise at fosformengden er for <i>høy</i>.","Wrong direction: we want to show that the phosphorus level is too <i>high</i>."],
    ["Tosidig alternativ; men problemet gjelder bare overskridelse av 0,15.","Two-sided alternative; but the problem only concerns exceeding 0.15."],
    null,
    ["Likhet hører hjemme i nullhypotesen, ikke i alternativet.","Equality belongs in the null hypothesis, not the alternative."]]},

{id:"P21-6b", t:8, s:"P21",
 q:[P_NO+PT_NO+" Gjennomsnittet av fosforinnholdet i 12 uavhengige prøver ble 0,158 mg/l. Utfør hypotesetesten. Hva blir konklusjonen?", P_EN+PT_EN+" The mean phosphorus content in 12 independent samples was 0.158 mg/l. Carry out the test. What is the conclusion?"],
 o:[["Testobservatoren er større enn kritisk verdi og vi forkaster ikke nullhypotesen.","The test statistic is larger than the critical value and we do not reject the null hypothesis."],
    ["Testobservatoren er mindre enn kritisk verdi og vi forkaster ikke nullhypotesen.","The test statistic is smaller than the critical value and we do not reject the null hypothesis."],
    ["Testobservatoren er mindre enn kritisk verdi og vi forkaster nullhypotesen.","The test statistic is smaller than the critical value and we reject the null hypothesis."],
    ["Testobservatoren er større enn kritisk verdi og vi forkaster nullhypotesen.","The test statistic is larger than the critical value and we reject the null hypothesis."]],
 a:1,
 f:["$Z=\\dfrac{\\bar{X}-\\mu_0}{\\sigma/\\sqrt{n}}$, forkast hvis $z\\geq z_\\alpha$", "$Z=\\dfrac{\\bar{X}-\\mu_0}{\\sigma/\\sqrt{n}}$, reject if $z\\geq z_\\alpha$"],
 w:["$\\sigma$ er kjent, så $z=\\frac{0{,}158-0{,}15}{0{,}02/\\sqrt{12}}=1{,}386$. Høyresidig test: kritisk verdi $z_{0{,}05}=1{,}645$. Siden $1{,}386<1{,}645$ forkaster vi ikke $H_0$.", "$\\sigma$ is known, so $z=\\frac{0.158-0.15}{0.02/\\sqrt{12}}=1.386$. Right-sided test: critical value $z_{0.05}=1.645$. Since $1.386<1.645$ we do not reject $H_0$."],
 x:[["$z=1{,}386$ er <i>mindre</i> enn 1,645. (Hvis den var større, ville vi forkastet.)","$z=1.386$ is <i>smaller</i> than 1.645. (If it were larger, we would reject.)"],
    null,
    ["I en høyresidig test forkaster vi bare når testobservatoren er <i>større</i> enn kritisk verdi.","In a right-sided test we reject only when the statistic is <i>larger</i> than the critical value."],
    ["$z=1{,}386$ er mindre enn kritisk verdi 1,645, så $H_0$ forkastes ikke.","$z=1.386$ is smaller than the critical value 1.645, so $H_0$ is not rejected."]]},

{id:"P21-6c", t:8, s:"P21", kind:"num",
 q:[P_NO+PT_NO+" Gjennomsnittet av fosforinnholdet i 12 uavhengige prøver ble 0,158 mg/l. Regn ut p-verdien til testen. Oppgi svaret med 4 desimaler.", P_EN+PT_EN+" The mean phosphorus content in 12 independent samples was 0.158 mg/l. Compute the p-value of the test. Give the answer with 4 decimals."],
 ans:0.0823, tol:0.0008,
 f:["$p=P(Z\\geq z_{\\text{obs}})=1-\\Phi(z_{\\text{obs}})$", "$p=P(Z\\geq z_{\\text{obs}})=1-\\Phi(z_{\\text{obs}})$"],
 w:["$z=\\frac{0{,}158-0{,}15}{0{,}02/\\sqrt{12}}=1{,}3856$. Høyresidig test: $p=P(Z\\geq 1{,}3856)\\approx 1-\\Phi(1{,}39)=1-0{,}9177=0{,}0823$ (tabell, som i LF). Uten avrunding av $z$ blir $p=0{,}0829$; begge godtas. $p>0{,}05$, så $H_0$ forkastes ikke.",
    "$z=\\frac{0.158-0.15}{0.02/\\sqrt{12}}=1.3856$. Right-sided test: $p=P(Z\\geq 1.3856)\\approx 1-\\Phi(1.39)=1-0.9177=0.0823$ (table, as in the official solution). Without rounding $z$, $p=0.0829$; both are accepted. $p>0.05$, so $H_0$ is not rejected."]},

{id:"P21-6d", t:8, s:"P21", kind:"num",
 q:[P_NO+PT_NO+" Testen forkaster $H_0$ når $z=\\frac{\\bar{x}-0{,}15}{0{,}02/\\sqrt{12}}\\geq 1{,}645$. Regn ut styrken til testen for alternativet $\\mu=0{,}17$ mg/l. Oppgi svaret med 4 desimaler.", P_EN+PT_EN+" The test rejects $H_0$ when $z=\\frac{\\bar{x}-0.15}{0.02/\\sqrt{12}}\\geq 1.645$. Compute the power of the test for the alternative $\\mu=0.17$ mg/l. Give the answer with 4 decimals."],
 ans:0.9656, tol:0.0003,
 f:["Styrke $=P\\left(\\bar{X}\\geq\\mu_0+z_\\alpha\\frac{\\sigma}{\\sqrt{n}}\\;\\middle|\\;\\mu=\\mu_1\\right)$", "Power $=P\\left(\\bar{X}\\geq\\mu_0+z_\\alpha\\frac{\\sigma}{\\sqrt{n}}\\;\\middle|\\;\\mu=\\mu_1\\right)$"],
 fig:{k:"pdf", curves:[{dist:"norm", mu:0.17, sigma:0.00577, name:["X̄ når μ=0,17","X̄ when μ=0.17"]},{dist:"norm", mu:0.15, sigma:0.00577, name:["X̄ under H0","X̄ under H0"]}], range:[0.13,0.195], shade:[[0.1595,null]], marks:[0.1595], xLabel:"x̄"},
 w:["Forkastningsgrensen uttrykt ved $\\bar{X}$: $\\bar{X}\\geq 0{,}15+1{,}645\\cdot\\frac{0{,}02}{\\sqrt{12}}=0{,}15+1{,}645\\cdot 0{,}00577=0{,}1595$. Når $\\mu=0{,}17$ er $\\bar{X}\\sim N(0{,}17,\\,0{,}00577^2)$. Styrke $=P(\\bar{X}\\geq 0{,}1595)=P\\left(Z\\geq\\frac{0{,}1595-0{,}17}{0{,}00577}\\right)=P(Z\\geq -1{,}82)=1-0{,}0344=0{,}9656$.",
    "Rejection limit in terms of $\\bar{X}$: $\\bar{X}\\geq 0.15+1.645\\cdot\\frac{0.02}{\\sqrt{12}}=0.15+1.645\\cdot 0.00577=0.1595$. When $\\mu=0.17$, $\\bar{X}\\sim N(0.17,\\,0.00577^2)$. Power $=P(\\bar{X}\\geq 0.1595)=P\\left(Z\\geq\\frac{0.1595-0.17}{0.00577}\\right)=P(Z\\geq -1.82)=1-0.0344=0.9656$."]},

{id:"P21-7a", t:0, s:"P21",
 q:[BC_NO+" Et kryssplott av dataene er vist. Den empiriske korrelasjonskoeffisienten mellom Hoeyde og Blodceller kan regnes ut, men du skal fra kryssplottet velge det korrekte utsagnet om den:", BC_EN+" A scatter plot of the data is shown. The empirical correlation coefficient between Hoeyde (height) and Blodceller (blood cells) could be computed, but choose from the scatter plot the correct statement about it:"],
 o:[["Den vil være mellom 0 og 1","It will be between 0 and 1"],["Den vil være mindre enn $-1$","It will be less than $-1$"],["Den vil være større enn 1","It will be greater than 1"],["Den vil være mellom 0 og $-1$","It will be between 0 and $-1$"]],
 a:0,
 fig:BC_FIG,
 w:["Punktskyen stiger: høyere utøvere har gjennomgående flere røde blodceller, men med mye spredning. Det er en klar positiv, men ikke perfekt, lineær sammenheng, så $0<r<1$. (Numerisk er $r=0{,}488$ for dette datasettet.)", "The point cloud rises: taller athletes tend to have more red blood cells, but with a lot of scatter. A clear positive but imperfect linear relationship, so $0<r<1$. (Numerically $r=0.488$ for this data set.)"],
 x:[null,
    ["En korrelasjonskoeffisient ligger alltid i $[-1,1]$.","A correlation coefficient always lies in $[-1,1]$."],
    ["En korrelasjonskoeffisient ligger alltid i $[-1,1]$.","A correlation coefficient always lies in $[-1,1]$."],
    ["Negativ korrelasjon ville betydd at punktene faller; her stiger de.","Negative correlation would mean the points fall; here they rise."]]},

{id:"P21-7b", t:9, s:"P21",
 q:[BCR_NO+"<br>Hva ble den estimerte regresjonslinja?", BCR_EN+"<br>What is the estimated regression line?"],
 o:[["$\\hat{y}=0{,}630+0{,}004x$","$\\hat{y}=0.630+0.004x$"],["$\\hat{y}=1{,}0669+0{,}630x$","$\\hat{y}=1.0669+0.630x$"],["$\\hat{y}=0{,}0199+0{,}004x$","$\\hat{y}=0.0199+0.004x$"],["$\\hat{y}=1{,}0669+0{,}0199x$","$\\hat{y}=1.0669+0.0199x$"],["$\\hat{y}=0{,}630+1{,}692x$","$\\hat{y}=0.630+1.692x$"],["$\\hat{y}=0{,}0199+5{,}669x$","$\\hat{y}=0.0199+5.669x$"]],
 a:3,
 fig:BC_FIG,
 w:["Koeffisientene står i kolonnen <i>coef</i>: $\\hat{\\beta}_0=1{,}0669$ (Intercept) og $\\hat{\\beta}_1=0{,}0199$ (Hoeyde). Altså $\\hat{y}=1{,}0669+0{,}0199x$: én cm høyere gir i snitt 0,0199 tera flere blodceller per liter.", "The coefficients are in the <i>coef</i> column: $\\hat{\\beta}_0=1.0669$ (Intercept) and $\\hat{\\beta}_1=0.0199$ (Hoeyde). So $\\hat{y}=1.0669+0.0199x$: one cm taller gives on average 0.0199 tera more blood cells per litre."],
 x:[["Dette er standardfeilene (std err), ikke estimatene.","These are the standard errors (std err), not the estimates."],
    ["0,630 er standardfeilen til konstantleddet, ikke stigningstallet.","0.630 is the standard error of the intercept, not the slope."],
    ["Bruker stigningstallet som konstantledd og dets standardfeil som stigningstall.","Uses the slope as intercept and its standard error as slope."],
    null,
    ["Standardfeil og t-verdi for konstantleddet, ikke estimatene.","Standard error and t value of the intercept, not the estimates."],
    ["Stigningstall og dets t-verdi; t-verdien er ikke en koeffisient.","Slope and its t value; the t value is not a coefficient."]]},

{id:"P21-7c", t:9, s:"P21",
 q:[BCR_NO+"<br>Hvilken hypotesetest utføres i utskriften i linjen som starter med «Hoeyde»?", BCR_EN+"<br>Which hypothesis test is carried out in the output row starting with “Hoeyde”?"],
 o:[["$H_0:\\beta_1=1$ mot $H_1:\\beta_1\\neq 1$","$H_0:\\beta_1=1$ vs $H_1:\\beta_1\\neq 1$"],
    ["$H_0:x\\leq y$ mot $H_1:x<y$","$H_0:x\\leq y$ vs $H_1:x<y$"],
    ["$H_0:\\beta_1=0{,}0199$ mot $H_1:\\beta_1\\neq 0{,}0199$","$H_0:\\beta_1=0.0199$ vs $H_1:\\beta_1\\neq 0.0199$"],
    ["$H_0:\\beta_1=0$ mot $H_1:\\beta_1<0$","$H_0:\\beta_1=0$ vs $H_1:\\beta_1<0$"],
    ["$H_0:\\beta_1=0$ mot $H_1:\\beta_1>0$","$H_0:\\beta_1=0$ vs $H_1:\\beta_1>0$"],
    ["$H_0:\\beta_1=0$ mot $H_1:\\beta_1\\neq 0$","$H_0:\\beta_1=0$ vs $H_1:\\beta_1\\neq 0$"],
    ["$H_0:\\beta_1=0{,}004$ mot $H_1:\\beta_1\\neq 0{,}004$","$H_0:\\beta_1=0.004$ vs $H_1:\\beta_1\\neq 0.004$"]],
 a:5,
 w:["Raden for kovariaten tester om stigningstallet er null: $H_0:\\beta_1=0$ mot $H_1:\\beta_1\\neq 0$, med $t=\\hat{\\beta}_1/SE(\\hat{\\beta}_1)=5{,}669$ og tosidig p-verdi $P>|t|$.", "The covariate row tests whether the slope is zero: $H_0:\\beta_1=0$ vs $H_1:\\beta_1\\neq 0$, with $t=\\hat{\\beta}_1/SE(\\hat{\\beta}_1)=5.669$ and two-sided p-value $P>|t|$."],
 x:[["Standardtesten har nullverdi 0, ikke 1.","The standard test has null value 0, not 1."],
    ["$x$ og $y$ er variabler, ikke parametere; dette er ingen gyldig hypotese.","$x$ and $y$ are variables, not parameters; this is not a valid hypothesis."],
    ["0,0199 er estimatet; hypoteser bruker ikke estimatet som nullverdi.","0.0199 is the estimate; hypotheses do not use the estimate as the null value."],
    ["Utskriften gir $P>|t|$, en tosidig test.","The output gives $P>|t|$, a two-sided test."],
    ["Utskriften gir $P>|t|$, en tosidig test, ikke ensidig.","The output gives $P>|t|$, a two-sided test, not one-sided."],
    null,
    ["0,004 er standardfeilen, ikke en nullverdi.","0.004 is the standard error, not a null value."]]},

{id:"P21-7d", t:9, s:"P21",
 q:[BCR_NO+"<br>Se på linjen som starter med «Hoeyde». Hvilket av følgende utsagn er korrekt?", BCR_EN+"<br>Look at the row starting with “Hoeyde”. Which of the following statements is correct?"],
 o:[["Kovariaten «Hoeyde» har ingen effekt i regresjonen","The covariate “Hoeyde” has no effect in the regression"],["Vi beholder nullhypotesen","We keep the null hypothesis"],["Vi forkaster nullhypotesen","We reject the null hypothesis"],["Stigningstallet er ikke forskjellig fra 0","The slope is not different from 0"]],
 a:2,
 w:["Testobservatoren er $t=5{,}669$, og Python oppgir p-verdien som 0,000 (svært liten), lavere enn 5 %. Vi forkaster $H_0:\\beta_1=0$: stigningstallet er forskjellig fra 0, og høyde har en effekt på antall blodceller. (95 %-intervallet [0,013; 0,027] inneholder heller ikke 0.)", "The test statistic is $t=5.669$, and Python reports the p-value as 0.000 (very small), below 5%. We reject $H_0:\\beta_1=0$: the slope differs from 0, and height has an effect on blood cell count. (The 95% interval [0.013, 0.027] does not contain 0 either.)"],
 x:[["p-verdien er nær 0, så vi har sterk evidens for at høyde <i>har</i> en effekt.","The p-value is near 0, so there is strong evidence that height <i>does</i> have an effect."],
    ["p ≈ 0 < 0,05, så $H_0$ forkastes.","p ≈ 0 < 0.05, so $H_0$ is rejected."],
    null,
    ["Vi forkaster $\\beta_1=0$; konfidensintervallet [0,013; 0,027] inneholder ikke 0.","We reject $\\beta_1=0$; the confidence interval [0.013, 0.027] does not contain 0."]]},

{id:"P21-8a", t:7, s:"P21",
 q:[LAB_NO+" Finn forventningsverdien til hver av de to estimatorene.", LAB_EN+" Find the expected value of each of the two estimators."],
 o:[["$E(\\hat{\\mu}_1)=\\mu$ og $E(\\hat{\\mu}_2)=\\mu$","$E(\\hat{\\mu}_1)=\\mu$ and $E(\\hat{\\mu}_2)=\\mu$"],
    ["$E(\\hat{\\mu}_1)=\\mu\\sigma_x^2$ og $E(\\hat{\\mu}_2)=\\mu\\sigma_y^2$","$E(\\hat{\\mu}_1)=\\mu\\sigma_x^2$ and $E(\\hat{\\mu}_2)=\\mu\\sigma_y^2$"],
    ["$E(\\hat{\\mu}_1)=\\mu$ og $E(\\hat{\\mu}_2)=0{,}36\\mu+0{,}64\\sigma_y$","$E(\\hat{\\mu}_1)=\\mu$ and $E(\\hat{\\mu}_2)=0.36\\mu+0.64\\sigma_y$"],
    ["$E(\\hat{\\mu}_1)=\\frac{1}{2}\\mu$ og $E(\\hat{\\mu}_2)=\\mu$","$E(\\hat{\\mu}_1)=\\frac{1}{2}\\mu$ and $E(\\hat{\\mu}_2)=\\mu$"]],
 a:0,
 f:["$E(a\\bar{X}+bY)=aE(\\bar{X})+bE(Y)$, $\\;E(\\bar{X})=\\mu$", "$E(a\\bar{X}+bY)=aE(\\bar{X})+bE(Y)$, $\\;E(\\bar{X})=\\mu$"],
 w:["$E(\\bar{X})=E(Y)=\\mu$. $E(\\hat{\\mu}_1)=\\frac{1}{2}(\\mu+\\mu)=\\mu$ og $E(\\hat{\\mu}_2)=0{,}36\\mu+0{,}64\\mu=\\mu$. Begge er forventningsrette fordi vektene summerer til 1.", "$E(\\bar{X})=E(Y)=\\mu$. $E(\\hat{\\mu}_1)=\\frac{1}{2}(\\mu+\\mu)=\\mu$ and $E(\\hat{\\mu}_2)=0.36\\mu+0.64\\mu=\\mu$. Both are unbiased because the weights sum to 1."],
 x:[null,
    ["Standardavvikene påvirker variansen, ikke forventningen.","The standard deviations affect the variance, not the expectation."],
    ["$E(Y)=\\mu$, ikke $\\sigma_y$.","$E(Y)=\\mu$, not $\\sigma_y$."],
    ["Glemte at $\\frac{1}{2}$ ganges med <i>summen</i> $\\mu+\\mu=2\\mu$.","Forgot that $\\frac{1}{2}$ multiplies the <i>sum</i> $\\mu+\\mu=2\\mu$."]]},

{id:"P21-8b", t:7, s:"P21", kind:"num",
 q:[LAB_NO+" Regn ut numerisk verdi for variansen til $\\hat{\\mu}_1$, når det oppgis at $\\bar{x}=67{,}2$ og $y=66{,}4$. Oppgi svaret med 2 desimaler.", LAB_EN+" Compute the numerical value of the variance of $\\hat{\\mu}_1$, given that $\\bar{x}=67.2$ and $y=66.4$. Give the answer with 2 decimals."],
 ans:0.25, tol:0.005,
 f:["$\\text{Var}\\left(\\tfrac{1}{2}(\\bar{X}+Y)\\right)=\\tfrac{1}{4}\\left(\\tfrac{\\sigma_x^2}{n}+\\sigma_y^2\\right)$", "$\\text{Var}\\left(\\tfrac{1}{2}(\\bar{X}+Y)\\right)=\\tfrac{1}{4}\\left(\\tfrac{\\sigma_x^2}{n}+\\sigma_y^2\\right)$"],
 w:["$\\text{Var}(\\hat{\\mu}_1)=\\left(\\frac{1}{2}\\right)^2\\left(\\frac{\\sigma_x^2}{9}+\\sigma_y^2\\right)=0{,}25\\cdot\\left(\\frac{2{,}4^2}{9}+0{,}6^2\\right)=0{,}25\\cdot(0{,}64+0{,}36)=0{,}25$. De observerte verdiene $\\bar{x}$ og $y$ trengs ikke: variansen avhenger bare av $\\sigma$-ene og $n$.", "$\\text{Var}(\\hat{\\mu}_1)=\\left(\\frac{1}{2}\\right)^2\\left(\\frac{\\sigma_x^2}{9}+\\sigma_y^2\\right)=0.25\\cdot\\left(\\frac{2.4^2}{9}+0.6^2\\right)=0.25\\cdot(0.64+0.36)=0.25$. The observed values $\\bar{x}$ and $y$ are not needed: the variance depends only on the $\\sigma$'s and $n$."]},

{id:"P21-8c", t:7, s:"P21",
 q:[LAB_NO+" Begge estimatorene er forventningsrette, $\\text{Var}(\\hat{\\mu}_1)=0{,}25$, og det oppgis at $\\text{Var}(\\hat{\\mu}_2)=0{,}23$. Hvilken av de to estimatorene vil du da foretrekke?", LAB_EN+" Both estimators are unbiased, $\\text{Var}(\\hat{\\mu}_1)=0.25$, and it is given that $\\text{Var}(\\hat{\\mu}_2)=0.23$. Which of the two estimators do you prefer?"],
 o:[["$\\hat{\\mu}_2$","$\\hat{\\mu}_2$"],["$\\hat{\\mu}_1$","$\\hat{\\mu}_1$"],["De er like gode","They are equally good"]],
 a:0,
 w:["Begge er forventningsrette, så vi velger den med minst varians (mest effektiv): $\\text{Var}(\\hat{\\mu}_2)=0{,}23<0{,}25=\\text{Var}(\\hat{\\mu}_1)$. Vi foretrekker $\\hat{\\mu}_2$, som gir mer vekt til det mest nøyaktige instrumentet.", "Both are unbiased, so we pick the one with the smallest variance (most efficient): $\\text{Var}(\\hat{\\mu}_2)=0.23<0.25=\\text{Var}(\\hat{\\mu}_1)$. We prefer $\\hat{\\mu}_2$, which gives more weight to the more precise instrument."],
 x:[null,
    ["$\\hat{\\mu}_1$ har større varians (0,25 > 0,23).","$\\hat{\\mu}_1$ has the larger variance (0.25 > 0.23)."],
    ["Begge er forventningsrette, men variansene er ulike, så de er ikke like gode.","Both are unbiased, but the variances differ, so they are not equally good."]]},

{id:"P21-8d", t:6, s:"P21",
 q:[LAB_NO+" Anta at laboranten velger å bruke estimatoren $\\hat{\\mu}_2$. Hvilken fordeling har estimatoren?", LAB_EN+" Assume the technician chooses the estimator $\\hat{\\mu}_2$. What distribution does the estimator have?"],
 o:[["Poisson-fordelt","Poisson distributed"],["Weibullfordelt","Weibull distributed"],["Geometrisk fordelt","Geometrically distributed"],["Normalfordelt","Normally distributed"],["Eksponentialfordelt","Exponentially distributed"],["Binomisk fordelt","Binomially distributed"]],
 a:3,
 w:["Hver $X_i$ er normalfordelt, så gjennomsnittet $\\bar{X}$ er normalfordelt. $\\hat{\\mu}_2=0{,}36\\bar{X}+0{,}64Y$ er en lineærkombinasjon av uavhengige normalfordelte variabler, og er derfor også normalfordelt.", "Each $X_i$ is normal, so the mean $\\bar{X}$ is normal. $\\hat{\\mu}_2=0.36\\bar{X}+0.64Y$ is a linear combination of independent normal variables, and is therefore also normal."],
 x:[["Poissonfordelingen er diskret (tellinger); $\\hat{\\mu}_2$ er kontinuerlig.","The Poisson distribution is discrete (counts); $\\hat{\\mu}_2$ is continuous."],
    ["Weibull brukes for levetider; en lineærkombinasjon av normalfordelte variabler er normalfordelt.","Weibull is used for lifetimes; a linear combination of normal variables is normal."],
    ["Geometrisk fordeling er diskret (antall forsøk til første suksess).","The geometric distribution is discrete (number of trials to first success)."],
    null,
    ["Eksponentialfordelingen gjelder ventetider og er bare positiv; her er målingene normalfordelte.","The exponential distribution models waiting times and is only positive; here the measurements are normal."],
    ["Binomisk fordeling er diskret (antall suksesser).","The binomial distribution is discrete (number of successes)."]]},

{id:"P21-9a", t:5, s:"P21", kind:"num",
 q:[LED_NO+" Hva er sannsynligheten for at et LED-lys av denne typen virker lenger enn 1 år? Oppgi svaret med 3 desimaler.", LED_EN+" What is the probability that an LED light of this type works longer than 1 year? Give the answer with 3 decimals."],
 ans:0.905, tol:0.0015,
 f:["$R(t)=P(T>t)=e^{-\\lambda t}$, $\\;\\lambda=1/E(T)$", "$R(t)=P(T>t)=e^{-\\lambda t}$, $\\;\\lambda=1/E(T)$"],
 fig:{k:"pdf", curves:[{dist:"exp", lambda:0.1}], range:[0,30], shade:[[1,null]], marks:[1], xLabel:["t (år)","t (years)"]},
 w:["$E(T)=1/\\lambda=10$ gir $\\lambda=0{,}1$ per år. $P(T>1)=R(1)=e^{-0{,}1}=0{,}905$.", "$E(T)=1/\\lambda=10$ gives $\\lambda=0.1$ per year. $P(T>1)=R(1)=e^{-0.1}=0.905$."]},

{id:"P21-9b", t:5, s:"P21", kind:"num",
 q:[LED_NO+" I et rom installeres 2 LED-lys av denne typen, med uavhengige levetider. Finn sannsynligheten for at minst ett LED-lys feiler i løpet av 1 år. Oppgi svaret med 3 desimaler.", LED_EN+" Two LED lights of this type are installed in a room, with independent lifetimes. Find the probability that at least one LED light fails within 1 year. Give the answer with 3 decimals."],
 ans:0.181, tol:0.0015,
 f:["$P(\\text{minst én feiler})=1-R(t)^2$", "$P(\\text{at least one fails})=1-R(t)^2$"],
 w:["Hvert lys overlever 1 år med sannsynlighet $e^{-0{,}1}=0{,}905$. La $X$ = antall lys som feiler; $X\\sim\\text{Bin}(2,\\,0{,}095)$. $P(X\\geq 1)=1-P(X=0)=1-0{,}905^2=0{,}181$.", "Each light survives 1 year with probability $e^{-0.1}=0.905$. Let $X$ = number of failed lights; $X\\sim\\text{Bin}(2,\\,0.095)$. $P(X\\geq 1)=1-P(X=0)=1-0.905^2=0.181$."]},

{id:"P21-9c", t:5, s:"P21", kind:"num",
 q:[LED_NO+" I et annet rom er det 6 LED-lys med uavhengige levetider. Hva er sannsynligheten for at alle LED-lysene virker i minst 5 år? Oppgi svaret med 3 desimaler.", LED_EN+" Another room has 6 LED lights with independent lifetimes. What is the probability that all the LED lights work for at least 5 years? Give the answer with 3 decimals."],
 ans:0.0498, tol:0.0015,
 f:["$P(T_1>t\\cap\\dots\\cap T_n>t)=R(t)^n$, $\\;R(t)=e^{-\\lambda t}$", "$P(T_1>t\\cap\\dots\\cap T_n>t)=R(t)^n$, $\\;R(t)=e^{-\\lambda t}$"],
 fig:{k:"sys", sys:["s","1","2","3","4","5","6"]},
 w:["At alle skal virke tilsvarer et seriesystem av 6 lys. $R_i(5)=e^{-0{,}1\\cdot 5}=e^{-0{,}5}=0{,}6065$. Uavhengighet gir $P=0{,}6065^6=e^{-3}=0{,}0498\\approx 0{,}050$.", "All working corresponds to a series system of 6 lights. $R_i(5)=e^{-0.1\\cdot 5}=e^{-0.5}=0.6065$. Independence gives $P=0.6065^6=e^{-3}=0.0498\\approx 0.050$."]}
);
})();
