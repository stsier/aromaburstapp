var _expireDeltaMs = 1; // 86400000; //1*60*1000//
var _is_expired = true;
var _isOffline = false;
var _is_app = document.URL.indexOf('localhost') === -1  && document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1  && document.URL.indexOf('C:/') === -1  && document.URL.indexOf('D:/') === -1;
var _is_dev = document.URL.indexOf('C:/') > -1 || document.URL.indexOf('D:/') > -1;

var DEBUG_MODE = "";
var scriptsDir="appscripts";

//===================Init=======================================================
var _builVersion = "1.1.6";

var _deviceLangcode =  "en";

var ABLocalInterface = {
 
  debugTimeOut: 1000,
  debugDetailedTimeOut: 1000,
  releaseTimeOut: 3000,
  expireDeltaMs: 1, // 86400000; //1*60*1000//
  stats_nid: -1,
  DEBUG_MODE_Android: "DEBUG",
  DEBUG_MODE_iOS: "",
  scripts: ["ABMain.js"],
  Connecting:
  {
    en: "Connecting...",
    fr: "Connection...",
    es: "Connecion...",
    ru: "Соединение..."
  },
  OneMoment:
  {
    "en": "One moment please, loading...",
    "fr": "Un instant s'il vous plaît, chargement...",
    "es": "Un momento por favor, cargando...",
    "ru": "Загузка приложения, подождите пожалуйста..."
  },
  YouAreOffline:
  {
    en: "You are offline",
    fr: "Vous n'êtes pas connecté-e au réseau",
    es: "No está conectadx al internet",
    ru: "Вы не подключены к интернету"
  },
  InitializationError:
  {
    "en": "Failed to initialize the app<br>Please, check your internet connection<br>Or try again later",
    "fr": "L'initialisation a échoué.<br>Vérifiez votre connexion internet<br>Ou réessayer plus tard",
    "es": "Inicialización falló.<br>Compruebe su conexión a Internet<br>O intente nuevamente más tarde",
    "ru": "Ошибка cоединения.<br>Проверьте подключение к интернету<br>или попробуйте еще раз позже"
  }, 
  ServerGetResultsError: 
  {
		"en": "Couldn't connect to the server, <br> please, try again later",
		"fr": "Impossible de se connecter au serveur. <br> Veuillez réessayer plus tard",
		"es": "No se pudo conectar al servidor,<br> intente de nuevo más tarde",
		"ru": "Не удалось подключиться к серверу, <br> повторите попытку позже",
		"de": "Keine Verbindung zu Server herstellbar, <br> bitte später versuchen",
		"nb": "Kunne ikke koble til server, <br> vennligst prøv igjen siden"
	}
};

jDrupal.settings = {
 sitePath: 'https://aromaburst.tsier.com',
 basePath: '/'
};

ons.bootstrap()
    .controller('AppController', function($scope) {
        this.load = function(page) {
            $scope.splitter.left.close();
        };

        this.toggle = function() {
            $scope.splitter.left.toggle();
        };

        /*  this.load = function(page) {
          $scope.splitter_right.right.close();
         };

         this.toggle = function() {
          $scope.splitter_right.right.toggle();
         };*/

    });

function startApp(){  
  setTimeout(()=>{

  getDeviceLanguage(); 
    if (_is_app)
    {
      document.addEventListener("deviceready", function()
      {
        ons.ready(function(){
            deviceReady();
           
        });
      }, false);
    }
    else
    {
      ons.ready(function(){
        deviceReady();
      });
    }
  },200);
}    

