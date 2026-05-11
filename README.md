# Radixcn

Generate shadcn/ui themes from Radix Color scales, custom palettes, fonts,
shadows, spacing, radius, charts, and semantic product tokens.

<p>
  <img alt="React" src="https://img.shields.io/badge/React-19-149eca?style=flat-square&logo=react&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-ready-3178c6?style=flat-square&logo=typescript&logoColor=white" />
  <img alt="pnpm" src="https://img.shields.io/badge/pnpm-9.15.9-f69220?style=flat-square&logo=pnpm&logoColor=white" />
</p>

## Features

- Generate shadcn theme CSS from Radix Color scales.
- Create custom palettes from a single brand color.
- Preview themes in light and dark mode.
- Configure base, primary, accent, destructive, success, warning, and info
  palettes.
- Customize radius, spacing, letter spacing, shadows, and fonts.
- Configure chart colors with Radix scales or custom colors.
- Map shadcn variables to product design tokens.
- Preview the result on dashboards, forms, cards, charts, dialogs, navigation,
  and component states.
- Copy production-ready CSS from the theme studio.

## Getting Started

Requirements:

- Node.js 20+
- pnpm 9.15.9

Install dependencies:

```bash
pnpm install
```

Run the app:

```bash
pnpm dev
```

The web app runs on [http://localhost:3000](http://localhost:3000).

Build:

```bash
pnpm build
```

Check the project:

```bash
pnpm lint
pnpm typecheck
```

## Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Run `pnpm install`.
4. Make your change.
5. Run `pnpm lint` and `pnpm typecheck`.
6. Open a pull request with a clear description and screenshots for UI changes.

Good first contribution areas:

- More theme presets.
- Better component previews.
- Additional token bridge presets.
- Accessibility checks for generated palettes.
- Documentation and examples for real design-system adoption.

## License

This repository does not include a license file yet. Add one before publishing
the project as open source so contributors and users know exactly how they can
use it.
