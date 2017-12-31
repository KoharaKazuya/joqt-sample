const { createStore } = require('joqt');

(async () => {
  const store = await createStore([
    {
      type: 'init',
      paths: [''],
      reducer: () => ({
        todos: [],
        light: true
      })
    },
    {
      type: 'ADD_TODO',
      paths: ['todos'],
      reducer: ({ todos }, message) => ({ todos: todos.concat([message]) })
    },
    {
      type: 'CLEAR_TODOS',
      paths: ['todos'],
      reducer: async function*({ todos }) {
        while (true) {
          await new Promise(r => setTimeout(r, 1000));
          todos.shift();
          if (todos.length === 0) break;
          yield { todos };
        }
        return { todos };
      }
    },
    {
      type: 'TOGGLE_LIGHT',
      paths: ['light'],
      reducer: ({ light }) => ({ light: !light })
    }
  ]);
  store.subscribe(() => render(store.getState()));
  store.subscribe(() => console.log(store.getState()));

  bind({
    add: message =>
      store.dispatch({
        type: 'ADD_TODO',
        payload: new Date() + ': ' + message
      }),
    clear: () =>
      store.dispatch({
        type: 'CLEAR_TODOS'
      }),
    toggleLight: () =>
      store.dispatch({
        type: 'TOGGLE_LIGHT'
      })
  });
})();

function render(state) {
  const view = document.querySelector('#view');

  while (view.firstChild) {
    view.removeChild(view.firstChild);
  }

  const ul = document.createElement('ul');
  for (const todo of state.todos) {
    const li = document.createElement('li');
    li.textContent = todo;
    ul.appendChild(li);
  }
  view.appendChild(ul);

  document.querySelector('html').style.backgroundColor = state.light
    ? 'white'
    : 'gray';
}

function bind(actions) {
  {
    const button = document.querySelector('[data-add]');
    const input = document.querySelector('input');
    button.addEventListener('click', () => actions.add(input.value));
  }
  {
    const button = document.querySelector('[data-clear]');
    button.addEventListener('click', () => actions.clear());
  }
  {
    const button = document.querySelector('[data-light]');
    button.addEventListener('click', () => actions.toggleLight());
  }
}
