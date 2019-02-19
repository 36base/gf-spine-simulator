if(document.readyState==="loading"){
	document.addEventListener("DOMContentLoaded",()=>{
		game.init()
	})
}else{game.init()};
if(void 0===resPasePath)var resPasePath="";
var game={
	init:()=>{
		for(var i of document.querySelectorAll("footer>p")) i.classList.add("text-muted");
		game.girls=new Girls(resPasePath+"character/");
		game.background="Airport Bridge Forest IceLake Snow Street MindMap MindMap2".split(" ");
		preview.init();
		gameview.init();
		var stageLoaded=false;
		if(typeof defaultStageData!=='undefined'){
			preview.loadStage(defaultStageData);
			stageLoaded=true
		}
		if(window.location.hash&&stageLoaded==false){
			var hash=window.location.hash.substring(1);
			preview.loadStage(hash);
			stageLoaded=true
		}
		0==stageLoaded&&(gameview.selectBackground.value="Airport",gameview.changeBackground(1));
	},
	setGameviewHandler:handler=>{gameview.handler=handler}
};
var preview={
	init:()=>{
		preview.canvas=document.querySelector(".preCanvas");
		preview.selectCharacter=document.querySelector(".preSelectCharacter>select");
		preview.selectSkin=document.querySelector(".preSelectSkin>select");
		preview.selectAnimation=document.querySelector(".preSelectAnimation>select");
		preview.stopRole=document.querySelector(".preStopRole");
		preview.addRole=document.querySelector(".preAddRole");
		preview.isUpdate=true;
		var stringCharacter="<option>선택하세요</option>";
		for(var type in girlsOptions){
			stringCharacter+=`<optgroup label=${type}>`;
			for(var name in girlsOptions[type]){
				var optionName=(girlsDataKr[name])?girlsDataKr[name]:girlsOptions[type][name];
				stringCharacter+=`<option value=${name}>${optionName}</option>`;
			}
			stringCharacter+='</optgroup>'
		}
		preview.selectCharacter.innerHTML=stringCharacter;
		preview.selectCharacter.addEventListener("change",function(){
			if(this.selectedIndex==0) return;
			var name=this.value,strSkinsOption="";
			girlsData[name]||return;
			for(skin in girlsData[name]){
				var skinName=skin;
				"r"!=skin.replace(name,"").slice(0,1)&&"R"!=skin.replace(name,"").slice(0,1)||(skinName="숙소 "+skin.slice(1));
				strSkinsOption+=`<option value="${skin}">${skinName}</option>`;
			}
			preview.selectSkin.innerHTML=strSkinsOption;
			game.girls.load(preview.selectCharacter.value,preview.selectSkin.value,preview)
			preview.stage.interactive=true
		});
		preview.selectSkin.addEventListener("change",()=>{
			game.girls.load(preview.selectCharacter.value,preview.selectSkin.value,preview)
		});
		preview.selectAnimation.addEventListener("change",function(){
			"animation"==preview.skeletonData.animations[0].name?preview.changeAnimation(this.selectedIndex+1):preview.changeAnimation(this.selectedIndex);
		});
		preview.addRole.addEventListener("click",()=>{
			preview.skeletonData&&gameview.addRole(preview.skeletonData,preview.selectAnimation.value)
		});
		preview.stopRole.addEventListener("click",()=>{
			if(preview.isUpdate){
				preview.isUpdate=false;
				preview.stopRole.textContent="재생";
				preview.stopRole.classList.toggle("btn-success")
			}else{
				preview.isUpdate=true;
				preview.stopRole.textContent="정지";
				preview.stopRole.classList.toggle("btn-success")
			}
		});
		preview.selectScale=1;
		preview.selectX=preview.canvas.clientWidth*0.5;
		preview.selectY=preview.canvas.clientHeight*0.85;
		preview.stage=new PIXI.Container;
		preview.renderer=PIXI.autoDetectRenderer(preview.canvas.clientWidth,preview.canvas.clientHeight,{transparent:true});
		preview.lastTime=new Date().getTime();
		preview.nowTime=new Date().getTime();
		preview.animationFrame=window.requestAnimationFrame(preview.animate);
		preview.canvas.appendChild(preview.renderer.view)
	},
	changeCanvas:skeletonData=>{
		preview.stage.removeChildren();
		preview.name=skeletonData.name;
		preview.skeletonData=skeletonData;
		preview.spine=new PIXI.spine.Spine(skeletonData);
			preview.spine.x=preview.selectX;
			preview.spine.y=preview.selectY;
			preview.spine.scale.x=preview.selectScale;
		preview.spine.scale.y=preview.selectScale;
		var stringAnimations="",n,nowSkin=0;
		for(i of preview.spine.spineData.animations){
			i.name=="attack"?i.name="공격":
			i.name=="attack2"?i.name="보조공격":
			i.name=="spattack"?i.name="스킬":
			i.name=="bossskill"?i.name="스킬":
			i.name=="bossskillactive"?i.name="스킬발동":
			i.name=="s"?i.name="스킬":
			i.name=="sp"?i.name="스킬":
			i.name=="sp1"?i.name="특수행동1":
			i.name=="reload"?i.name="재장전":
			i.name=="victory"?i.name="승리":
			i.name=="victory2"?i.name="승리2":
			i.name=="victoryloop"?i.name="승리Loop":
			i.name=="die"?i.name="사망":
			i.name=="die2"?i.name="사망2":
			i.name=="die3"?i.name="사망3":
			i.name=="move"?i.name="이동":
			i.name=="wait"?i.name="대기":
			i.name=="wait2"?i.name="대기2":
			i.name=="wait22"?i.name="대기22":
			i.name=="lying"?i.name="휴식":
			i.name=="sit"?i.name="앉기":
			i.name=="pick"?i.name="들어올리기":
			i.name=="work1"?i.name="행동1":
			i.name=="work2"?i.name="행동2":
			i.name=="action"?i.name="행동":
			i.name=="action1"?i.name="행동1":
			i.name=="action2"?i.name="행동2":
			i.name=="action3"?i.name="행동3":
			i.name=="dance1"?i.name="춤1":
			i.name=="dance2"?i.name="춤2":
			i.name=="dance3"?i.name="춤3":
			i.name=="change1"?i.name="변화1":
			i.name=="change2"?i.name="변화2":
			i.name=="change3"?i.name="변화3":
			i.name=i.name;
			if(i.name=="animation") continue;
			stringAnimations+=`<option>${i.name}</option>`
		};
		preview.selectAnimation.innerHTML=stringAnimations;
		preview.spine.spineData.animations[0].name=="animation"?preview.changeAnimation(1):preview.changeAnimation(0);
		preview.spine.skeleton.setToSetupPose();
		preview.spine.update(0);
		preview.spine.autoUpdate=false;
		preview.stage.addChild(preview.spine);
		var Canilength=preview.stage.children[0].state.data.skeletonData.animations.length;
		preview.stage.on('pointerdown',()=>{
			if(nowSkin>=Canilength){
				preview.changeAnimation(0);
				nowSkin=0
			}else{
				preview.changeAnimation(nowSkin);
				nowSkin+=1
			};
			preview.selectAnimation.value=preview.stage.children[0].state.tracks[0].animation.name
		})
	},
	loadToStage:(defaultStageData,spineData)=>{
		for(i of defaultStageData){
			var spine=spineData[i.name][i.skin];
				spine.code=i.name;
				spine.skin=i.skin;
				spine.x=i.x;
				spine.y=i.y;
				spine.scale=i.scale;
				spine.animation=i.animation;
			gameview.addRole(spine,i.animation)
		}
	},
	animate:()=>{
		preview.lastTime=preview.nowTime;
		preview.nowTime=new Date().getTime();
		preview.animationFrame=window.requestAnimationFrame(preview.animate);
		if(preview.isUpdate&&preview.spine) preview.spine.update((preview.nowTime-preview.lastTime)/1000);
		preview.renderer.render(preview.stage)
	},
	changeAnimation:num=>{
		var name=preview.spine.spineData.animations[num].name,isload=true;
		if(name=="die"||name=="reload"||name=="victory") isload=false;
		preview.spine.state.setAnimationByName(0,name,isload,0);
		preview.spine.update(0)
	},
	loadStage:jsonString=>{
		var defaultStageData=JSON.parse(decodeURIComponent(jsonString));
		if(defaultStageData.ro){
			for(i of defaultStageData.ro){
				game.girls.loadAsync(i.name,i.skin,preview)
			}
			game.girls.loadAll(defaultStageData.ro)
		}
		gameview.selectBackground.value=defaultStageData.bg;
	}
};
var gameview={
	role:[],
	bgImage:[],
	handler:null,
	init:()=>{
		gameview.canvas=document.querySelector('.gameCanvas');
		gameview.selectBackground=document.querySelector(".gameSelectBackground>select");
		gameview.showFPS=document.querySelector(".gameShowFPS>input");
		gameview.selectCharacter=document.querySelector(".gameSelectCharacter>select");
		gameview.selectAnimation=document.querySelector(".gameSelectAnimation>select");
		gameview.selectposX=document.querySelector(".gameSelectposX>input");
		gameview.selectposY=document.querySelector(".gameSelectposY>input");
		gameview.selectscale=document.querySelector(".gameSelectscale>input");
		gameview.turnRole=document.querySelector(".gameTurnRole");
		gameview.stopRole=document.querySelector(".gameStopRole");
		gameview.saveStageBtn=document.querySelector(".gameSaveStage");
		gameview.savePngBtn=document.querySelector(".gameSavePng");
		gameview.removeRole=document.querySelector(".gameRemoveRole");
		gameview.removeAllRole=document.querySelector(".gameRemoveAllRole");
		gameview.timestop=document.querySelector(".gameTimestop");
		gameview.isUpdate=true;
		gameview.isShowFPS=true;
		timeVal=[];
		var stringBackground="<option>없음</option>";
		for(i of game.background) stringBackground+=`<option>${i}</option>`;
		gameview.selectBackground.innerHTML=stringBackground;
		gameview.selectBackground.addEventListener("change",function(){
			gameview.changeBackground(this.selectedIndex)
		});
		gameview.showFPS.addEventListener("change",function(){
			gameview.isShowFPS=this.checked
		});
		gameview.saveStageBtn.addEventListener("click",()=>{
			gameview.saveStage()
		});
		gameview.savePngBtn.addEventListener("click",()=>{
			gameview.savePng()
		});
		var stringCharacter="<option>인형을 선택하세요</option>";
		gameview.selectCharacter.innerHTML=stringCharacter;
		function selectC(){
			if(this.selectedIndex==0) return;
			var role=gameview.stage.children[this.selectedIndex+1];
			gameview.selectposX.value=role.x;
			gameview.selectposY.value=role.y;
			gameview.selectscale.value=Math.abs(role.scale.x)*1000;
			gameview.focusRole=role;
			var stringAnimations="";
			for(i of role.spineData.animations){
				if(i.name=="animation") continue;
				var defaultAnimation="";
				if(role.animation==i.name) defaultAnimation=" selected";
				stringAnimations+=`<option value=${defaultAnimation}>${i.name}</option>`
			};
			gameview.selectAnimation.innerHTML=stringAnimations;
			if(timeVal[this.selectedIndex-1]==0){
				gameview.timestop.textContent="재생";
				gameview.timestop.classList.add("btn-success")
			}else{
				gameview.timestop.textContent="정지";
				gameview.timestop.classList.remove("btn-success")
			}
		}
		gameview.selectCharacter.addEventListener("click",selectC);
		gameview.selectCharacter.addEventListener("change",selectC);
		var charOn=gameview.selectCharacter.selectedIndex,stringAnimation="<option>모션이 표시됩니다.</option>";
		gameview.selectAnimation.innerHTML=stringAnimation;
		gameview.selectCharacter.addEventListener("change",function(){
				if(gameview.role[gameview.selectCharacter.selectedIndex-1].spineData.animations[0].name=="animation"){
					gameview.changeAnimation(this.selectedIndex+1)
				}else{
					gameview.changeAnimation(this.selectedIndex)
				}
		});
		gameview.removeRole.addEventListener("click",()=>{
			charOn=gameview.selectCharacter.selectedIndex;
			if(charOn==0) return;
			gameview.stage.removeChild(gameview.role[charOn-1]);
			gameview.selectCharacter.remove(charOn);
			gameview.role.splice(charOn-1,charOn);
			gameview.focusRole=null;
			gameview.selectAnimation.innerHTML=stringAnimation;
			timeVal.splice(charOn-1,1);
			gameview.timestop.textContent="정지";
			gameview.timestop.classList.remove("btn-success")
		});
		gameview.timestop.addEventListener("click",()=>{
			charOn=gameview.selectCharacter.selectedIndex;
			if(charOn==0) return;
			if(gameview.role[charOn-1].state.tracks[0]==null) return;
			if(gameview.role[charOn-1].state.tracks[0].timeScale==1){
				gameview.role[charOn-1].state.tracks[0].timeScale=0;
				gameview.timestop.textContent="재생";
				gameview.timestop.classList.toggle("btn-success");
				timeVal[charOn-1]=0;
			}else{
				gameview.role[charOn-1].state.tracks[0].timeScale=1;
				gameview.timestop.textContent="정지";
				gameview.timestop.classList.toggle("btn-success");
				timeVal[charOn-1]=1;
			}
		});
		gameview.removeAllRole.addEventListener("click",()=>{
			for(var i of gameview.role) gameview.stage.removeChild(i);
			gameview.selectCharacter.innerHTML=stringCharacter;
			gameview.selectAnimation.innerHTML=stringAnimation;
			gameview.role=[];
			gameview.focusRole=null
		});
		gameview.turnRole.addEventListener("click",()=>{
			charOn=gameview.selectCharacter.selectedIndex;
			if(charOn==0) return;
			gameview.focusRole.scale.x*=-1
		});
		gameview.stopRole.addEventListener("click",()=>{
			charOn=gameview.selectCharacter.selectedIndex;
			if(charOn==0) return;
			if(gameview.isUpdate){
				gameview.isUpdate=false;
				gameview.stopRole.textContent="모두재생";
				gameview.stopRole.classList.toggle("btn-success");
			}else{
				gameview.isUpdate=true;
				gameview.stopRole.textContent="모두정지";
				gameview.stopRole.classList.toggle("btn-success");
			}
		});
		gameview.selectX=1920/2;
		gameview.selectY=1080/2;
		gameview.selectScale=1;
		gameview.selectposX.setAttribute("max","1920");
		gameview.selectposY.setAttribute("max","1080");
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
		gameview.animationFrame=window.requestAnimationFrame(gameview.animate);
		gameview.canvas.appendChild(gameview.renderer.view)
	},
	animate:()=>{
		gameview.lastTime=gameview.nowTime;
		gameview.nowTime=new Date().getTime();
		gameview.animationFrame=window.requestAnimationFrame(gameview.animate);
		if(gameview.isShowFPS) gameview.fpsText.text=Math.floor(1000/(gameview.nowTime-gameview.lastTime));
		else gameview.fpsText.text="";
		if(gameview.isUpdate){
			for(var i of gameview.role) i.update((gameview.nowTime-gameview.lastTime)/1000)
		};
		if(gameview.focusRole){
			gameview.focusRole.x=gameview.selectposX.value;
			gameview.focusRole.y=gameview.selectposY.value;
			if(gameview.focusRole.scale.x>0){
				gameview.focusRole.scale.x=gameview.selectscale.value/1000
			}else{
				gameview.focusRole.scale.x=-gameview.selectscale.value/1000
			}
			gameview.focusRole.scale.y=gameview.selectscale.value/1000
		}
		gameview.renderer.render(gameview.stage)
	},
	changeAnimation:num=>{
		var name=gameview.focusRole.spineData.animations[num].name,isload=true;
		if(name=="die"||name=="reload"||name=="victory"||name=="사망"||name=="재장전"||name=="승리"||name=="승리2"||name=="승리Loop") isload=false;
		gameview.focusRole.state.setAnimationByName(0,name,isload);
		if(name=="victory"||name=="victory2"||name=="승리"||name=="승리2"||name=="승리Loop") gameview.focusRole.state.addAnimationByName(0,"승리",true,0);
		gameview.focusRole.update(0)
	},
	addRole:(skeletonData,selectedAnimation)=>{
		var role=gameview.role[gameview.role.length]=new PIXI.spine.Spine(skeletonData),name=skeletonData.name;
		gameview.selectposX.value=skeletonData.x||gameview.selectX;
		gameview.selectposY.value=skeletonData.y||gameview.selectY;
		var scale=skeletonData.scale||gameview.selectScale,isMirror=false;
		timeVal[gameview.selectCharacter.selectedIndex]=1;
		if(scale<0){
			scale=scale*-1;
			isMirror=true
		}
		gameview.selectscale.value=scale*1000;
		gameview.focusRole=role;
		var stringAnimations="",defaultAnimationId=0;
		for(var i of role.spineData.animations){
			var defaultAnimation="";
			if(selectedAnimation==i.name){
				defaultAnimation=" selected";
			}
			if(i.name=="animation") continue;
			stringAnimations+=`<option ${defaultAnimation}>${i.name}</option>`
		}
		gameview.selectAnimation.innerHTML=stringAnimations;
		if(preview.stage.children[0].spineData.animations[0].name=="animation"){defaultAnimationId=1};
		gameview.changeAnimation(defaultAnimationId);
			role.x=skeletonData.x||gameview.selectX;
			role.y=skeletonData.y||gameview.selectY;
			role.scale.x=(isMirror)?scale*-1:scale||gameview.selectScale;
			role.scale.y=scale||gameview.selectScale;
			role.animation=skeletonData.animation||selectedAnimation;
			role.skeleton.setToSetupPose();
			role.update(0);
			role.autoUpdate=false;
		var name2;
		for(i in girlsOptions){
			if(girlsOptions[i][skeletonData.code]) break
			var name2=girlsOptions[i][skeletonData.code];
		}
		var codeName=girlsDataKr[skeletonData.code]?girlsDataKr[skeletonData.code]:name;
		var stringCharacter=`<option>${name2} (스킨:${name})</option>`;
		gameview.selectCharacter.innerHTML+=stringCharacter;
		gameview.selectCharacter.selectedIndex=gameview.role.length;
		gameview.stage.addChild(role);
		var mynum=gameview.role.length-1;
		gameview.role[mynum].interactive=true;
		gameview.role[mynum].buttonMode=true;
		role
			.on('pointerdown',DragStart)
			.on('pointerup',DragEnd)
			.on('pointerupoutside',DragEnd)
			.on('pointermove',DragMove);
		function DragStart(event){
			this.data=event.data,this.alpha=0.5,this.dragging=true;
			gameview.selectCharacter.selectedIndex=this.parent.children.indexOf(this)-1
			gameview.selectCharacter.click();
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
	changeBackground:n=>{
		if(n==0&&gameview.background){
			gameview.background.texture=PIXI.Texture.EMPTY;
			gameview.background.filename='없음';
			return
		}
		if(gameview.bgImage[n-1]){
			gameview.background.texture=gameview.bgImage[n-1];
			gameview.background.filename=game.background[n-1];
			gameview.background.scale.x=gameview.renderer.width/gameview.bgImage[n-1].width;
			gameview.background.scale.y=gameview.renderer.height/gameview.bgImage[n-1].height
		}else{
			var name="bg"+game.background[n-1];
			var path=`${resPasePath}background/${game.background[n-1]}.jpg`
			PIXI.loader.add(name,path).load((loader,resources)=>{
				gameview.bgImage[n-1]=resources[name].texture;
				gameview.background.filename=game.background[n-1];
				gameview.background.texture=gameview.bgImage[n-1];
				gameview.background.scale.x=gameview.renderer.width/gameview.bgImage[n-1].width;
				gameview.background.scale.y=gameview.renderer.height/gameview.bgImage[n-1].height;
			})
		}
	},
	saveStage:function(){this.handler.saveStage(gameview)},
	savePng:function(){this.handler.savePng(gameview)}
}
var gvHandler={
	saveStage:gameview=>{
		var jsonData={
			'ro':[],'bg':''
		};
		for (i of gameview.role){
			jsonData.ro.push({
				'name':i.stateData.skeletonData.code,
				'skin':i.stateData.skeletonData.skin,
				'x':i.x,
				'y':i.y,
				'scale':i.scale.x,
				'animation':i.animation
			})
		}
		jsonData.bg=gameview.background.filename;
		var jsonString=JSON.stringify(jsonData);
		var shareUrl=location.protocol+'//'+location.host+location.pathname+'#'+encodeURIComponent(jsonString);
		copyToClipboard(shareUrl);
		alert("복사되었으니 주소창에 붙여넣기 하세요!")
	},
	savePng:gameview=>{
		download_png(gameview.renderer,gameview.stage,"screenshot");
	}
};
game.setGameviewHandler(gvHandler);
function copyToClipboard(val){
	var t=document.createElement("textarea");
	document.body.appendChild(t);
	t.value=val;
	t.select();
	document.execCommand('copy');
	document.body.removeChild(t)
};
function download_png(renderer,sprite,fileName){
	renderer.extract.canvas(sprite).toBlob(b=>{
		var a=document.createElement("a");
		document.body.append(a);
		a.download=fileName+".png",a.href=URL.createObjectURL(b);
		a.click(),a.remove();
	},"image/png");
};