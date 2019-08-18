"use strict";
var wirup = function() {};
wirup.prototype = function() {
    var _getElement = function(element_id) {
            return document.getElementById(element_id);
        },
        _wijax = (callType, url, contentType, callback) => {
            return new Promise((resolve, reject)=> {
                var httpRequest = new XMLHttpRequest();
                httpRequest.open(callType, url, true);
                httpRequest.setRequestHeader("Content-Type", contentType);
                httpRequest.setRequestHeader('cache-control', 'no-cache');
                httpRequest.setRequestHeader('expires', '0');
                httpRequest.setRequestHeader('expires', 'Tue, 01 Jan 1980 1:00:00 GMT');
                httpRequest.setRequestHeader('pragma', 'no-cache');
                httpRequest.onreadystatechange = () => {
                    if (httpRequest.readyState !== 4) {
                        return;
                    }
                    if (httpRequest.status === 200) {
                        resolve(callback(httpRequest.responseText));
                    } else {
                        const error = httpRequest.statusText || 'Your ajax request threw an error.';
                        reject(error);
                    }
                };
                httpRequest.send();
                return httpRequest.responseText;
            });
        },
        _appLocation = window.location.hash.split("#")[1],
        _views,
        _registerViews = () => {
            return _wijax("GET", "views/views.json", "application/json; charset=UTF-8", _getViews);
        },
        _getViews = (data) => {
            _views = JSON.parse(data)['views'];
        },
        _getTemplate = (target) => {
            return new Promise((resolve, reject)=> {
                let _index;
                var _url = _appLocation;
                if (_appLocation === undefined || _appLocation == '/') {
                    window.location = "/#/";
                }
                if (_views) {
                    for (var i = 0; i <= _views.length - 1; i++) {
                        if (_views[i]['url'] == _url) {
                            _index = i;
                        }
                    }

                    if(_index === undefined){ _index = 0};
                    _fillView(_index, target).then(() => {
                        resolve();
                    });
                }
            });
        },
        _fillView = (index, target) => {
            return _wijax("GET", "views/" + _views[index]['HTML'], "text/plain; charset=UTF-8", (data) => {
                _getElement(target).innerHTML = data;
            });
        },
        _bindRouter = () => {
            window.onhashchange = function() {
                if (window.location.hash != _appLocation) {
                    _appLocation = window.location.hash.split("#")[1];
                    _init();
                };
            }
        },
        _dataStore = {},
        _components = {},
        _registerComponent = (componentName, template) => {
            _components[componentName] = template
        },
        _registerData = (dataItemName, value) => {
            Object.defineProperty(_dataStore, dataItemName, {     
                get: function() { return this['_' + dataItemName] },     
                set: function(newValue) { 
                    var _currentVal = this['_' + dataItemName];
                    this['_' + dataItemName] = newValue;
                    _updateComponentsByDataSourceName(dataItemName);
                } 
            });
            _dataStore[dataItemName] = value;
        },
        _addData = (dataItemName, newData) => {
            var _tempArray = [];
            _tempArray = _dataStore[dataItemName];
            _tempArray.push(newData);
            _dataStore[dataItemName] = _tempArray;
            _tempArray = [];
        },
        _updateData = (dataItemName, position, newData) => {
            var _tempArray = [];
            _tempArray = _dataStore[dataItemName];
            position = ((position-1)<0) ? 0 : position-1;
            _tempArray[position]= newData;
            _dataStore[dataItemName] = _tempArray;
            _tempArray = [];
        },
        _removeData = (dataSourceName, position) => {
            var _tempArray = [];
            _tempArray = _dataStore[dataSourceName];
            position = ((position-1)<0) ? 0 : position-1;
            _tempArray.splice((position),1);
            _dataStore[dataSourceName] = _tempArray;
            _tempArray = [];
        },
        _renderViewComponents = () => {
            return new Promise(function (resolve, reject) {
                var _viewComponents = _getElement('contentBody').querySelectorAll('[datasource]');
                [].forEach.call(_viewComponents, _component => {
                    _component.innerHTML = _buildComponent(_component.tagName.toLowerCase(),_component.getAttribute('datasource'));
                });
                _registerAction('Switched View','Content Body','No Comment.');
                resolve();
            });
        },
        _updateComponentsByDataSourceName = (dataSourceName) => {
            _getElement('contentBody').querySelectorAll('[datasource="' + dataSourceName + '"]').forEach((elem)=> {
                elem.innerHTML = _buildComponent(elem.tagName.toLowerCase(), dataSourceName);
                _registerAction('Updated Data.', elem.tagName.toLowerCase(), 'No Comment.');
            });
            
        },
        _buildComponent = (componentName, datasourceName) => {
            let output = '';
            var dataSourceType = typeof _dataStore[datasourceName];
            switch (dataSourceType) {
                case ('object'):
                    output = _dataStore[datasourceName].map((item, i) => {
                        return _components[componentName](item);
                    });
                    break;
                case ('string'):
                    output = _components[componentName](_dataStore[datasourceName]);
                    break;
            }
            return output.join("");
        },
        _buildComponents = (componentNames, datasourceNames) => {
            let output = '';
            componentNames.forEach((componentName, index) => {
                dataSourceType = typeof _dataStore[datasourceNames[index]];
                switch (dataSourceType) {
                    case ('object'):
                        output = _dataStore[datasourceNames[index]].map((item, i) => {
                            return _components[componentName](item);
                        });
                        break;
                    case ('string'):
                        output = _components[componentName](_dataStore[datasourceNames[index]]);
                        break;
                }
            });
            return output.join("");
        },
        _get_keys = function(obj) {
            for (var k in obj) {
                if (typeof obj[k] == "object" && obj[k] !== null)
                    _get_keys(obj[k]);
                _key_list.push(obj[k]);
            }
        },
        _jsonize = function(objectName) {
            try {
                return JSON.parse(window[objectName]);
            } catch (e) {
                return window[objectName];
            }
        },
        _loadScript = function(scriptPath) {
            return new Promise((resolve, reject)=>{   
                var _newScript = document.createElement('script');
                _newScript.type = 'text/javascript';
                _newScript.src = scriptPath + '?' + (new Date).getTime();
                document.getElementsByTagName('head')[0].appendChild(_newScript);
                _newScript.onload = ()=>{ 
                    resolve();
                };
                _newScript.onabort = ()=>{ 
                    reject();
                };
            });
        },
        _preloaderwidth = 1,
        _updatePreloader = (completionPercentage)=>{
            var _elem = document.getElementById("progress_bar");
            _elem.parentElement.style.display = 'block';
            if (completionPercentage >= 100) {
                _elem.parentElement.style.display = 'none';
            }else{
                _elem.parentElement.style.display = 'block';
            }
            _elem.style.width = completionPercentage + '%';
        },
        _profile = '',
        _registerAction = (actionName, actionElement, comment) => {
            let date = new Date();
            let timestamp = date.getTime();
            let action = {
                "name": actionName,
                "element": actionElement,
                "comment": comment,
                "profile": _profile,
                "timestamp": timestamp
            }
            let _actions = localStorage.getItem("wuActions");
            localStorage.setItem("wuActions", _actions + ',' + JSON.stringify(action));
        },
        _registerProfile = (profile) => {
            _profile = profile;
        },
        _init = () => {
            _loadScript('components/components.js').then(()=>{
                _updatePreloader(25);
                _registerViews().then(()=>{
                    _updatePreloader(55);
                    _getTemplate('contentBody').then(()=>{
                        _updatePreloader(75);
                        _renderViewComponents().then(()=>{
                            _updatePreloader(100);
                        });
                    });
                });
            });
            _bindRouter();
        };
    return {
        wu: _getElement,
        wijax: _wijax,
        jsonize: _jsonize,
        loadScript: _loadScript,
        registerComponent: _registerComponent,
        registerProfile: _registerProfile,
        registerAction: _registerAction,
        buildComponent: _buildComponent,
        buildComponents: _buildComponents,
        registerData: _registerData,
        addData:_addData,
        updateData : _updateData,
        removeData : _removeData,
        dataStore: _dataStore,
        components: _components,
        init: _init
    };
}();
window.wuObject = new wirup();