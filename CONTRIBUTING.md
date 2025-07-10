# Contributing to Portfolio Website

Thank you for your interest in contributing! This project is a personal portfolio, but contributions for improvements, bug fixes, and feature enhancements are welcome.

## Development Setup

1. Fork the repository
2. Clone your fork: `git clone <your-fork-url>`
3. Install dependencies: `npm install`
4. Copy environment variables: `cp .env.example .env.local`
5. Set up your database and configure environment variables
6. Run database migrations: `npx prisma db push`
7. Start development server: `npm run dev`

## Making Changes

1. Create a new branch: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Test thoroughly
4. Commit with clear messages: `git commit -m "feat: add new feature"`
5. Push to your fork: `git push origin feature/your-feature-name`
6. Create a Pull Request

## Code Standards

- **TypeScript**: All code should be properly typed
- **ESLint**: Follow the existing linting rules
- **Prettier**: Code formatting is enforced
- **Components**: Use functional components with hooks
- **Styling**: Use Tailwind CSS classes, avoid custom CSS when possible

## Areas for Contribution

- 🐛 **Bug Fixes**: Report and fix bugs
- 🎨 **UI/UX Improvements**: Enhance design and user experience
- ⚡ **Performance**: Optimize loading times and bundle size
- 📱 **Mobile Experience**: Improve responsive design
- ♿ **Accessibility**: Add ARIA labels, keyboard navigation
- 🧪 **Testing**: Add unit and integration tests
- 📖 **Documentation**: Improve README and code comments

## Pull Request Guidelines

- Include a clear description of changes
- Reference any related issues
- Add screenshots for UI changes
- Ensure all tests pass
- Update documentation if needed

## Questions?

Feel free to open an issue for questions or discussions about potential contributions.
