import fs from 'fs';

const check_path = (target_path: string) => {
  const absolute_parent_path = target_path.split('/').slice(0, -1).join('/');
  if (!fs.existsSync(absolute_parent_path)) {
    fs.mkdirSync(absolute_parent_path, { recursive: true });
  }
};

const safe_fs: typeof fs = {
  ...fs,
  writeFileSync: (absolute_path: string, ...props) => {
    check_path(absolute_path);
    fs.writeFileSync(absolute_path, ...props);
  },
  createWriteStream: (absolute_path: string, ...props) => {
    check_path(absolute_path);
    return fs.createWriteStream(absolute_path, ...props);
  },
}

export default safe_fs;
