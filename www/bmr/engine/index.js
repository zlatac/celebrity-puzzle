(function(){
	"use strict"
	const socketUrl = 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.7.4/socket.io.min.js'

	const App = {
		isConnected: false,
		metrics: {},
		accessToken: '',
		pendingSearch: [],
		socket: {},
		searchResult: {},
		noResult: [],
		requestedSongs: [],
		appName: '1030',
		vipMode: {
			limit: 0,
			uuid: 0,
			insta: '',
			club: ''
		},
		addScripts:  async function(array){
			var promises = [];
			var hookScripts = function(url, src) {
				return new Promise(function(resolve,reject){
					var s = document.createElement("script");
					s.type = "text/javascript";
					s.setAttribute('async','false')
					s.onload = ()=>{resolve(url)};
					s.onerror = ()=>{reject(`${url} did not load`)};
					s.src = url || null;
					s.innerHTML = src || null;
					document.getElementsByTagName("body")[0].appendChild(s);
				});
				
			};
			array.forEach(function(item){
				var exist = document.querySelector(`script[src="${item}"]`);
				if(!exist){
					promises.push(hookScripts(item));
				}
				
			});
			return Promise.all(promises)
		},
		isOnline: async function(){
			const url = window.location.origin
			try{
				const request = await fetch('https://styleminions.co/api/radio',{
				mode: 'no-cors',	
				params:{url}
				})
			}catch(e){
				console.log(new Error(e))
			}finally {
				return true
			}
			//return true
			
		},
		launchApp: async function(){
			const isOnline = await this.isOnline()
			if (isOnline) {
				try {
					const boom = await this.addScripts([socketUrl])
					if('io' in window){
						console.log('socket.io in in the DOM')
						this.socket = io('https://blessmyrequest.com')
						// this.socket = io('http://localhost:8000')
						this.setUpSocket()

						// let hmm = '';
						// for(let x = 0; x<7; x++){
						// 	const payload = {song:`ida song${x}`,artist:`ida${x}`,image:'https://avatars0.githubusercontent.com/u/28629414?s=460&v=4',index:x}
						// 	hmm += this.resultHtml(payload)
						// }
						const headElement = document.head
						const bodyElement = document.body
						const elem = document.createElement('div')
						const styleElem = document.createElement('style')
						elem.classList.add('bmr-container')
						this.render(this.cssStyle(),styleElem)
						this.render(this.appHtml(),elem)
						headElement.appendChild(styleElem)
						bodyElement.appendChild(elem)
					}
				} catch (error) {
					console.log(error)
				}
			}
		},
		render: function (template, node) {
			if (!node) return
			node.innerHTML = template
		},	
		setUpSocket: function() {
			this.socket.on('connect', (data)=>{
				this.isConnected = true
				this.socket.emit('audience',{appName:this.appName,id:this.socket.id,task:'population'});
				console.log(data, 'connected to server');
			});
			this.socket.on('disconnect', (data)=>{
					this.isConnected = false
			});
			this.socket.on('reconnect', (data)=>{
					this.isConnected = true
			});
			this.socket.on('sendMetrics',(data)=>{
					//console.log(data,'metric data');
					if(data.appName === this.appName && 'task' in data && data.task === 'request'){
							this.metrics = data;
					}
			});
			this.socket.on('newToken',(data)=>{
					this.accessToken = data
					if(this.pendingSearch.length > 0){
							this.searchTrack()
					}
			});
		},
		toggleAppDisplay: function(){
			const doc = document.documentElement;
			const circle = doc.style.getPropertyValue('--circle')
			//const requestContainer = doc.style.getPropertyValue('--request-container')
			if(circle === 'flex' || circle === ''){
				doc.style.setProperty('--circle','none')
				doc.style.setProperty('--request-container','flex')
			}else{
				doc.style.setProperty('--circle','flex')
				doc.style.setProperty('--request-container','none')
			}

		},
		appHtml(){
			return `
				<div class="circle" onclick="bmr.toggleAppDisplay()">
					<span>song</span>
					<span>request</span>
				</div>
				<div class="request-container">
					<div class="search-container">
						<div class="close" onclick="bmr.toggleAppDisplay()">
							<i class="bmr-icons tablet-desktop">keyboard_arrow_down</i>
						</div>
						<div class="search-component">
							<input type="text" name="search" onkeyup="bmr.searchEnter(event)" 
								placeholder="Search tracks" autocomplete="off">
							<div class="btn" onclick="bmr.searchTrack()"><i class="bmr-icons">search</i></div>
						</div>
					</div>
					<div class="result-container"></div>
				</div>            
			`
		},
		resultHtml: (data) => {
			const alreadyRequested = data.alreadyRequested ? 'requested' : ''
			return `
				<div class="result z-depth-3 result-${data.id} ${alreadyRequested}">
					<div class="image">
						<img src="${data.image}" alt="image">
						<span class="btn btn-small lead-fab"><i class="bmr-icons">check</i></span>
					</div>					
					<div class="result-details">
						<span>${data.song}</span>
						<span>${data.artist}</span>
					</div>
					<div class="button" onclick="bmr.sendRequest('${data.id}')">
						<div class="btn">
							<i class="bmr-icons">send</i>
						</div>
					</div>						     
				</div>
			`
		},
		noResultHtml: () => {
			return `
					<div class="z-depth-3 result result-none">
						<span>Sorry!! Can't find that song.</span>
						<span>Search for another song.</span>
					</div>
				`
		},
		renderData(obj, template, node){
			let html = ''
			obj.forEach(item => html += template(item))
			this.render(html, node)
		},
		safe(value){
			if (value === '' || value === undefined || value === false){
				return false
			}
			return true
		},
		async searchTrack(){
			this.searchInput = document.querySelector('.bmr-container input').value
			if(this.safe(this.searchInput)){
					this.loader = true
					let token = this.accessToken
					let query = encodeURIComponent(this.searchInput)
					let type = 'track'
					const resultContainer = document.querySelector('.result-container')
					console.log(this.searchInput)

					try {
						const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=${type}&access_token=${token}`)
						const data = response.status === 200 ? await response.json() : 'fail'
						if(data !== 'fail'){
							this.searchResult = data.tracks.items.map((item)=>{
									let obj = {}
									obj.image = item.album.images[1].url
									obj.song = item.name
									obj.artist = item.artists.map((item)=> item.name).join(', ')
									obj.id = item.id
									obj.alreadyRequested =  
										this.requestedSongs.find((i) => i === item.id) !== undefined

									return obj
							})
							this.noResult = (this.searchResult.length === 0) ? true : false
							this.pendingSearch = []
							if(this.noResult){
								this.render(this.noResultHtml(),resultContainer)
							}else{
								this.renderData(this.searchResult,this.resultHtml,resultContainer)
							}							
							this.loader = false;
						}else if(data === 'fail'){
							this.pendingSearch.push(this.searchInput)
							this.socket.emit('newTokenPlease')
						}
					} catch (error) {
							console.error(new Error(error))
					} finally {
							//let payload = {trackTask:'search',search:this.searchInput, timestamp:moment().toISOString(),domain:location.host}
							//this.trackAction(payload)
					}
			}
		},
		searchEnter(event){
			try {
				const keyCode =  event.which || event.keyCode;
				if(keyCode === 13){
					this.searchTrack()
					event.target.blur()
				}
			} catch (error) {
				console.warn(error)
			}			
		},
		sendRequest(id){
			if(this.safe(id) && this.isConnected === true){
					const payload = this.searchResult.find((item) => item.id === id)
					const notRequested = this.requestedSongs.find((item) => item === id) === undefined
					if(this.safe(payload) && notRequested){
						payload.timestamp = new Date().toISOString()
						console.log(payload)
						this.socket.emit('audience',{
							appName:this.appName,
							id:this.socket.id,
							task:'request',
							song:payload,
							vip: this.vipMode,
						})
						try {
							document.querySelector(`.result-${id}`).classList.add('requested')
						} catch (error) {
							console.warn(error)
						}
						this.requestedSongs.push(payload.id)
						payload.trackTask = 'request'
						payload.domain = location.host
						//this.trackAction(payload)
					}					
			}
		},
		cssStyle(){
			return `
			:root{
				--circle: flex;
				--request-container: none;
				--main: linear-gradient(120deg, #92fe9d 0%, #00c9ff 107%);
				--dark-theme: #252525;
			}
			.bmr-container{
				position: fixed;
				bottom: 0;
				right: 0;
				width: auto;
				height: auto;
				z-index: 100000;
			}
			.circle{
				width: 100px;
				height: 100px;
				background: var(--main);
				border-radius: 50%;
				position: absolute;
				bottom: 20px;
				right: 5%;
				display: var(--circle);
				flex-direction: column;
				justify-content: center;
				align-items: center;
				color: white;
				margin: 0 10px;
			}
			.request-container{
				width: 100vw;
				height: 100vh;
				display: var(--request-container);
				flex-direction: column;
				animation: slideUp .2s ease-in
			}
			.search-container {
				order: 1;
				flex-basis: 40%;
				display: flex;
				flex-direction: column;
				background-color: #000000a3;
			}
			.result-container {
				order: 2;
				flex-basis: 60%;
				background-color: var(--dark-theme);
				overflow-y: scroll;
				scroll-behavior: smooth;
				-webkit-overflow-scrolling: touch;
			}
			.result{
				display: flex;
				margin: 10px 0;
				height: 75px;
				align-items: center;
				background: var(--dark-theme);
				animation: slideUp .5s linear;
			}
			.result.result-none{
				flex-direction: column;
				justify-content: center;
			}
			img{
				width:70px;
			}
			.image, .button, .result-details{
				padding: 0 .75rem
			}
			.result .image{
				flex-basis: 30%;
				position: relative;
			}
			.result .button{
				flex-basis: 30%;
				align-self: center;
			}
			.result .button .btn{
				margin: 0 auto;
			}
			.result-details{
				flex-basis: 60%;
				display: flex;
				flex-direction: column;
				font-size: 14px;
			}
			.result-details span, .button .btn{
				align-self: center;
				text-align: center;
			}
			.result-details span:nth-child(1), .result-none span, .btn{
				color: white;
			}
			.result-details span:nth-child(2){
				color: #9e9e9e;
			}
			.btn{
				width: 40px;
				height: 40px;
				border-radius: 50%;
				display: flex;
				justify-content: center;
				align-items: center;
				background: var(--main);
			}
			input[type=text]{
				background-color: transparent;
				border: none;
				border-bottom: 1px solid #9e9e9e;
				border-radius: 0;
				outline: none;
				height: 3rem;
				width: 100%;
				font-size: 16px;
				margin: 0 0 8px 0;
				padding: 0;
				flex-basis: 70%;
			}
			input[type=text]:focus{
				border-bottom: 1px solid #13d0f2;
				box-shadow: 0 1px 0 0 #13d0f2;
			}
			.z-depth-3{
				box-shadow: 0 8px 17px 2px rgba(0,0,0,0.14), 0 3px 14px 2px rgba(0,0,0,0.12), 0 5px 5px -3px rgba(0,0,0,0.2);
			}
			.search-component{
				display: flex;
				flex-basis: 50%;
				background-color: white;
				padding: 0% 5%;
				align-items: center;
				justify-content: space-evenly;
			}
			.close{
				flex-basis: 50%;
				background-color: transparent;
				display: flex;
				justify-content: center;
			}
			.close i {
				font-size: 66px;
				color: white;
			}
			.lead-fab{
				bottom:-3px;
				position:absolute;
				right:7px;
			}
			.btn.btn-small{
				width: 27px;
				height: 27px;
			}
			.image .btn{
				display: none;
			}
			.requested .image .btn{
				display: flex;
				align-items: center;
			}
			.requested .button .btn{
				opacity: 0.2
			}
			/* Mobile Responsive style */
			@media only screen and (max-width: 749px) {
				.tablet-desktop{
					display: none !important;
				}
			}
			/* Tablet Responsive style */
			@media only screen and (min-width: 750px) {
				.request-container{
					width: 56vw;
					height: 60vh;
				}
				.mobile, .desktop{
					display: none !important;
				}  
			}
			/* Desktop Responsive style */
			@media only screen and (min-width: 1280px) {
				.request-container{
					width: 35vw;
					height: 65vh;
				}
				.mobile, .tablet{
					display: none !important;
				}
			}
			@keyframes slideUp{
				0% {
					transform: translate3d(0,100%,0);
				}
				100% {
					transform: none;
				}
			}
			
			/* fallback */
			@font-face {
				font-family: 'Material Icons';
				font-style: normal;
				font-weight: 400;
				src: url(https://fonts.gstatic.com/s/materialicons/v43/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2) format('woff2');
			}
			
			.bmr-icons {
				font-family: 'Material Icons';
				font-weight: normal;
				font-style: normal;
				font-size: 24px;
				line-height: 1;
				letter-spacing: normal;
				text-transform: none;
				display: inline-block;
				white-space: nowrap;
				word-wrap: normal;
				direction: ltr;
				-webkit-font-feature-settings: 'liga';
				-webkit-font-smoothing: antialiased;
			}
			`
		}
	};

	//Lock App methods to be immutable
	Object.keys(App).map((item) => typeof App[item] === 'function' ? Object.defineProperty(App, item, { configurable: false, writable: false }) : null)
	window.bmr = App
	App.launchApp()
})();