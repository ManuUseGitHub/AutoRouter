# Maze-Autoroute &#128739;

Mapping your routes by a folder structure.

This document is a briefing of the npm package I published [here](https://www.npmjs.com/package/maze-autoroute). It only providews you with a enough documentation to help you setting a demo showcasing you how the maze-autoroute works. Thus, all the real technical stuffs are in the same place on the package documentation.

Go check the documentation to complete this one with more details.

## Don't waste time anymore on creating new routes!

#### Without an Autoroute 
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

#### With an Autoroute
<i>Still on a bad day, on a rush, tired, or whatever</i> :

0. <b>Create your server minimal code.</b>
1. <b>Create a Folder tree containing a module Folder and its index.js exporting a router for each leaf.</b>
1. Breath.

## Getting started
All the explanations are available on the [dedicated npm page](https://www.npmjs.com/package/maze-autoroute). to set the minial code

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

## Options
| Option       | default                                           | type            |
|--------------|---------------------------------------------------|-----------------|
| onmatch      | `match => {}`                                     | function        |
| onerr        | `({message}) => { console.log(message) }`         | function        |
| rootp        | `'routes/'`                           | string          |
| subr         | null                                              | misc            |
| translations | []                                                | array of object |
| verbose      | false                                              | true           |

More infos are available on the npm package page. Go see the [options](https://www.npmjs.com/package/maze-autoroute#options) section

***
#### `onmatch`
<small>onmatch : `on match`</small>
Function to pass to be applyed on every route at the final process.
***
#### `onerr`
<small>onerr : `on error`</small>
Function to pass to handle exceptions that can very unlikely  happen during the auto routing. 
***
#### `rootp`
<small>rootp : `root path`</small>
Defines the root folder to loop <b>recursively</b> to create the based route tree dynamically.
***
#### `subr`
<small>subr : `sub route`</small>
Tells how to translate a route which is in a folder that points on a folder that is not a "leaf" in the folder tree part of `rootp` folder tree. 

**Note: Providing that special translation may avoid further eventual conflicts. Even if routes work in the first place... prevention is the key!**
***
#### `translations`
<small>`translations`</small>
Helps to customize routes in the final mapping.
***
#### `verbose`
<small>`verbose`</small>
Tells if you want to see the final resulting route list.

# Licence
[MIT](LICENSE)
