# NYC Urban Heat Map

## Setup

```bash
npm install
npm run dev
```

## Signal-based State Management

We utilize [signals](https://preactjs.com/blog/introducing-signals/) for efficient state management across components.

### Key Concepts

1. **Accessing state**: Use `STATE_VAR.value`
2. **Setting state**: Assign with `STATE_VAR.value = ...`
3. **Reacting to changes**: Use `effect(() => { ... })` to perform actions when a signal changes

## Important Signals

| Signal Name | Location | Description |
|-------------|----------|-------------|
| `map` | MapPage.tsx | `mapboxgl.Map` object for managing sources and layers |
| `selectedDataset` | MapPage.tsx | Currently selected dataset |
| `profileSettings` | MapPage.tsx | Settings and data for the profile |
| `isProfileExpanded` | MapPage.tsx | Boolean indicating if the profile should be shown |

### Datasets (./utils/datasets.ts)

A dataset object contains many attributes:

1. **Views**:
   - An array of `View` objects
   - Each `View` contains:
     - `name`: Identifier for the view
     - `init`: Function that sets up sources and layers
       - Returns a cleanup function to remove sources and layers when no longer needed

2. **CurrentView**:
   - String referencing the currently selected view for the dataset
