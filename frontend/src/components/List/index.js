// import List from './List.vue'
import './index.scss'
import app from '../../store/modules/app';

// создание элемента с классом
function createElem(elem, className) {
    let element = document.createElement(elem)
    element.classList.add(className)
    return element
}

//класс с текстом загрузки

class Loading{
    constructor(text){
        this.elem = createElem('p', 'loading');
        this.elem.innerText = text;
    }
}

//класс карточки новости

class Card {
    constructor(date, title, tags) {

        var card = createElem('div', 'news-card'),
            newsDate = createElem('div', 'news-date'),
            newsTitle = createElem('div', 'news-title'),
            newsTags = createElem('div', 'news-tags')

        card.appendChild(newsDate)
        card.appendChild(newsTitle)
        card.appendChild(newsTags)

        newsDate.innerText = date
        newsTitle.innerText = title
        newsTags.innerText = tags

        this.html = card
    }
}

//кнопка

class MoreBtn {
    constructor() {
        let btn = createElem('button', 'more-btn')
        this.btn = btn
        this.btn.innerText = 'Загрузить еще'
    }

    sendReq(url){
        return fetch(url)
    }

}

//форма поиска

class Search{
    constructor(){
        this.form = createElem('form', 'search-form')
        this.field = createElem('input', 'search-form__input')

        this.form.appendChild(this.field)

        this.form.setAttribute('action', '#')
        this.form.setAttribute('method', 'GET')

        this.field.placeholder = 'Поиск'
    }

    sendReq(){
        return fetch('https://api.myjson.com/bins/jsox8')
    }
}

export {
    Card,
    MoreBtn,
    Search,
    Loading
}