function deviceReady(){   

    var getLocalizationOnline = true;
    var now = new Date();
    var ABLocalInterface_cached = null;

    ABLocalInterface_cached = JSON.parse(localStorage.getItem("ABLocalInterface_cached"));
    if (ABLocalInterface_cached !== null) {
        ABLocalInterface = ABLocalInterface_cached;

        if ((parseInt(ABLocalInterface.expire) - parseInt(now.getTime())) > 0) {
            getLocalizationOnline = false;
            _is_expired = false;
            if(!_is_app) console.log("Cache expires in " + Math.ceil((parseInt(ABLocalInterface.expire) - parseInt(now.getTime())) / 1000) + "s");
            localizationSuccess();
        }
    }

    if (getLocalizationOnline) {
        if (!_isOnline()) {
            _exitApp();
        } else readJSONLocalizationFile(scriptsDir+"/app_local.json").then((text) => {
            ABLocalInterface = {};
            ABLocalInterface = JSON.parse(text);
            var new_minor_version = ABLocalInterface.minor_version;
            _debug_toast("received = " + new_minor_version,"DEBUG");

            ABLocalInterface.expire = parseInt(now.getTime()) + _expireDeltaMs;

            if(_is_dev || ABLocalInterface_cached === null || parseInt(ABLocalInterface_cached.minor_version)!=parseInt(new_minor_version)){
              for(let script of ABLocalInterface.scripts){
                localStorage.removeItem("cached_code_"+script.split(".")[0]);
              }
            }

            localStorage.removeItem("ABLocalInterface_cached");
            localStorage.setItem("ABLocalInterface_cached", JSON.stringify(ABLocalInterface));

            if(!_is_app) console.log("Cache expired");
            
            localizationSuccess();

        }, () => {
          _exitApp();
        });
    }

    function localizationSuccess(){
      if(_is_dev){
      }
      else if (_is_appleDevice()){
           /*|| !_is_app*/
          DEBUG_MODE = ABLocalInterface.DEBUG_MODE_iOS;
      } 
      else DEBUG_MODE = ABLocalInterface.DEBUG_MODE_Android;
      _injectScript(ABLocalInterface.scripts[0]).then(
        injectSuccessOnDeviceReady,
        injectFailOnDeviceReady
        );
    }
}
function injectSuccessOnDeviceReady()
{
  _initApp();
}
function injectFailOnDeviceReady()
{
  _exitApp();
}    
function readJSONLocalizationFile(src)
{
  return new Promise((resolve, reject) =>
  {
    var ajaxRequest = $.ajax(
    {
    url: jDrupal.restPath() +src,
    type: "GET",
    dataType: 'text',
    crossDomain: false,
    timeout: 30000,
    cache: false,
    async:false,
    success: function(result)
    {
        resolve(result);
    },
    error: function(jqXHR, textStatus)
    {
      _debug_toast(textStatus,"ERROR");
      ons.notification.toast(
      {
        message: ABLocalInterface.ServerGetResultsError[_deviceLangcode],
        timeout: 3000
      });
      reject();
    }
    });
  });
};

 
function _injectScript(src)
{
  return new Promise((resolve, reject) =>
  {
    var script;
    var code_name = "cached_code_"+src.split(".")[0];
    var code_type = src.split(".")[1];
    
    if(code_type=="css"){
      script = document.createElement('style');
    } else {
      script = document.createElement('script');
      script.type = 'text/javascript';
      script.setAttribute('defer');
    }

    script.innerHTML = localStorage.getItem(code_name);
    if(script.innerHTML =="null" || script.innerHTML ===null || script.innerHTML === "" || script.innerHTML === undefined)
    {

      if(_is_dev){
        _load_script("../"+scriptsDir+"/" + src, code_type).then(
          ()=>{
            resolve(code_name);
          },()=>{
          _release_toast(ABLocalInterface.ServerGetResultsError[_deviceLangcode]);
          reject();
        });
      }
      else{

        var ajaxRequest = $.ajax(
        {
        url: jDrupal.restPath() + "/" + scriptsDir +"/" + src+"?d="+Math.random(),
        type: "GET",
        dataType: 'text',
        crossDomain: false,
        timeout: 30000,
        success: function(result)
        {
          // (code_type=="css") ? script.href = result : script.text = result;
            script.innerHTML = result;
            document.head.appendChild(script);
            localStorage.setItem(code_name, result); 
            resolve(code_name);
        },
        error: function(jqXHR, textStatus)
        {
            console.log(JSON.stringify(jqXHR));
            _release_toast(ABLocalInterface.ServerGetResultsError[_deviceLangcode]);
            reject();
        }
        });
      }
    } else
    {
        document.head.appendChild(script);
        setTimeout(function()
        {
    
            resolve(code_name);
        
        }, 50);
    }
  });
} 

function _load_script(src, type="js"){
  return new Promise((resolve, reject) =>
  {
    var script;
    if(type=="css"){
      script = document.createElement('link');
      script.rel = 'stylesheet';
      script.type = 'text/css';
      script.href = src;
    } else {
      script = document.createElement('script');
      script.type = 'text/javascript';
      script.setAttribute('defer');
      script.src = src;
    }
    document.head.appendChild(script);
    script.onload = function()
    {
      setTimeout(function()
      {
          resolve();
      }, 50);
    };
    script.onerror = function()
    {
       reject();
    };
  });
}

