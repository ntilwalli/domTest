# domTest

Demonstrates CycleJS bug in v22 of DOM driver where `mouseenter` event is attached to only the first list element, when it should be attached to both.  `master` branch is same as `v22` branch. To toggle to same repo using v20 of drom driver switch to the `v20` branch where the `mouseenter` event works properly.

### Run locally (assumes Babel 6):
1. `npm install -g live-server watchify`
2. `npm install`
3. `npm run build`
4. `npm run serve`
5. Open browser at http://localhost:8080
