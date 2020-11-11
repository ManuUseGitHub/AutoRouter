# AutoRouter &#128739;

Mapping your routes by your routes folder structure

##Don't waste time anymore on creating new routes!

#### Without this AutoRouter 
<i>On a bad day</i>, with the need of creating a new project with routing you have to do following steps :

0. <b>Create your server minimal code.</b>
1. Create your variable to store the new route.
1. Import the custom route module.
1. Edit the server file in the right place to make the new route available.
1. <b>Create the module Folder and its index.js exporting a router.</b>
1. <b>Define your route(s) into the new index.js module.</b>
1. Test if everything is working (you may have made some mistakes in the previous steps - like typos).
1. Make potential corrections.
1. Breath.

#### With this AutoRouter
<i>Still on a bad day, on a rush, tired, or whatever</i> :

0. <b>Create your server minimal code.</b>
1. <b>Create a Folder tree containing a module Folder and its index.js exporting a router for each leaf.</b>
1. <b>Define your route(s) into the new index.js module files.</b>
1. Breath.


## Getting started

1. Clone this repository somewhere.
    ```bash 
    $ git clone https://github.com/ManuUseGitHub/AutoRouter.git
    ```
1. Create the `server.js` file into a backend folder.
    ```bash
    #windows & mac
    $ echo // TODO : code here > backend/server.js

    #linux
    $ // TODO : code here > backend/server.js
    ```
1. Go into the `/backend` folder and set your node project and its dependencies
    run
    ```bash
    $ npm init
    $ npm install express
    ```
1. Change the `server.js` file to look like this :
    ```js
    const express = require('express');
    const app = express();

    const autoRouter = require("./AutoRouter");

    // ROUTES ----------------------------------------------------------
    const onmatch = ({route,module}) => app.use(route, require(module));
    autoRouter.getMapping({onmatch});
    // END ROUTES ------------------------------------------------------

    // Listening parameters
    app.listen(4000, () => {
        console.log("Ready on port: " + 4000);
    });
    ```
1. Copy either the `dist` or the `dev` implementation of AutoRouter into the same level as your server.js

    Here are their place
    - distribution : `dist/AutoRouter.min.js`
    - development : `dev/AutoRouter.js`
    
    <br/>**Note: The autorouter module has to be placed on the same level as the server.js file - in `/backend` - to simplify the path resolving.**
1. Create the `/backend/controllers/routes` folder structure.

1. Go to `/backend` and run the server
    ```bash
    $ npm run server
    ```
1. Create a router module in `/backend/controllers/routes/Test` and set the following code
    ```js
    const express = require("express");
    const router = express.Router();

    router.get('/', async (req, res) => {
        res.send("Hello world! The auto router works!");
    })

    module.exports = router;
    ```

## Customer services demo
I provide you with a straight forward demo based on a fictive service site. This service would, by design, handle customers no matter its abilities to consume the service...

It also gives you a good example of how the AutoRouter can be implemented.

1. Clone this repository somewhere.
    ```bash 
    $ git clone https://github.com/ManuUseGitHub/AutoRouter.git
    ```
1. Go into the `/demo/backend` and run the following commands
    ```bash
    $ npm install
    $ npm run server
    ```
1. Create a router module somewhere in `/demo/backend/controllers/routes`. 
    Let's say the `.../controllers/routes/AutoRouted` module. Create the `index.js` file. This file has to export a router ! Write it like this :
    ```js
    const express = require("express");
    const router = express.Router();

    router.get('/', async (req, res) => {
        res.send("Hello world! The auto router works!");
    })

    module.exports = router;
    ```

## Options
| Option       | default                                           | type            |
|--------------|---------------------------------------------------|-----------------|
| onmatch      | `match => {}`                                     | function        |
| onerr        | `({message}) => { console.log(message) }`         | function        |
| rootp        | `'controllers/routes/'`                           | string          |
| subr         | null                                              | misc            |
| translations | []                                                | array of object |
| verbose      | true                                              | false           |

***
#### `onmatch`
<small>onmatch : `on match`</small>
Function to pass to be apply on every route at the final process. That process iterates over simple objects containing the final route string (route) and the path to the module (module) relative to the given base folder path given by the <b>option</b> `rootp`.
```js
const onmatch = e => { 
    
    // destructured route item
    const { route, module } = e;
    
    express.use(route, require(module));
};
```
Sticking to this sniped is the better practice. Since the AutoRouter is calling `onmatch` anyway.
***
#### `onerr`
<small>onerr : `on error`</small>
Function to pass to handle exceptions that can very unlikely  happen during the auto routing. 
You may prefer to stick to the default value:
```js
const onerr = ({message}) => { console.log(message) }; // default value
```
***
#### `rootp`
<small>rootp : `root path`</small>
Defines the root folder to loop <b>recursively</b> to create the based route tree dynamically.
```js
const rootp = 'controllers/routes/'; // default value
```
**Note : the path should be relative to the server root level.**
***
#### `subr`
<small>subr : `sub route`</small>
Tells how to translate a route which is in a folder that points on a folder that is not a "leaf" in the folder tree part of `rootp`. 

