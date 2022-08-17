const key = '8TK7gDm75JBEqeUWrsSpccKh5yE40nzAtaD90J42'

const earliestDay = new Date('Jun 15, 1995')
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];


const $searchForm = document.getElementById('searchForm')
const $searchContent = document.getElementById('searchContent')
const $favorites = document.getElementById('favorites')
const $overlay = document.getElementById('overlay')


defaultInputValue()

if(localStorage.getItem('favorites')) { 
  renderFavorites() 
  handleDeleteClick()
}


$searchForm.addEventListener('submit',
  async function(e){
  e.preventDefault()
  const date = document.getElementById('date').value
  let pickDay = new Date(date)
  pickDay.setHours(pickDay.getHours()+4)
  const nowDay = new Date()
  const $warning = document.getElementById('warning')
  if(pickDay > earliestDay && pickDay <= Date.now()) {
    const response = await fetch('https://api.nasa.gov/planetary/apod/?api_key='+key+'&date='+date+'&concept_tags=True')
    const json = await response.json()
    $warning.classList.add('hide')
    renderContent(json)
  } else {
    $warning.innerText = 'Date must be between Jun 16, 1995 and '+ monthNames[nowDay.getMonth()]+' '+nowDay.getDate()+', '+nowDay.getFullYear()
    document.getElementById('warning').classList.remove('hide')
  }
})


function renderContent(json) {
  $searchContent.innerHTML = `
  <div class="d-flex">
    <img id='previewImage' src="${json.url}" alt="preview picture" width="256" class="me-3">
    <div>
      <p><strong>${json.title}</strong><br><em>${json.date}</em></p>
      <p>${json.explanation}</p>
      <button id='addToFavorites' class="btn btn-primary mb-3">Add to Favorites</button>
    </div>
  </div>
  `
  handlePictureClick(json)
  handleOverlayClick()
  handleAddFavorite(json)
}


function handlePictureClick(json) {
  const $previewImage = document.getElementById('previewImage')
  $previewImage.addEventListener('click',()=>{
    $overlay.classList.remove('hide')
    $overlay.innerHTML = `
      <img id='hdImage' src="${json.hdurl}" alt="high definition picture" class="mx-auto d-block border border-white border-4">
    `
  })
}


function handleOverlayClick() {
  $overlay.addEventListener('click',(e)=>{
    e.target.classList.add('hide')
  })
}


function handleAddFavorite(json) {
  const $addFavoriteBtn = document.getElementById('addToFavorites')
  $addFavoriteBtn.addEventListener('click',()=>{
    let favorites = []
    if(localStorage.getItem('favorites')===null) {
      favorites.push(json)
    }else{
      favorites = JSON.parse(localStorage.getItem('favorites'))
      favorites.push(json)
    }
    localStorage.setItem('favorites',JSON.stringify(favorites))
    renderFavorites()
  })
}

function renderFavorites() {
  let favorites = []
  let html = []
  favorites = JSON.parse(localStorage.getItem('favorites'))
  if(favorites!==null) {
    favorites.forEach(element => {
      html.push(`
        <div class="list-group-item p-3 mb-3 d-flex align-items-end">
          <img class="item-img me-3" src="${element.url}" alt="">
          <div>
            <p><strong>${element.title}</strong><br><em>${element.date}</em></p>
            <button type='button' id='deleteBtn' class="btn btn-danger delete" data-index=${favorites.indexOf(element)}>Delete</button>
          </div>
        </div>
      `)
    })
  }
  $favorites.innerHTML = html.join('')
}


function handleDeleteClick() {
  $favorites.addEventListener('click',(e)=>{
    if(e.target.classList.contains('delete')) {
      const index = e.target.dataset.index
      let array = []
      array = JSON.parse(localStorage.getItem('favorites'))
      array.splice(index,1)
      localStorage.setItem('favorites',JSON.stringify(array))
      renderFavorites()
    }
  })
}

function defaultInputValue() {
  const today = new Date()
  const year = today.getFullYear()
  let month = today.getMonth()+1
  let day = today.getDate()
  
  if(month < 10) {month = '0'+month.toString()}
  if(day < 10) {day = '0'+day.toString()}
  
  
  document.getElementById('date').defaultValue = year+'-'+month+'-'+day
}