
'use strict';

const title = document.querySelector(".js-title")
const ingredientsList = document.querySelector(".js-ingredientsList")
const items = document.querySelector(".js-items")
const subtotal = document.querySelector(".js-subtotal")
const shippingCost = document.querySelector(".js-shippingCost")
const total = document.querySelector(".js-total")
const buyButton = document.querySelector(".js-buyButton")



let ingredientsPrices = []
let ingredientsToSum = []

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

const sumTotalPrice = () => {
    let subtotalPrice = 0

    for (let i = 0; i < ingredientsToSum.length; i++) {
        if (i === 0) {
            subtotalPrice = ingredientsToSum[i].price
        } else {
            subtotalPrice = subtotalPrice + ingredientsToSum[i].price
        }
    }
    printPrices(subtotalPrice)
}

const addPriceToArray = (ingredientActualPrice) => {
    let repeatedIngredient = ingredientsPrices.findIndex(ingredient => ingredient.id === ingredientActualPrice.id)
    if (ingredientsPrices.length === 0) {
        ingredientsPrices.push(ingredientActualPrice)
    } else {

        if (repeatedIngredient >= 0) {
            ingredientsPrices.splice(repeatedIngredient, 1)
        }
        ingredientsPrices.push(ingredientActualPrice)
    }
    if (event.target.previousElementSibling.checked) {

        for (const ingredient of ingredientsPrices) {
            if (ingredientsToSum.length === 1) {
                ingredientsToSum.splice(0, 1)
                ingredientsToSum.push(ingredient)
            } else if (ingredient.id === ingredientsToSum[repeatedIngredient].id) {
                ingredientsToSum.splice(repeatedIngredient, 1)
                ingredientsToSum.push(ingredient)
            }
        }
    }
    sumTotalPrice()

}

const printPrices = (subtotalPrice) => {
    if (subtotalPrice > 0) {
        const total = subtotalPrice + 7
        subtotal.innerHTML = subtotalPrice.toFixed(2)
        buyButton.innerHTML = total.toFixed(2)
    } else {
        subtotal.innerHTML = '0'
        buyButton.innerHTML = '0'
    }
}

const addIngredientsToSum = (event) => {
    const ingredientIdSelected = event.target.parentElement.dataset.index
    if (event.target.checked) {
        for (const ingredient of ingredientsPrices) {
            if (ingredient.id === ingredientIdSelected) {
                ingredientsToSum.push(ingredient)
            }
        }
    } else {
        let repeatedIngredient = ingredientsToSum.findIndex(ingredient => ingredient.id === ingredientIdSelected)
        if (repeatedIngredient >= 0) {
            ingredientsToSum.splice(repeatedIngredient, 1)
        }
    }
    sumTotalPrice()
}



const listenToIngredients = () => {
    const ingredientsCheckbox = document.querySelectorAll(".js-inputCheckbox")
    for (const ingredient of ingredientsCheckbox) {
        ingredient.addEventListener('change', addIngredientsToSum);
    }

    const ingredientsNumber = document.querySelectorAll(".js-inputNumber")
    for (const ingredient of ingredientsNumber) {
        ingredient.addEventListener('change', getIngredientPrice)
    }
}

getDataFromApi();
printRecipe(data);




