const fs = require('fs');
const path = require('path');
const btoa = require('btoa');

module.exports = (() => {
    let __self = null;


    class AutoRouter {
        constructor() {
            __self = this;
        }

        // PUBLIC -------------------------------------------------------------
        getMapping(options) {

            this.applyOptions(options);

            try {
                const directories = this.getDirectoriesRecursive(this.rootp);

                let routes = directories
                    .map(p => path.normalize(p))

                    // only get the folders with a module of a router
                    .filter(p => __self.isRouterModule(p));

                const pat = path.normalize(this.rootp);


                // the mapping is entries of the providen route + module path to require
                let mapping = routes.map(r => {
                    const route = ('/' + r.replace(pat, '').replace(/[\\]+/g, '/')).toLowerCase();
                    const module = './' + r.replace(/[\\]+/g, '/');

                    return { route, module }
                })

                mapping = this.replaceSubRoutes(mapping);

                // replace specific routes by custom
                this.translateRoutes(mapping);

                // sorting by route alphabetically
                mapping = mapping.sort((a, b) => a.route.localeCompare(b.route));

                // display available routes
                this.hintMapping(mapping);

                // apply callback on mapping entries
                mapping.forEach(e => {
                    this.onmatch(e);
                });

                // return the mapping for further use
                return mapping;
            } catch (err) { this.onerr(err); }
        }

        // PRIVATE ------------------------------------------------------------
        applyOptions(options = {}) {

            //setting default options
            const {
                // default values
                verbose = true,
                rootp = "controllers/routes/",

                // default behaviors
                onmatch = match => {},
                onerr = ({
                    message
                }) => { console.log(message) },

                // replace specific routes by custom
                translations = [],

                subr = null // [null,cptlz,b64,{before:<String>,after:<String>}]
            } = options;

            // integrate the computed options to the RouteMapper fields
            Object.assign(this, { verbose, rootp, onmatch, onerr, translations, subr });
        }

        capitalize(r) {
            const { route } = r;
            const m = this.getSubRouteGroup(route);

            if (m[2].length > 0) {
                r.route = `${m[1]}${m[2].charAt(0).toUpperCase() + m[2].slice(1)}`;
            }
        }
        
        setBase64SubRoute({ mapping, i, route }) {
            const m = /^(\/?(?:[^\/]+\/)*)([^\/]*)$/.exec(route);
            const sub = m[2] ? m[2]:m[1]
            mapping[i].route = m[1] + btoa(sub);
        }

        getSubRouteGroup(route) {
            return /((?:\/.*\/?)?\/)([^\/]*)$/.exec(route);
        }

        frameRoute(r) {
            const { route } = r;

            const m = this.getSubRouteGroup(route);

            if (this.subr && this.subr.before) {
                r.route = `${m[1]}${this.subr.before+m[2]}`
            }
            if (this.subr && this.subr.after) {
                r.route += this.subr.after;
            }
        }

        replaceSubRoutes(mapping) {
            const result = mapping
                .sort((a, b) => a.route.localeCompare(b.route))
                .map((r, i) => {
                    const next = i < (mapping.length - 1) ? mapping[i + 1].route : "?";
                    const isSub = RegExp(`(${r.route.replace(/[/]+/g, '\\/')}\\/?).*`).test(next);

                    if (isSub) {
                        if (this.subr != null) {
                            if (typeof (this.subr) != "object") {
                                if (this.subr == "b64") {
                                    this.setBase64SubRoute(
                                        { mapping, i, route: r.route }
                                    );
                                } else if (this.subr == "cptlz") {
                                    this.capitalize(r);
                                }

                            } else {
                                this.frameRoute(r);
                            }
                        }
                    }
                    return r;
                });
            return result;
        }

        translateRoutes(mapping) {
            mapping.map(({ route }, i) => {
                __self.translations.forEach(t => {
                    if (("/" + t.from) == route) {
                        mapping[i].route = "/" + t.to;
                        return;
                    }
                });
            })
        }

        flatten(lists) {
            return lists.reduce((a, b) => a.concat(b), []);
        }

        getDirectories(srcpath) {
            return fs.readdirSync(srcpath)
                .map(file => path.join(srcpath, file))
                .filter(path => fs.statSync(path).isDirectory());
        }

        isRouterModule(path) {

            const hasIndexFile = fs.existsSync(path + "/index.js");

            if (hasIndexFile) {

                // get the pretened module
                const mod = require('./' + path);

                // is the module a function then a router ?
                return typeof (mod) == "function" ? mod.name == "router" : false;
            }
            return false;
        }

        getDirectoriesRecursive(srcpath) {
            return [ srcpath, ...__self
                    .flatten(__self.getDirectories(srcpath)
                        .map(__self.getDirectoriesRecursive)
                )
            ];
        }

        hintMapping(mapping) {
            if (this.verbose) {
                console.log(`\nAUTOROUTER: routers in '${this.rootp}'`)
                console.log("\u21AA", mapping.map(e => e.route))
                console.log("To turn this message off, use the AutoRouter with the option 'verbose:false'", "\n")
            }

        }
    }

    return new AutoRouter();
}).call(this)