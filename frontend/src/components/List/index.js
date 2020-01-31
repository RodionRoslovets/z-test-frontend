// import List from './List.vue'
import "./index.scss";

class Card {
    constructor(date, title, tags) {

        function createElem(elem, className) {
            let element = document.createElement(elem);
            element.classList.add(className);
            return element;
        }

        let card = createElem('div', 'news-card'),
            newsDate = createElem('div', 'news-date'),
            newsTitle = createElem('div', 'news-title'),
            newsTags = createElem('div', 'news-tags');

        card.appendChild(newsDate);
        card.appendChild(newsTitle);
        card.appendChild(newsTags);

        newsDate.innerText = date;
        newsTitle.innerText = title;
        newsTags.innerText = tags;

        this.html = card;
    }
}

class MoreBtn {
    constructor() {
        let btn = document.createElement('button');

        btn.classList.add('more-btn');

        btn.innerText = 'Загрузить еще';

        this.html = btn;
    }
}

export { Card, MoreBtn };