 		var pushNotification;

	// Cordova is ready
    //
    function onDeviceReady() {
   		
   		// Handle the pause event
 		pushNotification = window.plugins.pushNotification;
			
		//if (device.platform == 'android' || device.platform == 'Android') {
 			pushNotification.register(successHandler, errorHandler,{"senderID":"598429447813","ecb":"onNotificationGCM"});
		//} else {
    	//	pushNotification.register(tokenHandler, errorHandler {"badge":"true","sound":"true","alert":"true","ecb":"onNotificationAPN"});
		//}
 			
 		document.addEventListener("resume", onResume, false);
		document.addEventListener("pause", onPause, false);  
		document.addEventListener("destroy", onDestroy, false); 
		GET(v);
		if (v==1) updateData();
    }
		
		
	function onResume() {
		alert("onResume");
	}
    
	function onPause() {
    	// Handle the pause event
	  	//alert("onPause");
	}
		
		
	function onDestroy() {
		//pushNotification.unregister(successHandler, errorHandler);
	}
		        
    // handle GCM notifications for Android
    function onNotificationGCM(e) {
	    switch( e.event ){
    	    case 'registered':
				if ( e.regid.length > 0) {
				// Your GCM push server needs to know the regID before it can push to this device
				// here is where you might want to send it the regID for later use.
				//alert("regid received");
				$.ajax({
  					url:"http://mpr.srv1-14119.srv-net.de/query.php",
  					type:"POST",
  					data:{
  						"action":"registerDevice",
  						"serviceId":"2",
  						"organisationId":"1",
  						"deviceType":"gcm",	
  						"deviceRegId":e.regid,
  						"active":"on",
  						"pin":"100000"
					},
  					success:function(resp) {
    					alert("Bei mpr.srv registriert:"+resp);
  					}
				});
			}
            break;
                    
            case 'message':
				//alert("Message:"+e.message);
				updateData();

            break;
                    
            case 'error':
				alert("Err:"+e.msg);
            break;
                    
            default:
				alert("Unknown Message");                   
			break;
        }
	}
	// iOS
	function onNotificationAPN(event) {
    	if (event.alert) {
        	navigator.notification.alert(event.alert);
    	}

    	if (event.sound) {
        	var snd = new Media(event.sound);
        	snd.play();
    	}

    	if (event.badge) {
        	pushNotification.setApplicationIconBadgeNumber(successHandler, event.badge);
    	}
	}            
            
            
            
	function tokenHandler (result) {
		alert("token:"+result);
		// Your iOS push server needs to know the token before it can push to this device
			// here is where you might want to send it the token for later use.
	}
		
	function successHandler (result) {
		//alert("success:"+result);
	}
		
	function errorHandler (error) {
		//alert("error:"+error);
	}
	   

	// Aktuelle Daten vom server abholen
    function updateData() {
    	$('header').html('<p>Vorl&auml;ufige G&uuml;tedaten</p>');
		
		$.ajax({
  			url:"http://mpr.srv1-14119.srv-net.de/query.php",
  			type:"POST",
  			data:{
  				"action":"pullDataFromServer",
  				"serviceId":"2",
  				"organisationId":"1",
  				"pin":"100000"
			},
  			success:function(resp) {
    			playBeep();
				$('#tab-area').html("");
				$('#tab-area').html(makeStartHeader());			
				var myData = JSON.parse(resp,translate);
				for (var i = 0, len = myData.data.length; i < len; i++) {   			
    				old = $('#tab-area').html();
    				$('#tab-area').html(old+makeZeile(myData.data[i]));
    			}
    			old = $('#tab-area').html();
    			$('#tab-area').html(old+makeEndHeader());
    			//alert("resp: "+resp);
  			}
  		});
    }
	function translate(key,value) {
		return (key == "hemmstoffe") ? ["negativ","positiv"][value] : value;
	}
	
	
	function makeStartHeader() {
    	//	<th>Bezeichnung</th>
  		//	</tr>";
  		start = "<tr><th>Datum</th><th>Milchmenge</th><th>Fett</th><th>Eiwei&szlig;</th><th>Zellen</th><th>Keime</th><th>Gefrier</th><th>Laktose</th><th>Harnstoff</th><th>Hemmstoff</th></tr>";
		return (start);
	}   
	
	function makeZeile(d) {
		dd = d.dateInsert;
		dat = dd.substring(8,10)+"."+dd.substring(5,7);
		zeile = "<th>"+d.milchmenge+"</th><th class=data>"+d.fett+"</th><th class=data>"+d.fett+"</th><th class=data>"+d.zellen+"</th><th class=data>"+d.keime+"</th><th>"+d.gefrierpunkt+"</th><th class=data>"+d.laktose+"</th><th class=data>"+d.harnstoff+"</th>";
		if (d.hemmstoffe == "positiv") {
		   zeile = "<tr><th class=red>"+dat+"</th>"+zeile;
		   zeile = zeile + "<th class=red>"+d.hemmstoffe+"</th></tr>";
		} else {
		   zeile = "<tr><th>"+dat+"</th>"+zeile;
		   zeile = zeile + "<th class=green>"+d.hemmstoffe+"</th></tr>";
		}
		return (zeile);
	}   
	function makeEndHeader() {
		
		ende = "</table>";
		return (ende);
	}   
	

	function changeHeader() {
		$('header').html('<p>Meldungen</p>');
	}   
	function changeText() {
		//$('header').html('<p>Sonder</p>');
		//$('#tab-area').html('<H1>Neuer Text</H1>');
		$('#tab-area').html("");
	}   
	   
   // Show a custom alert
    //
    function showAlert() {
        navigator.notification.alert(
            'You are the winner!',  // message
            'Game Over',            // title
            'Done'                  // buttonName
        );
    }

    // Beep mit standard 
    //
    function playBeep() {
        navigator.notification.beep(1);
    }

    // Vibrate for 1 seconds
    //
    function vibrate() {
        navigator.notification.vibrate(1000);
    }
  
