import response from '../db/arrayDeAtivos.js';

  const listatabela = ()=>{
    let list = document.querySelector('[data-list]');
  
    // Exibe resultados
    document.getElementById("historico").insertAdjacentHTML("beforeend", `
        <tr>
            <td>${ativo}</td>
            <td>R$ ${investimento.toFixed(2)}</td>
            <td>${valorCripto.toFixed(8)}</td>
            <td>${document.getElementById("dataCompra").value}</td>
            <td>$${cotacaoCompra.toFixed(2)}</td>
            <td>${document.getElementById("dataVenda").value}</td>
            <td>$${cotacaoVenda.toFixed(2)}</td>
            <td>R$ ${valorVenda.toFixed(2)}</td>
            <td>R$ ${lucro.toFixed(2)}</td>
            <td>${porcentagem.toFixed(2)}%</td>
        </tr>
    `);