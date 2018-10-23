import {run} from '@cycle/rxjs-run'
import {Observable as O, of, from, merge, combineLatest, concat, never} from 'rxjs'
import {map, startWith, delay, tap, debounceTime, take, filter, catchError, switchMap} from 'rxjs/operators'
import {makeDOMDriver, div, ul, li} from '@cycle/dom'
function Grid(sources) {
  const mouseenter$ = sources.DOM.select('.appResult').events('mouseenter')
  return {
    DOM: mouseenter$.pipe(
      map((x: any) => x.target.item),
      startWith(undefined),
      map(ev => {
        return div([
          ev,
          ul([
            
            li('.appResult', {props: {item: 1}, style: {height: '100px'}}, [
              'A'
            ]),
            li('.appResult', {props: {item: 2}, style: {height: '100px'}}, [
              'B'
            ])
          ])
        ])
      })
    )
  }
}

function main(sources) {
  console.log('hello')
  const grid = Grid(sources)

  return {
    DOM: grid.DOM
  }
}


run(
  main, {
  DOM: makeDOMDriver(`#app-main`)
})
