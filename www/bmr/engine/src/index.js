//import css from './style.css';
import styl from './style.styl';
import io from 'socket.io-client/dist/socket.io.slim'
//console.log(css, styl.toString());

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
					//const boom = await this.addScripts([socketUrl])
					if(true){
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
						this.render(styl.toString(),styleElem)
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
			const circle = doc.style.getPropertyValue('--circle-bmr')
			//const requestContainer = doc.style.getPropertyValue('--request-container')
			if(circle === 'flex' || circle === ''){
				doc.style.setProperty('--circle-bmr','none')
				doc.style.setProperty('--request-container','flex')
			}else{
				doc.style.setProperty('--circle-bmr','flex')
				doc.style.setProperty('--request-container','none')
			}

		},
		appHtml(){
			return `
				<div class="circle-bmr" onclick="bmr.toggleAppDisplay()">
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
							<div class="btn-bmr" onclick="bmr.searchTrack()"><i class="bmr-icons">search</i></div>
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
						<span class="btn-bmr btn-small-bmr lead-fab"><i class="bmr-icons">check</i></span>
					</div>					
					<div class="result-details">
						<span>${data.song}</span>
						<span>${data.artist}</span>
					</div>
					<div class="button-bmr" onclick="bmr.sendRequest('${data.id}')">
						<div class="btn-bmr">
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
		}
	};

	//Lock App methods to be immutable
	Object.keys(App).map((item) => typeof App[item] === 'function' ? Object.defineProperty(App, item, { configurable: false, writable: false }) : null)
	window.bmr = App
	App.launchApp()
})();