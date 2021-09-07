const createDescription = (parentElementId, text) => {
    const parentElement = document.getElementById(parentElementId);
    const element = document.createElement("div");
    element.classList.add("hide", "icon-description");
    element.innerText = text;
    parentElement.appendChild(element);
};

const showDescription = (elementId, text = "No text") => {
    const iconDescription = document.querySelector(`#${elementId} .icon-description`);
    if(!iconDescription){
        if(window.innerWidth > 815){
            createDescription(elementId, text);
            const iconDescription = document.querySelector(`#${elementId} .icon-description`);
            iconDescription.classList.toggle('hide');
        }
    }else{
        iconDescription.remove();
    }
};

const heartElement = document.getElementById("heart");
heartElement.addEventListener("mouseover", event => showDescription(event.target.id, "Thank you to taking your time!"));
heartElement.addEventListener("mouseout", event => showDescription(event.target.id));

const linkedinElement = document.getElementById("linkedin");
linkedinElement.addEventListener("mouseover", event => showDescription(event.target.id, "My Linkedin"));
linkedinElement.addEventListener("mouseout", event => showDescription(event.target.id));

const githubElement = document.getElementById("github");
githubElement.addEventListener("mouseover", event => showDescription(event.target.id, "The code"));
githubElement.addEventListener("mouseout", event => showDescription(event.target.id));