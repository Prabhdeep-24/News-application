const API_KEY="4a37a500ebd14524a0218a9152fcea04";
const url="https://newsapi.org/v2/everything?q=";

window.addEventListener("load",()=> fetchNews('Latest'));

async function fetchNews(query){
    const result=await fetch(`${url}${query}&from=2025-01-01&sortBy=latest&popularity&apiKey=${API_KEY}`);
    const data=await result.json();
    if(data.totalResults==0){
        let head=document.createElement('h1');
        let search=document.querySelector('.bar');
        head.innerHTML=`No news found related to title ${search.value}`
        let main=document.querySelector('.main');
        main.appendChild(head);
    }
    console.log(data);
    bindData(data.articles);
}

function bindData(articles){
    const container=document.querySelector('.cards-container');
    const template=document.querySelector('template');
    container.innerHTML="";
    
    articles.forEach(article => {
        if(!article.urlToImage) return;
        const card=template.content.cloneNode(true); //clones all the elemnts inside it (deep cloning)
        fillData(card,article);
        container.appendChild(card);
    });
}


function fillData(card,article){
    let img=card.querySelector('#news-img');
    let title=card.querySelector('.title');
    let source=card.querySelector('#source');
    let desc=card.querySelector('.description');
    let cardele=card.querySelector('.card');
    const date=new Date(article.publishedAt).toLocaleString('en-US',{
        timeZone: 'Asia/Jakarta',
    });
    img.src=article.urlToImage;
    title.innerHTML=article.title;
    desc.innerHTML=article.description;
    source.innerHTML=`${article.source.name}: ${date}`;
    cardele.addEventListener('click',function(){
        window.open(article.url,'_blanck');
    })
}

// list.forEach(genre=> {
    //     genre.addEventListener('click',function(){
        //         let val=gen.innerHTML;
        //         // fetchNews(val);
        //         console.log(val);
        //     })
        // })
window.addEventListener('DOMContentLoaded',function(){
    let list=document.querySelectorAll('.list');
    // console.log(list);
    let currentActive=document.querySelector('.active');
    let search=document.querySelector('.bar');
    list.forEach(genre=>{
        genre.addEventListener('click',function(){
            fetchNews(genre.getAttribute('value'));
            let current=genre;
            current.classList.add('active');
            if(currentActive!=null){
                currentActive.classList.remove('active');
            }
            currentActive=current;
            search.value="";
            // console.log(genre.getAttribute('value'))
        })
    })

    const btn=document.querySelector('#btn');
    btn.addEventListener('click',function(e){
        if(!search.value) return;
        fetchNews(search.value);
        currentActive.classList.remove('active');
        currentActive=null;
        // console.log(search.value);
    })
    document.addEventListener('keyup',function(e){
        if(e.key=="Enter" && search.value){
            console.log(search.value);
            fetchNews(search.value);
            if(currentActive!=null){
                currentActive.classList.remove('active');
                currentActive=null;
            }
        }
    })
})
