 // Group Members - Zed and Shagun
 var app = {
     
       currentId: null
     , currentGuid: null
     , currentImg: null
     , idMsgDelete: null
     , baseurl: "https://griffis.edumedia.ca/mad9022/steg/"
     
     
     
     , init: function () {
         document.addEventListener("deviceready", app.onDeviceReady);
     }
     , onDeviceReady: function () {
         //Hide the Status Bar
         if (StatusBar.isVisible) {
             StatusBar.hide();
         }
         else {
             StatusBar.show();
         }
         // The button of Register
         var btnAdd = document.getElementById("register");
         btnAdd.addEventListener("touchstart", function (ev) {
             ev.preventDefault();
             var url = app.baseurl + "register.php";
             var fData = new FormData();
             fData.append("user_name", document.getElementById("userName").value);
             fData.append("email", document.getElementById("email").value);
             var req = new Request(url, {
                 method: "POST"
                 , mode: "cors"
                 , body: fData
             });
             
             fetch(req).then(function (response) {
                 return response.json();
             }).then(function (data) {
                 // Developing the success or fail message of registeration for users
                 if (data.code == 0) {
                     // In order to get all the succeeding calls to server, we are storing the user_id and user_guid
                     app.currentId = data.user_id;
                     app.currentGuid = data.user_guid;
                     let divPage = document.getElementById("loginPage");
                     let form = document.getElementById("loginForm");
                     let divMsg = document.createElement("div");
                     divMsg.classList.add("msg");
                     setTimeout(function () {
                         divMsg.classList.add("good");
                     }, 20);
                     divMsg.textContent = "Registered successfully.";
                     //insert the message before the form.
                     divPage.insertBefore(divMsg, form);
                     setTimeout((function (dparent, dm) {
                         return function () {
                             dparent.removeChild(dm);
                         }
                     })(divPage, divMsg), 2500);
                     setTimeout(function () {
                         app.signUpOrInSuccess();
                     }, 2500);
                 }
                 else if (data.code == 888) {
                     // For knowing the users that login in not successful, we are developing a message which will disappear after almost 3 seconds
                     let divPage = document.getElementById("loginPage");
                     let form = document.getElementById("loginForm");
                     let divMsg = document.createElement("div");
                     divMsg.classList.add("msg");
                     setTimeout(function () {
                         divMsg.classList.add("bad");
                     }, 20);
                     divMsg.textContent = "Username or e-mail already in use.";
                     // We are entering the message before the form
                     divPage.insertBefore(divMsg, form);
                     setTimeout((function (dparent, dm) {
                         return function () {
                             dparent.removeChild(dm);
                         }
                     })(divPage, divMsg), 3000);
                 }
                 else if (data.code == 999) {
                     let divPage = document.getElementById("loginPage");
                     let form = document.getElementById("loginForm");
                     let divMsg = document.createElement("div");
                     divMsg.classList.add("msg");
                     setTimeout(function () {
                         divMsg.classList.add("bad");
                     }, 20);
                     divMsg.textContent = "Invalid e-mail provided.";
                     divPage.insertBefore(divMsg, form);
                     setTimeout((function (dparent, dm) {
                         return function () {
                             dparent.removeChild(dm);
                         }
                     })(divPage, divMsg), 3000);
                 }
             });
         });
         // The button of Login
         var btnLogin = document.getElementById("login");
         btnLogin.addEventListener("touchstart", function (ev) {
             ev.preventDefault();
             var url = app.baseurl + "login.php";
             var fData = new FormData();
             fData.append("user_name", document.getElementById("userName").value);
             fData.append("email", document.getElementById("email").value);
             var req = new Request(url, {
                 method: "POST"
                 , mode: "cors"
                 , body: fData
             });
             fetch(req).then(function (response) {
                 return response.json();
             }).then(function (data) {
                
                 if (data.code == 0) {
                     // In order to get all the succeeding calls to server, we are storing the global variables user_id and user_guid
                     app.currentId = data.user_id;
                     app.currentGuid = data.user_guid;
                     app.signUpOrInSuccess();
                 }
                 else {
                     // For knowing the users that login in not successful, we are developing a message which will disappear after almost 3 seconds
                     let divPage = document.getElementById("loginPage");
                     let form = document.getElementById("loginForm");
                     let divMsg = document.createElement("div");
                     divMsg.classList.add("msg");
                     setTimeout(function () {
                         divMsg.classList.add("bad");
                     }, 20);
                     divMsg.textContent = "Login match is not found!";
                     
                     divPage.insertBefore(divMsg, form);
                     setTimeout((function (dparent, dm) {
                         return function () {
                             dparent.removeChild(dm);
                         }
                     })(divPage, divMsg), 3000);
                 }
             });
         });
         
         var btnSendMsgL = document.getElementById("btnSendMsgListModal");
         btnSendMsgL.addEventListener("touchstart", function (ev) {
                 var msgSendM = document.getElementById("msgSendModal");
                 msgSendM.classList.add("active");
             // For clicking a picture, we are creating a take-pic button
             // Moreover, for clearing all the previous imgs in the ul; the sendPage function will be in process
                 app.sendPage();
             })
         // In order to link the modals correctly, we are creating the send button in detailmsgmodal
         var btnSendMsgD = document.getElementById("btnSendDetailsMsgModal");
         btnSendMsgD.addEventListener("touchstart", function (ev) {
             // We are now removing the active from the detailsmsgmodal's class name list
             var detailsModal = document.getElementById("detailsMsgModal");
             detailsModal.classList.remove("active");
             // Now adding the active into msgSendM's class name list because if we go to msgSendM, then the msglistmodal come out unusually
             var msgSendM = document.getElementById("msgSendModal");
             msgSendM.classList.add("active");
             // dynamically create an take-pic button
             app.sendPage();
         });
         // The button of back in the details modal
         var btnBackInD = document.getElementById("btnBackInDetailsModal");
         btnBackInD.addEventListener("touchstart", function (ev) {
                 ev.preventDefault();
                 app.showList();
             })

         // The button of back in the send modal
         var btnBackInS = document.getElementById("btnBack");
         btnBackInS.addEventListener("touchstart", function () {
                 var btnTake = document.getElementById("takePicSendModal");
                 if (btnTake) {
                     var fParent = document.getElementById("formSendModal");
                     fParent.removeChild(btnTake);
                 }
             // we are clearing the select option and textarea
                 var lSelect = document.getElementById("selectNextSibling");
                 lSelect.selectedIndex = 0;
                 var text = document.getElementById("textSendmodal");
                 text.value = "";
             // Before sending the image to the server, we are reseting the global variable into null
                 app.currentImg = null;
             // Now, we are refreshing the message list
                 app.showList();
             })
         // The button of Send
         var btnToServer = document.getElementById("btnSend");
         btnToServer.addEventListener("touchstart", function (ev) {
             ev.preventDefault();
    
             // Now developing the poor message
             var select = document.getElementById("selectNextSibling");
             var idUserS = select.options[select.selectedIndex].value;
             if (idUserS == "disabledOption" || app.currentImg == null) {
                 // showing up user the fail message 
                 let divPage = document.getElementById("sendPage");
                 let ul = document.getElementById("msg-send-list");
                 let divMsg = document.createElement("div");
                 divMsg.classList.add("msg");
                 setTimeout(function () {
                     divMsg.classList.add("bad");
                 }, 20);
                 if (idUserS == "disabledOption" && app.currentImg == null) {
                     divMsg.textContent = "Please take a picture and select a recipient!";
                 }
                 else {
                     if (idUserS == "disabledOption") {
                         divMsg.textContent = "Please select a recipient";
                     }
                     else {
                         divMsg.textContent = "Please take a picture!";
                     }
                 }
                 divPage.insertBefore(divMsg, ul);
                 setTimeout((function (dparent, dm) {
                     return function () {
                         dparent.removeChild(dm);
                     }
                 })(divPage, divMsg), 4000);
             }
             // Placing the img on canvas and also information into canvas
             var canvas = document.createElement("canvas");
             var ctx = canvas.getContext("2d");
             var img = document.getElementById("imgTempInSendModalForDrawInCanvas");
             img.src = app.currentImg;
             var w = img.width;
             var h = img.height;
             canvas.style.width = w + "px";
             canvas.style.height = h + "px";
             canvas.width = w;
             canvas.height = h;
             ctx.drawImage(img, 0, 0);
             // Getting the id of any selected recipient
             var bitId = BITS.numberToBitArray(idUserS);
             // Mark that the return value is the canvas element
             canvas = BITS.setUserId(bitId, canvas);
             // we are just testing that if we can get userid even after setting the user id in canvas
             // Now, we are setting the msg length on canvas
             var text = document.getElementById("textSendmodal");
             // These are the no. of bits in a message
             var bitNum = text.value.length * 16;
             var bitLength = BITS.numberToBitArray(bitNum);
             canvas = BITS.setMsgLength(bitLength, canvas);
             // we are just tesing that if we can get msg length even after setting it on canvas
             
             var biText = BITS.stringToBitArray(text.value);
             canvas = BITS.setMessage(biText, canvas);
             
             canvas.toBlob(function (blob) {
                 var url = "https://griffis.edumedia.ca/mad9022/steg/" + "msg-send.php";
                 var fData = new FormData();
                 fData.append("user_id", app.currentId);
                 fData.append("user_guid", app.currentGuid);
                 fData.append("recipient_id", idUserS);
                 fData.append("image", blob, "test102.png");
                 var req = new Request(url, {
                     method: "POST"
                     , mode: "cors"
                     , body: fData
                 });
                 fetch(req).then(function (response) {
                     return response.json();
                 }).then(function (data) {
                     // Knowing that if the send is either successful or not
                     if (data.code == 0) {
                         // we are developing a message which will show that the sending is successful and will exists till almost 3 seconds and disappear after that
                         let divPage = document.getElementById("sendPage");
                         let ul = document.getElementById("msg-send-list");
                         let divMsg = document.createElement("div");
                         divMsg.classList.add("msg");
                         setTimeout(function () {
                             divMsg.classList.add("good");
                         }, 20);
                         divMsg.textContent = "Message has been sent!";
                         divPage.insertBefore(divMsg, ul);
                         setTimeout((function (dparent, dm) {
                             return function () {
                                 dparent.removeChild(dm);
                             }
                         })(divPage, divMsg), 4000);
                     }
                 });
             }, 'image/png');
         });
         // The button of delete msg
         var btnDelete = document.getElementById("btnDelete");
         btnDelete.addEventListener("touchstart", function (ev) {
             ev.preventDefault();
             // Next, we are deleting the message which is in the details modal window
             var url = app.baseurl + "msg-delete.php";
             var fData = new FormData();
             fData.append("user_id", app.currentId);
             fData.append("user_guid", app.currentGuid);
             fData.append("message_id", app.idMsgDelete);
             var req = new Request(url, {
                 method: "POST"
                 , mode: "cors"
                 , body: fData
             });
             fetch(req).then(function (response) {
                 return response.json();
             }).then(function (data) {
                 if (data.code == 0) {
                     // In the details page, we are just dispatching the touchend evnt on the button of back
                     var TouchEnd = new CustomEvent("touchend", {
                         bubbles: true
                     });
                     var btnBackInD2 = document.getElementById("btnBackInDetailsModal");
                     btnBackInD2.dispatchEvent(TouchEnd);
                     app.showList();
                 }
             });
         });
     }
     
     , showList: function () {
         var url = app.baseurl + "msg-list.php";
         var fData = new FormData();
         fData.append("user_id", app.currentId);
         fData.append("user_guid", app.currentGuid);
         var req = new Request(url, {
             method: "POST"
             , mode: "cors"
             , body: fData
         });
         fetch(req).then(function (response) {
             return response.json();
         }).then(function (data) {
             var list = document.getElementById("msg-list");
             list.innerHTML = "";
             // We have to build the msg list one by one, because if the returned Json object's code is 0
             if (data.code == 0) {
                 data.messages.forEach(function (msg) {
                     let li = document.createElement("li");
                     li.className = "table-view-cell ";
                     let div = document.createElement("div");
                     // We are string the sender name for the msg click in order to use it in msg details modal
                     div.setAttribute("data-senderName", msg.user_name);
                     div.className = "media-body";
                     div.textContent = "Message from: " + msg.user_name;
                     
                     let div_a_parent = document.createElement("div");
                     div_a_parent.className ="ChevronParent";
                     
                     let a = document.createElement("a");
                     a.className = "navigate-right ";

                     a.href = "#detailsMsgModal";
                     // In addition, we are storing the id also, and use it in msg details modal
                     a.setAttribute("data-msgIdClicked", msg.msg_id);
                     a.addEventListener("touchstart", app.showDetails);
                     div.appendChild(a);
                     li.appendChild(div);
                     list.appendChild(li);
                 })
             }
         });
     }
    
     , showDetails: function (ev) {
         let arrowClick = ev.currentTarget;
         let idMsgClick = arrowClick.getAttribute("data-msgIdClicked");
         app.idMsgDelete = idMsgClick;
         
         
         //grab the name strored as attribute in parent div of arrowClick
         let sender = arrowClick.parentElement.getAttribute("data-senderName");
         var url = app.baseurl + "msg-get.php";
         var fData = new FormData();
         fData.append("user_id", app.currentId);
         fData.append("user_guid", app.currentGuid);
         fData.append("message_id", idMsgClick);
         
         
         var req = new Request(url, {
             method: "POST"
             , mode: "cors"
             , body: fData
         });
         fetch(req).then(function (response) {
             return response.json();
         }).then(function (data) {
            
             if (data.code == 0) {
                 
                 
                 
                 // Now, we are building the details page which will show the sender's name and image from the sender
                 let ul = document.getElementById("msg-detail-list");
                 let imgL = document.createElement("li");
                 let img = document.createElement("img");
                 ul.innerHTML = ""; 
                 imgL.className = "table-view-cell";
                 imgL.textContent = "From: " + sender;
                 img.setAttribute('crossorigin', 'anonymous');
                 img.src = app.baseurl + data.image;
                 img.className = "media-object";
                 imgL.append(img);
                 ul.appendChild(imgL);
                 
                 
                 // Figure out the text from the image by placing the image on canvas
                 var canvas = document.createElement("canvas");
                 var ctx = canvas.getContext("2d");
                 var imgForDrawing = document.getElementById("imgTempInDetailsModalForDrawInCanvas");
                 imgForDrawing.src = app.baseurl + data.image;
                 imgForDrawing.setAttribute('crossorigin', 'anonymous');
                
                 imgForDrawing.addEventListener("load", function (ev) {
                     var w = imgForDrawing.width;
                     var h = imgForDrawing.height;
                     canvas.style.width = w + "px";
                     canvas.style.height = h + "px";
                     canvas.width = w;
                     canvas.height = h;
                     ctx.drawImage(imgForDrawing, 0, 0);
                     var text = document.getElementById("textDecode");
                     text.value = BITS.getMessage(app.currentId, canvas);
                 });
             }
         });
     }
     , sendPage: function () {
         var ul = document.getElementById("msg-send-list");
         ul.innerHTML = "";
         
         // Again, creating a button of take pic
         var btnTakeP = document.createElement("button");
         btnTakeP.className = "btn btn-positive btn-block";
         btnTakeP.setAttribute("id", "takePicSendModal");
         var span = document.createElement("span");
         span.className = "icon icon-play";
         span.textContent = "Take Picture";
         btnTakeP.appendChild(span);
         var fParent = document.getElementById("formSendModal");
         var nextSib = document.getElementById("selectNextSibling");
         fParent.insertBefore(btnTakeP, nextSib);
        
         
         
         // Hence, adding the eventlistener into the button of take-pic 
         var options = {
             quality: 60
             , destinationType: Camera.DestinationType.FILE_URI
             , encodingType: Camera.EncodingType.PNG
             , mediaType: Camera.MediaType.PICTURE
             , pictureSourceType: Camera.PictureSourceType.CAMERA
             , allowEdit: true
             , targetWidth: 300
             , targetHeight: 300
         };
         btnTakeP.addEventListener("touchstart", function (ev) {
             ev.preventDefault();
             navigator.camera.getPicture(app.successCall, app.errorCall, options);
         });
         
         
         
         // Now, building the drop down list in order to get the list of all the users
         var url = app.baseurl + "user-list.php";
         var fData = new FormData();
         fData.append("user_id", app.currentId);
         fData.append("user_guid", app.currentGuid);
         var req = new Request(url, {
             method: "POST"
             , mode: "cors"
             , body: fData
         });
         fetch(req).then(function (response) {
             return response.json();
         }).then(function (data) {
             var lSelect = document.getElementById("selectNextSibling");
             // Now, check out that Json object, if it is returned correctly, it can be empty array but not null
             if (data.code == 0) {
                 data.users.forEach(function (user) {
                     var option = document.createElement("option");
                     option.value = user.user_id;
                     option.textContent = user.user_name;
                     lSelect.appendChild(option);
                 })
             }
         });
     }
     , successCall: function (imageURI) {
         // We are adding the image before the take-pic button
         var ul = document.getElementById("msg-send-list");
         var imgL = document.createElement("li");
         imgL.className = "table-view-cell";
         var img = document.createElement("img");
         img.className = "media-object ";
         img.src = imageURI;
         imgL.appendChild(img);
         ul.appendChild(imgL);
         // As soon as the image is created, we remove the button of take-pic
         if (img) {
             var btnTake = document.getElementById("takePicSendModal");
             var fParent = document.getElementById("formSendModal");
             fParent.removeChild(btnTake);
         }
         app.currentImg = imageURI;
     }
     , errorCall: function (message) {
         alert('Failed because: ' + message);
     }
     , signUpOrInSuccess: function () {
         // if found that the user login is successful, we create an invisible anchor tag which will be linked to msglistmodal
         var invisibleA = document.createElement("a");
         invisibleA.href = "#msgListModal";
         var div = document.getElementById("loginPage");
         div.appendChild(invisibleA);
         // Again, dispatching the touchend evnt but now on the invisible anchor
         var TouchEnd = new CustomEvent("touchend", {
             bubbles: true
         });
         invisibleA.dispatchEvent(TouchEnd);
         var showHeader = document.getElementById("showHeaderListModal");
         showHeader.style.display = "inline-block";
         // Now, building the list of messages for the current user
         app.showList();
     }
     , getUserId: function (_canvas) {
         // all about the bits
         var ctx = _canvas.getContext('2d');
         var imgData = ctx.getImageData(0, 0, _canvas.width, _canvas.height);
         var _bitArray = [];
         for (var i = 0; i < 16; i++) {
             var index = (i * 4) + 2;
             var blue = imgData.data[index];
             var bit = blue & 1;
             _bitArray.push(bit);
         }
         return app.bitArrayNum(_bitArray);
     }
     , bitArrayNum: function (_bitArray) {
         // returning a two-byte integer using a 16 element
         if (_bitArray.length !== 16) {
             throw new Error('Invalid message length bit array size.');
         }
         var num = 0;
         for (var i = 0; i < 16; i++) {
             var shift = 15 - i;
             var num = num | (_bitArray[i] << shift);
         }
         return num;
     }
     , getMsgLength: function (_canvas) {
         var ctx = _canvas.getContext('2d');
         var imgData = ctx.getImageData(0, 0, _canvas.width, _canvas.height);
         var _bitArray = [];
         for (var p = 16; p < 32; p++) {
             var index = (p * 4) + 2;
             var blue = imgData.data[index];
             var bit = blue & 1;
             _bitArray.push(bit);
         }
         return app.bitArrayNum(_bitArray);
     }
 };
 app.init();