
'use strict';

const title = document.querySelector(".js-title")
const ingredientsList = document.querySelector(".js-ingredientsList")
const items = document.querySelector(".js-items")
const subtotal = document.querySelector(".js-subtotal")
const shippingCost = document.querySelector(".js-shippingCost")
const total = document.querySelector(".js-total")
const buyButton = document.querySelector(".js-buyButton")

let ingredientsPrices = []
let ingredientActualPrice = {}

const getDataFromApi = () => {
    const endPoint = 'https://raw.githubusercontent.com/Adalab/recipes-data/master/rissoto-setas.json';
    fetch(endPoint)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            printRecipe(data)
        });
};

const printRecipe = data => {
    title.innerHTML = data.recipe.name
    const ingredients = data.recipe.ingredients
    let htmlCode = ""
    for (let i = 0; i < ingredients.length; i++) {
        htmlCode += `<li data-index=${i} >`
        htmlCode += "<input class='js-inputCheckbox' type='checkbox'/>"
        htmlCode += "<input class='js-inputNumber' name='quantity' min='0' type='number'/>"
        htmlCode += `<div> <h4> ${ingredients[i].product}</h4>`
        htmlCode += `<h5>${ingredients[i].brand === undefined ? "" : ingredients[i].brand}</h5>`
        htmlCode += `<h6>${ingredients[i].quantity}</h6> </div>`
        htmlCode += `<h3 class = 'js-ingredientPrice'>${ingredients[i].price}<span>€</span></h3> </li>`
    }
    ingredientsList.innerHTML = htmlCode
    listenToIngredients()
};

const changeTotalIngredientPrice = (value, price) => value * price


const getIngredientValues = event => {
    let inputValue = "0"
    if (event.target.type === "checkbox") {
        inputValue = parseFloat(event.target.nextSibling.value);
    } else if (event.target.type === "number") {
        inputValue = parseFloat(event.target.value)
    }

    let price = event.target.parentElement.lastElementChild.innerText;
    price = parseFloat(price.split("€")[0])

    let totalIngredientPrice = changeTotalIngredientPrice(inputValue, price)
    // hacer funcion de resta y llamarla en el if
    if (!event.target.checked) {
        totalIngredientPrice = totalIngredientPrice - (totalIngredientPrice * 2)
    } else {
        getTotalPrice(totalIngredientPrice)
    }
}

const getIngredientPrice = event => {
    const inputValue = parseFloat(event.target.value);
    const id = event.target.parentElement.dataset.index;
    let price = event.target.parentElement.lastElementChild.innerText;
    price = parseFloat(price.split("€")[0])

    ingredientActualPrice = {
        price: inputValue * price,
        id: id
    }

}

const printTotalPrice = (price) => {
    buyButton.innerHTML = price.toFixed(2)
}


const sumTotalPrice = () => {
    let totalPrice = ""
    for (let i = 0; i < ingredientsPrices.length; i++) {
        if (i === 0) {
            totalPrice = ingredientsPrices[i].price
        } else {
            totalPrice = ingredientsPrices[i].price + ingredientsPrices[i - 1].price
        }
    }
    return printTotalPrice(totalPrice)
}

const addPriceToArray = (event) => {
    const ingredientId = event.target.parentElement.dataset.index;
    if (event.target.checked) {
        ingredientsPrices.push(ingredientActualPrice)
    } else {
        for (let i = 0; i < ingredientsPrices.length; i++) {
            if (ingredientsPrices[i].id === ingredientId) {
                ingredientsPrices.splice(i, 1)
            }
        }

    }

    sumTotalPrice()
}

const listenToIngredients = () => {
    const ingredientsCheckbox = document.querySelectorAll(".js-inputCheckbox")
    for (const ingredient of ingredientsCheckbox) {
        ingredient.addEventListener('change', addPriceToArray);
    }

    const ingredientsNumber = document.querySelectorAll(".js-inputNumber")
    for (const ingredient of ingredientsNumber) {
        ingredient.addEventListener('change', getIngredientPrice)
    }
}

getDataFromApi();
printRecipe(data);