**Note: Providing that special translation may avoid further eventual conflicts. Even routes work in the first place... prevention is the key!**

The value of subr can be either of these : 
```js
[ null | 'b64' | 'cptlz' | { after:'<something>', before:'<something>' } ]
```
use like this
```js
const subr = null ; // default value
```
**null case** : Take this following unchanged mapping. From the demo; `subr` is `null` by default:
```bash
AUTOROUTER: routers in 'controllers/routes/'
↪ [
  '/',                      #not a leaf !
  '/api',                   #not a leaf !
  '/api/customerservices',  #not a leaf !
  '/api/customerservices/cannotsee', #a leaf !
  ...,
  ]
```
**cptlz case** <small>`capitalize case`</small> : In this instance, the sub route will be capitalized ! `subr` is `cptlz` 

```bash
AUTOROUTER: routers in 'controllers/routes/'
↪ [
  '/', # nothing changed for the root ... (*)

  '/Api', # /api => /Api
  '/api/Customerservices', # /api/customServices => /api/CustomServices
  '/api/customerservices/cannotsee' # a leaf !
  ...,
]
```
**(*) root : you may not set a router in the root `/` in the first place ! But you may use the [`'translations'`](/#translations) option as a safe walkaround**

**b64 case** : In this following mapping ; `subr` is `'b64'` :
```bash
AUTOROUTER: routers in 'controllers/routes/'
↪ [
  ...,
  '/api/customerservices/cannotsee',

  # it's /api/b64('customerservices') !
  '/api/Y3VzdG9tZXJzZXJ2aWNlcw==', 
  ...,
  # it's /b64('/') ! impossible to make a b64 of '' so it is b64('/')
  '/Lw==', 
  # it's /b64('api') !
  '/YXBp'
]
```
**{before:'Hi_',after:'_Bye'}** : In this following mapping ; `subr` is `{before:'Hi_',after:'_Bye'}` :
```bash
AUTOROUTER: routers in 'controllers/routes/'
↪ [
  ...,
  '/api/customerservices/cannotsee',# a leaf !
  '/api/Hi_customerservices_Bye',   # applied to /api/customerservices'
  '/Hi__Bye',                       # applied to /<empty string>
  '/Hi_api_Bye'                     # applied to /api
]
```
***
#### `translations`
<small>`translations`</small>
Helps to customize routes in the final mapping. 
The AutoRouter will iterate over the `translations` to see if a `from` fully matchs a route in the mapping and thus it will replace that matching route by the `to` string.
**Note : none of the `from` or the `to` should have trailing slashes `'/'`.**
For this instance, we may want to hide the infirm part of the route because it may hurt some feelings.
```js
const translations = [{ 
        from : 'api/customerservices/special/infirm/deaf', 

        // you can issue this route like this : http://localhost:4000/deaf ... that's all !
        to : 'deaf'
    },
    {
        from : 'api/customerservices/special/infirm/blind',

        // the infirm segment has been removed! 
        // And breaking news, blind has been replaced by 'cannotsee' ! ... because blind people can't see
        to : 'api/customerservices/cannotsee'
    },
    {
        from : 'api/customerservices/special/infirm/mute',

        // Maybe desabled is more suitable than infirm but we dont want to refactor this little mistake
        to : 'api/customerservices/desabled/mute'
    }
];
```
***
#### `verbose`
<small>`verbose`</small>
Tells if you want to see the final resulting route list. It has `true` by default because it provides a direct check on your configurations. Turn this option to `false` if you want a clear integration.
```js
const verbose = true; // default value
```

### Applying all options
```js
// in server.js

// CONFIGURE options
const onerr = ({message}) => { console.log(message) }; // default value
const onmatch = ({route,module}) => express.use(route, require(module)); // most important
const rootp = 'controllers/routes/'; // default value
const subr = 'b64';
const translations = [{ 
    from : 'api/customerservices/special/infirm/deaf', to : 'deaf'
}];
const verbose = true; // default value

// APPLYING the mapping of routes with all options
autoRouter.getMapping({onerr,onmatch,rootp,subr,translations,verbose});
```

# Licence
[MIT](LICENSE)