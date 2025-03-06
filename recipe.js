const searchBox = document.querySelector('.searchBox');
const searchBtn = document.querySelector('.searchBtn');
const recipeContainer = document.querySelector('.recipe-container'); // Fixed class name
const recipeDetailsContent = document.querySelector('.recipe-details-content');
const recipeCloseBtn = document.querySelector('.recipe-close-btn');

// Fetch recipes from TheMealDB API
const fetchRecipes = async (query) => {
    recipeContainer.innerHTML = "<h2>Fetching Recipes...</h2>";
    try {
        const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`); // Fixed API URL
        const response = await data.json();

        // Debugging: Log the API response
        console.log(response);

        // Handle case where no meals are found
        if (!response.meals) {
            recipeContainer.innerHTML = "<h2>No recipes found. Try another search!</h2>";
            return;
        }

        recipeContainer.innerHTML = "";
        response.meals.forEach(meal => {
            const recipeDiv = document.createElement('div');
            recipeDiv.classList.add('recipe');
            recipeDiv.innerHTML = `
                <img src="${meal.strMealThumb}">
                <h3>${meal.strMeal}</h3>
                <p><span>${meal.strArea}</span> Dish</p>
                <h3>Belongs to <span>${meal.strCategory}</span></h3>
            `;

            const button = document.createElement('button');
            button.textContent = "View Recipe";
            recipeDiv.appendChild(button);

            // Add event listener to open recipe popup
            button.addEventListener('click', () => {
                openRecipePopup(meal);
            });

            recipeContainer.appendChild(recipeDiv);
        });
    } catch (error) {
        console.error("Error fetching recipes:", error);
        recipeContainer.innerHTML = "<h2>Error in Fetching Recipes...</h2>";
    }
};

// Fetch ingredients for a meal
const fetchIngredients = (meal) => {
    let ingredientsList = "";
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        if (ingredient) {
            const measure = meal[`strMeasure${i}`];
            ingredientsList += `<li>${measure} ${ingredient}</li>`;
        } else {
            break;
        }
    }
    return ingredientsList;
};

// Open recipe popup with details
const openRecipePopup = (meal) => {
    recipeDetailsContent.innerHTML = `
        <h2 class="recipeName">${meal.strMeal}</h2>
        <h3>Ingredients:</h3>
        <ul class="IngredientsList">${fetchIngredients(meal)}</ul>
        <div class="recipeInstructions">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
    `;
    recipeDetailsContent.parentElement.style.display = "block";
};

// Close recipe popup
recipeCloseBtn.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent form submission
    recipeDetailsContent.parentElement.style.display = "none";
});

// Handle search button click
searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const searchInput = searchBox.value.trim();

    // Debugging: Log the search input
    console.log("Search Input:", searchInput);

    if (!searchInput) {
        recipeContainer.innerHTML = "<h2>Type the meal in the search box.</h2>";
        return;
    }
    fetchRecipes(searchInput);
});