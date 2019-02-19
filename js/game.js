$(document).ready(function(){game.init()});
if(typeof resPasePath==='undefined'){var resPasePath=''};
var game={
	init:function(){
		game.girls=new Girls(resPasePath+"character/");
		game.background=["Airport","Bridge","Forest","IceLake","Snow","Street","MindMap","MindMap2"];
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
		if(stageLoaded==false){gameview.selectBackground.val('Airport').change()}
	},
	setGameviewHandler:function(handler){gameview.handler=handler}
};
var preview={
	init:function(){
		preview.canvas=$(".preCanvas");
		preview.selectCharacter=$(".preSelectCharacter>select");
		preview.selectSkin=$(".preSelectSkin>select");
		preview.selectAnimation=$(".preSelectAnimation>select");
		preview.stopRole=$(".preStopRole");
		preview.addRole=$(".preAddRole");
		preview.isUpdate=true;
		var stringCharacter="<option>선택하세요</option>";
		for(var type in girlsOptions){
			stringCharacter+='<optgroup label="'+type+'">';
			for(var name in girlsOptions[type]){
				var optionName=(girlsDataKr[name])?girlsDataKr[name]:girlsOptions[type][name];
				stringCharacter+='<option value="'+name+'">'+optionName+'</option>';
			}
			stringCharacter+='</optgroup>'
		}
		preview.selectCharacter.html(stringCharacter);
		preview.selectCharacter.change(function(){
			if(this.selectedIndex==0){return};
			var name=$(this).val();
			var type=$(':selected',this).parent().attr('label');
			var strSkinsOption="";
			if(!girlsData[name]){return};
			for(var skin in girlsData[name]){
				strSkinsOption+="<option value=\""+skin+"\">"+skin+"</option>";
			}
			preview.selectSkin.html(strSkinsOption);
			preview.selectSkin.change();
			preview.stage.interactive=true
		});
		preview.selectSkin.change(function(){game.girls.load(preview.selectCharacter.val(),preview.selectSkin.val(),preview)});
		preview.selectAnimation.change(function(){preview.changeAnimation(this.selectedIndex)});
		preview.addRole.click(function(){if(preview.skeletonData){gameview.addRole(preview.skeletonData,preview.selectAnimation.val())}});
		preview.stopRole.click(function(){
			if(preview.isUpdate){
				preview.isUpdate=false;
				preview.stopRole.html("재생").toggleClass("btn-success btn-secondary");
			}else{
				preview.isUpdate=true;
				preview.stopRole.html("정지").toggleClass("btn-success btn-secondary");
			}
		});
		preview.selectScale=1;
		preview.selectX=preview.canvas.width()*0.5;
		preview.selectY=preview.canvas.height()*0.85;
		preview.stage=new PIXI.Container;
		preview.renderer=PIXI.autoDetectRenderer(preview.canvas.width(),preview.canvas.height(),{transparent:true});
		preview.lastTime=new Date().getTime();
		preview.nowTime=new Date().getTime();
		preview.animationFrame=window.requestAnimationFrame(preview.animate);
		preview.canvas.html(preview.renderer.view)
	},
	changeCanvas:function(skeletonData){
		preview.stage.removeChildren();
		preview.name=skeletonData.name;
		preview.skeletonData=skeletonData;
		preview.spine=new PIXI.spine.Spine(skeletonData);
			preview.spine.x=preview.selectX;
			preview.spine.y=preview.selectY;
			preview.spine.scale.x=preview.selectScale;
		preview.spine.scale.y=preview.selectScale;
		var animations=preview.spine.spineData.animations;
		var aniName=animations;
		var stringAnimations="";
		var anilength=animations.length;
		var n,nowSkin=0;
		for(var i=0;i<anilength;i++){
			aniName[i].name=="attack"?aniName[i].name="공격":
			aniName[i].name=="attack2"?aniName[i].name="보조공격":
			aniName[i].name=="spattack"?aniName[i].name="스킬":
			aniName[i].name=="bossskill"?aniName[i].name="스킬":
			aniName[i].name=="bossskillactive"?aniName[i].name="스킬발동":
			aniName[i].name=="s"?aniName[i].name="스킬":
			aniName[i].name=="sp"?aniName[i].name="스킬":
			aniName[i].name=="sp1"?aniName[i].name="특수행동1":
			aniName[i].name=="reload"?aniName[i].name="재장전":
			aniName[i].name=="victory"?aniName[i].name="승리":
			aniName[i].name=="victory2"?aniName[i].name="승리2":
			aniName[i].name=="victoryloop"?aniName[i].name="승리Loop":
			aniName[i].name=="die"?aniName[i].name="사망":
			aniName[i].name=="die2"?aniName[i].name="사망2":
			aniName[i].name=="die3"?aniName[i].name="사망3":
			aniName[i].name=="move"?aniName[i].name="이동":
			aniName[i].name=="wait"?aniName[i].name="대기":
			aniName[i].name=="wait2"?aniName[i].name="대기2":
			aniName[i].name=="wait22"?aniName[i].name="대기22":
			aniName[i].name=="lying"?aniName[i].name="휴식":
			aniName[i].name=="sit"?aniName[i].name="착석":
			aniName[i].name=="pick"?aniName[i].name="들어올리기":
			aniName[i].name=="work1"?aniName[i].name="행동1":
			aniName[i].name=="work2"?aniName[i].name="행동2":
			aniName[i].name=="action"?aniName[i].name="행동":
			aniName[i].name=="action1"?aniName[i].name="행동1":
			aniName[i].name=="action2"?aniName[i].name="행동2":
			aniName[i].name=="action3"?aniName[i].name="행동3":
			aniName[i].name=="dance1"?aniName[i].name="춤1":
			aniName[i].name=="dance2"?aniName[i].name="춤2":
			aniName[i].name=="dance3"?aniName[i].name="춤3":
			aniName[i].name=="change1"?aniName[i].name="변화1":
			aniName[i].name=="change2"?aniName[i].name="변화2":
			aniName[i].name=="change3"?aniName[i].name="변화3":
			aniName[i].name=aniName[i].name
		}
		for(var i=0;i<anilength;i++){stringAnimations+="<option value=\""+animations[i].name+"\">"+aniName[i].name+"</option>"}
		preview.selectAnimation.html(stringAnimations);
		preview.changeAnimation(0);
		preview.spine.skeleton.setToSetupPose();
		preview.spine.update(0);
		preview.spine.autoUpdate=false;
		preview.stage.addChild(preview.spine);
		var Canilength=preview.stage.children[0].state.data.skeletonData.animations.length;
		preview.stage.on('pointerdown',function(){
			if(nowSkin>=Canilength){
				preview.changeAnimation(0);
				nowSkin=0
			}else{
				preview.changeAnimation(nowSkin);
				nowSkin+=1
			};
			preview.selectAnimation.val(preview.stage.children[0].state.tracks[0].animation.name)
		})
	},
	loadToStage:function(defaultStageData,spineData){
		for(i in defaultStageData){
			var role=defaultStageData[i];
			var spine=spineData[role.name][role.skin];
				spine.code=role.name;
				spine.skin=role.skin;
				spine.x=role.x;
				spine.y=role.y;
				spine.scale=role.scale;
				spine.animation=role.animation;
			gameview.addRole(spine,role.animation)
		}
	},
	animate:function(){
		preview.lastTime=preview.nowTime;
		preview.nowTime=new Date().getTime();
		preview.animationFrame=window.requestAnimationFrame(preview.animate);
		if(preview.isUpdate&&preview.spine){preview.spine.update((preview.nowTime-preview.lastTime)/1000)}
		preview.renderer.render(preview.stage)
	},
	changeAnimation:function(num){
		var name=preview.spine.spineData.animations[num].name;
		var isload=true;
		if(name=="die"||name=="reload"||name=="victory")
			isload=false;
		preview.spine.state.setAnimationByName(0,name,isload,0);
		preview.spine.update(0)
	},
	loadStage:function(jsonString){
		var defaultStageData=JSON.parse(decodeURIComponent(jsonString));
		if(defaultStageData.ro){
			for(i in defaultStageData.ro){
				var role=defaultStageData.ro[i];
				game.girls.loadAsync(role.name,role.skin,preview);
			}
			game.girls.loadAll(defaultStageData.ro)
		}
		gameview.selectBackground.val(defaultStageData.bg).change()
	}
};
var gameview={
	role:[],
	bgImage:[],
	handler:null,
	init:function(){
		gameview.canvas=$('.gameCanvas');
		gameview.selectBackground=$(".gameSelectBackground>select");
		gameview.showFPS=$(".gameShowFPS>input");
		gameview.selectCharacter=$(".gameSelectCharacter>select");
		gameview.selectAnimation=$(".gameSelectAnimation>select");
		gameview.selectposX=$(".gameSelectposX>input");
		gameview.selectposY=$(".gameSelectposY>input");
		gameview.selectscale=$(".gameSelectscale>input");
		gameview.turnRole=$(".gameTurnRole");
		gameview.stopRole=$(".gameStopRole");
		gameview.saveStageBtn=$(".gameSaveStage");
		gameview.savePngBtn=$(".gameSavePng");
		gameview.removeRole=$(".gameRemoveRole");
		gameview.removeAllRole=$(".gameRemoveAllRole");
		gameview.timestop=$(".gameTimestop")
		gameview.isUpdate=true;
		gameview.isShowFPS=true;
		timeVal=[],
		backgroundlength=game.background.length;
		var stringBackground="<option>없음</option>";
		for(var i=0;i<backgroundlength;i++){stringBackground+="<option>"+game.background[i]+"</option>"}
		gameview.selectBackground.html(stringBackground);
		gameview.selectBackground.change(function(){gameview.changeBackground(this.selectedIndex)});
		gameview.showFPS.change(function(){gameview.isShowFPS=this.checked});
		gameview.saveStageBtn.click(function(){gameview.saveStage()});
		gameview.savePngBtn.click(function(){gameview.savePng()});
		var stringCharacter="<option>인형을 선택하세요</option>";
		gameview.selectCharacter.html(stringCharacter);
		gameview.selectCharacter.change(function(){
			if(this.selectedIndex==0){return};
			var role=gameview.stage.children[this.selectedIndex+1];
			gameview.selectposX.val(role.x);
			gameview.selectposY.val(role.y);
			gameview.selectscale.val(Math.abs(role.scale.x)*1000);
			gameview.focusRole=role;
			var stringAnimations="";
			for(var i=0;i<role.spineData.animations.length;i++){
				var defaultAnimation="";
				if(role.animation==role.spineData.animations[i].name){defaultAnimation=" selected"}
				stringAnimations+="<option"+defaultAnimation+">"+role.spineData.animations[i].name+"</option>";
			}
			gameview.selectAnimation.html(stringAnimations)
			if(timeVal[this.selectedIndex-1]==0){
				gameview.timestop.html("재생").addClass("btn-success")
			}else{
				gameview.timestop.html("정지").removeClass("btn-success")
			}
		});
		var charOn=gameview.selectCharacter[0].selectedIndex;
		var stringAnimation="<option>모션이 표시됩니다.</option>";
		gameview.selectAnimation.html(stringAnimation);
		gameview.selectAnimation.change(function(){gameview.changeAnimation(this.selectedIndex)});
		gameview.removeRole.click(function(){
			charOn=gameview.selectCharacter[0].selectedIndex;
			if(charOn==0){return};
			gameview.stage.removeChild(gameview.role[charOn-1]);
			gameview.selectCharacter[0].remove(charOn);
			gameview.role.splice(charOn-1,charOn);
			gameview.focusRole=null;
			gameview.selectAnimation.html(stringAnimation);
			timeVal.splice(charOn-1,1);
			gameview.timestop.html("정지").removeClass("btn-success")
		});
		gameview.timestop.click(function(){
			charOn=gameview.selectCharacter[0].selectedIndex;
			if(charOn==0){return};
			if(gameview.role[charOn-1].state.tracks[0].timeScale==1){
				gameview.role[charOn-1].state.tracks[0].timeScale=0;
				gameview.timestop.html("재생").addClass("btn-success");
				timeVal[charOn-1]=0;
			}else{
				gameview.role[charOn-1].state.tracks[0].timeScale=1;
				gameview.timestop.html("정지").removeClass("btn-success");
				timeVal[charOn-1]=1;
			}
		});
		gameview.removeAllRole.click(function(){
			var n=gameview.role.length;
			for(var i=0;i<n;i++){gameview.stage.removeChild(gameview.role[i])};
			gameview.selectCharacter.html(stringCharacter);
			gameview.selectAnimation.html(stringAnimation);
			gameview.role.splice(0,n);
			gameview.focusRole=null
		});
		gameview.turnRole.click(function(){
			charOn=gameview.selectCharacter[0].selectedIndex;
			if(charOn==0){return};
			gameview.focusRole.scale.x*=-1}
		);
		gameview.stopRole.click(function(){
			charOn=gameview.selectCharacter[0].selectedIndex;
			if(charOn==0){return};
			if(gameview.isUpdate){
				gameview.isUpdate=false;
				gameview.stopRole.html("모두재생").toggleClass("btn-success btn-secondary");
			}else{
				gameview.isUpdate=true;
				gameview.stopRole.html("모두정지").toggleClass("btn-success btn-secondary");
			}
		});
		gameview.selectX=1920/2;
		gameview.selectY=1080/2;
		gameview.selectScale=1;
		gameview.selectposX.attr("max",1920);
		gameview.selectposY.attr("max",1080);
		gameview.selectposX.val(gameview.selectX);
		gameview.selectposY.val(gameview.selectY);
		gameview.selectscale.val(gameview.selectScale*1000);
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
		gameview.canvas.html(gameview.renderer.view)
	},
	animate:function(){
		gameview.lastTime=gameview.nowTime;
		gameview.nowTime=new Date().getTime();
		gameview.animationFrame=window.requestAnimationFrame(gameview.animate);
		if(gameview.isShowFPS)
			gameview.fpsText.text=Math.floor(1000/(gameview.nowTime-gameview.lastTime));
		else
			gameview.fpsText.text="";
		if(gameview.isUpdate)
			for(var i=0;i<gameview.role.length;i++)
				gameview.role[i].update((gameview.nowTime-gameview.lastTime)/1000);
		if(gameview.focusRole){
			gameview.focusRole.x=gameview.selectposX.val();
			gameview.focusRole.y=gameview.selectposY.val();
			if(gameview.focusRole.scale.x>0){
				gameview.focusRole.scale.x=gameview.selectscale.val()/1000
			}else{
				gameview.focusRole.scale.x=-gameview.selectscale.val()/1000
			}
			gameview.focusRole.scale.y=gameview.selectscale.val()/1000
		}
		gameview.renderer.render(gameview.stage)
	},
	changeAnimation:function(num){ //인수 받아야함
		var name=gameview.focusRole.spineData.animations[num].name;
		var isload=true;
		if(name=="die"||name=="reload"||name=="victory"||name=="사망"||name=="재장전"||name=="승리"||name=="승리2"||name=="승리Loop"){isload=false}
		gameview.focusRole.state.setAnimationByName(0,name,isload);
		if(name=="victory"||name=="victory2"||name=="승리"||name=="승리2"||name=="승리Loop"){gameview.focusRole.state.addAnimationByName(0,"승리",true,0)}
		gameview.focusRole.update(0)
	},
	addRole:function(skeletonData,selectedAnimation){
		var role=gameview.role[gameview.role.length]=new PIXI.spine.Spine(skeletonData);
		var name=skeletonData.name;
		gameview.selectposX.val(skeletonData.x||gameview.selectX);
		gameview.selectposY.val(skeletonData.y||gameview.selectY);
		var scale=skeletonData.scale||gameview.selectScale;
		var isMirror=false;
		timeVal[gameview.selectCharacter[0].selectedIndex]=1;
		if(scale<0){
			scale=scale*-1;
			isMirror=true
		}
		gameview.selectscale.val(scale*1000);
		gameview.focusRole=role;
		var stringAnimations="";
		var defaultAnimationId=0;
		for(var i=0;i<role.spineData.animations.length;i++){
			var defaultAnimation="";
			if(selectedAnimation==role.spineData.animations[i].name){
				defaultAnimation=" selected";
				defaultAnimationId=i;
			}
			var aniName=role.spineData.animations[i].name;
			stringAnimations+="<option"+defaultAnimation+">"+aniName+"</option>"
		}
		gameview.selectAnimation.html(stringAnimations);
		gameview.changeAnimation(defaultAnimationId); //인수 보내야함
			role.x=skeletonData.x||gameview.selectX;
			role.y=skeletonData.y||gameview.selectY;
			role.scale.x=(isMirror)?scale*-1:scale||gameview.selectScale;
			role.scale.y=scale||gameview.selectScale;
			role.animation=skeletonData.animation||selectedAnimation;
			role.skeleton.setToSetupPose();
			role.update(0);
			role.autoUpdate=false;
		var codeName=(girlsDataKr[skeletonData.code])?girlsDataKr[skeletonData.code]:name;
		if(codeName==name){name="기본"}
		var stringCharacter="<option>"+codeName+" (스킨:"+name+")</option>";
		gameview.selectCharacter.append(stringCharacter);
		gameview.selectCharacter[0].selectedIndex=gameview.role.length;
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
			gameview.selectCharacter[0].selectedIndex=this.parent.children.indexOf(this)-1;
			//console.log(this)
			gameview.selectCharacter.change()
		};
		function DragEnd(){this.alpha=1,this.dragging=false,this.data=null};
		function DragMove(){
			if(this.dragging){
				var newPo=this.data.getLocalPosition(this.parent);
				gameview.selectposX.val(newPo.x);
				gameview.selectposY.val(newPo.y)
			}
		}
	},
	changeBackground:function(n){
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
			var path=resPasePath+"background/"+game.background[n-1]+".jpg"
			PIXI.loader.add(name,path).load(function(loader,resources){
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
	saveStage:function(gameview){
		var jsonData={
			'ro':[],
			'bg':''
		};
		for (i in gameview.role){
			jsonData.ro.push({
				'name':gameview.role[i].stateData.skeletonData.code,
				'skin':gameview.role[i].stateData.skeletonData.skin,
				'x':gameview.role[i].x,
				'y':gameview.role[i].y,
				'scale':gameview.role[i].scale.x,
				'animation':gameview.role[i].animation
			})
		}
		jsonData.bg=gameview.background.filename;
		var jsonString=JSON.stringify(jsonData);
		var shareUrl=location.protocol+'//'+location.host+location.pathname+'#'+encodeURIComponent(jsonString);
		copyToClipboard(shareUrl);
		alert("복사되었으니 주소창에 붙여넣기 하세요!")
	},
	savePng:function(gameview){
		if(confirm("이미지는 하단에 출력됩니다. 이미지를 마우스 오른쪽 버튼으로 클릭해 저장할 수 있습니다. 모바일은 이미지를 길게 눌러주세요.")){
	//     var renderTexture = new PIXI.RenderTexture(gameview.renderer, 1920, 1080);
	//     renderTexture.renderWebGL(gameview.stage);
	//      var canvas = renderTexture.getCanvas();
			$('#saveImage').html().show();
		}
	}
};
function copyToClipboard(val){
	var t=document.createElement("textarea");
	document.body.appendChild(t);
	t.value=val;
	t.select();
	document.execCommand('copy');
	document.body.removeChild(t)
}
//game.setGameviewHandler(gvHandler);
//
//function download_sprite_as_png(renderer, sprite, fileName) {
//	renderer.extract.canvas(sprite).toBlob(function(b){
//		var a = document.createElement('a');
//		document.body.append(a);
//		a.download = fileName;
//		a.href = URL.createObjectURL(b);
//		a.click();
//		a.remove();
//	}, 'image/png');
//}
