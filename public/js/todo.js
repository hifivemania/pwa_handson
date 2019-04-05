var TODO = 'TODO';
var DOMAIN = 'http://localhost:3000';

// オフライン時に追加/削除するTodo入れておくキュー
var queues = {add: [], delete: []};
for (var name of ['add', 'delete']) {
  var value = localStorage.getItem(name + 'Queue');
  if (value) {
    queues[name] = JSON.parse(value);
  }
}

$(function() {
  if (TODO === 'TODO') {
    alert('変数TODOを変更してください');
    return;
  }
  var todoController = {
    __name: 'TodoController',
    // テンプレートの指定
    // index.html内に記述あり
    __template: 'listTemplate',
    // Todoを入れておく変数
    __todos: [],
    
    // DOM構築、コントローラ化が終わったタイミングで呼ばれるイベント
    // Todoの初期表示を実行
    __ready: function() {
      var me = this;
      // サーバから取得
      $.ajax({
        url: DOMAIN + '/todos/' + TODO,
        type: 'GET'
      })
      .then(function(result) {
        // 結果を変数に入れておく
        me.__todos = result;
        // 表示を更新
        me.updateView();
        
        // キューを処理
        if (navigator.onLine) {
          me.executeQueue(queues);
        }
      })
    },
    // Todoの登録処理
    'button click': function(context, $el) {
      context.event.preventDefault();
      var me = this;
      // 登録するTodo
      var todo = this.$find('input#inputTodo').val();
      this.addTodo(todo)
        .then(function(result) {
          // サーバから取得したTodoを追加
          me.__todos.push(result.todo);
          // 表示を更新
          me.updateView();
          // 入力欄を消す
          me.$find('input#inputTodo').val('');
        });
    },
    // Todoを削除する処理
    '.delete click': function(context, $el) {
      var todo = $el.data('todo');
      var me = this;
      this.deleteTodo(todo)
        .then(function(result) {
          // 変数からタスクを消す
          me.__todos = me.__todos.filter(function(t) {
            return todo != t;
          });
          // 表示を更新
          me.updateView();
        })
    },
    // Todo追加、削除の実行
    executeTask: function(action, todo) {
      switch (action) {
      case 'add':
        this.addTodo(todo);
        break;
      case 'delete':
        this.deleteTodo(todo);
        break;
      }
    },
    // キューを処理する
    executeQueue: function(queues) {
      var me = this;
      for (var action of ['add', 'delete']) {
        for (var todo of queues[action]) {
          this.executeTask(action, todo);
        }
        queues[action] = [];
        localStorage.setItem(action + 'Queue', []);
      }
    },
    // 表示を更新する処理
    updateView: function() {
      var me = this;
      // 表示を更新
      this.view.update('#list', 'listTemplate', {
        todos: this.__todos
      });
      // Service Workerのキャッシュを更新します（第5章）
    },
    // Todoを追加する処理
    addTodo: function(todo) {
      return new Promise(function(res, rej) {
        // オフライン時の処理（第6章で追加）
        
        // オンライン時の処理
        // サーバに登録
        $.ajax({
          url: DOMAIN + '/todos/' + TODO,
          type: 'POST',
          data: {
            todo: todo
          }
        })
        .then(function(result) {
          res(result)
        });
      })
    },
    // Todoを削除する処理
    deleteTodo: function(todo) {
      return new Promise(function(res, rej) {
        // オフライン時
        if (!navigator.onLine) {
          queues.delete.push(todo);
          localStorage.setItem('deleteQueue', JSON.stringify(queues.delete));
          return res({todo});
        }
        // オンライン時はサーバに送信
        $.ajax({
          url: DOMAIN + '/todos/' + TODO + '/' + todo,
          type: 'DELETE'
        })
        .then(function(result) {
          return res(todo);
        })
      })
    },
    // オンライン復帰時の処理（第6章用）
    '{window} online': function(context) {
    }
  };
  h5.core.controller('.container', todoController);
});