Vue.component("form-sm",{
	props: ["txt","id","val"],
	//셀렉트 템플릿에서 '선택하세요' 옵션 제거 : 무의미함
	template: `<div class="form-group"><label>{{ txt }}</label><select class="custom-select" :value=val @input=changes(id)>
		<optgroup v-if="id == 'doll'" v-for="(type, value) in girlsOptions" :label="value">
			<option v-for="(name, doll) in type" :value="doll">
				{{ girlsDataKr[doll]?girlsDataKr[doll]:name }}
			</option>
		</optgroup>
	</select></div>`,
	data: function(){
		return {
			girlsOptions : girlsOptions,
			girlsDataKr : girlsDataKr,
		}
	},
	methods: {
		changes: function(e){
			let skin,select=this.$el.querySelector("select");
			app.SelectSkin=select.value;
			app.SelectMotion=select.selectedIndex;
			app.preview.stage.interactive=true;
			if(e == "doll"){
				app.SelectCharacter=select.value;
				let Skin=this.$el.nextElementSibling.querySelector("select"),
					Motion=this.$el.nextElementSibling.nextElementSibling.querySelector("select"),
					name=select.value,strSkinsOption="";
				if(select.selectedIndex == 0){
					let text="<option>선택하세요</option>";
					Skin.innerHTML=text;
					Motion.innerHTML=text;
					return
				};
				for(skin in girlsData[name]){
					let skinName=skin;
					"r"!=skin.replace(name,"").slice(0,1)&&"R"!=skin.replace(name,"").slice(0,1)||(skinName="숙소 "+skin.slice(1));
					strSkinsOption+=`<option value="${skin}">${skinName}</option>`
				};
				Skin.innerHTML=strSkinsOption;
				app.SelectSkin=Skin.value,
				app.SelectMotion=0
			}else if(e == "skin"){
				app.SelectMotion=0;
				app.SelectCharacter=this.$el.previousElementSibling.querySelector("select").value
			}else{
				"animation"==app.preview.skeletonData.animations[0].name?app.changeAnimation(app.SelectMotion+1):app.changeAnimation(app.SelectMotion)
			};
			if(e == "doll"||e == "skin"){
				app.girls.load(app.SelectCharacter,app.SelectSkin,app)
			}
		},
	},
});
Vue.component("char-op",{
	props: ["txt","id","val"],
	template:`<div class="input-group mb-1">
		<div class="input-group-prepend"><span class="input-group-text">{{ txt }}</span></div>
			<select v-if="id == 'GameDoll'||id == 'GameMotion'" class="custom-select" :id=id @input=changes(id)>
				<option v-if="id == 'GameDoll'">인형을 선택하세요</option>
				<option v-else-if="id == 'GameMotion'">모션을 선택하세요</option>
			</select>
			<input v-else type="range" class="custom-range col p-0" min="0" max="800" :id=id @input=changes(id)>
	</div>`,
	methods: {
		changes: function(id){
			let gameview=app.gameview,
				select=gameview.selectCharacter.selectedIndex,
				selectM=gameview.selectAnimation.selectedIndex;
			if(id == "GameDoll"){
				if(select==0){
					gameview.selectAnimation.innerHTML="<option>모션을 선택하세요.</option>"
					return
				};
				let i,role=gameview.stage.children[select+1],TimeStopper=document.querySelector("#TimeStop"),stringAnimations="";
				gameview.selectposX.value=role.x;
				gameview.selectposY.value=role.y;
				gameview.selectscale.value=Math.abs(role.scale.x)*1000;
				gameview.focusRole=role;
				for(i of role.spineData.animations){
					if(i.name=="animation") continue;
					let defaultAnimation="";
					if(role.animation==i.name){
						defaultAnimation=" selected"
					};
					stringAnimations+=`<option value=${defaultAnimation}>${i.name}</option>`
				};
				gameview.selectAnimation.innerHTML=stringAnimations;
				if(app.timeVal[select-1]==0){
					TimeStopper.textContent="재생";
					TimeStopper.classList.add("btn-success")
				}else{
					TimeStopper.textContent="정지";
					TimeStopper.classList.remove("btn-success")
				}
			}else if(id == "GameMotion"){
				if(gameview.role[select-1].spineData.animations[0].name=="animation"){
					app.gamechangeAnimation(selectM+1)
				}else{
					app.gamechangeAnimation(selectM)
				}
			}else if(id == "SelectposX"){

			}else if(id == "SelectposY"){

			}else{

			}
		},
	},
});
var app = new Vue({
		el: "#app",
		data: {
			background: "Airport Bridge Forest IceLake Snow Street MindMap MindMap2".split(" "),
			SelectCharacter: "",
			SelectSkin: "",
			SelectMotion: "",
			SelectBackground: "",
			GameDoll: "",
			isShowFPS: true,
			resPasePath:"",
			girlsData : girlsData,
			SkillName : SkillName,
			timeVal : [],
			girls : {},
			preview: {
				isUpdate:true,
				selectScale:1,
			},
			gameview: {
				role:[],
				bgImage:[],
				isUpdate:true,
				selectScale:1,
			},
		},
		methods: {
			changeCanvas: function(skeletonData){
				let preview=this.preview,stringAnimations="",nowSkin=0,i;
				preview.selectAnimation=this.$children[2].$el.querySelector("select");
				preview.stage.removeChildren();
				preview.name=skeletonData.name;
				preview.skeletonData=skeletonData;
				preview.spine=new PIXI.spine.Spine(skeletonData);
					preview.spine.x=preview.selectX,
					preview.spine.y=preview.selectY,
					preview.spine.scale.x=preview.selectScale,
					preview.spine.scale.y=preview.selectScale;
				for(i of preview.spine.spineData.animations){
					if(i.name=="animation") continue;
					if(Object.keys(this.SkillName).includes(i.name)){
						i.name=this.SkillName[i.name]
					}else{
						i.name=i.name
					};
					stringAnimations+=`<option>${i.name}</option>`
				};
				preview.selectAnimation.innerHTML=stringAnimations;
				preview.spine.spineData.animations[0].name=="animation"?this.changeAnimation(1):this.changeAnimation(0);
				preview.spine.skeleton.setToSetupPose();
				preview.spine.update(0);
				preview.spine.autoUpdate=false;
				preview.stage.addChild(preview.spine);
				let Canilength=preview.stage.children[0].state.data.skeletonData.animations.length;
				preview.stage.on('pointerdown',()=>{
					if(nowSkin>=Canilength){
						this.changeAnimation(0);
						nowSkin=0
					}else{
						this.changeAnimation(nowSkin);
						nowSkin+=1
					};
					preview.selectAnimation.value=preview.stage.children[0].state.tracks[0].animation.name
				})
			},
			animate:function(){
				let preview=this.preview;
				preview.lastTime=preview.nowTime;
				preview.nowTime=new Date().getTime();
				preview.animationFrame=window.requestAnimationFrame(this.animate);
				if(preview.isUpdate&&preview.spine){
					preview.spine.update((preview.nowTime-preview.lastTime)/1000)
				};
				preview.renderer.render(preview.stage)
			},
			gameAnimate: function(){
				let gameview=this.gameview,i;
				gameview.lastTime=gameview.nowTime;
				gameview.nowTime=new Date().getTime();
				gameview.animationFrame=window.requestAnimationFrame(this.gameAnimate);
				if(this.isShowFPS){
					gameview.fpsText.text=Math.floor(1000/(gameview.nowTime-gameview.lastTime))
				}else{
					gameview.fpsText.text=""
				};
				if(gameview.isUpdate){
					for(i of gameview.role){
						i.update((gameview.nowTime-gameview.lastTime)/1000)
					}
				};
				if(gameview.focusRole){
					gameview.focusRole.x=gameview.selectposX.value;
					gameview.focusRole.y=gameview.selectposY.value;
					if(gameview.focusRole.scale.x>0){
						gameview.focusRole.scale.x=gameview.selectscale.value/1000
					}else{
						gameview.focusRole.scale.x=-gameview.selectscale.value/1000
					};
					gameview.focusRole.scale.y=gameview.selectscale.value/1000
				}
				gameview.renderer.render(gameview.stage)
			},
			changeAnimation: function(num){
				let preview=this.preview,name=preview.spine.spineData.animations[num].name;
				if(name=="die"||name=="reload"||name=="victory"){
					isload=false
				};
				preview.spine.state.setAnimationByName(0,name,true,0);
				preview.spine.update(0)
			},
			gamechangeAnimation: function(num = 1){
				let gameview=this.gameview,name=gameview.focusRole.spineData.animations[num].name,
					Case=["die","reload","victory","사망","재장전","승리","승리2","승리Loop"];
				if(Case.includes(name)){
					gameview.focusRole.state.setAnimationByName(0,name,false,0)
				}else{
					gameview.focusRole.state.setAnimationByName(0,name,true,0)
				};
				gameview.focusRole.update(0)
			},
			loadToStage: function(defaultStageData,spineData){
				for(i of defaultStageData){
					let spine=spineData[i.name][i.skin];
					spine.code=i.name,
					spine.skin=i.skin,
					spine.x=i.x,
					spine.y=i.y,
					spine.scale=i.scale,
					spine.animation=i.animation;
					this.AddRoleTogameview(spine,i.animation)
				}
			},
			loadStage: function(jsonString){
				let defaultStageData=JSON.parse(decodeURIComponent(jsonString));
				if(defaultStageData.ro){
					for(i of defaultStageData.ro){
						this.girls.loadAsync(i.name,i.skin,this.preview)
					}
					this.girls.loadAll(defaultStageData.ro)
				};
				this.changeBackground(this.background.indexOf(defaultStageData.bg)+1)
			},
			changeBackground: function(n){
				let gameview=this.gameview;
				if(typeof n !== "number"){n=n.target.selectedIndex};
				if(n==0&&gameview.background){
					gameview.background.texture=PIXI.Texture.EMPTY;
					gameview.background.filename="없음";
					return
				}
				if(gameview.bgImage[n-1]){
					gameview.background.texture=gameview.bgImage[n-1];
					gameview.background.filename=this.background[n-1];
					gameview.background.scale.x=gameview.renderer.width/gameview.bgImage[n-1].width;
					gameview.background.scale.y=gameview.renderer.height/gameview.bgImage[n-1].height
				}else{
					let name="bg"+this.background[n-1],
						path=`${this.resPasePath}background/${this.background[n-1]}.webp`,
						loaders=new PIXI.loaders.Loader();
					loaders.add(name,path).load((loaders,resources)=>{
						gameview.bgImage[n-1]=resources[name].texture;
						gameview.background.filename=this.background[n-1];
						gameview.background.texture=gameview.bgImage[n-1];
						gameview.background.scale.x=gameview.renderer.width/gameview.bgImage[n-1].width;
						gameview.background.scale.y=gameview.renderer.height/gameview.bgImage[n-1].height
					})
				}
			},
			saveStage: function(){
				let i,gameview=this.gameview,jsonData={
					"ro":[],"bg":""
				};
				for (i of gameview.role){
					jsonData.ro.push({
						"name":i.stateData.skeletonData.code,
						"skin":i.stateData.skeletonData.skin,
						"x":i.x,
						"y":i.y,
						"scale":i.scale.x,
						"animation":i.animation
					})
				}
				jsonData.bg=gameview.background.filename;
				let jsonString=JSON.stringify(jsonData),
					shareUrl=`${location.protocol}//${location.host+location.pathname}#${encodeURIComponent(jsonString)}`,
					t=document.createElement("textarea");
				document.body.appendChild(t);
				t.value=shareUrl;
				t.select();
				document.execCommand('copy');
				document.body.removeChild(t);
				alert("복사되었으니 주소창에 붙여넣기 하세요!")
			},
			savePng: function(){
				this.gameview.renderer.extract.canvas(this.gameview.stage).toBlob(b=>{
					let a=document.createElement("a");
					document.body.append(a);
					a.download=`screenshot.png`,a.href=URL.createObjectURL(b);
					a.click(),a.remove()
				},"image/png")
			},
			AddRole: function(){
				let preview=this.preview;
				if(preview.skeletonData){
					this.AddRoleTogameview(preview.skeletonData,preview.selectAnimation.value)
				}
			},
			AddRoleTogameview: function(skeletonData,selectedAnimation){
				let gameview=this.gameview,preview=this.preview,
					role=gameview.role[gameview.role.length]=new PIXI.spine.Spine(skeletonData),name=skeletonData.name;
					mynum=gameview.role.length-1,
					scale=skeletonData.scale||gameview.selectScale,isMirror=false;
					gameview.selectposX.value=skeletonData.x||gameview.selectX,
					gameview.selectposY.value=skeletonData.y||gameview.selectY,
					gameview.role[mynum].interactive=true,
					gameview.role[mynum].buttonMode=true;
				this.timeVal[gameview.selectCharacter.selectedIndex]=1;
				if(scale<0){
					scale=scale*-1;
					isMirror=true
				};
				gameview.selectscale.value=scale*1000;
				gameview.focusRole=role;
				let stringAnimations="",defaultAnimationId=app.SelectMotion,i,alphabet = "abcdefghijklmnopqrstuvwxyz";
				if(alphabet.includes(role.spineData.animations[0].name.slice(0,1).toLowerCase())){
					for(i of role.spineData.animations){
						i.name=this.SkillName[i.name];
						if(i.name == selectedAnimation){
							defaultAnimationId=role.spineData.animations.indexOf(i)
						}
					}
				}
				for(i of role.spineData.animations){
					if(i.name=="animation") continue;
					defaultAnimation="";
					if(selectedAnimation==i.name){
						defaultAnimation=" selected"
					}
					stringAnimations+=`<option ${defaultAnimation}>${i.name}</option>`
				};
				gameview.selectAnimation.innerHTML=stringAnimations;
				if(preview.stage.children[0]){
					if(preview.stage.children[0].spineData.animations[0].name=="animation"){
						defaultAnimationId=+1
					}
				};
				this.gamechangeAnimation(defaultAnimationId);
					role.x=skeletonData.x||gameview.selectX;
					role.y=skeletonData.y||gameview.selectY;
					role.scale.x=isMirror?-1*scale:scale||gameview.selectScale;
					role.scale.y=scale||gameview.selectScale;
					role.animation=skeletonData.animation||selectedAnimation;
					role.skeleton.setToSetupPose();
					role.update(0);
					role.autoUpdate=false;
				for(i in girlsOptions){
					if(!girlsOptions[i][skeletonData.code]){
						break
					};
					name2=girlsOptions[i][skeletonData.code]
				};
				stringCharacter=`<option>${name2} (스킨:${name})</option>`;
				gameview.selectCharacter.innerHTML+=stringCharacter;
				gameview.selectCharacter.selectedIndex=gameview.role.length;
				gameview.stage.addChild(role);
				var mynum=gameview.role.length-1;
				gameview.role[mynum].interactive=true;
				gameview.role[mynum].buttonMode=true;
				role.on('pointerdown',DragStart)
					.on('pointerup',DragEnd)
					.on('pointerupoutside',DragEnd)
					.on('pointermove',DragMove);
				function DragStart(event){
					gameview.selectposX.value=this.x;
					gameview.selectposY.value=this.y;
					gameview.selectscale.value=Math.abs(this.scale.x)*1000;
					gameview.focusRole=this,this.data=event.data,this.alpha=0.5,this.dragging=true;
					gameview.selectCharacter.selectedIndex=this.parent.children.indexOf(this)-1
				};
				function DragEnd(){
					this.alpha=1,this.dragging=false,this.data=null
				};
				function DragMove(){
					if(this.dragging){
						var newPo=this.data.getLocalPosition(this.parent);
						gameview.selectposX.value=newPo.x;
						gameview.selectposY.value=newPo.y
					}
				}
			},
			StopRole: function(e){
				let preview=this.preview,button=e.target;
				if(preview.isUpdate){
					preview.isUpdate=false,
					button.textContent="재생";
					button.classList.toggle("btn-success")
				}else{
					preview.isUpdate=true,
					button.textContent="정지";
					button.classList.toggle("btn-success")
				}
			},
			TimeStop: function(e){
				let gameview=this.gameview,charOn=gameview.selectCharacter.selectedIndex,button=e.target,selector=gameview.role[charOn-1].state.tracks[0];
				if(charOn==0) return;
				if(selector==null) return;
				if(selector.timeScale==1){
					selector.timeScale=0;
					button.textContent="재생";
					this.timeVal[charOn-1]=0
				}else{
					selector.timeScale=1;
					button.textContent="정지";
					this.timeVal[charOn-1]=1
				};
				button.classList.toggle("btn-success")
			},
			TurnRole: function(){
				let gameview=this.gameview;
				if(gameview.selectCharacter.selectedIndex==0) return;
				gameview.focusRole.scale.x*=-1
			},
			RemoveRole: function(){
				let gameview=this.gameview,TimeStopper=document.querySelector("#TimeStop");
				charOn=gameview.selectCharacter.selectedIndex;
				if(charOn==0) return;
				gameview.stage.removeChild(gameview.role[charOn-1]);
				gameview.selectCharacter.remove(charOn);
				gameview.role.splice(charOn-1,charOn);
				gameview.focusRole=null;
				gameview.selectAnimation.innerHTML=`<option>모션을 선택하세요.</option>`;
				this.timeVal.splice(charOn-1,1);
				TimeStopper.textContent="정지";
				TimeStopper.classList.remove("btn-success")
			},
			RemoveAllRole: function(){
				let gameview=this.gameview;
				gameview.stage.children=gameview.stage.children.slice(0,2);
				gameview.selectCharacter.innerHTML=`<option>인형을 선택하세요</option>`;
				gameview.selectAnimation.innerHTML=`<option>모션이 표시됩니다.</option>`;
				gameview.role=[];
				gameview.focusRole=null
			},
			AllStopRole: function(e){
				let gameview=this.gameview,button=e.target,charOn=gameview.selectCharacter.selectedIndex;
				if(charOn==0) return;
				if(gameview.isUpdate){
					gameview.isUpdate=false;
					button.textContent="모두재생";
					button.classList.toggle("btn-success")
				}else{
					gameview.isUpdate=true;
					button.textContent="모두정지";
					button.classList.toggle("btn-success")
				}
			},
		},
		mounted: function(){
			let preview=this.preview,gameview=this.gameview;
			this.girls=new Girls(`character/`);
			preview.canvas=this.$el.querySelector(".preCanvas");
			preview.selectX=preview.canvas.clientWidth*0.5;
			preview.selectY=preview.canvas.clientHeight*0.85;
			preview.stage=new PIXI.Container;
			preview.renderer=PIXI.autoDetectRenderer(preview.canvas.clientWidth,preview.canvas.clientHeight,{transparent:true});
			preview.lastTime=new Date().getTime();
			preview.nowTime=new Date().getTime();
			preview.animationFrame=window.requestAnimationFrame(this.animate);
			preview.canvas.appendChild(preview.renderer.view);
			gameview.canvas=this.$el.querySelector('.gameCanvas');
			gameview.selectCharacter=this.$el.querySelector("#GameDoll");
			gameview.selectAnimation=this.$el.querySelector("#GameMotion");
			gameview.selectposX=this.$el.querySelector("#SelectposX");
			gameview.selectposY=this.$el.querySelector("#SelectposY");
			gameview.selectscale=this.$el.querySelector("#Selectscale");
			gameview.selectX=1920/2;
			gameview.selectY=1080/2;
			gameview.selectposX.setAttribute("max","1920");
			gameview.selectposY.setAttribute("max","1080");
			gameview.selectscale.setAttribute("min","300");
			gameview.selectscale.setAttribute("max","3000");
			gameview.selectposX.value=gameview.selectX;
			gameview.selectposY.value=gameview.selectY;
			gameview.selectscale.value=gameview.selectScale*1000;
			gameview.stage=new PIXI.Container;
			gameview.renderer=PIXI.autoDetectRenderer(1920,1080,{transparent:true});
			gameview.background=new PIXI.Sprite(PIXI.Texture.EMPTY);
			gameview.stage.addChild(gameview.background);
			gameview.lastTime=new Date().getTime();
			gameview.nowTime=new Date().getTime();
			gameview.fpsText=new PIXI.Text("0",{fill:"#ffffff"});
			gameview.fpsText.x=1;
			gameview.fpsText.y=0;
			gameview.stage.addChild(gameview.fpsText);
			gameview.animationFrame=window.requestAnimationFrame(this.gameAnimate);
			gameview.canvas.appendChild(gameview.renderer.view);
			var stageLoaded=false;
			if(typeof defaultStageData!=="undefined"){
				this.loadStage(defaultStageData);
				stageLoaded=true
			};
			if(window.location.hash&&stageLoaded==false){
				let hash=window.location.hash.substring(1);
				this.loadStage(hash);
				stageLoaded=true
			};
			0==stageLoaded&&(this.SelectBackground=1,this.changeBackground(1))
		}
})
