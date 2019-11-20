import { getMetadataArgsStorage } from 'routing-controllers';
import { getFromContainer, MetadataStorage } from 'class-validator' // tslint:disable-line
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { defaultMetadataStorage } from 'class-transformer/storage'
import { routingControllersToSpec } from 'routing-controllers-openapi';
import { injectable } from 'inversify';

const recurse = require('reftools/lib/recurse.js').recurse;
const clone = require('reftools/lib/clone.js').clone;
const jptr = require('reftools/lib/jptr.js').jptr;

export function filter(obj, options) {

    const defaults: any = {};
    defaults.tags = ['x-internal'];
    defaults.inverse = false;
    defaults.strip = false;
    defaults.overrides = [];
    options = Object.assign({}, defaults, options);

    let src = clone(obj);
    let filtered: any = {};
    let filteredpaths = [];
    recurse(src, {}, function (obj, key, state) {
        for (let override of options.overrides || []) {
            if (key.startsWith(override)) {
                obj[key.substring(override.length)] = obj[key];

                if (options.strip) {
                    delete obj[key];
                }
            }
        }
        for (let tag of options.tags) {
            if (obj[key] && obj[key][tag]) {
                if (options.inverse) {
                    if (options.strip) {
                        delete obj[key][tag];
                    }
                    jptr(filtered, state.path, clone(obj[key]));
                }
                filteredpaths.push(state.path);
                delete obj[key];
                break;
            }
        }
    });
    recurse(src, {}, function (obj, key, state) {
        if (Array.isArray(obj[key])) {
            obj[key] = obj[key].filter(function (e) {
                return typeof e !== 'undefined';
            });
        }
    });
    recurse(src, {}, function (obj, key, state) {
        // tslint:disable-next-line: no-collapsible-if
        if (obj.hasOwnProperty('$ref') && filteredpaths.includes(obj['$ref'])) {
            if (Array.isArray(state.parent)) {
                state.parent.splice(state.pkey, 1);
            }
        }
    });
    if (options.inverse && options.valid) {
        if (src.swagger && !filtered.swagger) {
            filtered.swagger = src.swagger;
        }
        if (src.openapi && !filtered.openapi) {
            filtered.openapi = src.openapi;
        }
        if (src.info && (!filtered.info || !filtered.info.version || !filtered.info.title)) {
            filtered.info = Object.assign({}, filtered.info, { title: src.info.title, version: src.info.version });
        }
        if (!filtered.paths) filtered.paths = {};
    }
    return (options.inverse ? filtered : src);
}

@injectable()
export class Apidoc {
    constructor() { }

    public getDocContent(specPath: string) {
        return `
<!DOCTYPE html>
<html>

<head>
<title>Backend API documentation</title>
<!-- needed for adaptive design -->
<meta name="viewport" content="width=device-width, initial-scale=1">
<link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700" rel="stylesheet">

<!--
ReDoc doesn't change outer page styles
-->
<style>
    body {
        margin: 0;
        padding: 0;
    }
</style>
</head>

<body>
<redoc spec-url=${specPath}></redoc>
<script src="https://cdn.jsdelivr.net/npm/redoc@next/bundles/redoc.standalone.js"></script>
</body>

</html>`;
    }

    public getFullSpec() {
        const storage = getMetadataArgsStorage() as any;

        const routingControllersOptions = {};

        const metadatas = (getFromContainer(MetadataStorage) as any).validationMetadatas;
        const schemas = validationMetadatasToSchemas(metadatas, {
            classTransformerMetadataStorage: defaultMetadataStorage,
            refPointerPrefix: '#/components/schemas/'
        });

        return routingControllersToSpec(storage, routingControllersOptions, {
            components: {
                schemas,
                securitySchemes: {
                    bearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT'
                    }
                }
            },
            security: [
                {
                    bearerAuth: []
                }
            ],
            servers: [
                { url: '//backend.acme.com/api/v1', description: 'Production server' },
                { url: '//backend-dev.acme.com/api/v1', description: 'Development server' }
            ],
            info: {
                title: 'Backend API',
                version: '1.0.0',
                description: ''
            }
        });
    }
}
