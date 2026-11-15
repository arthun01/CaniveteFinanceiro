# Calculadora de margem de Lucro

A ideia é criar uma calculadora de margem de lucro na compra e venda de um produto

se eu compro um item x a 5 reais e vendo por 15 eu tenho um lucro bruto de 10 reais, uma margem de lucro de 66,7% e tenho um markup de 200%

• Lucro Bruto. É a diferença direta entre o preço de venda e o custo de aquisição. O cálculo é \(\text{R\$ } 15,00 - \text{R\$ } 5,00 = \mathbf{\text{R\$ } 10,00}\).
• Margem de Lucro (Bruta). Representa quanto do preço final de venda sobra como lucro. O cálculo é \((\text{R\$ } 10,00 \div \text{R\$ } 15,00) \times 100 = \mathbf{66,67\%}\).
• Markup Multiplicador. Mostra por quanto você multiplicou o custo para chegar ao preço de venda. O cálculo é \(\text{R\$ } 15,00 \div \text{R\$ } 5,00 = \mathbf{3}\) (você vendeu pelo triplo do custo).
• Markup Percentual. Mostra quanto você adicionou em porcentagem sobre o valor de custo. O cálculo é \([(\text{R\$ } 15,00 - \text{R\$ } 5,00) \div \text{R\$ } 5,00] \times 100 = \mathbf{200\%}\).

então quero que a calculadora reflita tudo isso

inputs:
- quantos itens (opcional, se não preencher considere como 1 apenas)
- valor de compra (precisa preencher)
- valor de venda (pode deixar em branco para ser o resultado)
- margem lucro (em porcentagem) (pode deixar em branco para ser o resultado)


outputs:
- gasto total com a compra
- valor total da venda
- lucro bruto
- margem de lucro
- markup multiplicador
- markup percentual

segue o padrão de gráficos, explicações e afins 