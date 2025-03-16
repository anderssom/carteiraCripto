import listatabela from './lista.js';

// Formata a data para o padrão YYYYMMDD (formato aceito pela API)
function formatarDataParaAPI(data) {
    let dataObj = new Date(data);
    let ano = dataObj.getFullYear();
    let mes = String(dataObj.getMonth() + 1).padStart(2, '0');
    let dia = String(dataObj.getDate()).padStart(2, '0');
    return `${ano}${mes}${dia}`;
}

// Obtém a cotação do dólar usando a AwesomeAPI com base na data de venda
async function obterCotacaoDolar(data) {
    try {
        let dataFormatada = formatarDataParaAPI(data);
        let url = `https://economia.awesomeapi.com.br/json/daily/USD-BRL/?start_date=${dataFormatada}&end_date=${dataFormatada}`;
        console.log("URL da API do Dólar (AwesomeAPI):", url);

        let response = await fetch(url);
        let dataJson = await response.json();
        console.log("Resposta da API do Dólar:", dataJson);

        if (dataJson.length > 0) {
            return parseFloat(dataJson[0].bid);
        } else {
            console.warn("Nenhuma cotação encontrada para essa data. Buscando a mais recente...");
            return await obterCotacaoDolarMaisRecente();
        }
    } catch (error) {
        console.error("Erro ao obter cotação do dólar:", error);
    }
    return null;
}

// Obtém a última cotação disponível caso não tenha na data informada
async function obterCotacaoDolarMaisRecente() {
    try {
        let url = `https://economia.awesomeapi.com.br/json/daily/USD-BRL/?limit=1`;
        console.log("URL da API de última cotação:", url);

        let response = await fetch(url);
        let dataJson = await response.json();
        console.log("Resposta da API de última cotação:", dataJson);

        if (dataJson.length > 0) {
            return parseFloat(dataJson[0].bid);
        }
    } catch (error) {
        console.error("Erro ao obter última cotação do dólar:", error);
    }
    return null;
}

// Obtém a cotação do Bitcoin na data selecionada
async function obterCotacaoBitcoin(data) {
    try {
        let url = `https://api.coingecko.com/api/v3/coins/bitcoin/history?date=${data.split("-").reverse().join("-")}&localization=false`;
        console.log("URL da API do Bitcoin:", url);

        let response = await fetch(url);
        let dataJson = await response.json();
        console.log("Resposta da API do Bitcoin:", dataJson);

        if (dataJson.market_data) {
            return parseFloat(dataJson.market_data.current_price.usd);
        }
    } catch (error) {
        console.error("Erro ao obter cotação do Bitcoin:", error);
    }
    return null;
}

// Atualiza a cotação com base na data de compra ou venda
async function atualizarCotacao(event) {
    let dataSelecionada = event.target.value;

    if (event.target.id === "dataCompra" || event.target.id === "dataVenda") {
        let cotacaoBitcoin = await obterCotacaoBitcoin(dataSelecionada);
        
        if (event.target.id === "dataCompra") {
            document.getElementById("cotacaoCompra").value = cotacaoBitcoin ? cotacaoBitcoin.toFixed(2) : "N/A";
        } else if (event.target.id === "dataVenda") {
            document.getElementById("cotacaoVenda").value = cotacaoBitcoin ? cotacaoBitcoin.toFixed(2) : "N/A";

            // Atualiza a cotação do dólar baseada na data de venda
            let cotacaoDolar = await obterCotacaoDolar(dataSelecionada);
            document.getElementById("cotacaoDolar").value = cotacaoDolar ? cotacaoDolar.toFixed(2) : "N/A";
        }
    }
}

// Função para calcular os valores
function calcular() {
    let ativo = document.getElementById("ativo").value;
    let investimento = parseFloat(document.getElementById("investimento").value);
    let cotacaoCompra = parseFloat(document.getElementById("cotacaoCompra").value);
    let cotacaoVenda = parseFloat(document.getElementById("cotacaoVenda").value);
    let cotacaoDolar = parseFloat(document.getElementById("cotacaoDolar").value);

    if (isNaN(investimento) || isNaN(cotacaoCompra) || isNaN(cotacaoVenda) || isNaN(cotacaoDolar)) {
        alert("Por favor, preencha todos os campos corretamente!");
        return;
    }

    let valorCripto = (investimento / cotacaoDolar) / cotacaoCompra;
    let valorVenda = valorCripto * cotacaoVenda * cotacaoDolar;
    let lucro = valorVenda - investimento;
    let porcentagem = (lucro / investimento) * 100;


}

function Carteira() {
this.investimento = investimento;
this.cotacaoCompra = cotacaoCompra;
this.cotacaoVenda = cotacaoVenda;
this.cotacaoDolar = cotacaoDolar;
this.valorCripto = valorCripto;
this.valorVenda = valorVenda;
this.lucro = lucro;
this.porcentagem = porcentagem;
}

const carteira = new Carteiras(investimento, cotacaoCompra, cotacaoVenda, cotacaoDolar, valorCripto, valorVenda, lucro, porcentagem);

response.push(carteira);

// Eventos
document.querySelectorAll("input[type=date]").forEach(input => input.addEventListener("change", atualizarCotacao));

export default calcular;