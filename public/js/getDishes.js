// fetch dishes
const fetchDishes = async (limit, skip) => {
    const response = await fetch(`http://192.168.1.36:8080/dishes?limit=${limit}&skip=${skip}`, {method: 'GET'});
    return response.json();
};

// render dishes
const renderDishes = (dishes) => {
    const dishList = document.querySelector('.dish-list');
    const containerElement = document.querySelector('.content');

    if(dishes.length === 0){
        observer.unobserve(loadMore);
        const messageElement = document.createElement('div');
        messageElement.innerHTML = `There are not dishes to show`;
        messageElement.classList.add('no-more-dishes', "center-element");
        containerElement.appendChild(messageElement);

        const loaderElement = document.querySelector('#loader');
        loaderElement.remove();
        return 
    }
    
    for(let dish of dishes){
        const aElement = document.createElement('a');
        aElement.href = `/dishes/${dish._id}`;
        dishList.appendChild(aElement);
        
        const dishCardElement = document.createElement('div');
        dishCardElement.classList.add('dish-card');
        dishCardElement.style.backgroundImage = `url('${dish.image.path}')`;
        aElement.appendChild(dishCardElement);

        const cardWrapperElement = document.createElement('div');
        cardWrapperElement.classList.add('dish-card-wrapper');
        dishCardElement.appendChild(cardWrapperElement);

        const titleElement = document.createElement('h5');
        titleElement.innerHTML = dish.title;
        cardWrapperElement.appendChild(titleElement);
    }
};

// get dishes
const loadMoreDishes = async (limit, skip) => {
    loadMore.classList.toggle('hide');
    const dishes = await fetchDishes(limit, skip);
    renderDishes(dishes);
    loadMore.classList.toggle('hide');
    page++    
};

let page = 0;

// observer
const observer = new IntersectionObserver((entries) => {
    if(entries[0].isIntersecting){
        loadMoreDishes(9 , page * 9);
    }
}, {threshold: 1});

// div to observe
const loadMore = document.querySelector('.load-more')
observer.observe(loadMore);
