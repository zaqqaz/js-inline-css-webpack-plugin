export default class Plugin {
    constructor(config = {}) {
        this.config = config;
        this.css = {};
        this.js = {};
    }

    isCurrentFileNeedsToBeInlined(fileName) {
        if (typeof this.config.filter === 'function') {
            return this.config.filter(fileName);
        } else {
            return true;
        }
    }

    prepare({ assets }) {
        const isCSS = is('css');
        const isJS = is('js');
        const { leaveCSSFile } = this.config;
        Object.keys(assets)
            .forEach((fileName) => {
                if (isCSS(fileName) && this.isCurrentFileNeedsToBeInlined(fileName)) {
                    this.css[fileName] = assets[fileName].source();
                    if (!leaveCSSFile) {
                        delete assets[fileName];
                    }
                }
                if (isJS(fileName) && this.isCurrentFileNeedsToBeInlined(fileName)) {
                    this.js[fileName] = assets[fileName].source();
                }
            });
    }

    process({ assets }) {
        Object.keys(this.js)
            .forEach((jsFileName) => {
                let js = this.js[jsFileName];
                Object.keys(this.css)
                    .forEach((key) => {
                        js = `${js}\n${genereateInjectScript(this.css[key])}`;
                    });
                assets[jsFileName] = {
                    source() {
                        return js;
                    },
                    size() {
                        return js.length;
                    },
                };
            });
    }

    apply(compiler) {
        compiler.hooks.emit.tapAsync('js-inline-css-webpack-plugin', (compilation, callback) => {
            this.prepare(compilation);
            this.process(compilation, compiler.options);
            callback();
        });
    }
}

function is(filenameExtension) {
    const reg = new RegExp(`\.${filenameExtension}$`);
    return (fileName) => reg.test(fileName);
}

function genereateInjectScript(styles) {
    return converToOneLine(`(function() {
    var node = document.createElement('style');
    node.innerHTML='${converToOneLine(styles)}';
    document.body.appendChild(node);}());`).replace(' ', '');
}

function converToOneLine(str) {
    return str.replace(/\n/g, '');
}
