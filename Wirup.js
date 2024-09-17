"use strict";
var wirup = function () {};
wirup.prototype = (function () {
  var _getElement = function (element_id) {
      return document.getElementById(element_id);
    },
    _wijax = (callType, url, contentType, callback) => {
      return new Promise((resolve, reject) => {
        const httpRequest = new XMLHttpRequest();
        httpRequest.open(callType, url, true);
        httpRequest.setRequestHeader("Content-Type", contentType);
        httpRequest.setRequestHeader("cache-control", "no-cache");
        httpRequest.setRequestHeader("expires", "0");
        httpRequest.setRequestHeader("expires", "Tue, 01 Jan 1980 1:00:00 GMT");
        httpRequest.setRequestHeader("pragma", "no-cache");
        httpRequest.onreadystatechange = () => {
          if (httpRequest.readyState !== 4) {
            return;
          }
          if (httpRequest.status === 200) {
            resolve(callback(httpRequest.responseText));
          } else {
            const error =
              httpRequest.statusText || "Your ajax request threw an error.";
            reject(error);
          }
        };
        httpRequest.send();
      });
    },
    _appLocation = window.location.pathname,
    _views,
    _registerViews = () => {
      return _wijax(
        "GET",
        "views/views.json",
        "application/json; charset=UTF-8",
        _getViews
      );
    },
    _getViews = (data) => {
      _views = JSON.parse(data)["views"];
    },
    _getTemplate = (target) => {
      return new Promise((resolve, reject) => {
        let _index;

        // Fallback mechanism: if _appLocation is not defined, default to root "/"
        const _url = _appLocation || "/";

        // Handle edge cases where _views might be undefined or empty
        if (!_views || _views.length === 0) {
          reject("Views are undefined or empty, cannot load template.");
          return;
        }

        // Find the index of the view matching the current URL (_appLocation)
        for (let i = 0; i < _views.length; i++) {
          if (_views[i]["url"] === _url) {
            _index = i;
            break;
          }
        }

        // Handle the case where the URL does not match any view
        if (_index === undefined) {
          console.warn(
            `No view found for the URL: ${_url}. Redirecting to default view.`
          );
          _index = 0; // You can redirect to a "Not Found" page or the default page.
        }

        // Fill the view with the found index
        _fillView(_index, target)
          .then(() => resolve())
          .catch((error) => {
            console.error(`Error filling view for URL ${_url}: ${error}`);
            reject(`Failed to fill view for ${_url}`);
          });
      }).catch((error) => {
        console.error(`Error in _getTemplate: ${error}`);
        console.error("View may not have been defined.");
      });
    },
    _fillView = function (index, targetElementId) {
      const htmlFilePath = "views/" + _views[index]["viewFile"];
      return new Promise((resolve, reject) => {
        fetch(htmlFilePath + "?")
          .then((response) => {
            if (response.ok) {
              return response.text();
            } else {
              reject(`Failed to load HTML view: ${htmlFilePath}`);
            }
          })
          .then((htmlContent) => {
            const targetElement = _getElement(targetElementId);
            if (targetElement) {
              targetElement.innerHTML = htmlContent;
              resolve(); // Resolve the promise if the HTML content is successfully injected
            } else {
              reject(`Target element with ID "${targetElementId}" not found`);
            }
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    _bindRouter = () => {
      window.onpopstate = (event) => {
        _appLocation = window.location.pathname; // Handle back/forward button
        _init();
      };
    },
    _navigateTo = (url) => {
      history.pushState(null, null, url); // Update URL without reloading
      _appLocation = url; // Update internal app location
      _getTemplate("contentBody").then(() => {
        _renderViewComponents();
      });
    },
    _dataStore = {},
    _components = {},
    _loadObserver = {},
    _registerComponent = (componentName, template) => {
      _components[componentName] = template;
    },
    _registerData = (dataItemName, value) => {
      Object.defineProperty(_dataStore, dataItemName, {
        get: function () {
          return this["_" + dataItemName];
        },
        set: function (newValue) {
          var _currentVal = this["_" + dataItemName];
          this["_" + dataItemName] = newValue;
          _updateComponentsByDataSourceName(dataItemName);
        },
      });
      _dataStore[dataItemName] = value;
    },
    _onLoad = (value) => {
      Object.defineProperty(_loadObserver, "trigger", {
        get: function () {
          return this["_trigger"];
        },
        set: function (newValue) {
          let _currentVal = this["_trigger"];
          this["_trigger"] = newValue;
          window[newValue]();
        },
      });
      _loadObserver["trigger"] = value;
    },
    _addData = (dataItemName, newData) => {
      let _tempArray = [];
      _tempArray = _dataStore[dataItemName];
      _tempArray.push(newData);
      _dataStore[dataItemName] = _tempArray;
      _tempArray = [];
    },
    _findIndexByKey = function (dataSourceName, keyName, keyValue) {
      if (!this.dataStore[dataSourceName]) {
        throw new Error(
          `Data source '${dataSourceName}' not found in dataStore`
        );
      }
      const index = this.dataStore[dataSourceName].findIndex((dataItem) => {
        return dataItem[keyName] === keyValue;
      });
      return index;
    },
    _updateData = (dataItemName, position, newData) => {
      let _tempArray = [];
      _tempArray = _dataStore[dataItemName];
      position = position - 1 < 0 ? 0 : position - 1;
      _tempArray[position] = newData;
      _dataStore[dataItemName] = _tempArray;
      _tempArray = [];
    },
    _removeData = (dataSourceName, position) => {
      let _tempArray = [];
      _tempArray = _dataStore[dataSourceName];
      position = position - 1 < 0 ? 0 : position - 1;
      _tempArray.splice(position, 1);
      _dataStore[dataSourceName] = _tempArray;
      _tempArray = [];
    },
    _renderViewComponents = () => {
      return new Promise(function (resolve, reject) {
        let _viewComponents =
          _getElement("contentBody").querySelectorAll("[datasource]");
        [].forEach.call(_viewComponents, (_component) => {
          _component.innerHTML = _buildComponent(
            _component.tagName.toLowerCase(),
            _component.getAttribute("datasource")
          );
        });
        _registerAction("Switched View", "CBody", "NA");
        resolve();
      });
    },
    _updateComponentsByDataSourceName = (dataSourceName) => {
      _getElement("contentBody")
        .querySelectorAll('[datasource="' + dataSourceName + '"]')
        .forEach((elem) => {
          elem.innerHTML = _buildComponent(
            elem.tagName.toLowerCase(),
            dataSourceName
          );
          _registerAction(
            "Updated Data.",
            elem.tagName.toLowerCase(),
            "No Comment."
          );
        });
    },
    _buildComponent = (componentName, datasourceName) => {
      let output = [];
      const dataSource = _dataStore[datasourceName];
      const dataSourceType = typeof dataSource;

      switch (dataSourceType) {
        case "object":
          if (Array.isArray(dataSource)) {
            // Handle the case where it's an array
            output = dataSource.map((item) => {
              return _components[componentName](item);
            });
          } else {
            // Handle the case where it's an object (non-array)
            output.push(_components[componentName](dataSource));
          }
          break;

        case "string":
          // Handle the case where it's a string
          output.push(_components[componentName](dataSource));
          break;

        default:
          throw new Error(`Unsupported data type: ${dataSourceType}`);
      }

      // If output is an array, join it. Otherwise, return it directly.
      return Array.isArray(output) ? output.join("") : output;
    },
    _buildComponents = (componentNames, datasourceNames) => {
      let output = [];

      componentNames.forEach((componentName, index) => {
        const dataSource = _dataStore[datasourceNames[index]];
        const dataSourceType = typeof dataSource;

        switch (dataSourceType) {
          case "object":
            if (Array.isArray(dataSource)) {
              output = output.concat(
                dataSource.map((item) => _components[componentName](item))
              );
            } else {
              output.push(_components[componentName](dataSource));
            }
            break;
          case "string":
            output.push(_components[componentName](dataSource));
            break;

          default:
            throw new Error(`Unsupported data type: ${dataSourceType}`);
        }
      });

      // Return joined output if it's an array
      return Array.isArray(output) ? output.join("") : output;
    },
    _jsonize = function (objectName) {
      try {
        return JSON.parse(window[objectName]);
      } catch (e) {
        return window[objectName];
      }
    },
    _loadScript = function (scriptPath) {
      return new Promise((resolve, reject) => {
        let _newScript = document.createElement("script");
        _newScript.type = "text/javascript";
        _newScript.src = scriptPath;
        document.getElementsByTagName("head")[0].appendChild(_newScript);
        _newScript.onload = () => {
          resolve();
        };
        _newScript.onabort = () => {
          reject();
        };
      });
    },
    _loadScriptsFromFolder = (folderPath, scriptNames) => {
      return new Promise((resolve, reject) => {
        const promises = scriptNames.map((scriptName) => {
          return new Promise((resolveScript, rejectScript) => {
            const _newScript = document.createElement("script");
            _newScript.type = "text/javascript";
            _newScript.src = `${folderPath}/${scriptName}`;
            document.getElementsByTagName("head")[0].appendChild(_newScript);

            _newScript.onload = () => resolveScript();
            _newScript.onerror = () =>
              rejectScript(`Failed to load script: ${scriptName}`);
          });
        });

        Promise.all(promises)
          .then(resolve)
          .catch((err) => {
            console.error(`Error loading scripts from folder: ${err}`);
            reject(err);
          });
      }).catch((error) => {
        console.error(`Error in _loadScriptsFromFolder: ${error}`);
      });
    },
    _profile = "",
    _registerAction = (actionName, actionElement, comment) => {
      let date = new Date();
      let timestamp = date.getTime();
      let action = {
        name: actionName,
        element: actionElement,
        comment: comment,
        profile: _profile,
        timestamp: timestamp,
      };
      let _actions = localStorage.getItem("wuActions");
      localStorage.setItem(
        "wuActions",
        _actions + "," + JSON.stringify(action)
      );
    },
    _registerProfile = (profile) => {
      _profile = profile;
    },
    _onContentLoad = (functionName) => {
      return window[functionName]();
    },
    _renderAll = (config) => {
      return new Promise(function (resolve, reject) {
        let componentsFiles = ["components.js"];
        if (
          config?.components &&
          Array.isArray(config.components) &&
          config.components.length > 0
        ) {
          componentsFiles = config.components;
        }
        _loadScriptsFromFolder("components", componentsFiles).then(() => {
          _registerViews().then(() => {
            _getTemplate("contentBody").then(() => {
              _renderViewComponents().then(() => {
                _bindRouter();
                if (typeof config.callbackName !== "undefined") {
                  _onContentLoad(config.callbackName);
                }
              });
            });
          });
        });
      });
    },
    _init = (config) => {
      _renderAll(config);
    };
  return {
    wx: _getElement,
    wijax: _wijax,
    jsonize: _jsonize,
    loadScript: _loadScript,
    registerComponent: _registerComponent,
    registerProfile: _registerProfile,
    registerAction: _registerAction,
    buildComponent: _buildComponent,
    buildComponents: _buildComponents,
    navigateTo: _navigateTo,
    registerData: _registerData,
    addData: _addData,
    findIndexByKey: _findIndexByKey,
    updateData: _updateData,
    removeData: _removeData,
    dataStore: _dataStore,
    onLoad: _onLoad,
    components: _components,
    init: _init,
  };
})();
window.wu = new wirup();