let symbol = document.getElementById("stock-select")
let question = document.getElementById("question")
let responseBox = document.getElementById("response-box")

const url = "http://localhost:8080/chat/ai"

document.getElementById("submit-btn").addEventListener("click", sendPrompt)

async function getPriceObjectData(Ticker) {
    let url = `http://localhost:8080/testlistobject?symbol=${Ticker}` //RequestParam
    try {
        const response = await fetch(url)
        const data = await response.json(); // Jeg er et array [ ]
        //console.log(data)
    } catch (Error) {
        console.error("Something went wrong", Error)
    }

}

async function sendPrompt() {
    console.log("Her er vi i sendPrompt metoden")

    let requestBody = {
        prompt: question.value,
        symbol: symbol.value
    };
    getPriceObjectData(symbol.value)

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


