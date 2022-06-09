const selectFromCurrency = document.getElementById("selectFromCurrency");
const selectToCurrency = document.getElementById("selectToCurrency");
const from = document.getElementById("from")
const showData = document.getElementById("dato")
const button = document.querySelector("button");
const host = "api.frankfurter.app";

let arrayObject = [];

const containerOperacion = document.querySelector(".container-operaciones");

const renderHistorial = () => {
    while (containerOperacion.firstChild) containerOperacion.removeChild(containerOperacion.firstChild);
    arrayObject.forEach(element => {

        const divHijo = document.createElement("div");
        divHijo.textContent = `${element.amount} ${element.originalCurrency} a ${element.result}  ${element.convertedCurrency} `
        containerOperacion.appendChild(divHijo);
    })

}



const getCurrencies = async () => {

    try {
        const datafetch = await fetch(`https://${host}/currencies`);
        const dataJson = await datafetch.json();
        const dataKey = Object.keys(dataJson);
        dataKey.forEach(data => {
            const option = document.createElement("option");
            const option2 = document.createElement("option");
            selectFromCurrency.appendChild(option)
            selectToCurrency.appendChild(option2)
            option.textContent = data;
            option2.textContent = data;
        })
    }
    catch (err) {
        console.log(err)
    }




}

window.addEventListener('load', () => {
    console.log('page is fully loaded');
    getCurrencies();
    if (localStorage.getItem("Operaciones")) {
        const valorLocalStorage = JSON.parse(localStorage.getItem("Operaciones"))
        arrayObject = valorLocalStorage;
        renderHistorial();
    }

});



const getConverted = async (amount, originalCurrency, convertedCurrency) => {


    try {

        if (originalCurrency === convertedCurrency || (!amount.trim())) {

            alert("No funciona, las monedas tiene que ser distintas y el imput tener un valor");
            return;
        }


        const fetchDato = await fetch(`https://${host}/latest?amount=${amount}&from=${originalCurrency}&to=${convertedCurrency}`);
        const datoJson = await fetchDato.json();
        showData.innerHTML = `${amount} ${originalCurrency} son  <p style="color:red">${datoJson.rates[convertedCurrency]} ${convertedCurrency}</p>`;


        arrayObject.push({ originalCurrency, convertedCurrency, amount, result: datoJson.rates[convertedCurrency] });

        localStorage.setItem("Operaciones", JSON.stringify(arrayObject));

        renderHistorial();

        // console.log(arrayObject)

    }
    catch (err) {
        console.log(err);
    }

}


button.addEventListener("click", () => {

    const amount = from.value;
    const originalCurrency = selectFromCurrency.value;
    const convertedCurrency = selectToCurrency.value;
    getConverted(amount, originalCurrency, convertedCurrency);
})







