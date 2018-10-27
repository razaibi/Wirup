![Image](https://raw.githubusercontent.com/razaibi/Wirup/master/projectArtwork/Logo.png)

## Introduction

Wirup is essentially a nano web UI framework aimed at enabling complex features like **one-way-data-binding**, **routing**, **component portability**, etc. with minimal lines of code. There are more complex and established frameworks facilitating these features (and more). However, they may have steep learning curves or may be heavy in size. Wirup is meant to enable beginners to get up and running quickly.

Like most of my other projects, Wirup will remain free (with a MIT license) and open to improvements and criticism all along the way. 

## Quick Start in 9 Mins

### 1. Project Structure

`Double dashes indicate files inside folders.`

#### Optional files and folder (included in sample project)

```
components
--components.js
css
--main.css
-sample.html
```

#### Mandatory files and folders
```
js
--Wirup.min.js
views
--views.json
index.html
```


### 2. Bring in your data
Wirup now uses the concept of a centralized datastore to aggregate all data source. Adding your data can simply done in the format showed below.

###### Below is an example of how JSON data should be structured.

```js
 wuObject.registerData('links',[
                { name: 'Google'},
                { name: 'Duck Duck go' },
                { name: 'Bing' }
]);
```

Alternatively you could use arrays to feed your UI.

###### Below is an example of how your arrays could look like.

```js
 wuObject.registerData('cloudServices',['Azure','AWS','Google Cloud']);
```

##### Also, you could use a simple object like the one shown below:

```js
 wuObject.registerData('headLineData','Wirup is Easy');
```

### 3. Create Component(s)
Goto the components folder in your project and create a component. This is like giving a wireframe to your component. You can use simple HTML to do so.

#####JSON Array as data source 

Wirup has evolved to incorporate template literals as they have become a natural part of JS and the web. 

Make sure **HTML for the component is enclosed in ticks and not single quotes**.

```js
wuObject.registerComponent('searchengines', (item) => {
        return `
          <h2>
          Engine Name : ${item.name}
          </h2>`            
});
```

The 'item' argument can be renamed to suit your naming scheme. However, make sure the argument name is used in the component template accordingly.

#####Regular JS Array as data source 

Alternatively, you could use an **array as the data source** for your component. Below is an exmaple of a component using an array.

```js
wuObject.registerComponent('searchengines', (item) => {
        return `
          <h2>
          Link : ${item}
          </h2>`            
});
```


Another way of wiring up would be to use an object like below. If you have a number of independent variables, this approach is handy. Check the above example of the headLineData being used as data source.

`The only caveat is that if you have html elements or components using the data source(s), make sure the data source is registered before rendering the components.`

```js
wuObject.registerComponent({
        "componentName": "scoreBox",
        "HTML": `<div class="panel">
                <div class="row">
                        <h2 class="light_title" data-value="headLineData.content"></h2>
                </div>
    
    </div>`
});

```


As you may have noticed above, the fields from your data are wired using double dashes -- on either sides of the field name. 

### 4. Setup template(s)


Quickly create a text file that corresponds to the name of the page you want to create. This will contain regular HTML like any other page. Remember **`templates are containers for components`**.

If you do not wish to setup any HTML and use only existing components you can do that like so

```html
<priceBox></priceBox>
```

Once you have created the textfile for your template, update the templates.json. **Add you page to the templates array** in the file and define the route on which you wish to seee it. 


```json
{
    "views": [
        {
            "viewName": "mainPage",
            "url": "/",
            "HTML": "mainPage.txt"
        }
    ]
}
```

### 5. Wait! Are we done already? 

Do not forget to get everything `wired up` with one simple command in any Javascript block one your page.

```js
wuObject.init();
```

#### Now, we are ready! ####

If you have node installed, simply type from the project directory. 

```console
http-server
```

Alternatively you code host your project in any webservers like any server side technologies like **ASP.Net Core, Bottle, Flask.**

## Features

- **One-Way-Data-Binding**

Wirup aims to keep your UI element(s) in sync with your data. This may be a move away from the initial approach to accomodate two-way binding. This is a conscious decision to minimize overhead in the framework and keeping it light weight. 

- **Component Portability**

Developers can quickly define small snippets of code as components and use them across the application. Components become condensed into small re-usable tags which can dropped into any templates. Also, their bound-data works right out of the box!!

- **Easy Routing**

Routing is one of the more complex behavior(s) to control with UI frameworks. Wirup provides a safe **hash-tag based** approach. Just define your routes with the templates and keep moving on.

- **Consistent behavior**

In its limited number of components, Wirup pushes developers to structure data driven components like lists correctly to ensure consistent behavior across browsers.

- **Data Sources**

Wirup is meant to work with the most commonly used data sources in a structured manner.


## Wirup Architecture

**Natural Data Objects**

>Wirup uses natural data objects like `JSON and Arrays` to serve as data sources for the application. The focus is to avoid managing complex models which need to be maintained separately. 

**Views**

>The application is subdivided into views (think as separate pages). These are like `UI containers which can be mapped on to specific URLs`.

**Components**

>Components are individual interface elements which can be wired up with data and used across templates. Seamless component re-usability across templates (or pages) is one of the key features of Wirup.

**Bound DOM Nodes**

>Once a component is defined and its data source setup, its iterative elements and automatically bound to the data source with `two-way-data-binding`. Any change in the DOM elements done via code or editable content, instantly updates the data source (frontend) and maintains sync. This is setup using MutationObservers. 

>Consequently, any changes in the data source object, instantly updates the DOM element. This is done using a `polling` approach where the state of the data source is constantly observed.

**The wuObject**

Wirup.js file exposes a global object wuObject which can be used by the application. They key reason this is done to do away with `initialization` process.

## Suggested Application Architecture

`Asynchronous and Service Oriented`

Wirup is intentionally developed in a way that caters to modern applications. In setups, where all of the heavy lifting is done by REST based services and UI is only intended for rendering, Wirup is ideal.


## Happy Coding!!


