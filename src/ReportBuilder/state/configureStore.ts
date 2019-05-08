import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { rootReducer } from './reducer';
import { rootSaga } from './saga';

export const configureStore = () => {
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [sagaMiddleware];

  const enhancers = [
    applyMiddleware(...middlewares),
  ];

  const store = createStore(
    rootReducer,
    compose(...enhancers),
  );

  sagaMiddleware.run(rootSaga);

  return store;
};
