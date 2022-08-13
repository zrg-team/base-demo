/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');

const NEWLINE = '\n';
const RE_INI_KEY_VAL = /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/;
const RE_NEWLINES = /\\n/g;
const NEWLINES_MATCH = /\r\n|\n|\r/;

function parse(
  src /*: string | Buffer */,
  options /*: ?DotenvParseOptions */,
) /*: DotenvParseOutput */ {
  const debug = Boolean(options && options.debug);
  const obj = {};

  // convert Buffers before splitting into lines and processing
  src
    .toString()
    .split(NEWLINES_MATCH)
    .forEach(function (line, idx) {
      // matching "KEY' and 'VAL' in 'KEY=VAL'
      const keyValueArr = line.match(RE_INI_KEY_VAL);
      // matched?
      if (keyValueArr != null) {
        const key = keyValueArr[1];
        // default undefined or missing values to empty string
        let val = keyValueArr[2] || '';
        const end = val.length - 1;
        const isDoubleQuoted = val[0] === '"' && val[end] === '"';
        const isSingleQuoted = val[0] === "'" && val[end] === "'";

        // if single or double quoted, remove quotes
        if (isSingleQuoted || isDoubleQuoted) {
          val = val.substring(1, end);

          // if double quoted, expand newlines
          if (isDoubleQuoted) {
            val = val.replace(RE_NEWLINES, NEWLINE);
          }
        } else {
          // remove surrounding whitespace
          val = val.trim();
        }

        obj[key] = val;
      } else if (debug) {
        console.log(
          `did not match key and value when parsing line ${idx + 1}: ${line}`,
        );
      }
    });

  return obj;
}

try {
  const args = process.argv.slice(2);
  const params = args
    .map(item => {
      const data = `${item}`.split(':');
      return {
        key: data[0],
        value: data[1],
      };
    })
    .reduce((all, item) => {
      return { ...all, [item.key]: item.value };
    }, {});

  let dotenvPath = path.resolve(process.cwd(), params.env);
  let encoding /*: string */ = 'utf8';
  let debug = false;
  // specifying an encoding returns a string instead of a buffer
  const parsed = parse(fs.readFileSync(dotenvPath, { encoding }), { debug });

  Object.keys(parsed).forEach(function (key) {
    if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
      process.env[key] = parsed[key];
    } else if (debug) {
      console.log(
        `"${key}" is already defined in \`process.env\` and will not be overwritten`,
      );
    }
  });

  fs.writeFileSync(
    path.resolve(process.cwd(), 'src/shared/react-native-config/env.json'),
    JSON.stringify(parsed, '\t', 2),
  );

  return { parsed };
} catch (e) {
  console.log('err', e);
  return { error: e };
}
