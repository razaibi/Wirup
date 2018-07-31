"use strict";
var wirup = function(){};
wirup.prototype  = function(){
    var _getElement = function(element_id){
        return document.getElementById(element_id);
    },
    _wirex = function(callType, url, contentType, callback){
        var httpRequest = new XMLHttpRequest();
        httpRequest.open(callType, url,true);
        httpRequest.setRequestHeader("Content-Type", contentType);
        httpRequest.onload = callback;
        httpRequest.send();
        return httpRequest.responseText;
        
    },
    _routes = {},
    _viewTemplates,
    _appLocation = window.location.hash.split("#")[1],
    _registerTemplates = function(){
      _wirex("GET","templates/templates.json", "application/json; charset=UTF-8", _getTemplates);
    },
    _templateHolder = '',
    _setTemplateHolder = function(templateHolderId){
        _templateHolder = templateHolderId;
    },
    _getTemplates = function(){
        _viewTemplates = JSON.parse(this.responseText)['templates'];
    },
    _getTemplate = function(target){
        var _index;
        var _url = _appLocation;
        if(_appLocation === undefined){
            window.location = "/#/";
        }
        for(var i=0;i<=_viewTemplates.length-1;i++){
            
            if(_viewTemplates[i]['url']==_url){
                _index = i;
            }
        }
        _fillTemplate(_index, target);
    },
    _fillTemplate = function(index, target){
        _wirex("GET","templates/" + _viewTemplates[index]['HTML'],"text/plain; charset=UTF-8", function(){
            _getElement(target).innerHTML = this.responseText;
        });
    },
    _bindRouter = function(){
        window.onhashchange = function(){ 
            if (window.location.hash != _appLocation) {
                _appLocation = window.location.hash.split("#")[1];
                _init();
            };
        }
    },
    _components = [],
    _registerComponent = function(objComponent){
        var _foundAt;
        for(var i=0;i<=_components.length-1;i++){
            if(_components[i]['componentName'] == objComponent.componentName){
                _foundAt=i;
            }
        }
        if (_foundAt != undefined && _foundAt != null){
            _components[i] = objComponent;
        }else{
            _components.push(objComponent)
        }
    },
    _renderComponents = function(){
        var _templateComponents;
        for(var i=0;i<=_components.length-1;i++){
            _templateComponents = document.getElementsByTagName(_components[i]['componentName']);
            
            for(var z=0;z<=_templateComponents.length-1;z++){
                if (_templateComponents[z] != undefined && _templateComponents[z] != null){
                    _templateComponents[z].innerHTML = _components[i]['HTML'];
                }
            }
            
        }
    },
    _getDataObject = function(){
        return _dataObject;
    },
    _getDataListType = function(object){
        return typeof(_getDataObject());
    },
    _baseDataTemplates = [],
    _dataModels = [],
    _dataObject =null,
    _setBaseDataTemplate = function(templateName,templateHTML){
        var _found=false;
        for(var i=0;i <= _baseDataTemplates.length-1;i++){
            if(_baseDataTemplates[i].templateName==templateName){
                _found=true;
            }
        }
        if(!_found){
            _baseDataTemplates.push({"templateName":templateName,"templateHTML":templateHTML});
        }
    },
    _getBaseDataTemplateHTML = function(templateName){
        var _templateHTML;
        for(var i=0;i <= _baseDataTemplates.length-1;i++){
            if(_baseDataTemplates[i].templateName==templateName){
                _templateHTML = _baseDataTemplates[i].templateHTML;
            }
        }
        return _templateHTML;
    },
    _setDataModel = function(dataModelList,dataModelName,dataObject){
        var _found=false;
        for(var i=0;i <= dataModelList.length-1;i++){
            if(dataModelList[i].dataModelName==dataObject){
                _found=true;
                dataModelList[i][dataModelName]=dataObject;
            }
        }
        if(!_found){
            dataModelList.push({"dataModelName":dataModelName,"dataObject":dataObject});
        }
    },
    _dataSnapShot= [],
    _watchDataModel = function(){
        setInterval(function(){
            for(var i=0;i <= _dataModels.length-1;i++){
                if(_dataSnapShotList.length < _dataModels.length){
                    _dataSnapShotList[i] = JSON.stringify(window[_dataModels[i]['dataModelName']]);
                }
                if(_dataSnapShotList[i]!=JSON.stringify(window[_dataModels[i]['dataModelName']])){
                    _dataSnapShotList[i] = JSON.stringify(window[_dataModels[i]['dataModelName']])
                    _bindDataList();
                }
            }
        }, 500); 
    },
    _bindDataList = function(){
        _runPreloader();
        
        var _elements_list = document.querySelectorAll('[data-list]');
        var _subElementsArray = [];       
        var _temporaryElement;
        for (var i =0; i<= _elements_list.length-1;i++){
            var _dataObjectName = _elements_list[i].getAttribute("data-list");
            _temporaryElement = document.createElement(_elements_list[i].tagName);
            _temporaryElement.className = _elements_list[i].className;
            _setDataModel(_dataModels,_dataObjectName, window[_dataObjectName]);
            _setBaseDataTemplate(_dataObjectName,_elements_list[i]);
            if(_getDataListType(_dataObjectName)=="Array"){
            }else{
                _subElementsArray = _renderJsonDataList(_dataObjectName, _elements_list[i]);
                for (var z =0; z<= _subElementsArray.length-1;z++){
                    _temporaryElement.appendChild(_subElementsArray[z]);
                }
            }
            _temporaryElement.setAttribute('data-list',_dataObjectName);
            _elements_list[i].parentNode.replaceChild(_temporaryElement,_elements_list[i]);
        }
    },
    _renderJsonDataList = function(dataObjectName, htmlElement){
        if(typeof(window[dataObjectName])=="string"){
            var _jsonizedDataObject = _jsonize(dataObjectName);
        }else{
            var _jsonizedDataObject = window[dataObjectName];
        }
        window[dataObjectName] = _jsonizedDataObject;
        var _templateHtml=_getBaseDataTemplateHTML(dataObjectName);
        var _processedNode;
        var _subElementsArray = [];
        var _templateElement = document.createElement(_templateHtml.tagName);
        _templateElement.className = _templateHtml.className;
        for (var x=0; x<=_jsonizedDataObject[dataObjectName].length-1;x++) {
            var row = _jsonizedDataObject[dataObjectName][x];
            _processedNode = _parseDataKeys(dataObjectName, row, x, _templateHtml.childNodes[1]);
            _subElementsArray.push(_processedNode);
        }
        return _subElementsArray;
    },
    _parseDataKeys = function(dataObjectName,row, rowIndex, htmlElement){
        var _searchedNode;
        var _newNode = htmlElement.cloneNode(true);
        for (var key in row){
            _searchedNode = _searchDataNodes(dataObjectName, row, rowIndex, _newNode,key);
        }
        return _searchedNode;
    },
    _mutationObserverConfig = {
        subtree: true,
        attributes: true,
        characterData: true,
        characterDataOldValue:true
    },
    _fixAttributes = function(node, key, value){
        var _attributeKeys = node.attributes;
        for(var i = _attributeKeys.length - 1; i >= 0; i--) {
            var _attributeValue = _attributeKeys[i].value;
            var _comparisonKey = '--' + key + '--';
            if (_attributeValue==_comparisonKey){
               node.setAttribute(_attributeKeys[i].name,value)
            }
           
        }
    },
    _searchDataNodes = function(dataObjectName,row,rowIndex, container, key) {
        function recursor(container){
                for (var i = 0; i < container.childNodes.length; i++) {
                    var child = container.childNodes[i];
                    if(child.nodeType !== Node.TEXT_NODE && child.childNodes){
                        recursor(child);
                    }else{
                        var str=child.nodeValue;
                        if(str.indexOf('--' + key + '--')>-1){
                            
                            child.nodeValue=row[key];
                            _fixAttributes(child.parentElement, key, row[key]);
                            
                            var _jsonizedDataObject = window[dataObjectName];
                            var _mutationUICallback = function(mutationsList) {
                                for(var i = 0; i < mutationsList.length; i++) {
                                    //console.log(mutationsList[i]);
                                    console.log(_jsonizedDataObject);
                                    _jsonizedDataObject[dataObjectName][rowIndex][key] = child.nodeValue;
                                    window[dataObjectName] = _jsonizedDataObject;
                                    console.log(window[dataObjectName]);
                                }
                            };
                            var userInterfaceObserver = new MutationObserver(_mutationUICallback);
                            userInterfaceObserver.observe(container, _mutationObserverConfig);
                            };
                        };
                };
        };
        recursor(container);
        return container;
    },
    _get_keys = function (obj)
    {
        for (var k in obj)
        {
            if (typeof obj[k] == "object" && obj[k] !== null)
                _get_keys(obj[k]);
                _key_list.push(obj[k]);
        }
    },
    _jsonize = function(objectName){
        try{
            return JSON.parse(window[objectName]);
        }catch(e){
            return window[objectName];
        }
    },
    _loadScript = function(scriptPath){
        var _newScript = document.createElement('script');
        _newScript.type = 'text/javascript';
        _newScript.src = scriptPath;
        document.getElementsByTagName('head')[0].appendChild(_newScript);
    },
    _runPreloader = function(){
        var _elem = document.getElementById("progress_bar");
            var width = 1;
            _elem.parentElement.style.display='block';
            var id = setInterval(_updateLoader, 20);
            function _updateLoader() {
            if (width >= 100) {
                    clearInterval(id);
                    _elem.parentElement.style.display='none';
            } else {
                    width++;
                    _elem.style.width = width + '%';
            }
        }
    },
    _dataSnapShotList = [],
    _init = function(){

        _registerTemplates();
        setTimeout(function(){ _getTemplate('contentBody'); }, 1000);
        
        setTimeout(function(){ 
            _renderComponents();
        },2000);
        
        setTimeout(function(){ 
            _bindDataList();
            _watchDataModel();
        },3000);
        _bindRouter();
        _loadScript('components/components.js');
    };

    return{
        loadScript:_loadScript,
        setTemplateHolder:_setTemplateHolder,
        registerComponent : _registerComponent,
        renderComponents : _renderComponents,
        init:_init
    };

}();


window.wuObject = new wirup();


