let question = document.getElementById("question")
let symbol = document.getElementById("stock-select").value;
let responseBox = document.getElementById("response-box")
document.getElementById("stock-select").addEventListener("change", (event) => {
    symbol = event.target.value
})


const url = "http://localhost:8080/chat/ai"
const urlTwelveApi = "http://localhost:8080/twelveapi?symbol="



document.getElementById("submit-btn").addEventListener("click", async () => {
    sendPrompt()
    //getPriceData(symbol)
    getPriceObjectData(symbol)
    chart(symbol);
});


async function getPriceObjectData(Ticker) {
    let url = `http://localhost:8080/testlistobject?symbol=${Ticker}` //RequestParam
    try {
        const response = await fetch(url)
        const data = await response.json(); // Jeg er et array [ ]
        return data;
        //console.log(data)
    } catch (Error) {
        console.error("Something went wrong", Error)
    }

}

async function sendPrompt() {
    console.log("Her er vi i sendPrompt metoden")

    let requestBody = {
        prompt: question.value,
        symbol: symbol
    };
    //getPriceObjectData(symbol.value)

    const objectAsJsonString = JSON.stringify(requestBody); //stringify konverterer vores objekt til en JSON-streng

    console.log("ObjectAsJsonString: ", objectAsJsonString)
    const fetchOptions = { //Her definerer vi et objekt "fetchOptions" som beskriver hvordan vi vil sende data
        method: "POST",
        headers: {
            "Content-Type": "application/json", //Vi fortæller serveren, at vi sender JSON
        },
        body: objectAsJsonString, //Det er vores objekt konverteret til en JSON-streng som vi sender som data (i body) eller empty body med {}
    };

    try {
        const response = await fetch(url, fetchOptions);

        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }

        const data = await response.text(); // eller .json() hvis du returnerer JSON
        responseBox.innerText = data;
    } catch (error) {
        console.error("Fejl ved forespørgsel:", error);
        responseBox.innerText = "Ups! Noget gik galt.";
    }
}


 async function getPriceData(symbol) {
     const url = urlTwelveApi + symbol
     const response = await fetch(url);
     const data = await response.json();
     JSON.stringify(data)
     return data;
 }

async function chart(symbol) {
    //const stockData = await getPriceData(symbol);
    const stockData = await getPriceObjectData(symbol)
    console.log("stockdata", stockData)
    //const mappedData = stockData.values
    //console.log("mapped", stockData.meta.symbol)

    if (window.stockChartInstance) {
        window.stockChartInstance.destroy();
    }

    const ctx = document.getElementById('stockChart').getContext('2d');
    /*
    const candlestickData = mappedData.map(item => ({
        c: parseFloat(item.close),
        h: parseFloat(item.high),
        l: parseFloat(item.low),
        o: parseFloat(item.open),
        x: new Date(item.datetime).getTime()
    })).reverse();
     */
    const candlestickData = stockData.map(item => ({
        c: parseFloat(item.close),
        h: parseFloat(item.high),
        l: parseFloat(item.low),
        o: parseFloat(item.open),
        x: new Date(item.datetime).getTime()
    })).reverse();


    //console.log(candlestickData)
    window.stockChartInstance = new Chart(ctx, {
        type: 'candlestick',
        data: {
            datasets: [{
                //label: stockData.meta.symbol,
                label: symbol ,
                data: candlestickData,
                color: {
                    up: '#26a69a',
                    down: '#ef5350',
                    unchanged: '#ccc'
                }
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day',
                        tooltipFormat: 'P',
                    }
                },
                y: {
                    beginAtZero: false
                }
            }
        }
    });}
