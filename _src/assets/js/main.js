
'use strict';

const selectAll = document.querySelector(".js-selectAll")
const deselectAll = document.querySelector(".js-deselectAll")
const title = document.querySelector(".js-title")
const ingredientsList = document.querySelector(".js-ingredientsList")
const items = document.querySelector(".js-totalItems")
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
            printRecipe(data)
        });
};

const printRecipe = data => {
    title.innerHTML = data.recipe.name
    const ingredients = data.recipe.ingredients
    let htmlCode = ""
    for (let i = 0; i < ingredients.length; i++) {
        htmlCode += `<li data-index=${i} class="ingredients__list row">`
        htmlCode += "<input class='ingredients__checkbox js-inputCheckbox col-1' type='checkbox'/>"
        htmlCode += "<input class='ingredients__input js-inputNumber col-1' placeholder='1' name='quantity' min='0' type='number'/>"
        htmlCode += `<div class="ingredients__info col-8"> <h4> ${ingredients[i].product}</h4>`
        htmlCode += `<h5>${ingredients[i].brand === undefined ? "" : ingredients[i].brand}</h5>`
        htmlCode += `<h6>${ingredients[i].quantity}</h6> </div>`
        htmlCode += `<h3 class = 'ingredients__price js-ingredientPrice col-2'>${ingredients[i].price}<span>€</span></h3> </li>`
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
        value: inputValue,
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

const countTotalItems = () => {
    let totalItems = 0
    for (const item of ingredientsToSum) {
        totalItems = totalItems + item.value
    }
    items.innerHTML = totalItems
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
    countTotalItems()
    sumTotalPrice()
}



const selectAllIngredients = () => {
    const ingredientsCheckboxToArray = [...document.querySelectorAll(".js-inputCheckbox")];
    ingredientsCheckboxToArray.map(ingredient => {
        if (!ingredient.checked) {
            return ingredient.checked = true
        }
    })
}

const deselectAllIngredients = () => {
    const ingredientsCheckboxToArray = [...document.querySelectorAll(".js-inputCheckbox")];
    ingredientsCheckboxToArray.map(ingredient => {
        if (ingredient.checked) {
            return ingredient.checked = false
        }
    })
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

selectAll.addEventListener('click', selectAllIngredients)
deselectAll.addEventListener('click', deselectAllIngredients)
getDataFromApi();
printRecipe(data);




