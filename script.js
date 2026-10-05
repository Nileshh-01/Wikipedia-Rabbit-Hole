let stIdx;
let mostviewed;
let currTitle;
let n = 12;     //no. of relLinks 
let rabbitHoleDepth = 0;
let allowedDepth = 30;  //by default easy level
let allowedDepthEasy = 30;
let allowedDepthMed = 20;
let allowedDepthHard = 10;
let endTitle;
let visited = [];
let visitedSrc = [];


let getRandomArticles = async ()=>{
    let response = await fetch("https://wikimedia.org/api/rest_v1/metrics/pageviews/top/en.wikipedia.org/all-access/2026/09/all-days");
    let data = await response.json();

    // console.log(data);
    // console.log(data.items[0].articles[9].article)

    return data.items[0].articles.map(x=>x.article.replaceAll("_"," "));
}
let setEndPoints = async ()=>{
    document.querySelector("#depth").textContent = rabbitHoleDepth;
    mostviewed = await getRandomArticles();

    stIdx = Math.floor(Math.random()*mostviewed.length);

    while(true){

        let response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(mostviewed[stIdx])}`);
        let data = await response.json();

        if(!data.thumbnail || !data.description || data.type!="standard"){
            stIdx = Math.floor(Math.random()*mostviewed.length);
        }else{
            break;
        }
    }
    let endIdx = stIdx;
    currTitle = mostviewed[stIdx];



    async function enoughBackLinks(title, minLinks=30) {
        let response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=backlinks&bltitle=${encodeURIComponent(title)}&bllimit=${minLinks}&blnamespace=0&format=json&origin=*`);
        let data = await response.json();

        return data.query.backlinks.length>=minLinks;
    }


    while(stIdx==endIdx){
        endIdx = Math.floor(Math.random()*mostviewed.length);
            while(true){
                let response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(mostviewed[endIdx])}`);
                let data = await response.json();

                if(!data.thumbnail || !data.description || data.type!="standard" || !enoughBackLinks(mostviewed[endIdx])){
                    endIdx = Math.floor(Math.random()*mostviewed.length);
                }else{
                    endTitle = data.title;
                    break;
                }
            }
    }


    let response1 = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(mostviewed[stIdx])}`);
    let response2 = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(mostviewed[endIdx])}`);
    let data1 = await response1.json();
    let data2 = await response2.json();

    document.querySelector("#startTitle").innerText =  data1.title;
    document.querySelector("#currTitle").innerText = data1.title;
    document.querySelector("#endTitle").innerText = data2.title;

    document.querySelector("#startDescript").innerText = data1.description;
    document.querySelector("#currDescript").innerText = data1.description;
    document.querySelector("#endDescript").innerText = data2.description;

    document.querySelector("#startPoint img").src = data1.thumbnail?.source || "";
    document.querySelector("#curr img").src = data1.thumbnail?.source || "";
    document.querySelector("#endPoint img").src = data2.thumbnail?.source || "";

    document.querySelector("#bwImg").style.backgroundImage = `url("${data1.thumbnail?.source || ""}")`;
    document.querySelector("#blueImg").style.backgroundImage = `url("${data1.thumbnail.source || ""}")`;

    // console.log(data1);
    // console.log(data2);
}

setEndPoints();




let getRelLinks = async () =>{
    let response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=links&titles=${encodeURIComponent(currTitle)}&plnamespace=0&pllimit=max&format=json&origin=*`);
    let relLinks = await response.json();


    return relLinks;
}



