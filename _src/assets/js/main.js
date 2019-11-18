
'use strict';

const selectAll = document.querySelector(".js-selectAll")
const deselectAll = document.querySelector(".js-deselectAll")
const title = document.querySelector(".js-title")
const ingredientsList = document.querySelector(".js-ingredientsList")
const items = document.querySelector(".js-totalItems")
const subtotal = document.querySelector(".js-subtotal")
const shippingCost = document.querySelector(".js-shippingCost")
const totalPrice = document.querySelector(".js-total")
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

const getStartValues = () => {
    const ingredientsListArray = [...document.querySelectorAll(".js-list")];
    for (const ingredient of ingredientsListArray) {
        let price = parseFloat(ingredient.lastElementChild.innerText.split("€")[0])
        ingredientsPrices.push({
            price: price,
            value: 1,
            id: ingredient.dataset.index,
        })
    }

}

const printRecipe = data => {
    title.innerHTML = data.recipe.name
    const ingredients = data.recipe.ingredients
    let htmlCode = ""
    for (let i = 0; i < ingredients.length; i++) {
        htmlCode += `<li data-index=${i} class="ingredients__list js-list ${i % 2 === 0 ? "" : "ingredients__list-background"} ">`
        htmlCode += "<div class='ingredients__data'><input class='ingredients__checkbox js-inputCheckbox' type='checkbox'/>"
        htmlCode += "<input class='ingredients__input js-inputNumber ' value='1' placeholder='1' name='quantity' min='1' type='number'/>"
        htmlCode += `<div class="ingredients__info"> <h4 class="ingredients__info-title"> ${ingredients[i].product}</h4>`
        htmlCode += `<h5 class="ingredients__info-brand">${ingredients[i].brand === undefined ? "" : ingredients[i].brand}</h5>`
        htmlCode += `<h6 class="ingredients__info-quantity">${ingredients[i].quantity}</h6> </div> </div>`
        htmlCode += `<h3 class = 'ingredients__price js-ingredientPrice '>${ingredients[i].price} €</h3> </li>`
    }
    ingredientsList.innerHTML = htmlCode
    getStartValues()
    listenToIngredients()
};


const getIngredientPrice = event => {
    let ingredientActualPrice = {}
    const inputValue = parseFloat(event.target.value);
    const id = event.target.parentElement.parentElement.dataset.index;
    let price = event.target.parentElement.parentElement.lastElementChild.innerText;
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
        } else { subtotalPrice = subtotalPrice + ingredientsToSum[i].price }
    }
    printPrices(subtotalPrice)
}

const addPriceToArray = (ingredientActualPrice) => {
    let repeatedIngredient = ingredientsPrices.findIndex(ingredient => ingredient.id === ingredientActualPrice.id)
    if (ingredientsPrices.length === 0) {
        ingredientsPrices.push(ingredientActualPrice)
    } else {
        ingredientsPrices.splice(repeatedIngredient, 1)
        ingredientsPrices.push(ingredientActualPrice)
    }
    if (event.target.previousElementSibling.checked) {
        const repeatedIngredientToSum = ingredientsToSum.findIndex(ingredient => ingredient.id === ingredientActualPrice.id)
        ingredientsToSum.splice(repeatedIngredientToSum, 1)
        ingredientsToSum.push(ingredientActualPrice)
    }
    countTotalItems()
    sumTotalPrice()

}

const printPrices = (subtotalPrice) => {
    if (subtotalPrice > 0) {
        const total = subtotalPrice + 7
        subtotal.innerHTML = subtotalPrice.toFixed(2) + " €"
        totalPrice.innerHTML = total.toFixed(2) + " €"
        buyButton.innerHTML = total.toFixed(2) + " €"
    } else {
        subtotal.innerHTML = '0';
        totalPrice.innerHTML = '0';
        buyButton.innerHTML = ' ';
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
    const ingredientIdSelected = event.target.parentElement.parentElement.dataset.index
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
    ingredientsToSum = [];
    for (const ingredient of ingredientsPrices) {
        ingredientsToSum.push(ingredient)
    }
    countTotalItems();
    sumTotalPrice();

}

const deselectAllIngredients = () => {
    const ingredientsCheckboxToArray = [...document.querySelectorAll(".js-inputCheckbox")];
    ingredientsCheckboxToArray.map(ingredient => {
        if (ingredient.checked) {
            return ingredient.checked = false
        }
    })
    ingredientsToSum = [];
    countTotalItems();
    sumTotalPrice();
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




