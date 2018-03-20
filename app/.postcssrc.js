const Path = require('path');
const Paths = require('@config/common/path');

module.exports = {
  plugins: [
    require('autoprefixer')({}),
    require('postcss-sprites')({
      retina: false,
      relativeTo: 'file',
      spritePath: process.env.NODE_ENV === 'development' ? `${Paths.STATIC_COUTPUT_PATH}/assets/img` : `${Paths.ROOT_PATH}/.tmp`,
      spritesmith: {
        padding: 5,
      },
      groupBy: image => {
        const GroupName = Path.basename(Path.dirname(image.url));

        image.retina = true;
        image.ratio = 1;
        let ratio = /@(\d+)x\.(png|jpg|gif|jpeg)/i.exec(image.url);
        if (ratio) {
          ratio = ratio[1];
          while (ratio > 10) {
            ratio = ratio / 10;
          }
          image.ratio = ratio;
          image.groups = image.groups.filter((group) => {
            return ('@' + ratio + 'x') !== group;
          });
          return Promise.resolve(`${GroupName}@${ratio}x`);
        }

        return Promise.resolve(GroupName);
      },
      filterBy: image => {
        if (!/icons/i.test(image.url)) {
          return Promise.reject();
        }
        return Promise.resolve();
      },
      hooks: {
        // rename sprites file's name
        onSaveSpritesheet: (opts, spritesheet) => {
          const FilenameChunks = spritesheet.groups.concat(spritesheet.extension);
          return Path.posix.join(opts.spritePath, FilenameChunks.join('.'));
        },
        // inject background-position/background-image/size
        onUpdateRule: (rule, token, image) => {
          ['width', 'height'].forEach(prop => {
            rule.insertAfter(rule.last, require('postcss').decl({
              prop: prop,
              value: image.coords[prop] + 'px'
            }));
          });
          require('postcss-sprites/lib/core').updateRule(rule, token, image);
        }
      }
    })

  ]
}