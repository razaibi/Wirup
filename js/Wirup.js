"use strict";
var wirup = function() {};
wirup.prototype = function() {
    var _getElement = function(element_id) {
            return document.getElementById(element_id);
        },
        _wijax = (callType, url, contentType, callback) => {
            return new Promise(function(resolve, reject) {
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
            return new Promise(function(resolve, reject) {
                var _index;
                var _url = _appLocation;
                if (_appLocation === undefined) {
                    window.location = "/#/";
                }
                if (_views) {
                    for (var i = 0; i <= _views.length - 1; i++) {
                        if (_views[i]['url'] == _url) {
                            _index = i;
                        }
                    }
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
            _dataStore[dataItemName] = value
        },
        _renderViewComponents = () => {
            return new Promise(function(resolve, reject) {
                var _viewHTML = '';
                _getElement('contentBody').getElementsByTagName("*").forEach((_component)=>{
                    _viewHTML += '<' + _component.tagName.toLowerCase() + ' datasource="' + _component.getAttribute('datasource') + '" >';
                    _viewHTML += _buildComponent(_component.tagName.toLowerCase(), _component.getAttribute('datasource'));
                    _viewHTML += '</' + _component.tagName.toLowerCase() + '>';
                });
                _getElement('contentBody').innerHTML = _viewHTML;
                _registerAction('Switched View', 'Content Body', 'No Comment.');
                resolve();
            });
        },
        _updateComponentsByDataSourceName = (dataSourceName) => {
            _getElement('contentBody').querySelectorAll('[datasource="' + dataSourceName + '"]').forEach(function(elem) {
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
        _getObjectType = function(dataObject) {
            if (Array.isArray(dataObject)) {
                return "array"
            } else {
                return typeof(dataObject);
            }
        },
        _watchDataModel = function() {
            var _dataSnapShotList = {}
            setInterval(function() {
                for (var key in _dataStore) {
                    var stringified = JSON.stringify(window['wuObject']['dataStore'][key]);
                    if (typeof _dataSnapShotList[key] == 'undefined') {
                        _dataSnapShotList[key] = stringified;
                    }
                    if (_dataSnapShotList[key] != stringified) {
                        _dataSnapShotList[key] = stringified;
                        _updateComponentsByDataSourceName(key);
                    }
                }
            }, 3500);
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
        _runPreloader = function() {
            var _elem = document.getElementById("progress_bar");
            var width = 1;
            _elem.parentElement.style.display = 'block';
            var _updateLoaderInterval = setInterval(_updateLoader, 120);
            function _updateLoader() {
                if (width >= 100) {
                    _elem.parentElement.style.display = 'none';
                    window.clearInterval(_updateLoaderInterval);
                } else {
                    width += 10;
                    _elem.style.width = width + '%';
                }
            }
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
            _runPreloader();
            _loadScript('components/components.js').then(()=>{
                _registerViews().then(() => {
                    _getTemplate('contentBody').then(() => {
                        _renderViewComponents();
                    });
                });
            });
            
            _watchDataModel();
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
        dataStore: _dataStore,
        components: _components,
        init: _init
    };
}();
window.wuObject = new wirup();