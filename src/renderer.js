
import { ipcRenderer, shell } from 'electron'
import prettyBytes from 'pretty-bytes'

new Vue({
  el: '#app',
  data: {
    dirPath: '',
    imgsHead: [
      {
        type: 'selection',
        width: 60,
        align: 'center',
      },
      {
        title: '预览',
        key: 'path',
        width: '150px',
        render: (h, params) => h('a', {
          attrs: {
            href: params.row.path,
            target: '_blank',
          },
        }, [
          h('img', {
            attrs: {
              src: params.row.path,
              style: 'max-height:100px;max-width:100px;',
            },
          })
        ]),
      },
      {
        title: '路径',
        key: 'relativePath',
        sortable: true,
        sortType: 'asc',
        render: (h, params) => h('a', {
          attrs: {
            href: 'javascript:void(0);',
            title: params.row.path
          },
          on: {
            click: () =>{
              shell.showItemInFolder(params.row.path);
            }
          }
        }, params.row.relativePath),
      },
      {
        title: '格式',
        key: 'fileType',
        sortable: true,
        width: '100px',
      },
      {
        title: '体积',
        key: 'size',
        sortable: true,
        render: (h, params) => h('span', prettyBytes(params.row.size)),
        width: '100px',
      },
      {
        title: '尺寸',
        key: 'dimension',
        sortable: true,
        width: '100px',
        sortMethod: (a, b, type) => {
          const calVal = (v) => {
            const xIndex = v.indexOf('x');
            if (xIndex === -1) return 0;
            return +v.slice(0, xIndex) * v.slice(xIndex + 1, v.length);
          };
          if (type === 'desc') {
            return calVal(b) - calVal(a);
          }
          return calVal(a) - calVal(b);
        },
      },
      {
        title: '创建时间',
        key: 'ctime',
        sortable: true,
      },
      {
        title: '修改时间',
        key: 'mtime',
        sortable: true,
      },
    ],
    imgs: [],
    statusStr: '',
    isDirOpened: false,
    submitButtonText: '打开',
    inputTitle: '',
  },
  mounted() {
    this.dirPath = 'D:\\Pictures';
    ipcRenderer.on('imgs', (event, { succeed, data }) => {
      if (!succeed) {
        this.$Message.info('尝试打开目录失败，请检查路径');
        return;
      }
      this.openDirAfter(data);
    });
    this.statusStr = '等待打开目录';
  },
  methods: {
    prettyBytes(v) { return v; },
    openDirOrUpload() {
      if (this.isDirOpened) {
        this.upload();
      } else {
        this.openDir();
      }
    },
    upload() {

    },
    openDir() {
      ipcRenderer.send('open-dir', this.dirPath);
      this.statusStr = '正在打开目录...';
    },
    openDirAfter(data) {
      this.imgs = data;
      this.isDirOpened = true;
      this.submitButtonText = '上传';
      this.statusStr = `发现${this.imgs.length}项, 等待选中文件`;
      this.inputTitle = '点击重新选择';
    },
    closeDir() {
      if (!this.isDirOpened) return;
      this.imgs = [];
      this.isDirOpened = false;
      this.submitButtonText = '打开';
      this.statusStr = '等待打开目录';
      this.inputTitle = '';
    },
    showSelections(selections) {
      this.statusStr = `已选中${selections.length}项`;
    },
  },
});

// TODO 上传时，需要根据表格指定的排序，来决定上传的顺序
