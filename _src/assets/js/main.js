
'use strict';

const title = document.querySelector(".js-title")
const ingredientsList = document.querySelector(".js-ingredientsList")
const items = document.querySelector(".js-items")
const subtotal = document.querySelector(".js-subtotal")
const shippingCost = document.querySelector(".js-shippingCost")
const total = document.querySelector(".js-total")
const buyButton = document.querySelector(".js-buyButton")

let ingredientsPrices = []

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


const getIngredientPrice = event => {
    let ingredientActualPrice = {}
    const inputValue = parseFloat(event.target.value);
    const id = event.target.parentElement.dataset.index;
    let price = event.target.parentElement.lastElementChild.innerText;
    price = parseFloat(price.split("€")[0])

    ingredientActualPrice = {
        price: inputValue * price,
        id: id
    }

    addPriceToArray(ingredientActualPrice)
}

const addPriceToArray = (ingredientActualPrice) => {

    if (ingredientsPrices.length === 0) {
        ingredientsPrices.push(ingredientActualPrice)
    } else {
        let repeatedIngredient = ingredientsPrices.findIndex(ingredient => ingredient.id === ingredientActualPrice.id)
        if (repeatedIngredient >= 0) {
            ingredientsPrices.splice(repeatedIngredient, 1)
        }
        ingredientsPrices.push(ingredientActualPrice)
    }
    sumTotalPrice()
}




const printPrices = (subtotalPrice) => {
    const total = subtotalPrice + 7
    subtotal.innerHTML = subtotalPrice.toFixed(2)
    buyButton.innerHTML = total.toFixed(2)
}


const sumTotalPrice = () => {
    let subtotalPrice = ""
    for (let i = 0; i < ingredientsPrices.length; i++) {
        if (i === 0) {
            subtotalPrice = ingredientsPrices[i].price
        } else {
            subtotalPrice = subtotalPrice + ingredientsPrices[i].price
        }
    }
    return printPrices(subtotalPrice)
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




