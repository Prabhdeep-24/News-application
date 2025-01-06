const API_KEY="301cdd3e29c422dc78df000fb955a3e4";
const url="https://gnews.io/api/v4/search?q="

window.addEventListener("load",()=> fetchNews('Latest'));

async function fetchNews(query){

    const result = await fetch(`${url}${query}&lang=en&country=in&apikey=${API_KEY}`);
    const data=await result.json();
    console.log(data.articles);
    let ele=document.querySelector('.no');
    if(data.articles.length==0){
        let head=document.createElement('h1');
        head.setAttribute('class','no');
        let search=document.querySelector('.bar');
        head.innerHTML=`No news found related to title ${search.value}`
        let main=document.querySelector('.main');
        main.appendChild(head);
    }
    else if(ele){
        ele.remove();
    }
    const articles=data.articles.map(article=>{
        const relevance=relevent(article,query);
        return{...article,relevance};
    })
    articles.sort((a,b)=> b.relevance-a.relevance);
    bindData(articles);
}

//to calculate the relevance of the news with the topic
function relevent(article,query){
    if(!article.title || !article.description) return 0;
    let topic=query.toLowerCase();
    let title=article.title.toLowerCase();
    let desc=article.description.toLowerCase();

    const score=(title.includes(topic)?1:0)+(desc.includes(topic)?1:0);
    return score;
}

function bindData(articles){
    const container=document.querySelector('.cards-container');
    const template=document.querySelector('template');
    
    articles.forEach(article => {
        if(!article.image) return;
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
    img.src=article.image;
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
