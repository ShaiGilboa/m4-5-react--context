# Workshop: Cookie Clicker REMIX

In the last workshop, we built a Cookie Clicker game. Today we'll be updating it.

One of the hardest parts of being a developer is dealing with changing requirements. Often you'll have built a wonderful, functional app, and then a product manager will say "actually, we want to move this bit of functionality to _after_ the signup flow", and implementing that change can be challenging.

In this workshop, several new requirements have been added!

This workshop also introduces **React context**. This part of the problem takes the shape of a more typical guided workshop, but it comes afterwards.

### Starting point

For your convenience, an initial version of the last workshop's base solution is provided. If you'd prefer, you can definitely keep working on your version though!

## Exercise 1: Fulfill new requirements

The product manager comes to your desk, and tells you that there are two new requirements:

1. When you navigate away from the game, all "progress" (cookie count) is lost. You always get reset back to 1000. Instead, we should keep the game running even when not on the game screen! You should still be collecting additional cookies when on the homepage, and the total should never be lost as you move between routes.

2. Similarly: if you close and reopen the tab, you shouldn't be reset to 1000 cookies! We want to ensure that the progress is saved and restored.

This exercuse is left as an exercise. The main goal of this exercise is to **create connections in your brain**, to deepen your understanding of React, and the best way to do that is to puzzle it out.

(That said, if you're stuck for 15+ minutes, please do ask for help!)

#### Hints

- For lifting state up, you'll want to pull all the state up into `App`, and then pass it down via props.
- The list of `items` can be pulled into a `data.js` file, and imported in both `App` and `Game`.
- For persisting across closing and reopening the tab, you can use the localStorage API. You can create a `usePersistedState` hook, which works exactly the same as the `React.useState` hook, but which also stores the value in localStorage on every update, and reads the initial value from localStorage. It should be used like this:

```js
const [numCookies, setNumCookies] = usePersistedState(1000, "num-cookies");
```

(That second parameter is the name, to be used as a local storage key)

## Exercise 2: Using React Context

As our app is getting a little bigger now, we're starting to feel the pain that comes along with lifting state up and "prop drilling".

Let's add a new context component, so that we can make our lives a bit nicer.

Create a new file in `src/components` called `GameContext.js`. Inside that file, create and export a new Context:

```js
export const GameContext = React.createContext(null);
```

We will also want to create a provider component, and export it:

```js
export const GameProvider = ({ children }) => {
  return <GameContext.Provider value={{}}>{children}</GameContext.Provider>;
};
```

This is all the "structure" we need, although right now our context isn't very useful, since it doesn't hold any of the state!

Our app has two pieces of state:

1. The number of cookies collected, `numCookies`
2. The items that the user has purchased, `purchasedItems`

We want to move this state into this new context component, and expose their values through context. Take a moment and try to update this, so that the `value` prop in `GameContext.Provider` makes available everything the rest of the app will need.

.

..

...

....

.....

......

.......

......

.....

....

...

..

.

Your `GameProvider` component should look something like this:

```jsx
export const GameProvider = ({ children }) => {
  const [numCookies, setNumCookies] = usePersistedState("numCookies", 1000);

  const [purchasedItems, setPurchasedItems] = usePersistedState(
    "purchasedItems",
    {
      cursor: 0,
      grandma: 0,
      farm: 0
    }
  );

  const calculateCookiesPerSecond = purchasedItems => {
    /* logic */
  };

  return (
    <GameContext.Provider
      value={{
        numCookies,
        setNumCookies,
        purchasedItems,
        setPurchasedItems,
        cookiesPerSecond: calculateCookiesPerSecond(purchasedItems)
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
```

It's important to note that this is the house for _all things related to game state_:

- The state itself, `numCookies` and `purchasedItems`
- The setter functions, `setNumCookies` and `setPurchasedItems`
- Additional helpers like `cookiesPerSecond`.

That said, it _doesn't_ include the interval that grants the user cookies every second. This will remain in `App`, since that loop actually _does something_ with the state.

#### Consuming context

Next, we need to use this context in our app.

We'll see how to consume it to power our interval that grants the user cookies every second. You probably have something like this in your `App.js`:

```js
useInterval(() => {
  const numOfGeneratedCookies = calculateCookiesPerTick(purchasedItems);
  setNumCookies(numCookies + numOfGeneratedCookies);
}, 1000);
```

We'll import the GameContext, pluck out the relevant data, and update the interval. Give this a shot first!

.

..

...

....

.....

......

.......

......

.....

....

...

..

.

```jsx
import { GameContext } from "./GameContext";

function App(props) {
  const { numCookies, setNumCookies, cookiesPerSecond } = React.useContext(
    GameContext
  );

  useInterval(() => {
    setNumCookies(numCookies + cookiesPerSecond);
  }, 1000);

  return (
    <>
      <GlobalStyles />
      <Router>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/game">
          <Game />
        </Route>
      </Router>
    </>
  );
}
```

You'll notice that we've **removed all props** from the `<Game />` element. Your next job is to update `Game` to pull all the data and setters it needs from `GameContext`, same as we did here in `App`. This is left up to you as an exercise.

---

# Stretch goals

### Finish up the last stretch goals!

Last workshop included many stretch goals. Start by tackling them!

### Calculaing cookies earned while away

Let's say the user earns 100 cookies per second, and has 500 cookies. They close their tab, and reopen it in 10 seconds. Instead of restoring their cookie total to 500, it should initialize with 1500 cookies; the user should still earn their cookies-per-second while not using the app

HINT: It is impossible to run JS while the browser tab is closed. Instead, you'll need to do all the calculations when the application loads.

### More refactoring!

Pick a previous workshop, and use what you've learned to apply some of these best practices.
