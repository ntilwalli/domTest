import xs from 'xstream'
import Cycle from '@cycle/xstream-run';
import {div, label, button, input, hr, ul, li, a, makeDOMDriver} from '@cycle/dom';
import {makeRouterDriver} from 'cyclic-router';
import {createHistory} from 'history';
import Immutable from 'immutable'
import switchPath from 'switch-path'

export function noop() {}
export const noopListener = {
  next: noop,
  error: noop,
  complete: noop
}

function root(sources, inputs) {

  return {
    DOM: inputs.props$.map(props => {
      return div(`.root`, [
        div([`Root`]),
        div([`Current count: ${props.count}`]),
        div([a({props: {href: `/page1`}}, [`Go to page 1`])]),
        div([a({props: {href: `/page2`}}, [`Go to page 2`])])
      ])
    }),
    change$: xs.never()
  }
}

function childIntent(sources) {
  const inc$ = sources.DOM.select(`.inc`).events(`click`).mapTo(1)
  const dec$ = sources.DOM.select(`.dec`).events(`click`).mapTo(-1)

  return {
    change$: xs.merge(inc$, dec$)
  }
}

function child(sources, inputs) {
  const actions = childIntent(sources)

  return {
    DOM: inputs.props$.map(props => inputs.parentState$.map(state => div(`.child`, [
      div([`${props.title}`]),
      div([`Current count: ${state.count}`]),
      button(`.inc`, [`+`]),
      button(`.dec`, [`-`]),
      div([a({props: {href: `/`}}, [`Back to root`])])
    ]))).flatten(),
    change$: actions.change$
  }
}

function reducers(actions, inputs) {
  const changeReducer$ = inputs.change$.map(val => state => {
    return state.update(`count`, count => count + val)
  })

  return xs.merge(changeReducer$)
}

function model(actions, inputs) {
  const reducer$ = reducers(actions, inputs)

  return reducer$
    .fold((acc, reducer) => reducer(acc), Immutable.Map({
      count: 0
    }))
    .map(x => x.toObject())
    .debug()
    .remember()
}

function main(sources) {

  const change$ = xs.create()
  const state$ = model({}, {change$})

  const routes = {
    '/': () => root(sources, {props$: state$}),
    '/page1': () => child(sources, {props$: xs.of({title: `Page 1`}), parentState$: state$}),
    '/page2': () => child(sources, {props$: xs.of({title: `Page 2`}), parentState$: state$})
  }

  const component$ = sources.Router.define(routes)
      .debug(`from router...`)
      .map(route => route.value)
      .map(value => {
        return value()
      })
      .remember()

  change$.imitate(component$.map(x => x.change$).flatten())

	return {
		DOM: component$
			.map(x => x.DOM)
			.flatten(),
    Router: xs.never()
	}
}

const drivers = {
	DOM: makeDOMDriver('#app'),
	Router: makeRouterDriver(createHistory(), switchPath, {capture: true}),
};

Cycle.run(main, drivers);
