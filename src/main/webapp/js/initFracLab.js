				var lowMessage="";
				var isEnabledLightBulb=false;
				//$("#done").show();
				$("#help").show();
				//$("#done").attr("disabled", "disabled");
				helpButtonEnable(false);
//				$("#done").click(function() {
//					doneButtonPressed();
//				});
				$("#next").click(function() {
					arrowButtonPressed();
				});
				$("#help").click(function() {
					helpButtonPressed();
				});
				var config = {
					width: 800,
					height: 600,
					params: { enableDebugging:"0" }

				};
				config.params["disableContextMenu"] = true;
				var u = new UnityObject2(config);

				jQuery(function() {

					var $missingScreen = jQuery("#unityPlayer").find(".missing");
					var $brokenScreen = jQuery("#unityPlayer").find(".broken");
					$missingScreen.hide();
					$brokenScreen.hide();

	                textToSpeech($('#task').text().substring(0,110));
	                
	                $('#exercisePrompt').html($('#taskContainer').html());
	                $('#taskContainer').remove();

					u.observeProgress(function (progress) {
						switch(progress.pluginStatus) {
							case "broken":
								$brokenScreen.find("a").click(function (e) {
									e.stopPropagation();
									e.preventDefault();
									u.installPlugin();
									return false;
								});
								$brokenScreen.show();
							break;
							case "missing":
								$missingScreen.find("a").click(function (e) {
									e.stopPropagation();
									e.preventDefault();
									u.installPlugin();
									return false;
								});
								$missingScreen.show();
							break;
							case "installed":
								$missingScreen.remove();
							break;
							case "first":
							break;
						}
					});
					var body=$('#task').text();
					if (body.localeCompare("Make a fraction that equals 3/4 and has 12 as denominator.")==0){
						//doneButtonEnable(true);
						arrowButtonEnable(false);
						u.initPlugin(jQuery("#unityPlayer")[0], "/italk2learn/sequence/FractionsLab.unity3d?showStartPage=false&language="+getLocale()+"&idtask=EQUIValence1"+userName);
					}
					if (body.localeCompare("Make a fraction that equals 1/2 and has 4 as denominator.")==0){
						//doneButtonEnable(true);
						arrowButtonEnable(false);
						u.initPlugin(jQuery("#unityPlayer")[0], "/italk2learn/sequence/FractionsLab.unity3d?showStartPage=false&language="+getLocale()+"&idtask=EQUIValence2"+userName);
					}
					if (body.localeCompare("Use the same representations to show whether 1/3 is bigger or smaller than 1/5.")==0){
						//doneButtonEnable(true);
						arrowButtonEnable(false);
						u.initPlugin(jQuery("#unityPlayer")[0], "/italk2learn/sequence/FractionsLab.unity3d?showStartPage=false&language="+getLocale()+"&idtask=Comp1"+userName);
					}
					else {
						//doneButtonEnable(false);
						arrowButtonEnable(true);
						u.initPlugin(jQuery("#unityPlayer")[0], "/italk2learn/sequence/FractionsLab.unity3d?showStartPage=false&language="+getLocale());
					}
				});
				
				
				function getFLTaskID() {
					$.ajax({
						type: 'GET',
						url: "sequence/getFLTask",
						success: function (data) {
							u.initPlugin(jQuery("#unityPlayer")[0], "/italk2learn/sequence/FractionsLab.unity3d?showStartPage=false&language="+getLocale()+"&idtask="+data);
						},
						error: function (jqXHR, status, error) {
						}
					});
				}

				function initFractionsLab(data)
				{
					$.ajax({
						type: 'GET',
				        contentType : 'application/json; charset=utf-8',
				        dataType : 'json',
				        url: "setNewStudentInfo",
				        success: function(data, textStatus, jqXHR){
				        	//doSomething(data.Language,data.StundentInfo,data.TaskInfo)
				        },
				        error : function(jqXHR, status, error) {
				           alert('Sorry!, there was a problem');
				        },
				        complete : function(jqXHR, status) {
				        }
				    });
				}
				
				function saveEvent(event){
					//alert(event);
					var evt = {
					       	 "event": event 
					        };
					$.ajax({
						type: 'POST',
				        contentType : 'application/json; charset=utf-8',
				        dataType : 'json',
				        url: "sequence/saveFLEvent",
				        data: JSON.stringify(evt),
				        success: function(data){
				        	//alert('Change submitted!');
				        },
				        error : function(jqXHR, status, error) {
				        	window.location.href = "/italk2learn/login";
				        },
				    });
				}
				
				function sendMessageToLightBulb(message){
					helpButtonEnable(true);
					//lowMessage=lowMessage.concat(" ").concat(message);
					var aux=lowMessage+" "+message;
					lowMessage=aux;
				}
				
				
				function SendHighMessage(message)
				{
					var json = "{\"method\": \"HighFeedback\", \"parameters\": {\"message\": \"" + message +"\"}}";
					u.getUnity().SendMessage("ExternalInterface", "SendEvent", json);
				}
				
				function SendLowMessage(message)
				{
					var json = "{\"method\": \"LowFeedback\", \"parameters\": {\"message\": \"" + message +"\"}}";
					u.getUnity().SendMessage("ExternalInterface", "SendEvent", json);
				}

				function EnableHelpButton(message)
				{
					if (message.charAt(0)==='x'){
						helpButtonEnable(false);						
					}
					else {
						helpButtonEnable(true);
						var aux=lowMessage+" "+message;
						lowMessage=aux;
						//lowMessage=message;
					}
				}
				
				function SendMessageToSupport(message)
				{
					var json = "{\"method\": \"SendMessageToSupport\", \"parameters\": {\"message\": \"" + message +"\"}}";
					u.getUnity().SendMessage("ExternalInterface", "SendEvent", json);
				}
				
				function playSound(message)
				{
					textToSpeech(message);
				}
				
				
				function arrowButtonEnable(value){
					if (value==true || value=="true" || value=="True") {
						$("#next").removeAttr("disabled");
					}	
					else {
						$("#next").attr("disabled", "disabled");
					}	
				}
				
				function helpButtonEnable(value){
					if (value==true || value=="true" || value=="True"){
						$("#help").removeAttr("disabled");
						isEnabledLightBulb=true;
					}
					else {
						$("#help").attr("disabled", "disabled");
						isEnabledLightBulb=false;
					}
				}
				
				
				function SetNewStudentInfo(data)
				{
					$.ajax({
						type: 'POST',
				        contentType : 'application/json; charset=utf-8',
				        dataType : 'json',
				        url: "setNewStudentInfo",
				        data: JSON.stringify(sub),
				        success: function(data, textStatus, jqXHR){
				        	//doSomething()
				        },
				        error : function(jqXHR, status, error) {
				           alert('Sorry!, there was a problem');
				        },
				        complete : function(jqXHR, status) {
				        }
				    });
				}
				
				function isHelpButtonEnable(){
					return isEnabledLightBulb;
				}
				
				function arrowButtonPressed(){
					var json = "{\"method\": \"PlatformEvent\", \"parameters\": {\"eventName\": \"*arrowButtonPressed*\"}}";
                    u.getUnity().SendMessage("ExternalInterface", "SendEvent", json);
				}
				
				function helpButtonPressed(){
					textToSpeech(lowMessage);
					SendHighMessage(lowMessage);
					lowMessage="";
					helpButtonEnable(false);
					var json = "{\"method\": \"PlatformEvent\", \"parameters\": {\"eventName\": \"*lightBulbPressed*\"}}";
                    u.getUnity().SendMessage("ExternalInterface", "SendEvent", json);
				}
				
