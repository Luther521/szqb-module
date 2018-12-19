// https://github.com/michael-ciniawsky/postcss-load-config
const path = require('path');
const ResolverFactory = require('enhanced-resolve/lib/ResolverFactory');
const NodeJsInputFileSystem = require('enhanced-resolve/lib/NodeJsInputFileSystem');
const CachedInputFileSystem = require('enhanced-resolve/lib/CachedInputFileSystem');

const CACHED_DURATION = 60000;
const fileSystem = new CachedInputFileSystem(new NodeJsInputFileSystem(), CACHED_DURATION);

const resolver = ResolverFactory.createResolver({
  alias: {
    '@': path.resolve(__dirname, 'src')
  },
  extensions: ['.css'],
  modules: ['src', 'node_modules'],
  useSyncFileSystemCalls: true,
  fileSystem
});
module.exports = {
  "plugins": {
    "postcss-import": {
      resolve(id, basedir) {
        return resolver.resolveSync({}, basedir, id);
      }
    },
    "postcss-url": {},
    "postcss-each":{},
    "postcss-aspect-ratio-mini": {},
    "postcss-write-svg": {
      utf8: false
    },
    "postcss-cssnext": {},
    "postcss-px-to-viewport": {
      viewportWidth: 750, // 视窗的宽度，对应的是我们设计稿的宽度. 
      viewportHeight: 1334, // 视窗的高度，根据750设备的宽度来指定，一般指定1334，也可以不配置. 
      unitPrecision: 3, // 指定‘px’转换为视窗单位值的小数位数（很多时候无法整除）. 
      viewportUnit: 'vw',// 指定需要转化成的视窗单位，建议使用vw. 
      selectorBlackList: ['.ignore', '.hairlines'],// 指定不转换为视窗单位的类，可以自定义，可以无限添加，建议定义一至两个通用的类名
      minPixelValue: 1,// 小于或者等于‘1px’不转换为视窗单位，你也可以设置为你想要的值. 
      mediaQuery: false// (Boolean) 允许媒体查询中转换‘px’. 
    },
    "postcss-viewport-units": {},
    "cssnano": {
      preset: "advanced",
      autoprefixer: false,
      "postcss-zindex": false
    }
  }
}
