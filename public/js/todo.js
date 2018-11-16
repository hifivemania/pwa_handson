var TODO = 'TODO';
$(function() {
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
        url: '/todos/' + TODO,
        type: 'GET'
      })
      .then(function(result) {
        // 結果を変数に入れておく
        me.__todos = result;
        // 表示処理
        me.view.append('#list', 'listTemplate', {
          todos: me.__todos
        });
      })
    },
    
    // Todoの登録処理
    'button click': function(context, $el) {
      context.event.preventDefault();
      var me = this;
      // 登録するTodo
      var todo = this.$find('input#inputTodo').val();
      // サーバに登録
      $.ajax({
        url: '/todos/' + TODO,
        type: 'POST',
        data: {
          todo: todo
        }
      })
      .then(function(result) {
        // サーバから取得したTodoを追加
        me.__todos.push(result.todo);
        // 表示を更新
        me.view.update('#list', 'listTemplate', {
          todos: me.__todos
        });
        // 入力欄を消す
        me.$find('input#inputTodo').val('');
      })
    },
    // Todoを削除する処理
    '.delete click': function(context, $el) {
      var todo = $el.data('todo');
      var me = this;
      // サーバに送信
      $.ajax({
        url: '/todos/' + TODO + '/' + todo,
        type: 'DELETE'
      })
      .then(function(result) {
        // 変数からタスクを消す
        me.__todos = me.__todos.filter(function(t) {
          return todo != t;
        });
        // 表示を更新
        me.view.update('#list', 'listTemplate', {
          todos: me.__todos
        });
      })
    }
  };
  h5.core.controller('.container', todoController);
});