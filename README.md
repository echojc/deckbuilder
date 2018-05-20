# deckbuilder

Basic MTG deck builder from a specific pool of cards. Useful for limited formats.

See it in action at https://deckbuilder.echo.sh

## dev dependencies

* [yarn](https://github.com/yarnpkg/yarn) (required)
* [entr](https://bitbucket.org/eradman/entr) (optional, types)
* git (optional, build/publish)

## setup

To set up initially for development, run

```
$ yarn
```

## developing

```
$ yarn start
```

runs the build process and hot reloads automatically where possible on save.

### types

```
$ yarn types
```

watches for file changes and reruns `flow`. Alternatively, manually run

```
$ yarn flow
```

## building

Use

```
$ yarn build
```

to generate the changelog and build a production bundle.

## publishing

The project is deployed on GitHub pages.

```
$ yarn pub
```

will push the build folder to the `gh-pages` branch.
