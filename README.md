# kazu

To install dependencies:

```bash
bun install
```

To test run:

```bash
bun run ./src/index.tsx
```

To build:

```bash
bun run build:node
```
### OR
```bash
bun run build:bun
```

To run: 
### Run this only once initially:  `bun run pre-run`
```bash
bun run run:bun
```
### OR
```bash
bun run run:node
```


## Known bugs: 
### 1. If the active directory selector index is a node_modules folder it lists all the directories in the node_modules. Refer to this video:
<video src="bugs/2025-01-23 17-01-31.mp4" controls style="width: 720px;"></video>

### 2. Does not work if compiled using --compile flag when using bun. Refer to this [Github Issues](https://github.com/oven-sh/bun/issues/13405).
