import { useEffect } from 'react';
import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { DocumentProvider } from '../context/DocumentContext.tsx';
import { ThemeProvider, useTheme } from '../context/Theme Context.tsx';

type RenderWithProvidersOptions = Omit<RenderOptions, 'wrapper'> & {
	route?: string;
	theme?: 'light' | 'dark';
};

export function renderWithProviders(
	ui: ReactElement,
	{ route = '/', theme, ...renderOptions }: RenderWithProvidersOptions = {}
) {
	const Providers = ({ children }: { children: ReactNode }) => {
		const ThemeOverride = () => {
			const { setTheme } = useTheme();

			useEffect(() => {
				if (theme) setTheme(theme);
			}, [setTheme, theme]);

			return null;
		};

		return (
			<MemoryRouter initialEntries={[route]}>
				<ThemeProvider>
					<DocumentProvider>
						<ThemeOverride />
						{children}
					</DocumentProvider>
				</ThemeProvider>
			</MemoryRouter>
		);
	};

	return render(ui, { ...renderOptions, wrapper: Providers });
}
