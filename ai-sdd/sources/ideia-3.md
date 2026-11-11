# Calculadora de Imposto de Renda

Seguir a estruturação das anteriores

A calculadora do Imposto de Renda é uma ferramenta simples e prática para auxiliar os contribuintes a calcular o valor do imposto que será retido na fonte pagadora.

Em síntese, o IR consiste na retenção do Imposto de Renda diretamente na fonte pagadora, antes que o rendimento seja recebido pelo contribuinte.

Por isso, essa ferramenta é essencial para quem deseja saber com antecedência qual valor do imposto será deduzido para planejar suas finanças.

Para usar a calculadora do IR, basta inserir as informações sobre salário, dependentes, deduções e a calculadora irá fornecer a estimativa do valor do imposto a ser pago.

Entenda como é calculado o Imposto de Renda
O cálculo do IRRF na folha de pagamento é feito após deduzir a contribuição previdenciária oficial (INSS), além das demais deduções legais (dependentes, pensão, saúde e educação).

A fórmula legal da base de cálculo é:
Base de Cálculo = Salário Bruto – INSS – Deduções Legais

Em seguida, aplica-se a tabela progressiva oficial sobre a base apurada:
IR = (Base de Cálculo x alíquota %) / 100 - parcela a deduzir

Tabela Progressiva do INSS (Calculada Automaticamente):
- Até R$ 1.412,00: 7,5%
- De R$ 1.412,01 até R$ 2.666,68: 9,0%
- De R$ 2.666,69 até R$ 4.000,03: 12,0%
- De R$ 4.000,04 até R$ 7.786,02: 14,0% (Teto máximo: R$ 908,86)

Tabela Progressiva do IR (IRRF):
Faixa de Renda	Alíquota	Dedução
Até R$ 2.428,80	Isento	-
De R$ 2.428,81 até R$ 2.826,65	7,5%	R$ 182,16
De R$ 2.826,66 até R$ 3.751,05	15%	R$ 394,16
De R$ 3.751,06 até R$ 4.664,68	22,5%	R$ 675,49
Acima de R$ 4.664,68	27,5%	R$ 908,73
A fórmula básica para o cálculo do IR é:

IR = (Salário bruto – descontos) x (alíquota %) / 100 - parcela a deduzir

No Guia do Imposto de Renda você poderá tirar todas suas dúvidas sobre o IR. Como declarar, tabela progressiva do imposto, prazos e restituição. Além disso, você encontrará informações detalhadas sobre como declarar e esclarecer dúvidas sobre investimentos em ações, fundos imobiliários e outros ativos do mercado financeiro.

inputs:
- renda mensal bruta
- quantos dependentes tem
- gasto mensal com ensino
- gasto mensal com pensao alimenticia
- gasto mensal com despejas medicas

outputs:
- Quanto de imposto terei descontado? (texto no estilo dos outros)
- tres tabelas uma abaixo da outra (Entenda como ficou seu Imposto de Renda:)
    1. entrada e valores
    2. deduções e valores (inclui INSS calculado automaticamente, dependentes, pensão, saúde e ensino)
    3. base de calculo, aliquota e valor do imposto

sem graficos