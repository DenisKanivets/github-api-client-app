let searchSection = document.getElementById('searchSection');
let inputName = document.getElementById('inputName');
let userContent = document.getElementById('userContent');
let filterSection = document.getElementById('filterSection');
let sortSection = document.getElementById('sortSection');
let AZReposOrder = document.getElementById('AZReposOrder');
let ZAReposOrder = document.getElementById('ZAReposOrder');
let leastStarsOrder = document.getElementById('leastStarsOrder');
let mostStarsOrder = document.getElementById('mostStarsOrder');
let content = document.getElementById('content');
let btnMore = document.getElementById('btnMore');

//hide all buttons and show error message
let errFunc = (err) => {
    filterSection.style.display = 'none';
    sortSection.style.display = 'none';
    btnMore.style.display = 'none';

    let errMess = document.createElement('p');
    errMess.innerHTML = 'Oops ;(<br><br>Error: ' + err.message;
    errMess.className = 'err-mess';
    content.appendChild(errMess)
};

//get array of repositories from GitHub API, create info about owner and create repositories cards
let getData = async (pageCount) => {
    let dataRepos = [];
    let errCheck = true;

    await axios.get(`https://api.github.com/users/${inputName.value}/repos?page=${pageCount}&per_page=10`)
        .then(res => dataRepos = res.data)
        .catch(err => {
            errFunc(err);
            errCheck = false;
        });

    if (dataRepos.length > 0) {
        let userImg = document.createElement('img');
        userImg.src = dataRepos[0].owner.avatar_url;
        userContent.appendChild(userImg);

        let userLogin = document.createElement('p');
        userLogin.innerHTML = dataRepos[0].owner.login;
        userLogin.className = 'login';
        userContent.appendChild(userLogin);

        for (let i = 0; i < dataRepos.length; i++) {
            let card = document.createElement('div');
            card.className = 'card';
            content.appendChild(card);

            let reposName = document.createElement('h4');
            reposName.innerHTML = dataRepos[i].name;
            reposName.className = 'reposName';
            card.appendChild(reposName);

            let description = document.createElement('p');
            description.innerHTML = dataRepos[i].description;
            description.className = 'description';
            card.appendChild(description);

            let fork = document.createElement('i');
            if (dataRepos[i].fork) {
                fork.className = 'fas fa-code-branch';
            }
            card.appendChild(fork);

            let starIcon = document.createElement('i');
            starIcon.className = 'fas fa-star';
            card.appendChild(starIcon);

            let stars = document.createElement('span');
            stars.innerHTML = dataRepos[i].stargazers_count;
            stars.className = 'stars';
            card.appendChild(stars);

            let date = document.createElement('span');
            date.innerHTML = 'Last Update at ' + dataRepos[i].updated_at.slice(0, 10);
            date.className = 'date';
            card.appendChild(date);

            let language = document.createElement('span');
            language.innerHTML = dataRepos[i].language;
            language.className = 'language';
            card.appendChild(language);
        }
    } else if (dataRepos.length === 0 && errCheck) {
        let noRepos = document.createElement('p');
        noRepos.innerHTML = 'This user has no repositories';
        noRepos.className = 'err-mess';
        content.appendChild(noRepos);
    }
};

//search by user, show filters, sorting, load-more button and cards with repositories
searchSection.onsubmit = async (e) => {
    e.preventDefault();

    //clean every time when submit
    while (userContent.firstChild) {
        userContent.removeChild(userContent.firstChild);
    }
    while (content.firstChild) {
        content.removeChild(content.firstChild);
    }
    btnMore.style.display = 'none';

    filterSection.style.display = 'block';
    sortSection.style.display = 'block';

    let page = 1;
    await getData(page);

    if (content.children.length >= 10) {
        btnMore.style.display = 'block';
        btnMore.onclick = async () => {
            //clean every time when submit
            while (userContent.firstChild) {
                userContent.removeChild(userContent.firstChild);
            }

            page = page + 1;
            await getData(page);
            //hide load-more button when repositories are over
            if (content.children.length % 10 !== 0) {
                btnMore.style.display = 'none';
            }
        }
    }
};

//filter cards by type and stars count
filterSection.onsubmit = (e) => {
    e.preventDefault();

    let items = [...content.children];
    items.forEach(item => item.style.display = 'block');

    // filter by type
    switch (e.target[0].value) {
        case 'forks':
            for (let i = 0; i < items.length; i++) {
                if (!items[i].children[2].className) {
                    items[i].style.display = 'none'
                }
            }
            break;
        case 'sources':
            for (let i = 0; i < items.length; i++) {
                if (items[i].children[2].className) {
                    items[i].style.display = 'none'
                }
            }
            break;
        case 'all':
            for (let i = 0; i < items.length; i++) {
                items[i].style.display = 'block'
            }
            break;
        default:
    }

    // filter by stars count
    switch (e.target[1].value) {
        case 'moreFive':
            for (let i = 0; i < items.length; i++) {
                if (Number(items[i].children[4].innerHTML) < 5) {
                    items[i].style.display = 'none'
                }
            }
            break;
        case 'moreTwenty':
            for (let i = 0; i < items.length; i++) {
                if (Number(items[i].children[4].innerHTML) < 20) {
                    items[i].style.display = 'none'
                }
            }
            break;
        case 'all':
            for (let i = 0; i < items.length; i++) {
                // items[i].style.display = 'block'
            }
            break;
        default:
    }
};

//order by repositories name from A to Z
AZReposOrder.onclick = () => {
    let items = [...content.children];
    items.sort(function (a, b) {
        let nameA = a.children[0].innerHTML.toLowerCase(), nameB = b.children[0].innerHTML.toLowerCase();
        if (nameA < nameB)
            return -1;
        if (nameA > nameB)
            return 1;
        return 0;
    });
    //clean old cards and push new in needed order
    while (content.firstChild) {
        content.removeChild(content.firstChild);
    }
    items.forEach(item => content.appendChild(item));
};

//order by repositories name from Z to A
ZAReposOrder.onclick = () => {
    let items = [...content.children];
    items.sort(function (a, b) {
        let nameA = a.children[0].innerHTML.toLowerCase(), nameB = b.children[0].innerHTML.toLowerCase();
        if (nameA < nameB)
            return 1;
        if (nameA > nameB)
            return -1;
        return 0;
    });
    //clean old cards and push new in needed order
    while (content.firstChild) {
        content.removeChild(content.firstChild);
    }
    items.forEach(item => content.appendChild(item));
};

//order by stars count from min to max
leastStarsOrder.onclick = () => {
    let items = [...content.children];
    items.sort(function (a, b) {
        let nameA = Number(a.children[4].innerHTML), nameB = Number(b.children[4].innerHTML);
        if (nameA < nameB)
            return -1;
        if (nameA > nameB)
            return 1;
        return 0;
    });
    //clean old cards and push new in needed order
    while (content.firstChild) {
        content.removeChild(content.firstChild);
    }
    items.forEach(item => content.appendChild(item));
};

//order by stars count from max to mix
mostStarsOrder.onclick = () => {
    let items = [...content.children];
    items.sort(function (a, b) {
        let nameA = Number(a.children[4].innerHTML), nameB = Number(b.children[4].innerHTML);
        if (nameA < nameB)
            return 1;
        if (nameA > nameB)
            return -1;
        return 0;
    });
    //clean old cards and push new in needed order
    while (content.firstChild) {
        content.removeChild(content.firstChild);
    }
    items.forEach(item => content.appendChild(item));
};