function _is_appleDevice()
{
    if (navigator.userAgent.match(/(iPad|iPhone|iPod|iphone)/g) || navigator.userAgent.toLowerCase().includes("iphone") || navigator.userAgent.toLowerCase().includes("ipod") || navigator.userAgent.toLowerCase().includes("ipad"))
    return true;
}

function getDeviceLanguage(){
  var langcode = 'en';
  try
  {
    navigator.globalization.getPreferredLanguage(function(language)
    {
      var str = language.value;
      langcode = str.substr(0, 2);
    }, function()
    {
      console.log('Error getting language. Error:' + err);
      langcode = 'en';
    });
  }
  catch (err)
  {
    console.log('Unsupported getPreferredLanguage. Error:' + err);
    try
    {
      langcode = navigator.language.substr(0, 2);
    }
    catch (err)
    {
      console.log('Unsupported getPreferredLanguage. Error:' + err);
      langcode = 'en';
    }
  }

  _deviceLangcode = langcode;
}

function _exitApp(err_msg="")
{
  try
  {
    StatusBar.backgroundColorByHexString("#e5ab1e");
    StatusBar.overlaysWebView(false);
    StatusBar.styleLightContent();
  }
  catch (err)
  {
       console.log(err);
  } 
 try
 {
  navigator.splashscreen.hide();
 }
 catch(err){}
  var modal_text = document.getElementById('modal_text');
  var modal = document.getElementById('modal_custom');
  modal.show();
  if("" === err_msg){
    try
    {
      err_msg = ABLocalInterface.InitializationError[_deviceLangcode];
    }
    catch (err)
    {
        err_msg = "Failed to initialize the app<br>Please, check your internet connection<br>Or try again later";
    }
  }
  modal_text.innerHTML = err_msg;
 
  setTimeout(function()
  {
    _exit();
  }, 5000);
}
function _exit(){
  try
  {
    navigator.app._exitApp();
  }
  catch (err)
  {}
}

function _getNetworkType()
{
  try
  {
    var networkState = navigator.connection.type;
    var states = {};
    states[Connection.UNKNOWN] = -1; //'Unknown connection';
    states[Connection.ETHERNET] = 8; //'Ethernet connection';
    states[Connection.WIFI] = 7; //'WiFi connection';
    states[Connection.CELL_2G] = 2; //'Cell 2G connection';
    states[Connection.CELL_3G] = 3; //'Cell 3G connection';
    states[Connection.CELL_4G] = 4; //'Cell 4G connection';
    states[Connection.CELL] = 6; //'Cell generic connection';
    states[Connection.NONE] = 0; //'No network connection';
    return states[networkState];
  }
  catch (err)
  {
    _debug_toast(err,"ERROR");
    return 10;
  }
  
}
function _setOnline()
{
    _isOffline = false;
}
function _setOffline ()
{
    _isOffline = true;
}
function _isOnline ()
{
    if(!_isOffline && navigator.onLine && _getNetworkType() > 2) return true;
    else return false;
}

function _release_toast(msg, duration=ABLocalInterface.releaseTimeOut)
{
   if(null==msg) return;
    ons.notification.toast(
      {
        message: msg,
        timeout: duration
      });
    if(!_is_app) console.log(msg);
}

function _debug_toast(msg, level, duration=ABLocalInterface.debugTimeOut)
{
 if (DEBUG_MODE==level || DEBUG_MODE=="DEBUG"){
    ons.notification.toast(
      {
        message: level + ":<br>" + msg,
        timeout: duration
      });
  }
  if(!_is_app) console.log(msg);
}

function _debug_toast_err(err, duration=ABLocalInterface.debugDetailedTimeOut)
{
 if (DEBUG_MODE=="ERROR" || DEBUG_MODE=="DEBUG")
 {
    var caller_line = err.stack.split(":")[3].split(")")[0];
    ons.notification.toast(
      {
        message: "ERROR:<br>" + err.stack.split("\n").join("<br />") + "<br>At line " + caller_line,
        timeout: duration
      });
 }
 if(!_is_app) console.log(err);
}
function  handleOpenURL(url)
{
    var waiter = setInterval(timer, 100);

    function timer() {
        
     if(ABMain && ABMain.appReady){
        clearInterval(waiter);
        ABMain.openUrl(url);
     }
    }
}