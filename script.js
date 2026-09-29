console.log("SCRIPT LOADED");
const wikiMediaAPI = "https://en.wikipedia.org/api/rest_v1/page/summary/Earth";
let stIdx;
let mostviewed;
let currTitle;
let n = 12;     //no. of relLinks 

let getRandomArticles = async ()=>{
    // random 2
    // let response = await fetch("https://en.wikipedia.org/w/api.php?action=query&list=random&rnnamespace=0&rnlimit=2&format=json&origin=*");

    //most viewed

    let response = await fetch("https://en.wikipedia.org/w/api.php?action=query&list=mostviewed&pvimlimit=150&format=json&origin=*")
    let data = await response.json();

    if (!response.ok || data.error) {
        console.log(data);
        throw new Error("Wikipedia API failed");
    }

    return data.query.mostviewed;
}
let setEndPoints = async ()=>{
    mostviewed = await getRandomArticles();
    // console.log(mostviewed)
    stIdx = Math.floor(Math.random()*mostviewed.length);

    while(true){
        let response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(mostviewed[stIdx].title)}`);
        let data = await response.json();

        if(!data.thumbnail || !data.description || data.type!="standard"){
            stIdx = Math.floor(Math.random()*mostviewed.length);
        }else{
            break;
        }
    }
    let endIdx = stIdx;
    currTitle = mostviewed[stIdx].title;

    while(stIdx==endIdx){
        endIdx = Math.floor(Math.random()*mostviewed.length);
            while(true){
                let response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(mostviewed[endIdx].title)}`);
                let data = await response.json();

                if(!data.thumbnail || !data.description || data.type!="standard"){
                    endIdx = Math.floor(Math.random()*mostviewed.length);
                }else{
                    break;
                }
            }
    }

    let response1 = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(mostviewed[stIdx].title)}`);
    let response2 = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(mostviewed[endIdx].title)}`);
    let data1 = await response1.json();
    let data2 = await response2.json();

    document.querySelector("#startTitle").innerText = "Title: " + data1.title;
    document.querySelector("#currTitle").innerText = "Title: " + data1.title;
    document.querySelector("#endTitle").innerText = "Title: " + data2.title;

    document.querySelector("#startDescript").innerText = data1.description;
    document.querySelector("#currDescript").innerText = data1.description;
    document.querySelector("#endDescript").innerText = data2.description;

    document.querySelector("#startPoint img").src = data1.thumbnail?.source || "";
    document.querySelector("#curr img").src = data1.thumbnail?.source || "";
    document.querySelector("#endPoint img").src = data2.thumbnail?.source || "";

    // console.log(data1);
    // console.log(data2);
}

setEndPoints();




// let getCurrArticle = async ()=>{
//     let response = await fetch("https://en.wikipedia.org/w/api.php?action=query&list=mostviewed&pvimlimit=50&format=json&origin=*")
//     let data = await response.json();
//     console.log(data);

//     return data.query.mostviewed;
// }

// let setCurr = async ()=>{
//     let mostviewed = await getNextArticle();

//     let randomIdx = Math.floor(Math.random()*mostviewed.length);

//     let response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(mostviewed[randomIdx].title)}`);
//     let data = await response.json();

//     document.querySelector("#currTitle").innerText = data.title;

//     document.querySelector("#currDescript").innerText = data.description;

//     document.querySelector("#curr img").src = data.thumbnail?.source || "";
// }

let getRelLinks = async () =>{
    let response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=links&titles=${encodeURIComponent(currTitle)}&plnamespace=0&pllimit=max&format=json&origin=*`);
    let relLinks = await response.json();


    return relLinks;
}

let showRelLinks = async ()=>{
    currRelLinks.replaceChildren();
    let relLinks = await getRelLinks();

    let pageid = Object.values(relLinks.query.pages)[0];
    console.log(relLinks);
    // console.log(relLinks.contnet_urls.desktop.page);
    // console.log(pageid.links[0].title);

    let titles = pageid.links.map(link=>link.title);
    titles.sort(()=>{
        return Math.random()-0.5;
    })

    let validTitles = [];

    for (let title of titles){
        let response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
        let data = await response.json();

        if(data.thumbnail && data.description && data.type=="standard"){
            validTitles.push(title);
        }
        if(validTitles.length==n){
            break;
        }
    }

    for(let i=0; i<n; i++){
        let btn = document.createElement("button");
        btn.innerText = `${validTitles[i]}`;
        btn.classList.add("relLinkBtns");
        
        btn.addEventListener("click", async ()=>{
            currTitle = btn.innerText;

            let response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(currTitle)}`);
            let data = await response.json();
            console.log(data);
            document.querySelector("#currTitle").innerText = data.title;
            document.querySelector("#currDescript").innerText = data.description;
            document.querySelector("#curr img").src = data.thumbnail?.source || "";

            showRelLinks();
        })
        currRelLinks.append(btn);
    }
    setBtns();
}

function setBtns(){
    let rad = 280; //px
    let relLinkBtns = document.querySelectorAll(".relLinkBtns");
    let theta = 360/n;


    for(let i=0; i<n; i++){
        let currTheta = i*theta*Math.PI/180;
        let x = rad*Math.cos(currTheta);
        let y = rad*Math.sin(currTheta);

        relLinkBtns[i].style.position = "absolute";
        relLinkBtns[i].style.top = `${y}px`;        
        relLinkBtns[i].style.left = `${x}px`; 
        relLinkBtns[i].style.transform = "translate(-50%, -50%)";       
    }
}
let nextBtn = document.querySelector("#next");
let relLinksBtn = document.querySelector("#relLinks");
let currRelLinks = document.querySelector("#currRelLinks");

// nextBtn.addEventListener("click",setNext);

relLinksBtn.addEventListener("click",showRelLinks);

document.querySelector("#restart").addEventListener("click", setEndPoints)
