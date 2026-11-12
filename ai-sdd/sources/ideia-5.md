# Financiamento com prestações fixas

A ideia é recriar um simulador que ta no site do Banco Central inclusive

siga o padrão visual e estrutural dos simuladores/calculadoras já implementados

sendo a formula:
q_0 = \frac{1 - (1+j)^{-n}}{j} \, p

Onde:
n = Nº de Meses
j = Taxa de Juros Mensal
p = Valor da Prestação
q0 = Valor Financiado

Obs.: O cálculo da taxa de juros (j) é feito por aproximação do Valor da Prestação (p) com margem de erro sobre p inferior a 0.000001.

inputs:
- n° de meses
- taxa de juros mensal (em %)
- Valor da prestação (Considera-se que a 1a. prestação não seja no ato)
- Valor financiado (O valor financiado não inclui o valor da entrada)

O usuário deve preencher 3 dos 4 campos, o output será o campo sobrando


## Exemplos de calculo


* Cálculo do nº de meses

Um cidadão está devendo R$ 2000,00, tendo ficado acertado que o tomador irá pagar juros de 1% ao mês. Sabendo que as parcelas serão de R$ 261,50, em quanto tempo o empréstimo será quitado?

Taxa de juros mensal = 1%
Valor da prestação = 261,50
Valor financiado = 2000
Clique em 'Calcular' para obter o nº de meses.

* Cálculo da taxa de juros mensal

Um cidadão está pensando em comprar um bem que custa à vista R$ 750,00. O vendedor oferece a opção de pagar em 10 parcelas fixas de R$ 86,00, sem entrada. Qual a taxa de juros embutido no financiamento?

Nº de meses = 10
Valor da prestação = 86
Valor financiado = 750
Clique em 'Calcular' para obter a taxa de juros mensal.

* Cálculo da prestação

A um cidadão é oferecido um bem no valor de R$ 1290,00. Para esse pacote, existe a opção de pagar em 4 prestações mensais fixas sem entrada, com taxa de juros de 1,99% ao mês. Qual o valor da prestação?

Nº de meses = 4
Taxa de juros mensal = 1,99
Valor financiado = 1290
Clique em 'Calcular' para obter o valor da prestação.

* Cálculo do valor financiado

Um bem está sendo vendido em 24 parcelas fixas R$ 935,00. Sabendo que a taxas de juros anunciada é de 1,99% ao mês, qual o valor do bem?

Nº de meses = 24
Taxa de juros mensal = 1,99
Valor da prestação = 935
Clique em 'Calcular' para obter o valor financiado.