let showRelLinks = async ()=>{
    currRelLinks.replaceChildren();
    let relLinks = await getRelLinks();

    let pageid = Object.values(relLinks.query.pages)[0];
    // console.log(relLinks);

    let titles = pageid.links.map(link=>link.title);
    titles.sort(()=>{
        return Math.random()-0.5;
    })

  
    titles = titles.slice(0,20);
    titleString = titles.join("|");
    let response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&prop=pageimages|pageterms&titles=${encodeURIComponent(titleString)}&pilimit=30&piprop=thumbnail&pithumbsize=300&wbptterms=description&redirects=&origin=*`);
    let data = await response.json();

    // console.log(data);
    let validTitles = data.query.pages.filter(article => article.thumbnail?.source && article.terms?.description?.[0]);
    validTitles = validTitles.slice(0, n);

    for(let i=0; i<n; i++){
        let btn = document.createElement("button");
        if (validTitles[i]) btn.innerText = `${validTitles[i].title}`;
        else btn.innerText = "";
        btn.classList.add("relLinkBtns");
        
        btn.style.left = "0px";
        btn.style.top = "0px";

        btn.addEventListener("click", async ()=>{
            rabbitHoleDepth++;
            let article = validTitles[i];
            currTitle = article.title;

            
            document.querySelector("#depth").textContent = rabbitHoleDepth;
            visited.push(currTitle);
            visitedSrc.push(article.thumbnail.source);

            if(currTitle==endTitle){
                document.querySelector("#wonPopup").style.display = "flex";
                document.querySelector("#step").textContent = `${rabbitHoleDepth}`;
                return;
            }
            if(rabbitHoleDepth>=allowedDepth){
                document.querySelector("#lostPopup").style.display = "flex";
                return;
            }

            document.querySelector("#currTitle").innerText = article.title;
            document.querySelector("#currDescript").innerText = article.terms.description[0];
            document.querySelector("#curr img").src = article.thumbnail.source;

            document.querySelector("#bwImg").style.backgroundImage = `url("${article.thumbnail.source}")`;
            document.querySelector("#blueImg").style.backgroundImage = `url("${article.thumbnail.source}")`;

            let percentage = (rabbitHoleDepth / allowedDepth) * 100;
            document.querySelector("#depthProgress").style.width = `${percentage}%`;

            showRelLinks();
        })
        currRelLinks.append(btn);
    }


    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            setBtns();
        });
    });
}



function setBtns(){
    let radX = 300;
    let radY = 260; 
    let relLinkBtns = document.querySelectorAll(".relLinkBtns");
    let theta = 360/n;


    for(let i=0; i<n; i++){
        let currTheta = i*theta*Math.PI/180;
        let x = radX*Math.cos(currTheta);
        let y = radY*Math.sin(currTheta);

        relLinkBtns[i].style.position = "absolute";
        relLinkBtns[i].style.top = `${y}px`;        
        relLinkBtns[i].style.left = `${x}px`; 
        relLinkBtns[i].style.transform = "translate(-50%, -50%)"; 
        
    }
}


let relLinksBtn = document.querySelector("#relLinks");
let currRelLinks = document.querySelector("#currRelLinks");


relLinksBtn.addEventListener("click",showRelLinks);


function restart(){
    rabbitHoleDepth = 0;
    document.querySelector("#depth").textContent = rabbitHoleDepth;
    setEndPoints();
    document.querySelector("#depthProgress").style.width = `0%`;
    currRelLinks.replaceChildren();
}


document.querySelector("#restart").addEventListener("click", restart)


document.querySelector("#restartLost").addEventListener("click", ()=>{
    restart();
    document.querySelector("#lostPopup").style.display = "none";
})

document.querySelector("#restartWon").addEventListener("click", ()=>{
    restart();
    document.querySelector("#wonPopup").style.display = "none";
})


document.querySelector("#maxDepth").textContent = allowedDepth;


document.querySelector("#easy").addEventListener("click",()=>{
    if(rabbitHoleDepth!=0){
        rabbitHoleDepth = 0
        setEndPoints();    
    }
    allowedDepth = allowedDepthEasy;
    document.querySelector("#maxDepth").textContent = allowedDepth;
    currRelLinks.replaceChildren();
})

document.querySelector("#medium").addEventListener("click",()=>{
    if(rabbitHoleDepth!=0){
        rabbitHoleDepth = 0
        setEndPoints();
    }
    allowedDepth = allowedDepthMed;
    document.querySelector("#maxDepth").textContent = allowedDepth;
    currRelLinks.replaceChildren();

})

document.querySelector("#hard").addEventListener("click",()=>{
    if(rabbitHoleDepth!=0){
        rabbitHoleDepth = 0
        setEndPoints();
    }
    allowedDepth = allowedDepthHard;
    document.querySelector("#maxDepth").textContent = allowedDepth;
    currRelLinks.replaceChildren();
})
