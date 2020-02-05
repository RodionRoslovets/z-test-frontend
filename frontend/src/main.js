// The Vue build version to load with the `import`
// command
//     (runtime - only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store/'

import '@/utils/filter' // global
import {
    getLang
} from '@/utils/i18n'
import {
    AppDeviceEnquire
} from '@/utils/mixin'
import {
    showNotyfications
} from '@/utils/notifications'
import {
    VueAxios
} from '@/utils/request'

import {
    Card,
    MoreBtn,
    Search,
    Loading
} from './components/List'
import Scheme from '@/components/Scheme'

// Vue.component('list', List)
Vue.component('scheme', Scheme)

// https://webpack.js.org/guides/dependency-management/#require-context
const requireComponent = require.context(
    './components',
    true,
    /Z[\w-]+\/index\.js$/
)

requireComponent.keys().forEach(fileName => {
    const componentConfig = requireComponent(fileName)
    const componentName = fileName.split('/')[1]
    Vue.component(componentName, componentConfig.default || componentConfig)
})

window.onerror = function (msg, url, lineNo, columnNo, error) {
    showNotyfications(`${msg}<br>${url}#${lineNo}`, {
        type: 'error'
    })
}

Vue.config.errorHandler = function (err, vm, info) {
    let errMsg = `Error: ${err.toString()}`
    let infoMsg = ''
    let componentMsg = ''

    if (info) {
        infoMsg = `\nInfo: ${info}`
    }

    if (vm.hasOwnProperty('$options')) {
        componentMsg = `\nVm component: ${vm.$options._componentTag}`
    }

    console.error(`${errMsg}\n${infoMsg}\n${componentMsg}`)
    showNotyfications(`${errMsg}<br>${infoMsg}<br>${componentMsg}`, {
        type: 'error'
    })
}

Vue.config.warnHandler = function (msg, vm, info) {
    let warnMsg = `Warn: ${msg.toString()}`
    let infoMsg = ''
    let componentMsg = ''

    if (info) {
        infoMsg = `\nInfo: ${info}`
    }

    if (vm.hasOwnProperty('$options')) {
        componentMsg = `\nVm component: ${vm.$options._componentTag}`
    }

    console.warn(`${warnMsg}\n${infoMsg}\n${componentMsg}`)
    showNotyfications(`${warnMsg}<br>${infoMsg}<br>${componentMsg}`, {
        type: 'alert'
    })
}

Object.defineProperty(Vue.prototype, '$bus', {
    get() {
        return this.$root.bus
    }
})

Vue.config.productionTip = false

Vue.use(VueAxios)

/* eslint-disable no-new */
new Vue({
    el: '#app',
    mixins: [AppDeviceEnquire],
    store,
    data: {
        lang: getLang(),
        bus: new Vue({}), // temp
        app: window.App
    },
    components: {
        App
    }
});

//------------------//

let app = document.getElementById('app'),
    searchForm = new Search(),
    loadText = new Loading('Загрузка...'),
    newsBlock = document.querySelector('.news');

app.prepend(loadText.elem)

app.prepend(searchForm.form)

searchForm.form.addEventListener('submit', (e)=>{
    e.preventDefault();

    searchForm.sendReq()
        .then(response => response.json())
        .then(response => {

            newsBlock.innerHTML = ''

            app.childNodes.forEach(node=>{
                if(node.classList.contains('more-btn')){
                    node.remove()
                }
            })

            renderNews(response.news, app, newsBlock)

        })
})

function renderNews(news, app, block, btn) {
    news.forEach(news => {

        let card = new Card(news.date, news.title, news.tags);

        if(!block.firstChild && news.image){
            card.card.classList.add('news-card__imaged')
            card.card.style.backgroundImage = 'url("./Rectangle_6.jpg")'
        }

        block.append(card.card);


    });

    btn ? app.append(btn) : null
}

fetch('https://api.myjson.com/bins/m4a6k')

    .then(response => response.json())

    .then(response => {

        if (response.page.total) {

            let newsCount = 0,
                moreBtn = new MoreBtn();

            app.removeChild(loadText.elem)

            renderNews(response.news, app, newsBlock, moreBtn.btn)

            moreBtn.btn.addEventListener('click', () => {

                moreBtn.btn.remove();

                moreBtn.sendReq('https://api.myjson.com/bins/m4a6k')
                    .then(resp => resp.json())
                    .then(resp => {

                        newsCount < resp.page.total ? renderNews(resp.news, app, newsBlock, moreBtn.btn) : null

                        newsCount++

                        newsCount === resp.page.total ? moreBtn.btn.remove() : null

                    })
            })

            newsCount++;

        } else {
            app.innerHTML = '<p>Данные отсутствуют</p>';
        }

    })
    .catch((err) => {

        app.innerHTML = '<p>К сожалению, что-то пошло не так...</p>';

        console.log(err);

    });
